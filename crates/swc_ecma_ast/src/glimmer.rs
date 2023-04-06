use swc_atoms::JsWord;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("GlimmerTemplate")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct GlimmerTemplate {
    pub span: Span,

    #[cfg_attr(
        any(feature = "rkyv-impl", feature = "rkyv-bytecheck-impl"),
        with(swc_atoms::EncodeJsWord)
    )]
    pub contents: JsWord,
}
