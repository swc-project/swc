#![allow(deprecated)]
#![deprecated = "Not used by swc, and this will be removed with next breaking change"]
use serde::Deserialize;

#[derive(Deserialize)]
#[deprecated = "Not used by swc, and this will be removed with next breaking change"]
pub struct Node<T> {
    #[serde(default, rename = "type")]
    pub ty: String,
    #[serde(flatten)]
    pub node: T,
}

#[derive(Deserialize)]
pub struct Type {
    #[serde(rename = "type")]
    pub ty: String,
}
