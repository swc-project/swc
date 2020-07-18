use swc_common::{Fold, FoldWith, Spanned};
use swc_ecma_ast::*;

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

macro_rules! lte {
    ($v:expr, $T:ty, $l:expr, $r:expr) => {{
        debug_assert!(
            $l <= $r,
            "{}: {}: {} should be <= {}; l={:?}; r={:?}",
            $v.name,
            stringify!($T),
            stringify!($l),
            stringify!($r),
            $l,
            $r
        );
    }};
}

macro_rules! gte {
    ($v:expr, $T:ty, $l:expr, $r:expr) => {{
        debug_assert!(
            $l >= $r,
            "{}: {}: {} should be >= {}; l={:?}; r={:?}",
            $v.name,
            stringify!($T),
            stringify!($l),
            stringify!($r),
            $l,
            $r
        );
    }};
}

impl Fold<MemberExpr> for Validator {
    fn fold(&mut self, node: MemberExpr) -> MemberExpr {
        if node.span.is_dummy() {
            return node.fold_children_with(self);
        }

        if !node.obj.span().is_dummy() {
            ne!(self, MemberExpr, node.span(), node.obj.span());
        }

        if !node.prop.span().is_dummy() {
            ne!(self, MemberExpr, node.span(), node.prop.span());
        }

        if !node.obj.span().is_dummy() {
            lte!(self, MemberExpr, node.span().lo(), node.obj.span().lo());
        }

        if !node.computed && !node.prop.span().is_dummy() {
            gte!(self, MemberExpr, node.span().hi(), node.prop.span().hi());
        }

        node.fold_children_with(self)
    }
}

impl Fold<BinExpr> for Validator {
    fn fold(&mut self, node: BinExpr) -> BinExpr {
        if node.span.is_dummy() {
            return node.fold_children_with(self);
        }

        if !node.left.span().is_dummy() {
            gte!(self, BinExpr, node.left.span().lo(), node.span().lo());
        }

        if !node.right.span().is_dummy() {
            gte!(self, BinExpr, node.span().hi(), node.right.span().hi());
        }

        node.fold_children_with(self)
    }
}

impl Fold<AssignExpr> for Validator {
    fn fold(&mut self, node: AssignExpr) -> AssignExpr {
        if node.span.is_dummy() {
            return node.fold_children_with(self);
        }

        if !node.left.span().is_dummy() {
            gte!(self, AssignExpr, node.left.span().lo(), node.span().lo());
        }

        //        if !node.right.span().is_dummy() {
        //            eq!(self, AssignExpr, node.right.span().hi(), node.span().hi());
        //        }

        node.fold_children_with(self)
    }
}

impl Fold<UnaryExpr> for Validator {
    fn fold(&mut self, node: UnaryExpr) -> UnaryExpr {
        if node.span.is_dummy() {
            return node.fold_children_with(self);
        }

        if !node.arg.span().is_dummy() {
            lte!(self, UnaryExpr, node.arg.span().hi(), node.span().hi())
        }

        node.fold_children_with(self)
    }
}

impl Fold<UpdateExpr> for Validator {
    fn fold(&mut self, node: UpdateExpr) -> UpdateExpr {
        if node.span.is_dummy() {
            return node.fold_children_with(self);
        }

        if node.prefix {
            if !node.arg.span().is_dummy() {
                lte!(self, UpdateExpr, node.arg.span().hi(), node.span().hi())
            }
        } else if !node.arg.span().is_dummy() {
            gte!(self, UpdateExpr, node.arg.span().lo(), node.span().lo())
        }

        node.fold_children_with(self)
    }
}

impl Fold<CondExpr> for Validator {
    fn fold(&mut self, node: CondExpr) -> CondExpr {
        if node.span.is_dummy() {
            return node.fold_children_with(self);
        }

        if !node.test.span().is_dummy() {
            gte!(self, CondExpr, node.test.span().lo(), node.span().lo());
        }

        if !node.alt.span().is_dummy() {
            lte!(self, CondExpr, node.alt.span().hi(), node.span().hi());
        }

        node.fold_children_with(self)
    }
}
