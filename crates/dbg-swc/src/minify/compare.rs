use std::{path::PathBuf, process::Command, sync::Arc};

use anyhow::{Context, Result};
use clap::Args;
use swc_common::SourceMap;

use crate::util::{
    make_pretty,
    minifier::{get_minified, get_terser_output},
    print_js,
};

/// Opens vscode for diffing output of swc minifier and terser/esbuild
#[derive(Debug, Args)]
pub struct CompareCommand {
    pub path: PathBuf,
}

impl CompareCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let minified_mangled = get_minified(cm.clone(), &self.path, true, true)?;
        let code_mangled = print_js(cm, &minified_mangled.module, true)
            .context("failed to convert ast to code")?;

        let esbuild_mangled = get_terser_output(&self.path, true, true)?;

        eprintln!("swc: {} bytes", code_mangled.as_bytes().len());
        eprintln!(
            "swc: {} bytes (newline stripped)",
            code_mangled.replace("\\n", "_").as_bytes().len()
        );
        std::fs::write("swc.output.js", code_mangled.as_bytes())
            .context("failed to write swc.output.js")?;

        make_pretty("swc.output.js".as_ref())?;

        std::fs::write("terser.output.js", esbuild_mangled.as_bytes())
            .context("failed to write terser.output.js")?;

        eprintln!("terser: {} bytes", esbuild_mangled.as_bytes().len());
        make_pretty("terser.output.js".as_ref())?;

        {
            let mut c = Command::new("code");
            c.arg("--diff");
            c.arg("swc.output.js");
            c.arg("terser.output.js");
            c.output().context("failed to run vscode")?;
        }

        Ok(())
    }
}
