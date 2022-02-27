use is_macro::Is;
use swc_common::{ast_node, Span};

pub use self::{
    charset::*, color_profile::*, counter_style::*, document::*, font_face::*, import::*,
    keyframe::*, layer::*, media::*, namespace::*, nest::*, page::*, property::*, support::*,
    viewport::*,
};
use crate::{ComponentValue, DashedIdent, Ident, SimpleBlock};

mod charset;
mod color_profile;
mod counter_style;
mod document;
mod font_face;
mod import;
mod keyframe;
mod layer;
mod media;
mod namespace;
mod nest;
mod page;
mod property;
mod support;
mod viewport;

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

    #[tag("NestRule")]
    Nest(NestRule),

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
    pub prelude: Vec<ComponentValue>,
    pub block: Option<SimpleBlock>,
}
