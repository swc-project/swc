use anyhow::{bail, Error};
use std::path::PathBuf;
use structopt::StructOpt;

/// Initializes a plugin project.
#[derive(Debug, StructOpt)]
pub struct InitCommand {}

impl InitCommand {
    pub async fn run(self) -> Result<PathBuf, Error> {
        bail!("Not implemented yet")
    }
}
