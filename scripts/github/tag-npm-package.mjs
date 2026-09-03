#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import process from "node:process";
import { pathToFileURL } from "node:url";

const GITHUB_API_VERSION = "2022-11-28";

/**
 * Creates the release tag for an npm package without rewriting an existing ref.
 */
export async function tagNpmPackage({
  packageDirectory,
  targetCommit,
  repository,
  token,
  fetchImpl = globalThis.fetch,
  apiUrl = "https://api.github.com",
}) {
  const packageJson = JSON.parse(
    await readFile(
      new URL("package.json", pathToFileURL(`${packageDirectory}/`))
    )
  );
  const tag = packageTag(packageJson);
  const client = new GitHubTagClient({
    repository,
    token,
    fetchImpl,
    apiUrl,
  });

  const existingCommit = await client.findCommit(tag);
  if (existingCommit !== null) {
    assertMatchingCommit(tag, targetCommit, existingCommit);
    return { tag, created: false };
  }

  const response = await client.create(tag, targetCommit);
  if (response.ok) {
    return { tag, created: true };
  }

  // A competing workflow can create the ref between the lookup and the atomic
  // create request. Resolve it again so a same-commit race remains idempotent.
  if (response.status === 422) {
    const racedCommit = await client.findCommit(tag);
    if (racedCommit !== null) {
      assertMatchingCommit(tag, targetCommit, racedCommit);
      return { tag, created: false };
    }
  }

  throw await apiError(`Failed to create tag ${tag}`, response);
}

/** Returns the established repository tag name for an npm package manifest. */
export function packageTag(packageJson) {
  const { name, version } = packageJson;
  if (typeof name !== "string" || name.length === 0) {
    throw new Error("package.json must contain a non-empty string name");
  }
  if (typeof version !== "string" || version.length === 0) {
    throw new Error("package.json must contain a non-empty string version");
  }

  return `${name}@v${version}`;
}

class GitHubTagClient {
  constructor({ repository, token, fetchImpl, apiUrl }) {
    if (typeof repository !== "string" || !repository.includes("/")) {
      throw new Error("GITHUB_REPOSITORY must use the owner/repository format");
    }
    if (typeof token !== "string" || token.length === 0) {
      throw new Error("GITHUB_TOKEN is required");
    }
    if (typeof fetchImpl !== "function") {
      throw new Error("A fetch implementation is required");
    }

    this.repository = repository;
    this.token = token;
    this.fetchImpl = fetchImpl;
    this.apiUrl = apiUrl.replace(/\/$/, "");
  }

  async findCommit(tag) {
    const response = await this.request(
      `/repos/${this.repository}/git/ref/tags/${encodeURIComponent(tag)}`
    );
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw await apiError(`Failed to inspect tag ${tag}`, response);
    }

    const ref = await response.json();
    return this.resolveCommit(tag, ref.object);
  }

  async resolveCommit(tag, object) {
    const visited = new Set();
    while (object?.type === "tag") {
      if (visited.has(object.sha)) {
        throw new Error(`Tag ${tag} contains a cyclic annotated-tag chain`);
      }
      visited.add(object.sha);

      const response = await this.request(
        `/repos/${this.repository}/git/tags/${encodeURIComponent(object.sha)}`
      );
      if (!response.ok) {
        throw await apiError(
          `Failed to resolve annotated tag ${tag}`,
          response
        );
      }
      object = (await response.json()).object;
    }

    if (object?.type !== "commit" || typeof object.sha !== "string") {
      throw new Error(`Tag ${tag} does not resolve to a commit`);
    }
    return object.sha;
  }

  create(tag, targetCommit) {
    return this.request(`/repos/${this.repository}/git/refs`, {
      method: "POST",
      body: JSON.stringify({
        ref: `refs/tags/${tag}`,
        sha: targetCommit,
      }),
    });
  }

  request(path, init = {}) {
    return this.fetchImpl(`${this.apiUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        ...init.headers,
      },
    });
  }
}

function assertMatchingCommit(tag, targetCommit, existingCommit) {
  if (existingCommit !== targetCommit) {
    throw new Error(
      `Refusing to replace tag ${tag}: expected ${targetCommit}, but it points to ${existingCommit}`
    );
  }
}

async function apiError(message, response) {
  let detail = "";
  try {
    const body = await response.json();
    if (typeof body.message === "string") {
      detail = `: ${body.message}`;
    }
  } catch {
    // The status is still useful when GitHub returns an empty or non-JSON body.
  }
  return new Error(`${message} (HTTP ${response.status})${detail}`);
}

async function main() {
  const [packageDirectory, targetCommit] = process.argv.slice(2);
  if (!packageDirectory || !targetCommit) {
    throw new Error(
      "Usage: tag-npm-package.mjs <package-directory> <target-commit>"
    );
  }

  const result = await tagNpmPackage({
    packageDirectory,
    targetCommit,
    repository: process.env.GITHUB_REPOSITORY,
    token: process.env.GITHUB_TOKEN,
  });
  const action = result.created ? "Created" : "Verified existing";
  console.log(`${action} tag ${result.tag} at ${targetCommit}`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await main();
}
