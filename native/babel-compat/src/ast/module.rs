use serde::{Serialize, Deserialize};

use crate::ast::{
    common::{BaseNode},
    stmt::{Statement},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct InterpreterDirective {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: String,
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
pub struct Directive {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: DirectiveLiteral,
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
#[serde(tag = "type")]
pub struct Import {
    #[serde(flatten)]
    pub base: BaseNode,
}

