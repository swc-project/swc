use super::Optimizer;
use crate::util::ExprOptExt;
use std::mem::take;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::StmtLike;

/// Methods related to the option `sequences`. All methods are noop if
/// `sequences` is false.
impl Optimizer {
    ///
    /// # Exmaple
    ///
    ///
    /// ## Input
    ///
    /// ```ts
    /// x = 5;
    /// if (y) z();
    /// x = 5;
    /// for (i = 0; i < 5; i++) console.log(i);
    /// x = 5;
    /// for (; i < 5; i++) console.log(i);
    /// x = 5;
    /// switch (y) {
    /// }
    /// x = 5;
    /// with (obj) {
    /// }
    /// ```
    ///
    /// ## Output
    /// ```ts
    /// if (x = 5, y) z();
    /// for(x = 5, i = 0; i < 5; i++)console.log(i);
    /// for(x = 5; i < 5; i++)console.log(i);
    /// switch(x = 5, y){
    /// }
    /// with (x = 5, obj);
    /// ```
    pub(super) fn make_sequences<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        if !self.options.sequences {
            return;
        }

        {
            let can_work =
                stmts
                    .windows(2)
                    .any(|stmts| match (stmts[0].as_stmt(), stmts[1].as_stmt()) {
                        (Some(Stmt::Expr(..)), Some(r)) => {
                            // If an expression contains `in` and following statement is for loop,
                            // we should not merge it.

                            // TODO: Check for `in`

                            match r {
                                Stmt::Expr(..)
                                | Stmt::If(..)
                                | Stmt::Switch(..)
                                | Stmt::With(..)
                                | Stmt::Return(ReturnStmt { arg: Some(..), .. })
                                | Stmt::Throw(ThrowStmt { .. })
                                | Stmt::For(ForStmt { init: None, .. })
                                | Stmt::For(ForStmt {
                                    init: Some(VarDeclOrExpr::Expr(..)),
                                    ..
                                }) => true,
                                _ => false,
                            }
                        }
                        _ => false,
                    });

            if !can_work {
                return;
            }
        }

        log::trace!("sequences: Compressing statements as a sequences");

