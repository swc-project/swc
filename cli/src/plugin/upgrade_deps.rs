use crate::util::cargo::upgrade::upgrade_dep;
use anyhow::Error;
use structopt::StructOpt;
use tracing::info;

#[derive(Debug, StructOpt)]
pub struct UpgradeDepsCommand {}

impl UpgradeDepsCommand {
    pub async fn run(self) -> Result<(), Error> {
        for crate_name in &["swc_atoms", "swc_common", "swc_plugin"] {
            info!("Upgrading {}", crate_name);
            upgrade_dep(&crate_name, true).await?;
        }

        Ok(())
    }
}
