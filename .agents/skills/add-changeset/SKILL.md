---
name: add-changeset
description: Create, commit, and push SWC changeset files for the current or an explicitly specified pull request. Use when asked to add a changeset, prepare release notes, decide patch/minor/major bumps, enumerate changed Rust crates, or publish a changeset commit for an SWC PR number or URL; the skill requires every publishable Rust crate with a breaking change or a runtime dependency breaking change to be listed as major, every other changed publishable Rust crate to be listed as patch or minor, and swc_core to be listed as at least patch for Rust crate changes.
---

# Add Changeset

## Goal

Add one Markdown file under `.changeset/` whose front matter lists every changed publishable Rust crate in the PR, plus `swc_core` when any Rust crate changes. Its body must give readers useful release notes, including the behavior change and any migration they need to make.

## Workflow

1. Resolve the PR context.
   - When the user supplies a PR number or URL, treat it as authoritative and enter specified PR mode.
   - In specified PR mode, require `gh auth status` to succeed and require a clean `git status --porcelain` before changing the checkout. Never stash or discard local changes automatically.
   - Read the PR with `gh pr view <pr> --json number,url,state,baseRefName,baseRefOid,headRefName,headRefOid,headRepository`. Require an open PR and a non-null `headRepository.nameWithOwner`; record the URL, base and head OIDs, head repository, and head branch.
   - Run `gh pr checkout <pr> --detach`, then require `git rev-parse HEAD` to equal the recorded `headRefOid`.
   - Find an existing remote whose push URL targets the recorded head repository. If none exists, use `https://github.com/<headRepository.nameWithOwner>.git` directly. Record this as the push target without changing any upstream.
   - Before writing a changeset, verify write access and the exact destination with `git push --dry-run <push-target> HEAD:refs/heads/<headRefName>`. Stop on failure.
   - Without a supplied PR number or URL, use the PR associated with the current branch and retain the current-branch workflow below.

2. Find the PR base and changed files.
   - In specified PR mode, use the recorded `baseRefOid` and checked-out PR head for all diff and helper commands.
   - Otherwise, prefer `gh pr view --json baseRefName,headRefName,body` when the branch has a GitHub PR.
   - Use `git diff` against the PR merge base; include staged and unstaged local changes only when preparing an unpushed current-branch PR.
   - Run `scripts/changed-rust-crates.mjs` from this skill to get a first pass of directly touched Rust crates.

3. Read the code, not only the helper output.
   - Inspect every changed Rust crate reported by the helper.
   - Inspect root workspace changes such as `Cargo.toml`, `Cargo.lock`, `rust-toolchain`, `.cargo/`, and release tooling manually; they may affect crates without changing files inside the crate directory.
   - Ignore non-publishable workspace crates in changeset front matter unless the maintainer explicitly asks otherwise; SWC's release tool skips `publish = false` crates.

4. Classify every changed publishable Rust crate.
   - Use `major` for every crate whose public API, behavior contract, feature semantics, serialized output, CLI-visible behavior, or documented compatibility is breaking.
   - Use `major` for a crate when one of its runtime dependencies changed in a breaking way. Check that crate's `[dependencies]`, target-specific runtime dependencies, and relevant `Cargo.lock` changes; do not apply this rule to dev-only or build-only dependencies.
   - Do not expand `major` through SWC's reverse internal dependency graph just because another crate depends on a breaking crate; SWC's bump command handles that internal propagation after reading the changeset.
   - Use `minor` for non-breaking new public functionality, new supported syntax, new options, new public exports, or meaningful user-visible capability.
   - Use `patch` for bug fixes, performance work, refactors, internal-only changes, tests, fixtures, documentation, or dependency bumps that do not add a non-breaking capability.
   - If a crate has both breaking and non-breaking changes, list it once as `major`.

5. Check `swc_core` exposure explicitly.
   - If a changed crate's breaking API is re-exported by `swc_core` or exposed through a `swc_core` feature, list `swc_core: major`.
   - If a changed crate adds non-breaking public API that `swc_core` exposes, list `swc_core: minor`.
   - If `swc_core` files or feature mappings changed directly and the change is not breaking or additive, list `swc_core: patch`.
   - If any publishable Rust crate is listed and no stronger `swc_core` bump is required, include `swc_core: patch` even when `swc_core` files did not change.

