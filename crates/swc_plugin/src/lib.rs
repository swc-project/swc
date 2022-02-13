// Reexports
pub use swc_common::{
    chain,
    plugin::{PluginError, Serialized},
};

pub mod util {
    pub use swc_common::util::take;
}

pub mod ast {
    pub use swc_atoms::*;
    pub use swc_ecma_ast::*;
    pub use swc_ecma_visit::*;
}

pub mod syntax_pos {
    pub use swc_common::{Mark, DUMMY_SP};
}

mod handler;
pub mod errors {
    pub use swc_common::errors::{Diagnostic, Handler, Level};

    pub use crate::handler::HANDLER;
}

mod context;
pub mod environment {
    pub use crate::context::*;
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
