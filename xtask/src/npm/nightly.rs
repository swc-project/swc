use std::process::{Command, Stdio};

use anyhow::{Context, Result};
use chrono::Utc;
use clap::Args;
use semver::{Prerelease, Version};

use crate::{
    npm::util::{bump_swc_cli, set_version, update_swc_crates},
    util::{repository_root, wrap},
};

#[derive(Debug, Args)]
pub(super) struct NightlyCmd {
    #[clap(long)]
    git: bool,
}

impl NightlyCmd {
    pub fn run(self) -> Result<()> {
        wrap(|| {
            let date = Utc::now().format("%Y%m%d").to_string();

            update_swc_crates().context("failed to update swc crates")?;

            let root_pkg_json = repository_root()?.join("./packages/core/package.json");
            let content = serde_json::from_reader::<_, serde_json::Value>(
                std::fs::File::open(root_pkg_json)
                    .context("failed to open ./packages/core/package.json")?,
            )?;
            let prev_version = Version::parse(content["version"].as_str().unwrap())?;

            let version = find_first_nightly(&prev_version, &date)?;

            println!("Publishing nightly version {}", version);

            set_version(&version).context("failed to set version")?;
            bump_swc_cli().context("failed to bump swc-cli")?;

            if self.git {
                // git add -A
                Command::new("git")
                    .current_dir(repository_root()?)
                    .arg("add")
                    .arg("-A")
                    .stderr(Stdio::inherit())
                    .status()
                    .context("git add failed")?;

                // git commit --no-verify -m 'chore: Publish $version'

                Command::new("git")
                    .current_dir(repository_root()?)
                    .arg("commit")
                    .arg("--no-verify")
                    .arg("-m")
                    .arg(format!("chore: Publish {}", version))
                    .stderr(Stdio::inherit())
                    .status()
                    .context("git commit failed")?;

                // git tag $version

                Command::new("git")
                    .current_dir(repository_root()?)
                    .arg("tag")
                    .arg(format!("v{}", version))
                    .stderr(Stdio::inherit())
                    .status()
                    .context("git tag failed")?;
            }

            Ok(())
        })
        .context("failed to publish nightly version")
    }
}

fn find_first_nightly(prev_version: &semver::Version, date: &str) -> Result<Version> {
    let mut ver = prev_version.clone();

    if prev_version.pre.is_empty() {
        ver.patch += 1;
    }

    for i in 1.. {
        ver.pre = Prerelease::new(&format!("nightly-{}.{}", date, i))?;

        if ver <= *prev_version {
            continue;
        }

        let tag = format!("v{}", ver);

        let output = Command::new("git")
            .arg("tag")
            .arg("-l")
            .stderr(Stdio::inherit())
            .output()
            .context("git tag -l failed")
            .map(|v| v.stdout)
            .and_then(|s| String::from_utf8(s).context("git tag -l returned non-utf8"))?;

        if !output.contains(&tag) {
            return Ok(ver);
        }
    }

    unreachable!("failed to find a free nightly version")
}
