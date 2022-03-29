use is_macro::Is;
use swc_common::{ast_node, Span};

pub use self::{
    color_profile::*, counter_style::*, document::*, import::*, keyframe::*, layer::*, media::*,
    namespace::*, nest::*, page::*, support::*,
};
use crate::{ComponentValue, DashedIdent, Ident, SimpleBlock, Str};

mod color_profile;
mod counter_style;
mod document;
mod import;
mod keyframe;
mod layer;
mod media;
mod namespace;
mod nest;
mod page;
mod support;

#[ast_node]
#[derive(Is)]
pub enum AtRule {
    #[tag("ImportRule")]
    Import(ImportRule),

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

    #[tag("DocumentRule")]
    Document(DocumentRule),

    #[tag("ColorProfileRule")]
    ColorProfile(ColorProfileRule),

    #[tag("CounterStyleRule")]
    CounterStyle(CounterStyleRule),

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

#[ast_node("AtRule")]
pub struct UnknownAtRule {
    pub span: Span,
    pub name: AtRuleName,
    pub prelude: AtRulePrelude,
    pub block: Option<SimpleBlock>,
}

#[ast_node]
pub enum AtRulePrelude {
    #[tag("CharsetPrelude")]
    CharsetPrelude(CharsetPrelude),
    #[tag("PropertyPrelude")]
    PropertyPrelude(PropertyPrelude),
    #[tag("ListOfComponentValues")]
    ListOfComponentValues(ListOfComponentValues),
}

#[ast_node("ListOfComponentValues")]
pub struct ListOfComponentValues {
    pub span: Span,
    pub children: Vec<ComponentValue>,
}

#[ast_node("CharsetPrelude")]
pub struct CharsetPrelude {
    pub span: Span,
    pub charset: Str,
}

#[ast_node("PropertyPrelude")]
pub struct PropertyPrelude {
    pub span: Span,
    pub name: DashedIdent,
}
