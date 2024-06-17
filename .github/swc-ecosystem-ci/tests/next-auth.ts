import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "nextauthjs/next-auth",
    branch: "main",
    build: "build",
    test: "test",
    shallow: false,
    commit: "6e1649d13f4d516e5adcb6e3b30541d6c61eaa31",
  });
}
