use ast::*;
use swc_common::{Fold, FoldWith, Spanned};

/// This transform validates span on debug mode and does nothing on release
/// mode.
pub struct Validator {
    pub name: &'static str,
}

impl Fold<MemberExpr> for Validator {
    fn fold(&mut self, node: MemberExpr) -> MemberExpr {
        if node.span.is_dummy() {
            debug_assert!(
                node.obj.span().is_dummy(),
                "{}: MemberExpr: obj.span() should be dummy",
                self.name
            );
            debug_assert!(
                node.prop.span().is_dummy(),
                "{}: MemberExpr: prop.span() should be dummy",
                self.name
            );
            return node.fold_children(self);
        }

        debug_assert_ne!(
            node.span(),
            node.obj.span(),
            "{}: MemberExpr: obj.span() should not be same as node.span()",
            self.name
        );
        debug_assert_ne!(
            node.span(),
            node.prop.span(),
            "{}: MemberExpr: prop.span() should not be same as node.span()",
            self.name
        );

        debug_assert_eq!(
            node.span().lo(),
            node.obj.span().lo(),
            "{}: MemberExpr: node.span().lo() should be node.obj.span().lo()",
            self.name
        );
        if node.computed {
            debug_assert_eq!(
                node.span().hi(),
                node.prop.span().hi(),
                "{}: MemberExpr: node.span().hi() should be same as node.prop.span().hi()",
                self.name
            );
        }

        node.fold_children(self)
    }
}
