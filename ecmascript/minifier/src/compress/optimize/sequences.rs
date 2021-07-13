use super::Optimizer;
use crate::util::ExprOptExt;
use std::collections::HashMap;
use std::mem::take;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::{undefined, StmtLike};
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

/// Methods related to the option `sequences`. All methods are noop if
/// `sequences` is false.
impl Optimizer<'_> {
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
        if !self.options.sequences() {
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
                                })
                                | Stmt::ForIn(..)
                                | Stmt::ForOf(..) => true,
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
                            match stmt.arg.as_deref_mut() {
                                Some(e) => {
                                    e.prepend_exprs(take(&mut exprs));
                                }
                                _ => {
                                    let mut e = undefined(stmt.span);
                                    e.prepend_exprs(take(&mut exprs));

                                    stmt.arg = Some(e);
                                }
                            }

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

                        Stmt::ForIn(mut stmt) => {
                            stmt.right.prepend_exprs(take(&mut exprs));

                            new_stmts.push(T::from_stmt(Stmt::ForIn(stmt)));
                        }

                        Stmt::ForOf(mut stmt) => {
                            stmt.right.prepend_exprs(take(&mut exprs));

                            new_stmts.push(T::from_stmt(Stmt::ForOf(stmt)));
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
        if !self.options.sequences() {
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

    /// Break assignments in sequences.
    ///
    /// This may result in less parenthesis.
    pub(super) fn break_assignments_in_seqs<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        // TODO
        if true {
            return;
        }
        let need_work = stmts.iter().any(|stmt| match stmt.as_stmt() {
            Some(Stmt::Expr(e)) => match &*e.expr {
                Expr::Seq(seq) => {
                    seq.exprs.len() > 1
                        && seq.exprs.iter().all(|expr| match &**expr {
                            Expr::Assign(..) => true,
                            _ => false,
                        })
                }
                _ => false,
            },

            _ => false,
        });

        if !need_work {
            return;
        }

        let mut new_stmts = vec![];

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => match stmt {
                    Stmt::Expr(es)
                        if match &*es.expr {
                            Expr::Seq(seq) => {
                                seq.exprs.len() > 1
                                    && seq.exprs.iter().all(|expr| match &**expr {
                                        Expr::Assign(..) => true,
                                        _ => false,
                                    })
                            }
                            _ => false,
                        } =>
                    {
                        let span = es.span;
                        let seq = es.expr.seq().unwrap();
                        new_stmts.extend(
                            seq.exprs
                                .into_iter()
                                .map(|expr| ExprStmt { span, expr })
                                .map(Stmt::Expr)
                                .map(T::from_stmt),
                        );
                    }

                    _ => {
                        new_stmts.push(T::from_stmt(stmt));
                    }
                },
                Err(stmt) => {
                    new_stmts.push(stmt);
                }
            }
        }
        self.changed = true;
        log::trace!("sequences: Splitted a sequence exprssion to multiple expression statements");
        *stmts = new_stmts;
    }

    /// Lift sequence expressions in an assign expression.
    ///
    /// - `(a = (f, 4)) => (f, a = 4)`
    pub(super) fn lift_seqs_of_assign(&mut self, e: &mut SeqExpr) {
        if !self.options.sequences() {
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
        if !self.options.sequences() {
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
    ///
    /// This mehod acutally `hoist`s [VarDecl]s declared with `var`.
    fn extract_vars(&mut self, s: &mut Stmt) {
        let mut found_other = false;
        match s {
            Stmt::Block(bs) => {
                // Extract variables without
                for stmt in &mut bs.stmts {
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
                                    continue;
                                }
                                self.changed = true;
                                log::trace!("sequences: Hoisting `var` without init");
                                let s = Stmt::Decl(Decl::Var(VarDecl {
                                    span: v.span,
                                    kind: VarDeclKind::Var,
                                    declare: false,
                                    decls: vec![decl.take()],
                                }));
                                if found_other {
                                    self.append_stmts.push(s);
                                } else {
                                    self.prepend_stmts.push(s);
                                }
                            }

                            v.decls.retain(|v| !v.name.is_invalid());
                        }
                        _ => {
                            found_other = true;
                        }
                    }
                }
            }
            _ => {}
        }
    }

    /// Calls `merge_sequential_expr`.
    ///
    ///
    /// TODO(kdy1): Check for side effects and call merge_sequential_expr more
    /// if expressions between a and b are side-effect-free.
    pub(super) fn merge_sequences_in_seq_expr(&mut self, e: &mut SeqExpr) {
        for idx in 1..e.exprs.len() {
            let (a1, a2) = e.exprs.split_at_mut(idx - 1);

            if a1.is_empty() || a2.is_empty() {
                continue;
            }

            self.merge_sequential_expr(a1.last_mut().unwrap(), &mut a2[0]);
        }
    }

    /// Returns true if `a` is removed.
    fn merge_sequential_expr(&mut self, a: &mut Expr, b: &mut Expr) -> bool {
        match a {
            Expr::Assign(AssignExpr {
                op: op!("="),
                left,
                right,
                ..
            }) => {
                // (a = 5, console.log(a))
                //
                // =>
                //
                // (console.log(a = 5))

                let left_id = match left {
                    PatOrExpr::Pat(p) => match &**p {
                        Pat::Ident(i) => &i.id,
                        Pat::Expr(e) => match &**e {
                            Expr::Ident(i) => i,
                            _ => return false,
                        },
                        _ => return false,
                    },
                    PatOrExpr::Expr(e) => match &**e {
                        Expr::Ident(i) => i,
                        _ => return false,
                    },
                };

                {
                    let mut v = UsageCoutner {
                        usage: Default::default(),
                        target: left_id,
                    };
                    b.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
                    if v.usage != 1 {
                        return false;
                    }
                }

                let mut vars = HashMap::default();
                vars.insert(left_id.to_id(), right.take());
                self.inline_vars_in_node(b, vars);
                true
            }
            _ => false,
        }
    }
}

struct UsageCoutner<'a> {
    usage: usize,
    target: &'a Ident,
}

impl Visit for UsageCoutner<'_> {
    noop_visit_type!();

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        if self.target.sym == i.sym && self.target.span.ctxt == i.span.ctxt {
            self.usage += 1;
        }
    }
}
