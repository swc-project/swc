use crate::{Declaration, Function, Ident, MediaQueryList, Str, SupportQuery, UrlValue};
use swc_common::{ast_node, Span};

#[ast_node]
pub enum ImportHref {
    #[tag("Function")]
    Function(Function),

    #[tag("UrlValue")]
    Url(UrlValue),

    #[tag("Str")]
    Str(Str),
}

#[ast_node]
pub enum ImportLayerName {
    #[tag("Ident")]
    Ident(Ident),

    #[tag("Function")]
    Function(Function),
}

#[ast_node]
pub enum ImportSupportsType {
    #[tag("SupportQuery")]
    SupportQuery(SupportQuery),
    #[tag("Declaration")]
    Declaration(Declaration),
}

#[ast_node("ImportRule")]
pub struct ImportRule {
    pub span: Span,
    pub href: ImportHref,
    pub layer_name: Option<ImportLayerName>,
    pub supports: Option<ImportSupportsType>,
    pub media: Option<MediaQueryList>,
}
