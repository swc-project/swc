use super::Optimizer;
use crate::compress::optimize::Ctx;
use crate::compress::util::negate_cost;
use crate::debug::dump;
use swc_atoms::js_word;
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Type;
use swc_ecma_utils::Value::Known;
use swc_ecma_utils::{undefined, ExprExt};

/// Methods related to the options `bools` and `bool_as_ints`.
impl Optimizer<'_> {
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
            log::trace!("[Change] {} => {}", start, dump(&*e));
        }

        true
    }

    pub(super) fn compress_cmp_of_typeof_with_lit(&mut self, e: &mut BinExpr) {
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
        fn opt(o: &mut Optimizer, l: &mut Expr, r: &mut Expr) -> bool {
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

#[cfg(test)]
mod tests {
    use super::negate_cost;
    use swc_common::{input::SourceFileInput, FileName};
    use swc_ecma_parser::{lexer::Lexer, Parser};

    fn assert_negate_cost(s: &str, in_bool_ctx: bool, is_ret_val_ignored: bool, expected: isize) {
        testing::run_test2(false, |cm, _| {
            let fm = cm.new_source_file(FileName::Anon, s.to_string());

            let lexer = Lexer::new(
                Default::default(),
                swc_ecma_ast::EsVersion::latest(),
                SourceFileInput::from(&*fm),
                None,
            );

            let mut parser = Parser::new_from(lexer);

            let e = parser
                .parse_expr()
                .expect("failed to parse input as an expression");

            let actual = negate_cost(&e, in_bool_ctx, is_ret_val_ignored).unwrap();

            assert_eq!(
                actual, expected,
                "Expected negation cost of {} to be {}, but got {}",
                s, expected, actual,
            );

            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn logical_1() {
        assert_negate_cost(
            "this[key] && !this.hasOwnProperty(key) || (this[key] = value)",
            false,
            true,
            2,
        );
    }

    #[test]
    #[ignore]
    fn logical_2() {
        assert_negate_cost(
            "(!this[key] || this.hasOwnProperty(key)) && (this[key] = value)",
            false,
            true,
            -2,
        );
    }
}
