import { Command } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { find } from "./commands/find.js";
import { list } from "./commands/list.js";
import { checkForUpdates } from "./update.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));

const program = new Command();

program
  .name("cvx")
  .description("A terminal-native Convex component catalog")
  .version(version, "-v, --version", "output the version number")
  .addOption(new Command().createOption("-V", "output the version number"))
  .on("option:V", () => {
    console.log(version);
    process.exit(0);
  })
  .arguments("[slug]")
  .action(find)
  .exitOverride();

program
  .command("list")
  .description("List all Convex components")
  .option("-c, --category <category>", "Filter by category")
  .option("--json", "Output as JSON")
  .action(list);

checkForUpdates();

try {
  program.parse();
} catch (err: any) {
  const code = err?.code;
  if (code === "commander.version" || code === "commander.help" || code === "commander.helpDisplayed") {
    process.exit(0);
  }
  program.outputHelp();
  process.exit(0);
}
