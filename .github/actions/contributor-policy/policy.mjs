import { parseDocument } from "yaml";

export const Reason = Object.freeze({
  BOT: "bot",
  REPOSITORY_WRITER: "repository-writer",
  ALLOWLIST: "allowlist",
  UNLISTED: "unlisted",
  CLOSED: "closed",
  NON_PR: "non-pull-request",
});

const permissions = new Set([
  "none",
  "read",
  "triage",
  "write",
  "maintain",
  "admin",
]);
const writePermissions = new Set(["write", "maintain", "admin"]);

/** Parse the grouped allowlist once, rejecting malformed or ambiguous YAML. */
export function parseContributors(source) {
  const document = parseDocument(source, { uniqueKeys: true });
  if (document.errors.length || document.warnings.length) {
    throw new Error("Invalid contributor YAML", {
      cause: document.errors[0] ?? document.warnings[0],
    });
  }
  const config = document.toJS({ maxAliasCount: 0 });
  if (
    !isMapping(config) ||
    Object.keys(config).some((key) => key !== "groups") ||
    !isMapping(config.groups)
  ) {
    throw new Error("Contributor YAML must contain a groups mapping");
  }

  const contributors = new Map();
  for (const [group, users] of Object.entries(config.groups)) {
    if (!group.trim() || !Array.isArray(users)) {
      throw new Error(
        "Each contributor group must be a list of GitHub usernames"
      );
    }
    for (const login of users) {
      if (
        typeof login !== "string" ||
        !/^[a-z\d](?:[a-z\d-]*[a-z\d])?(?:\[bot\])?$/i.test(login)
      ) {
        throw new Error(
          `Invalid GitHub username in contributor group ${group}`
        );
      }
      contributors.set(login.toLowerCase(), group);
    }
  }
  return contributors;
}

/** Bots and repository writers bypass the manually maintained user groups. */
export async function checkContributor({
  author,
  contributors,
  getPermission,
}) {
  if (
    !author ||
    typeof author.login !== "string" ||
    !author.login ||
    !["User", "Bot"].includes(author.type)
  ) {
    throw new Error("Pull request is missing a supported author account");
  }
  if (author.type === "Bot") return { allowed: true, reason: Reason.BOT };

  const group = contributors.get(author.login.toLowerCase());
  if (group !== undefined)
    return { allowed: true, reason: Reason.ALLOWLIST, group };

  const permission = await getPermission(author.login);
  if (!permissions.has(permission)) {
    throw new Error("GitHub returned an unsupported repository permission");
  }
  if (writePermissions.has(permission)) {
    return { allowed: true, reason: Reason.REPOSITORY_WRITER };
  }
  return { allowed: false, reason: Reason.UNLISTED };
}

function isMapping(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
