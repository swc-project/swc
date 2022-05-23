use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;

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
        if stmts[pos_of_if..].iter().any(|s| {
            matches!(
                s,
                Stmt::Decl(Decl::Var(VarDecl {
                    kind: VarDeclKind::Const | VarDeclKind::Let,
                    ..
                }))
            )
        }) {
            return;
        }

        self.changed = true;
        report_change!(
            "if_return: Negating `foo` in `if (foo) return; bar()` to make it `if (!foo) bar()`"
        );

        let mut new = vec![];
        let mut fn_decls = vec![];
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
                    Box::new(Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts: cons,
                    }))
                };

                new.push(Stmt::If(s))
            }
            _ => {
                unreachable!()
            }
        }

        new.extend(fn_decls);

        *stmts = new;
    }
}
