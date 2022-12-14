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
        let record = get_minified(cm.clone(), &self.path, true, false)?;
        let code = print_js(cm, &record.module, true).context("failed to convert ast to code")?;

        let terser_mangled = get_terser_output(&self.path, true, false)?;

        eprintln!("swc: {} bytes", code.as_bytes().len());
        eprintln!(
            "swc: {} bytes (newline stripped)",
            code.replace("\\n", "_").as_bytes().len()
        );
        std::fs::write("swc.output.js", code.as_bytes())
            .context("failed to write swc.output.js")?;

        make_pretty("swc.output.js".as_ref())?;

        std::fs::write("terser.output.js", terser_mangled.as_bytes())
            .context("failed to write terser.output.js")?;

        eprintln!("terser: {} bytes", terser_mangled.as_bytes().len());
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
