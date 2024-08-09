use anyhow::Result;
use clap::Args;

use crate::util::get_commit_range_for_swc_core_version;

/// Reduce the difference of the versions of `swc_core`s to the list of commits
/// and pull requests.
#[derive(Debug, Args)]
pub(super) struct CoreVerCmd {
    from: String,

    to: String,
}

impl CoreVerCmd {
    pub fn run(self) -> Result<()> {
        let from_commit = get_commit_range_for_swc_core_version(&self.from)?.first;
        let to_commit = get_commit_range_for_swc_core_version(&self.to)?.last;

        eprintln!(
            "GitHub diff: https://github.com/swc-project/swc/compare/{from_commit}...{to_commit}"
        );

        Ok(())
    }
}
