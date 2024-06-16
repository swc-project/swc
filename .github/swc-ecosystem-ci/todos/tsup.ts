import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "egoist/tsup",
    branch: "dev",
    build: "build",
    test: "test-only",
  });
}
