import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "g-plane/swc-plugin-vue-jsx",
    branch: "main",
    build: ["rustup target add wasm32-unknown-unknown", "build"],
    test: ["test"],
    isWasm: true,
  });
}
