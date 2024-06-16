import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "react-dnd/react-dnd",
    branch: "main",
    build: "build",
    test: ["test"],
  });
}
