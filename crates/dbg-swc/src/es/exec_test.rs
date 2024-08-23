use std::{
    fs,
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use clap::{Args, Subcommand};
use swc_common::SourceMap;
use swc_ecma_minifier::option::MinifyOptions;
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_visit::VisitMutWith;
use swc_timer::timer;
use tracing::info;

use crate::{bundle::bundle, util::print_js};

/// [Experimental] Execute a javascript file after performing some
/// preprocessing.
#[derive(Debug, Subcommand)]
pub enum ExecForTestingCommand {
    MinifiedBundle(TestMinifiedBundleCommand),
}

impl ExecForTestingCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let _timer = timer!("test");

        let output = {
            let _timer = timer!("process");

            match self {
                ExecForTestingCommand::MinifiedBundle(cmd) => cmd.run(cm),
            }?
        };

        {
            let _timer = timer!("run");
            let stdout = output
                .runtime
                .execute(&output.path)
                .context("failed to execute generated code")?;

            info!("----- Stdout -----\n{}", stdout);
        }

        Ok(())
    }
}

#[derive(Debug, Args)]
pub struct TestMinifiedBundleCommand {
    entry: String,
}

impl TestMinifiedBundleCommand {
    fn run(self, cm: Arc<SourceMap>) -> Result<Output> {
        let bundle = bundle(cm.clone(), &self.entry)?;

        let mut minified = {
            let _timer = timer!("minify");
            swc_ecma_minifier::optimize(
                bundle.module.into(),
                cm.clone(),
                None,
                None,
                &MinifyOptions {
                    compress: Some(Default::default()),
                    mangle: Some(Default::default()),
                    ..Default::default()
                },
                &swc_ecma_minifier::option::ExtraOptions {
                    unresolved_mark: bundle.unresolved_mark,
                    top_level_mark: bundle.top_level_mark,
                    mangle_name_cache: None,
                },
            )
            .expect_module()
        };

        minified.visit_mut_with(&mut fixer(None));

        let code = print_js(cm, &minified, true).context("failed to convert ast to code")?;

        let path = Path::new("output.js").to_path_buf();
        fs::write(&path, code.as_bytes()).context("failed to write code as file")?;

        Ok(Output {
            path,
            runtime: JsRuntime::Deno,
        })
    }
}

pub struct Output {
    pub path: PathBuf,
    pub runtime: JsRuntime,
}

pub enum JsRuntime {
    // Node,
    Deno,
}

impl JsRuntime {
    pub fn execute(&self, path: &Path) -> Result<String> {
        match self {
            // JsRuntime::Node => todo!("node.execute"),
            JsRuntime::Deno => {
                let mut cmd = Command::new("deno");
                cmd.arg("run").arg("--no-check");

                cmd.arg(path);

                cmd.stderr(Stdio::inherit());

                let output = cmd.output().context("failed to get output from deno")?;

                if !output.status.success() {
                    bail!("deno exited with status {}", output.status);
                }

                Ok(
                    (String::from_utf8(output.stdout).context("deno emitted non-utf8 string")?)
                        .trim()
                        .to_string(),
                )
            }
        }
    }
}
