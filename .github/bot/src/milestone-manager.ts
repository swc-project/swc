// npx ts-node .github/bot/src/milestone-manager.ts v$version
// Assigns merged PRs and their same-repository closing issues to the current
// release milestone, using the previous stable GitHub release as the baseline.

import { execFileSync, spawnSync } from "child_process";

const OWNER = "swc-project";
const REPO = "swc";
const MAX_PR_CANDIDATES = 1000;
const MAX_RELEASE_CANDIDATES = 1000;
const RELEASE_TAG_PATTERN = /^v[0-9A-Za-z._+-]+$/;

type CommandOptions = {
  allowFailure?: boolean;
};

type Release = {
  tagName: string;
  isDraft: boolean;
  isPrerelease: boolean;
  publishedAt: string | null;
};

type GitHubRelease = {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
};

type Milestone = {
  number: number;
  title: string;
  state: string;
};

type PullRequest = {
  number: number;
  title: string;
  url: string;
  mergedAt: string | null;
  mergeCommit: {
    oid?: string;
  } | null;
  milestone: Milestone | null;
  closingIssuesReferences: IssueReference[] | null;
};

type IssueReference = {
  number: number;
  repository: {
    name: string;
    owner: {
      login: string;
    };
  } | null;
  url: string;
};

type MilestoneTargets = {
  pullRequests: PullRequest[];
  issues: IssueReference[];
  externalIssueReferences: string[];
};

function log(message: string, fields?: Record<string, unknown>) {
  const suffix = fields ? ` ${JSON.stringify(fields)}` : "";
  console.log(`[release-milestone] ${message}${suffix}`);
}

function fail(message: string): never {
  throw new Error(message);
}

