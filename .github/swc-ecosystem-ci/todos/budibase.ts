import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "Budibase/budibase",
    branch: "master",
    build: "build",
    test: "test",
    nodeVerison: "20",
  });
}
