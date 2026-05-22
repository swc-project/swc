#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { exit } from "node:process";

const DEFAULT_REVIEW_AUTHOR = "chatgpt-codex-connector[bot]";

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "--help" || command === "-h") {
    printGlobalHelp();
    exit(command ? 0 : 1);
}

if (command === "status") {
    statusCommand(args.slice(1));
} else if (command === "resolve-thread") {
    resolveThreadCommand(args.slice(1));
} else {
    fail(`Unknown command: ${command}`);
}

function statusCommand(rawArgs) {
    const options = parseStatusArgs(rawArgs);

    if (options.help) {
        printStatusHelp();
        exit(0);
    }

    const pr = readPullRequest(options.pr);
    const repo = parsePullRequestUrl(pr.url) ?? readCurrentRepo();
    const reviewThreads = readReviewThreads(repo, pr.number);
    const botThreads = reviewThreads.filter((thread) =>
        isRelevantBotThread(thread, options.reviewAuthor),
    );
    const checks = readChecks(options.pr ?? String(pr.number));
    const failingChecks = checks.items.filter(isFailingCheck);

    const report = {
        pullRequest: {
            number: pr.number,
            url: pr.url,
            title: pr.title,
            baseRefName: pr.baseRefName,
            headRefName: pr.headRefName,
            mergeStateStatus: pr.mergeStateStatus,
            reviewDecision: pr.reviewDecision,
            isDraft: pr.isDraft,
        },
        reviewAuthor: options.reviewAuthor,
        unresolvedReviewThreads: botThreads.map((thread) =>
            formatThread(thread, options.reviewAuthor),
        ),
        checks: {
            error: checks.error,
            failing: failingChecks.map(formatCheck),
            total: checks.items.length,
        },
    };

    if (options.json) {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } else {
        printStatusReport(report);
    }
}

function resolveThreadCommand(rawArgs) {
    const options = parseResolveThreadArgs(rawArgs);

    if (options.help) {
        printResolveThreadHelp();
        exit(0);
    }

    if (!options.threadId) {
        fail("Missing review thread id.");
    }

    const query = `
mutation($threadId: ID!) {
  resolveReviewThread(input: { threadId: $threadId }) {
    thread {
      id
      isResolved
    }
  }
}`;
    const result = runJson("gh", [
        "api",
        "graphql",
        "-f",
        `query=${query}`,
        "-F",
        `threadId=${options.threadId}`,
    ]);
    const thread = result?.data?.resolveReviewThread?.thread;

    if (!thread?.isResolved) {
        fail(`GitHub did not report thread ${options.threadId} as resolved.`);
    }

    process.stdout.write(`Resolved review thread ${thread.id}\n`);
}

function parseStatusArgs(rawArgs) {
    const parsed = {
        help: false,
        json: false,
        pr: null,
        reviewAuthor: DEFAULT_REVIEW_AUTHOR,
    };

    for (let i = 0; i < rawArgs.length; i += 1) {
        const arg = rawArgs[i];

        if (arg === "--help" || arg === "-h") {
            parsed.help = true;
        } else if (arg === "--json") {
            parsed.json = true;
        } else if (arg === "--pr") {
            parsed.pr = requireValue(rawArgs, ++i, arg);
        } else if (arg.startsWith("--pr=")) {
            parsed.pr = arg.slice("--pr=".length);
        } else if (arg === "--review-author") {
            parsed.reviewAuthor = requireValue(rawArgs, ++i, arg);
        } else if (arg.startsWith("--review-author=")) {
            parsed.reviewAuthor = arg.slice("--review-author=".length);
        } else {
            fail(`Unknown status argument: ${arg}`);
        }
    }

    return parsed;
}

function parseResolveThreadArgs(rawArgs) {
    const parsed = {
        help: false,
        threadId: null,
    };

    for (const arg of rawArgs) {
        if (arg === "--help" || arg === "-h") {
            parsed.help = true;
        } else if (!parsed.threadId) {
            parsed.threadId = arg;
        } else {
            fail(`Unexpected resolve-thread argument: ${arg}`);
        }
    }

    return parsed;
}

