import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "open-cli-tools/concurrently",
    branch: "main",
    build: "build",
    test: "test",
  });
}
