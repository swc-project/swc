import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "dai-shi/waku",
    branch: "main",
    build: "compile",
    test: "e2e",
    beforeTest: "pnpm exec playwright install",
  });
}
