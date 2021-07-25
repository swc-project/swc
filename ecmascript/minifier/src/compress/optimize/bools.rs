use super::Optimizer;
use crate::compress::optimize::{is_pure_undefined, Ctx};
use crate::debug::dump;
use crate::util::make_bool;
use swc_atoms::js_word;
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::Type;
use swc_ecma_utils::Value;
use swc_ecma_utils::Value::Known;
use swc_ecma_utils::Value::Unknown;
use swc_ecma_utils::{undefined, ExprExt};

/// Methods related to the options `bools` and `bool_as_ints`.
impl Optimizer<'_> {
    ///
    /// - `!condition() || !-3.5` => `!condition()`
    ///
    /// In this case, if lhs is false, rhs is also false so it's removable.
    pub(super) fn remove_useless_pipes(&mut self, e: &mut Expr) {
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
                    (Known(Type::Bool), Known(Type::Bool)) => {
                        let rb = right.as_pure_bool();
                        let rb = match rb {
                            Known(v) => v,
                            Unknown => return,
                        };

                        //
                        let can_remove = if *op == op!("&&") { rb } else { !rb };

                        if can_remove {
                            if *op == op!("&&") {
                                log::debug!("booleans: Compressing `!foo && true` as `!foo`");
                            } else {
                                log::debug!("booleans: Compressing `!foo || false` as `!foo`");
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

    /// `!(a && b)` => `!a || !b`
    pub(super) fn optimize_bools(&mut self, e: &mut Expr) {
        if !self.options.bools {
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
                    if negate_cost(&left, self.ctx.in_bool_ctx, false).unwrap_or(isize::MAX) >= 0
                        || negate_cost(&right, self.ctx.in_bool_ctx, false).unwrap_or(isize::MAX)
                            >= 0
                    {
                        return;
                    }
                    log::debug!("Optimizing `!(a && b)` as `!a || !b`");
                    self.changed = true;
                    self.negate(arg);
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
                        if negate_cost(&left, self.ctx.in_bool_ctx, false).unwrap_or(isize::MAX) > 0
                            && negate_cost(&right, self.ctx.in_bool_ctx, false)
                                .unwrap_or(isize::MAX)
                                > 0
                        {
                            return;
                        }
                        log::debug!("Optimizing `!!(a || b)` as `!a && !b`");
                        self.changed = true;
                        self.negate(arg_of_arg);
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

    /// **This negates bool**.
    ///
    /// Returns true if it's negated.
    pub(super) fn optimize_bang_within_logical_ops(
        &mut self,
        expr: &mut Expr,
        is_ret_val_ignored: bool,
    ) -> bool {
        if negate_cost(&expr, is_ret_val_ignored, is_ret_val_ignored).unwrap_or(isize::MAX) >= 0 {
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
        log::debug!(
            "bools({}): Negating: (!a && !b) => !(a || b) (because both expression are good for \
             negation)",
            self.line_col(e.span)
        );
        let start = dump(&*e);

        e.op = if e.op == op!("&&") {
            op!("||")
        } else {
            op!("&&")
        };

        let ctx = Ctx {
            in_bool_ctx: true,
            ..self.ctx
        };

        self.changed = true;
        self.with_ctx(ctx).negate(&mut e.left);
        self.with_ctx(ctx).negate(&mut e.right);

        if cfg!(feature = "debug") {
            log::trace!("[Change] {} => {}", start, dump(&*e));
        }

        true
    }

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
                let v = if let Known(rn) = rn {
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
                    log::debug!("booleans: Compressing `delete` as sequence expression");
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
            log::debug!("booleans: Compressing `delete` => true");
            *e = make_bool(span, true);
            return;
        }
    }

    pub(super) fn compress_comparsion_of_typeof(&mut self, e: &mut BinExpr) {
        fn should_optimize(l: &Expr, r: &Expr) -> bool {
            match (l, r) {
                (
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"), ..
                    }),
                    Expr::Lit(..),
                ) => true,
                _ => false,
            }
        }

        match e.op {
            op!("===") | op!("!==") => {}
            _ => return,
        }

        if should_optimize(&e.left, &e.right) || should_optimize(&e.right, &e.left) {
            log::debug!("bools: Compressing comparison of `typeof` with literal");
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
                    log::debug!("Optimizing: number => number (in bool context)");

                    self.changed = true;
                    *n = Expr::Lit(Lit::Num(Number {
                        span: *span,
                        value: if *value == 0.0 { 1.0 } else { 0.0 },
                    }))
                }

                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) => {
                    log::debug!("bools: !!expr => expr (in bool ctx)");
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
                log::debug!("Optimizing: typeof => true (in bool context)");
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
                log::debug!("Converting string as boolean expressions");
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
                    log::debug!("booleans: Converting number as boolean expressions");
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
                    log::debug!(
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

                if let Known(false) = right.as_pure_bool() {
                    log::debug!("bools: `expr || false` => `expr` (in bool context)");
                    self.changed = true;
                    *n = *left.take();
                    return;
                }
            }

            _ => {
                let span = n.span();
                let v = n.as_pure_bool();
                if let Known(v) = v {
                    log::debug!("Optimizing expr as {} (in bool context)", v);
                    *n = make_bool(span, v);
                    return;
                }
            }
        }
    }

    pub(super) fn compress_if_stmt_as_expr(&mut self, s: &mut Stmt) {
        if !self.options.bools {
            return;
        }

        let stmt = match s {
            Stmt::If(v) => v,
            _ => return,
        };

        match &stmt.alt {
            Some(..) => {}
            None => match &mut *stmt.cons {
                Stmt::Expr(cons) => {
                    self.changed = true;
                    log::debug!("conditionals: `if (foo) bar;` => `foo && bar`");
                    *s = Stmt::Expr(ExprStmt {
                        span: stmt.span,
                        expr: Box::new(Expr::Bin(BinExpr {
                            span: stmt.test.span(),
                            op: op!("&&"),
                            left: stmt.test.take(),
                            right: cons.expr.take(),
                        })),
                    });
                    return;
                }
                _ => {}
            },
        }
    }

    ///
    /// - `"undefined" == typeof value;` => `void 0 === value`
    pub(super) fn compress_typeof_undefined(&mut self, e: &mut BinExpr) {
        fn opt(_o: &mut Optimizer, l: &mut Expr, r: &mut Expr) -> bool {
            match (&mut *l, &mut *r) {
                (
                    Expr::Lit(Lit::Str(Str {
                        value: js_word!("undefined"),
                        ..
                    })),
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"),
                        arg,
                        ..
                    }),
                ) => {
                    // TODO?
                    match &**arg {
                        Expr::Ident(Ident { sym, .. }) => match &**sym {
                            "require" | "exports" => return false,
                            _ => {}
                        },
                        _ => {}
                    }

                    *l = *undefined(l.span());
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
}

pub(crate) fn is_ok_to_negate_for_cond(e: &Expr) -> bool {
    match e {
        Expr::Update(..) => false,
        _ => true,
    }
}

pub(crate) fn is_ok_to_negate_rhs(rhs: &Expr) -> bool {
    match rhs {
        Expr::Member(..) => true,
        Expr::Bin(BinExpr {
            op: op!("===") | op!("!==") | op!("==") | op!("!="),
            ..
        }) => true,

        Expr::Call(..) | Expr::New(..) => false,

        Expr::Update(..) => false,

        Expr::Bin(BinExpr {
            op: op!("&&") | op!("||"),
            left,
            right,
            ..
        }) => is_ok_to_negate_rhs(&left) && is_ok_to_negate_rhs(&right),

        Expr::Bin(BinExpr { left, right, .. }) => {
            is_ok_to_negate_rhs(&left) && is_ok_to_negate_rhs(&right)
        }

        Expr::Assign(e) => is_ok_to_negate_rhs(&e.right),

        Expr::Unary(UnaryExpr {
            op: op!("!") | op!("delete"),
            ..
        }) => true,

        Expr::Seq(e) => {
            if let Some(last) = e.exprs.last() {
                is_ok_to_negate_rhs(&last)
            } else {
                true
            }
        }

        Expr::Cond(e) => is_ok_to_negate_rhs(&e.cons) && is_ok_to_negate_rhs(&e.alt),

        _ => {
            if !rhs.may_have_side_effects() {
                return true;
            }

            log::warn!(
                "unimplemented: can_negate_rhs_of_logical: `{}`",
                dump(&*rhs)
            );

            false
        }
    }
}

/// A negative value means that it's efficient to negate the expression.
pub(crate) fn negate_cost(e: &Expr, in_bool_ctx: bool, is_ret_val_ignored: bool) -> Option<isize> {
    fn cost(
        e: &Expr,
        in_bool_ctx: bool,
        bin_op: Option<BinaryOp>,
        is_ret_val_ignored: bool,
    ) -> isize {
        match e {
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => {
                if in_bool_ctx {
                    let c = -cost(arg, true, None, is_ret_val_ignored);
                    return c.min(-1);
                }

                match &**arg {
                    Expr::Unary(UnaryExpr { op: op!("!"), .. }) => -1,

                    _ => 1,
                }
            }
            Expr::Bin(BinExpr {
                op: op!("===") | op!("!==") | op!("==") | op!("!="),
                ..
            }) => 0,

            Expr::Bin(BinExpr {
                op: op @ op!("||") | op @ op!("&&"),
                left,
                right,
                ..
            }) => {
                let l_cost = cost(&left, in_bool_ctx, Some(*op), false);

                if !is_ret_val_ignored && !is_ok_to_negate_rhs(&right) {
                    return l_cost + 3;
                }
                l_cost + cost(&right, in_bool_ctx, Some(*op), is_ret_val_ignored)
            }

            Expr::Cond(CondExpr { cons, alt, .. })
                if is_ok_to_negate_for_cond(&cons) && is_ok_to_negate_for_cond(&alt) =>
            {
                cost(&cons, in_bool_ctx, bin_op, is_ret_val_ignored)
                    + cost(&alt, in_bool_ctx, bin_op, is_ret_val_ignored)
            }

            Expr::Cond(..)
            | Expr::Update(..)
            | Expr::Bin(BinExpr {
                op: op!("in") | op!("instanceof"),
                ..
            }) => 3,

            Expr::Seq(e) => {
                if let Some(last) = e.exprs.last() {
                    return cost(&last, in_bool_ctx, bin_op, is_ret_val_ignored);
                }

                if is_ret_val_ignored {
                    0
                } else {
                    1
                }
            }

            _ => {
                if is_ret_val_ignored {
                    0
                } else {
                    1
                }
            }
        }
    }

    let cost = cost(e, in_bool_ctx, None, is_ret_val_ignored);

    if cfg!(feature = "debug") {
        log::trace!("negation cost of `{}` = {}", dump(&*e), cost);
    }

    Some(cost)
}
