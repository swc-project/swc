use once_cell::sync::Lazy;
use std::sync::Arc;
use swc_common::{
    errors::{ColorConfig, Handler},
    FilePathMapping, SourceMap,
};
use swc_ecma_parser::Session;

pub static CM: Lazy<Arc<SourceMap>> =
    Lazy::new(|| Arc::new(SourceMap::new(FilePathMapping::empty())));

pub static HANDLER: Lazy<Handler> =
    Lazy::new(|| Handler::with_tty_emitter(ColorConfig::Always, false, true, Some(CM.clone())));

pub static SESSION: Lazy<Session> = Lazy::new(|| Session { handler: &*HANDLER });
