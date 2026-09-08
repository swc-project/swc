//! Test that `#[span]` and `#[fold]` can be used at same time.
#![allow(unexpected_cfgs)]

use serde::{Deserialize, Serialize};
use swc_common::{ast_node, Span, Spanned};

#[ast_node("Class")]
// See https://github.com/rust-lang/rust/issues/44925
pub struct Class {
    #[span]
    pub has_span: HasSpan,
    pub s: String,
}

#[ast_node("Tuple")]
pub struct Tuple(#[span] HasSpan, u64, u64);

#[derive(Debug, Clone, PartialEq, Eq, Spanned, Serialize, Deserialize)]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
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
