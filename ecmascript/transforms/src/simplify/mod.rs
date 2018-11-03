//! Ported from closure compiler.
use swc_common::{FoldWith, Folder, DUMMY_SP};
use swc_ecma_ast::*;
use util::*;

mod expr;

#[derive(Debug, Clone, Copy, Default)]
pub struct Simplify;

impl<T: StmtLike> Folder<Vec<T>> for Simplify
where
    Self: Folder<T>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let mut buf = Vec::with_capacity(stmts.len());

        for stmt_like in stmts {
            let stmt_like = self.fold(stmt_like);
            let stmt_like = match stmt_like.try_into_stmt() {
                Ok(stmt) => {
                    let stmt = match stmt {
                        // Remove empty statements.
                        Stmt::Empty(..) => continue,

                        // Control flow
                        Stmt::Throw(..)
                        | Stmt::Return { .. }
                        | Stmt::Continue { .. }
                        | Stmt::Break { .. } => {
                            let stmt_like = T::from_stmt(stmt);
                            buf.push(stmt_like);
                            return buf;
                        }
                        // Optimize if statement.
                        Stmt::If(IfStmt {
                            test,
                            cons,
                            alt,
                            span,
                        }) => {
                            // check if
                            let node = match test.as_bool() {
                                (Pure, Known(val)) => {
                                    if val {
                                        *cons
                                    } else {
                                        alt.map(|e| *e).unwrap_or(Stmt::Empty(EmptyStmt { span }))
                                    }
                                }
                                // TODO: Impure
                                _ => Stmt::If(IfStmt {
                                    test,
                                    cons,
                                    alt,
                                    span,
                                }),
                            };
                            node
                        }
                        _ => stmt,
                    };

                    T::from_stmt(stmt)
                }
                Err(stmt_like) => stmt_like,
            };

            buf.push(stmt_like);
        }

        buf
    }
}

impl Folder<Stmt> for Simplify {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children(self);

        match stmt {
            // `1;` -> `;`
            Stmt::Expr(box node) => match node {
                Expr::Lit(Lit::Num(..)) | Expr::Lit(Lit::Bool(..)) | Expr::Lit(Lit::Regex(..)) => {
                    Stmt::Empty(EmptyStmt { span: DUMMY_SP })
                }

                //
                // Function expressions are useless if they are not used.
                //
                // As function expressions cannot start with 'function',
                // this will be reached only if other things
                // are removed while folding chilren.
                Expr::Fn(FnExpr {
                    function: Function { span, .. },
                    ..
                }) => Stmt::Empty(EmptyStmt { span }),
                _ => Stmt::Expr(box node),
            },

            Stmt::Block(BlockStmt { span, stmts }) => {
                if stmts.len() == 0 {
                    return Stmt::Empty(EmptyStmt { span });
                } else if stmts.len() == 1 {
                    // TODO: Check if lexical variable exists.
                    return stmts.into_iter().next().unwrap();
                } else {
                    Stmt::Block(BlockStmt { span, stmts })
                }
            }

            Stmt::Try(TryStmt {
                span,
                block,
                handler,
                finalizer,
            }) => {
                // Only leave the finally block if try block is empty
                if block.is_empty() {
                    return finalizer
                        .map(Stmt::Block)
                        .unwrap_or(Stmt::Empty(EmptyStmt { span }));
                }

                // If catch block and finally block is empty, remove try-catch is useless.
                if handler.is_empty() && finalizer.is_empty() {
                    return Stmt::Block(block);
                }

                Stmt::Try(TryStmt {
                    span,
                    block,
                    handler,
                    finalizer,
                })
            }

            // Remove empty else block.
            // As we fold children before parent, unused expression
            // statements without side effects are converted to
            // Stmt::Empty before here.
            Stmt::If(IfStmt {
                span,
                test,
                cons,
                alt,
            }) => {
                if alt.is_empty() {
                    return Stmt::If(IfStmt {
                        span,
                        test,
                        cons,
                        alt: None,
                    });
                }
                Stmt::If(IfStmt {
                    span,
                    test,
                    cons,
                    alt,
                })
            }

            _ => stmt,
        }
    }
}

pub trait StmtLike: Sized {
    fn try_into_stmt(self) -> Result<Stmt, Self>;
    fn from_stmt(stmt: Stmt) -> Self;
}

impl StmtLike for Stmt {
    fn try_into_stmt(self) -> Result<Stmt, Self> {
        Ok(self)
    }
    fn from_stmt(stmt: Stmt) -> Self {
        stmt
    }
}

impl StmtLike for ModuleItem {
    fn try_into_stmt(self) -> Result<Stmt, Self> {
        match self {
            ModuleItem::Stmt(stmt) => Ok(stmt),
            _ => Err(self),
        }
    }
    fn from_stmt(stmt: Stmt) -> Self {
        ModuleItem::Stmt(stmt)
    }
}

// impl Folder<Stmt> for Simplify {
//     fn fold(&mut self, stmt: Stmt) -> Stmt {
//         stmt.fold_children(&mut FoldConst)
//     }
// }
