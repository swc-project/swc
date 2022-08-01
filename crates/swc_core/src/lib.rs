#![cfg_attr(docsrs, feature(doc_cfg))]

// Plugins
#[cfg(feature = "plugin")]
pub mod plugin;

// ast exposed via swc_ecma_ast
// TODO: Can dependency tree simplified
// by swc_ecma_ast reexports swc_atoms?
#[cfg(any(feature = "__ast"))]
pub mod ast {
    pub use swc_atoms::*;
    pub use swc_ecma_ast::*;
}

// visit* interfaces
#[cfg(any(feature = "__visit"))]
pub mod visit {
    pub use swc_ecma_visit::*;
}

// swc_common features
#[cfg(any(feature = "__common"))]
pub mod common {
    pub use swc_common::*;
}
