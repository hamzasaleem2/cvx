import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/api/search",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const q = url.searchParams.get("q");
    const category = url.searchParams.get("category") || undefined;
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (!q) {
      return new Response(JSON.stringify({ error: "q parameter required" }), {
        status: 400,
      });
    }

    const results = await ctx.runQuery(api.components.search, {
      query: q,
      category,
      limit,
    });

    return new Response(JSON.stringify(results), {
      headers: { "content-type": "application/json" },
    });
  }),
});

http.route({
  path: "/api/list",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || undefined;
    const limit = parseInt(url.searchParams.get("limit") || "200");
    const results = await ctx.runQuery(api.components.listAll, { category, limit });
    return new Response(JSON.stringify(results), {
      headers: { "content-type": "application/json" },
    });
  }),
});

http.route({
  path: "/api/component",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const slug = new URL(req.url).searchParams.get("slug");
    if (!slug) {
      return new Response(JSON.stringify({ error: "slug parameter required" }), {
        status: 400,
      });
    }

    const component = await ctx.runQuery(api.components.getComponent, { slug });
    return new Response(JSON.stringify(component), {
      headers: { "content-type": "application/json" },
    });
  }),
});

export default http;
