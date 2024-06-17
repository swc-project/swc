import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "egoist/tsup",
    branch: "dev",
    build: "build",
    test: "test-only",
  });
}
