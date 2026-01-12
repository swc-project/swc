#![deny(clippy::all)]
#![allow(clippy::vec_box)]
#![allow(clippy::mutable_key_type)]

pub use self::{
    config::*,
    transform::{tsx, typescript, TypeScript},
};

mod config;
mod enums;
mod imports;
mod macros;
mod namespace;
mod utils;

mod transform;

/// Re-exports for backward compatibility.
pub mod typescript {
    pub use crate::{
        config::*,
        transform::{tsx, typescript, TypeScript},
    };
}

/// Strip TypeScript syntax.
///
/// This is an alias for `typescript()` for backward compatibility.
pub fn strip(
    config: Config,
    unresolved_mark: swc_common::Mark,
    top_level_mark: swc_common::Mark,
) -> impl swc_ecma_ast::Pass + swc_ecma_visit::VisitMut {
    typescript(config, unresolved_mark, top_level_mark)
}
