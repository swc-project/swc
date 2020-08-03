use std::sync::Arc;
use swc_common::{
    sync::{Lazy, Lrc},
    FilePathMapping, SourceMap,
};

/// SourceMap used by transforms.
pub static CM: Lazy<Lrc<SourceMap>> =
    Lazy::new(|| Lrc::new(SourceMap::new(FilePathMapping::empty())));
