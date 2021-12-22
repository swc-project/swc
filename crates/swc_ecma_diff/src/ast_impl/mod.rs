//! Implementation of [crate::Diff] for types in [swc_ecma_ast].

use crate::{Ctx, DiffResult};
use swc_ecma_ast::{Module, ModuleItem};

mod expr;
mod stmt;

diff_struct!(Module, [span, body]);

diff_enum!(ModuleItem, [Stmt, ModuleDecl]);
