import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "ziir/vite-plugin-swc-transform",
    branch: "main",
    build: "build",
    test: "test",
    isWasm: true,
  });
}
