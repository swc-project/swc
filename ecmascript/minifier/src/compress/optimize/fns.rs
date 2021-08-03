use super::Optimizer;
use crate::util::{sort::is_sorted_by, MoudleItemExt};
use std::cmp::Ordering;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;

impl Optimizer<'_> {
    /// Calls `reorder_stmts_inner` after splitting stmts.
    pub(super) fn reorder_stmts<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: MoudleItemExt,
    {
        if self.ctx.in_asm {
            return;
        }

        self.reorder_stmts_inner(stmts);
    }

    /// Sorts given statements.
    fn reorder_stmts_inner<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: MoudleItemExt,
    {
        if !self.options.join_vars {
            return;
        }

        // Sort by position

        if is_sorted_by(stmts.iter(), |a, b| {
            // Check for function declarations.

            match (a.as_module_decl(), b.as_module_decl()) {
                (
                    Err(Stmt::Decl(
                        Decl::Fn(..)
                        | Decl::Var(VarDecl {
                            kind: VarDeclKind::Var,
                            ..
                        }),
                    )),
                    Err(Stmt::Decl(
                        Decl::Fn(..)
                        | Decl::Var(VarDecl {
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
        log::debug!("fns: Reordering statements");
        let mut fns = vec![];
        let mut other = vec![];

        for stmt in stmts.take() {
            let stmt = stmt.into_module_item();

            match stmt {
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(..)))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Fn(..),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    kind: VarDeclKind::Var,
                    ..
                })))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl:
                        Decl::Var(VarDecl {
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
