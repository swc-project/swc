#![feature(box_syntax)]

use std::{env, str::FromStr, sync::Arc};

use anyhow::Result;
use clap::{StructOpt, Subcommand};
use swc_common::{
    errors::{ColorConfig, HANDLER},
    Globals, SourceMap, GLOBALS,
};
use swc_error_reporters::handler::{try_with_handler, HandlerOpts};
use tracing_subscriber::EnvFilter;

use self::{bundle::BundleCommand, minify::MinifyCommand, test::TestCommand};

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

fn main() -> Result<()> {
    let log_env =
        env::var("RUST_LOG").unwrap_or_else(|_| "info,swc_ecma_minifier=warn,swc_timer=off".into());

    let logger = tracing_subscriber::FmtSubscriber::builder()
        .without_time()
        .with_target(false)
        .with_ansi(true)
        .with_env_filter(EnvFilter::from_str(&log_env).unwrap())
        .with_test_writer()
        .pretty()
        .finish();

    tracing::subscriber::set_global_default(logger)?;

    let args = AppArgs::parse();

    let cm = Arc::new(SourceMap::default());

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
