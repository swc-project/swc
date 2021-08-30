use super::{is_pure_undefined, Optimizer};
use crate::{
    compress::{
        optimize::util::replace_id_with_expr,
        util::{get_lhs_ident, get_lhs_ident_mut, is_directive, is_ident_used_by},
    },
    debug::dump,
    mode::Mode,
    option::CompressOptions,
    util::{idents_used_by, idents_used_by_ignoring_nested, ExprOptExt, MoudleItemExt},
};
use retain_mut::RetainMut;
use std::mem::take;
use swc_atoms::js_word;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{contains_this_expr, ident::IdentLike, undefined, ExprExt, Id, StmtLike};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

/// Methods related to the option `sequences`. All methods are noop if
/// `sequences` is false.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
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
                        (Some(l @ Stmt::Expr(..)), Some(r)) => {
                            if is_directive(&l) || is_directive(&r) {
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
                                | Stmt::Return(ReturnStmt { .. })
                                | Stmt::Throw(ThrowStmt { .. })
                                | Stmt::For(ForStmt { init: None, .. })
                                | Stmt::For(ForStmt {
                                    init: Some(VarDeclOrExpr::Expr(..)),
                                    ..
                                })
                                | Stmt::ForIn(..)
                                | Stmt::ForOf(..) => true,

                                Stmt::Decl(Decl::Var(
                                    v
                                    @
                                    VarDecl {
                                        kind: VarDeclKind::Var,
                                        ..
                                    },
                                )) => v.decls.iter().all(|vd| vd.init.is_none()),

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
                    Some(Stmt::Decl(Decl::Var(
                        v
                        @
                        VarDecl {
                            kind: VarDeclKind::Var,
                            ..
                        },
                    ))) => {
                        if v.decls.iter().all(|vd| vd.init.is_none()) {
                            return;
                        }
                    }

                    Some(Stmt::Decl(Decl::Fn(..))) => return,

                    _ => {}
                }
            }
        }

        log::debug!("sequences: Compressing statements as a sequences");

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
                                    if exprs.iter().all(|expr| match &**expr {
                                        Expr::Assign(..) => true,
                                        _ => false,
                                    }) {
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
                                        match e.first_expr_mut() {
                                            Expr::Assign(AssignExpr {
                                                op: op!("="),
                                                left,
                                                right,
                                                ..
                                            }) => {
                                                if get_lhs_ident_mut(left).is_some()
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

                                                    new_stmts.push(T::from_stmt(Stmt::For(stmt)));

                                                    continue;
                                                }
                                            }
                                            _ => {}
                                        }
                                    }
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

                        Stmt::Decl(Decl::Var(
                            var
                            @
                            VarDecl {
                                kind: VarDeclKind::Var,
                                ..
                            },
                        )) if var.decls.iter().all(|v| v.init.is_none()) => {
                            new_stmts.push(T::from_stmt(Stmt::Decl(Decl::Var(var))));
                        }

                        Stmt::Decl(Decl::Fn(..)) => {
                            new_stmts.push(T::from_stmt(stmt));
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
        log::debug!("sequences: Splitted a sequence exprssion to multiple expression statements");
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
            log::debug!("sequences: Lifting");
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
                                log::debug!("sequences: Hoisting `var` without init");
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

            match &*e.exprs[e.exprs.len() - 2] {
                Expr::Assign(assign) => {
                    if let Some(lhs) = get_lhs_ident(&assign.left) {
                        if lhs.sym == last_id.sym && lhs.span.ctxt == last_id.span.ctxt {
                            e.exprs.pop();
                            self.changed = true;
                            log::debug!("sequences: Shifting assignment");
                            return;
                        }
                    };
                }
                _ => {}
            }
        }
    }

    pub(super) fn shift_void(&mut self, e: &mut SeqExpr) {
        if e.exprs.len() < 2 {
            return;
        }

        match &*e.exprs[e.exprs.len() - 2] {
            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => return,
            _ => {}
        }

        if let Some(last) = e.exprs.last() {
            if is_pure_undefined(&last) {
                self.changed = true;
                log::debug!("sequences: Shifting void");

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

    pub(super) fn merge_sequences_in_stmts<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: MoudleItemExt,
    {
        fn exprs_of<'a>(s: &'a mut Stmt, options: &CompressOptions) -> Option<Vec<Mergable<'a>>> {
            Some(match s {
                Stmt::Expr(e) => vec![Mergable::Expr(&mut *e.expr)],
                Stmt::Decl(Decl::Var(
                    v
                    @
                    VarDecl {
                        kind: VarDeclKind::Var | VarDeclKind::Let,
                        ..
                    },
                )) => v.decls.iter_mut().map(Mergable::Var).collect(),
                Stmt::Return(ReturnStmt { arg: Some(arg), .. }) if options.sequences() => {
                    vec![Mergable::Expr(&mut **arg)]
                }
                Stmt::If(s) if options.sequences() => {
                    vec![Mergable::Expr(&mut *s.test)]
                }

                _ => return None,
            })
        }

        if !self.options.sequences() && !self.options.collapse_vars {
            if cfg!(feature = "debug") {
                log::trace!("sequences: [x] Disabled");
            }
            return;
        }

        if self.ctx.in_top_level() && !self.options.top_level() {
            if cfg!(feature = "debug") {
                log::trace!("sequences: [x] Top level");
            }
            return;
        }

        let mut exprs = vec![];
        let mut buf = vec![];

        for stmt in stmts.iter_mut() {
            let is_end = match stmt.as_stmt() {
                Some(Stmt::If(..)) => true,
                _ => false,
            };

            let items = if let Some(stmt) = stmt.as_stmt_mut() {
                exprs_of(stmt, self.options)
            } else {
                None
            };
            if let Some(items) = items {
                buf.extend(items)
            } else {
                exprs.push(take(&mut buf));
                continue;
            }
            if is_end {
                exprs.push(take(&mut buf));
            }
        }

        exprs.push(buf);

        if cfg!(feature = "debug") {
            log::trace!(
                "sequences: Merging statements: {:?}",
                exprs.iter().map(|v| v.len()).collect::<Vec<_>>()
            );
        }

        for mut exprs in exprs {
            self.merge_sequences_in_exprs(&mut exprs);
        }

        stmts.retain_mut(|stmt| match stmt.as_stmt_mut() {
            Some(Stmt::Decl(Decl::Var(v))) => {
                v.decls.retain(|decl| match decl.init.as_deref() {
                    Some(Expr::Invalid(..)) => false,
                    _ => true,
                });

                !v.decls.is_empty()
            }
            Some(Stmt::Expr(s)) if s.expr.is_invalid() => false,
            _ => true,
        });
    }

    pub(super) fn normalize_sequences(&self, seq: &mut SeqExpr) {
        for e in &mut seq.exprs {
            match &mut **e {
                Expr::Seq(e) => {
                    self.normalize_sequences(&mut *e);
                }
                _ => {}
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

        if !self.options.sequences() {
            return;
        }

        let mut exprs = e
            .exprs
            .iter_mut()
            .map(|e| &mut **e)
            .map(Mergable::Expr)
            .collect();

        self.merge_sequences_in_exprs(&mut exprs);

        e.exprs.retain(|e| !e.is_invalid());
    }

    /// Calls `merge_sequential_expr`.
    ///
    ///
    /// TODO(kdy1): Check for side effects and call merge_sequential_expr more
    /// if expressions between a and b are side-effect-free.
    fn merge_sequences_in_exprs(&mut self, exprs: &mut Vec<Mergable>) {
        for idx in 0..exprs.len() {
            for j in idx..exprs.len() {
                let (a1, a2) = exprs.split_at_mut(idx);

                if a1.is_empty() || a2.is_empty() {
                    break;
                }

                let a = a1.last_mut().unwrap();

                if self.merge_sequential_expr(
                    a,
                    match &mut a2[j - idx] {
                        Mergable::Var(b) => match b.init.as_deref_mut() {
                            Some(v) => v,
                            None => continue,
                        },
                        Mergable::Expr(e) => e,
                    },
                ) {
                    break;
                }

                match &a2[j - idx] {
                    Mergable::Var(_) => break,
                    Mergable::Expr(e2) => {
                        if !self.is_skippable_for_seq(Some(a), &*e2) {
                            if cfg!(feature = "debug") && false {
                                log::trace!("Cannot skip: {}", dump(&**e2));
                            }

                            break;
                        }

                        if let Some(id) = a1.last_mut().unwrap().id() {
                            if idents_used_by(&**e2).contains(&id) {
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    fn is_skippable_for_seq(&self, a: Option<&Mergable>, e: &Expr) -> bool {
        if self.ctx.in_try_block {
            return false;
        }

        if !e.may_have_side_effects() {
            return true;
        }

        match e {
            Expr::Ident(e) => {
                if let Some(a) = a {
                    match a {
                        Mergable::Var(a) => {
                            if is_ident_used_by(e.to_id(), &**a) {
                                return false;
                            }
                        }
                        Mergable::Expr(a) => {
                            if is_ident_used_by(e.to_id(), &**a) {
                                return false;
                            }
                        }
                    }
                }

                true
            }

            Expr::Lit(..) => true,
            Expr::Unary(UnaryExpr {
                op: op!("!") | op!("void") | op!("typeof"),
                arg,
                ..
            }) => self.is_skippable_for_seq(a, &arg),

            Expr::Bin(BinExpr { left, right, .. }) => {
                self.is_skippable_for_seq(a, &left) && self.is_skippable_for_seq(a, &right)
            }

            Expr::Assign(e) => {
                let left_id = get_lhs_ident(&e.left);
                let left_id = match left_id {
                    Some(v) => v,
                    _ => return false,
                };

                if let Some(a) = a {
                    match a {
                        Mergable::Var(a) => {
                            if is_ident_used_by(left_id.to_id(), &**a) {
                                return false;
                            }
                        }
                        Mergable::Expr(a) => {
                            if is_ident_used_by(left_id.to_id(), &**a) {
                                return false;
                            }
                        }
                    }
                }

                match &*e.right {
                    Expr::Lit(..) => return true,
                    _ => {}
                }

                if contains_this_expr(&*e.right) {
                    return false;
                }

                let used_ids = idents_used_by(&*e.right);
                if used_ids.is_empty() {
                    return true;
                }

                if used_ids.len() != 1 || !used_ids.contains(&left_id.to_id()) {
                    return false;
                }

                self.is_skippable_for_seq(a, &e.right)
            }

            Expr::Object(e) => {
                if e.props.is_empty() {
                    return true;
                }

                // TODO: Check for side effects in object properties.

                false
            }

            _ => false,
        }
    }

    /// Returns true if something is modified.
    fn merge_sequential_expr(&mut self, a: &mut Mergable, b: &mut Expr) -> bool {
        match a {
            Mergable::Var(..) => {}
            Mergable::Expr(a) => match a {
                Expr::Seq(a) => {
                    //
                    for a in a.exprs.iter_mut().rev() {
                        if self.merge_sequential_expr(&mut Mergable::Expr(a), b) {
                            return true;
                        }

                        if !self.is_skippable_for_seq(None, &a) {
                            return false;
                        }
                    }

                    return false;
                }
                _ => {}
            },
        }

        match b {
            Expr::Update(..) => return false,

            Expr::Cond(b) => {
                log::trace!("seq: Try test of cond");
                return self.merge_sequential_expr(a, &mut *b.test);
            }

            Expr::Unary(b) => {
                log::trace!("seq: Try arg of unary");
                return self.merge_sequential_expr(a, &mut b.arg);
            }

            Expr::Bin(BinExpr {
                op, left, right, ..
            }) => {
                log::trace!("seq: Try left of bin");
                if self.merge_sequential_expr(a, &mut **left) {
                    return true;
                }

                if !self.is_skippable_for_seq(Some(a), &left) {
                    return false;
                }

                match *op {
                    op!("&&") | op!("||") | op!("??") => return false,
                    _ => {}
                }

                log::trace!("seq: Try right of bin");
                return self.merge_sequential_expr(a, &mut **right);
            }

            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(obj),
                computed: false,
                ..
            }) => {
                log::trace!("seq: Try object of member");
                return self.merge_sequential_expr(a, &mut **obj);
            }

            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(obj),
                prop,
                computed: true,
                ..
            }) => {
                log::trace!("seq: Try object of member (computed)");
                if self.merge_sequential_expr(a, &mut **obj) {
                    return true;
                }

                if obj.may_have_side_effects() {
                    return false;
                }

                log::trace!("seq: Try prop of member (computed)");
                return self.merge_sequential_expr(a, &mut **prop);
            }

            Expr::Assign(b @ AssignExpr { op: op!("="), .. }) => {
                match &mut b.left {
                    PatOrExpr::Expr(b) => {
                        log::trace!("seq: Try lhs of assign");
                        if self.merge_sequential_expr(a, &mut **b) {
                            return true;
                        }

                        match &**b {
                            Expr::Ident(..) => {}

                            _ => {
                                return false;
                            }
                        }
                    }
                    PatOrExpr::Pat(b) => match &mut **b {
                        Pat::Expr(b) => {
                            log::trace!("seq: Try lhs of assign");
                            if self.merge_sequential_expr(a, &mut **b) {
                                return true;
                            }

                            match &**b {
                                Expr::Ident(..) => {}
                                _ => {
                                    return false;
                                }
                            }
                        }
                        Pat::Ident(..) => {}
                        _ => return false,
                    },
                }

                log::trace!("seq: Try rhs of assign");
                return self.merge_sequential_expr(a, &mut b.right);
            }

            Expr::Assign(b) => {
                match &mut b.left {
                    PatOrExpr::Expr(b) => match &**b {
                        Expr::Ident(..) => {}

                        _ => {
                            return false;
                        }
                    },
                    PatOrExpr::Pat(b) => match &mut **b {
                        Pat::Expr(b) => match &**b {
                            Expr::Ident(..) => {}
                            _ => {
                                return false;
                            }
                        },
                        Pat::Ident(..) => {}
                        _ => return false,
                    },
                }

                log::trace!("seq: Try rhs of assign with op");
                return self.merge_sequential_expr(a, &mut b.right);
            }

            Expr::Array(b) => {
                for elem in &mut b.elems {
                    match elem {
                        Some(elem) => {
                            log::trace!("seq: Try element of array");
                            if self.merge_sequential_expr(a, &mut elem.expr) {
                                return true;
                            }

                            match &*elem.expr {
                                Expr::Ident(..) => {}
                                _ => {
                                    // To preserve side-effects, we need to abort.
                                    break;
                                }
                            }
                        }
                        None => {}
                    }
                }

                return false;
            }

            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(b_callee),
                args: b_args,
                ..
            }) => {
                let is_this_undefined = b_callee.is_ident();
                log::trace!("seq: Try callee of call");
                if self.merge_sequential_expr(a, &mut **b_callee) {
                    if is_this_undefined {
                        match &**b_callee {
                            Expr::Member(..) => {
                                let zero = Box::new(Expr::Lit(Lit::Num(Number {
                                    span: DUMMY_SP,
                                    value: 0.0,
                                })));
                                log::trace!("injecting zero to preserve `this` in call");

                                *b_callee = Box::new(Expr::Seq(SeqExpr {
                                    span: b_callee.span(),
                                    exprs: vec![zero, b_callee.take()],
                                }));
                            }

                            _ => {}
                        }
                    }

                    return true;
                }

                if !self.is_skippable_for_seq(Some(a), &b_callee) {
                    return false;
                }

                for arg in b_args {
                    log::trace!("seq: Try arg of call");
                    if self.merge_sequential_expr(a, &mut arg.expr) {
                        return true;
                    }

                    if !self.is_skippable_for_seq(Some(a), &arg.expr) {
                        return false;
                    }
                }

                return false;
            }

            Expr::New(NewExpr {
                callee: b_callee, ..
            }) => {
                log::trace!("seq: Try callee of new");
                if self.merge_sequential_expr(a, &mut **b_callee) {
                    return true;
                }

                return false;
            }

            Expr::Seq(SeqExpr { exprs: b_exprs, .. }) => {
                for b_expr in b_exprs {
                    log::trace!("seq: Try elem of seq");

                    if self.merge_sequential_expr(a, &mut **b_expr) {
                        return true;
                    }

                    if !self.is_skippable_for_seq(Some(a), &b_expr) {
                        return false;
                    }
                }

                return false;
            }

            Expr::Object(ObjectLit { props, .. }) => {
                for prop in props {
                    match prop {
                        PropOrSpread::Spread(prop) => {
                            if self.merge_sequential_expr(a, &mut *prop.expr) {
                                return true;
                            }

                            return false;
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
                                if self.merge_sequential_expr(a, &mut key.expr) {
                                    return true;
                                }

                                if !self.is_skippable_for_seq(Some(a), &key.expr) {
                                    return false;
                                }
                            }

                            match &mut **prop {
                                Prop::KeyValue(prop) => {
                                    if self.merge_sequential_expr(a, &mut prop.value) {
                                        return true;
                                    }

                                    if !self.is_skippable_for_seq(Some(a), &prop.value) {
                                        return false;
                                    }
                                }
                                Prop::Assign(prop) => {
                                    if self.merge_sequential_expr(a, &mut prop.value) {
                                        return true;
                                    }

                                    if !self.is_skippable_for_seq(Some(a), &prop.value) {
                                        return false;
                                    }
                                }
                                _ => {}
                            }
                        }
                    }
                }

                return false;
            }

            _ => {}
        }

        // if cfg!(feature = "debug") && false {
        //     log::trace!(
        //         "sequences: Trying to merge `{}` => `{}`",
        //         dump(&*a),
        //         dump(&*b)
        //     );
        // }

        {
            // TODO(kdy1): Implement this.
            //
            // This requires tracking if `b` is in an assignment pattern.
            //
            // Update experssions can be inline.
            //
            // ++c, console.log(c)
            //
            // is same as
            //
            // console.log(c++)

            match a {
                Mergable::Var(_) => {}
                Mergable::Expr(..) => {}
            }
        }

        let mut right_val;
        let (left_id, right) = match a {
            Mergable::Expr(a) => {
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

                        let left_id = match get_lhs_ident(left) {
                            Some(v) => v,
                            None => {
                                log::trace!("[X] sequences: Aborting because lhs is not an id");
                                return false;
                            }
                        };

                        if let Some(usage) = self
                            .data
                            .as_ref()
                            .and_then(|data| data.vars.get(&left_id.to_id()))
                        {
                            if usage.declared_as_fn_expr {
                                log::trace!(
                                    "sequences: [X] Declared as fn expr ({}, {:?})",
                                    left_id.sym,
                                    left_id.span.ctxt
                                );
                                return false;
                            }
                        }

                        (left_id.clone(), right)
                    }
                    _ => return false,
                }
            }

            Mergable::Var(a) => {
                let left = match &a.name {
                    Pat::Ident(i) => i.id.clone(),
                    _ => return false,
                };

                if let Some(usage) = self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&left.to_id()))
                {
                    if usage.ref_count != 1 {
                        return false;
                    }
                    if usage.reassigned || !usage.is_fn_local {
                        return false;
                    }
                    match &mut a.init {
                        Some(v) => (left, v),
                        None => {
                            if usage.declared_count > 1 {
                                return false;
                            }

                            right_val = undefined(DUMMY_SP);
                            (left, &mut right_val)
                        }
                    }
                } else {
                    return false;
                }
            }
        };

        if right.is_this() || right.is_ident_ref_to(js_word!("arguments")) {
            return false;
        }
        if idents_used_by_ignoring_nested(&**right)
            .iter()
            .any(|v| v.0 == js_word!("arguments"))
        {
            return false;
        }

        {
            // Abort this if there's some side effects.
            //
            //
            // (rand = _.random(
            //     index++
            // )),
            // (shuffled[index - 1] = shuffled[rand]),
            // (shuffled[rand] = value);
            //
            //
            // rand should not be inlined because of `index`.

            let deps = idents_used_by_ignoring_nested(&*right);

            let used_by_b = idents_used_by(&*b);

            for id in &deps {
                if *id == left_id.to_id() {
                    continue;
                }

                if used_by_b.contains(id) {
                    log::trace!("[X] sequences: Aborting because of deps");
                    return false;
                }
            }
        }

        {
            let mut v = UsageCoutner {
                expr_usage: Default::default(),
                pat_usage: Default::default(),
                target: &left_id,
                in_lhs: false,
            };
            b.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
            if v.expr_usage != 1 || v.pat_usage != 0 {
                log::trace!(
                    "[X] sequences: Aborting because of usage counts ({}{:?}, ref = {}, pat = {})",
                    left_id.sym,
                    left_id.span.ctxt,
                    v.expr_usage,
                    v.pat_usage
                );
                return false;
            }
        }

        self.changed = true;
        log::debug!(
            "sequences: Inlining sequential expressions (`{}{:?}`)",
            left_id.sym,
            left_id.span.ctxt
        );

        let to = match a {
            Mergable::Var(a) => a.init.take().unwrap_or_else(|| undefined(DUMMY_SP)),
            Mergable::Expr(a) => Box::new(a.take()),
        };

        replace_id_with_expr(b, left_id.to_id(), to);

        true
    }
}

