use crate::{module_decl::ModuleDecl, stmt::Stmt};
use is_macro::Is;
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node]
#[derive(Eq, Hash, Is)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Program {
    #[tag("Module")]
    Module(Module),
    #[tag("Script")]
    Script(Script),
}

#[ast_node("Module")]
#[derive(Eq, Hash)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Module {
    pub span: Span,

    pub body: Vec<ModuleItem>,

    #[serde(default, rename = "interpreter")]
    pub shebang: Option<JsWord>,
}

#[ast_node("Script")]
#[derive(Eq, Hash)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Script {
    pub span: Span,

    pub body: Vec<Stmt>,

    #[serde(default, rename = "interpreter")]
    pub shebang: Option<JsWord>,
}

#[ast_node]
#[derive(Eq, Hash, Is)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum ModuleItem {
    #[tag("ImportDeclaration")]
    #[tag("ExportDeclaration")]
    #[tag("ExportNamedDeclaration")]
    #[tag("ExportDefaultDeclaration")]
    #[tag("ExportDefaultExpression")]
    #[tag("ExportAllDeclaration")]
    #[tag("TsImportEqualsDeclaration")]
    #[tag("TsExportAssignment")]
    #[tag("TsNamespaceExportDeclaration")]
    ModuleDecl(ModuleDecl),
    #[tag("*")]
    Stmt(Stmt),
}
