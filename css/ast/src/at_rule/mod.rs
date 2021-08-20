pub use self::{document::*, keyframe::*, media::*, page::*, support::*};
use crate::{DeclBlock, Str, Text, Tokens};
use is_macro::Is;
use swc_common::{ast_node, Span};

mod document;
mod keyframe;
mod media;
mod page;
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

    #[tag("ViewportRule")]
    Viewport(ViewportRule),

    #[tag("DocumentRule")]
    Document(DocumentRule),

    #[tag("UnknownAtRule")]
    Unknown(UnknownAtRule),
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
    pub condition: Option<MediaQuery>,
}

#[ast_node("FontFaceRule")]
pub struct FontFaceRule {
    pub span: Span,
    pub block: DeclBlock,
}

#[ast_node("NamespaceRule")]
pub struct NamespaceRule {
    pub span: Span,
    pub prefix: Text,
    pub value: Str,
}

#[ast_node("ViewportRule")]
pub struct ViewportRule {
    pub span: Span,
    pub block: DeclBlock,
}

#[ast_node("UnknownAtRule")]
pub struct UnknownAtRule {
    pub span: Span,
    pub name: Text,
    pub tokens: Tokens,
}
