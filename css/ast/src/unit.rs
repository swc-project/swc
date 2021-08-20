use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node]
pub struct Unit {
    pub span: Span,
    pub kind: UnitKind,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum UnitKind {
    #[serde(rename = "px")]
    Px,
    Custom(JsWord),
}

impl From<JsWord> for UnitKind {
    fn from(s: JsWord) -> Self {
        match &*s.to_ascii_lowercase() {
            "px" => UnitKind::Px,
            _ => UnitKind::Custom(s),
        }
    }
}
