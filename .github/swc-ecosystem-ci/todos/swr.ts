import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

// SWR sets pnpm `minimumReleaseAge: 2880` on main, which blocks freshly
// published SWC nightly packages during the release workflow.
export async function test(options: RunOptions) {
  await runInRepo({
    ...options,
    repo: "vercel/swr",
    branch: "main",
    build: "build",
    test: "test",
  });
}
