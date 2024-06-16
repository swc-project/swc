import { runInRepo } from "../utils.js";
import { RunOptions } from "../types.js";

export async function test(options: RunOptions) {
  // https://github.com/mswjs/msw/blob/2f7215294cac98149757f57118c7492d31a2a8e0/.github/workflows/ci.yml
  await runInRepo({
    ...options,
    repo: "mswjs/msw",
    branch: "main",
    build: "build",
    beforeTest: "pnpm exec playwright install",
    test: ["test:unit", "test:node", "test:browser"],
  });
}
