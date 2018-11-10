//! Test that `#[span]` and `#[fold]` can be used at same time.
extern crate swc_common;
extern crate swc_macros;
use swc_common::{Fold, Span, Spanned};
use swc_macros::ast_node;

#[ast_node]
// See https://github.com/rust-lang/rust/issues/44925
pub struct Class {
    #[span]
    pub has_span: HasSpan,
    #[fold(ignore)]
    pub s: String,
}

#[ast_node]
pub struct Tuple(#[span] HasSpan, #[fold(ignore)] usize, usize);

#[derive(Debug, Clone, PartialEq, Fold, Spanned)]
pub struct HasSpan {
    pub span: Span,
}
