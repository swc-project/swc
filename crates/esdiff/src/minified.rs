use std::path::PathBuf;
use structopt::StructOpt;

#[derive(Debug, StructOpt)]
pub(crate) struct DiffMinifiedCommand {
    input: PathBuf,
}
