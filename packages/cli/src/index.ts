import { Command } from "commander";
import { find } from "./commands/find.js";
import { list } from "./commands/list.js";
import { checkForUpdates } from "./update.js";

const VERSION = "0.0.1";

const program = new Command();

program
  .name("cvx")
  .description("A terminal-native Convex component catalog")
  .version(VERSION, "-v, --version", "output the version number")
  .addOption(new Command().createOption("-V", "output the version number"))
  .on("option:V", () => {
    console.log(VERSION);
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
