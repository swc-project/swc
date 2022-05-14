use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use clap::Args;
use rayon::prelude::*;
use swc_common::{SourceFile, SourceMap, GLOBALS};
use tracing::info;

use crate::util::{
    all_js_files,
    minifier::{get_esbuild_output, get_minified, get_terser_output},
    print_js, wrap_task,
};

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

        info!("Using {} files", all_files.len());

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
            println!("{}", report.fm.name);
        }

        bail!("found some issues")
    }

    fn check_file(&self, cm: Arc<SourceMap>, js_file: &Path) -> Result<Option<SizeIssue>> {
        wrap_task(|| {
            info!("Checking {}", js_file.display());

            let fm = cm.load_file(js_file).context("failed to load file")?;

            let code_mangled = {
                let minified_mangled = get_minified(cm.clone(), js_file, true, true)?;

                print_js(cm.clone(), &minified_mangled.module, true)
                    .context("failed to convert ast to code")?
            };

            let swc_no_mangle = {
                let minified_no_mangled = get_minified(cm.clone(), js_file, true, false)?;

                print_js(cm, &minified_no_mangled.module, true)
                    .context("failed to convert ast to code")?
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

#[allow(unused)]
#[derive(Debug)]
struct SizeIssue {
    fm: Arc<SourceFile>,

    swc: MinifierOutput,

    terser: Option<MinifierOutput>,

    esbuild: Option<MinifierOutput>,
}

#[allow(unused)]
#[derive(Debug)]
struct MinifierOutput {
    mangled_size: usize,
    no_mangle_size: usize,
}
