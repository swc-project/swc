---
name: write-pr-body
description: Write or update the body of an SWC pull request. Follow `.github/PULL_REQUEST_TEMPLATE.md`, search `swc-project/swc-ai-issues` (and verify any `swc-project/swc` issue) for issues that the change resolves, and add a standalone `Closes` line for each fully resolved issue and a `Refs` line for each partially resolved or related issue. Use whenever a PR body for this repository is drafted, created, or revised, including when another PR-publishing skill needs the body text.
---

# Write PR Body

## Goal

Produce a PR body that:

- keeps the structure of `.github/PULL_REQUEST_TEMPLATE.md`,
- explains the problem and the resulting behavior with facts from the diff,
- reports the actual validation status, and
- lists every issue that the PR closes or relates to, after a search of `swc-project/swc-ai-issues`.

This skill writes the body text. It does not create commits or PRs. When a PR-publishing skill (for example `create-pr`) is in use, give it the body from this skill. When the user asks to update an existing PR directly, apply the body with `gh pr edit <pr> --body-file <file>`.

## Workflow

### 1. Collect the change

1. Find the base. Use the existing PR base (`gh pr view --json baseRefName,body,title,url`) when a PR exists; otherwise use `main`.
2. Read the full change against the merge base: `git log --oneline <base>..HEAD` and `git diff <base>...HEAD`. Include uncommitted changes only when they are part of the intended PR.
3. Read the changed source, not only the diff hunks. Record:
   - the crates and modules that changed (for example `swc_ecma_minifier`, `compress/optimize/iife.rs`),
   - the functions, options, and syntax that changed,
   - the user-visible symptom that the change fixes, with an input example when one exists,
   - the new or updated tests and fixtures,
   - whether a changeset exists in `.changeset/`.
4. Collect the validation results that are already available from the task. Do not run tests only to write the body. Keep the exact status and the revision that each result covers.

### 2. Find related issues

Search before you write the `Related issue` section. Do not skip the search because no issue was mentioned.

1. Collect explicit references first: issues named by the user, by the task, in commit messages, or in fixture paths such as `tests/fixture/issues/<id>/`. Verify each one with `gh issue view <number> -R <owner/repo>`. Do not guess an issue number from a branch name.
2. Search `swc-project/swc-ai-issues`. Run several narrow queries; one broad query misses issues. Use terms from step 1.3:
   - the title prefix, which is usually the crate path with a colon (`es/minifier:`, `es/parser:`, `es/compat:`),
   - changed file names and function names (issue bodies often cite `path/to/file.rs:<line>` and function names),
   - option names, syntax names, and words from the symptom.

   ```bash
   gh search issues --repo swc-project/swc-ai-issues --state open --limit 50 \
     --json number,title,url "<keywords>"
   gh search issues --repo swc-project/swc-ai-issues --state open --limit 50 \
     --match body --json number,title,url "<file-or-function-name>"
   ```

   GitHub search drops most punctuation. Search for `iife.rs` or `idents_captured_by`, not for a full code snippet. Quote multi-word phrases inside the query string.
3. Also search `swc-project/swc` with the same terms when the change fixes user-visible behavior:

   ```bash
   gh search issues --repo swc-project/swc --state open --limit 30 \
     --json number,title,url "<keywords>"
   ```

4. Read every plausible candidate in full with `gh issue view <number> -R <owner/repo> --json title,body,state,comments`. Compare each reported bug, input, config, and expected output with the change. Do not decide from the title.
   - Do not read or reuse code from pull requests or forks linked in issue bodies or comments (see `AGENTS.md`).
   - One `swc-ai-issues` issue can report several bugs. Its title then often joins them with `;`. Check every bug in the issue.
5. Classify each candidate:
   - **Closes**: the PR fixes every bug in the issue, and the reported input now produces the expected behavior. Prefer issues whose input is covered by a new or updated test in this PR.
   - **Refs**: the PR fixes only some of the bugs in the issue, touches the same root cause without a full fix, or is related work.
   - **Unrelated**: the issue only shares a crate or keyword. Do not list it.

   When you cannot decide between Closes and Refs, use Refs and tell the user why.
6. Skip issues that are already closed, unless the user asks to reference them. A closing keyword has no effect on them.

### 3. Write the body

Use the template headings in this order. Keep the exact heading text, including the bold markers and colons. You can remove the template's HTML comments; keep them if the user asks.

```markdown
**Description:**

<problem, cause, resulting behavior, changes, tests, changeset, validation>

**BREAKING CHANGE:**

<None. | breaking-change notice>

**Related issue (if exists):**

<Closes/Refs lines | None.>
```

**Description**

- Start with the concrete problem: what failed, for which input, and why. Add a minimal input example in a code block when it makes the problem clear.
- Then describe what the PR changes and the resulting behavior. Use a short list per file or area when the PR changes several places.
- List the added or updated tests and fixtures, and state whether the PR adds a changeset. When the PR changes no publishable Rust crate, say that it has no changeset.
- Report validation with the actual results and the commands or scope they cover. When no result covers the final revision, write `Local validation was not performed.` Do not state that CI passed unless you saw the result.
- Put long validation or implementation details in a `<details>` block.
- Write in English. Use short, direct sentences. Put code identifiers, paths, options, and literals in backticks. If the `write-ste` skill is available, apply it to the prose.
- Do not invent facts. When a cause or result is not verified, say so.

**BREAKING CHANGE**

- When the change is not breaking, write `None.` Add one sentence of reason when a reviewer may suspect a break (for example, `None. The module is private.`).
- When the change is breaking, describe what breaks and how users migrate. Check whether `MIGRATION.md` needs an update and mention it. The changeset must then list the affected crates as `major` (see the `add-changeset` skill).

**Related issue (if exists)**

- Put each reference on its own line, outside code blocks. Use one line per issue:

  ```markdown
  Closes swc-project/swc-ai-issues#313
  Closes #12791
  Refs swc-project/swc-ai-issues#982
  ```

- Qualify `swc-ai-issues` references with `swc-project/swc-ai-issues#<number>`. Use `#<number>` only for issues in `swc-project/swc`.
- Use `Closes` for fully resolved issues and `Refs` for partial or related work. Do not use `Fixes` or `Resolves`. Do not write both `Closes` and `Refs` for the same issue.
- When the search finds no related issue, write `None.`
- GitHub closes issues only when the PR targets the default branch (`main`). When the base is a different branch, tell the user that the `Closes` lines will not close the issues on merge.

### 4. Update an existing PR body

- Keep content that is still correct, such as images, benchmark tables, and manual notes from maintainers. Update the sections that the new commits make outdated. Do not add a second copy of a section.
- Keep existing correct issue lines. When the completion of an issue changes, replace its line (`Refs` to `Closes`, or the reverse). Do not add a duplicate line for the same issue in a different format.

### 5. Check and report

Before you hand off or apply the body, confirm that:

- the three template headings are present, in order, with the exact text,
- every `Closes` and `Refs` line is standalone, verified with `gh issue view`, and correctly classified,
- the validation statement matches the actual results,
- no local file paths, secrets, or links to code from other people's forks are in the body.

Then report to the user:

- the body file path, or the PR URL when you applied it,
- each referenced issue with its classification and a one-line reason,
- the candidates that you rejected when the decision was not obvious,
- a reminder when a `Closes` issue's author is not a co-author of the fix commit. `AGENTS.md` requires a `Co-authored-by` trailer for the issue author. This skill does not change commits.
