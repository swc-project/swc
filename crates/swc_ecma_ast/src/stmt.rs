use is_macro::Is;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span, DUMMY_SP};

use crate::{
    decl::{Decl, VarDecl},
    expr::Expr,
    ident::Ident,
    pat::Pat,
};

/// Use when only block statements are allowed.
#[ast_node("BlockStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct BlockStmt {
    /// Span including the braces.
    pub span: Span,

    pub stmts: Vec<Stmt>,
}

impl Take for BlockStmt {
    fn dummy() -> Self {
        BlockStmt {
            span: DUMMY_SP,
            stmts: vec![],
        }
    }
}

#[ast_node(no_clone)]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Stmt {
    #[tag("BlockStatement")]
    Block(BlockStmt),

    #[tag("EmptyStatement")]
    Empty(EmptyStmt),

    #[tag("DebuggerStatement")]
    Debugger(DebuggerStmt),

    #[tag("WithStatement")]
    With(WithStmt),

    #[tag("ReturnStatement")]
    #[is(name = "return_stmt")]
    Return(ReturnStmt),

    #[tag("LabeledStatement")]
    Labeled(LabeledStmt),

    #[tag("BreakStatement")]
    #[is(name = "break_stmt")]
    Break(BreakStmt),

    #[tag("ContinueStatement")]
    #[is(name = "continue_stmt")]
    Continue(ContinueStmt),

    #[tag("IfStatement")]
    #[is(name = "if_stmt")]
    If(IfStmt),

    #[tag("SwitchStatement")]
    Switch(SwitchStmt),

    #[tag("ThrowStatement")]
    Throw(ThrowStmt),

    /// A try statement. If handler is null then finalizer must be a BlockStmt.
    #[tag("TryStatement")]
    #[is(name = "try_stmt")]
    Try(TryStmt),

    #[tag("WhileStatement")]
    #[is(name = "while_stmt")]
    While(WhileStmt),

    #[tag("DoWhileStatement")]
    DoWhile(DoWhileStmt),

    #[tag("ForStatement")]
    #[is(name = "for_stmt")]
    For(ForStmt),

    #[tag("ForInStatement")]
    ForIn(ForInStmt),

    #[tag("ForOfStatement")]
    ForOf(ForOfStmt),

    #[tag("ClassDeclaration")]
    #[tag("FunctionDeclaration")]
    #[tag("VariableDeclaration")]
    #[tag("TsInterfaceDeclaration")]
    #[tag("TsTypeAliasDeclaration")]
    #[tag("TsEnumDeclaration")]
    #[tag("TsModuleDeclaration")]
    Decl(Decl),

    #[tag("ExpressionStatement")]
    Expr(ExprStmt),
}

// Implement Clone without inline to avoid multiple copies of the
// implementation.
impl Clone for Stmt {
    fn clone(&self) -> Self {
        use Stmt::*;
        match self {
            Block(s) => Block(s.clone()),
            Empty(s) => Empty(s.clone()),
            Debugger(s) => Debugger(s.clone()),
            With(s) => With(s.clone()),
            Return(s) => Return(s.clone()),
            Labeled(s) => Labeled(s.clone()),
            Break(s) => Break(s.clone()),
            Continue(s) => Continue(s.clone()),
            If(s) => If(s.clone()),
            Switch(s) => Switch(s.clone()),
            Throw(s) => Throw(s.clone()),
            Try(s) => Try(s.clone()),
            While(s) => While(s.clone()),
            DoWhile(s) => DoWhile(s.clone()),
            For(s) => For(s.clone()),
            ForIn(s) => ForIn(s.clone()),
            ForOf(s) => ForOf(s.clone()),
            Decl(s) => Decl(s.clone()),
            Expr(s) => Expr(s.clone()),
        }
    }
}

impl Take for Stmt {
    fn dummy() -> Self {
        Self::Empty(EmptyStmt { span: DUMMY_SP })
    }
}

#[ast_node("ExpressionStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ExprStmt {
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}

#[ast_node("EmptyStatement")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct EmptyStmt {
    /// Span of semicolon.
    pub span: Span,
}

#[ast_node("DebuggerStatement")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct DebuggerStmt {
    pub span: Span,
}

