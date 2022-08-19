use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{Context, Result};
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

        let mut results = GLOBALS.with(|globals| {
            all_files
                .par_iter()
                .map(|js_file| GLOBALS.set(globals, || self.check_file(cm.clone(), js_file)))
                .filter_map(|v| v.transpose())
                .collect::<Result<Vec<_>>>()
        })?;

        results.sort_by_key(|f| {
            if let Some(terser) = &f.terser {
                f.swc.mangled_size as isize - terser.mangled_size as isize
            } else {
                0
            }
        });

        for f in &results {
            if let Some(terser) = &f.terser {
                if f.swc.mangled_size > terser.mangled_size
                    || f.swc.no_mangle_size > terser.no_mangle_size
                {
                    println!();
                    println!("{}", f.fm.name);
                }
                if f.swc.mangled_size > terser.mangled_size {
                    println!("  Mangled");
                    println!("    swc: {} bytes", f.swc.mangled_size);
                    println!("    terser: {} bytes", terser.mangled_size);
                }

                if f.swc.no_mangle_size > terser.no_mangle_size {
                    println!("  No-mangle");
                    println!("    swc: {} bytes", f.swc.no_mangle_size);
                    println!("    terser: {} bytes", terser.no_mangle_size);
                }
            }
        }

        let swc_total = results.iter().map(|f| f.swc.mangled_size).sum::<usize>();
        let terser_total = results
            .iter()
            .flat_map(|f| f.terser.map(|v| v.mangled_size))
            .sum::<usize>();

        println!("Total");
        println!("  swc: {} bytes", swc_total);
        println!("  terser: {} bytes", terser_total);
        println!("  Size ratio: {}", swc_total as f64 / terser_total as f64);

        let swc_smaller_file_count = results
            .iter()
            .filter(|f| {
                if let Some(terser) = &f.terser {
                    f.swc.mangled_size <= terser.mangled_size
                } else {
                    false
                }
            })
            .count();
        println!(
            "swc produced smaller or equal output for {} files out of {} files, {:.2}%",
            swc_smaller_file_count,
            all_files.len(),
            100.0 * swc_smaller_file_count as f64 / results.len() as f64
        );

        Ok(())
    }

    fn check_file(&self, cm: Arc<SourceMap>, js_file: &Path) -> Result<Option<FileSize>> {
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

            let mut file_size = FileSize {
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

                file_size.terser = Some(MinifierOutput {
                    mangled_size: terser_mangled.len(),
                    no_mangle_size: terser_no_mangle.len(),
                });
            }

            if !self.no_esbuild {
                let esbuild_mangled = get_esbuild_output(js_file, true)?;
                let esbuild_no_mangle = get_esbuild_output(js_file, false)?;

                file_size.esbuild = Some(MinifierOutput {
                    mangled_size: esbuild_mangled.len(),
                    no_mangle_size: esbuild_no_mangle.len(),
                });
            }

            if file_size.terser.is_none() && file_size.esbuild.is_none() {
                return Ok(None);
            }

            Ok(Some(file_size))
        })
        .with_context(|| format!("failed to check file: {}", js_file.display()))
    }
}

#[allow(unused)]
#[derive(Debug)]
struct FileSize {
    fm: Arc<SourceFile>,

    swc: MinifierOutput,

    terser: Option<MinifierOutput>,

    esbuild: Option<MinifierOutput>,
}

#[allow(unused)]
#[derive(Debug, Clone, Copy)]
struct MinifierOutput {
    mangled_size: usize,
    no_mangle_size: usize,
}
