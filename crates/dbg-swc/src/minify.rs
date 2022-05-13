use anyhow::Result;
use clap::{Args, Subcommand};

/// Minify a javascript file.
#[derive(Debug, Subcommand)]
pub enum MinifyCommand {
    EnsureSize(EnsureSize),
}

impl MinifyCommand {
    pub fn run(self) -> Result<()> {
        match self {
            MinifyCommand::EnsureSize(cmd) => cmd.run(),
        }
    }
}

/// Ensure that we are performing better than other minification tools.
#[derive(Debug, Args)]
pub struct EnsureSize {
    #[clap(long)]
    pub no_terser: bool,

    #[clap(long)]
    pub no_esbuild: bool,
}

impl EnsureSize {
    pub fn run(self) -> Result<()> {}
}

fn get_terser_output(code: &str, mangle: bool) -> Result<String> {}

fn get_esbuild_output(code: &str, mangle: bool) -> Result<String> {}
