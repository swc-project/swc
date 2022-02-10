use swc_common::{ast_node, Span};

use crate::{Ident, Str, Url};

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
