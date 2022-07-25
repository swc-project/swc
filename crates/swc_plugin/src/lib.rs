#![cfg_attr(docsrs, feature(doc_cfg))]

// Reexports
pub use swc_common::{
    chain,
    plugin::{
        deserialize_from_ptr, PluginError, PluginSerializedBytes, VersionedSerializable,
        PLUGIN_TRANSFORM_AST_SCHEMA_VERSION,
    },
};

pub mod collections {
    pub use swc_common::collections::AHashMap;
}

pub mod comments {
    pub use swc_common::comments::{Comment, CommentKind, Comments};
    pub use swc_plugin_proxy::PluginCommentsProxy;
}

pub mod source_map {
    pub use swc_common::{
        source_map::{
            BytePos, CharPos, FileLinesResult, FileName, Loc, MultiByteChar, NonNarrowChar, Pos,
            SourceFile,
        },
        SourceMapper,
    };
    pub use swc_plugin_proxy::PluginSourceMapProxy;
}

pub mod metadata {
    pub use swc_plugin_proxy::TransformPluginProgramMetadata;
}

pub mod utils {
    pub use swc_common::util::take;
    #[cfg(feature = "swc_ecma_quote")]
    #[cfg_attr(docsrs, doc(cfg(feature = "quote")))]
    pub use swc_ecma_quote::*;
    pub use swc_ecmascript::utils::*;
}

pub mod ast {
    pub use swc_atoms::*;
    pub use swc_ecmascript::{ast::*, visit::*};
}

pub mod syntax_pos {
    pub use swc_common::{Mark, Span, DUMMY_SP};
}

mod handler;
pub mod errors {
    pub use swc_common::errors::{Diagnostic, Handler, Level};

    pub use crate::handler::HANDLER;
}

pub mod environment {
    pub use crate::handler::*;
}
// We don't set target cfg as it'll block macro expansions
// in ide (i.e rust-analyzer) or non-wasm target `cargo check`
pub use swc_plugin_macro::plugin_transform;
#[cfg(target_arch = "wasm32")]
mod allocation;
#[cfg(target_arch = "wasm32")]
pub mod memory {
    pub use crate::allocation::*;
}
mod pseudo_scoped_key;
