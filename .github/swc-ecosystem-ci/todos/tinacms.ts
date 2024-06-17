import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "tinacms/tinacms",
    branch: "main",
    build: "build",
    test: "test:e2e",
  });
}
