use std::iter::once;

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

    is_not_top_level: bool,
}

struct State {
    stack: Ident,
    has_error: Ident,
    error_var: Ident,
    catch_var: Ident,

    has_await: bool,
}

impl Default for State {
    fn default() -> Self {
        Self {
            stack: private_ident!("_stack"),
            has_error: private_ident!("_hasError"),
            error_var: private_ident!("_error"),
            catch_var: private_ident!("_"),
            has_await: false,
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
            self.wrap_with_try(state, stmts);
        }

        self.state = old_state;
    }

    fn wrap_with_try<T>(&mut self, state: State, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike,
    {
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
                Ok(stmt @ Stmt::Decl(Decl::Fn(..))) => {
                    new.push(T::from_stmt(stmt));
                }
                Ok(Stmt::Decl(Decl::Var(mut var))) => {
                    var.kind = VarDeclKind::Var;
                    try_body.push(Stmt::Decl(Decl::Var(var)));
                }
                Ok(stmt) => try_body.push(stmt),
                Err(stmt) => match stmt.try_into_module_decl() {
                    Ok(ModuleDecl::ExportDefaultDecl(decl)) => {
                        let ident = match &decl.decl {
                            DefaultDecl::Class(c) => c.ident.clone(),
                            DefaultDecl::Fn(f) => f.ident.clone(),
                            DefaultDecl::TsInterfaceDecl(_) => unreachable!(),
                        };

                        let ident = ident.unwrap_or_else(|| private_ident!("_default"));

                        // export { C as default }
                        new.push(
                            T::try_from_module_decl(ModuleDecl::ExportNamed(NamedExport {
                                span: DUMMY_SP,
                                specifiers: vec![ExportSpecifier::Named(ExportNamedSpecifier {
                                    span: DUMMY_SP,
                                    orig: ModuleExportName::Ident(ident.clone()),
                                    exported: Some(ModuleExportName::Ident(Ident::new(
                                        "default".into(),
                                        DUMMY_SP,
                                    ))),
                                    is_type_only: Default::default(),
                                })],
                                src: None,
                                type_only: Default::default(),
                                with: None,
                            }))
                            .unwrap(),
                        );
                        try_body.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            declare: Default::default(),
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: ident.into(),
                                init: Some(match decl.decl {
                                    DefaultDecl::Class(c) => Box::new(Expr::Class(c)),
                                    DefaultDecl::Fn(f) => Box::new(Expr::Fn(f)),
                                    DefaultDecl::TsInterfaceDecl(_) => unreachable!(),
                                }),
                                definite: Default::default(),
                            }],
                        }))));
                    }

                    Ok(ModuleDecl::ExportDefaultExpr(decl)) => {
                        let ident = private_ident!("_default");

                        // export { _default as default }
                        new.push(
                            T::try_from_module_decl(ModuleDecl::ExportNamed(NamedExport {
                                span: DUMMY_SP,
                                specifiers: vec![ExportSpecifier::Named(ExportNamedSpecifier {
                                    span: DUMMY_SP,
                                    orig: ModuleExportName::Ident(ident.clone()),
                                    exported: Some(ModuleExportName::Ident(Ident::new(
                                        "default".into(),
                                        DUMMY_SP,
                                    ))),
                                    is_type_only: Default::default(),
                                })],
                                src: None,
                                type_only: Default::default(),
                                with: None,
                            }))
                            .unwrap(),
                        );
                        try_body.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            declare: Default::default(),
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: ident.into(),
                                init: Some(decl.expr),
                                definite: Default::default(),
                            }],
                        }))));
                    }

                    Ok(stmt) => new.push(T::try_from_module_decl(stmt).unwrap()),
                    Err(stmt) => new.push(stmt),
                },
            }
        }

        // Drop `;`
        try_body.retain(|stmt| !matches!(stmt, Stmt::Empty(..)));

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
        let dispose_expr = CallExpr {
            span: DUMMY_SP,
            callee: helper!(dispose),
            args: vec![
                state.stack.as_arg(),
                state.error_var.as_arg(),
                state.has_error.as_arg(),
            ],
            type_args: Default::default(),
        };
        let dispose_stmt = if state.has_await {
            Expr::Await(AwaitExpr {
                span: DUMMY_SP,
                arg: Box::new(dispose_expr.into()),
            })
        } else {
            dispose_expr.into()
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
                    stmts: vec![error_catch_var, has_error_true],
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
}

impl VisitMut for ExplicitResourceManagement {
    noop_visit_mut_type!();

    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        n.visit_mut_children_with(self);

        if let ForHead::UsingDecl(decl) = &mut n.left {
            let state = State::default();

            n.left = ForHead::VarDecl(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Const,
                declare: false,
                decls: decl.decls.take(),
            }));

            let mut body = vec![*n.body.take()];
            self.wrap_with_try(state, &mut body);
            n.body = Box::new(Stmt::Block(BlockStmt {
                span: DUMMY_SP,
                stmts: body,
            }))
        }
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(stmts)
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        if let Stmt::Decl(Decl::Using(decl)) = s {
            let state = self.state.get_or_insert_with(Default::default);

            state.has_await |= decl.is_await;

            *s = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: if self.is_not_top_level {
                    VarDeclKind::Const
                } else {
                    VarDeclKind::Var
                },
                declare: Default::default(),
                decls: decl
                    .decls
                    .take()
                    .into_iter()
                    .map(|d| {
                        let init = CallExpr {
                            span: decl.span,
                            callee: helper!(using),
                            args: once(state.stack.clone().as_arg())
                                .chain(once(d.init.unwrap().as_arg()))
                                .chain(if decl.is_await {
                                    Some(true.as_arg())
                                } else {
                                    None
                                })
                                .collect(),
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
        let old_is_not_top_level = self.is_not_top_level;
        self.is_not_top_level = true;
        self.visit_mut_stmt_likes(stmts);
        self.is_not_top_level = old_is_not_top_level;
    }
}
