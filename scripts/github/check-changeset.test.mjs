import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import test from "node:test";

import { checkChangeset } from "./check-changeset.mjs";

const crate = { filename: "crates/swc_ecma_utils/src/lib.rs", status: "modified" };
const changeset = { filename: ".changeset/fix-utils.md", status: "added" };

test("changes outside crates do not require a changeset", () => {
  const files = [{ filename: ".github/workflows/changeset.yml", status: "added" }];
  assert.match(checkChangeset(files, files.length), /no changeset required/);
});

test("crate additions, edits, deletions, and moves require a changeset", () => {
  for (const status of ["added", "modified", "removed", "renamed"]) {
    assert.throws(() => checkChangeset([{ ...crate, status }], 1), /Add or update/);
  }
  assert.throws(
    () =>
      checkChangeset(
        [{
          filename: "docs/moved.rs",
          previous_filename: crate.filename,
          status: "renamed",
        }],
        1,
      ),
    /Add or update/,
  );
});

test("added, modified, and renamed changesets satisfy the check", () => {
  for (const status of ["added", "modified", "renamed"]) {
    assert.match(
      checkChangeset([crate, { ...changeset, status }], 2),
      /include a changeset/,
    );
  }
});

test("removed changesets and other files do not satisfy the check", () => {
  for (const file of [
    { ...changeset, status: "removed" },
    { filename: ".changeset/.gitkeep", status: "modified" },
    { filename: ".changeset/nested/note.md", status: "added" },
    { filename: "docs/note.md", status: "added" },
  ]) {
    assert.throws(() => checkChangeset([crate, file], 2), /Add or update/);
  }
});

test("an incomplete file list fails instead of passing silently", () => {
  assert.throws(() => checkChangeset([changeset], 3001), /cannot check/);
  assert.throws(() => checkChangeset([crate, changeset], 3001), /cannot check/);
});

test("CLI reads all API pages and exits unsuccessfully for missing changesets", () => {
  const script = new URL("./check-changeset.mjs", import.meta.url);
  const env = { ...process.env, CHANGED_FILES: "2" };
  const output = execFileSync(process.execPath, [script.pathname], {
    input: JSON.stringify([[crate], [changeset]]),
    env,
    encoding: "utf8",
  });
  assert.match(output, /include a changeset/);

  const failed = spawnSync(process.execPath, [script.pathname], {
    input: JSON.stringify([[crate]]),
    env: { ...env, CHANGED_FILES: "1" },
    encoding: "utf8",
  });
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /Add or update/);
});
