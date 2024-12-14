use is_macro::Is;
use string_enum::StringEnum;
use swc_allocator::arena::{Box, Vec};
use swc_common::{
    arena::{ast_node, CloneIn, Take},
    EqIgnoreSpan, Span, SyntaxContext, DUMMY_SP,
};

use super::{
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
pub enum Decl<'a> {
    // #[tag("ClassDeclaration")]
    Class(Box<'a, ClassDecl<'a>>),
    // #[tag("FunctionDeclaration")]
    #[is(name = "fn_decl")]
    Fn(Box<'a, FnDecl<'a>>),
    // #[tag("VariableDeclaration")]
    Var(Box<'a, VarDecl<'a>>),
    // #[tag("UsingDeclaration")]
    Using(Box<'a, UsingDecl<'a>>),

    // #[tag("TsInterfaceDeclaration")]
    TsInterface(Box<'a, TsInterfaceDecl<'a>>),
    // #[tag("TsTypeAliasDeclaration")]
    TsTypeAlias(Box<'a, TsTypeAliasDecl<'a>>),
    // #[tag("TsEnumDeclaration")]
    TsEnum(Box<'a, TsEnumDecl<'a>>),
    // #[tag("TsModuleDeclaration")]
    TsModule(Box<'a, TsModuleDecl<'a>>),
}

// macro_rules! bridge_decl {
//     ($($variant_ty:ty),*) => {
//         $(
//             bridge_from!(Decl<'a>, Box<'a, $variant_ty>, $variant_ty);
//             bridge_from!(Box<'a, Decl<'a>>, Decl<'a>, $variant_ty);
//             bridge_from!(crate::Stmt<'a>, Box<'a, Decl<'a>>, $variant_ty);
//             bridge_from!(Box<'a, crate::Stmt<'a>>, crate::Stmt<'a>,
// $variant_ty);             bridge_from!(crate::ModuleItem<'a>, Box<'a,
// crate::Stmt<'a>>, $variant_ty);         )*
//     };
// }

// bridge_decl!(
//     ClassDecl<'a>,
//     FnDecl<'a>,
//     VarDecl<'a>,
//     UsingDecl<'a>,
//     TsInterfaceDecl<'a>,
//     TsTypeAliasDecl<'a>,
//     TsEnumDecl<'a>,
//     TsModuleDecl<'a>
// );

// impl Take for Decl {
//     fn dummy() -> Self {
//         Decl::Var(Default::default())
//     }
// }

#[ast_node("FunctionDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct FnDecl<'a> {
    #[cfg_attr(feature = "serde-impl", serde(rename = "identifier"))]
    pub ident: Ident,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub declare: bool,

    #[cfg_attr(feature = "serde-impl", serde(flatten))]
    #[span]
    pub function: Box<'a, Function<'a>>,
}

// impl Take for FnDecl {
//     fn dummy() -> Self {
//         FnDecl {
//             ident: Take::dummy(),
//             declare: Default::default(),
//             function: Take::dummy(),
//         }
//     }
// }

#[ast_node("ClassDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ClassDecl<'a> {
    #[cfg_attr(feature = "serde-impl", serde(rename = "identifier"))]
    pub ident: Ident,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub declare: bool,

    #[cfg_attr(feature = "serde-impl", serde(flatten))]
    #[span]
    pub class: Box<'a, Class<'a>>,
}

// impl Take for ClassDecl {
//     fn dummy() -> Self {
//         ClassDecl {
//             ident: Take::dummy(),
//             declare: Default::default(),
//             class: Take::dummy(),
//         }
//     }
// }

#[ast_node("VariableDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct VarDecl<'a> {
    pub span: Span,

    pub ctxt: SyntaxContext,

    pub kind: VarDeclKind,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub declare: bool,

    #[cfg_attr(feature = "serde-impl", serde(rename = "declarations"))]
    pub decls: Vec<'a, VarDeclarator<'a>>,
}

// impl Take for VarDecl {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

#[derive(
    StringEnum, Clone, CloneIn, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan, Default,
)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(u32))]
pub enum VarDeclKind {
    /// `var`
    #[default]
    Var,
    /// `let`
    Let,
    /// `const`
    Const,
}

#[ast_node("VariableDeclarator")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct VarDeclarator<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "id"))]
    pub name: Pat<'a>,

    /// Initialization expression.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub init: Option<Expr<'a>>,

    /// Typescript only
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub definite: bool,
}

// impl Take for VarDeclarator {
//     fn dummy() -> Self {
//         VarDeclarator {
//             span: DUMMY_SP,
//             name: Take::dummy(),
//             init: Take::dummy(),
//             definite: Default::default(),
//         }
//     }
// }

#[ast_node("UsingDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct UsingDecl<'a> {
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_await: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decls: Vec<'a, VarDeclarator<'a>>,
}

// impl Take for UsingDecl {
//     fn dummy() -> Self {
//         Self {
//             span: DUMMY_SP,
//             is_await: Default::default(),
//             decls: Take::dummy(),
//         }
//     }
// }
