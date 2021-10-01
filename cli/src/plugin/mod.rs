use self::{
    build::BuildCommand, init::InitCommand, package::PackageCommand, publish::PublishCommand,
    upgrade_deps::UpgradeDepsCommand,
};
use anyhow::Error;
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
            PluginCommand::Init(_) => todo!(),
            PluginCommand::Build(cmd) => cmd.run().await,
            PluginCommand::Package(_) => todo!(),
            PluginCommand::Publish(_) => todo!(),
            PluginCommand::UpgradeDeps(cmd) => cmd.run().await,
        }
    }
}
