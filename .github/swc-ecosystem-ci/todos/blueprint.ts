import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "palantir/blueprint",
    branch: "develop",
    build: "compile",
    test: "test",
  });
}
