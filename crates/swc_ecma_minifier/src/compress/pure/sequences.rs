use super::Pure;
use crate::mode::Mode;
use swc_common::{util::take::Take, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, ExprFactory};

impl<M> Pure<'_, M>
where
    M: Mode,
{
    pub(super) fn drop_useless_ident_ref_in_seq(&mut self, seq: &mut SeqExpr) {
        if !self.options.collapse_vars {
            return;
        }

        if seq.exprs.len() < 2 {
            return;
        }

        match (
            &*seq.exprs[seq.exprs.len() - 2],
            &*seq.exprs[seq.exprs.len() - 1],
        ) {
            (Expr::Assign(assign @ AssignExpr { op: op!("="), .. }), Expr::Ident(ident)) => {
                // Check if lhs is same as `ident`.
                match &assign.left {
                    PatOrExpr::Expr(_) => {}
                    PatOrExpr::Pat(left) => match &**left {
                        Pat::Ident(left) => {
                            if left.id.sym == ident.sym && left.id.span.ctxt == ident.span.ctxt {
                                tracing::debug!(
                                    "drop_useless_ident_ref_in_seq: Dropping `{}` as it's useless",
                                    left.id
                                );
                                self.changed = true;
                                seq.exprs.pop();
                            }
                        }
                        _ => {}
                    },
                }
            }
            _ => {}
        }
    }

    ///
    /// - `(a, b, c) && d` => `a, b, c && d`
    pub(super) fn lift_seqs_of_bin(&mut self, e: &mut Expr) {
        let bin = match e {
            Expr::Bin(b) => b,
            _ => return,
        };

        match &mut *bin.left {
            Expr::Seq(left) => {
                if left.exprs.is_empty() {
                    return;
                }

                self.changed = true;
                tracing::debug!("sequences: Lifting sequence in a binary expression");

                let left_last = left.exprs.pop().unwrap();

                let mut exprs = left.exprs.take();

                exprs.push(Box::new(Expr::Bin(BinExpr {
                    span: left.span,
                    op: bin.op,
                    left: left_last,
                    right: bin.right.take(),
                })));

                *e = Expr::Seq(SeqExpr {
                    span: bin.span,
                    exprs,
                })
            }
            _ => {}
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

        match &mut *cond.test {
            Expr::Seq(test) => {
                //
                if test.exprs.len() >= 2 {
                    let mut new_seq = vec![];
                    new_seq.extend(test.exprs.drain(..test.exprs.len() - 1));

                    self.changed = true;
                    tracing::debug!("sequences: Lifting sequences in a assignment with cond expr");
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

            match (&mut *a, &mut *b) {
                (
                    Expr::Assign(a_assign @ AssignExpr { op: op!("="), .. }),
                    Expr::Call(CallExpr {
                        callee: ExprOrSuper::Expr(b_callee),
                        args,
                        ..
                    }),
                ) => {
                    let var_name = a_assign.left.as_ident();
                    let var_name = match var_name {
                        Some(v) => v,
                        None => continue,
                    };

                    match &mut **b_callee {
                        Expr::Member(MemberExpr {
                            obj: ExprOrSuper::Expr(b_callee_obj),
                            computed: false,
                            prop,
                            ..
                        }) => {
                            //
                            if !b_callee_obj.is_ident_ref_to(var_name.sym.clone()) {
                                continue;
                            }

                            match &**prop {
                                Expr::Ident(Ident { sym, .. }) => match &**sym {
                                    "apply" | "call" => {}
                                    _ => continue,
                                },
                                _ => {}
                            }

                            let span = a_assign.span.with_ctxt(SyntaxContext::empty());

                            let obj = a.take();

                            let new = Expr::Call(CallExpr {
                                span,
                                callee: MemberExpr {
                                    span: DUMMY_SP,
                                    obj: obj.as_obj(),
                                    prop: prop.take(),
                                    computed: false,
                                }
                                .as_callee(),
                                args: args.take(),
                                type_args: Default::default(),
                            });
                            b.take();
                            self.changed = true;
                            tracing::debug!(
                                "sequences: Reducing `(a = foo, a.call())` to `((a = foo).call())`"
                            );

                            *a = new;
                        }
                        _ => {}
                    };
                }

                _ => {}
            }
        }
    }
}
