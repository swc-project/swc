import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "jprichardson/node-fs-extra",
    branch: "master",
    build: [],
    test: ["unit", "unit-esm"],
  });
}
