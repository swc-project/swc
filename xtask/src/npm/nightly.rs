use std::process::{Command, Stdio};

use anyhow::{Context, Result};
use chrono::Utc;
use clap::Args;
use semver::{Prerelease, Version};

use crate::util::{repository_root, wrap};

#[derive(Debug, Args)]
pub(super) struct NightlyCmd {}

impl NightlyCmd {
    pub fn run(self) -> Result<()> {
        wrap(|| {
            let date = Utc::now().format("%Y%m%d").to_string();

            let root_pkg_json = repository_root()?.join("package.json");
            let content = serde_json::from_reader::<_, serde_json::Value>(
                std::fs::File::open(root_pkg_json).context("failed to open package.json")?,
            )?;
            let prev_version = Version::parse(content["version"].as_str().unwrap())?;

            let version = find_first_nightly(&prev_version, &date)?;

            println!("Publishing nightly version {}", version);

            Ok(())
        })
        .context("failed to publish nightly version")
    }
}

fn find_first_nightly(prev_version: &semver::Version, date: &str) -> Result<Version> {
    let mut ver = prev_version.clone();

    for i in 0.. {
        ver.pre = Prerelease::new(&format!("nightly.{}.{}", date, i))?;

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
