use super::Pure;
use crate::{
    compress::util::{always_terminates, is_fine_for_if_cons},
    mode::Mode,
};
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, StmtLike, Value};

/// Methods related to option `dead_code`.
impl<M> Pure<'_, M>
where
    M: Mode,
{
    pub(super) fn drop_useless_blocks<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        fn is_ok(b: &BlockStmt) -> bool {
            b.stmts.iter().all(|s| is_fine_for_if_cons(s))
        }

        if stmts.iter().all(|stmt| match stmt.as_stmt() {
            Some(Stmt::Block(b)) if is_ok(b) => false,
            _ => true,
        }) {
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
        match s {
            Stmt::Return(r) => match r.arg.as_deref_mut() {
                Some(Expr::Unary(UnaryExpr {
                    span,
                    op: op!("void"),
                    arg,
                })) => {
                    tracing::debug!("unused: Removing `return void` in end of a function");
                    self.changed = true;
                    *s = Stmt::Expr(ExprStmt {
                        span: *span,
                        expr: arg.take(),
                    });
                    return;
                }
                _ => {}
            },
            _ => {}
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

    pub(super) fn remove_unreachable_stmts<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        if !self.options.side_effects {
            return;
        }

        let mut last = None;
        let mut terminated = false;
        for (idx, stmt) in stmts.iter().enumerate() {
            match stmt.as_stmt() {
                Some(stmt) if always_terminates(&stmt) => {
                    terminated = true;
                }
                _ => {
                    if terminated {
                        last = Some(idx);
                        break;
                    }
                }
            }
        }

        if let Some(last) = last {
            if stmts[last..].iter().all(|stmt| match stmt.as_stmt() {
                Some(Stmt::Decl(..)) | None => true,
                _ => false,
            }) {
                return;
            }

            self.changed = true;
            tracing::debug!("dead_code: Removing unreachable statements");

            let extras = stmts.drain(last..).collect::<Vec<_>>();

            for extra in extras {
                match extra.as_stmt() {
                    Some(Stmt::Decl(..)) | None => {
                        stmts.push(extra);
                    }
                    _ => {}
                }
            }
        }
    }
}
