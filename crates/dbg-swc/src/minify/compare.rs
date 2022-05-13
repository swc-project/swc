use std::{path::PathBuf, sync::Arc};

use anyhow::{Context, Result};
use clap::Args;
use swc_common::SourceMap;
use swc_ecma_minifier::option::MinifyOptions;
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_visit::VisitMutWith;

use super::get_esbuild_output;
use crate::util::{parse_js, print_js};

/// Opens vscode for diffing output of swc minifier and terser/esbuild
#[derive(Debug, Args)]
pub struct CompareCommand {
    pub path: PathBuf,
}

impl CompareCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let fm = cm.load_file(&self.path).context("failed to load file")?;
        let i = parse_js(fm)?;
        let code_mangled = {
            let mut minified_mangled = {
                let m = i.module.clone();
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

        let esbuild_mangled = get_esbuild_output(&self.path, true)?;

        std::fs::write("swc.output.js", code_mangled.as_bytes())
            .context("failed to write swc.output.js")?;
        std::fs::write("esbuild.output.js", esbuild_mangled.as_bytes())
            .context("failed to write swc.output.js")?;

        Ok(())
    }
}
