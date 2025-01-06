use is_macro::Is;
use swc_allocator::arena::{Box, Vec};
use swc_common::{
    arena::{ast_node, Take},
    EqIgnoreSpan, Span, SyntaxContext, DUMMY_SP,
};

use super::{
    decl::{Decl, VarDecl},
    expr::Expr,
    pat::Pat,
    Ident, Lit, Str, UsingDecl,
};

/// Use when only block statements are allowed.
#[ast_node("BlockStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct BlockStmt<'a> {
    /// Span including the braces.
    pub span: Span,

    pub ctxt: SyntaxContext,

    pub stmts: Vec<'a, Stmt<'a>>,
}

// impl Take for BlockStmt {
//     fn dummy() -> Self {
//         BlockStmt {
//             span: DUMMY_SP,
//             stmts: Vec::new(),
//             ctxt: Default::default(),
//         }
//     }
// }

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Stmt<'a> {
    // #[tag("BlockStatement")]
    Block(Box<'a, BlockStmt<'a>>),

    // #[tag("EmptyStatement")]
    Empty(Box<'a, EmptyStmt>),

    // #[tag("DebuggerStatement")]
    Debugger(Box<'a, DebuggerStmt>),

    // #[tag("WithStatement")]
    With(Box<'a, WithStmt<'a>>),

    // #[tag("ReturnStatement")]
    #[is(name = "return_stmt")]
    Return(Box<'a, ReturnStmt<'a>>),

    // #[tag("LabeledStatement")]
    Labeled(Box<'a, LabeledStmt<'a>>),

    // #[tag("BreakStatement")]
    #[is(name = "break_stmt")]
    Break(Box<'a, BreakStmt>),

    // #[tag("ContinueStatement")]
    #[is(name = "continue_stmt")]
    Continue(Box<'a, ContinueStmt>),

    // #[tag("IfStatement")]
    #[is(name = "if_stmt")]
    If(Box<'a, IfStmt<'a>>),

    // #[tag("SwitchStatement")]
    Switch(Box<'a, SwitchStmt<'a>>),

    // #[tag("ThrowStatement")]
    Throw(Box<'a, ThrowStmt<'a>>),

    /// A try statement. If handler is null then finalizer must be a BlockStmt.
    // #[tag("TryStatement")]
    #[is(name = "try_stmt")]
    Try(Box<'a, TryStmt<'a>>),

    // #[tag("WhileStatement")]
    #[is(name = "while_stmt")]
    While(Box<'a, WhileStmt<'a>>),

    // #[tag("DoWhileStatement")]
    DoWhile(Box<'a, DoWhileStmt<'a>>),

    // #[tag("ForStatement")]
    #[is(name = "for_stmt")]
    For(Box<'a, ForStmt<'a>>),

    // #[tag("ForInStatement")]
    ForIn(Box<'a, ForInStmt<'a>>),

    // #[tag("ForOfStatement")]
    ForOf(Box<'a, ForOfStmt<'a>>),

    // #[tag("ClassDeclaration")]
    // #[tag("FunctionDeclaration")]
    // #[tag("VariableDeclaration")]
    // #[tag("TsInterfaceDeclaration")]
    // #[tag("TsTypeAliasDeclaration")]
    // #[tag("TsEnumDeclaration")]
    // #[tag("TsModuleDeclaration")]
    // #[tag("UsingDeclaration")]
    Decl(Box<'a, Decl<'a>>),

    // #[tag("ExpressionStatement")]
    Expr(Box<'a, ExprStmt<'a>>),
}

// macro_rules! bridge_stmt {
//     ($($variant_ty:ty),*) => {
//         $(
//             bridge_from!(Stmt<'a>, Box<'a, $variant_ty>, $variant_ty);
//             bridge_from!(Box<'a, Stmt<'a>>, Stmt<'a>, $variant_ty);
//             bridge_from!(crate::ModuleItem<'a>, Box<'a, Stmt<'a>>,
// $variant_ty);         )*
//     };
// }

// bridge_stmt!(
//     ExprStmt<'a>,
//     BlockStmt<'a>,
//     EmptyStmt,
//     DebuggerStmt,
//     WithStmt<'a>,
//     ReturnStmt<'a>,
//     LabeledStmt<'a>,
//     BreakStmt,
//     ContinueStmt,
//     IfStmt<'a>,
//     SwitchStmt<'a>,
//     ThrowStmt<'a>,
//     TryStmt<'a>,
//     WhileStmt<'a>,
//     DoWhileStmt<'a>,
//     ForStmt<'a>,
//     ForInStmt<'a>,
//     ForOfStmt<'a>,
//     Decl<'a>
// );

impl Stmt<'_> {
    pub fn is_use_strict(&self) -> bool {
        self.as_expr()
            .map(|expr| &expr.expr)
            .and_then(|expr| expr.as_lit())
            .and_then(|lit| lit.as_str())
            .and_then(|s| s.raw.as_ref())
            .map_or(false, |value| {
                value == "\"use strict\"" || value == "'use strict'"
            })
    }

    /// Returns true if the statement does not prevent the directives below
    /// `self` from being directives.
    pub fn can_precede_directive(&self) -> bool {
        match self {
            Stmt::Expr(expr) => expr.expr.as_lit().is_some_and(|lit| lit.is_str()),
            _ => false,
        }
    }
}

// Memory layout depedns on the version of rustc.
// #[cfg(target_pointer_width = "64")]
// assert_eq_size!(Stmt, [u8; 56]);

// Implement Clone without inline to avoid multiple copies of the
// implementation.
// impl Clone for Stmt {
//     fn clone(&self) -> Self {
//         use Stmt::*;
//         match self {
//             Block(s) => Block(s.clone()),
//             Empty(s) => Empty(s.clone()),
//             Debugger(s) => Debugger(s.clone()),
//             With(s) => With(s.clone()),
//             Return(s) => Return(s.clone()),
//             Labeled(s) => Labeled(s.clone()),
//             Break(s) => Break(s.clone()),
//             Continue(s) => Continue(s.clone()),
//             If(s) => If(s.clone()),
//             Switch(s) => Switch(s.clone()),
//             Throw(s) => Throw(s.clone()),
//             Try(s) => Try(s.clone()),
//             While(s) => While(s.clone()),
//             DoWhile(s) => DoWhile(s.clone()),
//             For(s) => For(s.clone()),
//             ForIn(s) => ForIn(s.clone()),
//             ForOf(s) => ForOf(s.clone()),
//             Decl(s) => Decl(s.clone()),
//             Expr(s) => Expr(s.clone()),
//         }
//     }
// }

// impl Default for Stmt {
//     fn default() -> Self {
//         Self::Empty(EmptyStmt { span: DUMMY_SP })
//     }
// }

// impl Take for Stmt {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

#[ast_node("ExpressionStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ExprStmt<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
}

#[ast_node("EmptyStatement")]
#[derive(Eq, Hash, Copy, Clone, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct EmptyStmt {
    /// Span of semicolon.
    pub span: Span,
}

