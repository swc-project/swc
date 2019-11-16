use ast::*;
use swc_common::{Fold, FoldWith, Spanned};

/// This transform validates span on debug mode and does nothing on release
/// mode.
pub struct Validator {
    pub name: &'static str,
}

macro_rules! ne {
    ($v:expr, $T:ty, $l:expr, $r:expr) => {{
        debug_assert_ne!(
            $l,
            $r,
            "{}: {}: {} should not be same as {}",
            $v.name,
            stringify!($T),
            stringify!($l),
            stringify!($r),
        );
    }};
}

macro_rules! eq {
    ($v:expr, $T:ty, $l:expr, $r:expr) => {{
        debug_assert_eq!(
            $l,
            $r,
            "{}: {}: {} should not be same as {}",
            $v.name,
            stringify!($T),
            stringify!($l),
            stringify!($r),
        );
    }};
}

impl Fold<MemberExpr> for Validator {
    fn fold(&mut self, node: MemberExpr) -> MemberExpr {
        if node.span.is_dummy() {
            return node.fold_children(self);
        }

        if !node.obj.span().is_dummy() {
            ne!(self, MemberExpr, node.span(), node.obj.span());
        }

        if !node.prop.span().is_dummy() {
            ne!(self, MemberExpr, node.span(), node.prop.span());
        }

        if !node.obj.span().is_dummy() {
            eq!(self, MemberExpr, node.span().lo(), node.obj.span().lo());
        }

        if !node.computed {
            if !node.prop.span().is_dummy() {
                eq!(self, MemberExpr, node.span().hi(), node.prop.span().hi());
            }
        }

        node.fold_children(self)
    }
}

impl Fold<BinExpr> for Validator {
    fn fold(&mut self, node: BinExpr) -> BinExpr {
        if node.span.is_dummy() {
            return node.fold_children(self);
        }

        if !node.left.span().is_dummy() {
            eq!(self, BinExpr, node.left.span().lo(), node.span().lo());
        }

        if !node.right.span().is_dummy() {
            eq!(self, BinExpr, node.right.span().hi(), node.span().hi());
        }

        node.fold_children(self)
    }
}
