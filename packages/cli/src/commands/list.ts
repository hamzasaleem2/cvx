import { CONVEX_URL } from "../convex.js";
import chalk from "chalk";
import type { Component } from "../types.js";

export async function list(options: { category?: string; json?: boolean }) {
  const params = new URLSearchParams();
  if (options.category) params.set("category", options.category);

  let results: Component[];
  try {
    const res = await fetch(`${CONVEX_URL}/api/list?${params}`);
    results = await res.json() as Component[];
  } catch {
    console.log(chalk.red("Could not reach the component registry. Check your connection."));
    return;
  }

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  if (results.length === 0) {
    console.log(chalk.dim("No components found."));
    return;
  }

  const grouped = new Map<string, Component[]>();
  for (const c of results) {
    const list = grouped.get(c.category) || [];
    list.push(c);
    grouped.set(c.category, list);
  }

  const sorted = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b));

  for (const [category, comps] of sorted) {
    console.log(`\n${chalk.bold(category)} ${chalk.dim(`(${comps.length})`)}`);
    for (const c of comps) {
      console.log(`  ${chalk.cyan(c.name.padEnd(38))} ${chalk.dim(c.slug)}`);
    }
  }

  console.log(`\n${chalk.dim(`${results.length} components total`)}\n`);
}
