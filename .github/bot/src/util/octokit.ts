import { Octokit } from "@octokit/rest";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const owner = "swc-project";
export const repo = "swc";

export function getCurrentPrNumber(): number {
  const ref = process.env.GITHUB_REF;
  if (!ref) {
    throw new Error(
      `Cannot get current pr number because GITHUB_REF is not set`
    );
  }
  console.log(`GITHUB_REF: ${ref}`);

  if (ref.startsWith(`refs/pull/`) && ref.endsWith("/merge")) {
    const pr = ref.substring(10, ref.length - 6);
    return parseInt(pr);
  } else {
    throw new Error(
      `Cannot get current pr number because GITHUB_REF is not 'refs/pull/:prNumber/merge'`
    );
  }
}
