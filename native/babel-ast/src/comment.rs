use serde::{Serialize, Deserialize};

use crate::common::Loc;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct BaseComment {
    pub value: String,
    pub start: usize,
    pub end: usize,
    pub loc: Loc,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub enum Comment {
    #[serde(rename = "CommentBlock")]
    Block(BaseComment),
    #[serde(rename = "CommentLine")]
    Line(BaseComment),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum CommentTypeShorthand {
    Leading,
    Inner,
    Trailing,
}

