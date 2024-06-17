import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "lingui/js-lingui",
    branch: "main",
    test: "test:ci",
  });
}
