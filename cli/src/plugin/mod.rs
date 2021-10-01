use self::{
    build::BuildCommand, init::InitCommand, package::PackageCommand, publish::PublishCommand,
    upgrade_deps::UpgradeDepsCommand,
};
use anyhow::{Context, Error};
use structopt::StructOpt;

pub mod build;
pub mod init;
pub mod package;
pub mod publish;
pub mod upgrade_deps;

/// Manages the plugin. Used for developing plugins.
#[derive(Debug, StructOpt)]
pub enum PluginCommand {
    Init(InitCommand),
    Build(BuildCommand),
    Package(PackageCommand),
    Publish(PublishCommand),
    UpgradeDeps(UpgradeDepsCommand),
}

impl PluginCommand {
    pub async fn run(self) -> Result<(), Error> {
        match self {
            PluginCommand::Init(cmd) => {
                cmd.run()
                    .await
                    .context("failed to initialize a plugin project")?;
            }
            PluginCommand::Build(cmd) => {
                cmd.run()
                    .await
                    .context("failed to build a plugin project")?;
            }
            PluginCommand::Package(_) => todo!(),
            PluginCommand::Publish(_) => todo!(),
            PluginCommand::UpgradeDeps(cmd) => {
                cmd.run().await.context("failed to upgrade dependencies")?;
            }
        }

        Ok(())
    }
}
