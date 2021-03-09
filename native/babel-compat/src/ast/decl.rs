use serde::{Serialize, Deserialize};

use crate::ast::{
    common::{BaseNode, LVal, Identifier, Param, TypeAnnotOrNoop, TypeParamDeclOrNoop},
    stmt::{BlockStatement},
    expr::{Expression},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum VariableDeclarationKind {
    Var,
    Let,
    Const,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct VariableDeclarator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: LVal,
    #[serde(default)]
    pub init: Option<Expression>,
    #[serde(default)]
    pub definite: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct VariableDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: VariableDeclarationKind,
    #[serde(default)]
    pub declarations: Vec<VariableDeclarator>,
    #[serde(default)]
    pub declare: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct FunctionDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub id: Option<Identifier>,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub return_type: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

