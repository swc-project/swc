use self::{
    build::BuildCommand, init::InitCommand, package::PackageCommand, publish::PublishCommand,
};
use anyhow::Error;
use structopt::StructOpt;

pub mod build;
pub mod init;
pub mod package;
pub mod publish;

/// Manages the plugin. Used for developing plugins.
#[derive(Debug, StructOpt)]
pub enum PluginCommand {
    Init(InitCommand),
    Build(BuildCommand),
    Package(PackageCommand),
    Publish(PublishCommand),
}

impl PluginCommand {
    pub async fn run(self) -> Result<(), Error> {
        match self {
            PluginCommand::Init(_) => todo!(),
            PluginCommand::Build(_) => todo!(),
            PluginCommand::Package(_) => todo!(),
            PluginCommand::Publish(_) => todo!(),
        }
    }
}
