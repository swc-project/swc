use once_cell::sync::Lazy;
use std::sync::Arc;
use swc_common::{FilePathMapping, SourceMap};

/// SourceMap used by transforms.
pub static CM: Lazy<Arc<SourceMap>> =
    Lazy::new(|| Arc::new(SourceMap::new(FilePathMapping::empty())));
