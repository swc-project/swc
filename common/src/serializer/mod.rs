use crate::AstNode;
use serde::{Deserialize, Serialize};

/// struct to add `type` field to json.
#[derive(Serialize, Deserialize)]
pub struct Node<T: AstNode> {
    #[serde(rename = "type")]
    ty: &'static str,
    #[serde(flatten)]
    pub node: T,
}

impl<T> From<T> for Node<T>
where
    T: AstNode,
{
    #[inline(always)]
    fn from(node: T) -> Self {
        Node { ty: T::TYPE, node }
    }
}

/// struct to extract `type` field from json.
#[derive(Deserialize)]
pub struct Type {
    /// TODO:
    #[serde(rename = "type")]
    pub ty: String,
}

