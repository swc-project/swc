#![feature(box_syntax)]

use std::{env, str::FromStr, sync::Arc};

use anyhow::{bail, Result};
use clap::{StructOpt, Subcommand};
use swc_common::{
    errors::{ColorConfig, HANDLER},
    Globals, SourceMap, GLOBALS,
};
use swc_ecma_minifier::option::MinifyOptions;
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_visit::VisitMutWith;
use swc_error_reporters::handler::{try_with_handler, HandlerOpts};
use tracing_subscriber::EnvFilter;

use self::{
    bundle::BundleCommand,
    minify::MinifyCommand,
    test::TestCommand,
    util::{parse_js, print_js},
};

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
        .pretty()
        .finish();

    tracing::subscriber::set_global_default(logger)?;

    Ok(())
}

fn main() -> Result<()> {
    init()?;

    let cm = Arc::new(SourceMap::default());

    if env::var("CREDUCE_COMPARE").unwrap_or_default() == "1" {
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

                        let fm = cm.load_file("input.js".as_ref())?;

                        let m = parse_js(fm)?;

                        let mut m = {
                            swc_ecma_minifier::optimize(
                                m.module,
                                cm.clone(),
                                None,
                                None,
                                &MinifyOptions {
                                    compress: Some(Default::default()),
                                    mangle: Some(Default::default()),
                                    ..Default::default()
                                },
                                &swc_ecma_minifier::option::ExtraOptions {
                                    unresolved_mark: m.unresolved_mark,
                                    top_level_mark: m.top_level_mark,
                                },
                            )
                        };

                        m.visit_mut_with(&mut fixer(None));

                        let swc_output = print_js(cm.clone(), &m, true)?;

                        let esbuild_output =
                            self::util::minifier::get_esbuild_output("input.js".as_ref(), true)?;

                        if swc_output.len() > esbuild_output.len() {
                            return Ok(());
                        }

                        println!(
                            "swc size = {}, esbuild size = {}",
                            swc_output.len(),
                            esbuild_output.len()
                        );

                        bail!("We don't care about this file")
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
