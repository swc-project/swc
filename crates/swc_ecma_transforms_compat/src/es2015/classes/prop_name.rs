use swc_atoms::JsWord;
use swc_common::{Span, Spanned};
use swc_ecma_ast::*;

#[derive(Debug, PartialEq, Eq, Hash)]
pub enum HashKey {
    Str(JsWord),
    /// Not for key merging
    Computed(Span),
}

impl From<&PropName> for HashKey {
    fn from(p: &PropName) -> Self {
        match p {
            PropName::Ident(Ident { sym: value, .. }) | PropName::Str(Str { value, .. }) => {
                HashKey::Str(value.clone())
            }
            PropName::Num(Number { value, .. }) => HashKey::Str(value.to_string().into()),
            PropName::BigInt(BigInt { value, .. }) => HashKey::Str(value.to_string().into()),
            PropName::Computed(expr) => HashKey::Computed(expr.span()),
        }
    }
}
