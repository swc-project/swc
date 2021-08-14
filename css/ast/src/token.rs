use serde::Deserialize;
use serde::Serialize;
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node("Tokens")]
pub struct Tokens {
    pub span: Span,
    pub tokens: Vec<TokenAndSpan>,
}

#[ast_node]
pub struct TokenAndSpan {
    pub span: Span,
    pub token: ValueToken,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub enum ValueToken {
    Ident(JsWord),
}
