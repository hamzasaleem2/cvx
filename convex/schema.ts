import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  components: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    npmPackage: v.string(),
    repoUrl: v.optional(v.string()),
    installSnippet: v.string(),
    weeklyDownloads: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["category"],
    })
    .searchIndex("search_desc", {
      searchField: "description",
      filterFields: ["category"],
    }),
});
