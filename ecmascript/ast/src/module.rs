use super::{ModuleDecl, Stmt, StmtKind};
use std::io::{self, Write};
use swc_common::{Span, Spanned, ToCode};
use swc_macros::ast_node;

#[ast_node]
pub struct Module {
    pub body: Vec<ModuleItem>,
}

// impl ToCode for Module {
//     fn to_code<W: Write>(&self, w: W) -> io::Result<()> {
//         for item in &self.body {
//             item.to_code(w)?;
//         }
//         Ok(())
//     }
// }

#[ast_node]
// #[derive(ToCode)]
pub enum ModuleItem {
    Stmt(Stmt),
    ModuleDecl(ModuleDecl),
}

impl Spanned<StmtKind> for ModuleItem {
    fn from_unspanned(node: StmtKind, span: Span) -> Self {
        ModuleItem::Stmt(Stmt::from_unspanned(node, span))
    }
}

impl From<Stmt> for ModuleItem {
    fn from(stmt: Stmt) -> Self {
        ModuleItem::Stmt(stmt)
    }
}
