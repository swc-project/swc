import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "palantir/blueprint",
    branch: "develop",
    build: "compile",
    test: "test",
    nodeVerison: "20",
  });
}
