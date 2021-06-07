use crate::analyzer::{analyze, ProgramData};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

///
/// - Remove parens.
pub fn single_pass_optimizer() -> impl VisitMut {
    SinglePassOptimizer::default()
}

#[derive(Debug, Default)]
struct SinglePassOptimizer {
    data: ProgramData,
}

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

    fn visit_mut_module(&mut self, n: &mut Module) {
        let data = analyze(&*n);
        self.data = data;

        n.visit_mut_children_with(self);
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        let data = analyze(&*n);
        self.data = data;

        n.visit_mut_children_with(self);
    }
}
