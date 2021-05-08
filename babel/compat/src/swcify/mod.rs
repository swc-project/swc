use std::sync::Arc;
use swc_common::FileName;
use swc_common::SourceFile;
use swc_common::SourceMap;

pub struct Context {
    pub(crate) cm: Arc<SourceMap>,
}

impl Context {
    /// This accepts source string because the spans of an ast node of swc are
    /// stored as interned.
    pub fn new(cm: Arc<SourceMap>, filename: &FileName, src: &str) -> Self {}

    pub fn new_without_alloc(cm: Arc<SourceMap>, fm: Arc<SourceFile>) -> Self {}
}

/// Used to convert a babel ast node to
pub trait Swcify {}
