use super::{ModuleDecl, Stmt, StmtKind};
use swc_common::{Span, Spanned};
use swc_macros::ast_node;

#[ast_node]
pub struct Module {
    pub body: Vec<ModuleItem>,
}

#[ast_node]
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
