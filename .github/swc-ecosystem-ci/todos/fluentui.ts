import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "microsoft/fluentui",
    branch: "master",
    build: "build",
    test: ["test"],
    agent: "yarn@berry",
    nodeVerison: "16",
  });
}
