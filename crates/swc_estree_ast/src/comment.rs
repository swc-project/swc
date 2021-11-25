use crate::common::Loc;
use serde::{Deserialize, Serialize};
use swc_common::ast_serde;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum CommentType {
    #[serde(rename = "CommentLine")]
    Line,
    #[serde(rename = "CommentBlock")]
    Block,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BaseComment {
    #[serde(rename = "type")]
    pub type_: CommentType,
    pub value: String,
    pub start: usize,
    pub end: usize,
    pub loc: Loc,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Comment {
    #[tag("CommentBlock")]
    Block(BaseComment),
    #[tag("CommentLine")]
    Line(BaseComment),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum CommentTypeShorthand {
    Leading,
    Inner,
    Trailing,
}
