use std::{
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use clap::{Args, Subcommand};
use rayon::prelude::*;
use swc_common::SourceMap;
use swc_ecma_minifier::option::MinifyOptions;
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_visit::VisitMutWith;
use swc_timer::timer;

use crate::util::{all_js_files, parse_js, print_js, wrap_task};

/// Minify a javascript file.
#[derive(Debug, Subcommand)]
pub enum MinifyCommand {
    EnsureSize(EnsureSize),
}

impl MinifyCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        match self {
            MinifyCommand::EnsureSize(cmd) => cmd.run(cm),
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

    /// This can be a directyory or a file.
    ///
    /// If this is a directory, all `.js` files in it will be verified.
    pub path: PathBuf,
}

impl EnsureSize {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let all_files = all_js_files(&self.path)?;

        dbg!(&all_files);

        let results = all_files
            .par_iter()
            .map(|js_file| self.check_file(cm.clone(), &js_file))
            .map(|v| v.transpose())
            .flatten()
            .collect::<Result<Vec<_>>>()?;

        if results.is_empty() {
            return Ok(());
        }
        for report in &results {
            dbg!(&report);
        }

        bail!("found some issues")
    }

    fn check_file(&self, cm: Arc<SourceMap>, js_file: &Path) -> Result<Option<SizeIssue>> {
        wrap_task(|| {
            let fm = cm.load_file(js_file).context("failed to load file")?;
            let module = parse_js(fm)?;

            let mut minified = {
                let _timer = timer!("minify");
                swc_ecma_minifier::optimize(
                    module.module,
                    cm.clone(),
                    None,
                    None,
                    &MinifyOptions {
                        compress: Some(Default::default()),
                        mangle: Some(Default::default()),
                        ..Default::default()
                    },
                    &swc_ecma_minifier::option::ExtraOptions {
                        unresolved_mark: module.unresolved_mark,
                        top_level_mark: module.top_level_mark,
                    },
                )
            };

            minified.visit_mut_with(&mut fixer(None));

            let code = print_js(cm, &minified, true).context("failed to convert ast to code")?;

            eprintln!("The output size of swc minifier: {}", code.len());

            Ok(None)
        })
        .with_context(|| format!("failed to check file: {}", js_file.display()))
    }
}

#[derive(Debug)]
struct SizeIssue {
    filename: PathBuf,

    /// `true` if the output is gathered with mangler enabled.
    mangler_enabled: bool,
}

fn get_terser_output(file: &Path, compress: bool, mangle: bool) -> Result<String> {
    wrap_task(|| {
        let mut cmd = Command::new("terser");
        cmd.stderr(Stdio::inherit());

        if compress {
            cmd.arg("--compress");
        }
        if mangle {
            cmd.arg("--mangle");
        }
        cmd.arg("--");
        cmd.arg(file);

        let output = cmd.output().context("failed to get output")?;

        if !output.status.success() {
            bail!("failed to run terser");
        }

        String::from_utf8(output.stdout).context("terser emitted non-utf8 string")
    })
    .with_context(|| format!("failed to get output of {} from terser", file.display()))
}

fn get_esbuild_output(file: &Path, mangle: bool) -> Result<String> {
    wrap_task(|| {
        let mut cmd = Command::new("esbuild");
        cmd.stderr(Stdio::inherit());

        cmd.arg(file);

        if mangle {
            cmd.arg("--minify");
        } else {
            cmd.arg("--minify-syntax").arg("--minify-whitespace");
        }

        let output = cmd.output().context("failed to get output")?;

        if !output.status.success() {
            bail!("failed to run esbuild");
        }

        String::from_utf8(output.stdout).context("esbuild emitted non-utf8 string")
    })
    .with_context(|| format!("failed to get output of {} from esbuild", file.display()))
}