function requireValue(rawArgs, index, flag) {
    const value = rawArgs[index];

    if (!value || value.startsWith("--")) {
        fail(`Missing value for ${flag}`);
    }

    return value;
}

function readPullRequest(prArg) {
    const ghArgs = ["pr", "view"];

    if (prArg) {
        ghArgs.push(prArg);
    }

    ghArgs.push(
        "--json",
        [
            "baseRefName",
            "headRefName",
            "isDraft",
            "mergeStateStatus",
            "number",
            "reviewDecision",
            "title",
            "url",
        ].join(","),
    );

    return runJson("gh", ghArgs);
}

function readCurrentRepo() {
    const repo = runJson("gh", ["repo", "view", "--json", "nameWithOwner"]);
    const [owner, name] = String(repo.nameWithOwner ?? "").split("/");

    if (!owner || !name) {
        fail("Could not determine the current GitHub repository.");
    }

    return { owner, name };
}

function parsePullRequestUrl(url) {
    const match = String(url).match(
        /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/([0-9]+)/,
    );

    if (!match) {
        return null;
    }

    return {
        owner: match[1],
        name: match[2],
    };
}

function readReviewThreads(repo, number) {
    const query = `
query($owner: String!, $name: String!, $number: Int!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      reviewThreads(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          isResolved
          isOutdated
          path
          line
          originalLine
          startLine
          originalStartLine
          comments(first: 100) {
            nodes {
              id
              author {
                login
              }
              body
              createdAt
              url
              isMinimized
              minimizedReason
            }
          }
        }
      }
    }
  }
}`;
    const threads = [];
    let cursor = null;

    for (;;) {
        const args = [
            "api",
            "graphql",
            "-f",
            `query=${query}`,
            "-F",
            `owner=${repo.owner}`,
            "-F",
            `name=${repo.name}`,
            "-F",
            `number=${number}`,
        ];

        if (cursor) {
            args.push("-F", `cursor=${cursor}`);
        }

        const result = runJson("gh", args);
        const connection =
            result?.data?.repository?.pullRequest?.reviewThreads;

        if (!connection) {
            fail("GitHub did not return review thread data for this PR.");
        }

        threads.push(...(connection.nodes ?? []));

        if (!connection.pageInfo?.hasNextPage) {
            break;
        }

        cursor = connection.pageInfo.endCursor;
    }

    return threads;
}

function readChecks(prArg) {
    const result = run("gh", [
        "pr",
        "checks",
        prArg,
        "--json",
        "bucket,completedAt,description,link,name,startedAt,state,workflow",
    ], { allowFailure: true });

    if (!result.ok) {
        return {
            error: result.stderr.trim() || result.stdout.trim(),
            items: [],
        };
    }

    try {
        return {
            error: null,
            items: JSON.parse(result.stdout),
        };
    } catch (error) {
        return {
            error: `Could not parse gh pr checks JSON: ${error.message}`,
            items: [],
        };
    }
}

function isRelevantBotThread(thread, reviewAuthor) {
    return (
        !thread.isResolved &&
        !thread.isOutdated &&
        (thread.comments?.nodes ?? []).some(
            (comment) => comment.author?.login === reviewAuthor,
        )
    );
}

function isFailingCheck(check) {
    const bucket = String(check.bucket ?? "").toLowerCase();
    const state = String(check.state ?? "").toLowerCase();

    return (
        bucket === "fail" ||
        bucket === "failing" ||
        state === "failure" ||
        state === "failed" ||
        state === "error" ||
        state === "cancelled" ||
        state === "timed_out"
    );
}

function formatThread(thread, reviewAuthor) {
    const comments = thread.comments?.nodes ?? [];
    const firstBotComment = comments.find(
        (comment) => comment.author?.login === reviewAuthor,
    );

    return {
        id: thread.id,
        path: thread.path,
        line: thread.line ?? thread.originalLine ?? null,
        startLine: thread.startLine ?? thread.originalStartLine ?? null,
        url: firstBotComment?.url ?? comments[0]?.url ?? null,
        comments: comments.map((comment) => ({
            author: comment.author?.login ?? null,
            body: comment.body,
            createdAt: comment.createdAt,
            url: comment.url,
            isMinimized: comment.isMinimized,
            minimizedReason: comment.minimizedReason,
        })),
    };
}

