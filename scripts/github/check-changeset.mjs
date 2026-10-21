import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/** Require a changed release note whenever a PR changes files under crates/. */
export function checkChangeset(files, expectedFileCount) {
  // GitHub returns at most 3,000 files. An incomplete list cannot prove that a
  // PR includes a changeset or that it has no crate changes.
  if (files.length !== expectedFileCount) {
    throw new Error(
      `Expected ${expectedFileCount} changed files, received ${files.length}; cannot check changeset coverage.`,
    );
  }

  const changesCrates = files.some(
    (file) =>
      file.filename.startsWith("crates/") ||
      file.previous_filename?.startsWith("crates/"),
  );
  if (!changesCrates) return "No crate changes; no changeset required.";

  const hasChangeset = files.some(
    (file) =>
      file.status !== "removed" && /^\.changeset\/[^/]+\.md$/.test(file.filename),
  );
  if (!hasChangeset) {
    throw new Error(
      "This PR changes crates/**. Add or update a .changeset/*.md file with the required crate releases.",
    );
  }

  return "Crate changes include a changeset.";
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const files = JSON.parse(readFileSync(0, "utf8")).flat();
    console.log(checkChangeset(files, Number(process.env.CHANGED_FILES)));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
