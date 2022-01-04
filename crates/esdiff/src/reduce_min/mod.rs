use crate::util::{parse, print_js};
use anyhow::{bail, Context, Result};
use std::{
    path::PathBuf,
    process::{Command, Stdio},
    sync::Arc,
};
use structopt::StructOpt;
use swc_common::{comments::NoopComments, Mark, SourceMap};
use swc_ecma_minifier::option::{ExtraOptions, MinifyOptions};
use swc_ecma_transforms_base::{
    fixer::fixer,
    helpers::{Helpers, HELPERS},
    hygiene::hygiene,
    resolver::resolver_with_mark,
};
use swc_ecma_transforms_typescript::strip_with_jsx;
use swc_ecma_visit::{FoldWith, VisitMutWith};
use swc_timer::timer;
use tracing::{info, span, Level};

use self::deps::collect_deps;

mod deps;

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
        let all_files = {
            let _timer = timer!("collect list of files to patch");
            collect_deps(cm.clone(), &self.working_dir, &self.entry)?
        };

        let mut runner = Runner {
            cm: cm.clone(),
            working_dir: self.working_dir,
            build_command: self.build_command,
            test_command: self.test_command,
            expected: Default::default(),
        };

        {
            let _span = span!(Level::ERROR, "initial run, without minification").entered();
            runner.expected = runner.check().context("initial check failed")?;
        }

        runner.run(all_files)
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

            let top_level_mark = Mark::fresh(Mark::root());

            let mut m = parse(&fm).context("failed to parse input file using swc")?;

            let helpers = Helpers::new(false);

            m = HELPERS.set(&helpers, || {
                let mut m = m;
                m.visit_mut_with(&mut resolver_with_mark(top_level_mark));
                m.visit_mut_with(&mut strip_with_jsx(
                    self.cm.clone(),
                    swc_ecma_transforms_typescript::Config {
                        ..Default::default()
                    },
                    NoopComments,
                    top_level_mark,
                ));
                m = m.fold_with(&mut swc_ecma_transforms_react::react(
                    self.cm.clone(),
                    None::<NoopComments>,
                    Default::default(),
                    top_level_mark,
                ));

                m = swc_ecma_minifier::optimize(
                    m,
                    self.cm.clone(),
                    None,
                    None,
                    &MinifyOptions {
                        compress: Some(Default::default()),
                        mangle: None,
                        ..Default::default()
                    },
                    &ExtraOptions { top_level_mark },
                );

                m.visit_mut_with(&mut hygiene());
                m.visit_mut_with(&mut fixer(None));
                m
            });

            let patched = print_js(self.cm.clone(), &m)?;

            std::fs::write(&path, patched.as_bytes()).context("failed to write patched content")?;

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

            let _patch = self.patch_file(file.clone())?;

            let actual = self
                .check()
                .with_context(|| format!("test failed for `{}`", file.display()))?;

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

        if !output.status.success() {
            bail!("test failed");
        }

        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    }
}
