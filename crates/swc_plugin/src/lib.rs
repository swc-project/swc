#![cfg_attr(docsrs, feature(doc_cfg))]

// Reexports
pub use swc_common::{
    chain,
    plugin::{PluginError, Serialized},
};

pub mod comments {
    pub use swc_common::comments::{Comment, CommentKind, Comments};
    pub use swc_plugin_proxy::PluginCommentsProxy;
}

pub mod source_map {
    pub use swc_common::source_map::{CharPos, Loc, MultiByteChar, NonNarrowChar, Pos, SourceFile};
    pub use swc_plugin_proxy::PluginSourceMapProxy;
}

pub mod utils {
    pub use swc_common::util::take;
    #[cfg(feature = "swc_ecma_quote")]
    #[cfg_attr(docsrs, doc(cfg(feature = "quote")))]
    pub use swc_ecma_quote::*;
    pub use swc_ecma_utils::*;
}

pub mod ast {
    pub use swc_atoms::*;
    pub use swc_ecma_ast::*;
    pub use swc_ecma_visit::*;
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
use swc_plugin_proxy::{PluginCommentsProxy, PluginSourceMapProxy};
#[cfg(target_arch = "wasm32")]
mod allocation;
#[cfg(target_arch = "wasm32")]
pub mod memory {
    pub use crate::allocation::*;
}
mod pseudo_scoped_key;

/// An arbitary metadata for given Program to run transform in plugin.
/// These are information not directly attached to Program's AST structures
/// but required for certain transforms.
#[derive(Debug)]
pub struct TransformPluginProgramMetadata {
    /// Proxy to the comments for the Program passed into plugin.
    /// This is a proxy to the actual data lives in the host. Only when plugin
    /// attempts to read these it'll ask to the host to get values.
    pub comments: Option<PluginCommentsProxy>,
    /// Proxy to the sourceMap for the Program passed into plugin.
    /// This is a proxy to the actual data lives in the host. Only when plugin
    /// attempts to read these it'll ask to the host to get values.
    pub source_map: PluginSourceMapProxy,
    /// Stringified JSON value for given plugin's configuration.
    /// This is readonly. Changing value in plugin doesn't affect host's
    /// behavior.
    pub plugin_config: String,
    /// Stringified JSON value for relative context while running transform,
    /// like filenames.
    /// /// This is readonly. Changing value in plugin doesn't affect host's
    /// behavior.
    pub transform_context: String,
}
