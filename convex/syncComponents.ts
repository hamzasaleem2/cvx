import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { fetchAndParse } from "./lib/parser";

export const run = internalAction(async (ctx) => {
  const components = await fetchAndParse();
  const now = Date.now();
  const current = new Set(components.map((c) => c.slug));

  for (const c of components) {
    const existing = await ctx.runQuery(internal.components.getBySlug, { slug: c.slug });
    if (!existing) {
      await ctx.runMutation(internal.components.insert, { ...c, updatedAt: now });
    } else {
      await ctx.runMutation(internal.components.update, { ...c, updatedAt: now });
    }
  }

  const existing = await ctx.runQuery(internal.components.allSlugs);
  for (const slug of existing) {
    if (!current.has(slug)) {
      await ctx.runMutation(internal.components.deleteBySlug, { slug });
    }
  }

  await ctx.scheduler.runAfter(0, internal.syncComponents.enrichDownloads);
});

export const enrichDownloads = internalAction(async (ctx) => {
  const pkg = await ctx.runQuery(internal.components.nextWithoutDownloads);
  if (!pkg) return;

  try {
    const encoded = pkg.replace("/", "%2F");
    const res = await fetch(`https://api.npmjs.org/downloads/point/last-week/${encoded}`);
    if (res.ok) {
      const data = await res.json();
      await ctx.runMutation(internal.components.setDownloads, {
        npmPackage: pkg,
        weeklyDownloads: data.downloads as number,
      });
    }
  } catch {
    // skip, try next time
  }

  await ctx.scheduler.runAfter(5000, internal.syncComponents.enrichDownloads);
});
