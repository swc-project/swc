use crate::{Function, MediaQuery, Str, UrlValue, Ident};
use swc_common::{ast_node, Span};

#[ast_node]
pub enum ImportSource {
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

#[ast_node("ImportRule")]
pub struct ImportRule {
    pub span: Span,
    pub src: ImportSource,
    pub layer_name: Option<ImportLayerName>,
    pub media: Option<MediaQuery>,
}
