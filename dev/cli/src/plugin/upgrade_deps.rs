use crate::util::cargo::upgrade::upgrade_dep;
use anyhow::Error;
use structopt::StructOpt;
use tracing::info;

/// Upgrade dependencies related to `swc`.
#[derive(Debug, StructOpt)]
pub struct UpgradeDepsCommand {
    /// Run upgrade command for all crates in the current workspace.
    #[structopt(long)]
    pub workspace: bool,
}

impl UpgradeDepsCommand {
    pub async fn run(self) -> Result<(), Error> {
        for crate_name in &["swc_atoms", "swc_common", "swc_plugin"] {
            info!("Upgrading {}", crate_name);
            upgrade_dep(&crate_name, self.workspace).await?;
        }

        Ok(())
    }
}
