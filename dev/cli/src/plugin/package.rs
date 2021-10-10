use super::build::BaseCargoCommand;
use structopt::StructOpt;

#[derive(Debug, StructOpt)]
pub struct PackageCommand {
    #[structopt(flatten)]
    pub cargo: BaseCargoCommand,
}
