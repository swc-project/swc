use swc_atoms::JsWord;
use swc_common::Mark;
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, Visit, VisitWith};

pub(super) struct UsedNameRenamer<'a> {
    pub mark: Mark,
    pub used_names: &'a [JsWord],
}

noop_fold_type!(UsedNameRenamer<'_>);

impl<'a> Fold for UsedNameRenamer<'a> {
    fn fold_ident(&mut self, ident: Ident) -> Ident {
        if self.used_names.contains(&ident.sym) {
            return Ident {
                span: ident.span.apply_mark(self.mark),
                ..ident
            };
        }
        ident
    }
}

pub(super) struct UsedNameCollector<'a> {
    pub used_names: &'a mut Vec<JsWord>,
}

noop_visit_type!(UsedNameCollector<'_>);

impl<'a> Visit for UsedNameCollector<'a> {
    fn visit_expr(&mut self, expr: &Expr, _: &dyn Node) {
        match *expr {
            Expr::Ident(ref i) => self.used_names.push(i.sym.clone()),
            _ => expr.visit_children_with(self),
        }
    }
}

macro_rules! noop {
    ($T:path) => {
        impl Visit<$T> for UsedNameCollector<'_> {
            /// no-op
            fn visit(&mut self, _: &$T) {}
        }
    };
}

noop!(ArrowExpr);
noop!(Function);
noop!(SetterProp);
noop!(GetterProp);
noop!(MethodProp);
noop!(Constructor);
