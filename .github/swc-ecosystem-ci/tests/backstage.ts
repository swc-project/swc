import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "backstage/backstage",
    branch: "master",
    build: ["tsc:full", "build:all"],
    test: "test",
  });
}
