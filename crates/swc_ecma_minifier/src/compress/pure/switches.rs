use swc_common::{util::take::Take, EqIgnoreSpan, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{extract_var_ids, prepend_stmt, ExprExt, ExprFactory, StmtExt};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::Pure;
use crate::{
    compress::{
        pure::{Ctx, DropOpts},
        util::is_primitive,
    },
    util::idents_used_by,
};

/// Methods related to option `switches`.
impl Pure<'_> {
    pub(super) fn optimize_switch_stmt(&mut self, s: &mut Stmt) {
        if !self.options.switches {
            return;
        }

        let Stmt::Switch(..) = s else {
            return;
        };

        self.remove_empty_switch(s);

        self.optimize_small_switch(s);

        self.optimize_const_switches(s);

        self.optimize_switch_with_default_on_last(s);
    }

    fn remove_empty_switch(&mut self, s: &mut Stmt) {
        let Stmt::Switch(sw) = s else {
            return;
        };

        // Remove empty switch
        if sw.cases.is_empty() {
            self.changed = true;
            report_change!("switches: Removing empty switch");

            self.ignore_return_value(
                &mut sw.discriminant,
                DropOpts::DROP_NUMBER.union(DropOpts::DROP_STR_LIT),
            );

            let discriminant = sw.discriminant.take();
            if discriminant.is_invalid() {
                *s = Stmt::dummy();
                return;
            }

            *s = ExprStmt {
                span: sw.span,
                expr: discriminant,
            }
            .into();
        }
    }

    /// Handle switches in the case where we can know which branch will be
    /// taken.
    fn optimize_const_switches(&mut self, s: &mut Stmt) {
        if !self.options.switches || !self.options.dead_code {
            return;
        }

        let stmt = match s {
            Stmt::Switch(s) => s,
            _ => return,
        };

        // TODO: evaluate
        fn tail_expr(e: &Expr) -> &Expr {
            match e {
                Expr::Seq(s) => s.exprs.last().unwrap(),
                _ => e,
            }
        }

        let discriminant = &mut stmt.discriminant;

        let tail = if let Some(e) = is_primitive(self.expr_ctx, tail_expr(discriminant)) {
            e
        } else {
            return;
        };

        let mut var_ids = Vec::new();
        let mut cases = Vec::new();
        let mut exact = None;
        let mut may_match_other_than_exact = false;

        for (idx, case) in stmt.cases.iter_mut().enumerate() {
            if let Some(test) = case.test.as_ref() {
                if let Some(e) = is_primitive(self.expr_ctx, tail_expr(test)) {
                    if match (e, tail) {
                        (Expr::Lit(Lit::Num(e)), Expr::Lit(Lit::Num(tail))) => {
                            e.value == tail.value
                        }
                        _ => e.eq_ignore_span(tail),
                    } {
                        cases.push(case.take());

                        exact = Some(idx);
                        break;
                    } else {
                        var_ids.extend(extract_var_ids(&case.cons))
                    }
                } else {
                    if !may_match_other_than_exact
                        && !test.is_ident()
                        && !idents_used_by(test).is_empty()
                    {
                        may_match_other_than_exact = true;
                    }

                    cases.push(case.take())
                }
            } else {
                cases.push(case.take())
            }
        }

        if let Some(exact) = exact {
            let exact_case = cases.last_mut().unwrap();
            let mut terminate = exact_case.cons.iter().rev().any(|s| s.terminates());
            for case in stmt.cases[(exact + 1)..].iter_mut() {
                if terminate {
                    var_ids.extend(extract_var_ids(&case.cons))
                } else {
                    terminate |= case.cons.iter().rev().any(|s| s.terminates());
                    exact_case.cons.extend(case.cons.take())
                }
            }

            if !may_match_other_than_exact {
                // remove default if there's an exact match
                cases.retain(|case| {
                    if case.test.is_some() {
                        true
                    } else {
                        var_ids.extend(extract_var_ids(&case.cons));
                        false
                    }
                });
            }

            if cases.len() == 2 {
                let last = cases.last_mut().unwrap();

                self.changed = true;
                report_change!("switches: Turn exact match into default");
                // so that following pass could turn it into if else
                if let Some(test) = last.test.take() {
                    prepend_stmt(&mut last.cons, test.into_stmt())
                }
            }
        }

        if cases.len() == stmt.cases.len() {
            stmt.cases = cases;
            return;
        }

        self.optimize_switch_cases(&mut cases);

        let var_ids: Vec<VarDeclarator> = var_ids
            .into_iter()
            .map(|name| VarDeclarator {
                span: DUMMY_SP,
                name: name.into(),
                init: None,
                definite: Default::default(),
            })
            .collect();

        self.changed = true;

        if cases.len() == 1
            && (cases[0].test.is_none() || exact.is_some())
            && !contains_nested_break(&cases[0])
        {
            report_change!("switches: Removing a constant switch");

            let mut stmts = Vec::new();

            if !var_ids.is_empty() {
                stmts.push(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: Default::default(),
                        decls: var_ids,
                        ..Default::default()
                    }
                    .into(),
                )
            }

            self.ignore_return_value(
                discriminant,
                DropOpts::DROP_NUMBER.union(DropOpts::DROP_STR_LIT),
            );

            if !discriminant.is_invalid() {
                stmts.push(discriminant.take().into_stmt());
            }

            let mut last = cases.pop().unwrap();
            remove_last_break(&mut last.cons);

            if let Some(mut test) = last.test {
                // We are creating ExprStmt, so we can ignore return value
                self.ignore_return_value(
                    &mut test,
                    DropOpts::DROP_NUMBER.union(DropOpts::DROP_STR_LIT),
                );

                if !test.is_invalid() {
                    stmts.push(test.into_stmt());
                }
            }

            stmts.extend(last.cons);
            *s = BlockStmt {
                stmts,
                ..Default::default()
            }
            .into();
            return;
        }

        report_change!("switches: Removing unreachable cases from a constant switch");
        stmt.cases = cases;

        if !var_ids.is_empty() {
            *s = BlockStmt {
                stmts: vec![
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: Default::default(),
                        decls: var_ids,
                        ..Default::default()
                    }
                    .into(),
                    s.take(),
                ],
                ..Default::default()
            }
            .into()
        }
    }

    /// Drops useless switch cases and statements in it.
    ///
    /// This method will
    ///
    /// - drop the empty cases at the end.
    /// - drop break at last case
    /// - merge branch with default at the end
    pub(super) fn optimize_switch_cases(&mut self, cases: &mut Vec<SwitchCase>) {
        if !self.options.switches || !self.options.dead_code || cases.is_empty() {
            return;
        }

        self.merge_cases_with_same_cons(cases);

        // last case with no empty body
        let mut last = 0;

        for (idx, case) in cases.iter_mut().enumerate().rev() {
            self.changed |= remove_last_break(&mut case.cons);

            if case
                .cons
                .iter()
                .any(|stmt| stmt.may_have_side_effects(self.expr_ctx) || stmt.terminates())
            {
                last = idx + 1;
                break;
            }
        }

        let has_side_effect = cases.iter().skip(last).rposition(|case| {
            case.test
                .as_deref()
                .map(|test| test.may_have_side_effects(self.expr_ctx))
                .unwrap_or(false)
        });

        if let Some(has_side_effect) = has_side_effect {
            last += has_side_effect + 1
        }

        let default = cases.iter().position(|case| case.test.is_none());

        // if default is before empty cases, we must ensure empty case is preserved
        if last < cases.len() && default.map(|idx| idx >= last).unwrap_or(true) {
            self.changed = true;
            report_change!("switches: Removing empty cases at the end");
            cases.drain(last..);
        }

        if let Some(default) = default {
            if cases.is_empty() {
                return;
            }

            let end = cases
                .iter()
                .skip(default)
                .position(|case| {
                    case.cons
                        .iter()
                        .any(|stmt| stmt.may_have_side_effects(self.expr_ctx) || stmt.terminates())
                })
                .unwrap_or(0)
                + default;

            if end != cases.len() - 1 {
                return;
            }
            let start = cases.iter().enumerate().rposition(|(idx, case)| {
                case.test
                    .as_deref()
                    .map(|test| test.may_have_side_effects(self.expr_ctx))
                    .unwrap_or(false)
                    || (idx != end
                        && case.cons.iter().any(|stmt| {
                            stmt.may_have_side_effects(self.expr_ctx) || stmt.terminates()
                        }))
            });

            let start = start.map(|s| s + 1).unwrap_or(0);

            if start <= default {
                if start < end {
                    cases[start].cons = cases[end].cons.take();
                    cases.drain((start + 1)..);
                    cases[start].test = None;
                }
            } else {
                if start <= end {
                    cases[start].cons = cases[end].cons.take();
                    cases.drain(start..);
                }
            }
        }
    }

    /// If a case ends with break but content is same with the another case
    /// without break case order, except the break statement, we merge
    /// them.
    fn merge_cases_with_same_cons(&mut self, cases: &mut Vec<SwitchCase>) {
        let mut i = 0;
        let len = cases.len();

        // may some smarter person find a better solution
        while i < len {
            if cases[i].cons.is_empty() {
                i += 1;
                continue;
            }
            let mut block_start = i + 1;
            let mut cannot_cross_block = false;

            for j in (i + 1)..len {
                cannot_cross_block |= cases[j]
                    .test
                    .as_deref()
                    .map(|test| is_primitive(self.expr_ctx, test).is_none())
                    .unwrap_or(false)
                    || !(cases[j].cons.is_empty()
                        || cases[j].cons.iter().rev().any(|s| s.terminates())
                        || j == cases.len() - 1);

                if cases[j].cons.is_empty() {
                    continue;
                }

                if cannot_cross_block && block_start != i + 1 {
                    break;
                }

                block_start = j + 1;

                // To merge cases, the first one should be terminate the switch statement.
                //
                // Otherwise fallthough will be skipped
                let case_i_terminates = cases[i]
                    .cons
                    .last()
                    .map(|s| s.terminates())
                    .unwrap_or(false);

                // first case with a body and don't cross non-primitive branch
                let found = case_i_terminates
                    && if j != len - 1 {
                        cases[i].cons.eq_ignore_span(&cases[j].cons)
                    } else {
                        if let Some(Stmt::Break(BreakStmt { label: None, .. })) =
                            cases[i].cons.last()
                        {
                            SyntaxContext::within_ignored_ctxt(|| {
                                cases[i].cons[..(cases[i].cons.len() - 1)]
                                    .eq_ignore_span(&cases[j].cons)
                            })
                        } else {
                            SyntaxContext::within_ignored_ctxt(|| {
                                cases[i].cons.eq_ignore_span(&cases[j].cons)
                            })
                        }
                    };

                if found {
                    self.changed = true;
                    report_change!("switches: Merging cases with same cons");
                    let mut len = 1;
                    while len < j && cases[j - len].cons.is_empty() {
                        len += 1;
                    }
                    cases[j].cons = cases[i].cons.take();
                    cases[(i + 1)..=j].rotate_right(len);
                    i += len;
                }
            }

            i += 1;
        }
    }

    /// Try turn switch into if and remove empty switch
    fn optimize_small_switch(&mut self, s: &mut Stmt) {
        if self.ctx.contains(Ctx::IS_LABEL_BODY) {
            return;
        }

        if let Stmt::Switch(sw) = s {
            match &mut *sw.cases {
                [] => {
                    self.changed = true;
                    report_change!("switches: Removing empty switch");
                    *s = ExprStmt {
                        span: sw.span,
                        expr: sw.discriminant.take(),
                    }
                    .into()
                }
                [case] => {
                    if contains_nested_break(case) {
                        return;
                    }
                    self.changed = true;
                    report_change!("switches: Turn one case switch into if");
                    drop_break_and_postfix(&mut case.cons);

                    let case = case.take();
                    let mut discriminant = sw.discriminant.take();

                    if let Some(test) = case.test {
                        let test = BinExpr {
                            left: discriminant,
                            right: test,
                            op: op!("==="),
                            span: DUMMY_SP,
                        }
                        .into();

                        *s = IfStmt {
                            span: sw.span,
                            test,
                            cons: Box::new(Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: case.cons,
                                ..Default::default()
                            })),
                            alt: None,
                        }
                        .into()
                    } else {
                        self.ignore_return_value(
                            &mut discriminant,
                            DropOpts::DROP_NUMBER.union(DropOpts::DROP_STR_LIT),
                        );

                        let mut stmts = vec![];
                        if !discriminant.is_invalid() {
                            stmts.push(discriminant.take().into_stmt());
                        }
                        stmts.extend(case.cons);
                        *s = BlockStmt {
                            span: sw.span,
                            stmts,
                            ..Default::default()
                        }
                        .into()
                    }
                }
                [first, second] if first.test.is_none() || second.test.is_none() => {
                    if contains_nested_break(first) || contains_nested_break(second) {
                        return;
                    }
                    self.changed = true;
                    report_change!("switches: Turn two cases switch into if else");
                    let terminate = first.cons.iter().rev().any(|s| s.terminates());

                    if terminate {
                        remove_last_break(&mut first.cons);
                        remove_last_break(&mut second.cons);
                        // they cannot both be default as that's syntax error
                        let (def, case) = if first.test.is_none() {
                            (first, second)
                        } else {
                            (second, first)
                        };
                        *s = IfStmt {
                            span: sw.span,
                            test: BinExpr {
                                span: DUMMY_SP,
                                op: op!("==="),
                                left: sw.discriminant.take(),
                                right: case.test.take().unwrap(),
                            }
                            .into(),
                            cons: Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: case.cons.take(),
                                ..Default::default()
                            })
                            .into(),
                            alt: Some(
                                Stmt::Block(BlockStmt {
                                    span: DUMMY_SP,
                                    stmts: def.cons.take(),
                                    ..Default::default()
                                })
                                .into(),
                            ),
                        }
                        .into()
                    } else {
                        let mut stmts = vec![Stmt::If(IfStmt {
                            span: DUMMY_SP,
                            test: Expr::Bin(if first.test.is_none() {
                                BinExpr {
                                    span: DUMMY_SP,
                                    op: op!("!=="),
                                    left: sw.discriminant.take(),
                                    right: second.test.take().unwrap(),
                                }
                            } else {
                                BinExpr {
                                    span: DUMMY_SP,
                                    op: op!("==="),
                                    left: sw.discriminant.take(),
                                    right: first.test.take().unwrap(),
                                }
                            })
                            .into(),
                            cons: Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: first.cons.take(),
                                ..Default::default()
                            })
                            .into(),
                            alt: None,
                        })];
                        stmts.extend(second.cons.take());
                        *s = BlockStmt {
                            span: sw.span,
                            stmts,
                            ..Default::default()
                        }
                        .into()
                    }
                }
                _ => (),
            }
        }
    }

    fn optimize_switch_with_default_on_last(&mut self, stmt: &mut Stmt) {
        let Stmt::Switch(s) = stmt else {
            return;
        };

        let is_default_last = matches!(s.cases.last(), Some(SwitchCase { test: None, .. }));

        // True if all cases except default is empty.
        let is_all_case_empty = s
            .cases
            .iter()
            .all(|case| case.test.is_none() || case.cons.is_empty());

        let is_all_case_side_effect_free = s.cases.iter().all(|case| {
            case.test
                .as_ref()
                .map(|e| e.is_ident() || !e.may_have_side_effects(self.expr_ctx))
                .unwrap_or(true)
        });

        if is_default_last
            && is_all_case_empty
            && is_all_case_side_effect_free
            && !contains_nested_break(s.cases.last().unwrap())
        {
            let mut exprs = Vec::new();
            self.ignore_return_value(
                &mut s.discriminant,
                DropOpts::DROP_NUMBER.union(DropOpts::DROP_STR_LIT),
            );
            if !s.discriminant.is_invalid() {
                exprs.push(s.discriminant.take());
            }

            exprs.extend(
                s.cases
                    .iter_mut()
                    .filter_map(|case| case.test.take())
                    .filter_map(|mut e| {
                        self.ignore_return_value(
                            &mut e,
                            DropOpts::DROP_NUMBER.union(DropOpts::DROP_STR_LIT),
                        );
                        if e.is_invalid() {
                            None
                        } else {
                            Some(e)
                        }
                    }),
            );

            let mut stmts = s.cases.pop().unwrap().cons;
            drop_break_and_postfix(&mut stmts);

            if !exprs.is_empty() {
                prepend_stmt(
                    &mut stmts,
                    ExprStmt {
                        span: DUMMY_SP,
                        expr: Expr::from_exprs(exprs),
                    }
                    .into(),
                );
            }

            report_change!("switches: Turn switch with default on last into block");
            self.changed = true;
            let block: Stmt = BlockStmt {
                span: s.span,
                stmts,
                ..Default::default()
            }
            .into();
            *stmt = block;
        }
    }
}

