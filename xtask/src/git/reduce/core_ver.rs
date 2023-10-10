use anyhow::Result;
use clap::Args;

/// Reduce the difference of the versions of `swc_core`s to the list of commits
/// and pull requests.
#[derive(Debug, Args)]
pub(super) struct CoreVerCmd {}

impl CoreVerCmd {
    pub fn run(self) -> Result<()> {}
}

fn regexp_for(version: &str) -> String {
    return format!(
        r#"name = "swc_core"
    version = "{}""#,
        version
    );
}
