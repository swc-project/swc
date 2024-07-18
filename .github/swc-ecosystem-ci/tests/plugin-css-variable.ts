import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "jantimon/css-variable",
    branch: "main",
    build: "build",
    beforeBuild: "rustup target add wasm32-wasi",
    test: ["test:swc"],
    isWasm: true,
  });
}
