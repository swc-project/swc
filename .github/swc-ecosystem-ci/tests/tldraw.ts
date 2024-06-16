import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "tldraw/tldraw",
    branch: "main",
    beforeInstall: ["corepack enable"],
    build: "build",
    test: ["test"],
    agent: "yarn",
  });
}
