use is_macro::Is;
use swc_common::{ast_node, Span};

pub use self::{
    import::*, keyframe::*, layer::*, media::*, namespace::*, nest::*, page::*, support::*,
};
use crate::{ComponentValue, CustomIdent, DashedIdent, Function, Ident, SimpleBlock, Str, Url};

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
    #[tag("ListOfComponentValues")]
    ListOfComponentValues(ListOfComponentValues),
    #[tag("CharsetPrelude")]
    CharsetPrelude(CharsetPrelude),
    #[tag("PropertyPrelude")]
    PropertyPrelude(PropertyPrelude),
    #[tag("CounterStylePrelude")]
    CounterStylePrelude(CounterStylePrelude),
    #[tag("ColorProfilePrelude")]
    ColorProfilePrelude(ColorProfilePrelude),
    #[tag("DocumentPrelude")]
    DocumentPrelude(DocumentPrelude),
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

#[ast_node("CounterStylePrelude")]
pub struct CounterStylePrelude {
    pub span: Span,
    pub name: CustomIdent,
}

#[ast_node("ColorProfilePrelude")]
pub struct ColorProfilePrelude {
    pub span: Span,
    pub name: ColorProfilePreludeName,
}

#[ast_node]
pub enum ColorProfilePreludeName {
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),
    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node("DocumentPrelude")]
pub struct DocumentPrelude {
    pub span: Span,
    pub matching_functions: Vec<DocumentPreludeMatchingFunction>,
}

#[ast_node]
pub enum DocumentPreludeMatchingFunction {
    #[tag("Url")]
    Url(Url),
    #[tag("Function")]
    Function(Function),
}
