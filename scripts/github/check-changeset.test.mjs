import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { checkChangeset } from "./check-changeset.mjs";

function repository(t) {
  const cwd = mkdtempSync(join(tmpdir(), "swc-changeset-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
  const write = (path, content = "new content") => {
    mkdirSync(dirname(join(cwd, path)), { recursive: true });
    writeFileSync(join(cwd, path), content);
  };
  const commit = () => {
    git("add", "--all");
    git("-c", "core.hooksPath=/dev/null", "commit", "-qm", "fixture");
    return git("rev-parse", "HEAD");
  };
  git("init", "-q");
  git("config", "user.name", "Test");
  git("config", "user.email", "test@example.com");
  write("crates/example/src/lib.rs", "original");
  write(".changeset/existing.md", "original release note");
  const base = commit();
  return { cwd, git, write, commit, base };
}

test("changes outside crates do not require a changeset", (t) => {
  const repo = repository(t);
  repo.write("docs/guide.md");
  assert.match(checkChangeset(repo.base, repo.commit(), repo), /no changeset required/);
});

test("crate additions, edits, deletions, and moves require a changed changeset", (t) => {
  const repo = repository(t);
  const path = "crates/example/src/lib.rs";
  for (const change of [
    () => repo.write("crates/example/src/new.rs"),
    () => repo.write(path),
    () => rmSync(join(repo.cwd, path)),
    () => renameSync(join(repo.cwd, path), join(repo.cwd, "moved.rs")),
  ]) {
    repo.git("reset", "--hard", repo.base);
    change();
    assert.throws(() => checkChangeset(repo.base, repo.commit(), repo), /Add or update/);
  }
});

test("added, modified, and renamed changesets satisfy the check", (t) => {
  const repo = repository(t);
  for (const change of [
    () => repo.write(".changeset/new.md"),
    () => repo.write(".changeset/existing.md"),
    () => renameSync(join(repo.cwd, ".changeset/existing.md"), join(repo.cwd, ".changeset/renamed.md")),
  ]) {
    repo.git("reset", "--hard", repo.base);
    repo.write("crates/example/src/lib.rs");
    change();
    assert.match(checkChangeset(repo.base, repo.commit(), repo), /include a changeset/);
  }
});

test("removed changesets and other files do not satisfy the check", (t) => {
  const repo = repository(t);
  for (const change of [
    () => rmSync(join(repo.cwd, ".changeset/existing.md")),
    () => repo.write(".changeset/.gitkeep"),
    () => repo.write(".changeset/nested/note.md"),
    () => repo.write("docs/note.md"),
  ]) {
    repo.git("reset", "--hard", repo.base);
    repo.write("crates/example/src/lib.rs");
    change();
    assert.throws(() => checkChangeset(repo.base, repo.commit(), repo), /Add or update/);
  }
});

test("changes made only on the base branch are excluded", (t) => {
  const repo = repository(t);
  repo.write("docs/guide.md");
  const head = repo.commit();
  repo.git("checkout", "--detach", repo.base);
  repo.write("crates/example/src/base-only.rs");
  const base = repo.commit();
  assert.match(checkChangeset(base, head, repo), /no changeset required/);
});

test("a changeset added only on the base branch does not satisfy the check", (t) => {
  const repo = repository(t);
  repo.write("crates/example/src/lib.rs");
  const head = repo.commit();
  repo.git("checkout", "--detach", repo.base);
  repo.write(".changeset/base-only.md");
  const base = repo.commit();
  assert.throws(() => checkChangeset(base, head, repo), /Add or update/);
});

test("CLI uses SHA environment variables and fails for missing changesets or revisions", (t) => {
  const repo = repository(t);
  const script = fileURLToPath(new URL("./check-changeset.mjs", import.meta.url));
  repo.write("crates/example/src/lib.rs");
  const head = repo.commit();
  const env = { ...process.env, BASE_SHA: repo.base, HEAD_SHA: head };
  const failed = spawnSync(process.execPath, [script], { cwd: repo.cwd, env, encoding: "utf8" });
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /Add or update/);

  repo.write(".changeset/new\nnote.md");
  const output = execFileSync(process.execPath, [script], {
    cwd: repo.cwd, env: { ...env, HEAD_SHA: repo.commit() }, encoding: "utf8",
  });
  assert.match(output, /include a changeset/);

  const missing = spawnSync(process.execPath, [script], {
    cwd: repo.cwd, env: { ...env, BASE_SHA: "missing-revision" }, encoding: "utf8",
  });
  assert.equal(missing.status, 1);
});
