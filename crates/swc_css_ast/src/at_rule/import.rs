use crate::{Declaration, Function, Ident, MediaQueryList, Str, SupportsCondition, Url};
use swc_common::{ast_node, Span};

#[ast_node]
pub enum ImportHref {
    #[tag("Url")]
    Url(Url),

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
    #[tag("SupportsCondition")]
    SupportsCondition(SupportsCondition),
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
