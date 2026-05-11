import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
crons.interval("sync-components", { hours: 24 }, internal.syncComponents.run);
export default crons;
