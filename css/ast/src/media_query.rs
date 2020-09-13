use swc_common::{ast_node, Span};

#[ast_node]
pub enum MediaQuery {
    #[tag("AndMediaQuery")]
    And(AndMediaQuery),
    #[tag("OrMediaQuery")]
    Or(OrMediaQuery),
}

#[ast_node]
pub struct AndMediaQuery {
    pub span: Span,
    pub queries: Vec<MediaQuery>,
}

#[ast_node]
pub struct OrMediaQuery {
    pub span: Span,
    pub queries: Vec<MediaQuery>,
}
