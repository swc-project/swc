use anyhow::Result;
use std::{path::PathBuf, sync::Arc};
use structopt::StructOpt;
use swc_common::SourceMap;

/// This tool repeat replacing one file with a minified form at a time.
#[derive(Debug, StructOpt)]
pub(crate) struct ReduceMinCommand {
    entry: PathBuf,

    #[structopt(long)]
    working_dir: PathBuf,

    /// This command is invoked using `bash`.
    #[structopt(long = "build")]
    build_command: String,

    /// This command is invoked using `bash`.
    #[structopt(long = "test")]
    test_command: String,
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
