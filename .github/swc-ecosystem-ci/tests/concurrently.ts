import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "open-cli-tools/concurrently",
    branch: "main",
    build: "build",
    test: "test",
  });
}
