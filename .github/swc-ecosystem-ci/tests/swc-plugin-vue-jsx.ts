import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "g-plane/swc-plugin-vue-jsx",
    branch: "main",
    build: ["rustup target add wasm32-unknown-unknown", "build"],
    test: ["test"],
  });
}
