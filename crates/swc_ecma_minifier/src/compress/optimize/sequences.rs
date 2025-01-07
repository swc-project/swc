use std::{iter::once, mem::take};

use rustc_hash::FxHashSet;
use swc_common::{pass::Either, util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::{
    alias::{collect_infects_from, AccessKind, AliasConfig},
    util::is_global_var_with_pure_property_access,
};
use swc_ecma_utils::{
    contains_arguments, contains_this_expr, prepend_stmts, ExprExt, StmtLike, Type, Value,
};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};
#[cfg(feature = "debug")]
use tracing::{span, Level};

use super::{is_pure_undefined, Optimizer};
#[cfg(feature = "debug")]
use crate::debug::dump;
use crate::{
    compress::{
        optimize::{unused::PropertyAccessOpts, util::replace_id_with_expr},
        util::{is_directive, is_ident_used_by, replace_expr},
    },
    option::CompressOptions,
    util::{
        idents_used_by, idents_used_by_ignoring_nested, ExprOptExt, IdentUsageCollector,
        ModuleItemExt,
    },
};

/// Methods related to the option `sequences`. All methods are noop if
/// `sequences` is false.
impl Optimizer<'_> {
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
        let mut exprs = Vec::new();
        // This is bigger than required.
        let mut new_stmts = Vec::with_capacity(stmts.len());

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => {
                    if is_directive(&stmt) {
                        new_stmts.push(T::from(stmt));
                        continue;
                    }
                    // If
                    match stmt {
                        Stmt::Expr(stmt) => {
                            exprs.push(stmt.expr);
                        }

                        Stmt::If(mut stmt) => {
                            stmt.test.prepend_exprs(take(&mut exprs));
                            new_stmts.push(T::from(stmt.into()));
                        }

                        Stmt::Switch(mut stmt) => {
                            stmt.discriminant.prepend_exprs(take(&mut exprs));

                            new_stmts.push(T::from(stmt.into()));
                        }

                        Stmt::With(mut stmt) => {
                            stmt.obj.prepend_exprs(take(&mut exprs));

                            new_stmts.push(T::from(stmt.into()));
                        }

                        Stmt::Return(mut stmt @ ReturnStmt { arg: Some(..), .. }) => {
                            match stmt.arg.as_deref_mut() {
                                Some(e) => {
                                    e.prepend_exprs(take(&mut exprs));
                                }
                                _ => {
                                    let mut e = Expr::undefined(stmt.span);
                                    e.prepend_exprs(take(&mut exprs));

                                    stmt.arg = Some(e);
                                }
                            }

                            new_stmts.push(T::from(stmt.into()));
                        }

                        Stmt::Throw(mut stmt) => {
                            stmt.arg.prepend_exprs(take(&mut exprs));

                            new_stmts.push(T::from(stmt.into()));
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

                                                new_stmts.push(T::from(stmt.into()));

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
                            new_stmts.push(T::from(stmt.into()));
                        }

                        Stmt::ForIn(mut stmt) => {
                            stmt.right.prepend_exprs(take(&mut exprs));

                            new_stmts.push(T::from(stmt.into()));
                        }

                        Stmt::ForOf(mut stmt) => {
                            stmt.right.prepend_exprs(take(&mut exprs));

                            new_stmts.push(T::from(stmt.into()));
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
                            new_stmts.push(T::from(var.into()));
                        }

                        Stmt::Decl(Decl::Fn(..)) => {
                            new_stmts.push(T::from(stmt));
                        }

                        _ => {
                            if !exprs.is_empty() {
                                new_stmts.push(T::from(
                                    ExprStmt {
                                        span: DUMMY_SP,
                                        expr: Expr::from_exprs(take(&mut exprs)),
                                    }
                                    .into(),
                                ))
                            }

                            new_stmts.push(T::from(stmt));
                        }
                    }
                }
                Err(item) => {
                    if !exprs.is_empty() {
                        new_stmts.push(T::from(
                            ExprStmt {
                                span: DUMMY_SP,
                                expr: Expr::from_exprs(take(&mut exprs)),
                            }
                            .into(),
                        ))
                    }

                    new_stmts.push(item);
                }
            }
        }

        if !exprs.is_empty() {
            new_stmts.push(T::from(
                ExprStmt {
                    span: DUMMY_SP,
                    expr: Expr::from_exprs(take(&mut exprs)),
                }
                .into(),
            ))
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

        let mut new_stmts = Vec::new();

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
                                .map(T::from),
                        );
                    }

                    _ => {
                        new_stmts.push(T::from(stmt));
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
                if id.ctxt == self.ctx.expr_ctx.unresolved_ctxt {
                    return;
                }
                // Do we really need this?
                if seq.exprs.is_empty() || seq.exprs.len() <= 1 {
                    return;
                }
                report_change!("sequences: Lifting Assign");
                self.changed = true;
                if let Some(last) = seq.exprs.last_mut() {
                    **last = AssignExpr {
                        span: *span,
                        op: op!("="),
                        left: left.take(),
                        right: last.take(),
                    }
                    .into()
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
            prepend_stmts(stmts, self.prepend_stmts.drain(..).map(T::from));
        }

        if !self.append_stmts.is_empty() {
            stmts.extend(self.append_stmts.drain(..).map(T::from));
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
                    if lhs.sym == last_id.sym && lhs.ctxt == last_id.ctxt {
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
            if is_pure_undefined(&self.ctx.expr_ctx, last) {
                self.changed = true;
                report_change!("sequences: Shifting void");

                e.exprs.pop();
                let last = e.exprs.last_mut().unwrap();

                *last = UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("void"),
                    arg: last.take(),
                }
                .into()
            }
        }
    }

    fn seq_exprs_of<'a>(
        &mut self,
        s: &'a mut Stmt,
        options: &CompressOptions,
    ) -> Option<Either<impl Iterator<Item = Mergable<'a>>, std::iter::Once<Mergable<'a>>>> {
        Some(match s {
            Stmt::Expr(e) => {
                if self.options.sequences()
                    || self.options.collapse_vars
                    || self.options.side_effects
                {
                    Either::Right(once(Mergable::Expr(&mut e.expr)))
                } else {
                    return None;
                }
            }
            Stmt::Decl(Decl::Var(v)) => {
                if options.reduce_vars || options.collapse_vars {
                    Either::Left(v.decls.iter_mut().map(Mergable::Var))
                } else {
                    return None;
                }
            }
            Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => {
                Either::Right(once(Mergable::Expr(arg)))
            }

            Stmt::If(s) if options.sequences() => Either::Right(once(Mergable::Expr(&mut s.test))),

            Stmt::Switch(s) if options.sequences() => {
                Either::Right(once(Mergable::Expr(&mut s.discriminant)))
            }

            Stmt::For(s) if options.sequences() => {
                if let Some(VarDeclOrExpr::Expr(e)) = &mut s.init {
                    Either::Right(once(Mergable::Expr(e)))
                } else {
                    return None;
                }
            }

            Stmt::ForOf(s) if options.sequences() => {
                Either::Right(once(Mergable::Expr(&mut s.right)))
            }

            Stmt::ForIn(s) if options.sequences() => {
                Either::Right(once(Mergable::Expr(&mut s.right)))
            }

            Stmt::Throw(s) if options.sequences() => {
                Either::Right(once(Mergable::Expr(&mut s.arg)))
            }

            Stmt::Decl(Decl::Fn(f)) => {
                // Check for side effects

                Either::Right(once(Mergable::FnDecl(f)))
            }

            _ => return None,
        })
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn merge_sequences_in_stmts<T>(&mut self, stmts: &mut Vec<T>, will_terminate: bool)
    where
        T: ModuleItemExt,
    {
        if !self.options.sequences() && !self.options.collapse_vars && !self.options.reduce_vars {
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

        fn is_end(s: Option<&Stmt>) -> bool {
            matches!(
                s,
                Some(
                    Stmt::If(..)
                        | Stmt::Throw(..)
                        | Stmt::Return(..)
                        | Stmt::Switch(..)
                        | Stmt::For(..)
                        | Stmt::ForIn(..)
                        | Stmt::ForOf(..)
                ) | None
            )
        }

        let mut exprs = Vec::new();
        let mut buf = Vec::new();

        for stmt in stmts.iter_mut() {
            let is_end = is_end(stmt.as_stmt());
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

        if will_terminate {
            buf.push(Mergable::Drop);
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
            let mut new = Vec::new();

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

        if !self.options.sequences() && !self.options.collapse_vars && !e.span.is_dummy() {
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

        let mut merge_seq_cache = MergeSequenceCache::new(exprs.len());
        loop {
            let mut changed = false;
            for a_idx in 0..exprs.len().saturating_sub(1) {
                for b_idx in (a_idx + 1)..exprs.len() {
                    let (a1, a2) = exprs.split_at_mut(a_idx + 1);
                    let a = a1.last_mut().unwrap();
                    let b = &mut a2[b_idx - a_idx - 1];

                    if self.options.unused && self.options.sequences() {
                        if let (Mergable::Var(av), Mergable::Var(bv)) = (&mut *a, &mut *b) {
                            // We try dropping variable assignments first.

                            // Currently, we only drop variable declarations if they have the same
                            // name.
                            if let (Pat::Ident(an), Pat::Ident(bn)) = (&av.name, &bv.name) {
                                if an.to_id() == bn.to_id() {
                                    // We need to preserve side effect of `av.init`

                                    match bv.init.as_deref_mut() {
                                        Some(b_init) => {
                                            if is_ident_used_by(an.to_id(), b_init) {
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
                                                merge_seq_cache.invalidate(a_idx);
                                                merge_seq_cache.invalidate(b_idx);

                                                self.changed = true;
                                                report_change!(
                                                    "Moving initializer sequentially as they have \
                                                     a same name"
                                                );
                                                av.name.take();
                                                break;
                                            } else {
                                                self.changed = true;
                                                report_change!(
                                                    "Dropping the previous var declaration of {} \
                                                     which does not have an initializer",
                                                    an.id
                                                );
                                                av.name.take();
                                                break;
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
                                            merge_seq_cache.invalidate(a_idx);
                                            merge_seq_cache.invalidate(b_idx);
                                            self.changed = true;
                                            report_change!(
                                                "Moving initializer to the next variable \
                                                 declaration as they have the same name"
                                            );
                                            av.name.take();
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Merge sequentially

                    match b {
                        Mergable::Var(b) => match b.init.as_deref_mut() {
                            Some(b) => {
                                if !merge_seq_cache.is_top_retain(self, a, a_idx)
                                    && self.merge_sequential_expr(a, b)?
                                {
                                    changed = true;
                                    merge_seq_cache.invalidate(a_idx);
                                    merge_seq_cache.invalidate(b_idx);
                                    break;
                                }
                            }
                            None => continue,
                        },
                        Mergable::Expr(b) => {
                            if !merge_seq_cache.is_top_retain(self, a, a_idx)
                                && self.merge_sequential_expr(a, b)?
                            {
                                changed = true;
                                merge_seq_cache.invalidate(a_idx);
                                merge_seq_cache.invalidate(b_idx);
                                break;
                            }
                        }
                        Mergable::FnDecl(..) => continue,
                        Mergable::Drop => {
                            if self.drop_mergable_seq(a)? {
                                changed = true;
                                merge_seq_cache.invalidate(a_idx);
                                merge_seq_cache.invalidate(b_idx);
                                break;
                            }
                        }
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
                            if let Some(a) = a.left.as_simple() {
                                if !self.is_simple_assign_target_skippable_for_seq(None, a) {
                                    break;
                                }
                            }

                            if !self.is_skippable_for_seq(None, &a.right) {
                                break;
                            }
                        }

                        _ => {}
                    }

                    match b {
                        Mergable::Var(e2) => {
                            if let Some(e2) = &e2.init {
                                if !self.is_skippable_for_seq(Some(a), e2) {
                                    break;
                                }
                            }

                            if let Some(id) = a.id() {
                                if merge_seq_cache.is_ident_used_by(&id, &**e2, b_idx) {
                                    break;
                                }
                            }
                        }
                        Mergable::Expr(e2) => {
                            if !self.is_skippable_for_seq(Some(a), e2) {
                                break;
                            }

                            if let Some(id) = a.id() {
                                if merge_seq_cache.is_ident_used_by(&id, &**e2, b_idx) {
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

                        Mergable::Drop => break,
                    }
                }
            }

            if !changed {
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

    fn drop_mergable_seq(&mut self, a: &mut Mergable) -> Result<bool, ()> {
        if let Mergable::Expr(a) = a {
            if self.optimize_last_expr_before_termination(a) {
                return Ok(true);
            }
        }

        Ok(false)
    }

    fn is_simple_assign_target_skippable_for_seq(
        &self,
        a: Option<&Mergable>,
        e: &SimpleAssignTarget,
    ) -> bool {
        match e {
            SimpleAssignTarget::Ident(e) => self.is_ident_skippable_for_seq(a, &Ident::from(e)),
            SimpleAssignTarget::Member(e) => self.is_member_expr_skippable_for_seq(a, e),
            _ => false,
        }
    }

    fn is_ident_skippable_for_seq(&self, a: Option<&Mergable>, e: &Ident) -> bool {
        if e.ctxt == self.ctx.expr_ctx.unresolved_ctxt
            && self.options.pristine_globals
            && is_global_var_with_pure_property_access(&e.sym)
        {
            return true;
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

                Mergable::Drop => return false,
            }

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
                    Expr::Assign(a) if a.is_simple_assign() => Some(collect_infects_from(
                        &a.right,
                        AliasConfig {
                            marks: Some(self.marks),
                            ignore_nested: true,
                            need_all: true,
                        },
                    )),

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

                Mergable::Drop => return false,
            };

            if let Some(deps) = ids_used_by_a_init {
                if deps.contains(&(e.to_id(), AccessKind::Reference))
                    || deps.contains(&(e.to_id(), AccessKind::Call))
                {
                    return false;
                }
            }

            if !self.assignee_skippable_for_seq(a, e) {
                return false;
            }
        }

        true
    }

    fn is_member_expr_skippable_for_seq(
        &self,
        a: Option<&Mergable>,
        MemberExpr { obj, prop, .. }: &MemberExpr,
    ) -> bool {
        if !self.is_skippable_for_seq(a, obj) {
            return false;
        }

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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn is_skippable_for_seq(&self, a: Option<&Mergable>, e: &Expr) -> bool {
        if self.ctx.in_try_block {
            log_abort!("try block");
            return false;
        }

        trace_op!("is_skippable_for_seq");

        match e {
            Expr::Ident(e) => self.is_ident_skippable_for_seq(a, e),

            Expr::Member(me) => self.is_member_expr_skippable_for_seq(a, me),

            Expr::Lit(..) => true,

            Expr::Yield(..) | Expr::Await(..) => false,

            Expr::Tpl(t) => t.exprs.iter().all(|e| self.is_skippable_for_seq(a, e)),

            Expr::TaggedTpl(t) => {
                self.is_skippable_for_seq(a, &t.tag)
                    && t.tpl.exprs.iter().all(|e| self.is_skippable_for_seq(a, e))
            }

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
                        Mergable::Drop => return false,
                    }
                }

                if !self.is_skippable_for_seq(a, &left_id.id.clone().into()) {
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
                                if !self.is_skippable_for_seq(a, &i.clone().into()) {
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
                    if callee.is_pure_callee(&self.ctx.expr_ctx) {
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

            Expr::New(..) => {
                // TODO(kdy1): We can optimize some known calls.

                false
            }

            // Expressions without any effects
            Expr::This(_)
            | Expr::Fn(_)
            | Expr::MetaProp(_)
            | Expr::Arrow(_)
            | Expr::PrivateName(_) => true,

            Expr::Update(..) => false,
            Expr::SuperProp(..) => false,
            Expr::Class(_) => e.may_have_side_effects(&self.ctx.expr_ctx),

            Expr::Paren(e) => self.is_skippable_for_seq(a, &e.expr),
            Expr::Unary(e) => self.is_skippable_for_seq(a, &e.arg),

            Expr::OptChain(OptChainExpr { base, .. }) => match &**base {
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
                    if e.callee.is_pure_callee(&self.ctx.expr_ctx) {
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

    fn assignee_skippable_for_seq(&self, a: &Mergable, assignee: &Ident) -> bool {
        let usgae = if let Some(usage) = self.data.vars.get(&assignee.to_id()) {
            usage
        } else {
            return false;
        };
        match a {
            Mergable::Expr(a) => {
                let has_side_effect = match a {
                    Expr::Assign(a) if a.is_simple_assign() => {
                        a.right.may_have_side_effects(&self.ctx.expr_ctx)
                    }
                    _ => a.may_have_side_effects(&self.ctx.expr_ctx),
                };
                if has_side_effect && !usgae.is_fn_local && (usgae.exported || usgae.reassigned) {
                    log_abort!("a (expr) has side effect");
                    return false;
                }
            }
            Mergable::Var(a) => {
                if let Some(init) = &a.init {
                    if init.may_have_side_effects(&self.ctx.expr_ctx)
                        && !usgae.is_fn_local
                        && (usgae.exported || usgae.reassigned)
                    {
                        log_abort!("a (var) init has side effect");
                        return false;
                    }
                }
            }
            Mergable::FnDecl(_) => (),
            Mergable::Drop => return false,
        }

        true
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
                Mergable::Drop => unreachable!(),
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

        match &*b {
            Expr::Arrow(..)
            | Expr::Fn(..)
            | Expr::Class(..)
            | Expr::Lit(..)
            | Expr::Await(..)
            | Expr::Yield(..)
            | Expr::Tpl(..)
            | Expr::TaggedTpl(..) => return Ok(false),

            // See https://github.com/swc-project/swc/issues/8924 and https://github.com/swc-project/swc/issues/8942
            Expr::Assign(AssignExpr {
                op: op!("**="),
                right,
                ..
            })
            | Expr::Bin(BinExpr {
                op: op!("**"),
                right,
                ..
            }) => {
                if !right.is_lit() {
                    return Ok(false);
                }
            }

            Expr::Unary(UnaryExpr {
                op: op!("delete"), ..
            }) => return Ok(false),
            _ => {}
        }

        match a {
            Mergable::Var(..) | Mergable::FnDecl(..) => {}
            Mergable::Expr(a) => {
                if a.is_ident() {
                    return Ok(false);
                }

                if let Expr::Seq(a) = a {
                    for a in a.exprs.iter_mut().rev() {
                        if self.merge_sequential_expr(&mut Mergable::Expr(a), b)? {
                            return Ok(true);
                        }

                        if !self.is_skippable_for_seq(None, a) {
                            return Ok(false);
                        }

                        if a.may_have_side_effects(&self.ctx.expr_ctx) {
                            return Ok(false);
                        }
                    }

                    return Ok(false);
                }
            }
            Mergable::Drop => return Ok(false),
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

                Mergable::Drop => return Ok(false),
            }
        }

        match b {
            Expr::Update(..) | Expr::Arrow(..) | Expr::Fn(..) | Expr::OptChain(..) => {
                return Ok(false)
            }

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

                if obj.may_have_side_effects(&self.ctx.expr_ctx) {
                    return Ok(false);
                }

                // We can't merge into `[]` in some cases because `obj` is **resolved** before
                // evaluating `[]`.
                //
                // See https://github.com/swc-project/swc/pull/6509

                let obj_ids = idents_used_by_ignoring_nested(obj);
                let a_ids = match a {
                    Mergable::Var(a) => idents_used_by_ignoring_nested(&a.init),
                    Mergable::Expr(a) => idents_used_by_ignoring_nested(&**a),
                    Mergable::FnDecl(a) => idents_used_by_ignoring_nested(&**a),
                    Mergable::Drop => return Ok(false),
                };
                if !obj_ids.is_disjoint(&a_ids) {
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

            Expr::Assign(b_assign @ AssignExpr { op: op!("="), .. }) => {
                match &mut b_assign.left {
                    AssignTarget::Simple(b_left) => {
                        trace_op!("seq: Try lhs of assign");

                        if let SimpleAssignTarget::Member(..) = b_left {
                            let mut b_left_expr: Box<Expr> = b_left.take().into();

                            let res = self.merge_sequential_expr(a, &mut b_left_expr);

                            b_assign.left = match AssignTarget::try_from(b_left_expr) {
                                Ok(v) => v,
                                Err(b_left_expr) => {
                                    if is_pure_undefined(&self.ctx.expr_ctx, &b_left_expr) {
                                        *b = *b_assign.right.take();
                                        return Ok(true);
                                    }

                                    unreachable!("{b_left_expr:#?}")
                                }
                            };
                            if res? {
                                return Ok(true);
                            }
                        }

                        if b_assign.left.as_ident().is_none() {
                            return Ok(false);
                        }
                    }

                    _ => return Ok(false),
                };

                if self.should_not_check_rhs_of_assign(a, b_assign)? {
                    return Ok(false);
                }

                trace_op!("seq: Try rhs of assign");
                return self.merge_sequential_expr(a, &mut b_assign.right);
            }

            Expr::Assign(b_assign) => {
                if self.should_not_check_rhs_of_assign(a, b_assign)? {
                    return Ok(false);
                }

                let b_left = b_assign.left.as_ident();
                let b_left = if let Some(v) = b_left {
                    v.clone()
                } else {
                    return Ok(false);
                };

                if !self.is_skippable_for_seq(Some(a), &b_left.id.clone().into()) {
                    // Let's be safe
                    if is_ident_used_by(b_left.to_id(), &b_assign.right) {
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

                if is_ident_used_by(b_left.to_id(), &b_assign.right) {
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
                for elem in b.elems.iter_mut().flatten() {
                    trace_op!("seq: Try element of array");
                    if self.merge_sequential_expr(a, &mut elem.expr)? {
                        return Ok(true);
                    }

                    if !self.is_skippable_for_seq(Some(a), &elem.expr) {
                        // To preserve side-effects, we need to abort.
                        break;
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
                            let zero = Lit::Num(Number {
                                span: DUMMY_SP,
                                value: 0.0,
                                raw: None,
                            })
                            .into();
                            report_change!("injecting zero to preserve `this` in call");

                            *b_callee = SeqExpr {
                                span: b_callee.span(),
                                exprs: vec![zero, b_callee.take()],
                            }
                            .into();
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
                callee: b_callee,
                args: b_args,
                ..
            }) => {
                trace_op!("seq: Try callee of new");
                if self.merge_sequential_expr(a, b_callee)? {
                    return Ok(true);
                }

                if !self.is_skippable_for_seq(Some(a), b_callee) {
                    return Ok(false);
                }

                if let Some(b_args) = b_args {
                    for arg in b_args {
                        trace_op!("seq: Try arg of new exp");

                        if self.merge_sequential_expr(a, &mut arg.expr)? {
                            return Ok(true);
                        }

                        if !self.is_skippable_for_seq(Some(a), &arg.expr) {
                            return Ok(false);
                        }
                    }
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
                            let computed = match &mut **prop {
                                Prop::Shorthand(_) | Prop::Assign(_) => None,
                                Prop::KeyValue(prop) => prop.key.as_mut_computed(),
                                Prop::Getter(prop) => prop.key.as_mut_computed(),
                                Prop::Setter(prop) => prop.key.as_mut_computed(),
                                Prop::Method(prop) => prop.key.as_mut_computed(),
                            };

                            if let Some(computed) = computed {
                                if self.merge_sequential_expr(a, &mut computed.expr)? {
                                    return Ok(true);
                                }

                                if !self.is_skippable_for_seq(Some(a), &computed.expr) {
                                    return Ok(false);
                                }
                            }

                            match &mut **prop {
                                Prop::Shorthand(shorthand) => {
                                    // We can't ignore shorthand properties
                                    //
                                    // https://github.com/swc-project/swc/issues/6914
                                    let mut new_b = shorthand.clone().into();
                                    if self.merge_sequential_expr(a, &mut new_b)? {
                                        *prop = Box::new(Prop::KeyValue(KeyValueProp {
                                            key: Ident::new_no_ctxt(
                                                shorthand.sym.clone(),
                                                shorthand.span,
                                            )
                                            .into(),
                                            value: new_b.clone().into(),
                                        }));
                                    }

                                    if !self.is_skippable_for_seq(Some(a), &new_b) {
                                        return Ok(false);
                                    }
                                }
                                Prop::KeyValue(prop) => {
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
            Mergable::Drop => return Ok(false),
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
                            abort: false,
                            in_abort: false,
                        };
                        b.visit_with(&mut v);
                        if v.expr_usage != 1 || v.pat_usage != 0 || v.abort {
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
                                    *e = UpdateExpr {
                                        span: DUMMY_SP,
                                        op: *op,
                                        prefix: true,
                                        arg: orig_expr.clone().into(),
                                    }
                                    .into();
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
                            abort: false,
                            in_abort: false,
                        };
                        b.visit_with(&mut v);
                        if v.expr_usage != 1 || v.pat_usage != 0 || v.abort {
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
                                    *e = UpdateExpr {
                                        span: DUMMY_SP,
                                        op: *op,
                                        prefix: true,
                                        arg: orig_expr.clone().into(),
                                    }
                                    .into();
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
                            Some(v) => v.id.clone(),
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
                                    left_id.ctxt
                                );
                                return Ok(false);
                            }

                            // We can remove this variable same as unused pass
                            if !usage.reassigned
                                && usage.usage_count == 1
                                && usage.declared
                                && !usage.used_recursively
                            {
                                can_remove = true;
                            }
                        } else {
                            return Ok(false);
                        }

                        (left_id, Some(right))
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

                    if usage.ref_count != 1 || usage.reassigned || !usage.is_fn_local {
                        if is_lit {
                            can_take_init = false
                        } else {
                            return Ok(false);
                        }
                    } else {
                        can_take_init = true;
                    }

                    if usage.inline_prevented || usage.used_recursively {
                        return Ok(false);
                    }

                    match &mut a.init {
                        Some(v) => (left, Some(v)),
                        None => {
                            if usage.declared_count > 1 {
                                return Ok(false);
                            }

                            right_val = Expr::undefined(DUMMY_SP);
                            (left, Some(&mut right_val))
                        }
                    }
                } else {
                    return Ok(false);
                }
            }

            Mergable::FnDecl(a) => {
                if let Some(usage) = self.data.vars.get(&a.ident.to_id()) {
                    if usage.ref_count != 1 || usage.reassigned || !usage.is_fn_local {
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

            Mergable::Drop => return Ok(false),
        };

        let a_type = a_right.as_deref().map(|a| a.get_type());

        if let Some(a_right) = a_right {
            if a_right.is_this() || a_right.is_ident_ref_to("arguments") {
                return Ok(false);
            }
            if contains_arguments(&**a_right) {
                return Ok(false);
            }
        }

        let take_a = |a: &mut Mergable, force_drop: bool, drop_op| {
            match a {
                Mergable::Var(a) => {
                    if self.options.unused {
                        if let Some(usage) = self.data.vars.get(&left_id.to_id()) {
                            // We are eliminating one usage, so we use 1 instead of
                            // 0
                            if !force_drop && usage.usage_count == 1 && !usage.reassigned {
                                report_change!("sequences: Dropping inlined variable");
                                a.name.take();
                            }
                        }
                    }

                    if can_take_init || force_drop {
                        let init = a.init.take();

                        if let Some(usage) = self.data.vars.get(&left_id.to_id()) {
                            if usage.var_kind == Some(VarDeclKind::Const) {
                                a.init = Some(Expr::undefined(DUMMY_SP));
                            }
                        }

                        init
                    } else {
                        a.init.clone()
                    }
                    .unwrap_or_else(|| Expr::undefined(DUMMY_SP))
                }
                Mergable::Expr(a) => {
                    if can_remove || force_drop {
                        if let Expr::Assign(e) = a {
                            if e.op == op!("=") || drop_op {
                                report_change!(
                                    "sequences: Dropping assignment as we are going to drop the \
                                     variable declaration. ({})",
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

                    FnExpr {
                        ident: Some(a.ident.take()),
                        function: a.function.take(),
                    }
                    .into()
                }

                Mergable::Drop => {
                    unreachable!()
                }
            }
        };

        // x = 1, x += 2 => x = 3
        match b {
            Expr::Assign(b @ AssignExpr { op: op!("="), .. }) => {
                if let Some(b_left) = b.left.as_ident() {
                    if b_left.to_id() == left_id.to_id() {
                        report_change!("sequences: Merged assignment into another assignment");
                        self.changed = true;

                        let mut a_expr = take_a(a, true, false);
                        let a_expr = self.ignore_return_value(&mut a_expr);

                        if let Some(a) = a_expr {
                            b.right = SeqExpr {
                                span: DUMMY_SP,
                                exprs: vec![Box::new(a), b.right.take()],
                            }
                            .into();
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

                    let var_type = self
                        .data
                        .vars
                        .get(&left_id.to_id())
                        .and_then(|info| info.merged_var_type);
                    let Some(a_type) = a_type else {
                        return Ok(false);
                    };
                    let b_type = b.right.get_type();

                    if let Some(a_op) = a_op {
                        if can_drop_op_for(a_op, b.op, var_type, a_type, b_type) {
                            if b_left.to_id() == left_id.to_id() {
                                if let Some(bin_op) = b.op.to_update() {
                                    report_change!(
                                        "sequences: Merged assignment into another (op) assignment"
                                    );
                                    self.changed = true;

                                    b.op = a_op;

                                    let to = take_a(a, true, true);

                                    b.right = BinExpr {
                                        span: DUMMY_SP,
                                        op: bin_op,
                                        left: to,
                                        right: b.right.take(),
                                    }
                                    .into();
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
                abort: false,
                in_abort: false,
            };
            b.visit_with(&mut v);
            if v.expr_usage != 1 || v.pat_usage != 0 || v.abort {
                log_abort!(
                    "sequences: Aborting because of usage counts ({}{:?}, ref = {}, pat = {})",
                    left_id.sym,
                    left_id.ctxt,
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
            left_id.ctxt
        );

        let to = take_a(a, false, false);

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
        if b.op.may_short_circuit() {
            return Ok(true);
        }

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

    abort: bool,

    target: &'a Ident,
    in_lhs: bool,
    in_abort: bool,
}

impl Visit for UsageCounter<'_> {
    noop_visit_type!();

    fn visit_ident(&mut self, i: &Ident) {
        if self.target.sym == i.sym && self.target.ctxt == i.ctxt {
            if self.in_abort {
                self.abort = true;
                return;
            }

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

    fn visit_update_expr(&mut self, e: &UpdateExpr) {
        let old_in_abort = self.in_abort;
        self.in_abort = true;
        e.visit_children_with(self);
        self.in_abort = old_in_abort;
    }

    fn visit_await_expr(&mut self, e: &AwaitExpr) {
        let old_in_abort = self.in_abort;
        self.in_abort = true;
        e.visit_children_with(self);
        self.in_abort = old_in_abort;
    }

    fn visit_yield_expr(&mut self, e: &YieldExpr) {
        let old_in_abort = self.in_abort;
        self.in_abort = true;
        e.visit_children_with(self);
        self.in_abort = old_in_abort;
    }

    fn visit_pat(&mut self, p: &Pat) {
        let old = self.in_lhs;
        self.in_lhs = true;
        p.visit_children_with(self);
        self.in_lhs = old;
    }

    fn visit_assign_target(&mut self, p: &AssignTarget) {
        let old = self.in_lhs;
        self.in_lhs = true;
        p.visit_children_with(self);
        self.in_lhs = old;
    }

    fn visit_prop_name(&mut self, p: &PropName) {
        if let PropName::Computed(p) = p {
            p.visit_with(self)
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
}

#[derive(Debug)]
enum Mergable<'a> {
    Var(&'a mut VarDeclarator),
    Expr(&'a mut Expr),
    FnDecl(&'a mut FnDecl),
    Drop,
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
            Mergable::Drop => None,
        }
    }
}

#[derive(Debug, Default)]
struct MergeSequenceCache {
    ident_usage_cache: Vec<Option<FxHashSet<Id>>>,
    top_retain_cache: Vec<Option<bool>>,
}

impl MergeSequenceCache {
    fn new(cap: usize) -> Self {
        Self {
            ident_usage_cache: vec![None; cap],
            top_retain_cache: vec![None; cap],
        }
    }

    fn is_ident_used_by<N: VisitWith<IdentUsageCollector>>(
        &mut self,
        ident: &Id,
        node: &N,
        node_id: usize,
    ) -> bool {
        let idents = self.ident_usage_cache[node_id].get_or_insert_with(|| idents_used_by(node));
        idents.contains(ident)
    }

    fn invalidate(&mut self, node_id: usize) {
        self.ident_usage_cache[node_id] = None;
    }

    fn is_top_retain(&mut self, optimizer: &Optimizer, a: &Mergable, node_id: usize) -> bool {
        *self.top_retain_cache[node_id].get_or_insert_with(|| {
            if let Mergable::Drop = a {
                return true;
            }

            if let Some(a_id) = a.id() {
                if a_id.0 == "arguments"
                    || (matches!(a, Mergable::Var(_) | Mergable::FnDecl(_))
                        && !optimizer.may_remove_ident(&Ident::from(a_id)))
                {
                    return true;
                }
            }

            false
        })
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
fn can_drop_op_for(
    a: AssignOp,
    b: AssignOp,
    var_type: Option<Value<Type>>,
    a_type: Value<Type>,
    b_type: Value<Type>,
) -> bool {
    if a == op!("=") {
        return true;
    }

    if a == b {
        if a == op!("+=")
            && a_type.is_known()
            && a_type == b_type
            && (match var_type {
                Some(ty) => a_type == ty,
                None => true,
            })
        {
            return true;
        }

        return matches!(a, op!("*="));
    }

    false
}
