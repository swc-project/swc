use std::vec::Vec;

use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::{Parallel, ParallelExt};
use swc_ecma_utils::{ExprCtx, ExprExt, Value::Known};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::HEAVY_TASK_PARALLELS;

/// Optimizer invoked before invoking compressor.
///
/// - Remove parens.
///
/// TODO: remove completely after #8333
pub(crate) fn precompress_optimizer<'a>(expr_ctx: ExprCtx) -> impl 'a + VisitMut {
    PrecompressOptimizer { expr_ctx }
}

#[derive(Debug)]
pub(crate) struct PrecompressOptimizer {
    expr_ctx: ExprCtx,
}

impl PrecompressOptimizer {
    /// Drops RHS from `null && foo`
    fn optimize_bin_expr(&mut self, n: &mut Expr) {
        let Expr::Bin(b) = n else {
            return;
        };

        if b.op == op!("&&") && b.left.as_pure_bool(&self.expr_ctx) == Known(false) {
            *n = *b.left.take();
            return;
        }

        if b.op == op!("||") && b.left.as_pure_bool(&self.expr_ctx) == Known(true) {
            *n = *b.left.take();
        }
    }
}

impl Parallel for PrecompressOptimizer {
    fn create(&self) -> Self {
        Self {
            expr_ctx: self.expr_ctx.clone(),
        }
    }

    fn merge(&mut self, _: Self) {}
}

impl VisitMut for PrecompressOptimizer {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        n.visit_mut_children_with(self);

        self.optimize_bin_expr(n);
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
