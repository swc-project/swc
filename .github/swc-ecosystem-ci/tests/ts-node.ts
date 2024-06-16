import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "TypeStrong/ts-node",
    branch: "main",
    build: "build",
    test: "test ^ci-node-and-ts-versions",
  });
}
