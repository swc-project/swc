use anyhow::{bail, Context, Result};
use std::{
    path::PathBuf,
    process::{Command, Stdio},
    sync::Arc,
};
use structopt::StructOpt;
use swc_common::SourceMap;
use tracing::{info, span, Level};

/// This tool repeat replacing one file with a minified form at a time.
#[derive(Debug, StructOpt)]
pub(crate) struct ReduceMinCommand {
    entry: PathBuf,

    #[structopt(long)]
    working_dir: PathBuf,

    /// This command is invoked using `bash`.
    #[structopt(long = "build")]
    build_command: String,

    /// This command is invoked using `bash`.
    #[structopt(long = "test")]
    test_command: String,
}

impl ReduceMinCommand {
    pub(crate) fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let mut runner = Runner {
            cm,
            working_dir: self.working_dir,
            build_command: self.build_command,
            test_command: self.test_command,
            expected: Default::default(),
        };

        {
            let _span = span!(Level::ERROR, "initial run, without minification").entered();
            runner.expected = runner.check().context("initial check failed")?;
        }

        todo!()
    }
}

struct Runner {
    cm: Arc<SourceMap>,

    working_dir: PathBuf,
    build_command: String,
    test_command: String,

    expected: String,
}

impl Runner {
    /// Build, test, and grab the console output.
    fn check(&mut self) -> Result<String> {
        {
            info!("Building app");

            let mut cmd = Command::new("bash");
            let status = cmd
                .current_dir(&self.working_dir)
                .arg("-c")
                .arg(&self.build_command)
                .status()
                .context("failed to run build command")?;

            if !status.success() {
                bail!("build failed");
            }
        }

        info!("Testing app");

        let mut cmd = Command::new("bash");

        let output = cmd
            .current_dir(&self.working_dir)
            .arg("-c")
            .arg(&self.test_command)
            .stderr(Stdio::inherit())
            .output()
            .context("failed to get test output")?;

        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    }
}
