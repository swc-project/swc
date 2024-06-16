import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "dotansimha/graphql-yoga",
    branch: "main",
    build: "build",
    test: "test",
  });
}
