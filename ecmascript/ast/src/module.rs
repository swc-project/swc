use crate::{module_decl::ModuleDecl, stmt::Stmt};
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node]
pub struct Module {
    pub span: Span,
    pub body: Vec<ModuleItem>,
    pub shebang: Option<JsWord>,
}

#[ast_node]
pub struct Script {
    pub span: Span,
    pub body: Vec<Stmt>,
    pub shebang: Option<JsWord>,
}

#[ast_node]
pub enum ModuleItem {
    Stmt(Stmt),
    ModuleDecl(ModuleDecl),
}
