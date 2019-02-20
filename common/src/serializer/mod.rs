use crate::AstNode;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

/// struct to add `type` field to json.
#[derive(Serialize, Deserialize)]
pub struct Node<T>
where
    T: AstNode,
{
    #[serde(rename = "type")]
    ty: Cow<'static, str>,
    #[serde(flatten)]
    pub node: T,
}

impl<T> From<T> for Node<T>
where
    T: AstNode,
{
    #[inline(always)]
    fn from(node: T) -> Self {
        assert_eq!(T::types().len(), 1);
        Node {
            ty: Cow::Borrowed(T::types()[0]),
            node,
        }
    }
}

/// struct to extract `type` field from json.
#[derive(Deserialize)]
pub struct Type {
    /// TODO:
    #[serde(rename = "type")]
    pub ty: String,
}
