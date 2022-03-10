use std::fmt::Write;

use miette::GraphicalReportHandler;
use swc_common::{sync::Lrc, SourceMap};

pub struct PrettyEmitter {
    cm: Lrc<SourceMap>,

    wr: Box<dyn Write + Send + Sync>,

    reporter: GraphicalReportHandler,
}
