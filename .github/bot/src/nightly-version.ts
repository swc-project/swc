// npx ts-node .github/bot/src/nightly-version.ts $version

import { octokit, owner, repo } from "./util/octokit";

function addZ(n: number) {
  return n < 10 ? "0" + n : "" + n;
}

async function main() {
  // Default to the core version in packages/core/package.json
  const coreVersion = require("../../../packages/core/package.json").version;

  const latest: string = process.argv[2] || coreVersion;

  process.stderr.write(`Previous version: ${latest}\n`);

  // Bump patch version

  const [major, minor, patch] = latest.split("-")[0].split(".").map(Number);

  // Nightly version after 1.2.3 is 1.2.4-nightly-20211020.1
  // Nightly version after 1.2.3-nightly-20211020.1 is 1.2.3-nightly-20211020.2

  const version = `${major}.${minor}.${patch}`;
  // Nightly version

  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const datePart = `${year}${addZ(month)}${addZ(day)}`;

  const base = `v${version}-nightly-${datePart}`;
  let idx = 1;
  let nightlyVersion = `${base}.${idx}`;

  // Check if the nightly version already exists, using octokit and git tags

  const { data: tagData } = await octokit.repos.listTags({
    owner,
    repo,
    order: "desc",
  });
  const tags = tagData.map((tag) => tag.name);
  while (tags.includes(nightlyVersion)) {
    idx += 1;
    nightlyVersion = `${base}.${idx}`;
  }
  process.stderr.write(`Nightly version: ${nightlyVersion}\n`);

  process.stdout.write(`version=${nightlyVersion.substring(1)}\n`);
}

main();
