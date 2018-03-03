use super::{ModuleDecl, Stmt};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub struct Module {
    pub span: Span,
    pub body: Vec<ModuleItem>,
}

#[ast_node]
pub enum ModuleItem {
    Stmt(Stmt),
    ModuleDecl(ModuleDecl),
}
