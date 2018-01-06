use super::{Expr, Function, PropName};
use swc_common::Span;
use swc_common::fold::FoldWith;
use swc_macros::{ast_node, Deserialize, Serialize};

#[ast_node]
#[caniuse = "es6-class"]
pub struct Class {
    #[serde = "superClass"]
    pub super_class: Option<Box<Expr>>,
    pub body: Vec<ClassMethod>,
}

#[ast_node]
pub struct ClassMethod {
    pub span: Span,
    pub key: PropName,
    pub function: Function,

    #[fold(ignore)]
    pub kind: ClassMethodKind,

    #[serde = "static"]
    pub is_static: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, EqIgnoreSpan, Hash, Serialize, Deserialize)]
pub enum ClassMethodKind {
    Constructor,
    Method,
    Getter,
    Setter,
}

impl<F> FoldWith<F> for ClassMethodKind {
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
}
