use build::BuildCommand;
use structopt::StructOpt;

mod build;
mod package;

#[derive(Debug, StructOpt)]
enum Cmd {
    Build(BuildCommand),
    Package(BuildCommand),
}

fn main() {
    let cmd = Cmd::from_args();

    match cmd {
        Cmd::Build(_) => todo!(),
        Cmd::Package(_) => todo!(),
    }
}
