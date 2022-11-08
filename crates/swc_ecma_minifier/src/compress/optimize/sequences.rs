use std::mem::take;

use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    contains_arguments, contains_this_expr, prepend_stmts, undefined, ExprExt, IdentUsageFinder,
    StmtLike,
};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};
#[cfg(feature = "debug")]
use tracing::{span, Level};

use super::{is_pure_undefined, Optimizer};
#[cfg(feature = "debug")]
use crate::debug::dump;
use crate::{
    alias::{collect_infects_from, AccessKind, AliasConfig},
    compress::{
        optimize::{unused::PropertyAccessOpts, util::replace_id_with_expr},
        util::{is_directive, is_ident_used_by, replace_expr},
    },
    mode::Mode,
    option::CompressOptions,
    util::{
        idents_used_by, idents_used_by_ignoring_nested, is_global_var_with_pure_property_access,
        ExprOptExt, ModuleItemExt,
    },
};

/// Methods related to the option `sequences`. All methods are noop if
/// `sequences` is false.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    ///
    /// # Example
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
            log_abort!("sequences: make_sequence for statements is disabled");
            return;
        }
        if self.ctx.in_asm {
            log_abort!("sequences: asm.js is not supported");
            return;
        }

        {
            let can_work =
                stmts
                    .windows(2)
                    .any(|stmts| match (stmts[0].as_stmt(), stmts[1].as_stmt()) {
                        (Some(l @ Stmt::Expr(..)), Some(r)) => {
                            if is_directive(l) || is_directive(r) {
                                return false;
                            }

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

                                Stmt::Decl(Decl::Var(v))
                                    if matches!(
                                        &**v,
                                        VarDecl {
                                            kind: VarDeclKind::Var,
                                            ..
                                        }
                                    ) =>
                                {
                                    v.decls.iter().all(|vd| vd.init.is_none())
                                }

                                Stmt::Decl(Decl::Fn(..)) => true,

                                _ => false,
                            }
                        }
                        _ => false,
                    });

            if !can_work {
                return;
            }

            if stmts.len() == 2 {
                match stmts[1].as_stmt() {
                    Some(Stmt::Decl(Decl::Var(v)))
                        if matches!(
                            &**v,
                            VarDecl {
                                kind: VarDeclKind::Var,
                                ..
                            },
                        ) =>
                    {
                        if v.decls.iter().all(|vd| vd.init.is_none()) {
                            return;
                        }
                    }

                    Some(Stmt::Decl(Decl::Fn(..))) => return,

                    _ => {}
                }
            }
        }

        report_change!("sequences: Compressing statements as a sequences");

        self.changed = true;
        let mut exprs = vec![];
        // This is bigger than required.
        let mut new_stmts = Vec::with_capacity(stmts.len());

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => {
                    if is_directive(&stmt) {
                        new_stmts.push(T::from_stmt(stmt));
                        continue;
                    }
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

                        Stmt::Return(mut stmt @ ReturnStmt { arg: Some(..), .. }) => {
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
                            mut stmt @ ForStmt {
                                init: Some(VarDeclOrExpr::Expr(..)),
                                ..
                            },
                        ) => {
                            match &mut stmt.init {
                                Some(VarDeclOrExpr::Expr(e)) => {
                                    if exprs.iter().all(|expr| {
                                        matches!(
                                            &**expr,
                                            Expr::Assign(AssignExpr { op: op!("="), .. })
                                        )
                                    }) {
                                        let ids_used_by_exprs =
                                            idents_used_by_ignoring_nested(&exprs);

                                        let ids_used_by_first_expr =
                                            idents_used_by_ignoring_nested(&*e.first_expr_mut());

                                        let has_conflict = ids_used_by_exprs
                                            .iter()
                                            .any(|id| ids_used_by_first_expr.contains(id));

                                        // I(kdy1) don't know why we need this, but terser appends
                                        // instead of prependig if initializer is (exactly)
                                        //
                                        // "identifier" = "literal".
                                        //
                                        // Note that only the form above makes terser to append.
                                        //
                                        // When I tested in by changing input multiple times, terser
                                        // seems to be aware of side effects.
                                        //
                                        // Maybe there exists an optimization related to it in v8.
                                        if let Expr::Assign(AssignExpr {
                                            op: op!("="),
                                            left,
                                            right,
                                            ..
                                        }) = e.first_expr_mut()
                                        {
                                            if !has_conflict
                                                && left.as_ident().is_some()
                                                && match &**right {
                                                    Expr::Lit(Lit::Regex(..)) => false,
                                                    Expr::Lit(..) => true,
                                                    _ => false,
                                                }
                                            {
                                                let seq = e.force_seq();
                                                let extra =
                                                    seq.exprs.drain(1..).collect::<Vec<_>>();
                                                seq.exprs.extend(take(&mut exprs));
                                                seq.exprs.extend(extra);

                                                if seq.exprs.len() == 1 {
                                                    stmt.init = Some(VarDeclOrExpr::Expr(
                                                        seq.exprs.pop().unwrap(),
                                                    ));
                                                }

                                                new_stmts.push(T::from_stmt(Stmt::For(stmt)));

                                                continue;
                                            }
                                        }
                                    }
                                    e.prepend_exprs(take(&mut exprs));
                                }
                                None => {
                                    if exprs.is_empty() {
                                        stmt.init = None;
                                    } else {
                                        stmt.init = Some(VarDeclOrExpr::Expr(Expr::from_exprs(
                                            take(&mut exprs),
                                        )))
                                    }
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

                        Stmt::Decl(Decl::Var(var))
                            if matches!(
                                &*var,
                                VarDecl {
                                    kind: VarDeclKind::Var,
                                    ..
                                }
                            ) && var.decls.iter().all(|v| v.init.is_none()) =>
                        {
                            new_stmts.push(T::from_stmt(Stmt::Decl(Decl::Var(var))));
                        }

                        Stmt::Decl(Decl::Fn(..)) => {
                            new_stmts.push(T::from_stmt(stmt));
                        }

                        _ => {
                            if !exprs.is_empty() {
                                new_stmts.push(T::from_stmt(Stmt::Expr(ExprStmt {
                                    span: DUMMY_SP,
                                    expr: Expr::from_exprs(take(&mut exprs)),
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
                            expr: Expr::from_exprs(take(&mut exprs)),
                        })))
                    }

                    new_stmts.push(item);
                }
            }
        }

        if !exprs.is_empty() {
            new_stmts.push(T::from_stmt(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Expr::from_exprs(take(&mut exprs)),
            })))
        }

        *stmts = new_stmts;
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
                        && seq.exprs.iter().all(|expr| {
                            matches!(&**expr, Expr::Assign(AssignExpr { op: op!("="), .. }))
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
                                    && seq.exprs.iter().all(|expr| {
                                        matches!(
                                            &**expr,
                                            Expr::Assign(AssignExpr { op: op!("="), .. })
                                        )
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
        report_change!(
            "sequences: Splitted a sequence expression to multiple expression statements"
        );
        *stmts = new_stmts;
    }

    /// Lift sequence expressions in an assign expression.
    ///
    /// - `(a = (f, 4)) => (f, a = 4)`
    pub(super) fn lift_seqs_of_assign(&mut self, e: &mut Expr) {
        if !self.options.sequences() {
            return;
        }

        if let Expr::Assign(AssignExpr {
            op: op!("="),
            left,
            right,
            span,
        }) = e
        {
            if let (Some(id), Expr::Seq(seq)) = (left.as_ident(), &mut **right) {
                if id.span.ctxt == self.expr_ctx.unresolved_ctxt {
                    return;
                }
                // Do we really need this?
                if seq.exprs.is_empty() || seq.exprs.len() <= 1 {
                    return;
                }
                report_change!("sequences: Lifting Assign");
                self.changed = true;
                if let Some(last) = seq.exprs.last_mut() {
                    **last = Expr::Assign(AssignExpr {
                        span: *span,
                        op: op!("="),
                        left: left.take(),
                        right: last.take(),
                    })
                }

                *e = *right.take()
            }
        }
    }

    #[allow(unused)]
    pub(super) fn optimize_with_extras<T, F>(&mut self, stmts: &mut Vec<T>, mut op: F)
    where
        F: FnMut(&mut Vec<T>),
        T: ModuleItemExt,
    {
        let old_prepend = self.prepend_stmts.take();
        let old_append = self.append_stmts.take();

        op(stmts);

        if !self.prepend_stmts.is_empty() {
            prepend_stmts(stmts, self.prepend_stmts.drain(..).map(T::from_stmt));
        }

        if !self.append_stmts.is_empty() {
            stmts.extend(self.append_stmts.drain(..).map(T::from_stmt));
        }

        self.prepend_stmts = old_prepend;
        self.append_stmts = old_append;
    }

    ///
    /// - `(path += 'foo', path)` => `(path += 'foo')`
    pub(super) fn shift_assignment(&mut self, e: &mut SeqExpr) {
        if e.exprs.len() < 2 {
            return;
        }

        if let Some(last) = e.exprs.last() {
            let last_id = match &**last {
                Expr::Ident(i) => i,
                _ => return,
            };

            if let Expr::Assign(assign @ AssignExpr { op: op!("="), .. }) =
                &*e.exprs[e.exprs.len() - 2]
            {
                if let Some(lhs) = assign.left.as_ident() {
                    if lhs.sym == last_id.sym && lhs.span.ctxt == last_id.span.ctxt {
                        e.exprs.pop();
                        self.changed = true;
                        report_change!("sequences: Shifting assignment");
                    }
                };
            }
        }
    }

    pub(super) fn shift_void(&mut self, e: &mut SeqExpr) {
        if e.exprs.len() < 2 {
            return;
        }

        if let Expr::Unary(UnaryExpr {
            op: op!("void"), ..
        }) = &*e.exprs[e.exprs.len() - 2]
        {
            return;
        }

        if let Some(last) = e.exprs.last() {
            if is_pure_undefined(&self.expr_ctx, last) {
                self.changed = true;
                report_change!("sequences: Shifting void");

                e.exprs.pop();
                let last = e.exprs.last_mut().unwrap();

                *last = Box::new(Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("void"),
                    arg: last.take(),
                }))
            }
        }
    }

    fn seq_exprs_of<'a>(
        &mut self,
        s: &'a mut Stmt,
        options: &CompressOptions,
    ) -> Option<Vec<Mergable<'a>>> {
        Some(match s {
            Stmt::Expr(e) => vec![Mergable::Expr(&mut e.expr)],
            Stmt::Decl(Decl::Var(v))
                if matches!(
                    &**v,
                    VarDecl {
                        kind: VarDeclKind::Var | VarDeclKind::Let,
                        ..
                    }
                ) =>
            {
                if options.reduce_vars || options.collapse_vars {
                    v.decls.iter_mut().map(Mergable::Var).collect()
                } else {
                    return None;
                }
            }
            Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => {
                vec![Mergable::Expr(arg)]
            }

            Stmt::If(s) if options.sequences() => {
                vec![Mergable::Expr(&mut s.test)]
            }

            Stmt::Switch(s) if options.sequences() => {
                vec![Mergable::Expr(&mut s.discriminant)]
            }

            Stmt::For(s) if options.sequences() => {
                if let Some(VarDeclOrExpr::Expr(e)) = &mut s.init {
                    vec![Mergable::Expr(e)]
                } else {
                    return None;
                }
            }

            Stmt::ForOf(s) if options.sequences() => {
                vec![Mergable::Expr(&mut s.right)]
            }

            Stmt::ForIn(s) if options.sequences() => {
                vec![Mergable::Expr(&mut s.right)]
            }

            Stmt::Throw(s) if options.sequences() => {
                vec![Mergable::Expr(&mut s.arg)]
            }

            Stmt::Decl(Decl::Fn(f)) => {
                // Check for side effects

                vec![Mergable::FnDecl(f)]
            }

            _ => return None,
        })
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn merge_sequences_in_stmts<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: ModuleItemExt,
    {
        if !self.options.sequences() && !self.options.collapse_vars {
            log_abort!("sequences: [x] Disabled");
            return;
        }

        if self.ctx.is_top_level_for_block_level_vars() && !self.options.top_level() {
            log_abort!("sequences: [x] Top level");
            return;
        }

        if self.data.scopes.get(&self.ctx.scope).unwrap().has_eval_call {
            log_abort!("sequences: Eval call");
            return;
        }

        let mut exprs = vec![];
        let mut buf = vec![];

        for stmt in stmts.iter_mut() {
            let is_end = matches!(
                stmt.as_stmt(),
                Some(
                    Stmt::If(..)
                        | Stmt::Throw(..)
                        | Stmt::Return(..)
                        | Stmt::Switch(..)
                        | Stmt::For(..)
                        | Stmt::ForIn(..)
                        | Stmt::ForOf(..)
                ) | None
            );
            let can_skip = match stmt.as_stmt() {
                Some(Stmt::Decl(Decl::Fn(..))) => true,
                _ => false,
            };

            let items = if let Some(stmt) = stmt.as_stmt_mut() {
                self.seq_exprs_of(stmt, self.options)
            } else {
                None
            };
            if let Some(items) = items {
                buf.extend(items)
            } else {
                exprs.push(take(&mut buf));

                if !can_skip {
                    continue;
                }
            }
            if is_end {
                exprs.push(take(&mut buf));
            }
        }

        exprs.push(buf);

        #[cfg(feature = "debug")]
        let _tracing = {
            let buf_len = exprs.iter().map(|v| v.len()).collect::<Vec<_>>();
            Some(
                tracing::span!(
                    Level::TRACE,
                    "merge_sequences_in_stmts",
                    items_len = tracing::field::debug(&buf_len)
                )
                .entered(),
            )
        };

        for mut exprs in exprs {
            let _ = self.merge_sequences_in_exprs(&mut exprs);
        }

        stmts.retain_mut(|stmt| {
            if let Some(Stmt::Expr(es)) = stmt.as_stmt_mut() {
                if let Expr::Seq(e) = &mut *es.expr {
                    e.exprs.retain(|e| !e.is_invalid());
                    if e.exprs.len() == 1 {
                        es.expr = e.exprs.pop().unwrap();
                        return true;
                    }
                }
            }

            match stmt.as_stmt_mut() {
                Some(Stmt::Decl(Decl::Var(v))) => {
                    v.decls.retain(|decl| {
                        // We dropped variable declarations using sequential inlining
                        if matches!(decl.name, Pat::Invalid(..)) {
                            return false;
                        }
                        !matches!(decl.init.as_deref(), Some(Expr::Invalid(..)))
                    });

                    !v.decls.is_empty()
                }
                Some(Stmt::Decl(Decl::Fn(f))) => !f.ident.is_dummy(),
                Some(Stmt::Expr(s)) if s.expr.is_invalid() => false,

                _ => true,
            }
        });
    }

    pub(super) fn normalize_sequences(&self, seq: &mut SeqExpr) {
        for e in &mut seq.exprs {
            if let Expr::Seq(e) = &mut **e {
                self.normalize_sequences(&mut *e);
            }
        }

        if seq.exprs.iter().any(|v| v.is_seq()) {
            let mut new = vec![];

            for e in seq.exprs.take() {
                match *e {
                    Expr::Seq(s) => {
                        new.extend(s.exprs);
                    }
                    _ => new.push(e),
                }
            }

            seq.exprs = new;
        }
    }

    pub(super) fn merge_sequences_in_seq_expr(&mut self, e: &mut SeqExpr) {
        self.normalize_sequences(e);

        if self.data.scopes.get(&self.ctx.scope).unwrap().has_eval_call {
            log_abort!("sequences: Eval call");
            return;
        }

        #[cfg(feature = "debug")]
        let _tracing = {
            let e_str = dump(&*e, false);

            Some(
                span!(
                    Level::ERROR,
                    "merge_sequences_in_seq_expr",
                    seq_expr = &*e_str
                )
                .entered(),
            )
        };

        if !self.options.sequences()
            && !self.options.collapse_vars
            && !e.span.has_mark(self.marks.synthesized_seq)
        {
            log_abort!("sequences: Disabled && no mark");
            return;
        }

        let mut exprs = e
            .exprs
            .iter_mut()
            .map(|e| &mut **e)
            .map(Mergable::Expr)
            .collect();

        let _ = self.merge_sequences_in_exprs(&mut exprs);

        // As we don't have Mergable::Var here, we don't need to check for dropped
        // variables.

        e.exprs.retain(|e| !e.is_invalid());
    }

    /// Calls `merge_sequential_expr`.
    ///
    ///
    /// TODO(kdy1): Check for side effects and call merge_sequential_expr more
    /// if expressions between a and b are side-effect-free.
    fn merge_sequences_in_exprs(&mut self, exprs: &mut Vec<Mergable>) -> Result<(), ()> {
        #[cfg(feature = "debug")]
        let _tracing = {
            Some(
                tracing::span!(Level::TRACE, "merge_sequences_in_exprs", len = exprs.len())
                    .entered(),
            )
        };

        loop {
            let mut did_work = false;

            for idx in 0..exprs.len() {
                for j in idx..exprs.len() {
                    let (a1, a2) = exprs.split_at_mut(idx);

                    if a1.is_empty() || a2.is_empty() {
                        break;
                    }

                    let a = a1.last_mut().unwrap();

                    if self.options.unused && self.options.sequences() {
                        if let (Mergable::Var(av), Mergable::Var(bv)) = (&mut *a, &mut a2[j - idx])
                        {
                            // We try dropping variable assignments first.

                            // Currently, we only drop variable declarations if they have the same
                            // name.
                            if let (Pat::Ident(an), Pat::Ident(bn)) = (&av.name, &bv.name) {
                                if an.to_id() == bn.to_id() {
                                    // We need to preserve side effect of `av.init`

                                    match bv.init.as_deref_mut() {
                                        Some(b_init) => {
                                            if IdentUsageFinder::find(&an.to_id(), b_init) {
                                                log_abort!(
                                                    "We can't duplicated binding because \
                                                     initializer uses the previous declaration of \
                                                     the variable"
                                                );
                                                break;
                                            }

                                            if let Some(a_init) = av.init.take() {
                                                let b_seq = b_init.force_seq();
                                                b_seq.exprs.insert(0, a_init);

                                                self.changed = true;
                                                report_change!(
                                                    "Moving initializer sequentially as they have \
                                                     a same name"
                                                );
                                                av.name.take();
                                                continue;
                                            } else {
                                                self.changed = true;
                                                report_change!(
                                                    "Dropping the previous var declaration of {} \
                                                     which does not have an initializer",
                                                    an.id
                                                );
                                                av.name.take();
                                                continue;
                                            }
                                        }
                                        None => {
                                            // As variable name is same, we can move initializer

                                            // Th code below
                                            //
                                            //      var a = 5;
                                            //      var a;
                                            //
                                            //      console.log(a)
                                            //
                                            // prints 5
                                            bv.init = av.init.take();
                                            self.changed = true;
                                            report_change!(
                                                "Moving initializer to the next variable \
                                                 declaration as they have the same name"
                                            );
                                            av.name.take();
                                            continue;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Merge sequentially

                    if self.merge_sequential_expr(
                        a,
                        match &mut a2[j - idx] {
                            Mergable::Var(b) => match b.init.as_deref_mut() {
                                Some(v) => v,
                                None => continue,
                            },
                            Mergable::Expr(e) => e,
                            Mergable::FnDecl(..) => continue,
                        },
                    )? {
                        did_work = true;
                        break;
                    }

                    // This logic is required to handle
                    //
                    // var b;
                    // (function () {
                    //     function f() {
                    //         a++;
                    //     }
                    //     f();
                    //     var c = f();
                    //     var a = void 0;
                    //     c || (b = a);
                    // })();
                    // console.log(b);
                    //
                    //
                    // at the code above, c cannot be shifted to `c` in `c || (b = a)`
                    //

                    match a {
                        Mergable::Var(VarDeclarator {
                            init: Some(init), ..
                        }) => {
                            if !self.is_skippable_for_seq(None, init) {
                                break;
                            }
                        }
                        Mergable::Expr(Expr::Assign(a)) => {
                            if let Some(a) = a.left.as_expr() {
                                if !self.is_skippable_for_seq(None, a) {
                                    break;
                                }
                            }

                            if !self.is_skippable_for_seq(None, &a.right) {
                                break;
                            }
                        }

                        _ => {}
                    }

                    match &a2[j - idx] {
                        Mergable::Var(e2) => {
                            if let Some(e2) = &e2.init {
                                if !self.is_skippable_for_seq(Some(a), e2) {
                                    break;
                                }
                            }

                            if let Some(id) = a1.last_mut().unwrap().id() {
                                if IdentUsageFinder::find(&id, &**e2) {
                                    break;
                                }
                            }
                        }
                        Mergable::Expr(e2) => {
                            if !self.is_skippable_for_seq(Some(a), e2) {
                                break;
                            }

                            if let Some(id) = a1.last_mut().unwrap().id() {
                                // TODO(kdy1): Optimize
                                if IdentUsageFinder::find(&id, &**e2) {
                                    break;
                                }
                            }
                        }

                        // Function declaration is side-effect free.
                        //
                        // TODO(kdy1): Paramters with default value can have side effect. But this
                        // is very unrealistic in real-world code, so I'm
                        // postponing handling for it.
                        Mergable::FnDecl(f) => {
                            if f.function
                                .params
                                .iter()
                                .any(|p| !self.is_pat_skippable_for_seq(Some(a), &p.pat))
                            {
                                break;
                            }
                        }
                    }
                }
            }

            if !did_work {
                break;
            }
        }

        Ok(())
    }

    fn is_pat_skippable_for_seq(&mut self, a: Option<&Mergable>, p: &Pat) -> bool {
        match p {
            Pat::Ident(_) => true,
            Pat::Invalid(_) => false,

            Pat::Array(p) => {
                for elem in p.elems.iter().flatten() {
                    if !self.is_pat_skippable_for_seq(a, elem) {
                        return false;
                    }
                }

                true
            }
            Pat::Rest(p) => {
                if !self.is_pat_skippable_for_seq(a, &p.arg) {
                    return false;
                }

                true
            }
            Pat::Object(p) => {
                for prop in &p.props {
                    match prop {
                        ObjectPatProp::KeyValue(KeyValuePatProp { value, key, .. }) => {
                            if let PropName::Computed(key) = key {
                                if !self.is_skippable_for_seq(a, &key.expr) {
                                    return false;
                                }
                            }

                            if !self.is_pat_skippable_for_seq(a, value) {
                                return false;
                            }
                        }
                        ObjectPatProp::Assign(AssignPatProp { .. }) => return false,
                        ObjectPatProp::Rest(RestPat { arg, .. }) => {
                            if !self.is_pat_skippable_for_seq(a, arg) {
                                return false;
                            }
                        }
                    }
                }

                true
            }
            Pat::Assign(..) => false,
            Pat::Expr(e) => self.is_skippable_for_seq(a, e),
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn is_skippable_for_seq(&self, a: Option<&Mergable>, e: &Expr) -> bool {
        if self.ctx.in_try_block {
            log_abort!("try block");
            return false;
        }

        trace_op!("is_skippable_for_seq");

        match e {
            Expr::Ident(e) => {
                if e.span.ctxt == self.expr_ctx.unresolved_ctxt
                    && !is_global_var_with_pure_property_access(&e.sym)
                {
                    log_abort!("Undeclared");
                    return false;
                }

                if let Some(a) = a {
                    match a {
                        Mergable::Var(a) => {
                            if is_ident_used_by(e.to_id(), &a.init) {
                                log_abort!("ident used by a (var)");
                                return false;
                            }
                        }
                        Mergable::Expr(a) => {
                            if is_ident_used_by(e.to_id(), &**a) {
                                log_abort!("ident used by a (expr)");
                                return false;
                            }
                        }

                        Mergable::FnDecl(a) => {
                            // TODO(kdy1): I'm not sure if we can remove this check. I added this
                            // just to be safe, and we may remove this check in future.
                            if is_ident_used_by(e.to_id(), &**a) {
                                log_abort!("ident used by a (fn)");
                                return false;
                            }
                        }
                    }

                    // We can't proceed if the rhs (a.id = b.right) is
                    // initialized with an initializer
                    // (a.right) which has a side effect for pc (b.left)
                    //
                    // ```js
                    // 
                    //  function f(x) {
                    //      pc = 200;
                    //      return 100;
                    //  }
                    //  function x() {
                    //      var t = f();
                    //      pc += t;
                    //      return pc;
                    //  }
                    //  var pc = 0;
                    //  console.log(x());
                    // ```
                    //
                    let ids_used_by_a_init = match a {
                        Mergable::Var(a) => a.init.as_ref().map(|init| {
                            collect_infects_from(
                                init,
                                AliasConfig {
                                    marks: Some(self.marks),
                                    ignore_nested: true,
                                    need_all: true,
                                },
                            )
                        }),
                        Mergable::Expr(a) => match a {
                            Expr::Assign(AssignExpr {
                                left,
                                right,
                                op: op!("="),
                                ..
                            }) => {
                                if left.as_ident().is_some() {
                                    Some(collect_infects_from(
                                        right,
                                        AliasConfig {
                                            marks: Some(self.marks),
                                            ignore_nested: true,
                                            need_all: true,
                                        },
                                    ))
                                } else {
                                    None
                                }
                            }

                            _ => None,
                        },

                        Mergable::FnDecl(a) => Some(collect_infects_from(
                            &a.function,
                            AliasConfig {
                                marks: Some(self.marks),
                                ignore_nested: true,
                                need_all: true,
                            },
                        )),
                    };

                    if let Some(ids_used_by_a_init) = ids_used_by_a_init {
                        let deps =
                            self.data
                                .expand_infected(self.module_info, ids_used_by_a_init, 64);

                        let deps = match deps {
                            Ok(v) => v,
                            Err(()) => return false,
                        };
                        if deps.contains(&(e.to_id(), AccessKind::Reference))
                            || deps.contains(&(e.to_id(), AccessKind::Call))
                        {
                            return false;
                        }
                    }
                }

                true
            }

            Expr::Member(MemberExpr { obj, prop, .. }) => {
                if !self.should_preserve_property_access(
                    obj,
                    PropertyAccessOpts {
                        allow_getter: false,
                        only_ident: false,
                    },
                ) {
                    if let MemberProp::Computed(prop) = prop {
                        if !self.is_skippable_for_seq(a, &prop.expr) {
                            return false;
                        }
                    }

                    return true;
                }

                false
            }

            Expr::Lit(..) => true,

            Expr::Yield(..) | Expr::Await(..) => false,

            Expr::Unary(UnaryExpr {
                op: op!("!") | op!("void") | op!("typeof") | op!(unary, "-") | op!(unary, "+"),
                arg,
                ..
            }) => self.is_skippable_for_seq(a, arg),

            Expr::Bin(BinExpr { left, right, .. }) => {
                self.is_skippable_for_seq(a, left) && self.is_skippable_for_seq(a, right)
            }

            Expr::Cond(CondExpr {
                test, cons, alt, ..
            }) => {
                self.is_skippable_for_seq(a, test)
                    && self.is_skippable_for_seq(a, cons)
                    && self.is_skippable_for_seq(a, alt)
            }

            Expr::Assign(e) => {
                let left_id = e.left.as_ident();
                let left_id = match left_id {
                    Some(v) => v,
                    _ => {
                        log_abort!("e.left is not ident");
                        return false;
                    }
                };

                if let Some(a) = a {
                    match a {
                        Mergable::Var(a) => {
                            if is_ident_used_by(left_id.to_id(), &**a) {
                                log_abort!("e.left is used by a (var)");
                                return false;
                            }
                        }
                        Mergable::Expr(a) => {
                            if is_ident_used_by(left_id.to_id(), &**a) {
                                log_abort!("e.left is used by a (expr)");
                                return false;
                            }
                        }
                        Mergable::FnDecl(a) => {
                            // TODO(kdy1): I'm not sure if this check is required.
                            if is_ident_used_by(left_id.to_id(), &**a) {
                                log_abort!("e.left is used by a ()");
                                return false;
                            }
                        }
                    }
                }

                if !self.is_skippable_for_seq(a, &Expr::Ident(left_id.clone())) {
                    return false;
                }

                if let Expr::Lit(..) = &*e.right {
                    return true;
                }

                if contains_this_expr(&*e.right) {
                    log_abort!("e.right contains this");
                    return false;
                }

                let used_ids = idents_used_by(&*e.right);
                if used_ids.is_empty() {
                    return true;
                }

                if used_ids.len() != 1 || !used_ids.contains(&left_id.to_id()) {
                    log_abort!("bad used_ids");
                    return false;
                }

                self.is_skippable_for_seq(a, &e.right)
            }

            Expr::Object(e) => {
                if e.props.is_empty() {
                    return true;
                }

                for p in &e.props {
                    match p {
                        PropOrSpread::Spread(_) => return false,
                        PropOrSpread::Prop(p) => match &**p {
                            Prop::Shorthand(i) => {
                                if !self.is_skippable_for_seq(a, &Expr::Ident(i.clone())) {
                                    return false;
                                }
                            }
                            Prop::KeyValue(kv) => {
                                if let PropName::Computed(key) = &kv.key {
                                    if !self.is_skippable_for_seq(a, &key.expr) {
                                        return false;
                                    }
                                }

                                if !self.is_skippable_for_seq(a, &kv.value) {
                                    return false;
                                }
                            }
                            Prop::Assign(_) => {
                                log_abort!("assign property");
                                return false;
                            }
                            _ => {
                                log_abort!("handler is not implemented for this kind of property");
                                return false;
                            }
                        },
                    }
                }

                // TODO: Check for side effects in object properties.

                true
            }

            Expr::Array(e) => {
                for elem in e.elems.iter().flatten() {
                    if !self.is_skippable_for_seq(a, &elem.expr) {
                        log_abort!("array element");
                        return false;
                    }
                }

                true
            }

            Expr::Call(e) => {
                if e.args.is_empty() {
                    if let Callee::Expr(callee) = &e.callee {
                        if let Expr::Fn(callee) = &**callee {
                            let ids = idents_used_by(&callee.function);

                            if ids
                                .iter()
                                .all(|id| id.1.outer() == self.marks.unresolved_mark)
                            {
                                return true;
                            }
                        }
                    }
                }

                if let Callee::Expr(callee) = &e.callee {
                    if callee.is_pure_callee(&self.expr_ctx) {
                        if !self.is_skippable_for_seq(a, callee) {
                            return false;
                        }

                        for arg in &e.args {
                            if !self.is_skippable_for_seq(a, &arg.expr) {
                                return false;
                            }
                        }

                        return true;
                    }
                }

                false
            }

            Expr::Seq(SeqExpr { exprs, .. }) => {
                exprs.iter().all(|e| self.is_skippable_for_seq(a, e))
            }

            Expr::TaggedTpl(..) | Expr::New(..) => {
                // TODO(kdy1): We can optimize some known calls.

                false
            }

            Expr::Tpl(Tpl { exprs, .. }) => exprs.iter().all(|e| self.is_skippable_for_seq(a, e)),

            // Expressions without any effects
            Expr::This(_)
            | Expr::Fn(_)
            | Expr::MetaProp(_)
            | Expr::Arrow(_)
            | Expr::PrivateName(_) => true,

            Expr::Update(..) => false,
            Expr::SuperProp(..) => false,
            Expr::Class(_) => e.may_have_side_effects(&self.expr_ctx),

            Expr::Paren(e) => self.is_skippable_for_seq(a, &e.expr),
            Expr::Unary(e) => self.is_skippable_for_seq(a, &e.arg),

            Expr::OptChain(OptChainExpr { base, .. }) => match base {
                OptChainBase::Member(e) => {
                    if !self.should_preserve_property_access(
                        &e.obj,
                        PropertyAccessOpts {
                            allow_getter: false,
                            only_ident: false,
                        },
                    ) {
                        if let MemberProp::Computed(prop) = &e.prop {
                            if !self.is_skippable_for_seq(a, &prop.expr) {
                                return false;
                            }
                        }

                        return true;
                    }

                    false
                }
                OptChainBase::Call(e) => {
                    if e.callee.is_pure_callee(&self.expr_ctx) {
                        if !self.is_skippable_for_seq(a, &e.callee) {
                            return false;
                        }

                        for arg in &e.args {
                            if !self.is_skippable_for_seq(a, &arg.expr) {
                                return false;
                            }
                        }

                        return true;
                    }

                    false
                }
            },

            Expr::Invalid(_) => true,

            Expr::JSXMember(_)
            | Expr::JSXNamespacedName(_)
            | Expr::JSXEmpty(_)
            | Expr::JSXElement(_)
            | Expr::JSXFragment(_)
            | Expr::TsTypeAssertion(_)
            | Expr::TsConstAssertion(_)
            | Expr::TsNonNull(_)
            | Expr::TsAs(_)
            | Expr::TsInstantiation(_)
            | Expr::TsSatisfies(_) => false,
        }
    }

    /// Returns true if something is modified.
    ///
    /// Returns [Err] iff we should stop checking.
    fn merge_sequential_expr(&mut self, a: &mut Mergable, b: &mut Expr) -> Result<bool, ()> {
        #[cfg(feature = "debug")]
        let _tracing = {
            let b_str = dump(&*b, false);
            let a = match a {
                Mergable::Expr(e) => dump(*e, false),
                Mergable::Var(e) => dump(*e, false),
                Mergable::FnDecl(e) => dump(*e, false),
            };

            Some(
                span!(
                    Level::ERROR,
                    "merge_sequential_expr",
                    a = tracing::field::debug(&a),
                    b = &*b_str
                )
                .entered(),
            )
        };

        if b.is_lit() || b.is_class() || b.is_fn_expr() || b.is_arrow() {
            return Ok(false);
        }

        match a {
            Mergable::Var(..) | Mergable::FnDecl(..) => {}
            Mergable::Expr(a) => {
                if let Expr::Seq(a) = a {
                    for a in a.exprs.iter_mut().rev() {
                        if self.merge_sequential_expr(&mut Mergable::Expr(a), b)? {
                            return Ok(true);
                        }

                        if !self.is_skippable_for_seq(None, a) {
                            return Ok(false);
                        }

                        if a.may_have_side_effects(&self.expr_ctx) {
                            return Ok(false);
                        }
                    }

                    return Ok(false);
                }
            }
        }

        {
            // Fast path, before digging into `b`

            match a {
                Mergable::Var(a) => {
                    // We only inline identifiers
                    if !a.name.is_ident() {
                        return Ok(false);
                    }
                }
                Mergable::Expr(a) => match a {
                    Expr::Assign(a) => {
                        // We only inline identifiers
                        if a.left.as_ident().is_none() {
                            return Ok(false);
                        }
                    }

                    // We don't handle this currently, but we will.
                    Expr::Update(a) => {
                        if !a.arg.is_ident() {
                            return Ok(false);
                        }
                    }

                    _ => {
                        // if a is not a modification, we can skip it
                        return Ok(false);
                    }
                },

                Mergable::FnDecl(..) => {
                    // A function declaration is always inlinable as it can be
                    // viewed as a variable with an identifier name and a
                    // function expression as a initialized.
                }
            }
        }

        match b {
            Expr::Update(..) | Expr::Arrow(..) | Expr::Fn(..) => return Ok(false),

            Expr::Cond(b) => {
                trace_op!("seq: Try test of cond");
                return self.merge_sequential_expr(a, &mut b.test);
            }

            Expr::Unary(b) => {
                trace_op!("seq: Try arg of unary");
                return self.merge_sequential_expr(a, &mut b.arg);
            }

            Expr::Bin(BinExpr {
                op, left, right, ..
            }) => {
                trace_op!("seq: Try left of bin");
                if self.merge_sequential_expr(a, left)? {
                    return Ok(true);
                }

                if !self.is_skippable_for_seq(Some(a), left) {
                    return Ok(false);
                }

                if op.may_short_circuit() {
                    return Ok(false);
                }

                trace_op!("seq: Try right of bin");
                return self.merge_sequential_expr(a, right);
            }

            Expr::Member(MemberExpr { obj, prop, .. }) if !prop.is_computed() => {
                trace_op!("seq: Try object of member");
                return self.merge_sequential_expr(a, obj);
            }

            Expr::Member(MemberExpr {
                obj,
                prop: MemberProp::Computed(c),
                ..
            }) => {
                trace_op!("seq: Try object of member (computed)");
                if self.merge_sequential_expr(a, obj)? {
                    return Ok(true);
                }

                if obj.may_have_side_effects(&self.expr_ctx) {
                    return Ok(false);
                }

                trace_op!("seq: Try prop of member (computed)");
                return self.merge_sequential_expr(a, &mut c.expr);
            }

            Expr::SuperProp(SuperPropExpr {
                prop: SuperProp::Computed(c),
                ..
            }) => {
                trace_op!("seq: Try prop of member (computed)");
                return self.merge_sequential_expr(a, &mut c.expr);
            }

            Expr::Assign(b @ AssignExpr { op: op!("="), .. }) => {
                match &mut b.left {
                    PatOrExpr::Expr(b_left) => {
                        trace_op!("seq: Try lhs of assign");
                        if self.merge_sequential_expr(a, b_left)? {
                            return Ok(true);
                        }

                        match &**b_left {
                            Expr::Ident(..) => {}

                            _ => {
                                return Ok(false);
                            }
                        }
                    }
                    PatOrExpr::Pat(b_left) => match &mut **b_left {
                        Pat::Expr(b_left) => {
                            trace_op!("seq: Try lhs of assign");
                            if self.merge_sequential_expr(a, b_left)? {
                                return Ok(true);
                            }

                            match &**b_left {
                                Expr::Ident(..) => {}
                                _ => {
                                    return Ok(false);
                                }
                            }
                        }
                        Pat::Ident(..) => {}
                        _ => return Ok(false),
                    },
                }

                if self.should_not_check_rhs_of_assign(a, b)? {
                    return Ok(false);
                }

                trace_op!("seq: Try rhs of assign");
                return self.merge_sequential_expr(a, &mut b.right);
            }

            Expr::Assign(b_assign) => {
                if self.should_not_check_rhs_of_assign(a, b_assign)? {
                    return Ok(false);
                }

                let b_left = b_assign.left.as_ident();
                let b_left = match b_left {
                    Some(v) => v.clone(),
                    None => return Ok(false),
                };

                if !self.is_skippable_for_seq(Some(a), &Expr::Ident(b_left.clone())) {
                    // Let's be safe
                    if IdentUsageFinder::find(&b_left.to_id(), &b_assign.right) {
                        return Ok(false);
                    }

                    // As we are not *skipping* lhs, we can inline here
                    if let Some(a_id) = a.id() {
                        if a_id == b_left.to_id() {
                            if self.replace_seq_assignment(a, b)? {
                                return Ok(true);
                            }
                        }
                    }

                    return Ok(false);
                }

                if IdentUsageFinder::find(&b_left.to_id(), &b_assign.right) {
                    return Err(());
                }

                if let Some(a_id) = a.id() {
                    if a_id == b_left.to_id() {
                        if self.replace_seq_assignment(a, b)? {
                            return Ok(true);
                        }
                    }
                }

                // Hack for lifetime of mutable borrow
                match b {
                    Expr::Assign(b) => {
                        trace_op!("seq: Try rhs of assign with op");
                        return self.merge_sequential_expr(a, &mut b.right);
                    }
                    _ => unreachable!(),
                }
            }

            Expr::Array(b) => {
                for elem in &mut b.elems {
                    match elem {
                        Some(elem) => {
                            trace_op!("seq: Try element of array");
                            if self.merge_sequential_expr(a, &mut elem.expr)? {
                                return Ok(true);
                            }

                            if !self.is_skippable_for_seq(Some(a), &elem.expr) {
                                // To preserve side-effects, we need to abort.
                                break;
                            }
                        }
                        None => {}
                    }
                }

                return Ok(false);
            }

            Expr::Call(CallExpr {
                callee: Callee::Expr(b_callee),
                args: b_args,
                ..
            }) => {
                let is_this_undefined = b_callee.is_ident();
                trace_op!("seq: Try callee of call");

                if let Expr::Member(MemberExpr { obj, .. }) = &**b_callee {
                    if let Expr::Ident(obj) = &**obj {
                        let callee_id = obj.to_id();

                        if let Mergable::Expr(Expr::Update(UpdateExpr { arg, .. })) = a {
                            if let Expr::Ident(arg) = &**arg {
                                if arg.to_id() == callee_id {
                                    return Ok(false);
                                }
                            }
                        }
                    }
                }

                if self.merge_sequential_expr(a, b_callee)? {
                    if is_this_undefined {
                        if let Expr::Member(..) = &**b_callee {
                            let zero = Box::new(Expr::Lit(Lit::Num(Number {
                                span: DUMMY_SP,
                                value: 0.0,
                                raw: None,
                            })));
                            report_change!("injecting zero to preserve `this` in call");

                            *b_callee = Box::new(Expr::Seq(SeqExpr {
                                span: b_callee.span(),
                                exprs: vec![zero, b_callee.take()],
                            }));
                        }
                    }

                    return Ok(true);
                }

                if !self.is_skippable_for_seq(Some(a), b_callee) {
                    return Ok(false);
                }

                for arg in b_args {
                    trace_op!("seq: Try arg of call");
                    if self.merge_sequential_expr(a, &mut arg.expr)? {
                        return Ok(true);
                    }

                    if !self.is_skippable_for_seq(Some(a), &arg.expr) {
                        return Ok(false);
                    }
                }

                return Ok(false);
            }

            Expr::New(NewExpr {
                callee: b_callee, ..
            }) => {
                trace_op!("seq: Try callee of new");
                if self.merge_sequential_expr(a, b_callee)? {
                    return Ok(true);
                }

                return Ok(false);
            }

            Expr::Seq(SeqExpr { exprs: b_exprs, .. }) => {
                for b_expr in b_exprs {
                    trace_op!("seq: Try elem of seq");

                    if self.merge_sequential_expr(a, b_expr)? {
                        return Ok(true);
                    }

                    if !self.is_skippable_for_seq(Some(a), b_expr) {
                        return Ok(false);
                    }
                }

                return Ok(false);
            }

            Expr::Object(ObjectLit { props, .. }) => {
                for prop in props {
                    match prop {
                        PropOrSpread::Spread(prop) => {
                            if self.merge_sequential_expr(a, &mut prop.expr)? {
                                return Ok(true);
                            }

                            return Ok(false);
                        }
                        PropOrSpread::Prop(prop) => {
                            // Inline into key
                            let key = match &mut **prop {
                                Prop::Shorthand(_) => continue,
                                Prop::KeyValue(prop) => Some(&mut prop.key),
                                Prop::Assign(_) => None,
                                Prop::Getter(prop) => Some(&mut prop.key),
                                Prop::Setter(prop) => Some(&mut prop.key),
                                Prop::Method(prop) => Some(&mut prop.key),
                            };

                            if let Some(PropName::Computed(key)) = key {
                                if self.merge_sequential_expr(a, &mut key.expr)? {
                                    return Ok(true);
                                }

                                if !self.is_skippable_for_seq(Some(a), &key.expr) {
                                    return Ok(false);
                                }
                            }

                            match &mut **prop {
                                Prop::KeyValue(prop) => {
                                    if self.merge_sequential_expr(a, &mut prop.value)? {
                                        return Ok(true);
                                    }

                                    if !self.is_skippable_for_seq(Some(a), &prop.value) {
                                        return Ok(false);
                                    }
                                }
                                Prop::Assign(prop) => {
                                    if self.merge_sequential_expr(a, &mut prop.value)? {
                                        return Ok(true);
                                    }

                                    if !self.is_skippable_for_seq(Some(a), &prop.value) {
                                        return Ok(false);
                                    }
                                }
                                _ => {}
                            }
                        }
                    }
                }

                return Ok(false);
            }

            _ => {}
        }

        #[cfg(feature = "debug")]
        match a {
            Mergable::Var(a) => {
                trace_op!(
                    "sequences: Trying to merge `{}` => `{}`",
                    crate::debug::dump(&**a, false),
                    crate::debug::dump(&*b, false)
                );
            }
            Mergable::Expr(a) => {
                trace_op!(
                    "sequences: Trying to merge `{}` => `{}`",
                    crate::debug::dump(&**a, false),
                    crate::debug::dump(&*b, false)
                );
            }

            Mergable::FnDecl(a) => {
                trace_op!(
                    "sequences: Trying to merge `{}` => `{}`",
                    crate::debug::dump(&**a, false),
                    crate::debug::dump(&*b, false)
                );
            }
        }

        if self.replace_seq_update(a, b)? {
            return Ok(true);
        }

        if self.replace_seq_assignment(a, b)? {
            return Ok(true);
        }

        Ok(false)
    }

    /// This requires tracking if `b` is in an assignment pattern.
    ///
    /// Update expressions can be inline.
    ///
    /// c++, console.log(c)
    ///
    /// is same as
    ///
    /// console.log(++c)

    fn replace_seq_update(&mut self, a: &mut Mergable, b: &mut Expr) -> Result<bool, ()> {
        if !self.options.sequences() {
            return Ok(false);
        }

        if let Mergable::Expr(a) = a {
            match a {
                Expr::Update(UpdateExpr {
                    op,
                    prefix: false,
                    arg,
                    ..
                }) => {
                    if let Expr::Ident(a_id) = &**arg {
                        if let Some(usage) = self.data.vars.get(&a_id.to_id()) {
                            if let Some(VarDeclKind::Const) = usage.var_kind {
                                return Err(());
                            }
                        }

                        let mut v = UsageCounter {
                            expr_usage: Default::default(),
                            pat_usage: Default::default(),
                            target: a_id,
                            in_lhs: false,
                        };
                        b.visit_with(&mut v);
                        if v.expr_usage != 1 || v.pat_usage != 0 {
                            log_abort!(
                                "sequences: Aborting merging of an update expression because of \
                                 usage counts ({}, ref = {}, pat = {})",
                                a_id,
                                v.expr_usage,
                                v.pat_usage
                            );

                            return Ok(false);
                        }

                        let mut replaced = false;
                        replace_expr(b, |e| {
                            if replaced {
                                return;
                            }

                            if let Expr::Ident(orig_expr) = &*e {
                                if orig_expr.to_id() == a_id.to_id() {
                                    replaced = true;
                                    *e = Expr::Update(UpdateExpr {
                                        span: DUMMY_SP,
                                        op: *op,
                                        prefix: true,
                                        arg: Box::new(Expr::Ident(orig_expr.clone())),
                                    });
                                    return;
                                }
                            }

                            if let Expr::Update(e @ UpdateExpr { prefix: false, .. }) = e {
                                if let Expr::Ident(arg) = &*e.arg {
                                    if *op == e.op && arg.to_id() == a_id.to_id() {
                                        e.prefix = true;
                                        replaced = true;
                                    }
                                }
                            }
                        });
                        if replaced {
                            self.changed = true;
                            report_change!(
                                "sequences: Merged update expression into another expression",
                            );

                            a.take();
                            return Ok(true);
                        }
                    }
                }

                Expr::Update(UpdateExpr {
                    op,
                    prefix: true,
                    arg,
                    ..
                }) => {
                    if let Expr::Ident(a_id) = &**arg {
                        if let Some(usage) = self.data.vars.get(&a_id.to_id()) {
                            if let Some(VarDeclKind::Const) = usage.var_kind {
                                return Err(());
                            }
                        }

                        let mut v = UsageCounter {
                            expr_usage: Default::default(),
                            pat_usage: Default::default(),
                            target: a_id,
                            in_lhs: false,
                        };
                        b.visit_with(&mut v);
                        if v.expr_usage != 1 || v.pat_usage != 0 {
                            log_abort!(
                                "sequences: Aborting merging of an update expression because of \
                                 usage counts ({}, ref = {}, pat = {})",
                                a_id,
                                v.expr_usage,
                                v.pat_usage
                            );

                            return Ok(false);
                        }

                        let mut replaced = false;
                        replace_expr(b, |e| {
                            if replaced {
                                return;
                            }

                            if let Expr::Ident(orig_expr) = &*e {
                                if orig_expr.to_id() == a_id.to_id() {
                                    replaced = true;
                                    *e = Expr::Update(UpdateExpr {
                                        span: DUMMY_SP,
                                        op: *op,
                                        prefix: true,
                                        arg: Box::new(Expr::Ident(orig_expr.clone())),
                                    });
                                    return;
                                }
                            }

                            if let Expr::Update(e @ UpdateExpr { prefix: false, .. }) = e {
                                if let Expr::Ident(arg) = &*e.arg {
                                    if *op == e.op && arg.to_id() == a_id.to_id() {
                                        e.prefix = true;
                                        replaced = true;
                                    }
                                }
                            }
                        });
                        if replaced {
                            self.changed = true;
                            report_change!(
                                "sequences: Merged prefix update expression into another \
                                 expression",
                            );

                            a.take();
                            return Ok(true);
                        }
                    }
                }

                _ => {}
            }
        }

        Ok(false)
    }

    /// Handle where a: [Expr::Assign] or [Mergable::Var]
    fn replace_seq_assignment(&mut self, a: &mut Mergable, b: &mut Expr) -> Result<bool, ()> {
        let mut can_remove = false;
        let mut can_take_init = false;

        let mut right_val;
        let (left_id, a_right) = match a {
            Mergable::Expr(a) => {
                match a {
                    Expr::Assign(AssignExpr { left, right, .. }) => {
                        // (a = 5, console.log(a))
                        //
                        // =>
                        //
                        // (console.log(a = 5))

                        let left_id = match left.as_ident() {
                            Some(v) => v,
                            None => {
                                log_abort!("sequences: Aborting because lhs is not an id");
                                return Ok(false);
                            }
                        };

                        if let Some(usage) = self.data.vars.get(&left_id.to_id()) {
                            if usage.inline_prevented {
                                return Ok(false);
                            }

                            // Reassignment to const?
                            if let Some(VarDeclKind::Const) = usage.var_kind {
                                return Ok(false);
                            }

                            if usage.declared_as_fn_expr {
                                log_abort!(
                                    "sequences: Declared as fn expr ({}, {:?})",
                                    left_id.sym,
                                    left_id.span.ctxt
                                );
                                return Ok(false);
                            }

                            // We can remove this variable same as unused pass
                            if !usage.reassigned() && usage.usage_count == 1 && usage.declared {
                                can_remove = true;
                            }
                        }

                        (left_id.clone(), Some(right))
                    }
                    _ => return Ok(false),
                }
            }

            Mergable::Var(a) => {
                let left = match &a.name {
                    Pat::Ident(i) => i.id.clone(),
                    _ => return Ok(false),
                };

                if let Some(usage) = self.data.vars.get(&left.to_id()) {
                    let is_lit = match a.init.as_deref() {
                        Some(e) => is_trivial_lit(e),
                        _ => false,
                    };

                    if usage.ref_count != 1 || usage.reassigned() || !usage.is_fn_local {
                        if is_lit {
                            can_take_init = false
                        } else {
                            return Ok(false);
                        }
                    } else {
                        can_take_init = true;
                    }

                    if usage.inline_prevented {
                        return Ok(false);
                    }

                    match &mut a.init {
                        Some(v) => (left, Some(v)),
                        None => {
                            if usage.declared_count > 1 {
                                return Ok(false);
                            }

                            right_val = undefined(DUMMY_SP);
                            (left, Some(&mut right_val))
                        }
                    }
                } else {
                    return Ok(false);
                }
            }

            Mergable::FnDecl(a) => {
                if let Some(usage) = self.data.vars.get(&a.ident.to_id()) {
                    if usage.ref_count != 1 || usage.reassigned() || !usage.is_fn_local {
                        return Ok(false);
                    }

                    if usage.inline_prevented {
                        return Ok(false);
                    }

                    if contains_arguments(&a.function) {
                        return Ok(false);
                    }

                    (a.ident.clone(), None)
                } else {
                    return Ok(false);
                }
            }
        };

        if let Some(a_right) = a_right {
            if a_right.is_this()
                || matches!(
                    &**a_right,
                    Expr::Ident(Ident {
                        sym: js_word!("arguments"),
                        ..
                    })
                )
            {
                return Ok(false);
            }
            if contains_arguments(&**a_right) {
                return Ok(false);
            }
        }

        macro_rules! take_a {
            ($force_drop:expr, $drop_op:expr) => {
                match a {
                    Mergable::Var(a) => {
                        if self.options.unused {
                            if let Some(usage) = self.data.vars.get(&left_id.to_id()) {
                                // We are eliminating one usage, so we use 1 instead of
                                // 0
                                if !$force_drop && usage.usage_count == 1 {
                                    report_change!("sequences: Dropping inlined variable");
                                    a.name.take();
                                }
                            }
                        }

                        if can_take_init || $force_drop {
                            a.init.take()
                        } else {
                            a.init.clone()
                        }
                        .unwrap_or_else(|| undefined(DUMMY_SP))
                    }
                    Mergable::Expr(a) => {
                        if can_remove || $force_drop {
                            if let Expr::Assign(e) = a {
                                if e.op == op!("=") || $drop_op {
                                    report_change!(
                                        "sequences: Dropping assignment as we are going to drop \
                                         the variable declaration. ({})",
                                        left_id
                                    );

                                    **a = *e.right.take();
                                }
                            }
                        }

                        Box::new(a.take())
                    }

                    Mergable::FnDecl(a) => {
                        // We can inline a function declaration as a function expression.

                        Box::new(Expr::Fn(FnExpr {
                            ident: Some(a.ident.take()),
                            function: a.function.take(),
                        }))
                    }
                }
            };
        }

        // x = 1, x += 2 => x = 3
        match b {
            Expr::Assign(b @ AssignExpr { op: op!("="), .. }) => {
                if let Some(b_left) = b.left.as_ident() {
                    if b_left.to_id() == left_id.to_id() {
                        report_change!("sequences: Merged assignment into another assignment");
                        self.changed = true;

                        let mut a_expr = take_a!(true, false);
                        let a_expr = self.ignore_return_value(&mut a_expr);

                        if let Some(a) = a_expr {
                            b.right = Box::new(Expr::Seq(SeqExpr {
                                span: DUMMY_SP,
                                exprs: vec![Box::new(a), b.right.take()],
                            }));
                        }
                        return Ok(true);
                    }
                }
            }
            Expr::Assign(b) => {
                if let Some(b_left) = b.left.as_ident() {
                    let a_op = match a {
                        Mergable::Var(_) => Some(op!("=")),
                        Mergable::Expr(Expr::Assign(AssignExpr { op: a_op, .. })) => Some(*a_op),
                        Mergable::FnDecl(_) => Some(op!("=")),
                        _ => None,
                    };

                    if let Some(a_op) = a_op {
                        if can_drop_op_for(a_op, b.op) {
                            if b_left.to_id() == left_id.to_id() {
                                if let Some(bin_op) = b.op.to_update() {
                                    report_change!(
                                        "sequences: Merged assignment into another (op) assignment"
                                    );
                                    self.changed = true;

                                    b.op = op!("=");

                                    let to = take_a!(true, true);

                                    b.right = Box::new(Expr::Bin(BinExpr {
                                        span: DUMMY_SP,
                                        op: bin_op,
                                        left: to,
                                        right: b.right.take(),
                                    }));
                                    return Ok(true);
                                }
                            }
                        }
                    }
                }
            }
            _ => {}
        }

        {
            let mut v = UsageCounter {
                expr_usage: Default::default(),
                pat_usage: Default::default(),
                target: &left_id,
                in_lhs: false,
            };
            b.visit_with(&mut v);
            if v.expr_usage != 1 || v.pat_usage != 0 {
                log_abort!(
                    "sequences: Aborting because of usage counts ({}{:?}, ref = {}, pat = {})",
                    left_id.sym,
                    left_id.span.ctxt,
                    v.expr_usage,
                    v.pat_usage
                );

                return Ok(false);
            }
        }

        self.changed = true;
        report_change!(
            "sequences: Inlining sequential expressions (`{}{:?}`)",
            left_id.sym,
            left_id.span.ctxt
        );

        let to = take_a!(false, false);

        replace_id_with_expr(b, left_id.to_id(), to);

        if can_remove {
            report_change!("sequences: Removed variable ({})", left_id);
            self.vars.removed.insert(left_id.to_id());
        }

        dump_change_detail!("sequences: {}", dump(&*b, false));

        Ok(true)
    }

    /// TODO(kdy1): Optimize this
    ///
    /// See https://github.com/swc-project/swc/pull/3480
    ///
    /// This works, but it should be optimized.
    ///
    /// This check blocks optimization of clearly valid optimizations like `i +=
    /// 1, arr[i]`
    //
    fn should_not_check_rhs_of_assign(&self, a: &Mergable, b: &mut AssignExpr) -> Result<bool, ()> {
        if let Some(a_id) = a.id() {
            match a {
                Mergable::Expr(Expr::Assign(AssignExpr { op: op!("="), .. })) => {}
                Mergable::Expr(Expr::Assign(..)) => {
                    let used_by_b = idents_used_by(&*b.right);
                    if used_by_b.contains(&a_id) {
                        return Ok(true);
                    }
                }
                _ => {}
            }
        }

        Ok(false)
    }
}

struct UsageCounter<'a> {
    expr_usage: usize,
    pat_usage: usize,

    target: &'a Ident,
    in_lhs: bool,
}

impl Visit for UsageCounter<'_> {
    noop_visit_type!();

    fn visit_ident(&mut self, i: &Ident) {
        if self.target.sym == i.sym && self.target.span.ctxt == i.span.ctxt {
            if self.in_lhs {
                self.pat_usage += 1;
            } else {
                self.expr_usage += 1;
            }
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        e.obj.visit_with(self);

        if let MemberProp::Computed(c) = &e.prop {
            let old = self.in_lhs;
            self.in_lhs = false;
            c.expr.visit_with(self);
            self.in_lhs = old;
        }
    }

    fn visit_super_prop_expr(&mut self, e: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &e.prop {
            let old = self.in_lhs;
            self.in_lhs = false;
            c.expr.visit_with(self);
            self.in_lhs = old;
        }
    }

    fn visit_pat(&mut self, p: &Pat) {
        let old = self.in_lhs;
        self.in_lhs = true;
        p.visit_children_with(self);
        self.in_lhs = old;
    }

    fn visit_pat_or_expr(&mut self, p: &PatOrExpr) {
        let old = self.in_lhs;
        self.in_lhs = true;
        p.visit_children_with(self);
        self.in_lhs = old;
    }
}

#[derive(Debug)]
enum Mergable<'a> {
    Var(&'a mut VarDeclarator),
    Expr(&'a mut Expr),
    FnDecl(&'a mut FnDecl),
}

impl Mergable<'_> {
    fn id(&self) -> Option<Id> {
        match self {
            Mergable::Var(s) => match &s.name {
                Pat::Ident(i) => Some(i.id.to_id()),
                _ => None,
            },
            Mergable::Expr(s) => match &**s {
                Expr::Assign(s) => s.left.as_ident().map(|v| v.to_id()),
                _ => None,
            },
            Mergable::FnDecl(f) => Some(f.ident.to_id()),
        }
    }
}

/// Returns true for trivial bool/numeric literals
pub(crate) fn is_trivial_lit(e: &Expr) -> bool {
    match e {
        Expr::Lit(Lit::Bool(..) | Lit::Num(..) | Lit::Null(..)) => true,
        Expr::Paren(e) => is_trivial_lit(&e.expr),
        Expr::Bin(e) => is_trivial_lit(&e.left) && is_trivial_lit(&e.right),
        Expr::Unary(e @ UnaryExpr { op: op!("!"), .. }) => is_trivial_lit(&e.arg),
        _ => false,
    }
}

/// This assumes `a.left.to_id() == b.left.to_id()`
fn can_drop_op_for(a: AssignOp, b: AssignOp) -> bool {
    if a == op!("=") {
        return true;
    }

    if a == b {
        return matches!(a, op!("+=") | op!("*="));
    }

    false
}
