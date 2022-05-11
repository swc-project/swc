use swc_common::{collections::AHashSet, pass::Repeated, util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, Id, StmtLike};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};

use super::util::drop_invalid_stmts;
use crate::{
    analyzer::{ProgramData, UsageAnalyzer},
    util::{is_hoisted_var_decl_without_init, sort::is_sorted_by_key, IsModuleItem, ModuleItemExt},
};

pub(super) struct DeclHoisterConfig {
    pub hoist_fns: bool,
    pub hoist_vars: bool,
    pub _top_level: bool,
}

pub(super) fn decl_hoister(config: DeclHoisterConfig, data: &ProgramData) -> Hoister {
    Hoister {
        config,
        changed: false,
        data,
    }
}

pub(super) struct Hoister<'a> {
    config: DeclHoisterConfig,
    changed: bool,
    data: &'a ProgramData,
}

impl Repeated for Hoister<'_> {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
    }
}

impl Hoister<'_> {
    fn handle_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + IsModuleItem + ModuleItemExt,
        Vec<T>: for<'aa> VisitMutWith<Hoister<'aa>> + VisitWith<UsageAnalyzer>,
    {
        stmts.visit_mut_children_with(self);

        let should_hoist = !is_sorted_by_key(stmts.iter(), |stmt| match stmt.as_stmt() {
            Some(stmt) => match stmt {
                Stmt::Decl(Decl::Fn(..)) if self.config.hoist_fns => 1,
                Stmt::Decl(Decl::Var(var)) if self.config.hoist_vars => {
                    let ids: Vec<Id> = find_ids(&var.decls);

                    if ids.iter().any(|id| {
                        self.data
                            .vars
                            .get(id)
                            .map(|v| !v.used_above_decl)
                            .unwrap_or(false)
                    }) {
                        2
                    } else {
                        3
                    }
                }
                _ => 3,
            },
            None => 3,
        }) || (self.config.hoist_vars
            && stmts.windows(2).any(|stmts| {
                is_hoisted_var_decl_without_init(&stmts[0])
                    && is_hoisted_var_decl_without_init(&stmts[1])
            }));

        if !should_hoist {
            return;
        }
        self.changed = true;

        let mut var_decls = vec![];
        let mut fn_decls = Vec::with_capacity(stmts.len());
        let mut new_stmts = Vec::with_capacity(stmts.len());
        let mut done = AHashSet::default();

        let mut found_non_var_decl = false;
        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => {
                    // Seaarch for variable declarations.
                    match stmt {
                        Stmt::Decl(Decl::Fn(..)) if self.config.hoist_fns => {
                            // Move functions to top.
                            fn_decls.push(T::from_stmt(stmt))
                        }

                        Stmt::Decl(Decl::Var(
                            var @ VarDecl {
                                kind: VarDeclKind::Var,
                                ..
                            },
                        )) if found_non_var_decl => {
                            let mut exprs = vec![];
                            for decl in var.decls {
                                let ids: Vec<Ident> = find_ids(&decl.name);

                                for id in ids {
                                    if done.insert(id.to_id()) {
                                        // If the enclosing function declares parameter with same
                                        // name, we can drop a varaible.
                                        if decl.init.is_none()
                                            && self
                                                .data
                                                .vars
                                                .get(&id.to_id())
                                                .map(|v| v.declared_as_fn_param)
                                                .unwrap_or(false)
                                        {
                                            continue;
                                        }

                                        var_decls.push(VarDeclarator {
                                            span: DUMMY_SP,
                                            name: Pat::Ident(id.into()),
                                            init: None,
                                            definite: false,
                                        })
                                    }
                                }

                                if let Some(init) = decl.init {
                                    //
                                    exprs.push(Box::new(Expr::Assign(AssignExpr {
                                        span: decl.span,
                                        left: PatOrExpr::Pat(Box::new(decl.name)),
                                        op: op!("="),
                                        right: init,
                                    })));
                                }
                            }

                            if exprs.is_empty() {
                                continue;
                            }
                            new_stmts.push(T::from_stmt(Stmt::Expr(ExprStmt {
                                span: var.span,
                                expr: if exprs.len() == 1 {
                                    exprs.into_iter().next().unwrap()
                                } else {
                                    Box::new(Expr::Seq(SeqExpr {
                                        span: DUMMY_SP,
                                        exprs,
                                    }))
                                },
                            })))
                        }

                        Stmt::Decl(Decl::Var(VarDecl {
                            kind: VarDeclKind::Var,
                            decls,
                            ..
                        })) => {
                            // It can be merged because we didn't found normal statement.
                            //
                            // Code like
                            //
                            // var a = 1;
                            // var b = 3;
                            //
                            // will be merged.
                            var_decls.extend(decls.into_iter().filter(|decl| {
                                // We should preserve if init exists because
                                //
                                // var a = 2, a = 3;
                                //
                                // is valid javascript code.

                                let preserve = match &decl.name {
                                    Pat::Ident(name) => {
                                        // If the enclosing function declares parameter with same
                                        // name, we can drop a varaible. (If it's side-effect free).
                                        if decl.init.is_none()
                                            && self
                                                .data
                                                .vars
                                                .get(&name.to_id())
                                                .map(|v| v.declared_as_fn_param)
                                                .unwrap_or(false)
                                        {
                                            return false;
                                        }

                                        done.insert(name.to_id())
                                    }
                                    _ => true,
                                };

                                preserve || decl.init.is_some()
                            }));
                        }

                        Stmt::Decl(Decl::Var(..)) => new_stmts.push(T::from_stmt(stmt)),
                        _ => {
                            if let Stmt::Throw(..) = stmt {
                                fn_decls.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    declare: false,
                                    decls: var_decls.take(),
                                }))));
                            }
                            found_non_var_decl = true;
                            new_stmts.push(T::from_stmt(stmt))
                        }
                    }
                }
                Err(stmt) => new_stmts.push(stmt),
            }
        }

        fn_decls.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: false,
            decls: var_decls,
        }))));
        fn_decls.extend(new_stmts);

        drop_invalid_stmts(&mut fn_decls);

        *stmts = fn_decls;
    }
}

impl VisitMut for Hoister<'_> {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.handle_stmt_likes(stmts);
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.handle_stmt_likes(stmts);
    }
}
