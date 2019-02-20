use crate::{module_decl::ModuleDecl, stmt::Stmt};
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node("Module")]
pub struct Module {
    #[serde(default)]
    pub span: Span,
    pub body: Vec<ModuleItem>,
    pub shebang: Option<JsWord>,
}

#[ast_node("Script")]
pub struct Script {
    #[serde(default)]
    pub span: Span,
    pub body: Vec<Stmt>,
    pub shebang: Option<JsWord>,
}

#[ast_node]
pub enum ModuleItem {
    Stmt(Stmt),
    ModuleDecl(ModuleDecl),
}
