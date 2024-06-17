import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "langchain-ai/langchainjs",
    branch: "main",
    build: "build",
    test: ["test:unit", "test:int"],
  });
}
