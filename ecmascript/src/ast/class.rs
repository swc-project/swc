use super::{Expr, Function};
use swc_common::Span;
use swc_common::fold::FoldWith;
use swc_macros::{ast_node, Deserialize, Serialize};

#[ast_node]
#[caniuse = "es6-class"]
pub struct Class {
    #[serde = "superClass"]
    pub super_class: Option<Box<Expr>>,
    pub body: Vec<Option<ClassMethod>>,
}

#[ast_node]
pub struct ClassMethod {
    pub span: Span,
    pub key: Box<Expr>,
    pub function: Function,

    #[fold(ignore)]
    pub kind: ClassMethodKind,

    pub computed: bool,

    #[serde = "static"]
    pub is_static: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, EqIgnoreSpan, Hash, Serialize, Deserialize)]
pub enum ClassMethodKind {
    Constructor,
    Methor,
    Getter,
    Setter,
}

impl<F> FoldWith<F> for ClassMethodKind {
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
}