function run(
  command: string,
  commandArgs: string[],
  options: CommandOptions = {}
): string | null {
  try {
    return execFileSync(command, commandArgs, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error: any) {
    if (options.allowFailure) {
      return null;
    }

    const stderr = error.stderr?.toString().trim();
    const detail = stderr ? `\n${stderr}` : "";
    fail(`Command failed: ${command} ${commandArgs.join(" ")}${detail}`);
  }
}

function ghJson<T>(commandArgs: string[]): T {
  const output = run("gh", commandArgs);
  return (output ? JSON.parse(output) : null) as T;
}

function validateArgs(args: string[]) {
  const knownOptions = new Set(["--dry-run"]);
  let positionalCount = 0;

  for (const arg of args) {
    if (arg.startsWith("--")) {
      if (!knownOptions.has(arg)) {
        fail(`Unknown option: ${arg}.`);
      }
      continue;
    }

    positionalCount++;
  }

  if (positionalCount !== 1) {
    fail(
      "Usage: npx ts-node .github/bot/src/milestone-manager.ts <release-tag-or-version> [--dry-run]"
    );
  }
}

function hasFlag(args: string[], name: string) {
  return args.includes(name);
}

function positionalArg(args: string[]) {
  const value = args.find((arg) => !arg.startsWith("--"));
  if (!value) {
    fail("Missing release tag or version.");
  }
  return value;
}

function normalizeReleaseTag(value: string) {
  const tag = value.replace(/^refs\/tags\//, "");
  return tag.startsWith("v") ? tag : `v${tag}`;
}

function isReleaseTagName(tag: string) {
  return RELEASE_TAG_PATTERN.test(tag) && !tag.includes("/");
}

function isStableReleaseTag(tag: string) {
  return isReleaseTagName(tag) && !tag.includes("-");
}

function commitForRevision(revision: string) {
  const commit = run("git", ["rev-parse", "--verify", `${revision}^{commit}`]);
  if (!commit) {
    fail(`Could not resolve commit for ${revision}.`);
  }
  return commit;
}

function commitForRevisionOrNull(revision: string) {
  return run("git", ["rev-parse", "--verify", `${revision}^{commit}`], {
    allowFailure: true,
  });
}

function commitDate(commit: string) {
  const date = run("git", ["show", "-s", "--format=%cI", commit]);
  if (!date) {
    fail(`Could not read commit date for ${commit}.`);
  }
  return date;
}

function searchDate(commit: string) {
  return commitDate(commit).slice(0, 10);
}

function commitExists(commit: string) {
  const result = spawnSync("git", ["cat-file", "-e", `${commit}^{commit}`], {
    encoding: "utf8",
  });
  return result.status === 0;
}

function isAncestor(ancestor: string, descendant: string) {
  const result = spawnSync(
    "git",
    ["merge-base", "--is-ancestor", ancestor, descendant],
    {
      encoding: "utf8",
    }
  );

  if (result.status === 0) {
    return true;
  }
  if (result.status === 1) {
    return false;
  }

  const stderr = result.stderr?.trim();
  fail(
    `Unable to compare commits ${ancestor} and ${descendant}.${
      stderr ? `\n${stderr}` : ""
    }`
  );
}

function commitDistance(ancestor: string, descendant: string) {
  const count = run("git", [
    "rev-list",
    "--count",
    `${ancestor}..${descendant}`,
  ]);
  return Number.parseInt(count ?? "0", 10);
}

function timestampOrZero(value: string | null | undefined) {
  const timestamp = Date.parse(value ?? "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function listReleases() {
  const pages = ghJson<GitHubRelease[][]>([
    "api",
    "--paginate",
    "--slurp",
    `repos/${OWNER}/${REPO}/releases?per_page=100`,
  ]);

  return pages.flat().map<Release>((release) => ({
    tagName: release.tag_name,
    isDraft: release.draft,
    isPrerelease: release.prerelease,
    publishedAt: release.published_at,
  }));
}

function findPreviousStableReleaseTag(
  currentTag: string,
  currentCommit: string
) {
  const releases = listReleases();
  if (releases.length >= MAX_RELEASE_CANDIDATES) {
    fail(
      `Fetched ${releases.length} release candidates, which reaches the safety limit. ` +
        "Raise the limit before closing the release milestone."
    );
  }

  const seenTags = new Set<string>();
  const candidates: Array<{
    tag: string;
    commit: string;
    distance: number;
    publishedAt: string | null;
  }> = [];
  let skippedCurrentTagCount = 0;
  let skippedDuplicateTagCount = 0;
  let skippedDraftCount = 0;
  let skippedPrereleaseCount = 0;
  let skippedNonStableTagCount = 0;
  let skippedMissingTagCount = 0;
  let skippedUnreachableTagCount = 0;

  for (const release of releases) {
    const tag = release.tagName;

    if (release.isDraft) {
      skippedDraftCount++;
      continue;
    }
    if (release.isPrerelease) {
      skippedPrereleaseCount++;
      continue;
    }
    if (!isStableReleaseTag(tag)) {
      skippedNonStableTagCount++;
      continue;
    }
    if (tag === currentTag) {
      skippedCurrentTagCount++;
      continue;
    }
    if (seenTags.has(tag)) {
      skippedDuplicateTagCount++;
      continue;
    }
    seenTags.add(tag);

    const commit = commitForRevisionOrNull(tag);
    if (!commit) {
      skippedMissingTagCount++;
      continue;
    }
    if (!isAncestor(commit, currentCommit)) {
      skippedUnreachableTagCount++;
      continue;
    }

    candidates.push({
      tag,
      commit,
      distance: commitDistance(commit, currentCommit),
      publishedAt: release.publishedAt,
    });
  }

  candidates.sort(
    (left, right) =>
      left.distance - right.distance ||
      timestampOrZero(right.publishedAt) - timestampOrZero(left.publishedAt) ||
      left.tag.localeCompare(right.tag)
  );

  const previous = candidates[0] ?? null;
  log("Resolved previous stable GitHub release.", {
    releaseCount: releases.length,
    candidateCount: candidates.length,
    previousTag: previous?.tag ?? null,
    skippedCurrentTagCount,
    skippedDuplicateTagCount,
    skippedDraftCount,
    skippedPrereleaseCount,
    skippedNonStableTagCount,
    skippedMissingTagCount,
    skippedUnreachableTagCount,
  });

  return previous?.tag ?? null;
}

function mergedPrSearchQuery(
  previousCommit: string | null,
  currentCommit: string
) {
  const currentDate = searchDate(currentCommit);
  if (!previousCommit) {
    return `merged:<=${currentDate}`;
  }

  return `merged:${searchDate(previousCommit)}..${currentDate}`;
}

function fetchMergedPullRequests(searchQuery: string) {
  const pullRequests = ghJson<PullRequest[]>([
    "pr",
    "list",
    "--repo",
    `${OWNER}/${REPO}`,
    "--state",
    "merged",
    "--limit",
    String(MAX_PR_CANDIDATES),
    "--search",
    searchQuery,
    "--json",
    "number,title,url,mergedAt,mergeCommit,milestone,closingIssuesReferences",
  ]);

  if (pullRequests.length >= MAX_PR_CANDIDATES) {
    fail(
      `Fetched ${pullRequests.length} merged PR candidates, which reaches the safety limit. ` +
        "Narrow the release range or raise the limit before closing the release milestone."
    );
  }

  return pullRequests;
}

function filterPullRequestsInReleaseRange(
  pullRequests: PullRequest[],
  previousCommit: string | null,
  currentCommit: string
) {
  const included: PullRequest[] = [];
  let missingMergeCommitCount = 0;
  let missingLocalCommitCount = 0;

  for (const pullRequest of pullRequests) {
    const mergeCommit = pullRequest.mergeCommit?.oid;
    if (!mergeCommit) {
      missingMergeCommitCount++;
      continue;
    }
    if (!commitExists(mergeCommit)) {
      missingLocalCommitCount++;
      continue;
    }
    if (!isAncestor(mergeCommit, currentCommit)) {
      continue;
    }
    if (previousCommit && isAncestor(mergeCommit, previousCommit)) {
      continue;
    }

    included.push(pullRequest);
  }

  included.sort((left, right) => {
    const leftTime = timestampOrZero(left.mergedAt);
    const rightTime = timestampOrZero(right.mergedAt);
    return leftTime - rightTime || left.number - right.number;
  });

  log("Filtered merged PRs by release commit range.", {
    candidates: pullRequests.length,
    included: included.length,
    missingMergeCommitCount,
    missingLocalCommitCount,
  });

  return included;
}

function listMilestones() {
  const pages = ghJson<Milestone[][]>([
    "api",
    "--paginate",
    "--slurp",
    `repos/${OWNER}/${REPO}/milestones?state=all&per_page=100`,
  ]);

  return pages.flat();
}

function createMilestone(title: string, dryRun: boolean) {
  const description = `Release milestone for version ${title}`;

  if (dryRun) {
    log("Would create release milestone.", {
      title,
      state: "open",
      description,
    });
    return null;
  }

  const milestone = ghJson<Milestone>([
    "api",
    "--method",
    "POST",
    `repos/${OWNER}/${REPO}/milestones`,
    "-f",
    `title=${title}`,
    "-f",
    "state=open",
    "-f",
    `description=${description}`,
  ]);
  log("Created release milestone.", { title, number: milestone.number });
  return milestone;
}

function updateMilestoneState(
  milestone: Milestone,
  state: "open" | "closed",
  dryRun: boolean
) {
  if (milestone.state === state) {
    return milestone;
  }

  if (dryRun) {
    log("Would update release milestone state.", {
      title: milestone.title,
      number: milestone.number,
      from: milestone.state,
      to: state,
    });
    return { ...milestone, state };
  }

  const updatedMilestone = ghJson<Milestone>([
    "api",
    "--method",
    "PATCH",
    `repos/${OWNER}/${REPO}/milestones/${milestone.number}`,
    "-f",
    `state=${state}`,
  ]);
  log("Updated release milestone state.", {
    title: updatedMilestone.title,
    number: updatedMilestone.number,
    state: updatedMilestone.state,
  });
  return updatedMilestone;
}

function ensureMilestone(title: string, dryRun: boolean) {
  const milestone = listMilestones().find(
    (candidate) => candidate.title === title
  );
  if (milestone) {
    log("Found release milestone.", {
      title: milestone.title,
      number: milestone.number,
      state: milestone.state,
    });
    return milestone;
  }

  return createMilestone(title, dryRun);
}

function repositoryKey(owner: string, repo: string) {
  return `${owner.toLowerCase()}/${repo.toLowerCase()}`;
}

function collectMilestoneTargets(
  pullRequests: PullRequest[]
): MilestoneTargets {
  const targetRepositoryKey = repositoryKey(OWNER, REPO);
  const pullRequestNumbers = new Map<number, PullRequest>();
  const issueNumbers = new Map<number, IssueReference>();
  const externalIssueReferences = new Set<string>();

  for (const pullRequest of pullRequests) {
    pullRequestNumbers.set(pullRequest.number, pullRequest);

    for (const issue of pullRequest.closingIssuesReferences ?? []) {
      const issueOwner = issue.repository?.owner.login;
      const issueRepo = issue.repository?.name;
      const issueNumber = issue.number;
      if (!issueOwner || !issueRepo || !issueNumber) {
        continue;
      }

      const issueRepositoryKey = repositoryKey(issueOwner, issueRepo);
      if (issueRepositoryKey !== targetRepositoryKey) {
        externalIssueReferences.add(
          `${issueOwner}/${issueRepo}#${issueNumber}`
        );
        continue;
      }

      issueNumbers.set(issueNumber, issue);
    }
  }

  return {
    pullRequests: [...pullRequestNumbers.values()],
    issues: [...issueNumbers.values()],
    externalIssueReferences: [...externalIssueReferences].sort(),
  };
}

function setIssueMilestone(
  issueNumber: number,
  milestone: Milestone | null,
  dryRun: boolean,
  targetKind: "issue" | "pull_request"
) {
  const milestoneNumber = milestone?.number;

  if (dryRun) {
    log("Would set milestone on item.", {
      kind: targetKind,
      number: issueNumber,
      milestone: milestoneNumber ?? "(new)",
    });
    return;
  }

  if (!milestoneNumber) {
    fail(
      `Cannot set milestone on #${issueNumber} because no milestone exists.`
    );
  }

  ghJson([
    "api",
    "--method",
    "PATCH",
    `repos/${OWNER}/${REPO}/issues/${issueNumber}`,
    "-F",
    `milestone=${milestoneNumber}`,
  ]);
  log("Set milestone on item.", {
    kind: targetKind,
    number: issueNumber,
    milestone: milestoneNumber,
  });
}

function setMilestoneOnTargets(
  targets: MilestoneTargets,
  milestone: Milestone | null,
  dryRun: boolean
) {
  for (const pullRequest of targets.pullRequests) {
    setIssueMilestone(pullRequest.number, milestone, dryRun, "pull_request");
  }
  for (const issue of targets.issues) {
    setIssueMilestone(issue.number, milestone, dryRun, "issue");
  }
}

function main() {
  const args = process.argv.slice(2);
  validateArgs(args);

  const dryRun =
    hasFlag(args, "--dry-run") ||
    process.env.RELEASE_MILESTONE_DRY_RUN === "true" ||
    process.env.DRY_RUN === "true";
  const currentTag = normalizeReleaseTag(positionalArg(args));
  if (!isStableReleaseTag(currentTag)) {
    fail(`Invalid stable release tag: ${currentTag}.`);
  }

  const currentCommit = commitForRevision(currentTag);
  const previousTag = findPreviousStableReleaseTag(currentTag, currentCommit);
  const previousCommit = previousTag ? commitForRevision(previousTag) : null;
  const searchQuery = mergedPrSearchQuery(previousCommit, currentCommit);

  log("Resolved release range.", {
    repository: `${OWNER}/${REPO}`,
    currentTag,
    currentCommit,
    previousTag,
    previousCommit,
    searchQuery,
    dryRun,
  });

  const candidates = fetchMergedPullRequests(searchQuery);
  const pullRequests = filterPullRequestsInReleaseRange(
    candidates,
    previousCommit,
    currentCommit
  );
  const targets = collectMilestoneTargets(pullRequests);
  const targetCount = targets.pullRequests.length + targets.issues.length;

  if (targets.externalIssueReferences.length > 0) {
    log("Skipping linked issues outside the current repository.", {
      count: targets.externalIssueReferences.length,
      references: targets.externalIssueReferences,
    });
  }

  let milestone = ensureMilestone(currentTag, dryRun);
  if (targetCount > 0 && milestone?.state === "closed") {
    milestone = updateMilestoneState(milestone, "open", dryRun);
  }

  setMilestoneOnTargets(targets, milestone, dryRun);

  if (milestone) {
    updateMilestoneState(milestone, "closed", dryRun);
  } else {
    log("Would close newly created release milestone.", { title: currentTag });
  }

  log("Release milestone processing completed.", {
    currentTag,
    previousTag,
    milestoneNumber: milestone?.number ?? null,
    pullRequestCount: targets.pullRequests.length,
    linkedIssueCount: targets.issues.length,
    externalLinkedIssueCount: targets.externalIssueReferences.length,
    dryRun,
  });
}

try {
  main();
} catch (error: any) {
  console.error(`[release-milestone] ${error.message}`);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exitCode = 1;
}
