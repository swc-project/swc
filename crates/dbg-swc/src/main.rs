use std::{env, path::PathBuf, str::FromStr, sync::Arc};

use anyhow::{bail, Result};
use clap::{StructOpt, Subcommand};
use es::EsCommand;
use swc_common::{
    errors::{ColorConfig, HANDLER},
    Globals, SourceMap, GLOBALS,
};
use swc_error_reporters::handler::{try_with_handler, HandlerOpts};
use tracing_subscriber::EnvFilter;

use self::util::print_js;
use crate::util::minifier::{get_minified, get_terser_output};

mod bundle;
mod es;
mod util;

const CREDUCE_INPUT_ENV_VAR: &str = "CREDUCE_INPUT";

const CREDUCE_MODE_ENV_VAR: &str = "CREDUCE_COMPARE";

#[derive(Debug, clap::Parser)]
struct AppArgs {
    #[clap(subcommand)]
    cmd: Cmd,
}

#[derive(Debug, Subcommand)]
enum Cmd {
    #[clap(subcommand)]
    Es(EsCommand),
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

    if let Ok(mode) = env::var(CREDUCE_MODE_ENV_VAR) {
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
                        let input = PathBuf::from(
                            env::var(CREDUCE_INPUT_ENV_VAR)
                                .expect("creduce is invoked without the name of input file"),
                        );

                        if mode == "SIZE" {
                            let m = get_minified(cm.clone(), &input, true, true)?;

                            let swc_output = print_js(cm.clone(), &m.module, true)?;

                            let terser_output = get_terser_output(&input, true, true)?;
                            if swc_output.trim().len() > terser_output.trim().len() {
                                // It's interesting, as our output is larger than terser's.
                                return Ok(());
                            }

                            bail!("We don't care about this file")
                        } else if mode == "SEMANTICS" {
                            let m = get_minified(cm.clone(), &input, true, false)?;

                            let swc_output = print_js(cm.clone(), &m.module, true)?;

                            let terser_output = get_terser_output(&input, true, false)?;

                            if swc_output.trim() == terser_output.trim() {
                                bail!("We don't care about this file")
                            }

                            // It's interesting, as our output may have a bug

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
                    Cmd::Es(cmd) => cmd.run(cm),
                })
            })
        },
    )
}
