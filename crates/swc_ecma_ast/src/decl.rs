use is_macro::Is;
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
bridge_decl_from!(Box<TsInterfaceDecl>, TsInterfaceDecl);
bridge_decl_from!(Box<TsTypeAliasDecl>, TsTypeAliasDecl);
bridge_decl_from!(Box<TsEnumDecl>, TsEnumDecl);
bridge_decl_from!(Box<TsModuleDecl>, TsModuleDecl);
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
    #[cfg_attr(feature = "serde-impl", serde(rename = "identifier"))]
    pub ident: Ident,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub declare: bool,

    #[cfg_attr(feature = "serde-impl", serde(flatten))]
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
    #[cfg_attr(feature = "serde-impl", serde(rename = "identifier"))]
    pub ident: Ident,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub declare: bool,

    #[cfg_attr(feature = "serde-impl", serde(flatten))]
    #[span]
    pub class: Box<Class>,
}

impl Take for ClassDecl {
    fn dummy() -> Self {
        ClassDecl {
            ident: Take::dummy(),
            declare: Default::default(),
            class: Take::dummy(),
        }
    }
}

#[ast_node("VariableDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct VarDecl {
    pub span: Span,

    pub kind: VarDeclKind,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub declare: bool,

    #[cfg_attr(feature = "serde-impl", serde(rename = "declarations"))]
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
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", archive(check_bytes))]
#[cfg_attr(feature = "rkyv-impl", archive_attr(repr(u32)))]
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
    #[cfg_attr(feature = "serde-impl", serde(rename = "id"))]
    pub name: Pat,

    /// Initialization expression.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub init: Option<Box<Expr>>,

    /// Typescript only
    #[cfg_attr(feature = "serde-impl", serde(default))]
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
