use build::BuildCommand;
use init::InitCommand;
use publish::PublishCommand;
use structopt::StructOpt;

pub mod build;
pub mod init;
pub mod package;
pub mod publish;

#[derive(Debug, StructOpt)]
pub enum PluginCommand {
    Init(InitCommand),
    Build(BuildCommand),
    Package(BuildCommand),
    Publish(PublishCommand),
}
