use crate::Str;
use is_macro::Is;
use swc_common::{ast_node, Span};

#[ast_node]
#[derive(Is)]
pub enum AtRule {
    #[tag("CharsetRule")]
    Charset(CharsetRule),

    #[tag("ImportRule")]
    Import(ImportRule),
}

#[ast_node]
pub struct CharsetRule {
    pub span: Span,
    pub charset: Str,
}

#[ast_node]
pub struct ImportRule {
    pub span: Span,
    pub src: Str,
}
