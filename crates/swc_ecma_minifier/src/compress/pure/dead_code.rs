#[cfg(feature = "concurrent")]
use rayon::prelude::*;
use swc_common::{util::take::Take, EqIgnoreSpan, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{extract_var_ids, ExprCtx, ExprExt, StmtExt, StmtLike, Value};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::Pure;
use crate::{compress::util::is_fine_for_if_cons, maybe_par, util::ModuleItemExt};

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

                            ls.body = Box::new(
                                IfStmt {
                                    span: ls.span,
                                    test,
                                    cons: Box::new(Stmt::Block(cons)),
                                    alt: None,
                                }
                                .into(),
                            );
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

                            ls.body = Box::new(
                                IfStmt {
                                    span: ls.span,
                                    test,
                                    cons: Box::new(Stmt::Block(new_cons)),
                                    alt: None,
                                }
                                .into(),
                            );
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
                if last_cs.label.is_some() {
                    if label.eq_ignore_span(&last_cs.label) {
                    } else {
                        return None;
                    }
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
        if !self.options.dead_code && !self.options.if_return {
            return;
        }

        let idx = stmts.iter().position(|stmt| match stmt.as_stmt() {
            Some(s) => s.terminates(),
            _ => false,
        });

        // TODO: let chain
        if let Some(idx) = idx {
            self.drop_duplicate_terminate(&mut stmts[..=idx]);

            // Return at the last is fine
            if idx == stmts.len() - 1 {
                return;
            }

            // If only function declarations are left, we should not proceed
            if stmts
                .iter()
                .skip(idx + 1)
                .all(|s| matches!(s.as_stmt(), Some(Stmt::Decl(Decl::Fn(_)))))
            {
                if let Some(Stmt::Return(ReturnStmt { arg: None, .. })) = stmts[idx].as_stmt() {
                    // Remove last return
                    stmts.remove(idx);
                }

                return;
            }

            self.changed = true;

            report_change!("Dropping statements after a control keyword");

            let stmts_len = stmts.len();

            // Hoist function and `var` declarations above return.
            let (decls, hoisted_fns, mut new_stmts) = stmts.iter_mut().skip(idx + 1).fold(
                (
                    Vec::with_capacity(stmts_len),
                    Vec::<T>::with_capacity(stmts_len),
                    Vec::with_capacity(stmts_len),
                ),
                |(mut decls, mut hoisted_fns, mut new_stmts), stmt| {
                    match stmt.take().try_into_stmt() {
                        Ok(Stmt::Decl(Decl::Fn(f))) => {
                            hoisted_fns.push(T::from(Stmt::from(f)));
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
                    };
                    (decls, hoisted_fns, new_stmts)
                },
            );

            if !decls.is_empty() {
                new_stmts.push(T::from(Stmt::from(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls,
                    declare: false,
                    ..Default::default()
                })));
            }

            new_stmts.extend(stmts.drain(..=idx));

            new_stmts.extend(hoisted_fns);

            *stmts = new_stmts;
        }
    }

    fn drop_duplicate_terminate<T: StmtLike>(&mut self, stmts: &mut [T]) {
        let (last, stmts) = stmts.split_last_mut().unwrap();

        let last = match last.as_stmt() {
            Some(s @ (Stmt::Break(_) | Stmt::Continue(_) | Stmt::Return(_) | Stmt::Throw(_))) => s,
            _ => return,
        };

        fn drop<T: StmtLike>(stmt: &mut T, last: &Stmt, need_break: bool, ctx: &ExprCtx) -> bool {
            match stmt.as_stmt_mut() {
                Some(s) if s.eq_ignore_span(last) => {
                    if need_break {
                        *s = BreakStmt {
                            label: None,
                            span: s.span(),
                        }
                        .into();
                    } else {
                        s.take();
                    }
                    true
                }
                Some(Stmt::If(i)) => {
                    let mut changed = false;
                    changed |= drop(&mut *i.cons, last, need_break, ctx);
                    if let Some(alt) = i.alt.as_mut() {
                        changed |= drop(&mut **alt, last, need_break, ctx);
                    }
                    changed
                }
                Some(Stmt::Try(t)) => {
                    let mut changed = false;
                    // TODO: let chain
                    if let Some(stmt) = t.block.stmts.last_mut() {
                        let side_effect = match last {
                            Stmt::Break(_) | Stmt::Continue(_) => false,
                            Stmt::Return(ReturnStmt { arg: None, .. }) => false,
                            Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => {
                                arg.may_have_side_effects(ctx)
                            }
                            Stmt::Throw(_) => true,
                            _ => unreachable!(),
                        };
                        if t.finalizer.is_none() && !side_effect {
                            changed |= drop(stmt, last, need_break, ctx)
                        }
                    }
                    if let Some(h) = t.handler.as_mut() {
                        if let Some(stmt) = h.body.stmts.last_mut() {
                            changed |= drop(stmt, last, need_break, ctx);
                        }
                    }
                    if let Some(f) = t.finalizer.as_mut() {
                        if let Some(stmt) = f.stmts.last_mut() {
                            changed |= drop(stmt, last, need_break, ctx);
                        }
                    }
                    changed
                }
                Some(Stmt::Switch(s)) if !last.is_break_stmt() && !need_break => {
                    let mut changed = false;
                    for case in s.cases.iter_mut() {
                        for stmt in case.cons.iter_mut() {
                            changed |= drop(stmt, last, true, ctx);
                        }
                    }

                    changed
                }
                Some(
                    Stmt::For(ForStmt { body, .. })
                    | Stmt::ForIn(ForInStmt { body, .. })
                    | Stmt::ForOf(ForOfStmt { body, .. })
                    | Stmt::While(WhileStmt { body, .. })
                    | Stmt::DoWhile(DoWhileStmt { body, .. }),
                ) if !last.is_break_stmt() && !last.is_continue_stmt() && !need_break => {
                    if let Stmt::Block(b) = &mut **body {
                        let mut changed = false;
                        for stmt in b.stmts.iter_mut() {
                            changed |= drop(stmt, last, true, ctx);
                        }
                        changed
                    } else {
                        drop(&mut **body, last, true, ctx)
                    }
                }
                Some(Stmt::Block(b)) => {
                    if let Some(stmt) = b.stmts.last_mut() {
                        drop(stmt, last, need_break, ctx)
                    } else {
                        false
                    }
                }
                _ => false,
            }
        }

        if let Some(before_last) = stmts.last_mut() {
            if drop(before_last, last, false, &self.expr_ctx) {
                self.changed = true;

                report_change!("Dropping control keyword in nested block");
            }
        }
    }

    pub(super) fn drop_useless_blocks<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        fn is_ok(b: &BlockStmt) -> bool {
            maybe_par!(
                b.stmts.iter().all(is_fine_for_if_cons),
                *crate::LIGHT_TASK_PARALLELS
            )
        }

        if maybe_par!(
            stmts
                .iter()
                .all(|stmt| !matches!(stmt.as_stmt(), Some(Stmt::Block(b)) if is_ok(b))),
            *crate::LIGHT_TASK_PARALLELS
        ) {
            return;
        }

        self.changed = true;
        report_change!("Dropping useless block");

        let old_stmts = stmts.take();

        let new: Vec<T> = if old_stmts.len() >= *crate::LIGHT_TASK_PARALLELS {
            #[cfg(feature = "concurrent")]
            {
                old_stmts
                    .into_par_iter()
                    .flat_map(|stmt| match stmt.try_into_stmt() {
                        Ok(v) => match v {
                            Stmt::Block(v) if is_ok(&v) => {
                                let stmts = v.stmts;
                                maybe_par!(
                                    stmts.into_iter().map(T::from).collect(),
                                    *crate::LIGHT_TASK_PARALLELS
                                )
                            }
                            _ => vec![T::from(v)],
                        },
                        Err(v) => vec![v],
                    })
                    .collect()
            }
            #[cfg(not(feature = "concurrent"))]
            {
                old_stmts
                    .into_iter()
                    .flat_map(|stmt| match stmt.try_into_stmt() {
                        Ok(v) => match v {
                            Stmt::Block(v) if is_ok(&v) => {
                                let stmts = v.stmts;
                                maybe_par!(
                                    stmts.into_iter().map(T::from).collect(),
                                    *crate::LIGHT_TASK_PARALLELS
                                )
                            }
                            _ => vec![T::from(v)],
                        },
                        Err(v) => vec![v],
                    })
                    .collect()
            }
        } else {
            let mut new = Vec::with_capacity(old_stmts.len() * 2);
            old_stmts
                .into_iter()
                .for_each(|stmt| match stmt.try_into_stmt() {
                    Ok(v) => match v {
                        Stmt::Block(v) if is_ok(&v) => {
                            new.extend(v.stmts.into_iter().map(T::from));
                        }
                        _ => new.push(T::from(v)),
                    },
                    Err(v) => new.push(v),
                });
            new
        };
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
                *s = ExprStmt {
                    span: *span,
                    expr: arg.take(),
                }
                .into();
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

        if !maybe_par!(
            stmts.iter().any(|stmt| match stmt.as_stmt() {
                Some(Stmt::If(s)) => s.test.cast_to_bool(&self.expr_ctx).1.is_known(),
                _ => false,
            }),
            *crate::LIGHT_TASK_PARALLELS
        ) {
            return;
        }

        self.changed = true;
        report_change!("dead_code: Removing dead codes");

        let mut new = Vec::with_capacity(stmts.len());
        stmts
            .take()
            .into_iter()
            .for_each(|stmt| match stmt.try_into_stmt() {
                Ok(stmt) => match stmt {
                    Stmt::If(mut s) => {
                        if let Value::Known(v) = s.test.cast_to_bool(&self.expr_ctx).1 {
                            let mut var_ids = Vec::new();
                            new.push(T::from(
                                ExprStmt {
                                    span: DUMMY_SP,
                                    expr: s.test.take(),
                                }
                                .into(),
                            ));

                            if v {
                                if let Some(alt) = s.alt.take() {
                                    var_ids = alt
                                        .extract_var_ids()
                                        .into_iter()
                                        .map(|name| VarDeclarator {
                                            span: DUMMY_SP,
                                            name: name.into(),
                                            init: None,
                                            definite: Default::default(),
                                        })
                                        .collect();
                                }
                                if !var_ids.is_empty() {
                                    new.push(T::from(
                                        VarDecl {
                                            span: DUMMY_SP,
                                            kind: VarDeclKind::Var,
                                            declare: Default::default(),
                                            decls: var_ids,
                                            ..Default::default()
                                        }
                                        .into(),
                                    ))
                                }
                                new.push(T::from(*s.cons.take()));
                            } else {
                                var_ids = s
                                    .cons
                                    .extract_var_ids()
                                    .into_iter()
                                    .map(|name| VarDeclarator {
                                        span: DUMMY_SP,
                                        name: name.into(),
                                        init: None,
                                        definite: Default::default(),
                                    })
                                    .collect();
                                if !var_ids.is_empty() {
                                    new.push(T::from(
                                        VarDecl {
                                            span: DUMMY_SP,
                                            kind: VarDeclKind::Var,
                                            declare: Default::default(),
                                            decls: var_ids,
                                            ..Default::default()
                                        }
                                        .into(),
                                    ))
                                }
                                if let Some(alt) = s.alt.take() {
                                    new.push(T::from(*alt));
                                }
                            }
                        } else {
                            new.push(T::from(s.into()));
                        }
                    }
                    _ => new.push(T::from(stmt)),
                },
                Err(stmt) => new.push(stmt),
            });

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
        if let Some(label) = &s.label {
            if label.sym == self.label.sym {
                self.found = true;
            }
        }
    }

    fn visit_continue_stmt(&mut self, s: &ContinueStmt) {
        if let Some(label) = &s.label {
            if label.sym == self.label.sym {
                self.found = true;
            }
        }
    }
}
