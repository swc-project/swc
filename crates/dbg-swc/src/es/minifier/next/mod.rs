use std::{
    fs::remove_dir_all,
    path::Path,
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use clap::Subcommand;
use rayon::prelude::*;
use serde::{de::DeserializeOwned, Deserialize};
use swc_common::SourceMap;
use tracing::info;

use self::check_size::CheckSizeCommand;
use crate::util::wrap_task;

mod check_size;

/// Debug the SWC minifier issues related to next.js application.
#[derive(Debug, Subcommand)]
pub enum NextJsCommand {
    CheckSize(CheckSizeCommand),
}

impl NextJsCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        match self {
            NextJsCommand::CheckSize(cmd) => cmd.run(cm),
        }
    }
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

/// An input file to the SWC minifier.
#[derive(Deserialize)]
struct InputFile {
    name: String,
    source: String,
}

/// Invokes `npm run build` and extacts the inputs for the swc minifier.
fn build_next_js_app(app_dir: &Path) -> Result<Vec<InputFile>> {
    wrap_task(|| {
        info!("Running `npm run build`");

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

        output
            .par_lines()
            .filter(|line| line.contains("{ name:"))
            .map(|line| parse_loose_json::<InputFile>(line).context("failed to parse input file"))
            .collect::<Result<_>>()
    })
    .with_context(|| format!("failed to build app in `{}`", app_dir.display()))
}
