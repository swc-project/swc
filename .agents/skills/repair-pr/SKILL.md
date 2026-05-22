---
name: repair-pr
description: One-shot repair workflow for SWC pull requests. Use when asked to repair a PR by resolving merge conflicts, applying unresolved actionable reviews from chatgpt-codex-connector[bot], resolving those review threads, fixing failing CI, committing the repair work in coherent chunks, and pushing once at the end.
---

# Repair PR

## Goal

Repair the current or specified GitHub PR once, then stop. Handle merge conflicts, review feedback from `chatgpt-codex-connector[bot]`, and CI failures in that order. Commit after each coherent repair phase, but push only once after all local changes are complete.

## Workflow

1. Resolve the PR context.
   - Read the repository `AGENTS.md` before changing code.
   - Confirm `gh auth status` works.
   - If the user provided a PR number or URL, use it; otherwise use `gh pr view --json number,url,baseRefName,headRefName`.
   - Run `node .agents/skills/repair-pr/scripts/repair-pr.mjs status --pr <pr>` to collect merge state, unresolved bot review threads, and failing checks.

2. Resolve merge conflicts first.
   - Treat `mergeStateStatus: DIRTY` or GitHub reporting conflicts as the conflict signal.
   - Fetch the PR base branch and merge it into the PR branch; do not rebase.
   - Use `git merge origin/<baseRefName>` or the correct remote-tracking base ref for the repository.
   - If conflicts occur, resolve them by reading the source, fixtures, and tests. Do not choose `--ours` or `--theirs` blindly.
   - Run focused verification for the resolved area, then `git add` the intended files and commit the merge/conflict resolution before moving on.

3. Apply bot review feedback.
   - Consider only unresolved, non-outdated review threads with at least one comment authored by `chatgpt-codex-connector[bot]`.
   - Ignore approvals, resolved threads, outdated threads, duplicates, and non-actionable notes.
   - Group related review threads by behavior or file, implement the smallest correct fix, and run focused tests.
   - Commit each coherent review-fix group.
   - After the relevant fix is committed, resolve each handled thread with `node .agents/skills/repair-pr/scripts/repair-pr.mjs resolve-thread <thread-id>`.
   - If a bot comment is ambiguous or would cause a regression, leave the thread unresolved and report the blocker.

4. Fix CI failures.
   - Use `gh pr checks <pr> --json name,state,bucket,link,workflow` to identify failing checks.
   - For GitHub Actions failures, inspect logs with `gh run view <run-id> --log` or job logs from `gh api` when needed.
   - Treat external checks as report-only unless their logs are available through `gh`.
   - Fix the observed root cause, run focused local verification, and commit the CI fix.

5. Finish once.
   - Run the repository-required verification from `AGENTS.md` when feasible; if full verification is too expensive or blocked, run the most relevant subset and clearly report the gap.
   - Re-run `node .agents/skills/repair-pr/scripts/repair-pr.mjs status --pr <pr>` once for a final summary.
   - If any commits were created, push once with `git push` for the current branch. Because this workflow merges instead of rebasing, do not force-push.
   - Do not start a monitoring loop or keep polling checks after the final status check.

## Helper

Use the helper from the repository root:

```bash
node .agents/skills/repair-pr/scripts/repair-pr.mjs status
node .agents/skills/repair-pr/scripts/repair-pr.mjs status --pr 123 --json
node .agents/skills/repair-pr/scripts/repair-pr.mjs resolve-thread PRRT_kwDO...
```

The helper is an inventory and review-thread mutation aid. It does not implement code fixes, stage changes, commit, push, or decide whether a review comment is correct.

## Commit And Push Rules

- Commit after each coherent phase that changes files: merge-conflict repair, bot-review repair group, CI repair group.
- Stage only files that belong to the current repair.
- Push exactly once at the end if at least one commit was created.
- If no local changes were needed, do not create an empty commit and do not push.
