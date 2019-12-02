use serde::Deserialize;

#[derive(Deserialize)]
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
