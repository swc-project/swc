use std::{
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use clap::{Args, Subcommand};
use rayon::prelude::*;
use swc_common::{SourceFile, SourceMap, GLOBALS};
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

        let results = GLOBALS.with(|globals| {
            all_files
                .par_iter()
                .map(|js_file| GLOBALS.set(globals, || self.check_file(cm.clone(), js_file)))
                .filter_map(|v| v.transpose())
                .collect::<Result<Vec<_>>>()
        })?;

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
            let i = parse_js(fm.clone())?;

            let code_mangled = {
                let mut minified_mangled = {
                    let m = i.module.clone();
                    let _timer = timer!("minify");
                    swc_ecma_minifier::optimize(
                        m,
                        cm.clone(),
                        None,
                        None,
                        &MinifyOptions {
                            compress: Some(Default::default()),
                            mangle: Some(Default::default()),
                            ..Default::default()
                        },
                        &swc_ecma_minifier::option::ExtraOptions {
                            unresolved_mark: i.unresolved_mark,
                            top_level_mark: i.top_level_mark,
                        },
                    )
                };

                minified_mangled.visit_mut_with(&mut fixer(None));

                print_js(cm.clone(), &minified_mangled, true)
                    .context("failed to convert ast to code")?
            };

            let swc_no_mangle = {
                let mut minified_mangled = {
                    let m = i.module.clone();

                    let _timer = timer!("minify.no-mangle");
                    swc_ecma_minifier::optimize(
                        m,
                        cm.clone(),
                        None,
                        None,
                        &MinifyOptions {
                            compress: Some(Default::default()),
                            mangle: None,
                            ..Default::default()
                        },
                        &swc_ecma_minifier::option::ExtraOptions {
                            unresolved_mark: i.unresolved_mark,
                            top_level_mark: i.top_level_mark,
                        },
                    )
                };

                minified_mangled.visit_mut_with(&mut fixer(None));

                print_js(cm, &minified_mangled, true).context("failed to convert ast to code")?
            };

            // eprintln!("The output size of swc minifier: {}", code_mangled.len());

            let mut size_issue = SizeIssue {
                fm,
                swc: MinifierOutput {
                    mangled_size: code_mangled.len(),
                    no_mangle_size: swc_no_mangle.len(),
                },
                terser: Default::default(),
                esbuild: Default::default(),
            };

            if !self.no_terser {
                let terser_mangled = get_terser_output(js_file, true, true)?;
                let terser_no_mangle = get_terser_output(js_file, true, false)?;

                if terser_mangled.len() < code_mangled.len() {
                    // eprintln!("The output size of terser: {}", terser_mangled.len());
                    // eprintln!(
                    //     "The output size of terser without mangler: {}",
                    //     terser_no_mangle.len()
                    // );

                    size_issue.terser = Some(MinifierOutput {
                        mangled_size: terser_mangled.len(),
                        no_mangle_size: terser_no_mangle.len(),
                    });
                }
            }

            if !self.no_esbuild {
                let esbuild_mangled = get_esbuild_output(js_file, true)?;
                let esbuild_no_mangle = get_esbuild_output(js_file, false)?;

                if esbuild_mangled.len() < code_mangled.len() {
                    // eprintln!("The output size of esbuild: {}", esbuild_mangled.len());
                    // eprintln!(
                    //     "The output size of esbuild without mangler: {}",
                    //     esbuild_no_mangle.len()
                    // );

                    size_issue.esbuild = Some(MinifierOutput {
                        mangled_size: esbuild_mangled.len(),
                        no_mangle_size: esbuild_no_mangle.len(),
                    });
                }
            }

            if size_issue.terser.is_none() && size_issue.esbuild.is_none() {
                return Ok(None);
            }

            Ok(Some(size_issue))
        })
        .with_context(|| format!("failed to check file: {}", js_file.display()))
    }
}

#[derive(Debug)]
struct SizeIssue {
    fm: Arc<SourceFile>,

    swc: MinifierOutput,

    terser: Option<MinifierOutput>,

    esbuild: Option<MinifierOutput>,
}

#[derive(Debug)]
struct MinifierOutput {
    mangled_size: usize,
    no_mangle_size: usize,
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
