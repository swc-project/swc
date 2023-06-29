use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{private_ident, ExprFactory, ModuleItemLike, StmtLike};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn explicit_resource_management() -> impl Fold + VisitMut {
    as_folder(ExplicitResourceManagement::default())
}

#[derive(Default)]
struct ExplicitResourceManagement {
    state: Option<State>,
}

struct State {
    stack: Ident,
    has_error: Ident,
    error_var: Ident,
    catch_var: Ident,
}

impl Default for State {
    fn default() -> Self {
        Self {
            stack: private_ident!("_stack"),
            has_error: private_ident!("_hasError"),
            error_var: private_ident!("_error"),
            catch_var: private_ident!("_"),
        }
    }
}

impl ExplicitResourceManagement {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike,
        Vec<T>: VisitMutWith<Self>,
    {
        let old_state = self.state.take();

        stmts.visit_mut_children_with(self);

        if let Some(state) = self.state.take() {
            let mut new = vec![];
            let mut try_body = vec![];

            let stack_var_decl = VarDeclarator {
                span: DUMMY_SP,
                name: state.stack.clone().into(),
                init: Some(
                    ArrayLit {
                        span: DUMMY_SP,
                        elems: vec![],
                    }
                    .into(),
                ),
                definite: Default::default(),
            };

            try_body.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![stack_var_decl],
            }))));

            for stmt in stmts.take() {
                match stmt.try_into_stmt() {
                    Ok(stmt) => try_body.push(stmt),
                    Err(stmt) => new.push(stmt),
                }
            }

            // Drop `;`
            try_body.retain(|stmt| !matches!(stmt, Stmt::Empty(..)));

            // var has_error = true
            let has_error_true = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: state.has_error.clone().into(),
                    init: Some(true.into()),
                    definite: false,
                }],
            })));
            // var error = $catch_var
            let error_catch_var = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: state.error_var.clone().into(),
                    init: Some(state.catch_var.clone().into()),
                    definite: false,
                }],
            })));

            let dispose_stmt = CallExpr {
                span: DUMMY_SP,
                callee: helper!(dispose),
                args: vec![
                    state.stack.as_arg(),
                    state.error_var.as_arg(),
                    state.has_error.as_arg(),
                ],
                type_args: Default::default(),
            }
            .into_stmt();

            let try_stmt = TryStmt {
                span: DUMMY_SP,
                block: BlockStmt {
                    span: DUMMY_SP,
                    stmts: try_body,
                },
                handler: Some(CatchClause {
                    span: DUMMY_SP,
                    param: Some(state.catch_var.into()),
                    body: BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![has_error_true, error_catch_var],
                    },
                }),
                finalizer: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![dispose_stmt],
                }),
            };

            new.push(T::from_stmt(Stmt::Try(Box::new(try_stmt))));

            *stmts = new;
        }

        self.state = old_state;
    }
}

impl VisitMut for ExplicitResourceManagement {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(stmts)
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        if let Stmt::Decl(Decl::Using(decl)) = s {
            let state = self.state.get_or_insert_with(Default::default);

            *s = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: Default::default(),
                decls: decl
                    .decls
                    .take()
                    .into_iter()
                    .map(|d| {
                        let init = CallExpr {
                            span: decl.span,
                            callee: helper!(using),
                            args: vec![
                                state.stack.clone().as_arg(),
                                d.init.unwrap().as_arg(),
                                decl.is_await.as_arg(),
                            ],
                            type_args: Default::default(),
                        };

                        VarDeclarator {
                            init: Some(init.into()),
                            ..d
                        }
                    })
                    .collect(),
            })));
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(stmts)
    }
}
