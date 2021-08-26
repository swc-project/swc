use self::{
    build::BuildCommand, init::InitCommand, package::PackageCommand, publish::PublishCommand,
};
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
