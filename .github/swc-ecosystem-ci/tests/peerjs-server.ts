import { runInRepo } from "../utils";
import { RunOptions } from "../types";

export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "peers/peerjs-server",
    branch: "master",
    build: "build",
    test: "test",
  });
}