fn drop_break_and_postfix(cons: &mut Vec<Stmt>) {
    let terminates_rpos = cons.iter().rposition(|s| s.terminates());

    if let Some(terminates_rpos) = terminates_rpos {
        cons.truncate(terminates_rpos + 1);
    }

    if let Some(last) = cons.last_mut() {
        if let Stmt::Break(BreakStmt { label: None, .. }) = last {
            *last = Stmt::dummy();
        }
    }
}

fn remove_last_break(stmt: &mut Vec<Stmt>) -> bool {
    match stmt.last_mut() {
        Some(Stmt::Break(BreakStmt { label: None, .. })) => {
            report_change!("switches: Removing `break` at the end");
            stmt.pop();
            true
        }
        Some(Stmt::If(i)) => {
            let mut changed = false;
            match &mut *i.cons {
                Stmt::Break(BreakStmt { label: None, .. }) => {
                    report_change!("switches: Removing `break` at the end");
                    i.cons.take();
                    changed = true
                }
                Stmt::Block(b) => changed |= remove_last_break(&mut b.stmts),
                _ => (),
            };
            if let Some(alt) = i.alt.as_mut() {
                match &mut **alt {
                    Stmt::Break(BreakStmt { label: None, .. }) => {
                        report_change!("switches: Removing `break` at the end");
                        alt.take();
                        changed = true
                    }
                    Stmt::Block(b) => changed |= remove_last_break(&mut b.stmts),
                    _ => (),
                };
            }
            changed
        }
        Some(Stmt::Try(t)) => {
            let mut changed = false;
            changed |= remove_last_break(&mut t.block.stmts);

            if let Some(h) = t.handler.as_mut() {
                changed |= remove_last_break(&mut h.body.stmts);
            }
            if let Some(f) = t.finalizer.as_mut() {
                changed |= remove_last_break(&mut f.stmts);
            }
            changed
        }
        Some(Stmt::Block(BlockStmt { stmts, .. })) => remove_last_break(stmts),
        _ => false,
    }
}

