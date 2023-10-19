use std::{path::PathBuf, sync::Arc};

use anyhow::{Context, Result};
use clap::Args;
use swc_common::SourceMap;
use swc_ecma_minifier::option::{CompressOptions, MangleOptions};

use crate::util::{
    all_js_files,
    minifier::{get_minified, get_minified_with_opts},
    print_js,
};

/// [Experimental] Internal command to check the size difference caused by
/// options.
#[derive(Debug, Args)]
pub struct CompareOptsCommand {
    pub path: PathBuf,
}

impl CompareOptsCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let files = all_js_files(&self.path)?;

        let mut default_sum = 0;
        let mut new_sum = 0;

        for file in files {
            let default_record = get_minified(cm.clone(), &file, true, true)?;
            let default_code = print_js(cm.clone(), &default_record.module, true)
                .context("failed to convert ast to code")?;

            eprintln!("default: {} bytes", default_code.as_bytes().len());
            default_sum += default_code.as_bytes().len();

            let new_record = get_minified_with_opts(
                cm.clone(),
                &file,
                Some(CompressOptions {
                    keep_classnames: true,
                    keep_fnames: true,
                    ..Default::default()
                }),
                Some(MangleOptions {
                    keep_class_names: true,
                    keep_fn_names: true,
                    ..Default::default()
                }),
            )?;
            let new_code = print_js(cm.clone(), &new_record.module, true)
                .context("failed to convert ast to code")?;

            eprintln!("new: {} bytes", new_code.as_bytes().len());
            new_sum += new_code.as_bytes().len();
        }

        eprintln!("default (total): {} bytes", default_sum);
        eprintln!("new (total): {} bytes", new_sum);

        Ok(())
    }
}
