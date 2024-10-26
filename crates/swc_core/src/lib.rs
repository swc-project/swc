#![cfg_attr(docsrs, feature(doc_cfg))]

pub extern crate swc_allocator as alloc;

#[cfg(feature = "swc_atoms")]
#[cfg_attr(docsrs, doc(cfg(feature = "swc_atoms")))]
pub use swc_atoms as atoms;

// Quote
#[cfg(feature = "ecma_quote")]
#[cfg_attr(docsrs, doc(cfg(feature = "ecma_quote")))]
pub mod quote;

/// Not a public interface.
#[cfg(feature = "ecma_quote")]
#[cfg_attr(docsrs, doc(cfg(feature = "ecma_quote")))]
#[doc(hidden)]
pub extern crate swc_ecma_quote_macros;

// Plugins
#[cfg(any(
    docsrs,
    feature = "__common_plugin_transform",
    feature = "__plugin_transform_host"
))]
#[cfg_attr(
    docsrs,
    doc(cfg(any(
        feature = "__common_plugin_transform",
        feature = "__plugin_transform_host"
    )))
)]
pub mod plugin;

#[cfg(feature = "__ecma")]
#[cfg_attr(docsrs, doc(cfg(feature = "__ecma")))]
pub mod ecma {
    #[cfg(feature = "ecma_ast")]
    #[cfg_attr(docsrs, doc(cfg(feature = "ecma_ast")))]
    pub mod ast {
        pub use swc_ecma_ast::*;
    }
    #[cfg(feature = "ecma_ast")]
    #[cfg_attr(docsrs, doc(cfg(feature = "ecma_ast")))]
    pub mod atoms {
        pub use swc_atoms::*;
    }
    // swc_ecma_transforms
    #[cfg(any(feature = "__ecma_transforms", feature = "__testing_transform"))]
    #[cfg_attr(
        docsrs,
        doc(cfg(any(feature = "__ecma_transforms", feature = "__testing_transform")))
    )]
    pub mod transforms {
        pub mod base {
            pub use swc_ecma_transforms_base::*;
        }
        #[cfg(feature = "ecma_transforms_optimization")]
        #[cfg_attr(docsrs, doc(cfg(feature = "transforms_optimization")))]
        pub mod optimization {
            pub use swc_ecma_transforms_optimization::*;
        }
        #[cfg(feature = "ecma_transforms_react")]
        #[cfg_attr(docsrs, doc(cfg(feature = "transforms_react")))]
        pub mod react {
            pub use swc_ecma_transforms_react::*;
        }
        #[cfg(feature = "ecma_transforms_typescript")]
        #[cfg_attr(docsrs, doc(cfg(feature = "transforms_typescript")))]
        pub mod typescript {
            pub use swc_ecma_transforms_typescript::*;
        }
        #[cfg(feature = "ecma_transforms_module")]
        #[cfg_attr(docsrs, doc(cfg(feature = "transforms_module")))]
        pub mod module {
            pub use swc_ecma_transforms_module::*;
        }
        #[cfg(feature = "ecma_transforms_proposal")]
        #[cfg_attr(docsrs, doc(cfg(feature = "transforms_proposal")))]
        pub mod proposal {
            pub use swc_ecma_transforms_proposal::*;
        }
        #[cfg(feature = "ecma_transforms_compat")]
        #[cfg_attr(docsrs, doc(cfg(feature = "transforms_compat")))]
        pub mod compat {
            pub use swc_ecma_transforms_compat::*;
        }
        #[cfg(feature = "__testing_transform")]
        #[cfg_attr(docsrs, doc(cfg(feature = "__testing_transform")))]
        pub mod testing {
            pub use swc_ecma_transforms_testing::*;
        }
    }

    // swc_ecma_loader
    #[cfg(feature = "__ecma_loader")]
    #[cfg_attr(docsrs, doc(cfg(feature = "__ecma_loader")))]
    pub mod loader {
        pub use swc_ecma_loader::*;
    }

    #[cfg(feature = "__parser")]
    #[cfg_attr(docsrs, doc(cfg(feature = "__parser")))]
    pub mod parser {
        pub use swc_ecma_parser::*;
    }

    #[cfg(feature = "ecma_codegen")]
    #[cfg_attr(docsrs, doc(cfg(feature = "ecma_codegen")))]
    pub mod codegen {
        pub use swc_ecma_codegen::*;
    }

    #[cfg(feature = "ecma_minifier")]
    #[cfg_attr(docsrs, doc(cfg(feature = "ecma_minifier")))]
    pub mod minifier {
        pub use swc_ecma_minifier::*;
    }

    #[cfg(feature = "ecma_preset_env")]
    #[cfg_attr(docsrs, doc(cfg(feature = "ecma_preset_env")))]
    pub mod preset_env {
        pub use swc_ecma_preset_env::*;
    }

    #[cfg(feature = "ecma_usage_analyzer")]
    #[cfg_attr(docsrs, doc(cfg(feature = "ecma_usage_analyzer")))]
    pub mod usage_analyzer {
        pub use swc_ecma_usage_analyzer::*;
    }

    // visit* interfaces
    #[cfg(feature = "ecma_lints")]
    #[cfg_attr(docsrs, doc(cfg(feature = "ecma_lints")))]
    pub mod lints {
        pub use swc_ecma_lints::*;
    }

    // visit* interfaces
    #[cfg(feature = "__visit")]
    #[cfg_attr(docsrs, doc(cfg(feature = "__visit")))]
    pub mod visit {
        pub use swc_ecma_visit::*;
    }

    #[cfg(feature = "__utils")]
    #[cfg_attr(docsrs, doc(cfg(feature = "__utils")))]
    pub mod utils {
        pub use swc_ecma_utils::*;
    }
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

#[cfg(feature = "transform_common")]
#[cfg_attr(docsrs, doc(cfg(feature = "transform_common")))]
pub mod transform_common {
    pub use swc_transform_common::*;
}

#[cfg(feature = "typescript")]
#[cfg_attr(docsrs, doc(cfg(feature = "typescript")))]
pub mod typescript {
    pub use swc_typescript::*;
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

#[cfg(feature = "__css")]
#[cfg_attr(docsrs, doc(cfg(feature = "__css")))]
pub mod css {
    #[cfg(feature = "css_ast")]
    #[cfg_attr(docsrs, doc(cfg(feature = "css_ast")))]
    pub mod ast {
        pub use swc_css_ast::*;
    }

    #[cfg(feature = "css_modules")]
    #[cfg_attr(docsrs, doc(cfg(feature = "css_modules")))]
    pub mod modules {
        pub use swc_css_modules::*;
    }

    #[cfg(feature = "css_codegen")]
    #[cfg_attr(docsrs, doc(cfg(feature = "css_codegen")))]
    pub mod codegen {
        pub use swc_css_codegen::*;
    }

    #[cfg(feature = "css_compat")]
    #[cfg_attr(docsrs, doc(cfg(feature = "css_compat")))]
    pub mod compat {
        pub use swc_css_compat::*;
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

// This reexports generic testing utilities only.
// For the feature-specific (i.e ecma_transform_testing), need to enable
// Corresponding features instead.
#[cfg(feature = "testing")]
#[cfg_attr(docsrs, doc(cfg(feature = "testing")))]
pub mod testing {
    pub use testing::*;
}

#[cfg(feature = "allocator_node")]
#[cfg_attr(docsrs, doc(cfg(feature = "allocator_node")))]
extern crate swc_malloc;

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
