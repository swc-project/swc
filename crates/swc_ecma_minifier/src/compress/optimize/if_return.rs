use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_optimization::debug_assert_valid;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::Optimizer;
#[cfg(feature = "debug")]
use crate::debug::dump;
use crate::{compress::util::is_pure_undefined, util::ExprOptExt};

/// Methods related to the option `if_return`. All methods are noop if
/// `if_return` is false.
impl Optimizer<'_> {
    pub(super) fn merge_nested_if(&mut self, s: &mut IfStmt) {
        if !self.options.conditionals && !self.options.bools {
            return;
        }

        if s.alt.is_some() {
            return;
        }

        if let Stmt::If(IfStmt {
            test,
            cons,
            alt: None,
            ..
        }) = &mut *s.cons
        {
            self.changed = true;
            report_change!("if_return: Merging nested if statements");

            s.test = BinExpr {
                span: s.test.span(),
                op: op!("&&"),
                left: s.test.take(),
                right: test.take(),
            }
            .into();
            s.cons = cons.take();
        }
    }

    pub(super) fn merge_if_returns(
        &mut self,
        stmts: &mut Vec<Stmt>,
        terminates: bool,
        is_fn_body: bool,
    ) {
        if !self.options.if_return {
            return;
        }

        for stmt in stmts.iter_mut() {
            self.merge_nested_if_returns(stmt, terminates);

            debug_assert_valid(&*stmt);
        }

        if terminates || is_fn_body {
            self.merge_if_returns_inner(stmts, !is_fn_body);
        }
    }

    #[allow(clippy::only_used_in_recursion)]
    fn merge_nested_if_returns(&mut self, s: &mut Stmt, can_work: bool) {
        let terminate = can_merge_as_if_return(&*s);

        match s {
            Stmt::Block(s) => {
                self.merge_if_returns(&mut s.stmts, terminate, false);

                debug_assert_valid(&*s);
            }
            Stmt::If(s) => {
                self.merge_nested_if_returns(&mut s.cons, can_work);

                debug_assert_valid(&s.cons);

                if let Some(alt) = s.alt.as_deref_mut() {
                    self.merge_nested_if_returns(alt, can_work);

                    debug_assert_valid(&*alt);
                }
            }
            _ => {}
        }
    }

    /// Merge simple return statements in if statements.
    ///
    /// # Example
    ///
    /// ## Input
    ///
    /// ```js
    /// function foo() {
    ///     if (a) return foo();
    ///     return bar()
    /// }
    /// ```
    ///
    /// ## Output
    ///
    /// ```js
    /// function foo() {
    ///     return a ? foo() : bar();
    /// }
    /// ```
    fn merge_if_returns_inner(&mut self, stmts: &mut Vec<Stmt>, should_preserve_last_return: bool) {
        if !self.options.if_return {
            return;
        }

        // for stmt in stmts.iter_mut() {
        //     let ctx = Ctx {
        //         is_nested_if_return_merging: true,
        //         ..self.ctx.clone()
        //     };
        //     self.with_ctx(ctx).merge_nested_if_returns(stmt, terminate);
        // }

        if stmts.len() <= 1 {
            return;
        }

        let idx_of_not_mergable =
            stmts
                .iter()
                .enumerate()
                .rposition(|(idx, stmt)| match stmt.as_stmt() {
                    Some(v) => !self.can_merge_stmt_as_if_return(v, stmts.len() - 1 == idx),
                    None => true,
                });
        let skip = idx_of_not_mergable.map(|v| v + 1).unwrap_or(0);
        trace_op!("if_return: Skip = {}", skip);
        let mut last_idx = stmts.len() - 1;

        {
            loop {
                let s = stmts.get(last_idx);
                let s = match s {
                    Some(s) => s,
                    _ => break,
                };

                if let Stmt::Decl(Decl::Var(v)) = s {
                    if v.decls.iter().all(|v| v.init.is_none()) {
                        if last_idx == 0 {
                            break;
                        }
                        last_idx -= 1;
                        continue;
                    }
                }

                break;
            }
        }

        if last_idx <= skip {
            log_abort!("if_return: [x] Aborting because of skip");
            return;
        }

        {
            let stmts = &stmts[skip..=last_idx];
            let return_count: usize = stmts.iter().map(count_leaping_returns).sum();

            // There's no return statement so merging requires injecting unnecessary `void
            // 0`
            if return_count == 0 {
                log_abort!("if_return: [x] Aborting because we failed to find return");
                return;
            }

            // If the last statement is a return statement and last - 1 is an if statement
            // is without return, we don't need to fold it as `void 0` is too much for such
            // cases.

            let if_return_count = stmts
                .iter()
                .filter(|s| match s {
                    Stmt::If(IfStmt {
                        cons, alt: None, ..
                    }) => always_terminates_with_return_arg(cons),
                    _ => false,
                })
                .count();

            if stmts.len() >= 2 {
                match (
                    &stmts[stmts.len() - 2].as_stmt(),
                    &stmts[stmts.len() - 1].as_stmt(),
                ) {
                    (_, Some(Stmt::If(IfStmt { alt: None, .. }) | Stmt::Expr(..)))
                        if if_return_count <= 1 =>
                    {
                        log_abort!(
                            "if_return: [x] Aborting because last stmt is a not return stmt"
                        );
                        return;
                    }

                    (
                        Some(Stmt::If(IfStmt {
                            cons, alt: None, ..
                        })),
                        Some(Stmt::Return(..)),
                    ) => match &**cons {
                        Stmt::Return(ReturnStmt { arg: Some(..), .. }) => {}
                        _ => {
                            log_abort!(
                                "if_return: [x] Aborting because stmt before last is an if stmt \
                                 and cons of it is not a return stmt"
                            );
                            return;
                        }
                    },

                    (
                        Some(Stmt::Block(BlockStmt { stmts: s1, .. })),
                        Some(Stmt::Block(BlockStmt { stmts: s2, .. })),
                    ) if s1.iter().any(|s| matches!(s, Stmt::Return(..)))
                        && s2.iter().any(|s| matches!(s, Stmt::Return(..))) =>
                    {
                        log_abort!("if_return: [x] Aborting because early return is observed");
                        return;
                    }

                    _ => {}
                }
            }
        }

        {
            let stmts = &stmts[..=last_idx];
            let start = stmts
                .iter()
                .enumerate()
                .skip(skip)
                .position(|(idx, stmt)| match stmt.as_stmt() {
                    Some(v) => self.can_merge_stmt_as_if_return(v, stmts.len() - 1 == idx),
                    None => false,
                })
                .unwrap_or(0);

            let ends_with_mergable = stmts
                .last()
                .map(|stmt| match stmt.as_stmt() {
                    Some(Stmt::If(IfStmt { alt: None, .. }))
                        if self.ctx.is_nested_if_return_merging =>
                    {
                        false
                    }
                    Some(s) => self.can_merge_stmt_as_if_return(s, true),
                    _ => false,
                })
                .unwrap();

            if stmts.len() == start + skip + 1 || !ends_with_mergable {
                return;
            }

            let can_merge =
                stmts
                    .iter()
                    .enumerate()
                    .skip(skip)
                    .all(|(idx, stmt)| match stmt.as_stmt() {
                        Some(s) => self.can_merge_stmt_as_if_return(s, stmts.len() - 1 == idx),
                        _ => false,
                    });
            if !can_merge {
                return;
            }
        }

        report_change!("if_return: Merging returns");

        self.changed = true;

        let mut cur: Option<Box<Expr>> = None;
        let mut new = Vec::with_capacity(stmts.len());

        let len = stmts.len();

        for (idx, stmt) in stmts.take().into_iter().enumerate() {
            if let Some(not_mergable) = idx_of_not_mergable {
                if idx < not_mergable {
                    new.push(stmt);
                    continue;
                }
            }
            if idx > last_idx {
                new.push(stmt);
                continue;
            }

            let stmt = if !self.can_merge_stmt_as_if_return(&stmt, len - 1 == idx) {
                debug_assert_eq!(cur, None);
                new.push(stmt);
                continue;
            } else {
                stmt
            };
            let is_nonconditional_return = matches!(stmt, Stmt::Return(..));
            let new_expr = self.merge_if_returns_to(stmt, Vec::new());
            match new_expr {
                Expr::Seq(v) => match &mut cur {
                    Some(cur) => match &mut **cur {
                        Expr::Cond(cur) => {
                            let seq = get_rightmost_alt_of_cond(cur).force_seq();
                            seq.exprs.extend(v.exprs);
                        }
                        Expr::Seq(cur) => {
                            cur.exprs.extend(v.exprs);
                        }
                        _ => {
                            unreachable!(
                                "if_return: cur must be one of None, Expr::Seq or Expr::Cond(with \
                                 alt Expr::Seq)"
                            )
                        }
                    },
                    None => cur = Some(v.into()),
                },
                Expr::Cond(v) => match &mut cur {
                    Some(cur) => match &mut **cur {
                        Expr::Cond(cur) => {
                            let alt = get_rightmost_alt_of_cond(cur);

                            let (span, exprs) = {
                                let prev_seq = alt.force_seq();
                                prev_seq.exprs.push(v.test);
                                let exprs = prev_seq.exprs.take();

                                (prev_seq.span, exprs)
                            };

                            *alt = CondExpr {
                                span: DUMMY_SP,
                                test: SeqExpr { span, exprs }.into(),
                                cons: v.cons,
                                alt: v.alt,
                            }
                            .into();
                        }
                        Expr::Seq(prev_seq) => {
                            prev_seq.exprs.push(v.test);
                            let exprs = prev_seq.exprs.take();

                            *cur = CondExpr {
                                span: DUMMY_SP,
                                test: Box::new(
                                    SeqExpr {
                                        span: prev_seq.span,
                                        exprs,
                                    }
                                    .into(),
                                ),
                                cons: v.cons,
                                alt: v.alt,
                            }
                            .into();
                        }
                        _ => {
                            unreachable!(
                                "if_return: cur must be one of None, Expr::Seq or Expr::Cond(with \
                                 alt Expr::Seq)"
                            )
                        }
                    },
                    None => cur = Some(v.into()),
                },
                _ => {
                    unreachable!(
                        "if_return: merge_if_returns_to should return one of None, Expr::Seq or \
                         Expr::Cond"
                    )
                }
            }

            if is_nonconditional_return {
                break;
            }
        }

        if let Some(mut cur) = cur {
            self.normalize_expr(&mut cur);

            match &*cur {
                Expr::Seq(seq)
                    if !should_preserve_last_return
                        && seq
                            .exprs
                            .last()
                            .map(|v| is_pure_undefined(&self.ctx.expr_ctx, v))
                            .unwrap_or(true) =>
                {
                    let expr = self.ignore_return_value(&mut cur);

                    if let Some(cur) = expr {
                        new.push(
                            ExprStmt {
                                span: DUMMY_SP,
                                expr: Box::new(cur),
                            }
                            .into(),
                        )
                    } else {
                        trace_op!("if_return: Ignoring return value");
                    }
                }
                _ => {
                    new.push(
                        ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(cur),
                        }
                        .into(),
                    );
                }
            }
        }

        *stmts = new;
    }

    /// This method returns [Expr::Seq] or [Expr::Cond].
    ///
    /// `exprs` is a simple optimization.
    fn merge_if_returns_to(&mut self, stmt: Stmt, mut exprs: Vec<Box<Expr>>) -> Expr {
        //
        match stmt {
            Stmt::Block(s) => {
                assert_eq!(s.stmts.len(), 1);
                self.merge_if_returns_to(s.stmts.into_iter().next().unwrap(), exprs)
            }

            Stmt::If(IfStmt {
                span,
                test,
                cons,
                alt,
                ..
            }) => {
                let cons = Box::new(self.merge_if_returns_to(*cons, Vec::new()));
                let alt = match alt {
                    Some(alt) => Box::new(self.merge_if_returns_to(*alt, Vec::new())),
                    None => Expr::undefined(DUMMY_SP),
                };

                exprs.push(test);

                CondExpr {
                    span,
                    test: SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    }
                    .into(),
                    cons,
                    alt,
                }
                .into()
            }
            Stmt::Expr(stmt) => {
                exprs.push(
                    UnaryExpr {
                        span: DUMMY_SP,
                        op: op!("void"),
                        arg: stmt.expr,
                    }
                    .into(),
                );
                SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                }
                .into()
            }
            Stmt::Return(stmt) => {
                let span = stmt.span;
                exprs.push(stmt.arg.unwrap_or_else(|| Expr::undefined(span)));
                SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                }
                .into()
            }
            _ => unreachable!(),
        }
    }

    fn can_merge_stmt_as_if_return(&self, s: &Stmt, is_last: bool) -> bool {
        // if !res {
        //     trace!("Cannot merge: {}", dump(s));
        // }

        match s {
            Stmt::Expr(..) => true,
            Stmt::Return(..) => is_last,
            Stmt::Block(s) => {
                s.stmts.len() == 1 && self.can_merge_stmt_as_if_return(&s.stmts[0], is_last)
            }
            Stmt::If(stmt) => {
                matches!(&*stmt.cons, Stmt::Return(..))
                    && matches!(
                        stmt.alt.as_deref(),
                        None | Some(Stmt::Return(..) | Stmt::Expr(..))
                    )
            }
            _ => false,
        }
    }
}

