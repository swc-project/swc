use std::path::PathBuf;

use structopt::StructOpt;

/// Diff the output of swc minifier and terser.
#[derive(Debug, StructOpt)]
pub(crate) struct ReduceMinCommand {
    entry: PathBuf,

    #[structopt(long)]
    no_mangle: bool,
}
