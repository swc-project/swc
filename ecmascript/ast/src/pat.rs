use super::{Expr, Ident, PropName};
use swc_common::{Span, Spanned};
use swc_macros::ast_node;

#[ast_node]
pub struct Pat {
    pub span: Span,

    pub node: PatKind,
}

impl Spanned<PatKind> for Pat {
    fn from_unspanned(node: PatKind, span: Span) -> Self {
        Pat { span, node }
    }
}
#[ast_node]
pub enum PatKind {
    Ident(Ident),

    Array(Vec<(Option<Pat>)>),

    Rest(Box<Pat>),

    Object(Vec<ObjectPatProp>),

    Assign {
        left: Box<Pat>,
        right: Box<Expr>,
    },

    /// Only for for-in / for-of loops. This is *syntatically* valid.
    Expr(Box<Expr>),
}

#[ast_node]
pub enum ObjectPatProp {
    /// `{key: value}`
    KeyValue { key: PropName, value: Box<Pat> },
    /// `{key}` or `{key = value}`
    Assign {
        key: Ident,

        value: Option<(Box<Expr>)>,
    },
}

impl From<Ident> for Pat {
    fn from(id: Ident) -> Self {
        Pat {
            span: id.span,
            node: PatKind::Ident(id),
        }
    }
}
