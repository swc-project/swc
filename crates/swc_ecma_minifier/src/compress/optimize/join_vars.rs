use super::Optimizer;
use crate::{compress::util::is_directive, mode::Mode};
use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_utils::StmtLike;

/// Methods related to option `join_vars`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// Join variables.
    ///
    /// This method may move variables to head of for statements like
    ///
    /// `var a; for(var b;;);` => `for(var a, b;;);`
    pub(super) fn join_vars<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        if !self.options.join_vars {
            return;
        }

        {
            // Check if we can join variables.

            let can_work =
                stmts
                    .windows(2)
                    .any(|stmts| match (stmts[0].as_stmt(), stmts[1].as_stmt()) {
                        (Some(Stmt::Decl(Decl::Var(l))), Some(r)) => match r {
                            Stmt::Decl(Decl::Var(r)) => l.kind == r.kind,
                            Stmt::For(ForStmt { init: None, .. }) => l.kind == VarDeclKind::Var,
                            Stmt::For(ForStmt {
                                init:
                                    Some(VarDeclOrExpr::VarDecl(VarDecl {
                                        kind: VarDeclKind::Var,
                                        ..
                                    })),
                                ..
                            }) => l.kind == VarDeclKind::Var,
                            _ => false,
                        },
                        _ => false,
                    });

            if !can_work {
                return;
            }
        }

        tracing::debug!("join_vars: Joining variables");
        self.changed = true;

        let mut cur: Option<VarDecl> = None;
        let mut new = vec![];

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => {
                    if is_directive(&stmt) {
                        new.push(T::from_stmt(stmt));
                        continue;
                    }

                    match stmt {
                        Stmt::Decl(Decl::Var(var)) => match &mut cur {
                            Some(v) if var.kind == v.kind => {
                                v.decls.extend(var.decls);
                            }
                            _ => {
                                new.extend(
                                    cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt),
                                );

                                cur = Some(var)
                            }
                        },
                        Stmt::For(mut stmt) => match &mut stmt.init {
                            Some(VarDeclOrExpr::VarDecl(
                                var @ VarDecl {
                                    kind: VarDeclKind::Var,
                                    ..
                                },
                            )) => match &mut cur {
                                Some(cur) if cur.kind == var.kind => {
                                    // Merge
                                    cur.decls.append(&mut var.decls);
                                    var.decls = cur.decls.take();

                                    new.push(T::from_stmt(Stmt::For(stmt)))
                                }
                                _ => {
                                    new.extend(
                                        cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt),
                                    );

                                    new.push(T::from_stmt(Stmt::For(stmt)))
                                }
                            },
                            None if cur
                                .as_ref()
                                .map(|v| v.kind == VarDeclKind::Var)
                                .unwrap_or(true) =>
                            {
                                stmt.init = cur.take().map(VarDeclOrExpr::VarDecl);

                                new.push(T::from_stmt(Stmt::For(stmt)))
                            }
                            _ => {
                                new.extend(
                                    cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt),
                                );

                                new.push(T::from_stmt(Stmt::For(stmt)))
                            }
                        },
                        _ => {
                            new.extend(cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt));

                            new.push(T::from_stmt(stmt))
                        }
                    }
                }
                Err(item) => {
                    new.extend(cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt));

                    new.push(item);
                }
            }
        }

        new.extend(cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt));

        *stmts = new;
    }
}
