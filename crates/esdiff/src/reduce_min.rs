use anyhow::Result;
use std::{path::PathBuf, sync::Arc};
use structopt::StructOpt;
use swc_common::SourceMap;

/// Diff the output of swc minifier and terser.
#[derive(Debug, StructOpt)]
pub(crate) struct ReduceMinCommand {
    entry: PathBuf,

    #[structopt(long)]
    no_mangle: bool,
}

impl ReduceMinCommand {
    pub(crate) fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let mut runner = Runner { cm };

        todo!()
    }
}

struct Runner {
    cm: Arc<SourceMap>,
}
