use super::Expr;
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub struct Prop {
    pub span: Span,
    pub key: Box<Expr>,
    pub value: Box<Expr>,
    pub kind: PropKind,

    pub method: bool,
    pub shorthand: bool,
    pub computed: bool,
}

#[ast_node]
pub enum PropKind {
    Init,
    Get,
    Set,
}

// TODO:
// interface AssignmentProperty <: Property {
//     type: "Property"; // inherited
//     value: Pattern;
//     kind: "init";
//     method: false;
// }

// interface ObjectPattern <: Pattern {
//     type: "ObjectPattern";
//     properties: [ AssignmentProperty ];
// }
