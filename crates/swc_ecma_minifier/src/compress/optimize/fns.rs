use std::cmp::Ordering;

use swc_common::util::take::Take;
use swc_ecma_ast::*;

use super::Optimizer;
use crate::{
    compress::util::is_directive,
    mode::Mode,
    util::{sort::is_sorted_by, ModuleItemExt},
    DISABLE_BUGGY_PASSES,
};

impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// Calls `reorder_stmts_inner` after splitting stmts.
    pub(super) fn reorder_stmts<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: ModuleItemExt,
    {
        if self.ctx.in_asm {
            return;
        }

        self.reorder_stmts_inner(stmts);
    }

    /// Sorts given statements.
    fn reorder_stmts_inner<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: ModuleItemExt,
    {
        if !self.options.join_vars {
            return;
        }
        if DISABLE_BUGGY_PASSES {
            return;
        }

        // Sort by position

        if is_sorted_by(stmts.iter(), |a, b| {
            // Check for function declarations.

            match (a.as_module_decl(), b.as_module_decl()) {
                (Ok(ModuleDecl::Import(..)), _) => Some(Ordering::Less),
                (Err(stmt), _) if is_directive(stmt) => Some(Ordering::Equal),

                (
                    Err(Stmt::Decl(
                        Decl::Fn(..)
                        | Decl::Var(box VarDecl {
                            kind: VarDeclKind::Var,
                            ..
                        }),
                    )),
                    Err(Stmt::Decl(
                        Decl::Fn(..)
                        | Decl::Var(box VarDecl {
                            kind: VarDeclKind::Var,
                            ..
                        }),
                    )),
                ) => Some(Ordering::Less),
                (_, Err(Stmt::Decl(Decl::Fn(..)))) => Some(Ordering::Greater),
                _ => Some(Ordering::Less),
            }
        }) {
            return;
        }

        self.changed = true;
        report_change!("fns: Reordering statements");
        let mut fns = vec![];
        let mut other = vec![];

        for stmt in stmts.take() {
            let stmt = stmt.into_module_item();

            match stmt {
                ModuleItem::ModuleDecl(ModuleDecl::Import(..)) => {
                    fns.push(T::from_module_item(stmt));
                    continue;
                }
                ModuleItem::Stmt(stmt) if is_directive(&stmt) => {
                    fns.push(T::from_stmt(stmt));
                    continue;
                }
                _ => {}
            }

            match stmt {
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(..)))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Fn(..),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Var(box VarDecl {
                    kind: VarDeclKind::Var,
                    ..
                })))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl:
                        Decl::Var(box VarDecl {
                            kind: VarDeclKind::Var,
                            ..
                        }),
                    ..
                })) => {
                    fns.push(T::from_module_item(stmt));
                }

                _ => {
                    other.push(T::from_module_item(stmt));
                }
            }
        }

        fns.extend(other);

        *stmts = fns;
    }
}
