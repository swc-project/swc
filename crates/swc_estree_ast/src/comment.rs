use serde::{Deserialize, Serialize};
use swc_common::ast_serde;

use crate::common::Loc;

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("BaseComment")]
pub struct BaseComment {
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
