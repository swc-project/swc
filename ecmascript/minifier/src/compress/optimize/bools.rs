use super::Optimizer;
use crate::compress::optimize::is_pure_undefined;
use crate::util::make_bool;
use swc_atoms::js_word;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Type;
use swc_ecma_utils::Value;
use swc_ecma_utils::Value::Known;
use swc_ecma_utils::Value::Unknown;

/// Methods related to the options `bools` and `bool_as_ints`.
impl Optimizer<'_> {
    /// Disabled because it can change semantics.
    ///
    /// - `!foo || bar();` => `foo && bar();`
    /// - `!foo && bar();` => `foo || bar();`
    pub(super) fn compress_logical_exprs_with_negated_lhs(&mut self, e: &mut Expr) {
        if !self.options.bools || true {
            return;
        }

        match e {
            Expr::Bin(BinExpr {
                span,
                op: op @ op!("||"),
                left,
                right,
                ..
            })
            | Expr::Bin(BinExpr {
                span,
                op: op @ op!("&&"),
                left,
                right,
                ..
            }) => match &mut **left {
                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) => {
                    if *op == op!("&&") {
                        log::trace!("booleans: Compressing `!foo && bar` as `foo || bar`");
                    } else {
                        log::trace!("booleans: Compressing `!foo || bar` as `foo && bar`");
                    }
                    self.changed = true;
                    *e = Expr::Bin(BinExpr {
                        span: *span,
                        left: arg.take(),
                        op: if *op == op!("&&") {
                            op!("||")
                        } else {
                            op!("&&")
                        },
                        right: right.take(),
                    });
                    return;
                }
                _ => {}
            },

            _ => {}
        }
    }

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
                                log::trace!("booleans: Compressing `!foo && true` as `!foo`");
                            } else {
                                log::trace!("booleans: Compressing `!foo || false` as `!foo`");
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
                span,
                op: op!("!"),
                arg,
                ..
            }) => match &mut **arg {
                Expr::Bin(BinExpr {
                    op: op!("&&"),
                    left,
                    right,
                    ..
                }) => {
                    log::trace!("Optimizing ``!(a && b)` as `!a || !b`");
                    self.changed = true;
                    *e = Expr::Bin(BinExpr {
                        span: *span,
                        op: op!("||"),
                        left: Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("!"),
                            arg: left.take(),
                        })),
                        right: Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("!"),
                            arg: right.take(),
                        })),
                    });
                    return;
                }
                _ => {}
            },
            _ => {}
        }
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
                    log::trace!("booleans: Compressing `delete` as sequence expression");
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
            log::trace!("booleans: Compressing `delete` => true");
            *e = make_bool(span, true);
            return;
        }
    }

    /// This method converts `!1` to `0`.
    pub(super) fn optimize_expr_in_bool_ctx(&mut self, n: &mut Expr) {
        if !self.options.bools {
            return;
        }

        match n {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("!"),
                arg,
            }) => match &**arg {
                Expr::Lit(Lit::Num(Number { value, .. })) => {
                    log::trace!("Optimizing: number => number (in bool context)");

                    self.changed = true;
                    *n = Expr::Lit(Lit::Num(Number {
                        span: *span,
                        value: if *value == 0.0 { 1.0 } else { 0.0 },
                    }))
                }
                _ => {}
            },

            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
            }) => {
                log::trace!("Optimizing: typeof => true (in bool context)");
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
                log::trace!("Converting string as boolean expressions");
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
                    log::trace!("booleans: Converting number as boolean expressions");
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
                    log::trace!(
                        "Dropping right operand of `??` as it's always false (in bool context)"
                    );
                    self.changed = true;
                    *n = *left.take();
                }
            }

            _ => {
                let span = n.span();
                let v = n.as_pure_bool();
                if let Known(v) = v {
                    log::trace!("Optimizing expr as {} (in bool context)", v);
                    *n = make_bool(span, v);
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
                    log::trace!("conditionals: `if (foo) bar;` => `foo && bar`");
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
}
