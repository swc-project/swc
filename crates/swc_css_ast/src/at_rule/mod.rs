pub use self::{
    charset::*, color_profile::*, counter_style::*, document::*, import::*, keyframe::*, layer::*,
    media::*, page::*, support::*,
    charset::*, color_profile::*, document::*, import::*, keyframe::*, layer::*, media::*, page::*,
    property::*, support::*,
};
use crate::{Block, DashedIdent, Ident, SimpleBlock, Str, Url, Value};
use is_macro::Is;
use swc_common::{ast_node, Span};

mod charset;
mod color_profile;
mod counter_style;
mod document;
mod import;
mod keyframe;
mod layer;
mod media;
mod page;
mod property;
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

    #[tag("LayerRule")]
    Layer(LayerRule),

    #[tag("MediaRule")]
    Media(MediaRule),

    #[tag("SupportsRule")]
    Supports(SupportsRule),

    #[tag("PageRule")]
    Page(PageRule),

    #[tag("PageMarginRule")]
    PageMargin(PageMarginRule),

    #[tag("NamespaceRule")]
    Namespace(NamespaceRule),

    #[tag("ViewportRule")]
    Viewport(ViewportRule),

    #[tag("DocumentRule")]
    Document(DocumentRule),

    #[tag("ColorProfileRule")]
    ColorProfile(ColorProfileRule),

    #[tag("CounterStyleRule")]
    CounterStyle(CounterStyleRule),
    #[tag("PropertyRule")]
    Property(PropertyRule),

    #[tag("UnknownAtRule")]
    Unknown(UnknownAtRule),
}

#[ast_node("FontFaceRule")]
pub struct FontFaceRule {
    pub span: Span,
    pub block: Block,
}

#[ast_node]
pub enum NamespaceUri {
    #[tag("Url")]
    Url(Url),

    #[tag("Str")]
    Str(Str),
}

#[ast_node("NamespaceRule")]
pub struct NamespaceRule {
    pub span: Span,
    pub prefix: Option<Ident>,
    pub uri: NamespaceUri,
}

#[ast_node("ViewportRule")]
pub struct ViewportRule {
    pub span: Span,
    pub block: Block,
}

#[ast_node]
pub enum AtRuleName {
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),

    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node("UnknownAtRule")]
pub struct UnknownAtRule {
    pub span: Span,
    pub name: AtRuleName,
    pub prelude: Vec<Value>,
    pub block: Option<SimpleBlock>,
}
