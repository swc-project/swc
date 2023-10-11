use anyhow::{Context, Result};
use clap::Args;

use crate::util::{repository_root, wrap};

#[derive(Debug, Args)]
pub(super) struct NightlyCmd {}

impl NightlyCmd {
    pub fn run(self) -> Result<()> {
        wrap(|| {
            let root_pkg_json = repository_root()?.join("package.json");
            let content = serde_json::from_reader::<_, serde_json::Value>(
                std::fs::File::open(root_pkg_json).context("failed to open package.json")?,
            )?;
            let version = semver::Version::parse(content["version"].as_str().unwrap())?;

            dbg!(&version);

            Ok(())
        })
        .context("failed to publish nightly version")
    }
}
