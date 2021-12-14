use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

/// Checks for dynamic import and require calls.
pub(super) fn contains_import(s: &Stmt) -> bool {
    let mut v = ImportFinder::default();
    s.visit_with(&mut v);
    v.found
}

#[derive(Default)]
struct ImportFinder {
    found: bool,
}

impl Visit for ImportFinder {
    fn visit_call_expr(&mut self, e: &CallExpr) {
        e.visit_children_with(self);

        match &e.callee {
            ExprOrSuper::Expr(callee) => match &**callee {
                Expr::Ident(i) => {
                    if &*i.sym == "require" || &*i.sym == "import" {
                        self.found = true;
                    }
                }

                _ => {}
            },

            _ => {}
        }
    }
}
