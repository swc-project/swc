//! Implementation of [crate::Diff] for types in [swc_ecma_ast].

use swc_ecma_ast::{Module, ModuleItem};

mod expr;
mod ident;
mod stmt;
mod typescript;

diff_struct!(Module, [span, body, shebang]);

diff_enum!(ModuleItem, [Stmt, ModuleDecl]);
