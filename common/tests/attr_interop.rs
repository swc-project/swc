//! Test that `#[span]` and `#[fold]` can be used at same time.
use serde::{self, Deserialize, Serialize};
use swc_common::{self, ast_node, Span, Spanned};

#[ast_node("Class")]
// See https://github.com/rust-lang/rust/issues/44925
pub struct Class {
    #[span]
    pub has_span: HasSpan,
    pub s: String,
}

#[ast_node("Tuple")]
pub struct Tuple(#[span] HasSpan, usize, usize);

#[derive(Debug, Clone, PartialEq, Spanned, Serialize, Deserialize)]
pub struct HasSpan {
    pub span: Span,
}

#[ast_node]
pub enum Node {
    #[tag("Class")]
    Class(Class),
    #[tag("Tuple")]
    Tuple(Tuple),
}
