// Vendored from facebook/react#36173. Keep upstream style intact to reduce
// merge drift.
#![allow(clippy::all)]

pub mod debug_print;
pub mod entrypoint;
pub mod fixture_utils;
pub mod timing;

// Re-export from new crates for backwards compatibility
pub use react_compiler_diagnostics;
pub use react_compiler_hir as hir;
pub use react_compiler_hir::{self, environment};
pub use react_compiler_lowering::lower;
