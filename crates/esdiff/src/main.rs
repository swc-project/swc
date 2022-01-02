use crate::minified::DiffMinifiedCommand;
use anyhow::Result;
use std::{env, str::FromStr, sync::Arc, time::Instant};
use structopt::StructOpt;
use swc_common::{
    errors::{ColorConfig, Handler, HANDLER},
    SourceMap, GLOBALS,
};
use tracing_subscriber::EnvFilter;

mod minified;

#[derive(Debug, StructOpt)]
enum Cmd {
    Minified(DiffMinifiedCommand),
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
    let handler = Handler::with_tty_emitter(ColorConfig::Always, true, false, Some(cm.clone()));

    let _logger = {
        let log_env = env::var("RUST_LOG").unwrap_or_else(|_| "debug".to_string());

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
                Cmd::Minified(cmd) => {
                    cmd.run()?;
                }
            }

            Ok(())
        })
    })
}
