use swc_atoms::JsWord;
use swc_common::{Fold, Mark, Visit, VisitWith};
use swc_ecma_ast::*;

pub(super) struct UsedNameRenamer<'a> {
    pub mark: Mark,
    pub used_names: &'a [JsWord],
}

noop_fold_type!(UsedNameRenamer<'_>);

impl<'a> Fold<Ident> for UsedNameRenamer<'a> {
    fn fold(&mut self, ident: Ident) -> Ident {
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

impl<'a> Visit<Expr> for UsedNameCollector<'a> {
    fn visit(&mut self, expr: &Expr) {
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
