import { CONVEX_URL } from "../convex.js";
import chalk from "chalk";
import { search } from "@inquirer/prompts";
import type { Component } from "../types.js";

export async function find(slug: string | undefined) {
  let c: Component | undefined;

  try {
    if (slug) {
      const res = await fetch(`${CONVEX_URL}/api/component?slug=${encodeURIComponent(slug)}`);
      c = await res.json();
      if (!c) {
        console.log(chalk.dim(`"${slug}" not found.`));
        return;
      }
    } else {
      const res = await fetch(`${CONVEX_URL}/api/list`);
      const all = await res.json() as any[];

      c = await search({
        message: "Find a component",
        source: (input) => {
          if (!input) return all.map((c) => ({ name: c.name, value: c, description: c.category }));
          const term = input.toLowerCase();
          return all
            .filter((c) => c.name.toLowerCase().includes(term) || c.category.toLowerCase().includes(term))
            .map((c) => ({ name: c.name, value: c, description: c.category }));
        },
      }).catch(() => undefined);

      if (!c) return;
    }
  } catch {
    console.log(chalk.red("Could not reach the component registry. Check your connection."));
    return;
  }

  const author = c.npmPackage.startsWith("@") ? c.npmPackage.split("/")[0] : null;

  console.log(`\n${chalk.bold.cyan(c.name)}  ${chalk.dim(c.category)}`);
  if (author) console.log(chalk.dim(`by ${author}`));
  if (c.weeklyDownloads) console.log(chalk.dim(`${c.weeklyDownloads.toLocaleString()} downloads/week`));
  console.log(`\n${c.description}`);
  console.log();
  console.log(chalk.dim("Install:"));
  console.log(`  ${chalk.green(`npm install ${c.npmPackage}`)}`);
  console.log();
  console.log(chalk.dim("Add to convex/convex.config.ts:"));
  console.log(chalk.green(c.installSnippet));
  console.log();
}
