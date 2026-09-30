# SWC release tooling

`cargo releaser changelog` (also `pnpm changelog`) regenerates `CHANGELOG.md`
and `CHANGELOG-CORE.md`. Install git-cliff 2.8.0 and use a checkout with complete
Git history and tags. Linked worktrees are supported.
Generation fails before writing either file if either calendar has no selected
release tags. Fetch missing tags with `git fetch --tags` and retry.

The two existing git-cliff configurations select the npm and Rust release
calendars. The releaser enriches their JSON contexts with changesets before
rendering the Markdown templates. Commits grouped as `Internal` are omitted
after extracting any changesets they contain; this keeps changeset-only
releases visible without listing release housekeeping commits.

Each release uses the last revision of a changeset within its Git commit range.
Consumption does not erase the notes: old blobs remain available in Git.
Deleting a file in a later release does not repeat its notes, and edits after a
tag do not rewrite that tag's description. Crates listed in the same changeset
share one entry, with crate names but no per-crate version-bump levels. Original
Markdown paragraphs, lists, and examples are retained.
Commits without usable changeset bodies remain as ordinary changelog entries.
Malformed historical changesets produce warnings; malformed pending changesets
are errors.

`cargo releaser --dry-run changelog` prints both outputs without writing them.
Uncommitted changesets appear only in the unreleased section. Generation needs
no GitHub API access and keeps the configured git-cliff history limits.

`cargo bump` computes Rust version changes, renders both changelogs, updates
versions, consumes the pending changesets, commits, and creates the core tag.
The core changelog already uses the new version in that release commit.
Pending changesets must be committed before a real bump so their original
contents remain recoverable after consumption. `cargo releaser --dry-run bump`
also previews uncommitted notes without changing versions, files, commits, or
tags. If version updates, changelog writes, or the release commit fail, the
releaser restores manifests, the lockfile, changelogs, changesets, and the Git
index to their pre-mutation state. Fix the failing command or hook and rerun
`cargo bump`; the retry computes versions from the original manifests. A tag
failure after a successful commit leaves that release commit intact.

## Tests

Initialize submodules before running tests:

```sh
git submodule update --init --recursive
cargo test -p swc-releaser
```

The fixture suite uses temporary Git repositories and the real git-cliff binary.
Unix release lifecycle fixtures substitute only cargo-edit to exercise command
failures without installing it. Update Markdown snapshots with
`UPDATE=1 cargo test -p swc-releaser`, inspect their formatting and content, then
rerun without `UPDATE`.
