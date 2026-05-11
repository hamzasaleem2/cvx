const COMPONENTS_URL = "https://www.convex.dev/components/components.md";

export interface ParsedComponent {
  slug: string;
  name: string;
  description: string;
  category: string;
  npmPackage: string;
  repoUrl?: string;
  installSnippet: string;
}

export async function fetchAndParse(): Promise<ParsedComponent[]> {
  const res = await fetch(COMPONENTS_URL);
  if (!res.ok) throw new Error(`Failed to fetch components: ${res.status}`);
  const md = await res.text();
  return parseMarkdown(md);
}

function parseMarkdown(md: string): ParsedComponent[] {
  const components: ParsedComponent[] = [];
  const categoryBlocks = md.split(/^## /m).slice(1);

  for (const catBlock of categoryBlocks) {
    const catLines = catBlock.trim().split("\n");
    const category = catLines[0].trim();

    const compBlocks = catBlock.split(/^### /m).slice(1);
    for (const compBlock of compBlocks) {
      const lines = compBlock.trim().split("\n");
      const firstLine = lines[0].trim();
      const nameMatch = firstLine.match(/^\[(.+?)\]/);
      if (!nameMatch) continue;

      const name = nameMatch[1];

      let description = "";
      let npmPackage = name;
      let repoUrl: string | undefined;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line.startsWith("- Install:")) {
          const npmMatch = line.match(/`npm install (.+?)`/);
          if (npmMatch) npmPackage = npmMatch[1];
        } else if (line.startsWith("- [GitHub]") || line.startsWith("| [GitHub]")) {
          const urlMatch = line.match(/\]\((.+?)\)/);
          if (urlMatch) repoUrl = urlMatch[1];
        } else if (!line.startsWith("-") && !description) {
          description = line;
        }
      }

      const slug = slugFromPackage(npmPackage);
      const varName = toCamel(npmPackage);
      const installSnippet =
        `import { defineApp } from "convex/server";\n` +
        `import ${varName} from "${npmPackage}/convex.config.js";\n\n` +
        `const app = defineApp();\n` +
        `app.use(${varName});\n\n` +
        `export default app;`;

      components.push({ slug, name, description, category, npmPackage, repoUrl, installSnippet });
    }
  }

  return components;
}

function slugFromPackage(pkg: string): string {
  return pkg
    .replace(/^@/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toCamel(s: string): string {
  const last = s.replace(/^@/, "").split("/").pop() || s;
  return last.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