        self.changed = true;
        let mut exprs = vec![];
        // This is bigger than required.
        let mut new_stmts = Vec::with_capacity(stmts.len());

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => {
                    // If
                    match stmt {
                        Stmt::Expr(stmt) => {
                            exprs.push(stmt.expr);
                        }

                        Stmt::If(mut stmt) => {
                            stmt.test.prepend_exprs(take(&mut exprs));
                            new_stmts.push(T::from_stmt(Stmt::If(stmt)));
                        }

                        Stmt::Switch(mut stmt) => {
                            stmt.discriminant.prepend_exprs(take(&mut exprs));

                            new_stmts.push(T::from_stmt(Stmt::Switch(stmt)));
                        }

                        Stmt::With(mut stmt) => {
                            stmt.obj.prepend_exprs(take(&mut exprs));

                            new_stmts.push(T::from_stmt(Stmt::With(stmt)));
                        }

                        Stmt::Return(mut stmt) => {
                            stmt.arg.as_mut().unwrap().prepend_exprs(take(&mut exprs));

                            new_stmts.push(T::from_stmt(Stmt::Return(stmt)));
                        }

                        Stmt::Throw(mut stmt) => {
                            stmt.arg.prepend_exprs(take(&mut exprs));

                            new_stmts.push(T::from_stmt(Stmt::Throw(stmt)));
                        }

                        Stmt::For(mut stmt @ ForStmt { init: None, .. })
                        | Stmt::For(
                            mut
                            stmt
                            @
                            ForStmt {
                                init: Some(VarDeclOrExpr::Expr(..)),
                                ..
                            },
                        ) => {
                            match &mut stmt.init {
                                Some(VarDeclOrExpr::Expr(e)) => {
                                    e.prepend_exprs(take(&mut exprs));
                                }
                                None => {
                                    stmt.init =
                                        Some(VarDeclOrExpr::Expr(Box::new(Expr::Seq(SeqExpr {
                                            span: DUMMY_SP,
                                            exprs: take(&mut exprs),
                                        }))))
                                }
                                _ => {
                                    unreachable!()
                                }
                            }
                            new_stmts.push(T::from_stmt(Stmt::For(stmt)));
                        }

                        _ => {
                            if !exprs.is_empty() {
                                new_stmts.push(T::from_stmt(Stmt::Expr(ExprStmt {
                                    span: DUMMY_SP,
                                    expr: Box::new(Expr::Seq(SeqExpr {
                                        span: DUMMY_SP,
                                        exprs: take(&mut exprs),
                                    })),
                                })))
                            }

                            new_stmts.push(T::from_stmt(stmt));
                        }
                    }
                }
                Err(item) => {
                    if !exprs.is_empty() {
                        new_stmts.push(T::from_stmt(Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(Expr::Seq(SeqExpr {
                                span: DUMMY_SP,
                                exprs: take(&mut exprs),
                            })),
                        })))
                    }

                    new_stmts.push(item);
                }
            }
        }

        if !exprs.is_empty() {
            new_stmts.push(T::from_stmt(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: take(&mut exprs),
                })),
            })))
        }

        *stmts = new_stmts;
    }

    ///
    /// - `x = (foo(), bar(), baz()) ? 10 : 20` => `foo(), bar(), x = baz() ? 10
    ///   : 20;`
    pub(super) fn lift_seqs_of_cond_assign(&mut self, e: &mut Expr) {
        if !self.options.sequences {
            return;
        }

        let assign = match e {
            Expr::Assign(v) => v,
            _ => return,
        };

        let cond = match &mut *assign.right {
            Expr::Cond(v) => v,
            _ => return,
        };

        match &mut *cond.test {
            Expr::Seq(test) => {
                //
                if test.exprs.len() >= 2 {
                    let mut new_seq = vec![];
                    new_seq.extend(test.exprs.drain(..test.exprs.len() - 1));

                    self.changed = true;
                    log::trace!("sequences: Lifting sequences in a assignment with cond expr");
                    let new_cond = CondExpr {
                        span: cond.span,
                        test: test.exprs.pop().unwrap(),
                        cons: cond.cons.take(),
                        alt: cond.alt.take(),
                    };

                    new_seq.push(Box::new(Expr::Assign(AssignExpr {
                        span: assign.span,
                        op: assign.op,
                        left: assign.left.take(),
                        right: Box::new(Expr::Cond(new_cond)),
                    })));

                    *e = Expr::Seq(SeqExpr {
                        span: assign.span,
                        exprs: new_seq,
                    });
                    return;
                }
            }
            _ => {}
        }
    }

    pub(super) fn lift_seqs_of_assign(&mut self, e: &mut SeqExpr) {
        if !self.options.sequences {
            return;
        }

        {
            let can_work = e.exprs.iter().any(|e| {
                match &**e {
                    Expr::Assign(assign @ AssignExpr { op: op!("="), .. }) => {
                        match &*assign.right {
                            Expr::Seq(right) => {
                                if right.exprs.len() >= 2 {
                                    return true;
                                }
                            }
                            _ => {}
                        }
                    }
                    _ => {}
                }

                false
            });

            if !can_work {
                return;
            }
            log::trace!("sequences: Lifting");
            self.changed = true;
        }

        let mut new_exprs = Vec::with_capacity(e.exprs.len() * 12 / 10);

        for expr in e.exprs.take() {
            match *expr {
                Expr::Assign(assign @ AssignExpr { op: op!("="), .. }) => match *assign.right {
                    Expr::Seq(mut right) => {
                        new_exprs.extend(right.exprs.drain(..right.exprs.len() - 1));
                        new_exprs.push(Box::new(Expr::Assign(AssignExpr {
                            right: right.exprs.pop().unwrap(),
                            ..assign
                        })));
                        continue;
                    }
                    _ => {
                        new_exprs.push(Box::new(Expr::Assign(assign)));
                        continue;
                    }
                },
                _ => {}
            }

            new_exprs.push(expr);
        }

        e.exprs = new_exprs;
    }

    /// Hoist varaibles in subscope.
    ///
    /// I don't know why it depends on `sequences`.
    pub(super) fn extract_vars_in_subscopes(&mut self, s: &mut Stmt) {
        if !self.options.sequences {
            return;
        }

        match s {
            Stmt::If(stmt) if self.options.conditionals => {
                self.extract_vars(&mut stmt.cons);
                if let Some(alt) = &mut stmt.alt {
                    self.extract_vars(alt);
                }
            }

            _ => {}
        }
    }

    /// Move `var` in subscope to current scope.
    fn extract_vars(&mut self, s: &mut Stmt) {
        match s {
            Stmt::Block(bs) => {
                // Extract variables without
                'outer: for stmt in &mut bs.stmts {
                    match stmt {
                        Stmt::Decl(Decl::Var(
                            v
                            @
                            VarDecl {
                                kind: VarDeclKind::Var,
                                ..
                            },
                        )) => {
                            for decl in &mut v.decls {
                                if decl.init.is_some() {
                                    break 'outer;
                                }

                                self.prepend_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                                    span: v.span,
                                    kind: VarDeclKind::Var,
                                    declare: false,
                                    decls: vec![decl.take()],
                                })))
                            }
                        }
                        _ => break,
                    }
                }
            }
            _ => {}
        }
    }
}
