use std::{path::Path, process::Command};

use anyhow::Result;
use clap::Args;
use walkdir::WalkDir;

use crate::util::{repository_root, run_cmd};

/// Run one or more benchmarks
#[derive(Debug, Args)]
pub(super) struct BenchCmd {
    #[clap(long, short = 'p')]
    package: String,

    /// Build benchmarks in debug mode.
    #[clap(long)]
    debug: bool,

    #[clap(long)]
    no_lib: bool,

    #[clap(long)]
    benches: bool,

    #[clap(long)]
    bench: Option<String>,

    /// Instrument using https://github.com/dudykr/ddt
    #[clap(long)]
    instrument: bool,

    args: Vec<String>,
}

impl BenchCmd {
    pub fn run(self) -> Result<()> {
        let mut cmd = self.build_cmd()?;

        run_cmd(&mut cmd)
    }

    fn build_cmd(&self) -> Result<Command> {
        let mut cmd = if self.instrument {
            // ddt profile instruments cargo -t time
            let mut cmd = Command::new("ddt");
            cmd.arg("profile").arg("instruments").arg("cargo");
            cmd.arg("-t").arg("time");

            if !self.debug {
                cmd.arg("--release");
            }
            cmd
        } else {
            let mut cmd = Command::new("cargo");
            cmd.arg("bench");

            if self.debug {
                cmd.arg("--debug");
            }

            cmd
        };

        cmd.arg("--package").arg(&self.package);

        if self.benches {
            cmd.arg("--benches");
        }

        if let Some(b) = &self.bench {
            cmd.arg("--bench").arg(b);
        }

        if self.instrument {
            cmd.arg("--").arg("--bench").args(&self.args);
        } else {
            cmd.arg("--").args(&self.args);
        }

        Ok(cmd)
    }
}
