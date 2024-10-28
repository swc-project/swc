use std::mem::swap;

use swc_common::{util::take::Take, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprCtx, ExprExt, Type, Value};

use super::Pure;
use crate::{
    compress::util::{is_pure_undefined, negate, negate_cost},
    option::CompressOptions,
    util::make_bool,
};

impl Pure<'_> {
    pub(super) fn negate_twice(&mut self, e: &mut Expr, is_ret_val_ignored: bool) {
        negate(&self.expr_ctx, e, false, is_ret_val_ignored);
        negate(&self.expr_ctx, e, false, is_ret_val_ignored);
    }

    pub(super) fn negate(&mut self, e: &mut Expr, in_bool_ctx: bool, is_ret_val_ignored: bool) {
        negate(&self.expr_ctx, e, in_bool_ctx, is_ret_val_ignored)
    }

    /// `!(a && b)` => `!a || !b`
    pub(super) fn optimize_bools(&mut self, e: &mut Expr) {
        if !self.options.bools {
            return;
        }

        if !self.ctx.in_first_expr {
            return;
        }

        if let Expr::Unary(UnaryExpr {
            op: op!("!"), arg, ..
        }) = e
        {
            match &mut **arg {
                Expr::Bin(BinExpr {
                    op: op!("&&"),
                    left,
                    right,
                    ..
                }) => {
                    if negate_cost(&self.expr_ctx, left, false, false) >= 0
                        || negate_cost(&self.expr_ctx, right, false, false) >= 0
                    {
                        return;
                    }
                    report_change!("bools: Optimizing `!(a && b)` as `!a || !b`");
                    self.negate(arg, false, false);
                    *e = *arg.take();
                }

                Expr::Unary(UnaryExpr {
                    op: op!("!"),
                    arg: arg_of_arg,
                    ..
                }) => {
                    if let Expr::Bin(BinExpr {
                        op: op!("||"),
                        left,
                        right,
                        ..
                    }) = &mut **arg_of_arg
                    {
                        if negate_cost(&self.expr_ctx, left, false, false) > 0
                            || negate_cost(&self.expr_ctx, right, false, false) > 0
                        {
                            return;
                        }
                        report_change!("bools: Optimizing `!!(a || b)` as `!a && !b`");
                        self.negate(arg_of_arg, false, false);
                        *e = *arg.take();
                    }
                }

                _ => {}
            }
        }
    }

    pub(super) fn compress_cmp_with_long_op(&mut self, e: &mut BinExpr) {
        fn should_optimize(l: &Expr, r: &Expr, opts: &CompressOptions) -> bool {
            match (l, r) {
                (
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"), ..
                    }),
                    Expr::Lit(..),
                ) => true,
                _ => {
                    if opts.comparisons {
                        match (l.get_type(), r.get_type()) {
                            (Value::Known(lt), Value::Known(rt)) => lt == rt,

                            _ => false,
                        }
                    } else {
                        false
                    }
                }
            }
        }

        match e.op {
            op!("===") | op!("!==") => {}
            _ => return,
        }

        if should_optimize(&e.left, &e.right, self.options)
            || should_optimize(&e.right, &e.left, self.options)
        {
            report_change!("bools: Compressing comparison of `typeof` with literal");
            self.changed = true;
            e.op = match e.op {
                op!("===") => {
                    op!("==")
                }
                op!("!==") => {
                    op!("!=")
                }
                _ => {
                    unreachable!()
                }
            }
        }
    }

    ///
    /// - `!condition() || !-3.5` => `!condition()`
    ///
    /// In this case, if lhs is false, rhs is also false so it's removable.
    pub(super) fn remove_useless_logical_rhs(&mut self, e: &mut Expr) {
        if !self.options.bools {
            return;
        }

        match e {
            Expr::Bin(BinExpr {
                left,
                op: op @ op!("&&"),
                right,
                ..
            })
            | Expr::Bin(BinExpr {
                left,
                op: op @ op!("||"),
                right,
                ..
            }) => {
                let lt = left.get_type();
                let rt = right.get_type();

                if let (Value::Known(Type::Bool), Value::Known(Type::Bool)) = (lt, rt) {
                    let rb = right.as_pure_bool(&self.expr_ctx);
                    let rb = match rb {
                        Value::Known(v) => v,
                        Value::Unknown => return,
                    };

                    //
                    let can_remove = if *op == op!("&&") { rb } else { !rb };

                    if can_remove {
                        #[allow(clippy::if_same_then_else)]
                        if *op == op!("&&") {
                            report_change!("booleans: Compressing `!foo && true` as `!foo`");
                        } else {
                            report_change!("booleans: Compressing `!foo || false` as `!foo`");
                        }
                        self.changed = true;
                        *e = *left.take();
                    }
                }
            }
            _ => {}
        }
    }

    /// Note: This should be invoked before calling `handle_negated_seq`.
    pub(super) fn compress_useless_deletes(&mut self, e: &mut Expr) {
        if !self.options.bools {
            return;
        }

        let delete = match e {
            Expr::Unary(
                u @ UnaryExpr {
                    op: op!("delete"), ..
                },
            ) => u,
            _ => return,
        };

        if delete.arg.may_have_side_effects(&ExprCtx {
            is_unresolved_ref_safe: true,
            ..self.expr_ctx
        }) {
            return;
        }

        let convert_to_true = match &*delete.arg {
            Expr::Seq(..)
            | Expr::Cond(..)
            | Expr::Bin(BinExpr { op: op!("&&"), .. })
            | Expr::Bin(BinExpr { op: op!("||"), .. }) => true,
            // V8 and terser test ref have different opinion.
            Expr::Ident(Ident { sym, .. }) if &**sym == "Infinity" => false,
            Expr::Ident(Ident { sym, .. }) if &**sym == "undefined" => false,
            Expr::Ident(Ident { sym, .. }) if &**sym == "NaN" => false,

            e if is_pure_undefined(&self.expr_ctx, e) => true,

            Expr::Ident(i) => i.ctxt != self.expr_ctx.unresolved_ctxt,

            // NaN
            Expr::Bin(BinExpr {
                op: op!("/"),
                right,
                ..
            }) => {
                let rn = right.as_pure_number(&self.expr_ctx);
                let v = if let Value::Known(rn) = rn {
                    rn != 0.0
                } else {
                    false
                };

                if v {
                    true
                } else {
                    self.changed = true;
                    let span = delete.arg.span();
                    report_change!("booleans: Compressing `delete` as sequence expression");
                    *e = SeqExpr {
                        span,
                        exprs: vec![delete.arg.take(), Box::new(make_bool(span, true))],
                    }
                    .into();
                    return;
                }
            }

            _ => false,
        };

        if convert_to_true {
            self.changed = true;
            let span = delete.arg.span();
            report_change!("booleans: Compressing `delete` => true");
            *e = make_bool(span, true);
        }
    }

    pub(super) fn handle_negated_seq(&mut self, n: &mut Expr) {
        match &mut *n {
            Expr::Unary(e @ UnaryExpr { op: op!("!"), .. }) => {
                if let Expr::Seq(SeqExpr { exprs, .. }) = &mut *e.arg {
                    if exprs.is_empty() {
                        return;
                    }
                    report_change!("bools: Optimizing negated sequences");

                    {
                        let last = exprs.last_mut().unwrap();
                        self.optimize_expr_in_bool_ctx(last, false);
                        // Negate last element.
                        negate(&self.expr_ctx, last, false, false);
                    }

                    *n = *e.arg.take();
                }
            }
            Expr::Unary(UnaryExpr {
                op: op!("delete"), ..
            }) => {
                // TODO
            }
            _ => {}
        }
    }

    /// This method converts `!1` to `0`.
    pub(super) fn optimize_expr_in_bool_ctx(&mut self, n: &mut Expr, is_ignore: bool) {
        self.optmize_known_logical_expr(n);

        match n {
            Expr::Bin(BinExpr {
                op: op!("&&") | op!("||"),
                left,
                right,
                ..
            }) => {
                // Regardless if it's truthy or falsy, we can optimize it because it will be
                // casted as bool anyway.
                self.optimize_expr_in_bool_ctx(left, is_ignore);
                self.optimize_expr_in_bool_ctx(right, is_ignore);
                return;
            }

            Expr::Seq(e) => {
                if let Some(last) = e.exprs.last_mut() {
                    self.optimize_expr_in_bool_ctx(last, is_ignore);
                }
            }

            _ => {}
        }

        if !self.options.bools {
            return;
        }

        match n {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("!"),
                arg,
            }) => match &mut **arg {
                Expr::Lit(Lit::Num(Number { value, .. })) => {
                    report_change!("Optimizing: number => number (in bool context)");

                    self.changed = true;
                    *n = Lit::Num(Number {
                        span: *span,
                        value: if *value == 0.0 { 1.0 } else { 0.0 },
                        raw: None,
                    })
                    .into()
                }

                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) => {
                    report_change!("bools: !!expr => expr (in bool ctx)");
                    self.changed = true;
                    *n = *arg.take();
                }
                _ => {}
            },

            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
            }) => {
                report_change!("Optimizing: typeof => true (in bool context)");
                self.changed = true;

                match &**arg {
                    Expr::Ident(..) => {
                        *n = Lit::Num(Number {
                            span: *span,
                            value: 1.0,
                            raw: None,
                        })
                        .into()
                    }
                    _ => {
                        // Return value of typeof is always truthy
                        let true_expr = Lit::Num(Number {
                            span: *span,
                            value: 1.0,
                            raw: None,
                        })
                        .into();
                        *n = SeqExpr {
                            span: *span,
                            exprs: vec![arg.take(), true_expr],
                        }
                        .into()
                    }
                }
            }

            Expr::Lit(Lit::Str(s)) => {
                if !is_ignore {
                    report_change!("Converting string as boolean expressions");
                    self.changed = true;
                    *n = Lit::Num(Number {
                        span: s.span,
                        value: if s.value.is_empty() { 0.0 } else { 1.0 },
                        raw: None,
                    })
                    .into();
                }
            }

            Expr::Lit(Lit::Num(num)) => {
                if num.value == 1.0 || num.value == 0.0 {
                    return;
                }
                if self.options.bools {
                    report_change!("booleans: Converting number as boolean expressions");
                    self.changed = true;
                    *n = Lit::Num(Number {
                        span: num.span,
                        value: if num.value == 0.0 { 0.0 } else { 1.0 },
                        raw: None,
                    })
                    .into();
                }
            }

            Expr::Bin(BinExpr {
                op: op!("??"),
                left,
                right,
                ..
            }) => {
                // Optimize if (a ?? false); as if (a);
                if let Value::Known(false) = right.as_pure_bool(&self.expr_ctx) {
                    report_change!(
                        "Dropping right operand of `??` as it's always false (in bool context)"
                    );
                    self.changed = true;
                    *n = *left.take();
                }
            }

            Expr::Bin(BinExpr {
                op: op!("||"),
                left,
                right,
                ..
            }) => {
                // `a || false` => `a` (as it will be casted to boolean anyway)

                if let Value::Known(false) = right.as_pure_bool(&self.expr_ctx) {
                    report_change!("bools: `expr || false` => `expr` (in bool context)");
                    self.changed = true;
                    *n = *left.take();
                }
            }

            _ => {
                let v = n.as_pure_bool(&self.expr_ctx);
                if let Value::Known(v) = v {
                    let span = n.span();
                    report_change!("Optimizing expr as {} (in bool context)", v);
                    *n = make_bool(span, v);
                }
            }
        }
    }

    /// Rules:
    ///  - `l > i` => `i < l`
    fn can_swap_bin_operands(&mut self, l: &Expr, r: &Expr, is_for_rel: bool) -> bool {
        match (l, r) {
            (Expr::Member(_), _) if is_for_rel => false,

            (Expr::Update(..) | Expr::Assign(..), Expr::Lit(..)) if is_for_rel => false,

            (Expr::Ident(..), Expr::Ident(Ident { sym: r_s, .. })) if &**r_s == "undefined" => true,

            (
                Expr::Member(..)
                | Expr::Call(..)
                | Expr::Assign(..)
                | Expr::Update(..)
                | Expr::Bin(BinExpr {
                    op: op!("&&") | op!("||"),
                    ..
                }),
                Expr::Lit(..),
            ) => true,

            (
                Expr::Member(..) | Expr::Call(..) | Expr::Assign(..),
                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }),
            ) if matches!(&**arg, Expr::Lit(..)) => true,

            (Expr::Member(..) | Expr::Call(..) | Expr::Assign(..), r)
                if is_pure_undefined(&self.expr_ctx, r) =>
            {
                true
            }

            (Expr::Ident(l), Expr::Ident(r)) => {
                is_for_rel && self.options.unsafe_comps && l.sym < r.sym
            }

            (Expr::Ident(..), Expr::Lit(..)) if is_for_rel => false,

            (Expr::Ident(..), Expr::Lit(..))
            | (
                Expr::Ident(..) | Expr::Member(..),
                Expr::Unary(UnaryExpr {
                    op: op!("void") | op!("!"),
                    ..
                }),
            )
            | (
                Expr::This(..),
                Expr::Unary(UnaryExpr {
                    op: op!("void"), ..
                }),
            )
            | (Expr::Unary(..), Expr::Lit(..))
            | (Expr::Tpl(..), Expr::Lit(..)) => true,
            _ => false,
        }
    }

    fn try_swap_bin(&mut self, op: BinaryOp, left: &mut Expr, right: &mut Expr) -> bool {
        let can_swap = matches!(
            op,
            op!("===")
                | op!("!==")
                | op!("==")
                | op!("!=")
                | op!("&")
                | op!("^")
                | op!("|")
                | op!("*")
        ) && self.can_swap_bin_operands(left, right, false);

        // a * (b / c) -> b / c * a
        let can_swap = can_swap
            || (matches!(op, op!("*") | op!("&") | op!("|") | op!("^"))
                && right
                    .as_bin()
                    .filter(|b| b.op.precedence() == op.precedence())
                    .is_some()
                && left
                    .as_bin()
                    .filter(|b| b.op.precedence() == op.precedence())
                    .is_none()
                && !left.may_have_side_effects(&self.expr_ctx)
                && !right.may_have_side_effects(&self.expr_ctx));

        if can_swap {
            report_change!("Swapping operands of binary expession");
            swap(left, right);
        }

        can_swap
    }

    /// Swap lhs and rhs in certain conditions.
    pub(super) fn swap_bin_operands(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Bin(e @ BinExpr { op: op!("<="), .. })
            | Expr::Bin(e @ BinExpr { op: op!("<"), .. }) => {
                if self.options.comparisons && self.can_swap_bin_operands(&e.left, &e.right, true) {
                    self.changed = true;
                    report_change!("comparisons: Swapping operands of {}", e.op);

                    e.op = if e.op == op!("<=") {
                        op!(">=")
                    } else {
                        op!(">")
                    };

                    swap(&mut e.left, &mut e.right);
                }
            }

            Expr::Bin(bin) => {
                if self.try_swap_bin(bin.op, &mut bin.left, &mut bin.right) {
                    self.changed = true;
                }
            }
            _ => {}
        }
    }
}
