import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

/** Check the PR diff from the base/head merge base, excluding base-only changes. */
export function checkChangeset(baseSha, headSha, { cwd } = {}) {
  const hasDiff = (args, path) => {
    const result = spawnSync(
      "git",
      [
        "diff",
        "--quiet",
        "--no-renames",
        ...args,
        `${baseSha}...${headSha}`,
        "--",
        path,
      ],
      { cwd, encoding: "utf8" },
    );
    if (result.error) throw result.error;
    if (result.status === 0) return false;
    if (result.status === 1) return true;
    throw new Error(result.stderr || "git diff failed");
  };

  // Disable rename detection so moving a file out of crates/ counts as a
  // deletion there. --quiet stops at the first matching change without listing
  // filenames, so file counts and unusual filenames need no special handling.
  if (!hasDiff([], "crates/")) {
    return "No crate changes; no changeset required.";
  }

  if (!hasDiff(["--diff-filter=AM"], ":(glob).changeset/*.md")) {
    throw new Error(
      "This PR changes crates/**. Add or update a .changeset/*.md file with the required crate releases.",
    );
  }

  return "Crate changes include a changeset.";
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(checkChangeset(process.env.BASE_SHA, process.env.HEAD_SHA));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
