import { CONVEX_URL } from "../convex.js";

const SEARCH_TOOL = {
  name: "search_components",
  description:
    "Search the Convex component catalog. Returns matching components with names, categories, descriptions, npm packages, and install instructions. Use this when you need to find a Convex component for a specific task.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query, e.g. 'auth', 'payments', 'storage'",
      },
    },
    required: ["query"],
  },
};

const GET_COMPONENT_TOOL = {
  name: "get_component",
  description:
    "Get detailed information about a specific Convex component by its slug. Includes description, author, download count, repo URL, and install instructions.",
  inputSchema: {
    type: "object",
    properties: {
      slug: {
        type: "string",
        description: "Component slug, e.g. 'convex-dev-better-auth'",
      },
    },
    required: ["slug"],
  },
};

const GET_INSTALL_TOOL = {
  name: "get_install",
  description:
    "Get the exact npm install command and convex.config.ts snippet for a Convex component. Use this when the user is ready to install a component.",
  inputSchema: {
    type: "object",
    properties: {
      slug: {
        type: "string",
        description: "Component slug, e.g. 'convex-dev-better-auth'",
      },
    },
    required: ["slug"],
  },
};

export function listTools() {
  return {
    tools: [SEARCH_TOOL, GET_COMPONENT_TOOL, GET_INSTALL_TOOL],
  };
}

export async function callTool(
  name: string,
  args: Record<string, unknown>,
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case "search_components": {
      const query = args.query as string;
      const res = await fetch(`${CONVEX_URL}/api/search?q=${encodeURIComponent(query)}&limit=10`);
      const results = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    }
    case "get_component": {
      const slug = args.slug as string;
      const res = await fetch(`${CONVEX_URL}/api/component?slug=${encodeURIComponent(slug)}`);
      const c = await res.json();
      return {
        content: [{ type: "text", text: c ? JSON.stringify(c, null, 2) : `Component "${slug}" not found.` }],
      };
    }
    case "get_install": {
      const slug = args.slug as string;
      const res = await fetch(`${CONVEX_URL}/api/component?slug=${encodeURIComponent(slug)}`);
      const c = await res.json();
      if (!c) {
        return {
          content: [{ type: "text", text: `Component "${slug}" not found.` }],
        };
      }
      const text = `npm install ${c.npmPackage}\n\n${c.installSnippet}`;
      return {
        content: [{ type: "text", text }],
      };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
