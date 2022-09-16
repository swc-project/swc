use is_macro::Is;
#[cfg(feature = "rkyv-bytecheck-impl")]
use rkyv_latest as rkyv;
use string_enum::StringEnum;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span, DUMMY_SP};

use crate::{
    class::Class,
    expr::Expr,
    function::Function,
    ident::Ident,
    pat::Pat,
    typescript::{TsEnumDecl, TsInterfaceDecl, TsModuleDecl, TsTypeAliasDecl},
};

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Decl {
    #[tag("ClassDeclaration")]
    Class(ClassDecl),
    #[tag("FunctionDeclaration")]
    #[is(name = "fn_decl")]
    Fn(FnDecl),
    #[tag("VariableDeclaration")]
    Var(Box<VarDecl>),
    #[tag("TsInterfaceDeclaration")]
    TsInterface(Box<TsInterfaceDecl>),
    #[tag("TsTypeAliasDeclaration")]
    TsTypeAlias(Box<TsTypeAliasDecl>),
    #[tag("TsEnumDeclaration")]
    TsEnum(Box<TsEnumDecl>),
    #[tag("TsModuleDeclaration")]
    TsModule(Box<TsModuleDecl>),
}

bridge_decl_from!(Box<VarDecl>, VarDecl);
bridge_stmt_from!(Decl, ClassDecl);
bridge_stmt_from!(Decl, FnDecl);

impl Take for Decl {
    fn dummy() -> Self {
        Decl::Var(Take::dummy())
    }
}

#[ast_node("FunctionDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct FnDecl {
    #[serde(rename = "identifier")]
    pub ident: Ident,

    #[serde(default)]
    pub declare: bool,

    #[serde(flatten)]
    #[span]
    pub function: Box<Function>,
}

impl Take for FnDecl {
    fn dummy() -> Self {
        FnDecl {
            ident: Take::dummy(),
            declare: Default::default(),
            function: Take::dummy(),
        }
    }
}

#[ast_node("ClassDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ClassDecl {
    #[serde(rename = "identifier")]
    pub ident: Ident,

    #[serde(default)]
    pub declare: bool,

    #[serde(flatten)]
    #[span]
    pub class: Box<Class>,
}

#[ast_node("VariableDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct VarDecl {
    pub span: Span,

    pub kind: VarDeclKind,

    #[serde(default)]
    pub declare: bool,

    #[serde(rename = "declarations")]
    pub decls: Vec<VarDeclarator>,
}

impl Take for VarDecl {
    fn dummy() -> Self {
        VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: Default::default(),
            decls: Take::dummy(),
        }
    }
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    any(feature = "rkyv-impl", feature = "rkyv-bytecheck-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub enum VarDeclKind {
    /// `var`
    Var,
    /// `let`
    Let,
    /// `const`
    Const,
}

#[ast_node("VariableDeclarator")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct VarDeclarator {
    pub span: Span,
    #[serde(rename = "id")]
    pub name: Pat,

    /// Initialization expression.
    #[serde(default)]
    pub init: Option<Box<Expr>>,

    /// Typescript only
    #[serde(default)]
    pub definite: bool,
}

impl Take for VarDeclarator {
    fn dummy() -> Self {
        VarDeclarator {
            span: DUMMY_SP,
            name: Take::dummy(),
            init: Take::dummy(),
            definite: Default::default(),
        }
    }
}