#[ast_node("DebuggerStatement")]
#[derive(Eq, Hash, Copy, Clone, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct DebuggerStmt {
    pub span: Span,
}

#[ast_node("WithStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct WithStmt<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "object"))]
    pub obj: Expr<'a>,
    pub body: Stmt<'a>,
}

#[ast_node("ReturnStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ReturnStmt<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "argument"))]
    pub arg: Option<Expr<'a>>,
}

#[ast_node("LabeledStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct LabeledStmt<'a> {
    pub span: Span,
    pub label: Ident,
    pub body: Stmt<'a>,
}

#[ast_node("BreakStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct BreakStmt {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub label: Option<Ident>,
}

#[ast_node("ContinueStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ContinueStmt {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub label: Option<Ident>,
}

#[ast_node("IfStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct IfStmt<'a> {
    pub span: Span,
    pub test: Expr<'a>,

    #[cfg_attr(feature = "serde-impl", serde(rename = "consequent"))]
    pub cons: Stmt<'a>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "alternate"))]
    pub alt: Option<Stmt<'a>>,
}

#[ast_node("SwitchStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SwitchStmt<'a> {
    pub span: Span,
    pub discriminant: Expr<'a>,
    pub cases: Vec<'a, SwitchCase<'a>>,
}

