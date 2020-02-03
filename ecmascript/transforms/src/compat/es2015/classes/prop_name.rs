use swc_ecma_ast::*;
use ordered_float::OrderedFloat;
use swc_atoms::JsWord;
use swc_common::{Span, Spanned};

#[derive(Debug, PartialEq, Eq, Hash)]
pub enum HashKey {
    Ident(JsWord),
    Str(JsWord),
    Num(OrderedFloat<f64>),
    /// Not for key merging
    Computed(Span),
}

impl From<&PropName> for HashKey {
    fn from(p: &PropName) -> Self {
        match *p {
            PropName::Ident(Ident { ref sym, .. }) => HashKey::Ident(sym.clone()),
            PropName::Str(Str { ref value, .. }) => HashKey::Str(value.clone()),
            PropName::Num(Number { value, .. }) => HashKey::Num(value.into()),
            PropName::Computed(ref expr) => HashKey::Computed(expr.span()),
        }
    }
}
