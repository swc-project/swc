---
name: add-changeset
description: Create, commit, and push SWC changeset files for pull requests. Use when asked to add a changeset, prepare release notes, decide patch/minor/major bumps, enumerate changed Rust crates, or publish a changeset commit for an SWC PR; the skill requires every publishable Rust crate with a breaking change or a runtime dependency breaking change to be listed as major, every other changed publishable Rust crate to be listed as patch or minor, and swc_core to be listed as at least patch for Rust crate changes.
---

# Add Changeset

## Goal

Add one Markdown file under `.changeset/` whose front matter lists every changed publishable Rust crate in the PR, plus `swc_core` when any Rust crate changes.

## Workflow

1. Find the PR base and changed files.
   - Prefer `gh pr view --json baseRefName,headRefName,body` when the branch has a GitHub PR.
   - Use `git diff` against the PR merge base; include staged and unstaged local changes when preparing an unpushed PR.
   - Run `scripts/changed-rust-crates.mjs` from this skill to get a first pass of directly touched Rust crates.

2. Read the code, not only the helper output.
   - Inspect every changed Rust crate reported by the helper.
   - Inspect root workspace changes such as `Cargo.toml`, `Cargo.lock`, `rust-toolchain`, `.cargo/`, and release tooling manually; they may affect crates without changing files inside the crate directory.
   - Ignore non-publishable workspace crates in changeset front matter unless the maintainer explicitly asks otherwise; SWC's release tool skips `publish = false` crates.

3. Classify every changed publishable Rust crate.
   - Use `major` for every crate whose public API, behavior contract, feature semantics, serialized output, CLI-visible behavior, or documented compatibility is breaking.
   - Use `major` for a crate when one of its runtime dependencies changed in a breaking way. Check that crate's `[dependencies]`, target-specific runtime dependencies, and relevant `Cargo.lock` changes; do not apply this rule to dev-only or build-only dependencies.
   - Do not expand `major` through SWC's reverse internal dependency graph just because another crate depends on a breaking crate; SWC's bump command handles that internal propagation after reading the changeset.
   - Use `minor` for non-breaking new public functionality, new supported syntax, new options, new public exports, or meaningful user-visible capability.
   - Use `patch` for bug fixes, performance work, refactors, internal-only changes, tests, fixtures, documentation, or dependency bumps that do not add a non-breaking capability.
   - If a crate has both breaking and non-breaking changes, list it once as `major`.

4. Check `swc_core` exposure explicitly.
   - If a changed crate's breaking API is re-exported by `swc_core` or exposed through a `swc_core` feature, list `swc_core: major`.
   - If a changed crate adds non-breaking public API that `swc_core` exposes, list `swc_core: minor`.
   - If `swc_core` files or feature mappings changed directly and the change is not breaking or additive, list `swc_core: patch`.
   - If any publishable Rust crate is listed and no stronger `swc_core` bump is required, include `swc_core: patch` even when `swc_core` files did not change.

5. Write the changeset.
   - Create a new file at `.changeset/<short-kebab-summary>.md`.
   - Keep the front matter sorted by crate name unless a maintainer provided another order.
   - Mention only Rust crate names and bump levels in front matter.
   - Write a concise summary after the front matter using SWC commit style, such as `fix(es/parser): ...`, `feat(es/parser): ...`, `perf(es/parser): ...`, or `refactor(es/parser): ...`.

6. Validate, commit, and push the changeset.
   - Review `git status --short` and the changeset contents before staging.
   - Stage only the new changeset with `git add -- .changeset/<short-kebab-summary>.md`; never include unrelated worktree changes.
   - Run `git diff --cached --check` and inspect `git diff --cached` before committing.
   - Commit with `git commit -m "chore: Add changeset"`; never use `--no-verify`.
   - Require a named branch. If `git branch --show-current` is empty, stop and ask the user which branch to use.
   - Push with plain `git push` when the branch has an upstream.
   - When no upstream exists, identify the PR head remote and branch with `gh pr view` and repository remotes, then use `git push --set-upstream <remote> <branch>`. Stop and ask the user if the target is ambiguous.
   - Never force-push. Report the commit hash and pushed remote branch.

## Example

```markdown
---
swc_core: minor
swc_ecma_parser: minor
---

perf: Optimize es parser comment finalization
```

## Helper

Run this helper from the repository root:

```bash
node .codex/skills/add-changeset/scripts/changed-rust-crates.mjs
```

Useful options:

```bash
node .codex/skills/add-changeset/scripts/changed-rust-crates.mjs --base origin/main
node .codex/skills/add-changeset/scripts/changed-rust-crates.mjs --json
node .codex/skills/add-changeset/scripts/changed-rust-crates.mjs --include-private
```

Treat the helper as an inventory aid. It does not decide breaking changes, does not understand public API exposure, and cannot fully interpret workspace-level changes.
