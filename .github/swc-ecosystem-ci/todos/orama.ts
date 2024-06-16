import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "oramasearch/orama",
    branch: "main",
    build: "build",
    test: "test",
  });
}