#[ast_node("ThrowStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ThrowStmt<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "argument"))]
    pub arg: Expr<'a>,
}

#[ast_node("TryStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TryStmt<'a> {
    pub span: Span,

    pub block: BlockStmt<'a>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub handler: Option<CatchClause<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub finalizer: Option<BlockStmt<'a>>,
}

#[ast_node("WhileStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct WhileStmt<'a> {
    pub span: Span,
    pub test: Expr<'a>,
    pub body: Stmt<'a>,
}

#[ast_node("DoWhileStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct DoWhileStmt<'a> {
    pub span: Span,
    pub test: Expr<'a>,
    pub body: Stmt<'a>,
}

#[ast_node("ForStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ForStmt<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub init: Option<VarDeclOrExpr<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub test: Option<Expr<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub update: Option<Expr<'a>>,

    pub body: Stmt<'a>,
}

#[ast_node("ForInStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ForInStmt<'a> {
    pub span: Span,
    pub left: ForHead<'a>,
    pub right: Expr<'a>,
    pub body: Stmt<'a>,
}

#[ast_node("ForOfStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ForOfStmt<'a> {
    pub span: Span,
    /// Span of the await token.
    ///
    /// es2018
    ///
    /// for-await-of statements, e.g., `for await (const x of xs) {`
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "await"))]
    pub is_await: bool,
    pub left: ForHead<'a>,
    pub right: Expr<'a>,
    pub body: Stmt<'a>,
}

// impl Take for ForOfStmt {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

#[ast_node("SwitchCase")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SwitchCase<'a> {
    pub span: Span,

    /// None for `default:`
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub test: Option<Expr<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(rename = "consequent"))]
    pub cons: Vec<'a, Stmt<'a>>,
}

// impl Take for SwitchCase {
//     fn dummy() -> Self {
//         Self {
//             span: DUMMY_SP,
//             test: None,
//             cons: Vec::new(),
//         }
//     }
// }

#[ast_node("CatchClause")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct CatchClause<'a> {
    pub span: Span,
    /// es2019
    ///
    /// The param is null if the catch binding is omitted. E.g., try { foo() }
    /// catch { bar() }
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub param: Option<Pat<'a>>,

    pub body: BlockStmt<'a>,
}

/// A head for for-in and for-of loop.
#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum ForHead<'a> {
    // #[tag("VariableDeclaration")]
    VarDecl(Box<'a, VarDecl<'a>>),

    // #[tag("UsingDeclaration")]
    UsingDecl(Box<'a, UsingDecl<'a>>),

    // #[tag("*")]
    Pat(Pat<'a>),
}

// bridge_from!(ForHead<'a>, Box<'a, VarDecl<'a>>, VarDecl<'a>);
// bridge_from!(ForHead<'a>, Box<'a, Pat<'a>>, Pat<'a>);

// impl Take for ForHead {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

// impl Default for ForHead {
//     fn default() -> Self {
//         ForHead::Pat(Take::dummy())
//     }
// }

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum VarDeclOrExpr<'a> {
    // #[tag("VariableDeclaration")]
    VarDecl(Box<'a, VarDecl<'a>>),

    // #[tag("*")]
    Expr(Expr<'a>),
}

// bridge_from!(VarDeclOrExpr<'a>, Box<'a, VarDecl<'a>>, VarDecl<'a>);
// bridge_from!(VarDeclOrExpr<'a>, Box<'a, Expr<'a>>, Expr<'a>);

// impl Take for VarDeclOrExpr {
//     fn dummy() -> Self {
//         VarDeclOrExpr::Expr(Take::dummy())
//     }
// }
