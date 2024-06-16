import { exec } from "child_process";
import { getCommitSha } from "../util/git";
import * as fs from "fs";
import { promisify } from "util";
import * as path from "path";

const execAsync = promisify(exec);

const writeFile = promisify(fs.writeFile);

(async () => {
  const sha = await getCommitSha();
  const filePath = path.resolve(
    __dirname,
    "../../../../crates/swc_core/src/__diagnostics.rs"
  );

  await writeFile(
    filePath,
    `pub(crate) static PKG_SEMVER_FALLBACK: &str = include_str!(concat!(env!("OUT_DIR"), "/core_pkg_version.txt"));
pub(crate) static GIT_SHA: &str = "${sha}";`,
    "utf-8"
  );

  await execAsync(`git config --global user.email "bot@swc.rs"`);
  await execAsync(`git config --global user.name "SWC Bot"`);

  // we won't push, it's only to avoid dirty check for the publish
  await execAsync(`git add ${filePath}`);
  await execAsync(`git commit -m 'build(swc/core): bump sha'`);
})();
