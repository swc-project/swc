use anyhow::{bail, Context, Result};
use std::{
    path::{Path, PathBuf},
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

        runner.run(vec![self.entry])
    }
}

struct Runner {
    cm: Arc<SourceMap>,

    working_dir: PathBuf,
    build_command: String,
    test_command: String,

    expected: String,
}

/// Restores original content on drop
struct Patch {
    path: PathBuf,
    orig: Arc<String>,
}

impl Drop for Patch {
    fn drop(&mut self) {
        let _ = std::fs::write(&self.path, self.orig.as_bytes());
    }
}

impl Runner {
    fn patch_file(&mut self, path: PathBuf) -> Result<Patch> {
        (|| -> Result<_> {
            let fm = self.cm.load_file(&path).context("failed to load file")?;

            let patch = Patch {
                path: path.clone(),
                orig: fm.src.clone(),
            };

            Ok(patch)
        })()
        .with_context(|| format!("failed to patch file: {}", path.display()))
    }

    fn run(mut self, files: Vec<PathBuf>) -> Result<()> {
        // Patch one file at a time.
        for file in files {
            let _span = span!(Level::ERROR, "patch", file = &*file.display().to_string()).entered();

            let _patch = self.patch_file(file)?;

            let actual = self.check().context("failed to check")?;

            if actual != self.expected {
                bail!("expected: {}, actual: {}", self.expected, actual);
            }
        }

        Ok(())
    }

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
