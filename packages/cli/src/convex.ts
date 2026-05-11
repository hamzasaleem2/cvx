import "dotenv/config";

const DEFAULT_URL = "https://brave-duck-959.convex.site";

const url = process.env.CONVEX_SITE_URL || DEFAULT_URL;
if (!url) {
  console.error("CONVEX_SITE_URL is not set.");
  process.exit(1);
}

export const CONVEX_URL = url;
