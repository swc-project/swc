use std::mem::swap;

use swc_common::{util::take::Take, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprCtx, ExprExt, Type, Value};

use super::Pure;
use crate::{
    compress::util::{can_absorb_negate, is_eq, is_pure_undefined, negate, negate_cost},
    util::make_bool,
};

impl Pure<'_> {
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

    pub(super) fn make_bool_short(
        &mut self,
        e: &mut Expr,
        in_bool_ctx: bool,
        ignore_return_value: bool,
    ) {
        match e {
            Expr::Cond(cond) => {
                self.make_bool_short(&mut cond.test, true, false);
                self.make_bool_short(&mut cond.cons, in_bool_ctx, ignore_return_value);
                self.make_bool_short(&mut cond.alt, in_bool_ctx, ignore_return_value);

                if negate_cost(self.expr_ctx, &cond.test, true, false) >= 0 {
                    return;
                }
                self.negate(&mut cond.test, true, false);
                swap(&mut cond.cons, &mut cond.alt);
                return;
            }

            Expr::Bin(BinExpr {
                op: op @ (op!("&&") | op!("||")),
                left,
                right,
                ..
            }) => {
                self.make_bool_short(left, in_bool_ctx, false);
                self.make_bool_short(right, in_bool_ctx, ignore_return_value);

                if in_bool_ctx {
                    match *op {
                        op!("||") => {
                            // `a || false` => `a` (as it will be casted to boolean anyway)

                            if let Value::Known(false) = right.as_pure_bool(self.expr_ctx) {
                                report_change!(
                                    "bools: `expr || false` => `expr` (in bool context)"
                                );
                                self.changed = true;
                                *e = *left.take();
                                return;
                            }
                        }

                        op!("&&") => {
                            // false && foo => false (as it will be always false)

                            if let (_, Value::Known(false)) = left.cast_to_bool(self.expr_ctx) {
                                report_change!(
                                    "bools: `false && foo` => `false` (in bool context)"
                                );
                                self.changed = true;
                                *e = *left.take();
                                return;
                            }
                        }

                        _ => {}
                    }
                }
            }

            Expr::Bin(BinExpr { left, right, .. }) => {
                self.make_bool_short(left, false, false);
                self.make_bool_short(right, false, false);
                return;
            }

            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => {
                self.make_bool_short(arg, true, ignore_return_value);
                return;
            }

            Expr::Array(ArrayLit { elems, .. }) => {
                for elem in elems.iter_mut().flatten() {
                    self.make_bool_short(&mut elem.expr, false, false);
                }
                return;
            }

            Expr::Call(CallExpr { callee, args, .. }) => {
                if let Callee::Expr(callee) = callee {
                    self.make_bool_short(callee, false, false);
                }

                for arg in args {
                    self.make_bool_short(&mut arg.expr, false, false);
                }
                return;
            }

            Expr::Seq(SeqExpr { exprs, .. }) => {
                let len = exprs.len();
                for (idx, expr) in exprs.iter_mut().enumerate() {
                    let is_last = idx == len - 1;

                    self.make_bool_short(expr, false, !is_last || ignore_return_value);
                }
                return;
            }

            Expr::Assign(AssignExpr { right, .. }) => {
                self.make_bool_short(right, false, false);
                return;
            }

            _ => return,
        }

        let cost = negate_cost(self.expr_ctx, e, in_bool_ctx, ignore_return_value);

        if cost >= 0 {
            return;
        }

        if let Expr::Bin(BinExpr {
            op: op @ (op!("&&") | op!("||")),
            left,
            ..
        }) = e
        {
            if ignore_return_value {
                // Negate only left, and change operator
                *op = match op {
                    op!("&&") => op!("||"),
                    op!("||") => op!("&&"),
                    _ => unreachable!(),
                };

                self.negate(left, true, false);
            }
        }
    }

    pub(super) fn negate_twice(&mut self, e: &mut Expr, is_ret_val_ignored: bool) {
        negate(self.expr_ctx, e, true, is_ret_val_ignored);
        negate(self.expr_ctx, e, false, is_ret_val_ignored);
    }

    pub(super) fn negate(&mut self, e: &mut Expr, in_bool_ctx: bool, is_ret_val_ignored: bool) {
        negate(self.expr_ctx, e, in_bool_ctx, is_ret_val_ignored)
    }

    pub(super) fn optimize_negate_eq(&mut self, e: &mut Expr) {
        fn negate_eq(op: BinaryOp) -> BinaryOp {
            match op {
                op!("==") => op!("!="),
                op!("!=") => op!("=="),
                op!("===") => op!("!=="),
                op!("!==") => op!("==="),
                _ => unreachable!(),
            }
        }

        if !self.options.bools {
            return;
        }

        let Expr::Unary(UnaryExpr {
            op: op!("!"), arg, ..
        }) = e
        else {
            return;
        };

        let arg_can_negate = can_absorb_negate(arg, self.expr_ctx);

        match &mut **arg {
            Expr::Bin(BinExpr { op, .. }) if is_eq(*op) => {
                self.changed = true;
                report_change!("bools: Optimizing `!(a == b)` as `a != b`");

                *op = negate_eq(*op);

                *e = *arg.take();
            }
            Expr::Bin(BinExpr {
                op: op @ (op!("&&") | op!("||")),
                left,
                right,
                ..
            }) if arg_can_negate => {
                self.changed = true;
                report_change!("bools: Optimizing `!(a == b && c == d)` as `a != b`");

                *op = match op {
                    op!("&&") => op!("||"),
                    op!("||") => op!("&&"),
                    _ => unreachable!(),
                };

                self.negate(left, false, false);
                self.negate(right, false, false);
                *e = *arg.take();
            }
            _ => (),
        }
    }

    pub(super) fn compress_cmp_with_long_op(&mut self, e: &mut BinExpr) {
        if !matches!(e.op, op!("===") | op!("!==")) {
            return;
        }

        let is_typeof_unaray = |l: &Expr, r: &Expr| {
            matches!(
                (l, r),
                (
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"),
                        ..
                    }),
                    Expr::Lit(..)
                )
            )
        };

        let should_optimize = is_typeof_unaray(&e.left, &e.right)
            || is_typeof_unaray(&e.right, &e.left)
            || (self.options.comparisons && {
                if let Value::Known(l) = e.left.get_type(self.expr_ctx) {
                    if let Value::Known(r) = e.right.get_type(self.expr_ctx) {
                        l == r
                    } else {
                        false
                    }
                } else {
                    false
                }
            });

        if should_optimize {
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
                let lt = left.get_type(self.expr_ctx);
                let rt = right.get_type(self.expr_ctx);

                if let (Value::Known(Type::Bool), Value::Known(Type::Bool)) = (lt, rt) {
                    let rb = right.as_pure_bool(self.expr_ctx);
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

        if delete.arg.may_have_side_effects(ExprCtx {
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

            e if is_pure_undefined(self.expr_ctx, e) => true,

            Expr::Ident(i) => i.ctxt != self.expr_ctx.unresolved_ctxt,

            // NaN
            Expr::Bin(BinExpr {
                op: op!("/"),
                right,
                ..
            }) => {
                let rn = right.as_pure_number(self.expr_ctx);
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
                        negate(self.expr_ctx, last, false, false);
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
    pub(super) fn optimize_expr_in_bool_ctx(
        &mut self,
        n: &mut Expr,
        is_return_value_ignored: bool,
    ) {
        match n {
            Expr::Bin(BinExpr {
                op: op!("&&") | op!("||"),
                left,
                right,
                ..
            }) => {
                // Regardless if it's truthy or falsy, we can optimize it because it will be
                // casted as bool anyway.
                self.optimize_expr_in_bool_ctx(left, false);
                self.optimize_expr_in_bool_ctx(right, is_return_value_ignored);
                return;
            }

            Expr::Seq(e) => {
                if let Some(last) = e.exprs.last_mut() {
                    self.optimize_expr_in_bool_ctx(last, is_return_value_ignored);
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
                if !is_return_value_ignored {
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
                if let Value::Known(false) = right.as_pure_bool(self.expr_ctx) {
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

                if let Value::Known(false) = right.as_pure_bool(self.expr_ctx) {
                    report_change!("bools: `expr || false` => `expr` (in bool context)");
                    self.changed = true;
                    *n = *left.take();
                }
            }

            _ => {
                let v = n.as_pure_bool(self.expr_ctx);
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
                if is_pure_undefined(self.expr_ctx, r) =>
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
                && !left.may_have_side_effects(self.expr_ctx)
                && !right.may_have_side_effects(self.expr_ctx));

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
