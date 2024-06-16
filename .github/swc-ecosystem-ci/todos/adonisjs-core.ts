import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "adonisjs/core",
    branch: "develop",
    build: "build",
    test: "test",
  });
}
