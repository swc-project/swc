use build::BuildCommand;
use init::InitCommand;
use publish::PublishCommand;
use structopt::StructOpt;

mod build;
mod init;
mod package;
mod publish;

#[derive(Debug, StructOpt)]
enum Cmd {
    Init(InitCommand),
    Build(BuildCommand),
    Package(BuildCommand),
    Publish(PublishCommand),
}

fn main() {
    let cmd = Cmd::from_args();

    match cmd {
        Cmd::Init(_) => todo!(),
        Cmd::Build(_) => todo!(),
        Cmd::Package(_) => todo!(),
        Cmd::Publish(_) => todo!(),
    }
}
