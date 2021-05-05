use crate::compress::optimize::unused::UnreachableHandler;
use crate::compress::optimize::Optimizer;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Value::Known;

/// Methods related to the option `loops`.
impl Optimizer<'_> {
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
                log::trace!("loops: Converting a while loop to a for loop");
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
                if let Known(true) = val {
                    self.changed = true;
                    log::trace!("loops: Converting an always-true do-while loop to a for loop");

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
        if !f.body.is_break_stmt() {
            return;
        }

        self.changed = true;
        log::trace!("loops: Removing a for loop with instant break");
        self.prepend_stmts
            .extend(f.init.take().map(|init| match init {
                VarDeclOrExpr::VarDecl(var) => Stmt::Decl(Decl::Var(var)),
                VarDeclOrExpr::Expr(expr) => Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr,
                }),
            }));
        self.prepend_stmts.extend(f.test.take().map(|expr| {
            Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr,
            })
        }));
        *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP })
    }

    ///
    /// - `while(false) { var a; foo() }` => `var a;`
    pub(super) fn optiimze_loops_if_cond_is_false(&mut self, stmt: &mut Stmt) {
        if !self.options.loops {
            return;
        }

        match stmt {
            Stmt::While(w) => {
                let (purity, val) = w.test.as_bool();
                if let Known(false) = val {
                    if purity.is_pure() {
                        let changed = UnreachableHandler::preserve_vars(stmt);
                        self.changed |= changed;
                        if changed {
                            log::trace!(
                                "loops: Removing unreachable while statement without side effects"
                            );
                        }
                    } else {
                        let changed = UnreachableHandler::preserve_vars(&mut w.body);
                        self.changed |= changed;
                        if changed {
                            log::trace!("loops: Removing unreachable body of a while statement");
                        }
                    }
                }
            }
            Stmt::For(f) => {
                if let Some(test) = &mut f.test {
                    let (purity, val) = test.as_bool();
                    if let Known(false) = val {
                        let changed = UnreachableHandler::preserve_vars(&mut f.body);
                        self.changed |= changed;
                        if changed {
                            log::trace!("loops: Removing unreachable body of a for statement");
                        }
                        self.changed |= f.init.is_some() | f.update.is_some();

                        self.prepend_stmts
                            .extend(f.init.take().map(|init| match init {
                                VarDeclOrExpr::VarDecl(var) => Stmt::Decl(Decl::Var(var)),
                                VarDeclOrExpr::Expr(expr) => Stmt::Expr(ExprStmt {
                                    span: DUMMY_SP,
                                    expr,
                                }),
                            }));
                        self.prepend_stmts.push(Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: f.test.take().unwrap(),
                        }));
                        f.update = None;
                        *stmt = *f.body.take();
                        return;
                    } else if let Known(true) = val {
                        if purity.is_pure() {
                            self.changed = true;
                            log::trace!(
                                "loops: Remving `test` part of a for stmt as it's always true"
                            );
                            f.test = None;
                        }
                    }
                }
            }
            _ => {}
        }
    }

    pub(super) fn drop_if_break(&mut self, s: &ForStmt) {
        if !self.options.loops {
            return;
        }
    }

    ///
    /// - `for (a(), 5; b(); c())` => `for (a(); b(); c())`
    pub(super) fn optimize_init_of_for_stmt(&mut self, s: &mut ForStmt) {
        if !self.options.side_effects {
            return;
        }

        match &mut s.init {
            Some(init) => match init {
                VarDeclOrExpr::VarDecl(_) => {}
                VarDeclOrExpr::Expr(init) => {
                    let new = self.ignore_return_value(&mut **init);
                    if let Some(new) = new {
                        *init = Box::new(new);
                        return;
                    } else {
                        s.init = None;
                        self.changed = true;
                        log::trace!(
                            "loops: Removed side-effect-free expressions in `init` of a for stmt"
                        );
                    }
                }
            },
            None => {}
        }
    }
}
