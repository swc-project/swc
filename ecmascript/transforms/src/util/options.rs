use lazy_static::lazy_static;
use std::sync::Arc;
use swc_common::{
    errors::{ColorConfig, Handler},
    FilePathMapping, SourceMap,
};
use swc_ecma_parser::Session;

lazy_static! {
    pub(crate) static ref CM: Arc<SourceMap> =
        { Arc::new(SourceMap::new(FilePathMapping::empty())) };
    pub(crate) static ref HANDLER: Handler =
        { Handler::with_tty_emitter(ColorConfig::Always, false, true, Some(CM.clone())) };
    pub(crate) static ref SESSION: Session<'static> = { Session { handler: &*HANDLER } };
}
