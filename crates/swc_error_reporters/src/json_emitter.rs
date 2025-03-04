use miette::GraphicalReportHandler;
use swc_common::{sync::Lrc, SourceMap};

use crate::WriterWrapper;

pub struct JsonEmitter {
    cm: Lrc<SourceMap>,

    wr: WriterWrapper,

    reporter: GraphicalReportHandler,

    config: JsonEmitterConfig,

    diagnostics: Vec<String>,
}

#[derive(Debug, Clone, Default)]
pub struct JsonEmitterConfig {
    pub skip_filename: bool,
}
