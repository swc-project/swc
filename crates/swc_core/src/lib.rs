#![cfg_attr(docsrs, feature(doc_cfg))]

// Quote
#[cfg(any(docsrs, feature = "quote"))]
#[cfg_attr(docsrs, doc(cfg(feature = "quote")))]
pub mod quote {
    pub use swc_ecma_quote::*;
}

// Plugins
#[cfg(any(docsrs, feature = "__plugin_transform"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__plugin_transform")))]
pub mod plugin;

// ast exposed via swc_ecma_ast
#[cfg(any(docsrs, feature = "__ast"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__ast")))]
pub mod ast {
    pub use swc_ecma_ast::*;
}

// TODO: Can dependency tree simplified
// by swc_ecma_ast reexports swc_atoms?
#[cfg(any(docsrs, feature = "__ast"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__ast")))]
pub mod atoms {
    pub use swc_atoms::*;
}

// visit* interfaces
#[cfg(any(docsrs, feature = "__visit"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__visit")))]
pub mod visit {
    pub use swc_ecma_visit::*;
}

// swc_common features
#[cfg(any(docsrs, feature = "__common"))]
#[cfg_attr(docsrs, doc(cfg(feature = "__common")))]
pub mod common {
    pub use swc_common::*;
}
