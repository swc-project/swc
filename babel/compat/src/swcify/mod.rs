use std::fmt::Debug;
use std::sync::Arc;
use swc_common::FileName;
use swc_common::SourceFile;
use swc_common::SourceMap;

pub struct Context {
    pub(crate) cm: Arc<SourceMap>,
    pub(crate) fm: Arc<SourceFile>,
}

impl Context {
    /// This accepts source string because the spans of an ast node of swc are
    /// stored as interned.
    ///
    /// This method allocate a new [SourceFile] in the given `cm`.
    pub fn new(cm: Arc<SourceMap>, filename: FileName, src: String) -> Self {
        let fm = cm.new_source_file(filename, src);
        Self::new_without_alloc(cm, fm)
    }

    pub fn new_without_alloc(cm: Arc<SourceMap>, fm: Arc<SourceFile>) -> Self {
        Self { cm, fm }
    }
}

/// Used to convert a babel ast node to
pub trait Swcify {
    type Output: Debug + Send + Sync;

    fn swcify(self, ctx: &Context) -> Self::Output;
}
