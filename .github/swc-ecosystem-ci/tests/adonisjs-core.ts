import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "adonisjs/core",
    branch: "develop",
    build: "build",
    test: "test",
    nodeVerison: "20",
  });
}
