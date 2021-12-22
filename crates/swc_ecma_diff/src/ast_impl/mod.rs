//! Implementation of [crate::Diff] for types in [swc_ecma_ast].

use swc_ecma_ast::{Module, ModuleItem};

mod expr;
mod ident;
mod stmt;

diff_struct!(Module, [span, body]);

diff_enum!(ModuleItem, [Stmt, ModuleDecl]);
