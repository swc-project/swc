use super::Pure;
use crate::mode::Mode;
use swc_common::{util::take::Take, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Value};

impl<M> Pure<'_, M>
where
    M: Mode,
{
    ///
    /// - `while(test);` => `for(;;test);
    /// - `do; while(true)` => `for(;;);
    pub(super) fn loop_to_for_stmt(&mut self, s: &mut Stmt) {
        if !self.options.loops {
            return;
        }

        match s {
            Stmt::While(stmt) => {
                self.changed = true;
                tracing::debug!("loops: Converting a while loop to a for loop");
                *s = Stmt::For(ForStmt {
                    span: stmt.span,
                    init: None,
                    test: Some(stmt.test.take()),
                    update: None,
                    body: stmt.body.take(),
                });
            }
            Stmt::DoWhile(stmt) => {
                let val = stmt.test.as_pure_bool();
                if let Value::Known(true) = val {
                    self.changed = true;
                    tracing::debug!("loops: Converting an always-true do-while loop to a for loop");

                    *s = Stmt::For(ForStmt {
                        span: stmt.span,
                        init: None,
                        test: Some(stmt.test.take()),
                        update: None,
                        body: stmt.body.take(),
                    });
                }
            }
            _ => {}
        }
    }

    /// # Input
    ///
    /// ```js
    /// for(; size--;)
    ///     if (!(result = eq(a[size], b[size], aStack, bStack)))
    ///         break;
    /// ```
    ///
    ///
    /// # Output
    ///
    /// ```js
    /// for (; size-- && (result = eq(a[size], b[size], aStack, bStack)););
    /// ```
    pub(super) fn merge_for_if_break(&mut self, s: &mut ForStmt) {
        match &mut *s.body {
            Stmt::If(IfStmt {
                test,
                cons,
                alt: None,
                ..
            }) => {
                match &**cons {
                    Stmt::Break(BreakStmt { label: None, .. }) => {
                        // We only care about instant breaks.
                        //
                        // Note: As the minifier of swc is very fast, we don't
                        // care about block statements with a single break as a
                        // body.
                        //
                        // If it's optimizable, other pass for if statements
                        // will remove block and with the next pass we can apply
                        // this pass.
                        self.changed = true;
                        tracing::debug!("loops: Compressing for-if-break into a for statement");

                        // We negate because this `test` is used as a condition for `break`.
                        self.negate(test, true);

                        match s.test.take() {
                            Some(left) => {
                                s.test = Some(Box::new(Expr::Bin(BinExpr {
                                    span: s.test.span(),
                                    op: op!("&&"),
                                    left,
                                    right: test.take(),
                                })));
                            }
                            None => {
                                s.test = Some(test.take());
                            }
                        }

                        // Remove body
                        s.body.take();
                    }
                    _ => {}
                }
            }

            _ => {}
        }
    }
}
