use serde::{Serialize, Deserialize};

use crate::ast::{
    common::{BaseNode, Identifier, LVal},
    decl::{VariableDeclaration, FunctionDeclaration},
    expr::{Expression},
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

    // #[serde(rename = "IfStatement")]
    // If(IfStatement),
    // #[serde(rename = "LabeledStatement")]
    // Labeled(LabeledStatement),
    // #[serde(rename = "ReturnStatement")]
    // Return(ReturnStatement),
    // #[serde(rename = "SwitchStatement")]
    // Switch(SwitchStatement),
    // #[serde(rename = "ThrowStatement")]
    // Throw(ThrowStatement),
    // #[serde(rename = "TryStatement")]
    // Try(TryStatement),
    // #[serde(rename = "VariableDeclaration")]
    // VarDecl(VariableDeclaration),
    // #[serde(rename = "WhileStatement")]
    // While(WhileStatement),
    // #[serde(rename = "WithStatement")]
    // With(WithStatement),
    // #[serde(rename = "ClassDeclaration")]
    // ClassDecl(ClassDeclaration),
    // #[serde(rename = "ExportAllDeclaration")]
    // ExportAllDecl(ExportAllDeclaration),
    // #[serde(rename = "ExportDefaultDeclaration")]
    // ExportDefaultDecl(ExportDefaultDeclaration),
    // #[serde(rename = "ExportNamedDeclaration")]
    // ExportNamedDecl(ExportNamedDeclaration),
    // #[serde(rename = "ForOfStatement")]
    // ForOf(ForOfStatement),
    // #[serde(rename = "ImportDeclaration")]
    // ImportDecl(ImportDeclaration),
    // #[serde(rename = "DeclareClass")]
    // DeclClass(DeclareClass),
    // #[serde(rename = "DeclareFunction")]
    // DeclFunc(DeclareFunction),
    // #[serde(rename = "DeclareInterface")]
    // DeclInterface(DeclareInterface),
    // #[serde(rename = "DeclareModule")]
    // DeclModule(DeclareModule),
    // #[serde(rename = "DeclareModuleExports")]
    // DeclareModuleExports(DeclareModuleExports),
    // #[serde(rename = "DeclareTypeAlias")]
    // DeclTypeAlias(DeclareTypeAlias),
    // #[serde(rename = "DeclareOpaqueType")]
    // DeclOpaqueType(DeclareOpaqueType),
    // #[serde(rename = "DeclareVariable")]
    // DeclVar(DeclareVariable),
    // #[serde(rename = "DeclareExportDeclaration")]
    // DeclExportDeclaration(DeclareExportDeclaration),
    // #[serde(rename = "DeclareExportAllDeclaration")]
    // DeclExportAllDeclaration(DeclareExportAllDeclaration),
    // #[serde(rename = "InterfaceDeclaration")]
    // InterfaceDecl(InterfaceDeclaration),
    // OpaqueType(OpaqueType),
    // TypeAlias(TypeAlias),
    // #[serde(rename = "EnumDeclaration")]
    // EnumDecl(EnumDeclaration),
    // #[serde(rename = "TSDeclareFunction")]
    // TSDeclFunc(TSDeclareFunction),
    // #[serde(rename = "TSInterfaceDeclaration")]
    // TSInterfaceDecl(TSInterfaceDeclaration),
    // #[serde(rename = "TSTypeAliasDeclaration")]
    // TSTypeAliasDecl(TSTypeAliasDeclaration),
    // #[serde(rename = "TSEnumDeclaration")]
    // TSEnumDecl(TSEnumDeclaration),
    // #[serde(rename = "TSModuleDeclaration")]
    // TSModuleDecl(TSModuleDeclaration),
    // #[serde(rename = "TSImportEqualsDeclaration")]
    // TSImportEqualsDecl(TSImportEqualsDeclaration),
    // TSExportAssignment(TSExportAssignment),
    // #[serde(rename = "TSNamespaceExportDeclaration")]
    // TSNamespaceExportDecl(TSNamespaceExportDeclaration),

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
pub struct Directive {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: DirectiveLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DirectiveLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: String,
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

