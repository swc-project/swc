import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "lingui/js-lingui",
    branch: "main",
    test: "test:ci",
  });
}
