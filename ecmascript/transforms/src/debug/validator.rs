use crate::pass::{noop, Pass};
use ast::*;
use swc_common::{Fold, FoldWith, Spanned};

/// This transform validates span on debug mode and does nothing on release
/// mode.
#[cfg(debug_assertions)]
pub fn validator(name: &'static str) -> impl Pass {
    Validator { name }
}

#[cfg(not(debug_assertions))]
pub fn validator(name: &'static str) -> impl Pass {
    noop()
}

struct Validator {
    name: &'static str,
}

impl Fold<MemberExpr> for Validator {
    fn fold(&mut self, node: MemberExpr) -> MemberExpr {
        debug_assert_ne!(
            node.span(),
            node.obj.span(),
            "MemberExpr: obj.span() should not be same as node.span()"
        );
        debug_assert_ne!(
            node.span(),
            node.prop.span(),
            "MemberExpr: prop.span() should not be same as node.span()"
        );

        debug_assert_eq!(
            node.span().lo(),
            node.obj.span().lo(),
            "MemberExpr: node.span().lo() should be node.obj.span().lo()"
        );
        debug_assert_eq!(
            node.span().hi(),
            node.obj.span().hi(),
            "MemberExpr: node.span().hi() should be same as node.obj.span().hi()"
        );

        node.fold_children(self)
    }
}
