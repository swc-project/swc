use crate::minified::DiffMinifiedCommand;
use anyhow::Result;
use std::{sync::Arc, time::Instant};
use structopt::StructOpt;
use swc_common::SourceMap;

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
    let cm = Arc::new(SourceMap::default());

    let _track = Track {
        start: Instant::now(),
    };

    let cmd = Cmd::from_args();

    match cmd {
        Cmd::Minified(cmd) => {
            cmd.run()?;
        }
    }

    Ok(())
}
