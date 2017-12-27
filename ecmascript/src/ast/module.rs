use super::{ModuleDecl, Stmt};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub struct Module {
    pub span: Span,
    pub body: Vec<ModuleItem>,
}

#[ast_node]
pub struct ModuleItem {
    pub span: Span,
    pub node: ModuleItemKind,
}

#[ast_node]
pub enum ModuleItemKind {
    Stmt(Stmt),
    ModuleDecl(ModuleDecl),
}
