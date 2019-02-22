use serde::Deserialize;

#[derive(Deserialize)]
pub struct Node<T> {
    #[serde(rename = "type")]
    pub ty: String,
    #[serde(flatten)]
    pub node: T,
}

/// struct to extract `type` field from json.
#[derive(Deserialize)]
pub struct Type {
    /// TODO:
    #[serde(rename = "type")]
    pub ty: String,
}
