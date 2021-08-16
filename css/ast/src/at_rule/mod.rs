pub use self::keyframe::*;
use crate::Str;
use is_macro::Is;
use swc_common::{ast_node, Span};

mod keyframe;

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
}

#[ast_node("MediaRule")]
pub struct MediaRule {
    pub span: Span,
}

#[ast_node("SupportsRule")]
pub struct SupportsRule {
    pub span: Span,
}

#[ast_node("PageRule")]
pub struct PageRule {
    pub span: Span,
}
