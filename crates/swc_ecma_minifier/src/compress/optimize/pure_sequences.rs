use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprFactory, StmtLike};

use super::Optimizer;
use crate::compress::util::is_pure_undefined;

impl Optimizer<'_> {
    pub(super) fn drop_useless_ident_ref_in_seq(&mut self, seq: &mut SeqExpr) {
        if !self.options.collapse_vars {
            return;
        }

        if seq.exprs.len() < 2 {
            return;
        }

        if let (Expr::Assign(assign @ AssignExpr { op: op!("="), .. }), Expr::Ident(ident)) = (
            &*seq.exprs[seq.exprs.len() - 2],
            &*seq.exprs[seq.exprs.len() - 1],
        ) {
            // Check if lhs is same as `ident`.
            if let AssignTarget::Simple(SimpleAssignTarget::Ident(left)) = &assign.left {
                if left.id.sym == ident.sym && left.id.ctxt == ident.ctxt {
                    report_change!(
                        "drop_useless_ident_ref_in_seq: Dropping `{}` as it's useless",
                        left.id
                    );
                    self.changed = true;
                    seq.exprs.pop();
                }
            }
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
            if is_pure_undefined(self.ctx.expr_ctx, last) {
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

    ///
    /// - `(a, b, c) && d` => `a, b, c && d`
    pub(super) fn lift_seqs_of_bin(&mut self, e: &mut Expr) {
        let bin = match e {
            Expr::Bin(b) => b,
            _ => return,
        };

        if let Expr::Seq(left) = &mut *bin.left {
            if left.exprs.is_empty() {
                return;
            }

            self.changed = true;
            report_change!("sequences: Lifting sequence in a binary expression");

            let left_last = left.exprs.pop().unwrap();

            let mut exprs = left.exprs.take();

            exprs.push(
                BinExpr {
                    span: left.span,
                    op: bin.op,
                    left: left_last,
                    right: bin.right.take(),
                }
                .into(),
            );

            *e = SeqExpr {
                span: bin.span,
                exprs,
            }
            .into()
        }
    }

    ///
    /// - `x = (foo(), bar(), baz()) ? 10 : 20` => `foo(), bar(), x = baz() ? 10
    ///   : 20;`
    pub(super) fn lift_seqs_of_cond_assign(&mut self, e: &mut Expr) {
        if !self.options.sequences() {
            return;
        }

        let assign = match e {
            Expr::Assign(v @ AssignExpr { op: op!("="), .. }) => v,
            _ => return,
        };

        let cond = match &mut *assign.right {
            Expr::Cond(v) => v,
            _ => return,
        };

        if let Expr::Seq(test) = &mut *cond.test {
            //
            if test.exprs.len() >= 2 {
                let mut new_seq = Vec::new();
                new_seq.extend(test.exprs.drain(..test.exprs.len() - 1));

                self.changed = true;
                report_change!("sequences: Lifting sequences in a assignment with cond expr");
                let new_cond = CondExpr {
                    span: cond.span,
                    test: test.exprs.pop().unwrap(),
                    cons: cond.cons.take(),
                    alt: cond.alt.take(),
                };

                new_seq.push(
                    AssignExpr {
                        span: assign.span,
                        op: assign.op,
                        left: assign.left.take(),
                        right: Box::new(new_cond.into()),
                    }
                    .into(),
                );

                *e = SeqExpr {
                    span: assign.span,
                    exprs: new_seq,
                }
                .into();
            }
        }
    }

    /// `(a = foo, a.apply())` => `(a = foo).apply()`
    ///
    /// This is useful for outputs of swc/babel
    pub(super) fn merge_seq_call(&mut self, e: &mut SeqExpr) {
        if !self.options.sequences() {
            return;
        }

        for idx in 0..e.exprs.len() {
            let (e1, e2) = e.exprs.split_at_mut(idx);

            let a = match e1.last_mut() {
                Some(v) => &mut **v,
                None => continue,
            };

            let b = match e2.first_mut() {
                Some(v) => &mut **v,
                None => continue,
            };

            if let (
                Expr::Assign(a_assign @ AssignExpr { op: op!("="), .. }),
                Expr::Call(CallExpr {
                    callee: Callee::Expr(b_callee),
                    args,
                    ..
                }),
            ) = (&mut *a, &mut *b)
            {
                let var_name = a_assign.left.as_ident();
                let var_name = match var_name {
                    Some(v) => v,
                    None => continue,
                };

                match &mut **b_callee {
                    Expr::Member(MemberExpr {
                        obj: b_callee_obj,
                        prop,
                        ..
                    }) if prop.is_ident_with("apply") || prop.is_ident_with("call") => {
                        //
                        if let Expr::Ident(b_callee_obj) = &**b_callee_obj {
                            if b_callee_obj.to_id() != var_name.to_id() {
                                continue;
                            }
                        } else {
                            continue;
                        }

                        let span = a_assign.span;

                        let obj = Box::new(a.take());

                        let new = CallExpr {
                            span,
                            callee: MemberExpr {
                                span: DUMMY_SP,
                                obj,
                                prop: prop.take(),
                            }
                            .as_callee(),
                            args: args.take(),
                            ..Default::default()
                        }
                        .into();
                        b.take();
                        self.changed = true;
                        report_change!(
                            "sequences: Reducing `(a = foo, a.call())` to `((a = foo).call())`"
                        );

                        *a = new;
                    }
                    _ => (),
                };
            }
        }
    }
}
