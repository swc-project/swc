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
#[cfg(feature = "visit")]
#[cfg_attr(docsrs, doc(cfg(feature = "visit")))]
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
#[cfg(feature = "loader")]
#[cfg_attr(docsrs, doc(cfg(feature = "loader")))]
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

#[cfg(feature = "allocator_node")]
#[cfg_attr(docsrs, doc(cfg(feature = "allocator_node")))]
extern crate swc_node_base;

pub mod diagnostics {
    /// Set of metadata swc_core was built against.
    /// This is useful for the diagnostics to determine any runtime, or guest
    /// uses specific version of swc_core, or desired features to be enabled or
    /// not.
    #[derive(Debug)]
    pub struct CoreEngineDiagnostics {
        /// Semver package version of swc_core.
        pub package_semver: String,
        /// Git branch of swc_core built against.
        pub git_branch: String,
        /// Commit sha of swc_core built against.
        pub git_sha: String,
        /// List of features enabled
        pub cargo_features: String,
        pub cargo_target_triple: String,
    }

    /// Returns metadata about the swc_core engine that was built against.
    pub fn get_core_engine_diagnostics() -> CoreEngineDiagnostics {
        CoreEngineDiagnostics {
            package_semver: env!("VERGEN_BUILD_SEMVER").to_string(),
            git_branch: env!("VERGEN_GIT_BRANCH").to_string(),
            git_sha: env!("VERGEN_GIT_SHA").to_string(),
            cargo_features: env!("VERGEN_CARGO_FEATURES").to_string(),
            cargo_target_triple: env!("VERGEN_CARGO_TARGET_TRIPLE").to_string(),
        }
    }
}
