use super::{Expr, Function};
use swc_common::Span;
use swc_macros::{ast_node, Deserialize, Serialize};

#[ast_node]
#[caniuse = "es6-class"]
pub struct Class {
    #[fold = "super_class"]
    #[serde = "superClass"]
    pub super_class: Option<Box<Expr>>,
    #[fold = "class_methods"]
    pub body: Vec<Option<ClassMethod>>,
}

#[ast_node]
pub struct ClassMethod {
    pub span: Span,
    pub key: Box<Expr>,
    pub function: Function,

    #[fold(ignore)]
    pub kind: ClassMethodKind,

    #[fold(ignore)]
    pub computed: bool,

    #[fold(ignore)]
    #[serde = "static"]
    pub is_static: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, EqIgnoreSpan, Hash, Serialize, Deserialize)]
pub enum ClassMethodKind {
    Constructor,
    Methor,
    Getter,
    Setter,
}
