import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));

const CURRENT = pkg.version as string;
const PACKAGE = pkg.name as string;
let checked = false;

export function checkForUpdates() {
  if (checked) return;
  checked = true;
  const url = `https://registry.npmjs.org/${PACKAGE}/latest`;
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      if (data.version && data.version !== CURRENT) {
        console.log(`\nUpdate available: ${CURRENT} → ${data.version}`);
        console.log(`Run: npm install -g ${PACKAGE}@latest\n`);
      }
    })
    .catch(() => {});
}
