use swc_common::{util::take::Take, EqIgnoreSpan, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    ExprExt, Type,
    Value::{self, Known},
};

use super::Optimizer;
use crate::compress::{optimize::Ctx, util::negate_cost};
#[cfg(feature = "debug")]
use crate::debug::dump;

/// Methods related to the options `bools` and `bool_as_ints`.
impl Optimizer<'_> {
    /// **This negates bool**.
    ///
    /// Returns true if it's negated.
    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, expr)))]
    pub(super) fn optimize_bang_within_logical_ops(
        &mut self,
        expr: &mut Expr,
        is_ret_val_ignored: bool,
    ) -> bool {
        let cost = negate_cost(
            &self.ctx.expr_ctx,
            expr,
            is_ret_val_ignored,
            is_ret_val_ignored,
        );
        if cost >= 0 {
            return false;
        }

        let e = match expr {
            Expr::Bin(b) => b,
            _ => return false,
        };

        match e.op {
            op!("&&") | op!("||") => {}
            _ => return false,
        }

        if !is_ret_val_ignored {
            if let Known(Type::Bool) = e.left.get_type() {
            } else {
                // Don't change type.
                return false;
            }

            if let Known(Type::Bool) = e.right.get_type() {
            } else {
                // Don't change type.
                return false;
            }
        }

        // `!_ && 'undefined' !== typeof require`
        //
        //  =>
        //
        // `_ || 'undefined' == typeof require`
        report_change!(
            is_return_value_ignored = is_ret_val_ignored,
            negate_cost = cost,
            "bools: Negating: (!a && !b) => !(a || b) (because both expression are good for \
             negation)",
        );
        #[cfg(feature = "debug")]
        let start = dump(&*e, false);

        e.op = if e.op == op!("&&") {
            op!("||")
        } else {
            op!("&&")
        };

        let ctx = Ctx {
            in_bool_ctx: true,
            ..self.ctx.clone()
        };

        self.with_ctx(ctx.clone()).negate(&mut e.left, false);
        self.with_ctx(ctx.clone())
            .negate(&mut e.right, is_ret_val_ignored);

        dump_change_detail!("{} => {}", start, dump(&*e, false));

        true
    }

    pub(super) fn compress_if_stmt_as_expr(&mut self, s: &mut Stmt) {
        if !self.options.conditionals && !self.options.bools {
            return;
        }

        let stmt = match s {
            Stmt::If(v) => v,
            _ => return,
        };

        if stmt.alt.is_none() {
            if let Stmt::Expr(cons) = &mut *stmt.cons {
                self.changed = true;
                report_change!("conditionals: `if (foo) bar;` => `foo && bar`");
                *s = ExprStmt {
                    span: stmt.span,
                    expr: BinExpr {
                        span: stmt.test.span(),
                        op: op!("&&"),
                        left: stmt.test.take(),
                        right: cons.expr.take(),
                    }
                    .into(),
                }
                .into();
            }
        }
    }

    ///
    /// - `"undefined" == typeof value;` => `void 0 === value`
    pub(super) fn compress_typeof_undefined(&mut self, e: &mut BinExpr) {
        fn opt(o: &mut Optimizer, l: &mut Expr, r: &mut Expr) -> bool {
            match (&mut *l, &mut *r) {
                (
                    Expr::Lit(Lit::Str(Str { value: l_v, .. })),
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"),
                        arg,
                        ..
                    }),
                ) if &**l_v == "undefined" => {
                    // TODO?
                    if let Expr::Ident(arg) = &**arg {
                        if let Some(usage) = o.data.vars.get(&arg.to_id()) {
                            if !usage.declared {
                                return false;
                            }
                        }
                    }

                    *l = *Expr::undefined(l.span());
                    *r = *arg.take();
                    true
                }
                _ => false,
            }
        }

        match e.op {
            op!("==") | op!("!=") | op!("===") | op!("!==") => {}
            _ => return,
        }

        if opt(self, &mut e.left, &mut e.right) || opt(self, &mut e.right, &mut e.left) {
            e.op = match e.op {
                op!("==") => {
                    op!("===")
                }
                op!("!=") => {
                    op!("!==")
                }
                _ => e.op,
            };
        }
    }

    ///
    /// - `a === undefined || a === null` => `a == null`
    pub(super) fn optimize_cmp_with_null_or_undefined(&mut self, e: &mut BinExpr) {
        if e.op == op!("||") || e.op == op!("&&") {
            {
                let res = self.optimize_cmp_with_null_or_undefined_inner(
                    e.span,
                    e.op,
                    &mut e.left,
                    &mut e.right,
                );
                if let Some(res) = res {
                    self.changed = true;
                    report_change!("bools: Optimizing `=== null || === undefined` to `== null`");
                    *e = res;
                    return;
                }
            }

            if let (Expr::Bin(left), right) = (&mut *e.left, &mut *e.right) {
                if e.op == left.op {
                    let res = self.optimize_cmp_with_null_or_undefined_inner(
                        right.span(),
                        e.op,
                        &mut left.right,
                        &mut *right,
                    );
                    if let Some(res) = res {
                        self.changed = true;
                        report_change!(
                            "bools: Optimizing `=== null || === undefined` to `== null`"
                        );
                        *e = BinExpr {
                            span: e.span,
                            op: e.op,
                            left: left.left.take(),
                            right: res.into(),
                        };
                    }
                }
            }
        }
    }

    fn optimize_cmp_with_null_or_undefined_inner(
        &mut self,
        span: Span,
        top_op: BinaryOp,
        e_left: &mut Expr,
        e_right: &mut Expr,
    ) -> Option<BinExpr> {
        let (cmp, op, left, right) = match &mut *e_left {
            Expr::Bin(left_bin) => {
                if left_bin.op != op!("===") && left_bin.op != op!("!==") {
                    return None;
                }

                if top_op == op!("&&") && left_bin.op == op!("===") {
                    return None;
                }
                if top_op == op!("||") && left_bin.op == op!("!==") {
                    return None;
                }

                match &*left_bin.right {
                    Expr::Ident(..) | Expr::Lit(..) => {}
                    Expr::Member(MemberExpr {
                        obj,
                        prop: MemberProp::Ident(..),
                        ..
                    }) => {
                        if self.should_preserve_property_access(
                            obj,
                            super::unused::PropertyAccessOpts {
                                allow_getter: false,
                                only_ident: false,
                            },
                        ) {
                            return None;
                        }
                    }
                    _ => {
                        return None;
                    }
                }

                let right = match &mut *e_right {
                    Expr::Bin(right_bin) => {
                        if right_bin.op != left_bin.op {
                            return None;
                        }

                        if !right_bin.right.eq_ignore_span(&left_bin.right) {
                            return None;
                        }

                        &mut *right_bin.left
                    }
                    _ => return None,
                };

                (
                    &mut left_bin.right,
                    left_bin.op,
                    &mut *left_bin.left,
                    &mut *right,
                )
            }
            _ => return None,
        };

        let lt = left.get_type();
        let rt = right.get_type();
        if let Value::Known(lt) = lt {
            if let Value::Known(rt) = rt {
                match (lt, rt) {
                    (Type::Undefined, Type::Null) | (Type::Null, Type::Undefined) => {
                        if op == op!("===") {
                            report_change!(
                                "Reducing `!== null || !== undefined` check to `!= null`"
                            );
                            return Some(BinExpr {
                                span,
                                op: op!("=="),
                                left: cmp.take(),
                                right: Lit::Null(Null { span: DUMMY_SP }).into(),
                            });
                        } else {
                            report_change!(
                                "Reducing `=== null || === undefined` check to `== null`"
                            );
                            return Some(BinExpr {
                                span,
                                op: op!("!="),
                                left: cmp.take(),
                                right: Lit::Null(Null { span: DUMMY_SP }).into(),
                            });
                        }
                    }
                    _ => {}
                }
            }
        }

        None
    }
}
