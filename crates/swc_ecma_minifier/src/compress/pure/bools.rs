use super::Pure;
use crate::{
    compress::util::{is_pure_undefined, negate, negate_cost},
    mode::Mode,
    option::CompressOptions,
    util::make_bool,
};
use std::mem::swap;
use swc_atoms::js_word;
use swc_common::{util::take::Take, EqIgnoreSpan, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};

impl<M> Pure<'_, M>
where
    M: Mode,
{
    pub(super) fn negate_twice(&mut self, e: &mut Expr, is_ret_val_ignored: bool) {
        self.changed |= negate(e, false, is_ret_val_ignored);
        self.changed |= negate(e, false, is_ret_val_ignored);
    }

    pub(super) fn negate(&mut self, e: &mut Expr, in_bool_ctx: bool, is_ret_val_ignored: bool) {
        self.changed |= negate(e, in_bool_ctx, is_ret_val_ignored)
    }

    /// `!(a && b)` => `!a || !b`
    pub(super) fn optimize_bools(&mut self, e: &mut Expr) {
        if !self.options.bools {
            return;
        }

        if !self.ctx.in_first_expr {
            return;
        }

        match e {
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => match &mut **arg {
                Expr::Bin(BinExpr {
                    op: op!("&&"),
                    left,
                    right,
                    ..
                }) => {
                    if negate_cost(&left, false, false).unwrap_or(isize::MAX) >= 0
                        || negate_cost(&right, false, false).unwrap_or(isize::MAX) >= 0
                    {
                        return;
                    }
                    tracing::debug!("bools: Optimizing `!(a && b)` as `!a || !b`");
                    self.changed = true;
                    self.negate(arg, false, false);
                    *e = *arg.take();

                    return;
                }

                Expr::Unary(UnaryExpr {
                    op: op!("!"),
                    arg: arg_of_arg,
                    ..
                }) => match &mut **arg_of_arg {
                    Expr::Bin(BinExpr {
                        op: op!("||"),
                        left,
                        right,
                        ..
                    }) => {
                        if negate_cost(&left, false, false).unwrap_or(isize::MAX) > 0
                            || negate_cost(&right, false, false).unwrap_or(isize::MAX) > 0
                        {
                            return;
                        }
                        tracing::debug!("bools: Optimizing `!!(a || b)` as `!a && !b`");
                        self.negate(arg_of_arg, false, false);
                        *e = *arg.take();

                        return;
                    }

                    _ => {}
                },

                _ => {}
            },
            _ => {}
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

        if should_optimize(&e.left, &e.right, &self.options)
            || should_optimize(&e.right, &e.left, &self.options)
        {
            tracing::debug!("bools: Compressing comparison of `typeof` with literal");
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

                match (lt, rt) {
                    (Value::Known(Type::Bool), Value::Known(Type::Bool)) => {
                        let rb = right.as_pure_bool();
                        let rb = match rb {
                            Value::Known(v) => v,
                            Value::Unknown => return,
                        };

                        //
                        let can_remove = if *op == op!("&&") { rb } else { !rb };

                        if can_remove {
                            if *op == op!("&&") {
                                tracing::debug!("booleans: Compressing `!foo && true` as `!foo`");
                            } else {
                                tracing::debug!("booleans: Compressing `!foo || false` as `!foo`");
                            }
                            self.changed = true;
                            *e = *left.take();
                            return;
                        }
                    }
                    _ => {}
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

        if delete.arg.may_have_side_effects() {
            return;
        }

        let convert_to_true = match &*delete.arg {
            Expr::Seq(..)
            | Expr::Cond(..)
            | Expr::Bin(BinExpr { op: op!("&&"), .. })
            | Expr::Bin(BinExpr { op: op!("||"), .. }) => true,
            // V8 and terser test ref have different opinion.
            Expr::Ident(Ident {
                sym: js_word!("Infinity"),
                ..
            }) => false,
            Expr::Ident(Ident {
                sym: js_word!("undefined"),
                ..
            }) => false,
            Expr::Ident(Ident {
                sym: js_word!("NaN"),
                ..
            }) => false,

            e if is_pure_undefined(&e) => true,

            Expr::Ident(..) => true,

            // NaN
            Expr::Bin(BinExpr {
                op: op!("/"),
                right,
                ..
            }) => {
                let rn = right.as_number();
                let v = if let Value::Known(rn) = rn {
                    if rn != 0.0 {
                        true
                    } else {
                        false
                    }
                } else {
                    false
                };

                if v {
                    true
                } else {
                    self.changed = true;
                    let span = delete.arg.span();
                    tracing::debug!("booleans: Compressing `delete` as sequence expression");
                    *e = Expr::Seq(SeqExpr {
                        span,
                        exprs: vec![delete.arg.take(), Box::new(make_bool(span, true))],
                    });
                    return;
                }
            }

            _ => false,
        };

        if convert_to_true {
            self.changed = true;
            let span = delete.arg.span();
            tracing::debug!("booleans: Compressing `delete` => true");
            *e = make_bool(span, true);
            return;
        }
    }

    pub(super) fn handle_negated_seq(&mut self, n: &mut Expr) {
        match &mut *n {
            Expr::Unary(e @ UnaryExpr { op: op!("!"), .. })
            | Expr::Unary(
                e @ UnaryExpr {
                    op: op!("delete"), ..
                },
            ) => {
                match &mut *e.arg {
                    Expr::Seq(SeqExpr { exprs, .. }) => {
                        if exprs.is_empty() {
                            return;
                        }
                        tracing::debug!("bools: Optimizing negated sequences");

                        {
                            let last = exprs.last_mut().unwrap();
                            self.optimize_expr_in_bool_ctx(last);
                            // Negate last element.
                            self.changed |= negate(last, false, false);
                        }

                        *n = *e.arg.take();
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    /// This method converts `!1` to `0`.
    pub(super) fn optimize_expr_in_bool_ctx(&mut self, n: &mut Expr) {
        if !self.options.bools {
            return;
        }

        match n {
            Expr::Bin(BinExpr {
                op: op!("&&") | op!("||"),
                left,
                right,
                ..
            }) => {
                // Regardless if it's truthy or falsy, we can optimize it because it will be
                // casted as bool anyway.
                self.optimize_expr_in_bool_ctx(&mut **left);
                self.optimize_expr_in_bool_ctx(&mut **right);
                return;
            }

            Expr::Seq(e) => {
                if let Some(last) = e.exprs.last_mut() {
                    self.optimize_expr_in_bool_ctx(&mut **last);
                }
            }

            _ => {}
        }

        match n {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("!"),
                arg,
            }) => match &mut **arg {
                Expr::Lit(Lit::Num(Number { value, .. })) => {
                    tracing::debug!("Optimizing: number => number (in bool context)");

                    self.changed = true;
                    *n = Expr::Lit(Lit::Num(Number {
                        span: *span,
                        value: if *value == 0.0 { 1.0 } else { 0.0 },
                    }))
                }

                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) => {
                    tracing::debug!("bools: !!expr => expr (in bool ctx)");
                    self.changed = true;
                    *n = *arg.take();
                    return;
                }
                _ => {}
            },

            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
            }) => {
                tracing::debug!("Optimizing: typeof => true (in bool context)");
                self.changed = true;

                match &**arg {
                    Expr::Ident(..) => {
                        *n = Expr::Lit(Lit::Num(Number {
                            span: *span,
                            value: 1.0,
                        }))
                    }
                    _ => {
                        // Return value of typeof is always truthy
                        let true_expr = Box::new(Expr::Lit(Lit::Num(Number {
                            span: *span,
                            value: 1.0,
                        })));
                        *n = Expr::Seq(SeqExpr {
                            span: *span,
                            exprs: vec![arg.take(), true_expr],
                        })
                    }
                }
            }

            Expr::Lit(Lit::Str(s)) => {
                tracing::debug!("Converting string as boolean expressions");
                self.changed = true;
                *n = Expr::Lit(Lit::Num(Number {
                    span: s.span,
                    value: if s.value.is_empty() { 0.0 } else { 1.0 },
                }));
            }

            Expr::Lit(Lit::Num(num)) => {
                if num.value == 1.0 || num.value == 0.0 {
                    return;
                }
                if self.options.bools {
                    tracing::debug!("booleans: Converting number as boolean expressions");
                    self.changed = true;
                    *n = Expr::Lit(Lit::Num(Number {
                        span: num.span,
                        value: if num.value == 0.0 { 0.0 } else { 1.0 },
                    }));
                }
            }

            Expr::Bin(BinExpr {
                op: op!("??"),
                left,
                right,
                ..
            }) => {
                // Optimize if (a ?? false); as if (a);
                if let Value::Known(false) = right.as_pure_bool() {
                    tracing::debug!(
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

                if let Value::Known(false) = right.as_pure_bool() {
                    tracing::debug!("bools: `expr || false` => `expr` (in bool context)");
                    self.changed = true;
                    *n = *left.take();
                    return;
                }
            }

            _ => {
                let span = n.span();
                let v = n.as_pure_bool();
                if let Value::Known(v) = v {
                    tracing::debug!("Optimizing expr as {} (in bool context)", v);
                    *n = make_bool(span, v);
                    return;
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
            ) if match &**arg {
                Expr::Lit(..) => true,
                _ => false,
            } =>
            {
                true
            }

            (Expr::Member(..) | Expr::Call(..) | Expr::Assign(..), r) if is_pure_undefined(r) => {
                true
            }

            (Expr::Ident(..), Expr::Lit(..)) if is_for_rel => false,

            (Expr::Ident(..), Expr::Ident(..)) => false,

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
        fn is_supported(op: BinaryOp) -> bool {
            match op {
                op!("===")
                | op!("!==")
                | op!("==")
                | op!("!=")
                | op!("&")
                | op!("^")
                | op!("|")
                | op!("*") => true,
                _ => false,
            }
        }

        if !is_supported(op) {
            return false;
        }

        if self.can_swap_bin_operands(&left, &right, false) {
            tracing::debug!("Swapping operands of binary expession");
            swap(left, right);
            return true;
        }

        false
    }

    /// Swap lhs and rhs in certain conditions.
    pub(super) fn swap_bin_operands(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Bin(e @ BinExpr { op: op!("<="), .. })
            | Expr::Bin(e @ BinExpr { op: op!("<"), .. }) => {
                if self.options.comparisons && self.can_swap_bin_operands(&e.left, &e.right, true) {
                    self.changed = true;
                    tracing::debug!("comparisons: Swapping operands of {}", e.op);

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

    ///
    /// - `a === undefined || a === null` => `a == null`
    pub(super) fn optimize_cmp_with_null_or_undefined(&mut self, e: &mut BinExpr) {
        fn opt(
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

                    if !left_bin.right.is_ident() {
                        return None;
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
                                tracing::debug!(
                                    "Reducing `!== null || !== undefined` check to `!= null`"
                                );
                                return Some(BinExpr {
                                    span,
                                    op: op!("=="),
                                    left: cmp.take(),
                                    right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                                });
                            } else {
                                tracing::debug!(
                                    "Reducing `=== null || === undefined` check to `== null`"
                                );
                                return Some(BinExpr {
                                    span,
                                    op: op!("!="),
                                    left: cmp.take(),
                                    right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                                });
                            }
                        }
                        _ => {}
                    }
                }
            }

            None
        }

        if e.op == op!("||") || e.op == op!("&&") {
            {
                let res = opt(e.span, e.op, &mut e.left, &mut e.right);
                if let Some(res) = res {
                    self.changed = true;
                    *e = res;
                    return;
                }
            }

            match (&mut *e.left, &mut *e.right) {
                (Expr::Bin(left), right) => {
                    if e.op == left.op {
                        let res = opt(right.span(), e.op, &mut left.right, &mut *right);
                        if let Some(res) = res {
                            self.changed = true;
                            *e = BinExpr {
                                span: e.span,
                                op: e.op,
                                left: left.left.take(),
                                right: Box::new(Expr::Bin(res)),
                            };
                            return;
                        }
                    }
                }
                _ => {}
            }
        }
    }
}
