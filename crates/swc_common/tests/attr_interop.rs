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

#[derive(Debug, Clone, PartialEq, Eq, Spanned, Serialize, Deserialize)]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    archive(bound(serialize = "__S: rkyv::ser::Writer + rkyv::ser::ScratchSpace"))
)]
#[cfg_attr(feature = "rkyv-impl", archive(check_bytes))]

pub struct HasSpan {
    #[cfg_attr(feature = "__rkyv", omit_bounds)]
    pub span: Span,
}

#[ast_node]
pub enum Node {
    #[tag("Class")]
    Class(Class),
    #[tag("Tuple")]
    Tuple(Tuple),
}
