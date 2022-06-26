use serde::{Deserialize, Serialize};
use swc_common::ast_serde;

use crate::common::Loc;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum CommentType {
    #[serde(rename = "CommentLine")]
    Line,
    #[serde(rename = "CommentBlock")]
    Block,
}
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct BaseComment {
    #[serde(rename = "type")]
    pub type_: CommentType,
    pub value: String,
    pub start: u32,
    pub end: u32,
    pub loc: Loc,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde]
pub enum Comment {
    #[tag("CommentBlock")]
    Block(BaseComment),
    #[tag("CommentLine")]
    Line(BaseComment),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum CommentTypeShorthand {
    Leading,
    Inner,
    Trailing,
}
