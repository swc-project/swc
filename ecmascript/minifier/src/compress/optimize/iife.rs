use std::mem::swap;

use crate::compress::optimize::is_clone_cheap;
use crate::compress::optimize::Ctx;

use super::Optimizer;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::undefined;
use swc_ecma_visit::VisitMutWith;

/// Methods related to the option `negate_iife`.
impl Optimizer {
    /// Negates iife, while ignore return value.
    pub(super) fn negate_iife_ignoring_ret(&mut self, e: &mut Expr) {
        if !self.options.negate_iife || self.ctx.in_bang_arg {
            return;
        }

        let expr = match e {
            Expr::Call(e) => e,
            _ => return,
        };

        let callee = match &mut expr.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(e) => &mut **e,
        };

        match callee {
            Expr::Fn(..) => {
                log::trace!("negate_iife: Negating iife");
                *e = Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: Box::new(e.take()),
                });
                return;
            }
            _ => {}
        }
    }

    ///
    /// - `iife ? foo : bar` => `!iife ? bar : foo`
    pub(super) fn negate_iife_in_cond(&mut self, e: &mut Expr) {
        let cond = match e {
            Expr::Cond(v) => v,
            _ => return,
        };

        let test_call = match &mut *cond.test {
            Expr::Call(e) => e,
            _ => return,
        };

        let callee = match &mut test_call.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(e) => &mut **e,
        };

        match callee {
            Expr::Fn(..) => {
                log::trace!("negate_iife: Swapping cons and alt");
                cond.test = Box::new(Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: cond.test.take(),
                }));
                swap(&mut cond.cons, &mut cond.alt);
                return;
            }
            _ => {}
        }
    }
}

/// Methods related to iife.
impl Optimizer {
    /// # Exmaple
    ///
    /// ## Input
    ///
    /// ```ts
    /// (function(x) {
    ///     (function(y) {
    ///         console.log(7);
    ///     })(7);
    /// })(7);
    /// ```
    ///
    ///
    /// ## Output
    ///
    /// ```ts
    /// (function(x) {
    ///     (function(y) {
    ///         console.log(y);
    ///     })(x);
    /// })(7);
    /// ```
    pub(super) fn inline_args_of_iife(&mut self, e: &mut CallExpr) {
        if !self.options.inline {
            return;
        }

        let has_spread_arg = e.args.iter().any(|v| v.spread.is_some());

        if !has_spread_arg {
            match &mut e.callee {
                ExprOrSuper::Super(_) => {}
                ExprOrSuper::Expr(callee) => match &mut **callee {
                    Expr::Fn(callee) => {
                        // We check for parameter and argument
                        for (idx, param) in callee.function.params.iter().enumerate() {
                            let arg = e.args.get(idx).map(|v| &v.expr);
                            if let Pat::Ident(param) = &param.pat {
                                if let Some(arg) = arg {
                                    let should_be_inlined = is_clone_cheap(arg);
                                    if should_be_inlined {
                                        self.lits.insert(param.to_id(), arg.clone());
                                    }
                                }
                            }
                        }

                        let ctx = Ctx {
                            inline_prevented: false,
                            ..self.ctx
                        };
                        callee.function.visit_mut_with(&mut *self.with_ctx(ctx));

                        // TODO: Drop arguments if all usage is inlined. (We
                        // should preserve parameters)
                    }
                    _ => {}
                },
            }
        }
    }

    /// Fully inlines iife.
    ///
    /// # Example
    ///
    /// ## Input
    ///
    /// ```ts
    /// (function () {
    ///     return {};
    /// })().x = 10;
    /// ```
    ///
    /// ## Oupuy
    ///
    /// ```ts
    /// ({
    /// }).x = 10;
    /// ```
    pub(super) fn invoke_iife(&mut self, e: &mut Expr) {
        if !self.options.inline {
            return;
        }

        let expr = match e {
            Expr::Call(v) => v,
            _ => return,
        };

        let callee = match &mut expr.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(e) => &mut **e,
        };

        // TODO: Improve this.
        if !expr.args.is_empty() {
            return;
        }

        let f = match callee {
            Expr::Fn(f) => f,
            _ => return,
        };

        // TODO: Improve this.
        if !f.function.params.is_empty() {
            return;
        }

        let body = f.function.body.as_mut().unwrap();
        if body.stmts.is_empty() {
            *e = *undefined(f.function.span);
            return;
        }

        if !body.stmts.iter().all(|stmt| match stmt {
            Stmt::Expr(..) | Stmt::Return(..) => true,
            _ => false,
        }) {
            return;
        }

        self.changed = true;

        log::trace!("inline: Inlining a function call");

        //
        let mut exprs = vec![];
        for stmt in body.stmts.take() {
            match stmt {
                Stmt::Expr(stmt) => {
                    exprs.push(stmt.expr);
                }

                Stmt::Return(stmt) => {
                    let span = stmt.span;
                    *e = *stmt.arg.unwrap_or_else(|| undefined(span));
                    return;
                }
                _ => {}
            }
        }

        if let Some(last) = exprs.last_mut() {
            *last = Box::new(Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("void"),
                arg: last.take(),
            }));
        } else {
            *e = *undefined(f.function.span);
            return;
        }

        *e = Expr::Seq(SeqExpr {
            span: DUMMY_SP,
            exprs,
        })
    }
}
