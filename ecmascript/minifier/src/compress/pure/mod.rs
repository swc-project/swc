use crate::option::CompressOptions;
use rayon::prelude::*;
use swc_common::pass::Repeated;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

mod bools;

pub(super) fn pure_optimizer<'a>(options: &'a CompressOptions) -> impl 'a + VisitMut + Repeated {
    Pure {
        options,
        run_again: false,
    }
}

#[derive(Clone, Copy)]
struct Pure<'a> {
    options: &'a CompressOptions,
    run_again: bool,
}

impl Repeated for Pure<'_> {
    fn changed(&self) -> bool {
        self.run_again
    }

    fn reset(&mut self) {
        self.run_again = false;
    }
}

impl Pure<'_> {
    fn visit_par<N>(&mut self, nodes: &mut Vec<N>)
    where
        N: Send + Sync + for<'aa> VisitMutWith<Pure<'aa>>,
    {
        let should_run_again = nodes
            .par_iter_mut()
            .map(|node| {
                let mut v = Pure {
                    options: self.options,
                    run_again: false,
                };
                node.visit_mut_with(&mut v);

                if v.run_again {
                    1
                } else {
                    0
                }
            })
            .sum::<usize>()
            != 0;

        self.run_again |= should_run_again;
    }
}

impl VisitMut for Pure<'_> {
    noop_visit_mut_type!();

    fn visit_mut_cond_expr(&mut self, e: &mut CondExpr) {
        e.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut e.test);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        self.handle_negated_seq(e)
    }

    fn visit_mut_expr_or_spreads(&mut self, elems: &mut Vec<ExprOrSpread>) {
        self.visit_par(elems);
    }

    fn visit_mut_for_stmt(&mut self, s: &mut ForStmt) {
        s.visit_mut_children_with(self);

        if let Some(test) = &mut s.test {
            self.optimize_expr_in_bool_ctx(test);
        }
    }

    fn visit_mut_if_stmt(&mut self, s: &mut IfStmt) {
        s.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut s.test);
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.visit_par(items);
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.visit_par(stmts);
    }

    fn visit_mut_unary_expr(&mut self, e: &mut UnaryExpr) {
        e.visit_mut_children_with(self);

        match e.op {
            op!("!") => {
                self.optimize_expr_in_bool_ctx(&mut e.arg);
            }
            _ => {}
        }
    }

    fn visit_mut_while_stmt(&mut self, e: &mut WhileStmt) {
        e.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut e.test);
    }
}
