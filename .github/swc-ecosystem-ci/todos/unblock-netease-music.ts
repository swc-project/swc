import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "UnblockNeteaseMusic/server",
    branch: "enhanced",
    build: "build",
    test: "test",
  });
}