#[ast_node("WithStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct WithStmt {
    pub span: Span,
    #[serde(rename = "object")]
    pub obj: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ReturnStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ReturnStmt {
    pub span: Span,
    #[serde(default, rename = "argument")]
    pub arg: Option<Box<Expr>>,
}

#[ast_node("LabeledStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct LabeledStmt {
    pub span: Span,
    pub label: Ident,
    pub body: Box<Stmt>,
}

#[ast_node("BreakStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct BreakStmt {
    pub span: Span,
    #[serde(default)]
    pub label: Option<Ident>,
}

#[ast_node("ContinueStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ContinueStmt {
    pub span: Span,
    #[serde(default)]
    pub label: Option<Ident>,
}

#[ast_node("IfStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct IfStmt {
    pub span: Span,
    pub test: Box<Expr>,

    #[serde(rename = "consequent")]
    pub cons: Box<Stmt>,

    #[serde(default, rename = "alternate")]
    pub alt: Option<Box<Stmt>>,
}

#[ast_node("SwitchStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SwitchStmt {
    pub span: Span,
    pub discriminant: Box<Expr>,
    pub cases: Vec<SwitchCase>,
}

#[ast_node("ThrowStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ThrowStmt {
    pub span: Span,
    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("TryStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TryStmt {
    pub span: Span,

    pub block: BlockStmt,

    #[serde(default)]
    pub handler: Option<CatchClause>,

    #[serde(default)]
    pub finalizer: Option<BlockStmt>,
}

#[ast_node("WhileStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct WhileStmt {
    pub span: Span,
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("DoWhileStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct DoWhileStmt {
    pub span: Span,
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ForStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ForStmt {
    pub span: Span,

    #[serde(default)]
    pub init: Option<VarDeclOrExpr>,

    #[serde(default)]
    pub test: Option<Box<Expr>>,

    #[serde(default)]
    pub update: Option<Box<Expr>>,

    pub body: Box<Stmt>,
}

#[ast_node("ForInStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ForInStmt {
    pub span: Span,
    pub left: VarDeclOrPat,
    pub right: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ForOfStatement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ForOfStmt {
    pub span: Span,
    /// Span of the await token.
    ///
    /// es2018
    ///
    /// for-await-of statements, e.g., `for await (const x of xs) {`
    #[serde(default, rename = "await")]
    pub await_token: Option<Span>,
    pub left: VarDeclOrPat,
    pub right: Box<Expr>,
    pub body: Box<Stmt>,
}

impl Take for ForOfStmt {
    fn dummy() -> Self {
        ForOfStmt {
            span: DUMMY_SP,
            await_token: Default::default(),
            left: Take::dummy(),
            right: Take::dummy(),
            body: Take::dummy(),
        }
    }
}

#[ast_node("SwitchCase")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SwitchCase {
    pub span: Span,

    /// None for `default:`
    #[serde(default)]
    pub test: Option<Box<Expr>>,

    #[serde(rename = "consequent")]
    pub cons: Vec<Stmt>,
}

impl Take for SwitchCase {
    fn dummy() -> Self {
        Self {
            span: DUMMY_SP,
            test: None,
            cons: Vec::new(),
        }
    }
}

#[ast_node("CatchClause")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct CatchClause {
    pub span: Span,
    /// es2019
    ///
    /// The param is null if the catch binding is omitted. E.g., try { foo() }
    /// catch { bar() }
    #[serde(default)]
    pub param: Option<Pat>,

    pub body: BlockStmt,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum VarDeclOrPat {
    #[tag("VariableDeclaration")]
    VarDecl(VarDecl),

    #[tag("*")]
    Pat(Pat),
}

impl Take for VarDeclOrPat {
    fn dummy() -> Self {
        VarDeclOrPat::Pat(Take::dummy())
    }
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum VarDeclOrExpr {
    #[tag("VariableDeclaration")]
    VarDecl(VarDecl),

    #[tag("*")]
    Expr(Box<Expr>),
}

impl Take for VarDeclOrExpr {
    fn dummy() -> Self {
        VarDeclOrExpr::Expr(Take::dummy())
    }
}
