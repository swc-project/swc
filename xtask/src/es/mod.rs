use anyhow::Result;
use clap::{Args, Subcommand};

use self::minifier::MinifierCmd;
use self::codegen::CodegenCmd;

mod minifier;
mod codegen;

/// Commands for ECMAScript crates.
#[derive(Debug, Args)]
pub(super) struct EsCmd {
    #[clap(subcommand)]
    cmd: Cmd,
}

impl EsCmd {
    pub fn run(self) -> Result<()> {
        match self.cmd {
            Cmd::Minifier(cmd) => cmd.run(),
            Cmd::Codegen(cmd) => cmd.run(),
        }
    }
}

#[derive(Debug, Subcommand)]
enum Cmd {
    Minifier(MinifierCmd),
    Codegen(CodegenCmd),
}
