import { runInRepo } from "../utils.js";
import type { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "swc-project/plugins",
    branch: "main",
    build: "prepack",
    test: "test",
    isWasm: true,
  });
}
