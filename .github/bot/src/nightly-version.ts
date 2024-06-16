// npx ts-node .github/bot/src/nightly-version.ts $version

import { octokit, owner, repo } from "./util/octokit";

function addZ(n: number) {
  return n < 10 ? "0" + n : "" + n;
}

async function main() {
  // Default to the core version in packages/core/package.json
  const coreVersion = require("../../../packages/core/package.json").version;

  const version = process.argv[2] || coreVersion;

  console.log(`Version: ${version}\n`);

  // Nightly version

  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const datePart = `${year}${addZ(month)}.${addZ(day)}`;

  const base = `${version}-nightly-${datePart}`;
  let idx = 1;
  let nightlyVersion = `${base}.${idx}`;

  // Check if the nightly version already exists, using octokit and git tags

  const { data: tagData } = await octokit.repos.listTags({
    owner,
    repo,
  });
  const tags = tagData.map((tag) => tag.name);
  while (tags.includes(nightlyVersion)) {
    idx += 1;
    nightlyVersion = `${base}.${idx}`;
  }
  console.log(`Nightly version: ${nightlyVersion}`);

  console.log(`::set-output name=version::${nightlyVersion}`);
}

main();
