use serde::{Deserialize, Serialize};
use swc_common::ast_serde;

use crate::{
    class::ClassDeclaration,
    common::{BaseNode, Directive, Identifier, LVal},
    decl::{EnumDeclaration, FunctionDeclaration, VariableDeclaration},
    expr::Expression,
    flow::{
        DeclareClass, DeclareExportAllDeclaration, DeclareExportDeclaration, DeclareFunction,
        DeclareInterface, DeclareModule, DeclareModuleExports, DeclareOpaqueType, DeclareTypeAlias,
        DeclareVariable, InterfaceDeclaration, OpaqueType, TypeAlias,
    },
    module::{
        ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration, ImportDeclaration,
    },
    pat::{ArrayPattern, ObjectPattern},
    typescript::{
        TSDeclareFunction, TSEnumDeclaration, TSExportAssignment, TSImportEqualsDeclaration,
        TSInterfaceDeclaration, TSModuleDeclaration, TSNamespaceExportDeclaration,
        TSTypeAliasDeclaration,
    },
};

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Statement {
    #[tag("BlockStatement")]
    Block(BlockStatement),
    #[tag("BreakStatement")]
    Break(BreakStatement),
    #[tag("ContinueStatement")]
    Continue(ContinueStatement),
    #[tag("DebuggerStatement")]
    Debugger(DebuggerStatement),
    #[tag("DoWhileStatement")]
    DoWhile(DoWhileStatement),
    #[tag("EmptyStatement")]
    Empty(EmptyStatement),
    #[tag("ExpressionStatement")]
    Expr(ExpressionStatement),
    #[tag("ForInStatement")]
    ForIn(ForInStatement),
    #[tag("ForStatement")]
    For(ForStatement),
    #[tag("FunctionDeclaration")]
    FuncDecl(FunctionDeclaration),
    #[tag("IfStatement")]
    If(IfStatement),
    #[tag("LabeledStatement")]
    Labeled(LabeledStatement),
    #[tag("ReturnStatement")]
    Return(ReturnStatement),
    #[tag("SwitchStatement")]
    Switch(SwitchStatement),
    #[tag("ThrowStatement")]
    Throw(ThrowStatement),
    #[tag("TryStatement")]
    Try(TryStatement),
    #[tag("VariableDeclaration")]
    VarDecl(VariableDeclaration),
    #[tag("WhileStatement")]
    While(WhileStatement),
    #[tag("WithStatement")]
    With(WithStatement),
    #[tag("ClassDeclaration")]
    ClassDecl(ClassDeclaration),
    #[tag("ExportAllDeclaration")]
    ExportAllDecl(ExportAllDeclaration),
    #[tag("ExportDefaultDeclaration")]
    ExportDefaultDecl(ExportDefaultDeclaration),
    #[tag("ExportNamedDeclaration")]
    ExportNamedDecl(ExportNamedDeclaration),
    #[tag("ForOfStatement")]
    ForOf(ForOfStatement),
    #[tag("ImportDeclaration")]
    ImportDecl(ImportDeclaration),
    #[tag("DeclareClass")]
    DeclClass(DeclareClass),
    #[tag("DeclareFunction")]
    DeclFunc(DeclareFunction),
    #[tag("DeclareInterface")]
    DeclInterface(DeclareInterface),
    #[tag("DeclareModule")]
    DeclModule(DeclareModule),
    #[tag("DeclareModuleExports")]
    DeclareModuleExports(DeclareModuleExports),
    #[tag("DeclareTypeAlias")]
    DeclTypeAlias(DeclareTypeAlias),
    #[tag("DeclareOpaqueType")]
    DeclOpaqueType(DeclareOpaqueType),
    #[tag("DeclareVariable")]
    DeclVar(DeclareVariable),
    #[tag("DeclareExportDeclaration")]
    DeclExportDeclaration(DeclareExportDeclaration),
    #[tag("DeclareExportAllDeclaration")]
    DeclExportAllDeclaration(DeclareExportAllDeclaration),
    #[tag("InterfaceDeclaration")]
    InterfaceDecl(InterfaceDeclaration),
    #[tag("OpaqueType")]
    OpaqueType(OpaqueType),
    #[tag("TypeAlias")]
    TypeAlias(TypeAlias),
    #[tag("EnumDeclaration")]
    EnumDecl(EnumDeclaration),
    #[tag("TSDeclareFunction")]
    TSDeclFunc(TSDeclareFunction),
    #[tag("TSInterfaceDeclaration")]
    TSInterfaceDecl(TSInterfaceDeclaration),
    #[tag("TSTypeAliasDeclaration")]
    TSTypeAliasDecl(TSTypeAliasDeclaration),
    #[tag("TSEnumDeclaration")]
    TSEnumDecl(TSEnumDeclaration),
    #[tag("TSModuleDeclaration")]
    TSModuleDecl(TSModuleDeclaration),
    #[tag("TSImportEqualsDeclaration")]
    TSImportEqualsDecl(TSImportEqualsDeclaration),
    #[tag("TSExportAssignment")]
    TSExportAssignment(TSExportAssignment),
    #[tag("TSNamespaceExportDeclaration")]
    TSNamespaceExportDecl(TSNamespaceExportDeclaration),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum CompletionStatement {
    #[tag("BreakStatement")]
    Break(BreakStatement),
    #[tag("ContinueStatement")]
    Continue(ContinueStatement),
    #[tag("ReturnStatement")]
    Return(ReturnStatement),
    #[tag("ThrowStatement")]
    Throw(ThrowStatement),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Loop {
    #[tag("DoWhileStatement")]
    DoWhile(DoWhileStatement),
    #[tag("ForInStatement")]
    ForIn(ForInStatement),
    #[tag("ForStatement")]
    For(ForStatement),
    #[tag("WhileStatement")]
    While(WhileStatement),
    #[tag("ForOfStatement")]
    ForOf(ForOfStatement),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum For {
    #[tag("ForInStatement")]
    InStmt(ForInStatement),
    #[tag("ForStatement")]
    Stmt(ForStatement),
    #[tag("ForOfStatement")]
    OfStmt(ForOfStatement),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ForXStatement {
    #[tag("ForInStatement")]
    ForIn(ForInStatement),
    #[tag("ForOfStatement")]
    ForOf(ForOfStatement),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum While {
    #[tag("DoWhileStatement")]
    DoWhile(DoWhileStatement),
    #[tag("WhileStatement")]
    While(WhileStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct BlockStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<Statement>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub directives: Vec<Directive>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct BreakStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub label: Option<Identifier>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ContinueStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub label: Option<Identifier>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct DebuggerStatement {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct DoWhileStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Box<Expression>,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct EmptyStatement {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ExpressionStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ForStmtInit {
    #[tag("VariableDeclaration")]
    VarDecl(VariableDeclaration),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ForStmtLeft {
    #[tag("VariableDeclaration")]
    VarDecl(VariableDeclaration),
    #[tag("*")]
    LVal(LVal),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ForInStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: ForStmtLeft,
    pub right: Box<Expression>,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ForStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub init: Option<ForStmtInit>,
    #[serde(default)]
    pub test: Option<Box<Expression>>,
    #[serde(default)]
    pub update: Option<Box<Expression>>,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ForOfStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: ForStmtLeft,
    pub right: Box<Expression>,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct IfStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Box<Expression>,
    pub consequent: Box<Statement>,
    #[serde(default)]
    pub alternate: Option<Box<Statement>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct LabeledStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub label: Identifier,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ReturnStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub argument: Option<Box<Expression>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct SwitchCase {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub test: Option<Box<Expression>>,
    #[serde(default)]
    pub consequent: Vec<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct SwitchStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub discriminant: Box<Expression>,
    #[serde(default)]
    pub cases: Vec<SwitchCase>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ThrowStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum CatchClauseParam {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("ArrayPattern")]
    Array(ArrayPattern),
    #[tag("ObjectPattern")]
    Object(ObjectPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct CatchClause {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub param: Option<CatchClauseParam>,
    pub body: BlockStatement,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TryStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub block: BlockStatement,
    #[serde(default)]
    pub handler: Option<CatchClause>,
    #[serde(default)]
    pub finalizer: Option<BlockStatement>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct WhileStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Box<Expression>,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct WithStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<Expression>,
    pub body: Box<Statement>,
}
