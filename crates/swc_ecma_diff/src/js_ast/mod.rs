//! Implementation of [crate::Diff] for types in [swc_ecma_ast].

use swc_ecma_ast::*;

mod expr;
mod ident;
mod ops;
mod pat;
mod stmt;
mod typescript;

diff_struct!(Module, [span, body, shebang]);
diff_struct!(Invalid, [span]);

diff_enum!(ModuleItem, [Stmt, ModuleDecl]);
diff_enum!(ModuleExportName, [Ident, Str]);
