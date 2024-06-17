import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "react-dnd/react-dnd",
    branch: "main",
    build: "build",
    test: ["test"],
    agent: "yarn@berry",
  });
}
