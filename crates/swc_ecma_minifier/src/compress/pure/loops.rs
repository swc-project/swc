use std::mem::take;

use swc_common::{util::take::Take, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, StmtExt, Value};

use super::{DropOpts, Pure};

impl Pure<'_> {
    pub(super) fn optimize_for_init(&mut self, init: &mut Option<VarDeclOrExpr>) {
        if !self.options.loops {
            return;
        }

        if let Some(VarDeclOrExpr::Expr(e)) = init {
            self.ignore_return_value(e, DropOpts::DROP_NUMBER.union(DropOpts::DROP_STR_LIT));

            if e.is_invalid() {
                *init = None;
            }
        }

        if let Some(VarDeclOrExpr::Expr(e)) = init {
            self.make_bool_short(e, false, true);
        }
    }

    pub(super) fn optimize_for_update(&mut self, update: &mut Option<Box<Expr>>) {
        if !self.options.loops {
            return;
        }

        if let Some(e) = update {
            self.ignore_return_value(e, DropOpts::DROP_NUMBER.union(DropOpts::DROP_STR_LIT));

            if e.is_invalid() {
                *update = None;
                return;
            }

            self.make_bool_short(e, false, true);
        }
    }

    pub(super) fn optimize_body_of_loop_stmt(&mut self, s: &mut Stmt) {
        if !self.options.loops {
            return;
        }

        match s {
            Stmt::For(ForStmt { body, .. })
            | Stmt::ForIn(ForInStmt { body, .. })
            | Stmt::ForOf(ForOfStmt { body, .. })
            | Stmt::While(WhileStmt { body, .. }) => {
                optimize_loop_body(body);
            }
            _ => (),
        }
    }

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
                report_change!("loops: Converting a while loop to a for loop");
                *s = ForStmt {
                    span: stmt.span,
                    init: None,
                    test: Some(stmt.test.take()),
                    update: None,
                    body: stmt.body.take(),
                }
                .into();
            }
            Stmt::DoWhile(stmt) => {
                let val = stmt.test.as_pure_bool(self.expr_ctx);
                if let Value::Known(true) = val {
                    self.changed = true;
                    report_change!("loops: Converting an always-true do-while loop to a for loop");

                    *s = ForStmt {
                        span: stmt.span,
                        init: None,
                        test: Some(stmt.test.take()),
                        update: None,
                        body: stmt.body.take(),
                    }
                    .into();
                }
            }
            _ => {}
        }
    }

    /// ## Input
    /// ```js
    /// for(; bar();){
    ///     if (x(), y(), foo()) break;
    ///     z(), k();
    /// }
    /// ```
    ///
    /// ## Output
    ///
    /// ```js
    /// for(; bar() && (x(), y(), !foo());)z(), k();
    /// ```
    pub(super) fn optimize_for_if_break(&mut self, s: &mut ForStmt) -> Option<()> {
        if !self.options.loops {
            return None;
        }

        if let Stmt::Block(body) = &mut *s.body {
            let first = body.stmts.get_mut(0)?;

            if let Stmt::If(IfStmt {
                span,
                test,
                cons,
                alt: None,
                ..
            }) = first
            {
                if let Stmt::Break(BreakStmt { label: None, .. }) = &**cons {
                    self.negate(test, false, false);

                    match s.test.as_deref_mut() {
                        Some(e) => {
                            let orig_test = e.take();
                            *e = BinExpr {
                                span: *span,
                                op: op!("&&"),
                                left: Box::new(orig_test),
                                right: test.take(),
                            }
                            .into();
                        }
                        None => {
                            s.test = Some(test.take());
                        }
                    }

                    report_change!("loops: Optimizing a for loop with an if-then-break");

                    first.take();
                    return None;
                }
            }

            if let Stmt::If(IfStmt {
                span,
                test,
                cons,
                alt: Some(alt),
                ..
            }) = first
            {
                if let Stmt::Break(BreakStmt { label: None, .. }) = &**alt {
                    match s.test.as_deref_mut() {
                        Some(e) => {
                            let orig_test = e.take();
                            *e = BinExpr {
                                span: *span,
                                op: op!("&&"),
                                left: Box::new(orig_test),
                                right: test.take(),
                            }
                            .into();
                        }
                        None => {
                            s.test = Some(test.take());
                        }
                    }

                    report_change!("loops: Optimizing a for loop with an if-else-break");

                    *first = *cons.take();
                    return None;
                }
            }
        }

        None
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
        if let Stmt::If(IfStmt {
            test,
            cons,
            alt: None,
            ..
        }) = &mut *s.body
        {
            if let Stmt::Break(BreakStmt { label: None, .. }) = &**cons {
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
                report_change!("loops: Compressing for-if-break into a for statement");

                // We negate because this `test` is used as a condition for `break`.
                self.negate(test, true, false);

                match s.test.take() {
                    Some(left) => {
                        s.test = Some(
                            BinExpr {
                                span: s.test.span(),
                                op: op!("&&"),
                                left,
                                right: test.take(),
                            }
                            .into(),
                        );
                    }
                    None => {
                        s.test = Some(test.take());
                    }
                }

                // Remove body
                s.body.take();
            }
        }
    }

    pub(super) fn optimize_loops_with_constant_condition(&mut self, s: &mut Stmt) {
        if !self.options.loops {
            return;
        }

        match s {
            Stmt::DoWhile(stmt) => {
                let val = stmt.test.as_pure_bool(self.expr_ctx);
                if let Value::Known(false) = val {
                    if should_not_inline_loop_body(&stmt.body, true) {
                        return;
                    }

                    *s = take(&mut *stmt.body);
                    report_change!(
                        "loops: Removing a do while loop with a constant false condition (single \
                         run)"
                    );
                    self.changed = true;
                }
            }

            Stmt::While(stmt) => {
                let val = stmt.test.as_pure_bool(self.expr_ctx);
                if let Value::Known(false) = val {
                    let var_ids = stmt.body.extract_var_ids_as_var();

                    *s = var_ids
                        .map(|decl| Stmt::Decl(Decl::Var(Box::new(decl))))
                        .unwrap_or_else(Stmt::dummy);
                    report_change!(
                        "loops: Removing a while loop with a constant false condition (no run)"
                    );
                    self.changed = true;
                }
            }
            _ => {}
        }
    }
}

fn optimize_loop_body(loop_body: &mut Stmt) {
    if loop_body.is_empty() {
        return;
    }

    if let Stmt::Continue(ContinueStmt { label: None, .. }) = loop_body {
        *loop_body = Stmt::dummy();
    }
}

fn should_not_inline_loop_body(s: &Stmt, allow_break_continue: bool) -> bool {
    match s {
        Stmt::Block(s) => s
            .stmts
            .iter()
            .any(|s| should_not_inline_loop_body(s, allow_break_continue)),

        Stmt::If(s) => {
            should_not_inline_loop_body(&s.cons, false)
                || s.alt
                    .as_deref()
                    .map(|s| should_not_inline_loop_body(s, false))
                    .unwrap_or_default()
        }
        Stmt::Switch(s) => s
            .cases
            .iter()
            .any(|c| c.cons.iter().any(|s| should_not_inline_loop_body(s, false))),

        Stmt::Continue(ContinueStmt {
            label: Some(..), ..
        })
        | Stmt::Break(BreakStmt {
            label: Some(..), ..
        }) => true,

        Stmt::Break(..) | Stmt::Continue(..) => !allow_break_continue,

        Stmt::Return(..)
        | Stmt::Throw(..)
        | Stmt::Empty(..)
        | Stmt::Expr(..)
        | Stmt::Debugger(..) => false,

        _ => true,
    }
}
