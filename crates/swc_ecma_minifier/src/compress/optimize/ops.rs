use swc_common::{util::take::Take, EqIgnoreSpan, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};
use Value::Known;

use super::{BitCtx, Optimizer};
use crate::{compress::util::negate, util::make_bool};

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
            if (e.left.is_ident() || e.left.is_member())
                && e.left.eq_ignore_span(&e.right)
                && !contains_update_or_assign(&e.left)
            {
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

        if e.op == op!("===") {
            if let Known(lt) = e.left.get_type(self.ctx.expr_ctx) {
                if let Known(rt) = e.right.get_type(self.ctx.expr_ctx) {
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
                        if let Known(Type::Bool) = arg.get_type(self.ctx.expr_ctx) {
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
            self.ctx.expr_ctx,
            e,
            self.ctx.bit_ctx.contains(BitCtx::InBoolCtx),
            is_ret_val_ignored,
        )
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

        let lt = bin.left.get_type(self.ctx.expr_ctx);
        match lt {
            // Don't change type
            Known(Type::Bool) => {}
            _ => return,
        }

        let rt = bin.right.get_type(self.ctx.expr_ctx);
        match rt {
            Known(Type::Bool) => {}
            _ => return,
        }

        match bin.op {
            op!("&&") => {
                let rb = bin.right.as_pure_bool(self.ctx.expr_ctx);
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
                let rb = bin.right.as_pure_bool(self.ctx.expr_ctx);
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
                            value: value.into(),
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

/// Check if an expression contains update expressions (++, --) or assignments
/// that would make duplicate evaluations produce different results.
fn contains_update_or_assign(expr: &Expr) -> bool {
    match expr {
        Expr::Update(..) | Expr::Assign(..) => true,

        Expr::Bin(BinExpr { left, right, .. }) => {
            contains_update_or_assign(left) || contains_update_or_assign(right)
        }

        Expr::Unary(UnaryExpr { arg, .. }) => contains_update_or_assign(arg),

        Expr::Cond(CondExpr {
            test, cons, alt, ..
        }) => {
            contains_update_or_assign(test)
                || contains_update_or_assign(cons)
                || contains_update_or_assign(alt)
        }

        Expr::Member(MemberExpr { obj, prop, .. }) => {
            contains_update_or_assign(obj)
                || match prop {
                    MemberProp::Computed(ComputedPropName { expr, .. }) => {
                        contains_update_or_assign(expr)
                    }
                    _ => false,
                }
        }

        Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            args,
            ..
        }) => {
            contains_update_or_assign(callee)
                || args.iter().any(|arg| contains_update_or_assign(&arg.expr))
        }

        Expr::Seq(SeqExpr { exprs, .. }) => {
            exprs.iter().any(|expr| contains_update_or_assign(expr))
        }

        Expr::Paren(ParenExpr { expr, .. }) => contains_update_or_assign(expr),

        Expr::OptChain(OptChainExpr { base, .. }) => match &**base {
            OptChainBase::Member(member) => {
                contains_update_or_assign(&member.obj)
                    || match &member.prop {
                        MemberProp::Computed(ComputedPropName { expr, .. }) => {
                            contains_update_or_assign(expr)
                        }
                        _ => false,
                    }
            }
            OptChainBase::Call(call) => {
                contains_update_or_assign(&call.callee)
                    || call
                        .args
                        .iter()
                        .any(|arg| contains_update_or_assign(&arg.expr))
            }
        },

        _ => false,
    }
}
