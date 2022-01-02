use crate::minified::DiffMinifiedCommand;
use anyhow::Result;
use std::{sync::Arc, time::Instant};
use structopt::StructOpt;
use swc_common::{
    errors::{ColorConfig, Handler, HANDLER},
    SourceMap, GLOBALS,
};

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
