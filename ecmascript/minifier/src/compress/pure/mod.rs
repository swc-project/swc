use self::ctx::Ctx;
use crate::{marks::Marks, option::CompressOptions, util::has_mark};
use rayon::prelude::*;
use swc_common::{pass::Repeated, Globals, Spanned};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::util::Respan;

mod arrows;
mod bools;
mod conditionals;
mod ctx;
mod evaluate;
mod strings;

pub(super) fn pure_optimizer<'a>(
    swc_globals: &'a Globals,
    marks: Marks,
    options: &'a CompressOptions,
) -> impl 'a + VisitMut + Repeated {
    Pure {
        swc_globals,
        marks,
        options,
        run_again: false,
        modified_node: false,
        ctx: Default::default(),
    }
}

const MAX_PAR_DEPTH: usize = 4;

#[derive(Clone, Copy)]
struct Pure<'a> {
    swc_globals: &'a Globals,
    marks: Marks,

    options: &'a CompressOptions,
    run_again: bool,

    /// Used to check if ast node is modified.
    modified_node: bool,

    ctx: Ctx,
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
    fn track<N, F>(&mut self, n: &mut N, op: F)
    where
        N: Spanned + Respan,
        F: for<'aa> FnOnce(&mut Pure<'aa>, &mut N),
    {
        if has_mark(n.span(), self.marks.pure_done) {
            return;
        }

        let old_ast_modified = self.modified_node;
        self.modified_node = false;

        op(self, n);

        let modified = self.modified_node;

        if !modified {
            let span = n.span();
            let span = span.apply_mark(self.marks.pure_done);

            n.respan(span);
        }

        self.modified_node |= old_ast_modified;
    }

    fn visit_par<N>(&mut self, nodes: &mut Vec<N>)
    where
        N: Send + Sync + for<'aa> VisitMutWith<Pure<'aa>>,
    {
        if self.ctx.par_depth >= MAX_PAR_DEPTH || cfg!(target_arch = "wasm32") {
            for node in nodes {
                node.visit_mut_with(self);
            }
        } else {
            let results = nodes
                .par_iter_mut()
                .map(|node| {
                    swc_common::GLOBALS.set(&self.swc_globals, || {
                        let mut v = Pure {
                            swc_globals: self.swc_globals,
                            marks: self.marks,
                            options: self.options,
                            run_again: false,
                            modified_node: false,
                            ctx: Ctx {
                                par_depth: self.ctx.par_depth + 1,
                                ..self.ctx
                            },
                        };
                        node.visit_mut_with(&mut v);

                        (v.run_again, v.modified_node)
                    })
                })
                .collect::<Vec<_>>();

            for (run_again, modified) in results {
                self.run_again |= run_again;
                self.modified_node |= modified;
            }
        }
    }
}

impl VisitMut for Pure<'_> {
    noop_visit_mut_type!();

    fn visit_mut_bin_expr(&mut self, e: &mut BinExpr) {
        e.visit_mut_children_with(self);

        self.compress_cmp_of_typeof_with_lit(e);

        self.drop_useless_logical_operands(e);
    }

    fn visit_mut_cond_expr(&mut self, e: &mut CondExpr) {
        e.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut e.test);

        self.negate_cond_expr(e);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        self.track(e, |v, e| {
            e.visit_mut_children_with(v);

            v.handle_negated_seq(e);

            v.drop_useless_addition_of_str(e);

            v.evaluate(e);

            v.concat_str(e);
        })
    }

    fn visit_mut_expr_or_spreads(&mut self, elems: &mut Vec<ExprOrSpread>) {
        self.visit_par(elems);
    }

    fn visit_mut_exprs(&mut self, exprs: &mut Vec<Box<Expr>>) {
        self.visit_par(exprs);
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

        self.negate_if_stmt(s);
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.visit_par(items);
    }

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        self.optimize_arrow_method_prop(p);
    }

    fn visit_mut_prop_or_spreads(&mut self, props: &mut Vec<PropOrSpread>) {
        self.visit_par(props);
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        self.track(s, |v, s| {
            s.visit_mut_children_with(v);

            v.compress_if_stmt_as_logical_and_expr(s);
        })
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
