use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::find_ids;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

pub(super) fn decl_hoister() -> Hoister {
    Hoister {}
}

pub(super) struct Hoister {}

impl Hoister {
    fn handle_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self>,
    {
        stmts.visit_mut_children_with(self);

        // TODO: Hoist vars, ignoring side-effect-free items like fn decl.

        let should_hoist = {
            let mut found_non_var_decl = false;
            stmts.iter().any(|stmt| match stmt.as_stmt() {
                Some(stmt) => match stmt {
                    Stmt::Decl(Decl::Var(..)) => {
                        if found_non_var_decl {
                            return true;
                        }
                        false
                    }
                    _ => {
                        found_non_var_decl = true;
                        false
                    }
                },
                None => {
                    found_non_var_decl = true;
                    false
                }
            })
        };

        if !should_hoist {
            return;
        }
        let mut decls = vec![];
        let mut new = Vec::with_capacity(stmts.len());
        new.push(T::from_stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP })));

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => {
                    // Seaarch for variable declarations.
                    match stmt {
                        Stmt::Decl(Decl::Var(
                            var
                            @
                            VarDecl {
                                kind: VarDeclKind::Var,
                                ..
                            },
                        )) => {
                            let mut exprs = vec![];
                            for decl in var.decls {
                                let ids: Vec<Ident> = find_ids(&decl.name);

                                for id in ids {
                                    decls.push(VarDeclarator {
                                        span: DUMMY_SP,
                                        name: Pat::Ident(id),
                                        init: None,
                                        definite: false,
                                    })
                                }

                                match decl.init {
                                    Some(init) => {
                                        //
                                        exprs.push(Box::new(Expr::Assign(AssignExpr {
                                            span: decl.span,
                                            left: PatOrExpr::Pat(Box::new(decl.name)),
                                            op: op!("="),
                                            right: init,
                                        })));
                                    }
                                    None => {}
                                }
                            }

                            if exprs.is_empty() {
                                continue;
                            }
                            new.push(T::from_stmt(Stmt::Expr(ExprStmt {
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
                        _ => new.push(T::from_stmt(stmt)),
                    }
                }
                Err(stmt) => new.push(stmt),
            }
        }

        *new.first_mut().unwrap() = T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: false,
            decls,
        })));

        *stmts = new;
    }
}

impl VisitMut for Hoister {
    noop_visit_mut_type!();

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.handle_stmt_likes(stmts);
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.handle_stmt_likes(stmts);
    }
}
