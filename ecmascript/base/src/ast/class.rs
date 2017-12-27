use super::{Expr, FnExpr};
use swc_common::Span;
use swc_macros::{ast_node, Deserialize, Serialize};

#[ast_node]
#[caniuse = "es6-class"]
pub struct Class {
    #[fold = "super_class"]
    #[serde = "superClass"]
    pub super_class: Option<Box<Expr>>,
    #[fold = "class_methods"]
    pub body: Vec<Option<MethodDef>>,
}

#[ast_node]
#[fold = "method"]
pub struct MethodDef {
    pub span: Span,
    pub key: Expr,
    pub value: FnExpr,

    #[fold(ignore)]
    pub kind: MethodDefKind,

    #[fold(ignore)]
    pub computed: bool,

    #[fold(ignore)]
    #[serde = "static"]
    pub is_static: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, EqIgnoreSpan, Hash, Serialize, Deserialize)]
pub enum MethodDefKind {
    Constructor,
    Methor,
    Getter,
    Setter,
}
