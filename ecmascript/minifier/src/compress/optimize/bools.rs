use super::Optimizer;
use crate::{
    compress::{optimize::Ctx, util::negate_cost},
    debug::dump,
    mode::Mode,
};
use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, undefined, ExprExt, Type, Value::Known};

/// Methods related to the options `bools` and `bool_as_ints`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// **This negates bool**.
    ///
    /// Returns true if it's negated.
    pub(super) fn optimize_bang_within_logical_ops(
        &mut self,
        expr: &mut Expr,
        is_ret_val_ignored: bool,
    ) -> bool {
        let cost = negate_cost(&expr, is_ret_val_ignored, is_ret_val_ignored).unwrap_or(isize::MAX);
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
        tracing::debug!(
            is_return_value_ignored = is_ret_val_ignored,
            negate_cost = cost,
            "bools: Negating: (!a && !b) => !(a || b) (because both expression are good for \
             negation)",
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
            tracing::debug!("[Change] {} => {}", start, dump(&*e));
        }

        true
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
                    tracing::debug!("conditionals: `if (foo) bar;` => `foo && bar`");
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
        fn opt<M>(o: &mut Optimizer<M>, l: &mut Expr, r: &mut Expr) -> bool {
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
                        Expr::Ident(arg) => {
                            if let Some(usage) =
                                o.data.as_ref().and_then(|data| data.vars.get(&arg.to_id()))
                            {
                                if !usage.declared {
                                    return false;
                                }
                            }
                        }
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
