use self::ctx::Ctx;
use crate::{marks::Marks, option::CompressOptions, MAX_PAR_DEPTH};
use rayon::prelude::*;
use swc_common::{pass::Repeated, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

mod bools;
mod ctx;
mod loops;
mod misc;
mod numbers;
mod properties;
mod strings;

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

        if e.op == op!(bin, "+") {
            self.concat_tpl(&mut e.left, &mut e.right);
        }
    }

    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        {
            let ctx = Ctx {
                is_callee: true,
                ..self.ctx
            };
            e.callee.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        e.args.visit_mut_with(self);
    }

    fn visit_mut_cond_expr(&mut self, e: &mut CondExpr) {
        e.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut e.test);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        self.handle_property_access(e);

        self.optimize_bools(e);

        self.lift_minus(e);

        self.convert_tpl_to_str(e);

        self.drop_useless_addition_of_str(e);

        self.compress_useless_deletes(e);

        self.remove_useless_logical_rhs(e);

        self.handle_negated_seq(e);

        self.concat_str(e);
    }

    fn visit_mut_exprs(&mut self, exprs: &mut Vec<Box<Expr>>) {
        self.visit_par(exprs);
    }

    fn visit_mut_for_stmt(&mut self, s: &mut ForStmt) {
        s.visit_mut_children_with(self);

        self.merge_for_if_break(s);

        if let Some(test) = &mut s.test {
            self.optimize_expr_in_bool_ctx(&mut **test);
        }
    }

    fn visit_mut_if_stmt(&mut self, s: &mut IfStmt) {
        s.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut s.test);
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);
        if e.computed {
            e.prop.visit_mut_with(self);
        }

        self.optimize_property_of_member_expr(e);

        self.handle_known_computed_member_expr(e);
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.visit_par(items);
    }

    fn visit_mut_new_expr(&mut self, e: &mut NewExpr) {
        {
            let ctx = Ctx {
                is_callee: true,
                ..self.ctx
            };
            e.callee.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        e.args.visit_mut_with(self);
    }

    fn visit_mut_prop_or_spreads(&mut self, exprs: &mut Vec<PropOrSpread>) {
        self.visit_par(exprs);
    }

    fn visit_mut_return_stmt(&mut self, s: &mut ReturnStmt) {
        s.visit_mut_children_with(self);

        self.drop_undefined_from_return_arg(s);
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        {
            let ctx = Ctx {
                is_update_arg: false,
                is_callee: false,
                in_delete: false,
                ..self.ctx
            };
            s.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }

        if self.options.drop_debugger {
            match s {
                Stmt::Debugger(..) => {
                    self.changed = true;
                    *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                    log::debug!("drop_debugger: Dropped a debugger statement");
                    return;
                }
                _ => {}
            }
        }

        self.loop_to_for_stmt(s);
    }

    fn visit_mut_stmts(&mut self, items: &mut Vec<Stmt>) {
        self.visit_par(items);

        items.retain(|s| match s {
            Stmt::Empty(..) => false,
            _ => true,
        });
    }

    /// We don't optimize [Tpl] contained in [TaggedTpl].
    fn visit_mut_tagged_tpl(&mut self, n: &mut TaggedTpl) {
        n.tag.visit_mut_with(self);
    }

    fn visit_mut_tpl(&mut self, n: &mut Tpl) {
        n.visit_mut_children_with(self);
        debug_assert_eq!(n.exprs.len() + 1, n.quasis.len());

        self.compress_tpl(n);

        debug_assert_eq!(
            n.exprs.len() + 1,
            n.quasis.len(),
            "tagged template literal compressor created an invalid template literal"
        );
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

    fn visit_mut_update_expr(&mut self, e: &mut UpdateExpr) {
        let ctx = Ctx {
            is_update_arg: true,
            ..self.ctx
        };

        e.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_mut_while_stmt(&mut self, s: &mut WhileStmt) {
        s.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut s.test);
    }
}
