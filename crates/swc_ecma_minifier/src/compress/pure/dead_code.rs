use swc_common::{util::take::Take, EqIgnoreSpan, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{extract_var_ids, ExprExt, StmtExt, StmtLike, Value};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::Pure;
use crate::{compress::util::is_fine_for_if_cons, util::ModuleItemExt};

/// Methods related to option `dead_code`.
impl Pure<'_> {
    ///
    ///  - Removes `L1: break L1`
    pub(super) fn drop_instant_break(&mut self, s: &mut Stmt) {
        if let Stmt::Labeled(ls) = s {
            if let Stmt::Break(BreakStmt {
                label: Some(label), ..
            }) = &*ls.body
            {
                if label.sym == ls.label.sym {
                    self.changed = true;
                    report_change!("Dropping instant break `{}`", label);
                    s.take();
                }
            }
        }
    }

    /// # Operations
    ///
    ///
    ///  - Convert if break to conditionals
    ///
    /// ```js
    /// out: {
    ///     if (foo) break out;
    ///     console.log("bar");
    /// }
    /// ```
    ///
    /// =>
    ///
    /// ```js
    /// foo || console.log("bar");
    /// ```
    pub(super) fn optimize_labeled_stmt(&mut self, s: &mut Stmt) -> Option<()> {
        if !self.options.dead_code {
            return None;
        }

        if let Stmt::Labeled(ls) = s {
            if let Stmt::Block(bs) = &mut *ls.body {
                let first = bs.stmts.first_mut()?;

                if let Stmt::If(IfStmt {
                    test,
                    cons,
                    alt: None,
                    ..
                }) = first
                {
                    if let Stmt::Break(BreakStmt {
                        label: Some(label), ..
                    }) = &**cons
                    {
                        if ls.label.sym == label.sym {
                            self.changed = true;
                            report_change!(
                                "Optimizing labeled stmt with a break to if statement: `{}`",
                                label
                            );

                            self.negate(test, true, false);
                            let test = test.take();

                            let mut cons = bs.take();
                            cons.stmts.remove(0);

                            ls.body = Box::new(Stmt::If(IfStmt {
                                span: ls.span,
                                test,
                                cons: Box::new(Stmt::Block(cons)),
                                alt: None,
                            }));
                            return None;
                        }
                    }
                }

                if let Stmt::If(IfStmt {
                    test,
                    cons,
                    alt: Some(alt),
                    ..
                }) = first
                {
                    if let Stmt::Break(BreakStmt {
                        label: Some(label), ..
                    }) = &**alt
                    {
                        if ls.label.sym == label.sym {
                            self.changed = true;
                            report_change!(
                                "Optimizing labeled stmt with a break in alt to if statement: {}",
                                ls.label
                            );

                            let test = test.take();
                            let cons = *cons.take();

                            let mut new_cons = bs.take();
                            new_cons.stmts[0] = cons;

                            ls.body = Box::new(Stmt::If(IfStmt {
                                span: ls.span,
                                test,
                                cons: Box::new(Stmt::Block(new_cons)),
                                alt: None,
                            }));
                            return None;
                        }
                    }
                }
            }
        }

        None
    }

    /// Remove the last statement of a loop if it's continue
    pub(super) fn drop_useless_continue(&mut self, s: &mut Stmt) {
        match s {
            Stmt::Labeled(ls) => {
                let new = self.drop_useless_continue_inner(Some(ls.label.clone()), &mut ls.body);
                if let Some(new) = new {
                    *s = new;
                }
            }

            _ => {
                let new = self.drop_useless_continue_inner(None, s);
                if let Some(new) = new {
                    *s = new;
                }
            }
        }
    }

    /// Returns [Some] if the whole statement should be replaced
    fn drop_useless_continue_inner(
        &mut self,
        label: Option<Ident>,
        loop_stmt: &mut Stmt,
    ) -> Option<Stmt> {
        let body = match loop_stmt {
            Stmt::While(ws) => &mut *ws.body,
            Stmt::For(fs) => &mut *fs.body,
            Stmt::ForIn(fs) => &mut *fs.body,
            Stmt::ForOf(fs) => &mut *fs.body,
            _ => return None,
        };

        if let Stmt::Block(b) = body {
            let last = b.stmts.last_mut()?;

            if let Stmt::Continue(last_cs) = last {
                match last_cs.label {
                    Some(_) => {
                        if label.eq_ignore_span(&last_cs.label) {
                        } else {
                            return None;
                        }
                    }
                    None => {}
                }
            } else {
                return None;
            }
            self.changed = true;
            report_change!("Remove useless continue (last stmt of a loop)");
            b.stmts.remove(b.stmts.len() - 1);

            if let Some(label) = &label {
                if !contains_label(b, label) {
                    return Some(loop_stmt.take());
                }
            }
        }

        None
    }

    pub(super) fn drop_unreachable_stmts<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemExt + Take,
    {
        if !self.options.dead_code {
            return;
        }

        let idx = stmts.iter().position(|stmt| match stmt.as_stmt() {
            Some(s) => s.terminates(),
            _ => false,
        });

        // TODO: let chain
        if let Some(idx) = idx {
            if idx == stmts.len() - 1 {
                return;
            }
            self.changed = true;

            report_change!("Dropping statements after a control keyword");

            let mut new_stmts = Vec::with_capacity(stmts.len());
            let mut decls = vec![];
            let mut hoisted_fns = vec![];

            // Hoist function and `var` declarations above return.
            stmts
                .iter_mut()
                .skip(idx + 1)
                .for_each(|stmt| match stmt.take().try_into_stmt() {
                    Ok(Stmt::Decl(Decl::Fn(f))) => {
                        hoisted_fns.push(Stmt::Decl(Decl::Fn(f)).into());
                    }
                    Ok(t) => {
                        let ids = extract_var_ids(&t).into_iter().map(|i| VarDeclarator {
                            span: i.span,
                            name: i.into(),
                            init: None,
                            definite: false,
                        });
                        decls.extend(ids);
                    }
                    Err(item) => new_stmts.push(item),
                });

            if !decls.is_empty() {
                new_stmts.push(
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls,
                        declare: false,
                    }))
                    .into(),
                );
            }

            new_stmts.extend(hoisted_fns);
            new_stmts.extend(stmts.drain(..=idx));

            *stmts = new_stmts;
        }
    }

    pub(super) fn drop_useless_blocks<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        fn is_ok(b: &BlockStmt) -> bool {
            b.stmts.iter().all(is_fine_for_if_cons)
        }

        if stmts
            .iter()
            .all(|stmt| !matches!(stmt.as_stmt(), Some(Stmt::Block(b)) if is_ok(b)))
        {
            return;
        }

        self.changed = true;
        report_change!("Dropping useless block");

        let mut new = vec![];
        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(v) => match v {
                    Stmt::Block(v) if is_ok(&v) => {
                        new.extend(v.stmts.into_iter().map(T::from_stmt));
                    }
                    _ => new.push(T::from_stmt(v)),
                },
                Err(v) => {
                    new.push(v);
                }
            }
        }

        *stmts = new;
    }

    pub(super) fn drop_unused_stmt_at_end_of_fn(&mut self, s: &mut Stmt) {
        if let Stmt::Return(r) = s {
            if let Some(Expr::Unary(UnaryExpr {
                span,
                op: op!("void"),
                arg,
            })) = r.arg.as_deref_mut()
            {
                report_change!("unused: Removing `return void` in end of a function");
                self.changed = true;
                *s = Stmt::Expr(ExprStmt {
                    span: *span,
                    expr: arg.take(),
                });
            }
        }
    }

    pub(super) fn remove_dead_branch<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        if !self.options.unused {
            return;
        }

        if !stmts.iter().any(|stmt| match stmt.as_stmt() {
            Some(Stmt::If(s)) => s.test.as_bool().1.is_known(),
            _ => false,
        }) {
            return;
        }

        self.changed = true;
        report_change!("dead_code: Removing dead codes");

        let mut new = vec![];

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => match stmt {
                    Stmt::If(mut s) => {
                        if let Value::Known(v) = s.test.as_bool().1 {
                            let mut var_ids = vec![];
                            new.push(T::from_stmt(Stmt::Expr(ExprStmt {
                                span: DUMMY_SP,
                                expr: s.test.take(),
                            })));

                            if v {
                                if let Some(alt) = s.alt.take() {
                                    var_ids.extend(alt.extract_var_ids().into_iter().map(|name| {
                                        VarDeclarator {
                                            span: DUMMY_SP,
                                            name: Pat::Ident(name.into()),
                                            init: None,
                                            definite: Default::default(),
                                        }
                                    }));
                                }
                                if !var_ids.is_empty() {
                                    new.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        declare: Default::default(),
                                        decls: var_ids,
                                    }))))
                                }
                                new.push(T::from_stmt(*s.cons.take()));
                            } else {
                                var_ids.extend(s.cons.extract_var_ids().into_iter().map(|name| {
                                    VarDeclarator {
                                        span: DUMMY_SP,
                                        name: Pat::Ident(name.into()),
                                        init: None,
                                        definite: Default::default(),
                                    }
                                }));
                                if !var_ids.is_empty() {
                                    new.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        declare: Default::default(),
                                        decls: var_ids,
                                    }))))
                                }
                                if let Some(alt) = s.alt.take() {
                                    new.push(T::from_stmt(*alt));
                                }
                            }
                        } else {
                            new.push(T::from_stmt(Stmt::If(s)))
                        }
                    }
                    _ => new.push(T::from_stmt(stmt)),
                },
                Err(stmt) => new.push(stmt),
            }
        }

        *stmts = new;
    }
}

fn contains_label<N>(node: &N, label: &Ident) -> bool
where
    for<'aa> N: VisitWith<LabelFinder<'aa>>,
{
    let mut v = LabelFinder {
        label,
        found: false,
    };
    node.visit_with(&mut v);
    v.found
}

struct LabelFinder<'a> {
    label: &'a Ident,
    found: bool,
}
impl Visit for LabelFinder<'_> {
    noop_visit_type!();

    fn visit_break_stmt(&mut self, s: &BreakStmt) {
        match &s.label {
            Some(label) => {
                if label.sym == self.label.sym {
                    self.found = true;
                }
            }
            None => {}
        }
    }

    fn visit_continue_stmt(&mut self, s: &ContinueStmt) {
        match &s.label {
            Some(label) => {
                if label.sym == self.label.sym {
                    self.found = true;
                }
            }
            None => {}
        }
    }
}
