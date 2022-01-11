// Reexports
pub use swc_common::{
    chain,
    plugin::{deserialize_from_bytes, serialize_into_bytes, SerializedProgram},
    DUMMY_SP,
};
pub mod ast {
    pub use swc_atoms::*;
    pub use swc_ecma_ast::*;
    pub use swc_ecma_visit::*;
}

#[cfg(target_arch = "wasm32")]
mod allocation;
#[cfg(target_arch = "wasm32")]
pub mod memory {
    pub use crate::allocation::*;
}
