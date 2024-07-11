use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::prepend_stmt;

use super::Pure;
use crate::compress::util::{is_fine_for_if_cons, negate};

impl Pure<'_> {
    /// # Input
    ///
    /// ```js
    /// function f(a, b) {
    ///     if (a) return;
    ///     console.log(b);
    /// }
    /// ```
    ///
    /// # Output
    /// ```js
    /// function f(a, b) {
    ///     if (!a)
    ///         console.log(b);
    /// }
    /// ```
    #[allow(clippy::unnecessary_filter_map)]
    pub(super) fn negate_if_terminate(
        &mut self,
        stmts: &mut Vec<Stmt>,
        handle_return: bool,
        handle_continue: bool,
    ) {
        if handle_return {
            if !self.options.if_return || !self.options.bools {
                return;
            }

            if stmts.len() == 1 {
                for s in stmts.iter_mut() {
                    if let Stmt::If(s) = s {
                        if let Stmt::Block(cons) = &mut *s.cons {
                            self.negate_if_terminate(&mut cons.stmts, true, false);
                        }
                    }
                }
            }
        }

        let len = stmts.len();

        let pos_of_if = stmts.iter().enumerate().rposition(|(idx, s)| {
            idx != len - 1
                && match s {
                    Stmt::If(IfStmt {
                        cons, alt: None, ..
                    }) => match &**cons {
                        Stmt::Return(ReturnStmt { arg: None, .. }) => handle_return,

                        Stmt::Continue(ContinueStmt { label: None, .. }) => handle_continue,
                        _ => false,
                    },
                    _ => false,
                }
        });

        let pos_of_if = match pos_of_if {
            Some(v) => v,
            _ => return,
        };

        // If we negate a block, these variables will have narrower scope.
        if stmts[pos_of_if..].iter().any(|s| match s {
            Stmt::Decl(Decl::Var(v))
                if matches!(
                    &**v,
                    VarDecl {
                        kind: VarDeclKind::Const | VarDeclKind::Let,
                        ..
                    }
                ) =>
            {
                true
            }
            _ => false,
        }) {
            return;
        }

        self.changed = true;
        report_change!(
            "if_return: Negating `foo` in `if (foo) return; bar()` to make it `if (!foo) bar()`"
        );

        let mut new = Vec::with_capacity(stmts.len());
        let mut fn_decls = Vec::with_capacity(stmts.len());
        new.extend(stmts.drain(..pos_of_if));
        let cons = stmts
            .drain(1..)
            .filter_map(|stmt| {
                if matches!(stmt, Stmt::Decl(Decl::Fn(..))) {
                    fn_decls.push(stmt);
                    return None;
                }

                Some(stmt)
            })
            .collect::<Vec<_>>();

        let if_stmt = stmts.take().into_iter().next().unwrap();
        match if_stmt {
            Stmt::If(mut s) => {
                assert_eq!(s.alt, None);
                negate(&self.expr_ctx, &mut s.test, false, false);

                s.cons = if cons.len() == 1 && is_fine_for_if_cons(&cons[0]) {
                    Box::new(cons.into_iter().next().unwrap())
                } else {
                    Box::new(
                        BlockStmt {
                            span: DUMMY_SP,
                            stmts: cons,
                            ..Default::default()
                        }
                        .into(),
                    )
                };

                new.push(s.into())
            }
            _ => {
                unreachable!()
            }
        }

        new.extend(fn_decls);

        *stmts = new;
    }

    pub(super) fn merge_else_if(&mut self, s: &mut IfStmt) {
        if let Some(Stmt::If(IfStmt {
            span: span_of_alt,
            test: test_of_alt,
            cons: cons_of_alt,
            alt: Some(alt_of_alt),
            ..
        })) = s.alt.as_deref_mut()
        {
            match &**cons_of_alt {
                Stmt::Return(..) | Stmt::Continue(ContinueStmt { label: None, .. }) => {}
                _ => return,
            }

            match &mut **alt_of_alt {
                Stmt::Block(..) => {}
                Stmt::Expr(..) => {
                    *alt_of_alt = Box::new(
                        BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![*alt_of_alt.take()],
                            ..Default::default()
                        }
                        .into(),
                    );
                }
                _ => {
                    return;
                }
            }

            self.changed = true;
            report_change!("if_return: Merging `else if` into `else`");

            match &mut **alt_of_alt {
                Stmt::Block(alt_of_alt) => {
                    prepend_stmt(
                        &mut alt_of_alt.stmts,
                        IfStmt {
                            span: *span_of_alt,
                            test: test_of_alt.take(),
                            cons: cons_of_alt.take(),
                            alt: None,
                        }
                        .into(),
                    );
                }

                _ => {
                    unreachable!()
                }
            }

            s.alt = Some(alt_of_alt.take());
        }
    }
}