6. Write the changeset.
   - Create a new file at `.changeset/<short-kebab-summary>.md`.
   - Keep the front matter sorted by crate name unless a maintainer provided another order.
   - Mention only Rust crate names and bump levels in front matter.
   - Write a concise summary after the front matter using SWC commit style, such as `fix(es/parser): ...`, `feat(es/parser): ...`, `perf(es/parser): ...`, or `refactor(es/parser): ...`.
   - Follow the summary with substantive English prose describing the previous behavior, the resulting behavior, why it changed, and the affected users or APIs. Ground these details in the diff, source, and tests; do not merely repeat the title or paste the PR description.
   - For breaking changes, identify removed or changed APIs and their replacements, explain how callers migrate, and state any relevant limitations. Include a short before/after example when it makes the migration clearer; say when there is no direct replacement.
   - Mention `swc_core` exposure when the change affects callers using its re-exports or features. Explain distinct user-visible effects when several crates are listed, without repeating the same body for each crate.
   - Preserve useful Markdown paragraphs, lists, and fenced examples: the changelog generator carries them into release notes. Scale detail to the change; avoid empty headings, fixed word counts, and unrelated implementation history.
   - Claim performance numbers, compatibility guarantees, or unchanged behavior only when supported by inspected code, tests, or measurements. Do not invent a benchmark result or a migration requirement.

7. Validate, commit, and push the changeset.
   - Review `git status --short` and the changeset contents before staging. Verify that the body explains the change beyond its title and that any breaking changes have actionable migration guidance.
   - Stage only the new changeset with `git add -- .changeset/<short-kebab-summary>.md`; never include unrelated worktree changes.
   - Run `git diff --cached --check` and inspect `git diff --cached` before committing.
   - Commit with `git commit -m "chore: Add changeset"`; never use `--no-verify`.
   - In specified PR mode, detached HEAD is expected. Re-read the PR before pushing; require it to remain open, require its head repository and branch to match the recorded destination, and require its `headRefOid` to remain equal to the original recorded head OID.
   - Push specified PR mode with `git push <push-target> HEAD:refs/heads/<headRefName>`. Never set an upstream or substitute the current local branch name.
   - After a specified PR push, require the PR's `headRefOid` to equal the new commit and report the PR URL, commit hash, and pushed repository and branch.
   - Otherwise, require a named branch. If `git branch --show-current` is empty, stop and ask the user which branch to use.
   - For current-branch mode, push with plain `git push` when the branch has an upstream. When no upstream exists, identify the PR head remote and branch with `gh pr view` and repository remotes, then use `git push --set-upstream <remote> <branch>`. Stop and ask the user if the target is ambiguous.
   - Never force-push. If the PR head changed or a push is rejected as non-fast-forward, stop and report the concurrent update instead of overwriting it.

## Examples

A performance change uses `patch` unless it also changes the public contract or adds a capability. Explain the mechanism without asserting an unmeasured speedup:

```markdown
---
swc_core: patch
swc_ecma_parser: patch
---

perf(es/parser): Avoid growing the identifier escape buffer repeatedly

Reserve space for decoded identifier escapes before appending them. Previously,
identifiers with several escapes could repeatedly grow the buffer while scanning
the same identifier. This reduces buffer growth on that path without changing
how escaped identifiers are represented in the AST.
```

A breaking parser change documents both the API change and the migration:

```markdown
---
swc_core: major
swc_ecma_parser: major
---

refactor(es/parser): Separate lexical and parser contexts

Move parser grammar state out of the lexer context so lexical flags and parser
control flow can be managed separately. This affects consumers of the low-level
Rust parser API, including `swc_core::ecma::parser` callers.

Breaking changes and migration:

- `Context` contains only lexical flags and uses `u8` instead of `u32`. Update
  code that stores or constructs its underlying bits.
- Replace `Context::CanBeModule` with `Parser::allow_module_syntax()`.
- Custom `Tokens` implementations must implement `rescan_type_gt`.
- `Buffer::merge_lt_gt` is removed. Use `Buffer::eat_type_gt` for consuming
  type-closing angles; it is not a drop-in replacement for arbitrary operator
  merging.

AST node definitions and serialization schemas remain unchanged.
```

These are examples of the expected detail, not claims to copy into unrelated PRs.

## Helper

Run this helper from the repository root:

```bash
node .agents/skills/add-changeset/scripts/changed-rust-crates.mjs
```

Useful options:

```bash
node .agents/skills/add-changeset/scripts/changed-rust-crates.mjs --base origin/main
node .agents/skills/add-changeset/scripts/changed-rust-crates.mjs --json
node .agents/skills/add-changeset/scripts/changed-rust-crates.mjs --include-private
```

Treat the helper as an inventory aid. It does not decide breaking changes, does not understand public API exposure, and cannot fully interpret workspace-level changes.
