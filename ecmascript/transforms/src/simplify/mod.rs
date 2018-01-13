//! Ported from closure compiler.
use ast::*;
use swc_common::fold::{FoldWith, Folder};
use util::*;

mod expr;

#[derive(Debug, Clone, Copy)]
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
                    let span = stmt.span;
                    let stmt = match stmt.node {
                        // Remove empty statements.
                        StmtKind::Empty => continue,

                        StmtKind::Throw { .. }
                        | StmtKind::Return { .. }
                        | StmtKind::Continue { .. }
                        | StmtKind::Break { .. } => {
                            let stmt_like = T::from_stmt(stmt);
                            buf.push(stmt_like);
                            return buf;
                        }
                        // Optimize if statement.
                        StmtKind::If {
                            test,
                            consequent,
                            alt,
                        } => {
                            // check if
                            let node = match test.as_bool() {
                                (Pure, Known(val)) => {
                                    if val {
                                        consequent.node
                                    } else {
                                        alt.map(|alt| alt.node).unwrap_or_else(|| StmtKind::Empty)
                                    }
                                }
                                // TODO: Impure
                                _ => StmtKind::If {
                                    test,
                                    consequent,
                                    alt,
                                },
                            };
                            Stmt { span, node }
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

impl Folder<StmtKind> for Simplify {
    fn fold(&mut self, stmt: StmtKind) -> StmtKind {
        let stmt = stmt.fold_children(self);

        match stmt {
            // `1;` -> `;`
            StmtKind::Expr(box Expr { span, node }) => match node {
                ExprKind::Lit(Lit::Num(..))
                | ExprKind::Lit(Lit::Bool(..))
                | ExprKind::Lit(Lit::Regex(..)) => StmtKind::Empty,
                _ => StmtKind::Expr(box Expr { node, span }),
            },

            StmtKind::Block(BlockStmt { span, stmts }) => {
                if stmts.len() == 0 {
                    return StmtKind::Empty;
                } else if stmts.len() == 1 {
                    // TODO: Check lexical variable
                    return stmts.into_iter().next().unwrap().node;
                } else {
                    StmtKind::Block(BlockStmt { span, stmts })
                }
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
