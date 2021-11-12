pub use self::{charset::*, document::*, import::*, keyframe::*, media::*, page::*, support::*};
use crate::{Block, Ident, Str, Tokens, UrlValue};
use is_macro::Is;
use swc_common::{ast_node, Span};

mod charset;
mod document;
mod import;
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

#[ast_node("FontFaceRule")]
pub struct FontFaceRule {
    pub span: Span,
    pub block: Block,
}

#[ast_node]
pub enum NamespaceValue {
    #[tag("UrlValue")]
    Url(UrlValue),

    #[tag("Str")]
    Str(Str),
}

#[ast_node("NamespaceRule")]
pub struct NamespaceRule {
    pub span: Span,
    pub prefix: Ident,
    pub value: NamespaceValue,
}

#[ast_node("ViewportRule")]
pub struct ViewportRule {
    pub span: Span,
    pub block: Block,
}

#[ast_node("UnknownAtRule")]
pub struct UnknownAtRule {
    pub span: Span,
    pub name: Ident,
    pub tokens: Tokens,
}