fn get_rightmost_alt_of_cond(e: &mut CondExpr) -> &mut Expr {
    match &mut *e.alt {
        Expr::Cond(alt) => get_rightmost_alt_of_cond(alt),
        alt => alt,
    }
}

fn count_leaping_returns<N>(n: &N) -> usize
where
    N: VisitWith<ReturnFinder>,
{
    let mut v = ReturnFinder::default();
    n.visit_with(&mut v);
    v.count
}

#[derive(Default)]
pub(super) struct ReturnFinder {
    count: usize,
}

impl Visit for ReturnFinder {
    noop_visit_type!();

    fn visit_return_stmt(&mut self, n: &ReturnStmt) {
        n.visit_children_with(self);
        self.count += 1;
    }

    fn visit_function(&mut self, _: &Function) {}

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}
}

fn always_terminates_with_return_arg(s: &Stmt) -> bool {
    match s {
        Stmt::Return(ReturnStmt { arg: Some(..), .. }) => true,
        Stmt::If(IfStmt { cons, alt, .. }) => {
            always_terminates_with_return_arg(cons)
                && alt
                    .as_deref()
                    .map(always_terminates_with_return_arg)
                    .unwrap_or(false)
        }
        Stmt::Block(s) => s.stmts.iter().any(always_terminates_with_return_arg),

        _ => false,
    }
}

fn can_merge_as_if_return(s: &Stmt) -> bool {
    fn cost(s: &Stmt) -> Option<isize> {
        if let Stmt::Block(..) = s {
            if !swc_ecma_utils::StmtExt::terminates(s) {
                return None;
            }
        }

        match s {
            Stmt::Return(ReturnStmt { arg: Some(..), .. }) => Some(-1),

            Stmt::Return(ReturnStmt { arg: None, .. }) => Some(0),

            Stmt::Throw(..) | Stmt::Break(..) | Stmt::Continue(..) => Some(0),

            Stmt::If(IfStmt { cons, alt, .. }) => {
                Some(cost(cons)? + alt.as_deref().and_then(cost).unwrap_or(0))
            }
            Stmt::Block(s) => {
                let mut sum = 0;
                let mut found = false;
                for s in s.stmts.iter().rev() {
                    let c = cost(s);
                    if let Some(c) = c {
                        found = true;
                        sum += c;
                    }
                }
                if found {
                    Some(sum)
                } else {
                    None
                }
            }

            _ => None,
        }
    }

    let c = cost(s);

    trace_op!("merging cost of `{}` = {:?}", dump(s, false), c);

    c.unwrap_or(0) < 0
}
