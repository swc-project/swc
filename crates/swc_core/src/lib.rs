#![cfg_attr(docsrs, feature(doc_cfg))]

// Quote
#[cfg(feature = "quote")]
#[cfg_attr(docsrs, doc(cfg(feature = "quote")))]
pub mod quote;

/// Not a public interface.
#[cfg(feature = "quote")]
#[cfg_attr(docsrs, doc(cfg(feature = "quote")))]
#[doc(hidden)]
pub extern crate swc_ecma_quote_macros;

// Plugins
#[cfg(feature = "__plugin_transform")]
#[cfg_attr(docsrs, doc(cfg(feature = "__plugin_transform")))]
pub mod plugin;

// ast exposed via swc_ecma_ast
#[cfg(feature = "ast")]
#[cfg_attr(docsrs, doc(cfg(feature = "ast")))]
pub mod ast {
    pub use swc_ecma_ast::*;
}

// TODO: Can dependency tree simplified
// by swc_ecma_ast reexports swc_atoms?
#[cfg(feature = "ast")]
#[cfg_attr(docsrs, doc(cfg(feature = "ast")))]
pub mod atoms {
    pub use swc_atoms::*;
}

// visit* interfaces
#[cfg(feature = "__visit")]
#[cfg_attr(docsrs, doc(cfg(feature = "__visit")))]
pub mod visit {
    pub use swc_ecma_visit::*;
}

// swc features
#[cfg(feature = "__base")]
#[cfg_attr(docsrs, doc(cfg(feature = "__base")))]
pub mod base {
    pub use swc::*;
}

// swc_common features
#[cfg(feature = "__common")]
#[cfg_attr(docsrs, doc(cfg(feature = "__common")))]
pub mod common {
    pub use swc_common::*;
}

#[cfg(feature = "__parser")]
#[cfg_attr(docsrs, doc(cfg(feature = "__parser")))]
pub mod parser {
    pub use swc_ecma_parser::*;
}

// swc_plugin_runner
#[cfg(feature = "__plugin_transform_host")]
#[cfg_attr(docsrs, doc(cfg(feature = "__plugin_transform_host")))]
pub mod plugin_runner {
    pub use swc_plugin_runner::*;
}

// swc_trace_macro
#[cfg(feature = "trace_macro")]
#[cfg_attr(docsrs, doc(cfg(feature = "trace_macro")))]
pub mod trace_macro {
    pub use swc_trace_macro::*;
}

// swc_ecma_transforms
#[cfg(feature = "__transforms")]
#[cfg_attr(docsrs, doc(cfg(feature = "__transforms")))]
pub mod transforms {
    pub use swc_ecma_transforms::*;
}

// swc_bundler
#[cfg(feature = "__bundler")]
#[cfg_attr(docsrs, doc(cfg(feature = "__bundler")))]
pub mod bundler {
    pub use swc_bundler::*;

    #[cfg(any(feature = "bundler_node_v1", feature = "bundler_node_v2"))]
    #[cfg_attr(
        docsrs,
        doc(cfg(any(feature = "bundler_node_v1", feature = "bundler_node_v2")))
    )]
    pub mod node {
        pub use swc_node_bundler::*;
    }
}

// swc_ecma_loader
#[cfg(feature = "__loader")]
#[cfg_attr(docsrs, doc(cfg(feature = "__loader")))]
pub mod loader {
    pub use swc_ecma_loader::*;
}

#[cfg(feature = "__utils")]
#[cfg_attr(docsrs, doc(cfg(feature = "__utils")))]
pub mod utils {
    pub use swc_ecma_utils::*;
}

#[cfg(feature = "__testing_transform")]
#[cfg_attr(docsrs, doc(cfg(feature = "__testing_transform")))]
pub mod testing_transform {
    pub use swc_ecma_transforms_testing::*;
}

#[cfg(feature = "__binding_macros")]
#[cfg_attr(docsrs, doc(cfg(feature = "__binding_macros")))]
pub mod binding_macros {
    pub use binding_macros::*;
}

#[cfg(feature = "base_node")]
#[cfg_attr(docsrs, doc(cfg(feature = "base_node")))]
pub mod node {
    pub use swc_nodejs_common::*;
}

#[cfg(feature = "codegen")]
#[cfg_attr(docsrs, doc(cfg(feature = "codegen")))]
pub mod codegen {
    pub use swc_ecma_codegen::*;
}

#[cfg(feature = "minifier")]
#[cfg_attr(docsrs, doc(cfg(feature = "minifier")))]
pub mod minifier {
    pub use swc_ecma_minifier::*;
}

#[cfg(feature = "__css")]
#[cfg_attr(docsrs, doc(cfg(feature = "__css")))]
pub mod css {
    #[cfg(feature = "css_ast")]
    #[cfg_attr(docsrs, doc(cfg(feature = "css_ast")))]
    pub mod ast {
        pub use swc_css_ast::*;
    }

    #[cfg(feature = "css_codegen")]
    #[cfg_attr(docsrs, doc(cfg(feature = "css_codegen")))]
    pub mod codegen {
        pub use swc_css_codegen::*;
    }

    #[cfg(feature = "css_minifier")]
    #[cfg_attr(docsrs, doc(cfg(feature = "css_minifier")))]
    pub mod minifier {
        pub use swc_css_minifier::*;
    }

    #[cfg(feature = "css_parser")]
    #[cfg_attr(docsrs, doc(cfg(feature = "css_parser")))]
    pub mod parser {
        pub use swc_css_parser::*;
    }

    #[cfg(feature = "css_utils")]
    #[cfg_attr(docsrs, doc(cfg(feature = "css_utils")))]
    pub mod utils {
        pub use swc_css_utils::*;
    }

    #[cfg(feature = "css_visit")]
    #[cfg_attr(docsrs, doc(cfg(feature = "css_visit")))]
    pub mod visit {
        pub use swc_css_visit::*;
    }

    #[cfg(feature = "css_prefixer")]
    #[cfg_attr(docsrs, doc(cfg(feature = "css_prefixer")))]
    pub mod prefixer {
        pub use swc_css_prefixer::*;
    }
}

#[cfg(feature = "__cached")]
#[cfg_attr(docsrs, doc(cfg(feature = "__cached")))]
pub mod cached {
    pub use swc_cached::*;
}

#[cfg(feature = "allocator_node")]
#[cfg_attr(docsrs, doc(cfg(feature = "allocator_node")))]
extern crate swc_node_base;

pub static SWC_CORE_VERSION: &str = include_str!(concat!(env!("OUT_DIR"), "/core_pkg_version.txt"));

mod __diagnostics;
pub mod diagnostics {
    use crate::__diagnostics::{GIT_SHA, PKG_SEMVER_FALLBACK};

    #[derive(Debug)]
    pub struct CoreEngineDiagnostics {
        /// Semver package version of swc_core.
        pub package_semver: String,
        /// Commit sha of swc_core built against.
        pub git_sha: String,
        /// List of features enabled
        pub cargo_features: String,
    }

    /// Returns metadata about the swc_core engine that was built against.
    pub fn get_core_engine_diagnostics() -> CoreEngineDiagnostics {
        CoreEngineDiagnostics {
            package_semver: option_env!("VERGEN_BUILD_SEMVER")
                .unwrap_or_else(|| PKG_SEMVER_FALLBACK)
                .to_string(),
            git_sha: GIT_SHA.to_string(),
            cargo_features: option_env!("VERGEN_CARGO_FEATURES")
                .unwrap_or_else(|| "Unavailable to query")
                .to_string(),
        }
    }
}
