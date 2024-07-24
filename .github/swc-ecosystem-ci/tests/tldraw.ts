import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "tldraw/tldraw",
    branch: "main",
    beforeInstall: ["corepack enable"],
    build: "build",
    test: ["test-ci"],
    agent: "yarn",
  });
}
