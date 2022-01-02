use anyhow::Result;
use std::path::PathBuf;
use structopt::StructOpt;

#[derive(Debug, StructOpt)]
pub(crate) struct DiffMinifiedCommand {
    input: PathBuf,

    #[structopt(long)]
    no_mangler: bool,
}

impl DiffMinifiedCommand {
    pub fn run(self) -> Result<()> {
        todo!()
    }
}