function formatCheck(check) {
    return {
        name: check.name,
        workflow: check.workflow,
        state: check.state,
        bucket: check.bucket,
        link: check.link,
        description: check.description,
        startedAt: check.startedAt,
        completedAt: check.completedAt,
    };
}

function printStatusReport(report) {
    const pr = report.pullRequest;

    process.stdout.write(`PR #${pr.number}: ${pr.title}\n`);
    process.stdout.write(`${pr.url}\n`);
    process.stdout.write(`Base: ${pr.baseRefName}\n`);
    process.stdout.write(`Head: ${pr.headRefName}\n`);
    process.stdout.write(`Merge state: ${pr.mergeStateStatus ?? "unknown"}\n`);
    process.stdout.write(`Review decision: ${pr.reviewDecision ?? "unknown"}\n`);
    process.stdout.write(`Draft: ${pr.isDraft ? "yes" : "no"}\n\n`);

    process.stdout.write(
        `Unresolved ${report.reviewAuthor} threads: ${report.unresolvedReviewThreads.length}\n`,
    );
    for (const thread of report.unresolvedReviewThreads) {
        const location = thread.line ? `${thread.path}:${thread.line}` : thread.path;
        const firstComment = thread.comments[0]?.body
            ?.replace(/\s+/g, " ")
            .trim()
            .slice(0, 160);

        process.stdout.write(`- ${thread.id} ${location}\n`);
        if (thread.url) {
            process.stdout.write(`  ${thread.url}\n`);
        }
        if (firstComment) {
            process.stdout.write(`  ${firstComment}\n`);
        }
    }

    process.stdout.write(`\nFailing checks: ${report.checks.failing.length}\n`);
    if (report.checks.error) {
        process.stdout.write(`Checks error: ${report.checks.error}\n`);
    }
    for (const check of report.checks.failing) {
        process.stdout.write(`- ${check.name} [${check.state ?? check.bucket}]\n`);
        if (check.link) {
            process.stdout.write(`  ${check.link}\n`);
        }
        if (check.description) {
            process.stdout.write(`  ${check.description}\n`);
        }
    }
}

function printGlobalHelp() {
    process.stdout.write(`Usage: repair-pr.mjs <command> [options]

Commands:
  status          Show PR merge state, unresolved bot review threads, and failing checks.
  resolve-thread  Resolve a GitHub review thread by node id.

Run "repair-pr.mjs <command> --help" for command-specific options.
`);
}

function printStatusHelp() {
    process.stdout.write(`Usage: repair-pr.mjs status [options]

Options:
  --pr <number-or-url>           PR to inspect. Defaults to the current branch PR.
  --review-author <login>        Review author to filter. Defaults to ${DEFAULT_REVIEW_AUTHOR}.
  --json                         Print machine-readable JSON.
  -h, --help                     Show this help.
`);
}

function printResolveThreadHelp() {
    process.stdout.write(`Usage: repair-pr.mjs resolve-thread <thread-id>

Arguments:
  thread-id                      GitHub review thread GraphQL node id.

Options:
  -h, --help                     Show this help.
`);
}

function runJson(commandName, commandArgs) {
    const result = run(commandName, commandArgs);

    try {
        return JSON.parse(result.stdout);
    } catch (error) {
        fail(
            `Could not parse JSON from ${commandName} ${commandArgs.join(" ")}: ${error.message}`,
        );
    }
}

function run(commandName, commandArgs, options = {}) {
    const result = spawnSync(commandName, commandArgs, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
    });

    if (result.error) {
        fail(result.error.message);
    }

    const ok = result.status === 0;

    if (!ok && !options.allowFailure) {
        const detail = result.stderr.trim() || result.stdout.trim();
        fail(
            detail
                ? `${commandName} ${commandArgs.join(" ")} failed:\n${detail}`
                : `${commandName} ${commandArgs.join(" ")} failed with status ${result.status}`,
        );
    }

    return {
        ok,
        status: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
    };
}

function fail(message) {
    process.stderr.write(`repair-pr: ${message}\n`);
    exit(1);
}
