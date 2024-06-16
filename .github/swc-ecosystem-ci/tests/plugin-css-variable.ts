import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "jantimon/css-variable",
    branch: "main",
    build: "build",
    beforeBuild: "rustup target add wasm32-wasi",
    test: ["test:swc"],
  });
}
