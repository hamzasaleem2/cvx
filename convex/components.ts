import { v } from "convex/values";
import { internalQuery, internalMutation, query } from "./_generated/server";

export const getBySlug = internalQuery({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db.query("components").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
  },
});

export const allSlugs = internalQuery({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("components").take(500);
    return docs.map((d) => d.slug);
  },
});

export const deleteBySlug = internalMutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const doc = await ctx.db.query("components").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
    if (doc) await ctx.db.delete(doc._id);
  },
});

export const insert = internalMutation({
  args: {
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    npmPackage: v.string(),
    repoUrl: v.optional(v.string()),
    installSnippet: v.string(),
    weeklyDownloads: v.optional(v.number()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("components", args);
  },
});

export const update = internalMutation({
  args: {
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    npmPackage: v.string(),
    repoUrl: v.optional(v.string()),
    installSnippet: v.string(),
    weeklyDownloads: v.optional(v.number()),
    updatedAt: v.number(),
  },
  handler: async (ctx, { slug, ...rest }) => {
    const existing = await ctx.db.query("components").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
    if (!existing) return;
    await ctx.db.patch(existing._id, rest);
  },
});

export const search = query({
  args: { query: v.string(), category: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, { query: q, category, limit }) => {
    const max = limit ?? 10;

    const nameQuery = ctx.db.query("components").withSearchIndex("search_name", (s) => {
      const base = s.search("name", q);
      return category ? base.eq("category", category) : base;
    });

    const descQuery = ctx.db.query("components").withSearchIndex("search_desc", (s) => {
      const base = s.search("description", q);
      return category ? base.eq("category", category) : base;
    });

    const byName = await nameQuery.take(max);
    const byDesc = await descQuery.take(max);

    const seen = new Set<string>();
    const merged: typeof byName = [];
    for (const c of [...byName, ...byDesc]) {
      if (seen.has(c.slug)) continue;
      seen.add(c.slug);
      merged.push(c);
    }

    return merged.slice(0, max);
  },
});

export const listAll = query({
  args: { category: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, { category, limit }) => {
    if (category) {
      return await ctx.db.query("components").withIndex("by_category", (q) => q.eq("category", category)).take(limit ?? 50);
    }
    return await ctx.db.query("components").take(limit ?? 200);
  },
});

export const getComponent = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db.query("components").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
  },
});

export const nextWithoutDownloads = internalQuery({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("components").take(200);
    for (const doc of docs) {
      if (doc.weeklyDownloads == null) return doc.npmPackage;
    }
    return null;
  },
});

export const setDownloads = internalMutation({
  args: { npmPackage: v.string(), weeklyDownloads: v.number() },
  handler: async (ctx, { npmPackage, weeklyDownloads }) => {
    const docs = await ctx.db.query("components").take(200);
    const doc = docs.find((d) => d.npmPackage === npmPackage);
    if (doc) {
      await ctx.db.patch(doc._id, { weeklyDownloads, updatedAt: Date.now() });
    }
  },
});
