import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "backstage/backstage",
    branch: "master",
    build: ["tsc:full", "build:all"],
    test: "test",
  });
}
