import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "langchain-ai/langchainjs",
    branch: "main",
    build: "build",
    test: ["test:unit", "test:int"],
  });
}
