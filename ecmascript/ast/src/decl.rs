use crate::{
    class::Class,
    expr::Expr,
    function::Function,
    ident::Ident,
    pat::Pat,
    typescript::{TsEnumDecl, TsInterfaceDecl, TsModuleDecl, TsTypeAliasDecl},
};
#[cfg(feature = "fold")]
use swc_common::Fold;
use swc_common::{ast_node, Span};

#[ast_node]
pub enum Decl {
    #[tag("ClassDeclaration")]
    Class(ClassDecl),
    #[tag("FunctionDeclaration")]
    Fn(FnDecl),
    #[tag("VariableDeclaration")]
    Var(VarDecl),
    #[tag("TsInterfaceDeclaration")]
    TsInterface(TsInterfaceDecl),
    #[tag("TsTypeAliasDeclaration")]
    TsTypeAlias(TsTypeAliasDecl),
    #[tag("TsEnumDeclaration")]
    TsEnum(TsEnumDecl),
    #[tag("TsModuleDeclaration")]
    TsModule(TsModuleDecl),
}

#[ast_node("FunctionDeclaration")]
pub struct FnDecl {
    #[serde(rename = "identifier")]
    pub ident: Ident,

    #[serde(default)]
    pub declare: bool,

    #[serde(flatten)]
    #[span]
    pub function: Function,
}

#[ast_node("ClassDeclaration")]
pub struct ClassDecl {
    #[serde(rename = "identifier")]
    pub ident: Ident,

    #[serde(default)]
    pub declare: bool,

    #[serde(flatten)]
    #[span]
    pub class: Class,
}

#[ast_node("VariableDeclaration")]
pub struct VarDecl {
    #[serde(default)]
    pub span: Span,

    pub kind: VarDeclKind,

    #[serde(default)]
    pub declare: bool,

    #[serde(rename = "declarations")]
    pub decls: Vec<VarDeclarator>,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "fold", derive(Fold))]
pub enum VarDeclKind {
    /// `var`
    Var,
    /// `let`
    Let,
    /// `const`
    Const,
}

#[ast_node("VariableDeclarator")]
pub struct VarDeclarator {
    #[serde(default)]
    pub span: Span,
    #[serde(rename = "id")]
    pub name: Pat,

    /// Initialization expresion.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub init: Option<Box<Expr>>,

    /// Typescript only
    #[serde(default)]
    pub definite: bool,
}
