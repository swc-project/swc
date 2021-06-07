use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

///
/// - Remove parens.
pub fn single_pass_optimizer() -> impl VisitMut {
    SinglePassOptimizer
}

struct SinglePassOptimizer;

impl VisitMut for SinglePassOptimizer {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Paren(p) => {
                *e = *p.expr.take();
            }
            _ => {}
        }
    }
}
