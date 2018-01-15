use super::{Expr, Function, PropName};
use swc_common::{FoldWith, Span};
use swc_macros::ast_node;

#[ast_node]
pub struct Class {
    pub span: Span,

    pub super_class: Option<Box<Expr>>,
    pub body: Vec<ClassMethod>,
}

#[ast_node]
pub struct ClassMethod {
    pub key: PropName,

    pub function: Function,

    #[fold(ignore)]
    pub kind: ClassMethodKind,

    pub is_static: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
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
