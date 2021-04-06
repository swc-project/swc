use serde::{Serialize, Deserialize};
use serde_json::Value;

use crate::ast::{
    class::{ClassDeclaration},
    common::{BaseNode, Identifier, IdOrString, Directive},
    comment::Comment,
    decl::{Declaration, FunctionDeclaration},
    expr::Expression,
    lit::StringLiteral,
    stmt::Statement,
    typescript::TSDeclareFunction,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ModuleDeclaration {
    #[serde(rename = "ExportAllDeclaration")]
    ExportAll(ExportAllDeclaration),
    #[serde(rename = "ExportDefaultDeclaration")]
    ExportDefault(ExportDefaultDeclaration),
    #[serde(rename = "ExportNamedDeclaration")]
    ExportNamed(ExportNamedDeclaration),
    #[serde(rename = "ImportDeclaration")]
    Import(ImportDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ExportDeclaration {
    #[serde(rename = "ExportAllDeclaration")]
    ExportAll(ExportAllDeclaration),
    #[serde(rename = "ExportDefaultDeclaration")]
    ExportDefault(ExportDefaultDeclaration),
    #[serde(rename = "ExportNamedDeclaration")]
    ExportNamed(ExportNamedDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ModuleSpecifier {
    #[serde(rename = "ExportSpecifier")]
    Export(ExportSpecifier),
    #[serde(rename = "ImportDefaultSpecifier")]
    ImportDefault(ImportDefaultSpecifier),
    #[serde(rename = "ImportNamespaceSpecifier")]
    ImportNamespace(ImportNamespaceSpecifier),
    #[serde(rename = "ImportSpecifier")]
    Import(ImportSpecifier),
    #[serde(rename = "ExportNamespaceSpecifier")]
    ExportNamespace(ExportNamespaceSpecifier),
    #[serde(rename = "ExportDefaultSpecifier")]
    ExportDefault(ExportDefaultSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct File {
    #[serde(flatten)]
    pub base: BaseNode,
    pub program: Program,
    #[serde(default)]
    pub comments: Option<Vec<Comment>>,
    #[serde(default)]
    pub tokens: Option<Vec<Value>>, // TODO: is this the right way to model any?
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct InterpreterDirective {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SrcType {
    Script,
    Module,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct Program {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: Vec<Statement>,
    #[serde(default)]
    pub directives: Vec<Directive>,
    pub source_type: SrcType,
    #[serde(default)]
    pub interpreter: Option<InterpreterDirective>,
    #[serde(default)]
    pub source_file: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ExportKind {
    Type,
    Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: Identifier,
    pub exported: IdOrString,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportDefaultSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub exported: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportNamespaceSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub exported: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ExportAllDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub source: StringLiteral,
    #[serde(default)]
    pub assertions: Option<Vec<ImportAttribute>>,
    #[serde(default)]
    pub export_kind: Option<ExportKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum ExportDefaultDeclType {
    #[serde(rename = "FunctionDeclaration")]
    Func(FunctionDeclaration),
    #[serde(rename = "TSDeclareFunction")]
    TSFunc(TSDeclareFunction),
    #[serde(rename = "ClassDeclaration")]
    Class(ClassDeclaration),
    #[serde(rename = "Expression")]
    Expr(Expression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportDefaultDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub declaration: ExportDefaultDeclType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum ExportSpecifierType {
    #[serde(rename = "ExportSpecifier")]
    Export(ExportSpecifier),
    #[serde(rename = "ExportDefaultSpecifier")]
    Default(ExportDefaultSpecifier),
    #[serde(rename = "ExportNamespaceSpecifier")]
    Namespace(ExportNamespaceSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportNamedDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub declaration: Option<Box<Declaration>>,
    #[serde(default)]
    pub specifiers: Vec<ExportSpecifierType>,
    #[serde(default)]
    pub source: Option<StringLiteral>,
    #[serde(default)]
    pub assertions: Option<Vec<ImportAttribute>>,
    #[serde(default)]
    pub export_kind: Option<ExportKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct Import {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ImportAttribute {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: IdOrString,
    pub value: StringLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ImportSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: Identifier,
    pub imported: IdOrString,
    pub import_kind: ImportKind,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ImportDefaultSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ImportNamespaceSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum ImportSpecifierType {
    #[serde(rename = "ImportSpecifier")]
    Import(ImportSpecifier),
    #[serde(rename = "ImportDefaultSpecifier")]
    Default(ImportDefaultSpecifier),
    #[serde(rename = "ImportNamespaceSpecifier")]
    Namespace(ImportNamespaceSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ImportKind {
    Type,
    Typeof,
    Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ImportDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub specifiers: Vec<ImportSpecifierType>,
    pub source: StringLiteral,
    #[serde(default)]
    pub assertions: Option<Vec<ImportAttribute>>,
    #[serde(default)]
    pub import_kind: Option<ImportKind>,
}

