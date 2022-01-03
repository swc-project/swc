use crate::minified::DiffMinifiedCommand;
use anyhow::Result;
use std::{env, io::stderr, str::FromStr, sync::Arc, time::Instant};
use structopt::StructOpt;
use swc_common::{
    errors::{Handler, HANDLER},
    SourceMap, GLOBALS,
};
use tracing_subscriber::EnvFilter;

mod minified;
mod util;

#[derive(Debug, StructOpt)]
enum Cmd {
    DiffMin(DiffMinifiedCommand),
}

struct Track {
    start: Instant,
}

impl Drop for Track {
    fn drop(&mut self) {
        eprintln!("Done in {:?}", self.start.elapsed());
    }
}

fn main() -> Result<()> {
    let globals = swc_common::Globals::default();
    let cm = Arc::new(SourceMap::default());
    let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(cm.clone()));

    let _logger = {
        let log_env = env::var("RUST_LOG").unwrap_or_else(|_| "info".to_string());

        let logger = tracing_subscriber::FmtSubscriber::builder()
            .without_time()
            .with_target(false)
            .with_ansi(true)
            .with_env_filter(EnvFilter::from_str(&log_env).unwrap())
            .with_test_writer()
            .pretty()
            .finish();

        tracing::subscriber::set_default(logger)
    };

    let _track = Track {
        start: Instant::now(),
    };

    let cmd = Cmd::from_args();

    GLOBALS.set(&globals, || {
        HANDLER.set(&handler, || {
            match cmd {
                Cmd::DiffMin(cmd) => {
                    cmd.run(cm.clone())?;
                }
            }

            Ok(())
        })
    })
}
