import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "UnblockNeteaseMusic/server",
    branch: "enhanced",
    build: "build",
    test: "test",
  });
}