struct UsageCoutner<'a> {
    expr_usage: usize,
    pat_usage: usize,

    target: &'a Ident,
    in_lhs: bool,
}

impl Visit for UsageCoutner<'_> {
    noop_visit_type!();

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        if self.target.sym == i.sym && self.target.span.ctxt == i.span.ctxt {
            if self.in_lhs {
                self.pat_usage += 1;
            } else {
                self.expr_usage += 1;
            }
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e, self);

        if e.computed {
            let old = self.in_lhs;
            self.in_lhs = false;
            e.prop.visit_with(e, self);
            self.in_lhs = old;
        }
    }

    fn visit_pat(&mut self, p: &Pat, _: &dyn Node) {
        let old = self.in_lhs;
        self.in_lhs = true;
        p.visit_children_with(self);
        self.in_lhs = old;
    }

    fn visit_pat_or_expr(&mut self, p: &PatOrExpr, _: &dyn Node) {
        let old = self.in_lhs;
        self.in_lhs = true;
        p.visit_children_with(self);
        self.in_lhs = old;
    }
}

enum Mergable<'a> {
    Var(&'a mut VarDeclarator),
    Expr(&'a mut Expr),
}

impl Mergable<'_> {
    fn id(&self) -> Option<Id> {
        match self {
            Mergable::Var(s) => match &s.name {
                Pat::Ident(i) => Some(i.id.to_id()),
                _ => None,
            },
            Mergable::Expr(s) => match &**s {
                Expr::Assign(s) => get_lhs_ident(&s.left).map(|v| v.to_id()),
                _ => None,
            },
        }
    }
}
