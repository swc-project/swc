use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::{Parallel, ParallelExt};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::HEAVY_TASK_PARALLELS;

/// Optimizer invoked before invoking compressor.
///
/// - Remove parens.
pub(crate) fn precompress_optimizer<'a>() -> impl 'a + VisitMut {
    PrecompressOptimizer {}
}

#[derive(Debug)]
pub(crate) struct PrecompressOptimizer {}

impl Parallel for PrecompressOptimizer {
    fn create(&self) -> Self {
        Self {}
    }

    fn merge(&mut self, _: Self) {}
}

impl VisitMut for PrecompressOptimizer {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Paren(p) = e {
            *e = *p.expr.take();
        }
    }

    fn visit_mut_pat_or_expr(&mut self, n: &mut PatOrExpr) {
        n.visit_mut_children_with(self);

        match n {
            PatOrExpr::Expr(e) => {
                if let Expr::Ident(i) = &**e {
                    *n = PatOrExpr::Pat(i.clone().into())
                }
            }
            PatOrExpr::Pat(p) => {
                if let Pat::Expr(e) = &mut **p {
                    *n = PatOrExpr::Expr(e.take());
                }
            }
        }
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_exprs(&mut self, n: &mut Vec<Box<Expr>>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_opt_vec_expr_or_spreads(&mut self, n: &mut Vec<Option<ExprOrSpread>>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_expr_or_spreads(&mut self, n: &mut Vec<ExprOrSpread>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_var_declarators(&mut self, n: &mut Vec<VarDeclarator>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }
}
