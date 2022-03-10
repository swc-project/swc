use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, StmtLike, Value};

use super::Pure;
use crate::{
    compress::util::{always_terminates, is_fine_for_if_cons},
    util::ModuleItemExt,
};

/// Methods related to option `dead_code`.
impl Pure<'_> {
    pub(super) fn drop_unreachable_stmts<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemExt + Take,
    {
        if !self.options.side_effects {
            return;
        }

        let idx = stmts
            .iter()
            .enumerate()
            .find(|(_, stmt)| match stmt.as_stmt() {
                Some(s) => always_terminates(s),
                _ => false,
            });

        if let Some((idx, _)) = idx {
            stmts.iter_mut().skip(idx + 1).for_each(|stmt| {
                match stmt.as_stmt() {
                    Some(Stmt::Decl(
                        Decl::Var(VarDecl {
                            kind: VarDeclKind::Var,
                            ..
                        })
                        | Decl::Fn(..),
                    )) => {
                        // Preserve
                    }

                    Some(Stmt::Empty(..)) => {
                        // noop
                    }

                    Some(..) => {
                        tracing::debug!("Removing unreachable statements");
                        self.changed = true;
                        stmt.take();
                    }

                    _ => {}
                }
            });
        }
    }

    pub(super) fn drop_useless_blocks<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        fn is_ok(b: &BlockStmt) -> bool {
            b.stmts.iter().all(is_fine_for_if_cons)
        }

        if stmts
            .iter()
            .all(|stmt| !matches!(stmt.as_stmt(), Some(Stmt::Block(b)) if is_ok(b)))
        {
            return;
        }

        self.changed = true;
        tracing::debug!("Dropping useless block");

        let mut new = vec![];
        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(v) => match v {
                    Stmt::Block(v) if is_ok(&v) => {
                        new.extend(v.stmts.into_iter().map(T::from_stmt));
                    }
                    _ => new.push(T::from_stmt(v)),
                },
                Err(v) => {
                    new.push(v);
                }
            }
        }

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
                tracing::debug!("unused: Removing `return void` in end of a function");
                self.changed = true;
                *s = Stmt::Expr(ExprStmt {
                    span: *span,
                    expr: arg.take(),
                });
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

        if !stmts.iter().any(|stmt| match stmt.as_stmt() {
            Some(Stmt::If(s)) => s.test.as_bool().1.is_known(),
            _ => false,
        }) {
            return;
        }

        self.changed = true;
        tracing::debug!("dead_code: Removing dead codes");

        let mut new = vec![];

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => match stmt {
                    Stmt::If(mut s) => {
                        if let Value::Known(v) = s.test.as_bool().1 {
                            new.push(T::from_stmt(Stmt::Expr(ExprStmt {
                                span: DUMMY_SP,
                                expr: s.test.take(),
                            })));

                            if v {
                                new.push(T::from_stmt(*s.cons.take()));
                            } else {
                                if let Some(alt) = s.alt.take() {
                                    new.push(T::from_stmt(*alt));
                                }
                            }
                        } else {
                            new.push(T::from_stmt(Stmt::If(s)))
                        }
                    }
                    _ => new.push(T::from_stmt(stmt)),
                },
                Err(stmt) => new.push(stmt),
            }
        }

        *stmts = new;
    }
}
