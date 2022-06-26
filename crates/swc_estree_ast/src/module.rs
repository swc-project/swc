use serde::{Deserialize, Serialize};
use serde_json::Value;
use swc_atoms::JsWord;
use swc_common::ast_serde;

use crate::{
    class::ClassDeclaration,
    comment::Comment,
    common::{BaseNode, Directive, IdOrString, Identifier},
    decl::{Declaration, FunctionDeclaration},
    expr::Expression,
    lit::StringLiteral,
    stmt::Statement,
    typescript::TSDeclareFunction,
};

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ModuleDeclaration {
    #[tag("ExportAllDeclaration")]
    ExportAll(ExportAllDeclaration),
    #[tag("ExportDefaultDeclaration")]
    ExportDefault(ExportDefaultDeclaration),
    #[tag("ExportNamedDeclaration")]
    ExportNamed(ExportNamedDeclaration),
    #[tag("ImportDeclaration")]
    Import(ImportDeclaration),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ExportDeclaration {
    #[tag("ExportAllDeclaration")]
    ExportAll(ExportAllDeclaration),
    #[tag("ExportDefaultDeclaration")]
    ExportDefault(ExportDefaultDeclaration),
    #[tag("ExportNamedDeclaration")]
    ExportNamed(ExportNamedDeclaration),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ModuleSpecifier {
    #[tag("ExportSpecifier")]
    Export(ExportSpecifier),
    #[tag("ImportDefaultSpecifier")]
    ImportDefault(ImportDefaultSpecifier),
    #[tag("ImportNamespaceSpecifier")]
    ImportNamespace(ImportNamespaceSpecifier),
    #[tag("ImportSpecifier")]
    Import(ImportSpecifier),
    #[tag("ExportNamespaceSpecifier")]
    ExportNamespace(ExportNamespaceSpecifier),
    #[tag("ExportDefaultSpecifier")]
    ExportDefault(ExportDefaultSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct InterpreterDirective {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: JsWord,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum SrcType {
    Script,
    Module,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct Program {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: Vec<Statement>,
    #[serde(default, skip_serializing_if = "crate::ser::skip_comments_on_program")]
    pub comments: Vec<Comment>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub directives: Vec<Directive>,
    pub source_type: SrcType,
    #[serde(default, skip_serializing_if = "crate::ser::skip_interpreter")]
    pub interpreter: Option<InterpreterDirective>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub source_file: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ExportKind {
    Type,
    Value,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ExportSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: ModuleExportNameType,
    pub exported: ModuleExportNameType,
    pub export_kind: ExportKind,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ExportDefaultSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub exported: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ExportNamespaceSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub exported: ModuleExportNameType,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ExportDefaultDeclType {
    #[tag("FunctionDeclaration")]
    Func(FunctionDeclaration),
    #[tag("TSDeclareFunction")]
    TSFunc(TSDeclareFunction),
    #[tag("ClassDeclaration")]
    Class(ClassDeclaration),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ExportDefaultDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub declaration: ExportDefaultDeclType,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ExportSpecifierType {
    #[tag("ExportSpecifier")]
    Export(ExportSpecifier),
    #[tag("ExportDefaultSpecifier")]
    Default(ExportDefaultSpecifier),
    #[tag("ExportNamespaceSpecifier")]
    Namespace(ExportNamespaceSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct Import {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ImportAttribute {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: IdOrString,
    pub value: StringLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ImportSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: Identifier,
    pub imported: ModuleExportNameType,
    #[serde(default)]
    pub import_kind: Option<ImportKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ImportDefaultSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ImportNamespaceSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: Identifier,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ImportSpecifierType {
    #[tag("ImportSpecifier")]
    Import(ImportSpecifier),
    #[tag("ImportDefaultSpecifier")]
    Default(ImportDefaultSpecifier),
    #[tag("ImportNamespaceSpecifier")]
    Namespace(ImportNamespaceSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ImportKind {
    Type,
    Typeof,
    Value,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ModuleExportNameType {
    #[tag("Identifier")]
    Ident(Identifier),
    #[tag("StringLiteral")]
    Str(StringLiteral),
}
