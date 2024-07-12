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
            PropName::Ident(IdentName { sym: value, .. }) | PropName::Str(Str { value, .. }) => {
                HashKey::Str(value.clone())
            }
            PropName::Num(Number { value, .. }) => HashKey::Str(value.to_string().into()),
            PropName::BigInt(BigInt { value, .. }) => HashKey::Str(value.to_string().into()),
            PropName::Computed(expr) => HashKey::Computed(expr.span()),
        }
    }
}

pub fn is_pure_prop_name(p: &PropName) -> bool {
    match p {
        PropName::Ident(..) => true,
        PropName::Str(..) => true,
        PropName::Num(..) => true,
        PropName::BigInt(..) => true,
        PropName::Computed(ComputedPropName { expr, .. }) => match &**expr {
            Expr::This(..) => true,
            Expr::Lit(..) => true,
            Expr::Ident(..) => true,
            Expr::PrivateName(..) => true,
            Expr::Tpl(tpl) => tpl.exprs.is_empty(),
            _ => false,
        },
    }
}

pub fn should_extract_class_prop_key(methods: &[ClassMethod]) -> bool {
    let mut has_static = false;

    for m in methods {
        if is_pure_prop_name(&m.key) {
            continue;
        }

        if m.is_static {
            has_static = true
        } else if has_static {
            return true;
        }
    }

    false
}
