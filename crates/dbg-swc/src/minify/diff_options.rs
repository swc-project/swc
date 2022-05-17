use std::{
    fs,
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::Result;
use clap::Args;
use rayon::prelude::*;
use swc_common::SourceMap;
use swc_ecma_minifier::option::{CompressOptions, MinifyOptions};
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_visit::VisitMutWith;
use tracing::info;

use crate::util::{all_js_files, make_pretty, parse_js, print_js};

/// Useful for checking if the minifier is working correctly, even with the new
/// option.
#[derive(Debug, Args)]
pub struct DiffOptionCommand {
    pub path: PathBuf,
}

impl DiffOptionCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let js_files = all_js_files(&self.path)?;

        let inputs = js_files
            .into_iter()
            .filter(|p| p.file_name() == Some("input.js".as_ref()))
            .collect::<Vec<_>>();

        inputs
            .into_par_iter()
            .map(|f| self.process_file(cm.clone(), &f))
            .collect::<Result<Vec<_>>>()?;

        Ok(())
    }

    fn process_file(&self, cm: Arc<SourceMap>, f: &Path) -> Result<()> {
        info!("Processing `{}`", f.display());

        let fm = cm.load_file(f)?;
        let m = parse_js(fm)?;

        let orig = {
            let m = m.clone();
            let mut m = swc_ecma_minifier::optimize(
                m.module,
                cm.clone(),
                Some(&m.comments),
                None,
                &MinifyOptions {
                    compress: Some(Default::default()),
                    mangle: None,
                    ..Default::default()
                },
                &swc_ecma_minifier::option::ExtraOptions {
                    unresolved_mark: m.unresolved_mark,
                    top_level_mark: m.top_level_mark,
                },
            );
            m.visit_mut_with(&mut fixer(None));
            print_js(cm.clone(), &m, false)?
        };

        let new = {
            let mut m = swc_ecma_minifier::optimize(
                m.module,
                cm.clone(),
                Some(&m.comments),
                None,
                &MinifyOptions {
                    compress: Some(CompressOptions {
                        conditionals: true,
                        ..Default::default()
                    }),
                    mangle: None,
                    ..Default::default()
                },
                &swc_ecma_minifier::option::ExtraOptions {
                    unresolved_mark: m.unresolved_mark,
                    top_level_mark: m.top_level_mark,
                },
            );
            m.visit_mut_with(&mut fixer(None));
            print_js(cm, &m, false)?
        };

        if orig == new {
            fs::remove_file(f)?;
            return Ok(());
        }

        let orig_path = f.with_extension("orig.js");
        fs::write(&orig_path, orig)?;
        make_pretty(&orig_path)?;
        let new_path = f.with_extension("new.js");
        fs::write(&new_path, new)?;
        make_pretty(&new_path)?;

        Ok(())
    }
}
