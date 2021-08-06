use self::ctx::Ctx;
use crate::{marks::Marks, option::CompressOptions, MAX_PAR_DEPTH};
use rayon::prelude::*;
use swc_common::pass::Repeated;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

mod bools;
mod ctx;
mod numbers;

pub(super) fn pure_optimizer<'a>(
    options: &'a CompressOptions,
    marks: Marks,
) -> impl 'a + VisitMut + Repeated {
    Pure {
        options,
        marks,
        ctx: Default::default(),
        changed: Default::default(),
    }
}

struct Pure<'a> {
    options: &'a CompressOptions,
    marks: Marks,
    ctx: Ctx,
    changed: bool,
}

impl Repeated for Pure<'_> {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.ctx = Default::default();
        self.changed = false;
    }
}

impl Pure<'_> {
    fn visit_par<N>(&mut self, nodes: &mut Vec<N>)
    where
        N: for<'aa> VisitMutWith<Pure<'aa>> + Send + Sync,
    {
        if self.ctx.par_depth >= MAX_PAR_DEPTH * 2 {
            for node in nodes {
                let mut v = Pure {
                    options: self.options,
                    marks: self.marks,
                    ctx: self.ctx,
                    changed: false,
                };
                node.visit_mut_with(&mut v);

                self.changed |= v.changed;
            }
        } else {
            let results = nodes
                .par_iter_mut()
                .map(|node| {
                    let mut v = Pure {
                        options: self.options,
                        marks: self.marks,
                        ctx: Ctx {
                            par_depth: self.ctx.par_depth + 1,
                            ..self.ctx
                        },
                        changed: false,
                    };
                    node.visit_mut_with(&mut v);

                    v.changed
                })
                .collect::<Vec<_>>();

            for res in results {
                self.changed |= res;
            }
        }
    }
}

impl VisitMut for Pure<'_> {
    noop_visit_mut_type!();

    fn visit_mut_bin_expr(&mut self, e: &mut BinExpr) {
        e.visit_mut_children_with(self);

        self.compress_cmp_of_typeof_with_lit(e);
    }

    fn visit_mut_cond_expr(&mut self, e: &mut CondExpr) {
        e.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut e.test);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        self.optimize_bools(e);

        self.lift_minus(e);

        self.compress_useless_deletes(e);

        self.remove_useless_logical_rhs(e);

        self.handle_negated_seq(e);
    }

    fn visit_mut_exprs(&mut self, exprs: &mut Vec<Box<Expr>>) {
        self.visit_par(exprs);
    }

    fn visit_mut_for_stmt(&mut self, s: &mut ForStmt) {
        s.visit_mut_children_with(self);

        if let Some(test) = &mut s.test {
            self.optimize_expr_in_bool_ctx(&mut **test);
        }
    }

    fn visit_mut_if_stmt(&mut self, s: &mut IfStmt) {
        s.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut s.test);
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.visit_par(items);
    }

    fn visit_mut_prop_or_spreads(&mut self, exprs: &mut Vec<PropOrSpread>) {
        self.visit_par(exprs);
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);
    }

    fn visit_mut_stmts(&mut self, items: &mut Vec<Stmt>) {
        self.visit_par(items);
    }

    fn visit_mut_unary_expr(&mut self, e: &mut UnaryExpr) {
        {
            let ctx = Ctx {
                in_delete: e.op == op!("delete"),
                ..self.ctx
            };
            e.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }

        match e.op {
            op!("!") => {
                self.optimize_expr_in_bool_ctx(&mut e.arg);
            }

            op!(unary, "+") | op!(unary, "-") => {
                self.optimize_expr_in_num_ctx(&mut e.arg);
            }
            _ => {}
        }
    }

    fn visit_mut_while_stmt(&mut self, s: &mut WhileStmt) {
        s.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut s.test);
    }
}
