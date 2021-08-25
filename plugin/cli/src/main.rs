use build::BuildCommand;
use publish::PublishCommand;
use structopt::StructOpt;

mod build;
mod package;
mod publish;

#[derive(Debug, StructOpt)]
enum Cmd {
    Build(BuildCommand),
    Package(BuildCommand),
    Publish(PublishCommand),
}

fn main() {
    let cmd = Cmd::from_args();

    match cmd {
        Cmd::Build(_) => todo!(),
        Cmd::Package(_) => todo!(),
        Cmd::Publish(_) => todo!(),
    }
}
