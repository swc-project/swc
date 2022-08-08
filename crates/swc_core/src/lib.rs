#![cfg_attr(docsrs, feature(doc_cfg))]

// Quote
#[cfg(any(docsrs, feature = "quote"))]
#[cfg_attr(docsrs, doc(cfg(feature = "quote")))]
pub mod quote;

/// Not a public interface.
#[cfg(any(docsrs, feature = "quote"))]
#[cfg_attr(docsrs, doc(cfg(feature = "quote")))]
#[doc(hidden)]
pub extern crate swc_ecma_quote_macros;

// Plugins
#[cfg(any(docsrs, feature = "__plugin_transform"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__plugin_transform")))]
pub mod plugin;

// ast exposed via swc_ecma_ast
#[cfg(any(docsrs, feature = "ast"))]
#[cfg_attr(docsrs, doc(cfg(feature = "ast")))]
pub mod ast {
    pub use swc_ecma_ast::*;
}

// TODO: Can dependency tree simplified
// by swc_ecma_ast reexports swc_atoms?
#[cfg(any(docsrs, feature = "ast"))]
#[cfg_attr(docsrs, doc(cfg(feature = "ast")))]
pub mod atoms {
    pub use swc_atoms::*;
}

// visit* interfaces
#[cfg(any(docsrs, feature = "visit"))]
#[cfg_attr(docsrs, doc(cfg(feature = "visit")))]
pub mod visit {
    pub use swc_ecma_visit::*;
}

// swc features
#[cfg(any(docsrs, feature = "__base"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__base")))]
pub mod base {
    pub use swc::*;
}

// swc_common features
#[cfg(any(docsrs, feature = "__common"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__common")))]
pub mod common {
    pub use swc_common::*;
}

// swc_plugin_runner
#[cfg(any(docsrs, feature = "__plugin_transform_host"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__plugin_transform_host")))]
pub mod plugin_runner {
    pub use swc_plugin_runner::*;
}

// swc_trace_macro
#[cfg(any(docsrs, feature = "trace_macro"))]
#[cfg_attr(docsrs, doc(cfg(feature = "trace_macro")))]
pub mod trace_macro {
    pub use swc_trace_macro::*;
}

// swc_ecma_transforms
#[cfg(any(docsrs, feature = "__transforms"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__transforms")))]
pub mod transforms {
    pub use swc_ecma_transforms::*;
}

// swc_bundler
#[cfg(any(docsrs, feature = "bundler"))]
#[cfg_attr(docsrs, doc(cfg(feature = "bundler")))]
pub mod bundler {
    pub use swc_bundler::*;
}

// swc_ecma_loader
#[cfg(any(docsrs, feature = "loader"))]
#[cfg_attr(docsrs, doc(cfg(feature = "loader")))]
pub mod loader {
    pub use swc_ecma_loader::*;
}

#[cfg(any(docsrs, feature = "__utils"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__utils")))]
pub mod utils {
    pub use swc_ecma_utils::*;
}

#[cfg(any(docsrs, feature = "__testing_transform"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__testing_transform")))]
pub mod testing_transform {
    pub use swc_ecma_transforms_testing::*;
}

#[cfg(any(docsrs, feature = "allocator_node"))]
#[cfg_attr(docsrs, doc(cfg(feature = "allocator_node")))]
extern crate swc_node_base;
