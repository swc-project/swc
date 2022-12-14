use std::{
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{Context, Result};
use clap::Subcommand;
use serde::de::DeserializeOwned;
use swc_common::SourceMap;

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