fn contains_nested_break(case: &SwitchCase) -> bool {
    // wait for DCE to work
    let terminator = case.cons.iter().rposition(|s| s.terminates());
    if terminator.is_some_and(|t| t != case.cons.len() - 1) {
        return true;
    }

    let mut v = BreakFinder {
        top_level: true,
        nested_unlabelled_break: false,
    };
    case.visit_with(&mut v);
    v.nested_unlabelled_break
}

#[derive(Default)]
struct BreakFinder {
    top_level: bool,
    nested_unlabelled_break: bool,
}

impl Visit for BreakFinder {
    noop_visit_type!(fail);

    fn visit_break_stmt(&mut self, s: &BreakStmt) {
        if !self.top_level && s.label.is_none() {
            self.nested_unlabelled_break = true;
        }
    }

    fn visit_if_stmt(&mut self, i: &IfStmt) {
        if self.top_level {
            self.top_level = false;
            i.visit_children_with(self);
            self.top_level = true;
        } else {
            i.visit_children_with(self);
        }
    }

    /// We don't care about breaks in a loop
    fn visit_for_stmt(&mut self, _: &ForStmt) {}

    /// We don't care about breaks in a loop
    fn visit_for_in_stmt(&mut self, _: &ForInStmt) {}

    /// We don't care about breaks in a loop
    fn visit_for_of_stmt(&mut self, _: &ForOfStmt) {}

    /// We don't care about breaks in a loop
    fn visit_do_while_stmt(&mut self, _: &DoWhileStmt) {}

    /// We don't care about breaks in a loop
    fn visit_while_stmt(&mut self, _: &WhileStmt) {}

    fn visit_switch_stmt(&mut self, _: &SwitchStmt) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_class(&mut self, _: &Class) {}
}
