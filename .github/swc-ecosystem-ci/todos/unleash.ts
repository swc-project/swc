import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "Unleash/unleash",
    branch: "main",
    build: "build",
    test: "test:unit",
  });
}
