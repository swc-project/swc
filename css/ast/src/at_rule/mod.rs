pub use self::{keyframe::*, media::*, support::*};
use crate::{DeclBlock, Str, Text};
use is_macro::Is;
use swc_common::{ast_node, Span};

mod keyframe;
mod media;
mod support;

#[ast_node]
#[derive(Is)]
pub enum AtRule {
    #[tag("CharsetRule")]
    Charset(CharsetRule),

    #[tag("ImportRule")]
    Import(ImportRule),

    #[tag("FontFaceRule")]
    FontFace(FontFaceRule),

    #[tag("KeyframesRule")]
    Keyframes(KeyframesRule),

    #[tag("MediaRule")]
    Media(MediaRule),

    #[tag("SupportsRule")]
    Supports(SupportsRule),

    #[tag("PageRule")]
    Page(PageRule),

    #[tag("NamespaceRule")]
    Namespace(NamespaceRule),
}

#[ast_node("CharsetRule")]
pub struct CharsetRule {
    pub span: Span,
    pub charset: Str,
}

#[ast_node("ImportRule")]
pub struct ImportRule {
    pub span: Span,
    pub src: Str,
}

#[ast_node("FontFaceRule")]
pub struct FontFaceRule {
    pub span: Span,
    pub block: DeclBlock,
}

#[ast_node("PageRule")]
pub struct PageRule {
    pub span: Span,
}

#[ast_node("NamespaceRule")]
pub struct NamespaceRule {
    pub span: Span,
    pub prefix: Text,
    pub value: Str,
}
