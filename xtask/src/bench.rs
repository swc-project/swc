use std::process::Command;

use anyhow::Result;
use clap::Args;

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

    #[clap(long)]
    features: Vec<String>,

    args: Vec<String>,
}

impl BenchCmd {
    pub fn run(self) -> Result<()> {
        let mut cmd = self.build_cmd()?;

        cmd.env("RUST_LOG", "off");
        cmd.env("CARGO_PROFILE_RELEASE_DEBUG", "true");
        cmd.env("CARGO_PROFILE_BENCH_DEBUG", "true");

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

            // TODO: This should use cargo metadata
            cmd.current_dir(repository_root()?.join("crates").join(&self.package));

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

        for f in self.features.iter() {
            cmd.arg("--features").arg(f);
        }

        if self.instrument {
            cmd.arg("--").arg("--bench").args(&self.args);
        } else {
            cmd.arg("--").args(&self.args);
        }

        Ok(cmd)
    }
}
