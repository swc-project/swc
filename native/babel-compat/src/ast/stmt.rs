use serde::{Serialize, Deserialize};

use crate::ast::{
    class::{ClassDeclaration},
    common::{BaseNode, Identifier, LVal, Directive},
    decl::{VariableDeclaration, FunctionDeclaration, EnumDeclaration},
    expr::{Expression},
    flow::{
        DeclareClass, DeclareFunction, DeclareInterface, DeclareModule, DeclareModuleExports, 
        DeclareTypeAlias, DeclareOpaqueType, DeclareVariable, DeclareExportDeclaration,
        DeclareExportAllDeclaration, InterfaceDeclaration, OpaqueType, TypeAlias
    },
    module::{ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration, ImportDeclaration},
    pat::{ObjectPattern, ArrayPattern},
    typescript::{
        TSDeclareFunction, TSInterfaceDeclaration, TSTypeAliasDeclaration, TSEnumDeclaration,
        TSModuleDeclaration, TSImportEqualsDeclaration, TSExportAssignment,
        TSNamespaceExportDeclaration
    },
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Statement {
    #[serde(rename = "BlockStatement")]
    Block(BlockStatement),
    #[serde(rename = "BreakStatement")]
    Break(BreakStatement),
    #[serde(rename = "ContinueStatement")]
    Continue(ContinueStatement),
    #[serde(rename = "DebuggerStatement")]
    Debugger(DebuggerStatement),
    #[serde(rename = "DoWhileStatement")]
    DoWhile(DoWhileStatement),
    #[serde(rename = "EmptyStatement")]
    Empty(EmptyStatement),
    #[serde(rename = "ExpressionStatement")]
    Expr(ExpressionStatement),
    #[serde(rename = "ForInStatement")]
    ForIn(ForInStatement),
    #[serde(rename = "ForStatement")]
    For(ForStatement),
    #[serde(rename = "FunctionDeclaration")]
    FuncDecl(FunctionDeclaration),
    #[serde(rename = "IfStatement")]
    If(IfStatement),
    #[serde(rename = "LabeledStatement")]
    Labeled(LabeledStatement),
    #[serde(rename = "ReturnStatement")]
    Return(ReturnStatement),
    #[serde(rename = "SwitchStatement")]
    Switch(SwitchStatement),
    #[serde(rename = "ThrowStatement")]
    Throw(ThrowStatement),
    #[serde(rename = "TryStatement")]
    Try(TryStatement),
    #[serde(rename = "VariableDeclaration")]
    VarDecl(VariableDeclaration),
    #[serde(rename = "WhileStatement")]
    While(WhileStatement),
    #[serde(rename = "WithStatement")]
    With(WithStatement),
    #[serde(rename = "ClassDeclaration")]
    ClassDecl(ClassDeclaration),
    #[serde(rename = "ExportAllDeclaration")]
    ExportAllDecl(ExportAllDeclaration),
    #[serde(rename = "ExportDefaultDeclaration")]
    ExportDefaultDecl(ExportDefaultDeclaration),
    #[serde(rename = "ExportNamedDeclaration")]
    ExportNamedDecl(ExportNamedDeclaration),
    #[serde(rename = "ForOfStatement")]
    ForOf(ForOfStatement),
    #[serde(rename = "ImportDeclaration")]
    ImportDecl(ImportDeclaration),
    #[serde(rename = "DeclareClass")]
    DeclClass(DeclareClass),
    #[serde(rename = "DeclareFunction")]
    DeclFunc(DeclareFunction),
    #[serde(rename = "DeclareInterface")]
    DeclInterface(DeclareInterface),
    #[serde(rename = "DeclareModule")]
    DeclModule(DeclareModule),
    #[serde(rename = "DeclareModuleExports")]
    DeclareModuleExports(DeclareModuleExports),
    #[serde(rename = "DeclareTypeAlias")]
    DeclTypeAlias(DeclareTypeAlias),
    #[serde(rename = "DeclareOpaqueType")]
    DeclOpaqueType(DeclareOpaqueType),
    #[serde(rename = "DeclareVariable")]
    DeclVar(DeclareVariable),
    #[serde(rename = "DeclareExportDeclaration")]
    DeclExportDeclaration(DeclareExportDeclaration),
    #[serde(rename = "DeclareExportAllDeclaration")]
    DeclExportAllDeclaration(DeclareExportAllDeclaration),
    #[serde(rename = "InterfaceDeclaration")]
    InterfaceDecl(InterfaceDeclaration),
    OpaqueType(OpaqueType),
    TypeAlias(TypeAlias),
    #[serde(rename = "EnumDeclaration")]
    EnumDecl(EnumDeclaration),
    #[serde(rename = "TSDeclareFunction")]
    TSDeclFunc(TSDeclareFunction),
    #[serde(rename = "TSInterfaceDeclaration")]
    TSInterfaceDecl(TSInterfaceDeclaration),
    #[serde(rename = "TSTypeAliasDeclaration")]
    TSTypeAliasDecl(TSTypeAliasDeclaration),
    #[serde(rename = "TSEnumDeclaration")]
    TSEnumDecl(TSEnumDeclaration),
    #[serde(rename = "TSModuleDeclaration")]
    TSModuleDecl(TSModuleDeclaration),
    #[serde(rename = "TSImportEqualsDeclaration")]
    TSImportEqualsDecl(TSImportEqualsDeclaration),
    TSExportAssignment(TSExportAssignment),
    #[serde(rename = "TSNamespaceExportDeclaration")]
    TSNamespaceExportDecl(TSNamespaceExportDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum CompletionStatement {
    #[serde(rename = "BreakStatement")]
    Break(BreakStatement),
    #[serde(rename = "ContinueStatement")]
    Continue(ContinueStatement),
    #[serde(rename = "ReturnStatement")]
    Return(ReturnStatement),
    #[serde(rename = "ThrowStatement")]
    Throw(ThrowStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Loop {
    #[serde(rename = "DoWhileStatement")]
    DoWhile(DoWhileStatement),
    #[serde(rename = "ForInStatement")]
    ForIn(ForInStatement),
    #[serde(rename = "ForStatement")]
    For(ForStatement),
    #[serde(rename = "WhileStatement")]
    While(WhileStatement),
    #[serde(rename = "ForOfStatement")]
    ForOf(ForOfStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum For {
    #[serde(rename = "ForInStatement")]
    InStmt(ForInStatement),
    #[serde(rename = "ForStatement")]
    Stmt(ForStatement),
    #[serde(rename = "ForOfStatement")]
    OfStmt(ForOfStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ForXStatement {
    #[serde(rename = "ForInStatement")]
    ForIn(ForInStatement),
    #[serde(rename = "ForOfStatement")]
    ForOf(ForOfStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum While {
    #[serde(rename = "DoWhileStatement")]
    DoWhile(DoWhileStatement),
    #[serde(rename = "WhileStatement")]
    While(WhileStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BlockStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<Statement>,
    #[serde(default)]
    pub directives: Vec<Directive>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BreakStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub label: Option<Identifier>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ContinueStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub label: Option<Identifier>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DebuggerStatement {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DoWhileStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Expression,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct EmptyStatement {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExpressionStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ForStmtInit {
    #[serde(rename = "VariableDeclaration")]
    VarDecl(VariableDeclaration),
    #[serde(rename = "Expression")]
    Expr(Expression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ForStmtLeft {
    #[serde(rename = "VariableDeclaration")]
    VarDecl(VariableDeclaration),
    LVal(LVal),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ForInStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: ForStmtLeft,
    pub right: Expression,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ForStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub init: Option<ForStmtInit>,
    #[serde(default)]
    pub test: Option<Expression>,
    #[serde(default)]
    pub update: Option<Expression>,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ForOfStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: ForStmtLeft,
    pub right: Expression,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct IfStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Expression,
    pub consequent: Box<Statement>,
    #[serde(default)]
    pub alternate: Option<Box<Statement>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct LabeledStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub label: Identifier,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ReturnStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub argument: Option<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SwitchCase {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub test: Option<Expression>,
    #[serde(default)]
    pub consequent: Vec<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SwitchStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub discriminant: Expression,
    #[serde(default)]
    pub cases: Vec<SwitchCase>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ThrowStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum CatchClauseParam {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "ArrayPattern")]
    Array(ArrayPattern),
    #[serde(rename = "ObjectPattern")]
    Object(ObjectPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct CatchClause {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub param: Option<CatchClauseParam>,
    pub body: BlockStatement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct WhileStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Expression,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct WithStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Expression,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct StaticBlock {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<Statement>,
}

