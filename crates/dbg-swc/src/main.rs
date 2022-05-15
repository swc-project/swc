#![feature(box_syntax)]

use std::{env, str::FromStr, sync::Arc};

use anyhow::{bail, Result};
use clap::{StructOpt, Subcommand};
use swc_common::{
    errors::{ColorConfig, HANDLER},
    Globals, SourceMap, GLOBALS,
};
use swc_error_reporters::handler::{try_with_handler, HandlerOpts};
use tracing_subscriber::EnvFilter;

use self::{
    bundle::BundleCommand,
    minify::MinifyCommand,
    test::TestCommand,
    util::{minifier::get_esbuild_output, print_js},
};
use crate::util::minifier::{get_minified, get_terser_output};

mod bundle;
mod minify;
mod test;
mod util;

#[derive(Debug, clap::Parser)]
struct AppArgs {
    #[clap(subcommand)]
    cmd: Cmd,
}

#[derive(Debug, Subcommand)]
enum Cmd {
    #[clap(subcommand)]
    Bundle(BundleCommand),
    #[clap(subcommand)]
    Minify(MinifyCommand),
    #[clap(subcommand)]
    Test(TestCommand),
}

fn init() -> Result<()> {
    let log_env =
        env::var("RUST_LOG").unwrap_or_else(|_| "info,swc_ecma_minifier=warn,swc_timer=off".into());

    let logger = tracing_subscriber::FmtSubscriber::builder()
        .without_time()
        .with_target(false)
        .with_ansi(true)
        .with_env_filter(EnvFilter::from_str(&log_env).unwrap())
        .with_writer(std::io::stderr)
        .pretty()
        .finish();

    tracing::subscriber::set_global_default(logger)?;

    Ok(())
}

fn main() -> Result<()> {
    init()?;

    let cm = Arc::new(SourceMap::default());

    if let Ok(mode) = env::var("CREDUCE_COMPARE") {
        return try_with_handler(
            cm.clone(),
            HandlerOpts {
                color: ColorConfig::Always,
                skip_filename: false,
            },
            |handler| {
                GLOBALS.set(&Globals::default(), || {
                    HANDLER.set(handler, || {
                        //

                        if mode == "SIZE" {
                            let m = get_minified(cm.clone(), "input.js".as_ref(), true, true)?;

                            let swc_output = print_js(cm.clone(), &m.module, true)?;

                            let terser_output = get_terser_output("input.js".as_ref(), true, true)?;
                            if swc_output.len() > terser_output.len() {
                                return Ok(());
                            }

                            // We only care about length, so we can replace it.
                            //
                            // We target es5, but esbuild does not support it
                            let swc_output = swc_output.replace("\\n", "_");

                            let esbuild_output = get_esbuild_output("input.js".as_ref(), true)?;

                            if swc_output.len() > esbuild_output.len() {
                                return Ok(());
                            }

                            println!(
                                "swc size = {}, esbuild size = {}",
                                swc_output.len(),
                                esbuild_output.len()
                            );

                            bail!("We don't care about this file")
                        } else if mode == "SEMANTICS" {
                            let m = get_minified(cm.clone(), "input.js".as_ref(), true, false)?;

                            let swc_output = print_js(cm.clone(), &m.module, true)?;

                            let terser_output =
                                get_terser_output("input.js".as_ref(), true, false)?;

                            if swc_output.len() <= 1000 || terser_output.len() <= 1000 {
                                bail!("We don't care about this file because it's too small")
                            }

                            if swc_output.trim() == terser_output.trim() {
                                bail!("We don't care about this file")
                            }

                            Ok(())
                        } else {
                            unreachable!("Unknown mode `{}`", mode)
                        }
                    })
                })
            },
        );
    }

    let args = AppArgs::parse();

    try_with_handler(
        cm.clone(),
        HandlerOpts {
            color: ColorConfig::Always,
            skip_filename: false,
        },
        |handler| {
            GLOBALS.set(&Globals::default(), || {
                HANDLER.set(handler, || match args.cmd {
                    Cmd::Bundle(_) => todo!(),
                    Cmd::Minify(cmd) => cmd.run(cm),
                    Cmd::Test(cmd) => cmd.run(cm),
                })
            })
        },
    )
}
