use super::{BlockStmt, Expr, Function, Ident, Number, Pat};
use swc_common::{Span, Spanned};
use swc_macros::ast_node;

#[ast_node]
pub struct Prop {
    pub span: Span,

    pub node: PropKind,
}

impl Spanned<PropKind> for Prop {
    fn from_unspanned(node: PropKind, span: Span) -> Self {
        Prop { span, node }
    }
}

#[ast_node]
pub enum PropKind {
    /// `a` in `{ a, }`
    Shorthand(Ident),

    /// `key: value` in `{ key: value, }`
    KeyValue {
        key: PropName,

        value: Box<Expr>,
    },
    /// This is **invalid** for object literal.
    Assign {
        key: Ident,
        value: Box<Expr>,
    },
    Getter {
        key: PropName,
        body: BlockStmt,
    },
    Setter {
        key: PropName,
        param: Pat,
        body: BlockStmt,
    },
    Method {
        key: PropName,
        function: Function,
    },
}

#[ast_node]
pub enum PropName {
    Ident(Ident),
    /// String literal.
    Str(String),
    /// Numeric literal.
    Num(Number),
    Computed(Box<Expr>),
}

impl From<Ident> for PropName {
    fn from(i: Ident) -> Self {
        PropName::Ident(i)
    }
}

impl Prop {
    pub fn new_shorthand(ident: Ident) -> Self {
        let span = ident.span;
        Prop {
            span,
            node: PropKind::Shorthand(ident),
        }
    }
}
