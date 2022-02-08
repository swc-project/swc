// Reexports
pub use swc_common::{
    chain,
    plugin::{PluginError, Serialized},
    DUMMY_SP,
};
pub mod ast {
    pub use swc_atoms::*;
    pub use swc_ecma_ast::*;
    pub use swc_ecma_visit::*;
}

mod handler;
pub mod errors {
    pub use crate::handler::HANDLER;
    pub use swc_common::errors::{Diagnostic, Handler, Level};
}

mod context;
pub mod environment {
    pub use crate::context::*;
}
// We don't set target cfg as it'll block macro expansions
// in ide (i.e rust-analyzer) or non-wasm target `cargo check`
pub use swc_plugin_macro::plugin_module;
#[cfg(target_arch = "wasm32")]
mod allocation;
#[cfg(target_arch = "wasm32")]
pub mod memory {
    pub use crate::allocation::*;
}
