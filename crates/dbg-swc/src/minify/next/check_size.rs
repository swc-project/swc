use std::{
    env::current_dir,
    fs::remove_dir_all,
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use clap::Args;
use serde::{de::DeserializeOwned, Deserialize};
use swc_common::SourceMap;

use crate::util::wrap_task;

#[derive(Debug, Args)]
pub struct CheckSizeCommand {
    /// The directory store inputs to the swc minifier.
    #[clap(long, short = 'w', default_value = ".swc/dbg-swc")]
    workspace: PathBuf,

    /// Rerun `npm run build` even if `workspace` is not empty.
    #[clap(long)]
    ensure_fresh: bool,
}

impl CheckSizeCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let app_dir = current_dir().context("failed to get current directory")?;

        self.store_minifier_inputs(&app_dir)?;

        Ok(())
    }

    /// Invokes `npm run build` with appropriate environment variables, and
    /// store the result in `self.workspace`.
    fn store_minifier_inputs(&self, app_dir: &Path) -> Result<()> {
        wrap_task(|| {
            if !self.ensure_fresh {}

            self.build_app(app_dir)
        })
        .context("failed to extract inputs for the swc minifier")
    }

    /// Invokes `npm run build`
    fn build_app(&self, app_dir: &Path) -> Result<()> {
        wrap_task(|| {
            // Remove cache
            let _ = remove_dir_all(app_dir.join(".next"));

            let mut c = Command::new("npm");
            c.current_dir(app_dir);
            c.env("FORCE_COLOR", "3");
            c.env("NEXT_DEBUG_MINIFY", "1");
            c.arg("run").arg("build");

            c.stderr(Stdio::inherit());

            let output = c
                .output()
                .context("failed to get output of `npm run build`")?;

            if !output.status.success() {
                bail!("`npm run build` failed");
            }

            let output = String::from_utf8_lossy(&output.stdout);
            for line in output.lines() {
                if line.contains("{ name:") {
                    let input_file: InputFile =
                        parse_loose_json(line).context("failed to parse input file")?;

                    eprintln!("{}", input_file.name);
                }
            }

            Ok(())
        })
        .with_context(|| format!("failed to build app in `{}`", app_dir.display()))
    }
}

#[derive(Deserialize)]
struct InputFile {
    name: String,
    source: String,
}

fn parse_loose_json<T>(s: &str) -> Result<T>
where
    T: DeserializeOwned,
{
    wrap_task(|| {
        let mut c = Command::new("node");

        c.arg("-e");
        c.arg(
            r###"
            function looseJsonParse(obj) {
                return Function('"use strict";return (' + obj + ")")();
            }
            console.log(JSON.stringify(looseJsonParse(process.argv[1])));
            "###,
        );

        c.arg(s);

        c.stderr(Stdio::inherit());

        let json_str = c
            .output()
            .context("failed to parse json loosely using node")?
            .stdout;

        serde_json::from_slice(&json_str).context("failed to parse json")
    })
    .with_context(|| format!("failed to parse loose json: {}", s))
}
