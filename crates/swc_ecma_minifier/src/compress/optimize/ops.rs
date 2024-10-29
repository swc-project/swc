use swc_common::{util::take::Take, EqIgnoreSpan, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};
use Value::Known;

use super::Optimizer;
use crate::{
    compress::util::negate,
    util::{make_bool, ValueExt},
};

impl Optimizer<'_> {
    ///
    /// - `'12' === `foo` => '12' == 'foo'`
    pub(super) fn optimize_bin_equal(&mut self, e: &mut BinExpr) {
        if !self.options.comparisons {
            return;
        }

        match e.op {
            op!("===") | op!("==") | op!("!==") | op!("!=") => {
                if e.left.is_ident() && e.left.eq_ignore_span(&e.right) {
                    let id: Ident = e.left.clone().ident().unwrap();
                    if let Some(t) = self.typeofs.get(&id.to_id()) {
                        match &**t {
                            "object" | "function" => {
                                e.left = Box::new(make_bool(
                                    e.span,
                                    e.op == op!("===") || e.op == op!("=="),
                                ));
                                e.right.take();

                                self.changed = true;
                                report_change!("Evaluate comparing to self");

                                return;
                            }
                            _ => {}
                        }
                    }
                }
            }

            _ => {}
        }

        if e.op == op!("===") || e.op == op!("!==") {
            if (e.left.is_ident() || e.left.is_member()) && e.left.eq_ignore_span(&e.right) {
                self.changed = true;
                report_change!("Reducing comparison of same variable ({})", e.op);

                e.op = if e.op == op!("===") {
                    op!("==")
                } else {
                    op!("!=")
                };
                return;
            }
        }

        let lt = e.left.get_type();
        let rt = e.right.get_type();

        if e.op == op!("===") {
            if let Known(lt) = lt {
                if let Known(rt) = rt {
                    if lt == rt {
                        e.op = op!("==");
                        self.changed = true;
                        report_change!(
                            "Reduced `===` to `==` because types of operands are identical"
                        )
                    }
                }
            }
        }
    }

    /// x && (y && z)  ==>  x && y && z
    /// x || (y || z)  ==>  x || y || z
    /// x + ("y" + z)  ==>  x + "y" + z
    /// "x" + (y + "z")==>  "x" + y + "z"
    pub(super) fn remove_bin_paren(&mut self, n: &mut BinExpr) {
        if let Expr::Bin(right) = &mut *n.right {
            if right.op == n.op {
                if n.op.may_short_circuit()
                    || (right.left.is_str() && right.op == op!(bin, "+"))
                    || (n.left.is_str() && right.right.is_str())
                {
                    self.changed = true;
                    report_change!("Remove extra paren in binary expression");
                    let left = n.left.take();
                    let BinExpr {
                        op,
                        left: rl,
                        right: rr,
                        ..
                    } = right.take();
                    *n.left = BinExpr {
                        span: left.span(),
                        op,
                        left,
                        right: rl,
                    }
                    .into();
                    n.right = rr;
                }
            }
        }
    }

    ///
    /// - `1 == 1` => `true`
    /// - `1 == 2` => `false`
    pub(super) fn optimize_lit_cmp(&mut self, n: &mut BinExpr) -> Option<Expr> {
        if n.op != op!("==") && n.op != op!("!=") {
            return None;
        }
        let flag = n.op == op!("!=");
        let mut make_lit_bool = |value: bool| {
            self.changed = true;
            Some(
                Lit::Bool(Bool {
                    span: n.span,
                    value: flag ^ value,
                })
                .into(),
            )
        };
        match (n.left.get_type().opt()?, n.right.get_type().opt()?) {
            // Abort if types differ, or one of them is unknown.
            (lt, rt) if lt != rt => {}
            (Type::Obj, Type::Obj) => {}
            (Type::Num, Type::Num) => {
                let l = n.left.as_pure_number(&self.ctx.expr_ctx).opt()?;
                let r = n.right.as_pure_number(&self.ctx.expr_ctx).opt()?;
                report_change!("Optimizing: literal comparison => num");
                return make_lit_bool(l == r);
            }
            (Type::Str, Type::Str) => {
                let l = &n.left.as_pure_string(&self.ctx.expr_ctx).opt()?;
                let r = &n.right.as_pure_string(&self.ctx.expr_ctx).opt()?;
                report_change!("Optimizing: literal comparison => str");
                return make_lit_bool(l == r);
            }
            (_, _) => {
                let l = n.left.as_pure_bool(&self.ctx.expr_ctx).opt()?;
                let r = n.right.as_pure_bool(&self.ctx.expr_ctx).opt()?;
                report_change!("Optimizing: literal comparison => bool");
                return make_lit_bool(l == r);
            }
        };

        None
    }

    ///
    /// - `!!(a in b)` => `a in b`
    /// - `!!(function() {})()` => `!(function() {})()`
    pub(super) fn optimize_bangbang(&mut self, e: &mut Expr) {
        if let Expr::Unary(UnaryExpr {
            op: op!("!"), arg, ..
        }) = e
        {
            if let Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) = &mut **arg
            {
                match &**arg {
                    Expr::Unary(UnaryExpr { op: op!("!"), .. })
                    | Expr::Bin(BinExpr { op: op!("in"), .. })
                    | Expr::Bin(BinExpr {
                        op: op!("instanceof"),
                        ..
                    })
                    | Expr::Bin(BinExpr { op: op!("=="), .. })
                    | Expr::Bin(BinExpr { op: op!("!="), .. })
                    | Expr::Bin(BinExpr { op: op!("==="), .. })
                    | Expr::Bin(BinExpr { op: op!("!=="), .. })
                    | Expr::Bin(BinExpr { op: op!("<="), .. })
                    | Expr::Bin(BinExpr { op: op!("<"), .. })
                    | Expr::Bin(BinExpr { op: op!(">="), .. })
                    | Expr::Bin(BinExpr { op: op!(">"), .. }) => {
                        if let Known(Type::Bool) = arg.get_type() {
                            self.changed = true;
                            report_change!("Optimizing: `!!expr` => `expr`");
                            *e = *arg.take();
                        }
                    }

                    _ => {}
                }
            }
        }
    }

    /// TODO: Optimize based on the type.
    pub(super) fn negate_twice(&mut self, e: &mut Expr, is_ret_val_ignored: bool) {
        self.negate(e, is_ret_val_ignored);
        self.negate(e, is_ret_val_ignored);
    }

    pub(super) fn negate(&mut self, e: &mut Expr, is_ret_val_ignored: bool) {
        negate(
            &self.ctx.expr_ctx,
            e,
            self.ctx.in_bool_ctx,
            is_ret_val_ignored,
        )
    }

    /// This method does
    ///
    /// - `x *= 3` => `x = 3 * x`
    /// - `x = 3 | x` `x |= 3`
    /// - `x = 3 & x` => `x &= 3;`
    /// - `x ^= 3` => `x = 3 ^ x`
    pub(super) fn compress_bin_assignment_to_right(&mut self, e: &mut AssignExpr) {
        if e.op != op!("=") {
            return;
        }

        // TODO: Handle pure properties.
        let lhs = match &e.left {
            AssignTarget::Simple(SimpleAssignTarget::Ident(i)) => i,
            _ => return,
        };

        let (op, left) = match &mut *e.right {
            Expr::Bin(BinExpr {
                left, op, right, ..
            }) => match &**right {
                Expr::Ident(r) if lhs.sym == r.sym && lhs.ctxt == r.ctxt => {
                    // We need this check because a function call like below can change value of
                    // operand.
                    //
                    // x = g() * x;

                    match &**left {
                        Expr::This(..) | Expr::Ident(..) | Expr::Lit(..) => {}
                        _ => return,
                    }

                    (op, left)
                }
                _ => return,
            },
            _ => return,
        };

        let op = match op {
            BinaryOp::Mul => {
                op!("*=")
            }
            BinaryOp::BitOr => {
                op!("|=")
            }
            BinaryOp::BitXor => {
                op!("^=")
            }
            BinaryOp::BitAnd => {
                op!("&=")
            }
            _ => return,
        };

        report_change!("Compressing: `e = 3 & e` => `e &= 3`");

        self.changed = true;
        e.op = op;
        e.right = left.take();
    }

    /// Remove meaningless literals in a binary expressions.
    ///
    /// # Parameters
    ///
    ///  - `in_bool_ctx`: True for expressions casted to bool.
    ///
    /// # Examples
    ///
    /// - `x() && true` => `!!x()`
    pub(super) fn compress_logical_exprs_as_bang_bang(&mut self, e: &mut Expr, _in_bool_ctx: bool) {
        if !self.options.conditionals && !self.options.reduce_vars {
            return;
        }

        let bin = match e {
            Expr::Bin(bin) => bin,
            _ => return,
        };

        match bin.op {
            op!("&&") | op!("||") => {
                self.compress_logical_exprs_as_bang_bang(&mut bin.left, true);
                self.compress_logical_exprs_as_bang_bang(&mut bin.right, true);
            }

            _ => {}
        }

        let lt = bin.left.get_type();
        match lt {
            // Don't change type
            Known(Type::Bool) => {}
            _ => return,
        }

        let rt = bin.right.get_type();
        match rt {
            Known(Type::Bool) => {}
            _ => return,
        }

        match bin.op {
            op!("&&") => {
                let rb = bin.right.as_pure_bool(&self.ctx.expr_ctx);
                let rb = match rb {
                    Value::Known(v) => v,
                    _ => return,
                };

                if rb {
                    self.changed = true;
                    report_change!("Optimizing: e && true => !!e");

                    self.negate_twice(&mut bin.left, false);
                    *e = *bin.left.take();
                }
            }
            op!("||") => {
                let rb = bin.right.as_pure_bool(&self.ctx.expr_ctx);
                let rb = match rb {
                    Value::Known(v) => v,
                    _ => return,
                };

                if !rb {
                    self.changed = true;
                    report_change!("Optimizing: e || false => !!e");

                    self.negate_twice(&mut bin.left, false);
                    *e = *bin.left.take();
                }
            }
            _ => {}
        }
    }

    pub(super) fn compress_typeofs(&mut self, e: &mut Expr) {
        if !self.options.typeofs {
            return;
        }

        if let Expr::Unary(UnaryExpr {
            span,
            op: op!("typeof"),
            arg,
            ..
        }) = e
        {
            match &**arg {
                Expr::Ident(arg) => {
                    if let Some(value) = self.typeofs.get(&arg.to_id()).cloned() {
                        report_change!(
                            "Converting typeof of variable to literal as we know the value"
                        );
                        self.changed = true;
                        *e = Lit::Str(Str {
                            span: *span,
                            raw: None,
                            value,
                        })
                        .into();
                    }
                }

                Expr::Arrow(..) | Expr::Fn(..) | Expr::Class(..) => {
                    report_change!("Converting typeof to 'function' as we know the value");
                    self.changed = true;
                    *e = Lit::Str(Str {
                        span: *span,
                        raw: None,
                        value: "function".into(),
                    })
                    .into();
                }

                Expr::Array(..) | Expr::Object(..) => {
                    report_change!("Converting typeof to 'object' as we know the value");
                    self.changed = true;
                    *e = Lit::Str(Str {
                        span: *span,
                        raw: None,
                        value: "object".into(),
                    })
                    .into();
                }
                _ => {}
            }
        }
    }
}
