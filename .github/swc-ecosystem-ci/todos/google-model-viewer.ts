import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "google/model-viewer",
    branch: "master",
    build: "build",
    test: "test:ci",
  });
}
