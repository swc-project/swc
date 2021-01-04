use swc_atoms::JsWord;
use swc_common::Mark;
use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

/// Used to rename **binding** identifiers in constructor.
pub(super) struct UsedNameRenamer<'a> {
    pub mark: Mark,
    pub used_names: &'a [JsWord],
}

impl<'a> Fold for UsedNameRenamer<'a> {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
        match e {
            Expr::Ident(..) => e,
            _ => e.fold_children_with(self),
        }
    }

    fn fold_ident(&mut self, ident: Ident) -> Ident {
        if self.used_names.contains(&ident.sym) {
            return Ident {
                span: ident.span.apply_mark(self.mark),
                ..ident
            };
        }
        ident
    }

    fn fold_member_expr(&mut self, e: MemberExpr) -> MemberExpr {
        if e.computed {
            MemberExpr {
                obj: e.obj.fold_with(self),
                prop: e.prop.fold_with(self),
                ..e
            }
        } else {
            MemberExpr {
                obj: e.obj.fold_with(self),
                ..e
            }
        }
    }
}

pub(super) struct UsedNameCollector<'a> {
    pub used_names: &'a mut Vec<JsWord>,
}

macro_rules! noop {
    ($name:ident, $T:path) => {
        /// no-op
        fn $name(&mut self, _: &$T, _: &dyn Node) {}
    };
}

impl<'a> Visit for UsedNameCollector<'a> {
    noop_visit_type!();

    noop!(visit_arrow_expr, ArrowExpr);
    noop!(visit_function, Function);
    noop!(visit_setter_prop, SetterProp);
    noop!(visit_getter_prop, GetterProp);
    noop!(visit_method_prop, MethodProp);
    noop!(visit_constructor, Constructor);

    fn visit_expr(&mut self, expr: &Expr, _: &dyn Node) {
        match *expr {
            Expr::Ident(ref i) => self.used_names.push(i.sym.clone()),
            _ => expr.visit_children_with(self),
        }
    }
}
