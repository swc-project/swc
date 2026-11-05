import { checkContributor, parseContributors, Reason } from "./policy.mjs";

export const NOTICE_MARKER = "<!-- swc-contributor-policy -->";

/** Check the live PR author and optionally close a denied, still-open PR. */
export async function runPolicy({
  eventName,
  event,
  source,
  client,
  closeUntrusted = false,
}) {
  if (!["pull_request", "pull_request_target"].includes(eventName)) {
    return { allowed: true, reason: Reason.NON_PR };
  }
  if (closeUntrusted && eventName !== "pull_request_target") {
    throw new Error(
      "Only pull_request_target may close untrusted pull requests"
    );
  }
  const number = event.pull_request?.number;
  if (!Number.isSafeInteger(number) || number <= 0)
    throw new Error("A pull request number is required");

  // Validate the complete file before making any GitHub changes. A broken group
  // must not silently disappear and close otherwise trusted contributors' PRs.
  const contributors = parseContributors(source);
  const pr = await client.getPullRequest(number);
  assertState(pr);
  if (pr.state === "closed")
    return { allowed: false, reason: Reason.CLOSED, number };
  const decision = await checkContributor({
    author: pr.user,
    contributors,
    getPermission: (login) => client.getPermission(login),
  });
  const result = { ...decision, number, author: pr.user.login };
  if (decision.allowed || !closeUntrusted) return result;

  const hasNotice = await client.hasNotice(number, NOTICE_MARKER);
  const current = await client.getPullRequest(number);
  assertState(current);
  if (current.state === "closed") return result;
  if (!hasNotice) {
    await client.createComment(number, notice(client.repository));
  }
  // A maintainer can merge or close a PR while the notice is being posted.
  const beforeClose = await client.getPullRequest(number);
  assertState(beforeClose);
  if (beforeClose.state === "open") await client.closePullRequest(number);
  return result;
}

function assertState(pr) {
  if (!["open", "closed"].includes(pr?.state)) {
    throw new Error("GitHub returned an invalid pull request state");
  }
}

function notice(repository) {
  return `${NOTICE_MARKER}\n\nThis repository accepts pull requests from approved contributors, users with write access, and bot accounts. Your account is not currently on the approved contributor list, so this pull request is being closed automatically.\n\nPlease [open an issue](https://github.com/${repository}/issues/new/choose) describing the bug or proposed improvement instead of submitting a pull request.`;
}
