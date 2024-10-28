use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Value::Known};

use crate::compress::{optimize::Optimizer, util::UnreachableHandler};

/// Methods related to the option `loops`.
impl Optimizer<'_> {
    /// `for(a;b;c;) break;` => `a;b;`
    pub(super) fn optimize_loops_with_break(&mut self, s: &mut Stmt) {
        if !self.options.loops {
            return;
        }

        // As we normalize loops, this is enough.
        let f = match s {
            Stmt::For(v) => v,
            _ => return,
        };

        // We only care about instant breaks.
        let label = match &mut *f.body {
            Stmt::Break(b) => b.label.take(),
            _ => return,
        };

        self.changed = true;
        report_change!("loops: Removing a for loop with instant break");
        self.prepend_stmts.extend(f.init.take().map(|init| {
            match init {
                VarDeclOrExpr::VarDecl(var) => var.into(),
                VarDeclOrExpr::Expr(expr) => ExprStmt {
                    span: DUMMY_SP,
                    expr,
                }
                .into(),
            }
        }));
        self.prepend_stmts.extend(f.test.take().map(|expr| {
            ExprStmt {
                span: DUMMY_SP,
                expr,
            }
            .into()
        }));
        if label.is_some() {
            self.prepend_stmts.push(
                BreakStmt {
                    span: DUMMY_SP,
                    label,
                }
                .into(),
            );
        }

        *s = EmptyStmt { span: DUMMY_SP }.into()
    }

    ///
    /// - `while(false) { var a; foo() }` => `var a;`
    pub(super) fn optimize_loops_if_cond_is_false(&mut self, stmt: &mut Stmt) {
        if !self.options.loops {
            return;
        }

        match stmt {
            Stmt::While(w) => {
                let (purity, val) = w.test.cast_to_bool(&self.ctx.expr_ctx);
                if let Known(false) = val {
                    if purity.is_pure() {
                        let changed = UnreachableHandler::preserve_vars(stmt);
                        self.changed |= changed;
                        if changed {
                            report_change!(
                                "loops: Removing unreachable while statement without side effects"
                            );
                        }
                    } else {
                        let changed = UnreachableHandler::preserve_vars(&mut w.body);
                        self.changed |= changed;
                        if changed {
                            report_change!("loops: Removing unreachable body of a while statement");
                        }
                    }
                }
            }
            Stmt::For(f) => {
                if let Some(test) = &mut f.test {
                    let (purity, val) = test.cast_to_bool(&self.ctx.expr_ctx);
                    if let Known(false) = val {
                        let changed = UnreachableHandler::preserve_vars(&mut f.body);
                        self.changed |= changed;
                        if changed {
                            report_change!("loops: Removing unreachable body of a for statement");
                        }
                        self.changed |= f.init.is_some() | f.update.is_some();

                        self.prepend_stmts.extend(f.init.take().map(|init| {
                            match init {
                                VarDeclOrExpr::VarDecl(var) => var.into(),
                                VarDeclOrExpr::Expr(expr) => ExprStmt {
                                    span: DUMMY_SP,
                                    expr,
                                }
                                .into(),
                            }
                        }));
                        self.prepend_stmts.push(
                            ExprStmt {
                                span: DUMMY_SP,
                                expr: f.test.take().unwrap(),
                            }
                            .into(),
                        );
                        f.update = None;
                        *stmt = *f.body.take();
                    } else if let Known(true) = val {
                        if purity.is_pure() {
                            self.changed = true;
                            report_change!(
                                "loops: Removing `test` part of a for stmt as it's always true"
                            );
                            f.test = None;
                        }
                    }
                }
            }
            _ => {}
        }
    }

    ///
    /// - `for (a(), 5; b(); c())` => `for (a(); b(); c())`
    pub(super) fn optimize_init_of_for_stmt(&mut self, s: &mut ForStmt) {
        if !self.options.side_effects {
            return;
        }

        if let Some(init) = &mut s.init {
            match init {
                VarDeclOrExpr::VarDecl(_) => {}
                VarDeclOrExpr::Expr(init) => {
                    let new = self.ignore_return_value(init);
                    if let Some(new) = new {
                        *init = Box::new(new);
                    } else {
                        s.init = None;
                        self.changed = true;
                        report_change!(
                            "loops: Removed side-effect-free expressions in `init` of a for stmt"
                        );
                    }
                }
            }
        }
    }
}
