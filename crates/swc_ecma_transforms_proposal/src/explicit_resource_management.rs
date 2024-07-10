use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    find_pat_ids, private_ident, quote_ident, stack_size::maybe_grow_default, ExprFactory,
    ModuleItemLike, StmtLike,
};
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
    using_ctx: Ident,
    catch_var: Ident,

    has_await: bool,
}

impl Default for State {
    fn default() -> Self {
        Self {
            using_ctx: private_ident!("_usingCtx"),
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
        let mut extras = vec![];
        let mut try_body = vec![];

        let using_ctx_var = VarDeclarator {
            span: DUMMY_SP,
            name: state.using_ctx.clone().into(),
            init: Some(
                CallExpr {
                    callee: helper!(using_ctx),
                    span: DUMMY_SP,
                    args: Default::default(),
                    ..Default::default()
                }
                .into(),
            ),
            definite: Default::default(),
        };

        try_body.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: false,
            decls: vec![using_ctx_var],
            ..Default::default()
        }))));

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt @ Stmt::Decl(Decl::Fn(..))) => {
                    try_body.push(stmt);
                }
                Ok(Stmt::Decl(Decl::Var(var))) => {
                    // var.kind = VarDeclKind::Var;
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
                                    exported: Some(ModuleExportName::Ident(Ident::new_no_ctxt(
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
                            ..Default::default()
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
                                    exported: Some(ModuleExportName::Ident(Ident::new_no_ctxt(
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
                            ..Default::default()
                        }))));
                    }

                    Ok(ModuleDecl::ExportDecl(e)) => {
                        match &e.decl {
                            Decl::Class(ClassDecl { ident, .. })
                            | Decl::Fn(FnDecl { ident, .. }) => {
                                let ident = ident.clone();
                                let var_name = private_ident!(format!("_{}", ident.sym));
                                let var = VarDeclarator {
                                    span: DUMMY_SP,
                                    name: var_name.clone().into(),
                                    init: None,
                                    definite: Default::default(),
                                };

                                new.push(T::from_stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    declare: false,
                                    decls: vec![var],
                                    ..Default::default()
                                })))));

                                try_body.push(Stmt::Decl(e.decl));
                                try_body.push(Stmt::Expr(ExprStmt {
                                    span: DUMMY_SP,
                                    expr: AssignExpr {
                                        span: DUMMY_SP,
                                        op: op!("="),
                                        left: var_name.clone().into(),
                                        right: ident.clone().into(),
                                    }
                                    .into(),
                                }));

                                let specifier = ExportSpecifier::Named(ExportNamedSpecifier {
                                    span: DUMMY_SP,
                                    orig: ModuleExportName::Ident(var_name),
                                    exported: Some(ModuleExportName::Ident(ident.clone())),
                                    is_type_only: false,
                                });

                                extras.push(
                                    T::try_from_module_decl(ModuleDecl::ExportNamed(NamedExport {
                                        span: DUMMY_SP,
                                        specifiers: vec![specifier],
                                        src: None,
                                        type_only: false,
                                        with: None,
                                    }))
                                    .unwrap(),
                                );
                            }
                            Decl::Var(d) => {
                                let orig_var_names: Vec<Ident> = find_pat_ids(&d.decls);

                                let var_names = orig_var_names
                                    .iter()
                                    .map(|ident| private_ident!(format!("_{}", ident.sym)))
                                    .collect::<Vec<_>>();

                                let var_decls = var_names
                                    .iter()
                                    .cloned()
                                    .map(|var_name| VarDeclarator {
                                        span: DUMMY_SP,
                                        name: var_name.into(),
                                        init: None,
                                        definite: Default::default(),
                                    })
                                    .collect();

                                new.push(T::from_stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    declare: false,
                                    decls: var_decls,
                                    ..Default::default()
                                })))));

                                try_body.push(Stmt::Decl(e.decl));
                                try_body.push(Stmt::Expr(ExprStmt {
                                    span: DUMMY_SP,
                                    expr: Expr::from_exprs(
                                        orig_var_names
                                            .iter()
                                            .zip(var_names.iter())
                                            .map(|(orig, var_name)| {
                                                AssignExpr {
                                                    span: DUMMY_SP,
                                                    op: op!("="),
                                                    left: var_name.clone().into(),
                                                    right: orig.clone().into(),
                                                }
                                                .into()
                                            })
                                            .collect(),
                                    ),
                                }));
                                let specifiers = orig_var_names
                                    .iter()
                                    .zip(var_names.iter())
                                    .map(|(orig, var)| {
                                        ExportSpecifier::Named(ExportNamedSpecifier {
                                            span: DUMMY_SP,
                                            orig: ModuleExportName::Ident(var.clone()),
                                            exported: Some(ModuleExportName::Ident(orig.clone())),
                                            is_type_only: false,
                                        })
                                    })
                                    .collect();

                                extras.push(
                                    T::try_from_module_decl(ModuleDecl::ExportNamed(NamedExport {
                                        span: DUMMY_SP,
                                        specifiers,
                                        src: None,
                                        type_only: false,
                                        with: None,
                                    }))
                                    .unwrap(),
                                );
                            }
                            _ => {
                                new.push(
                                    T::try_from_module_decl(ModuleDecl::ExportDecl(e)).unwrap(),
                                );
                            }
                        };
                    }

                    Ok(stmt) => new.push(T::try_from_module_decl(stmt).unwrap()),
                    Err(stmt) => new.push(stmt),
                },
            }
        }

        // Drop `;`
        try_body.retain(|stmt| !matches!(stmt, Stmt::Empty(..)));

        // usingCtx.e = $catch_var
        let assign_error = AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: state
                .using_ctx
                .clone()
                .make_member(quote_ident!("e"))
                .into(),
            right: state.catch_var.clone().into(),
        }
        .into_stmt();

        // _usingCtx.d()
        let dispose_expr = CallExpr {
            span: DUMMY_SP,
            callee: state
                .using_ctx
                .clone()
                .make_member(quote_ident!("d"))
                .as_callee(),
            args: vec![],
            ..Default::default()
        };
        let dispose_stmt = if state.has_await {
            AwaitExpr {
                span: DUMMY_SP,
                arg: Box::new(dispose_expr.into()),
            }
            .into()
        } else {
            dispose_expr.into()
        }
        .into_stmt();

        let try_stmt = TryStmt {
            span: DUMMY_SP,
            block: BlockStmt {
                span: DUMMY_SP,
                stmts: try_body,
                ..Default::default()
            },
            handler: Some(CatchClause {
                span: DUMMY_SP,
                param: Some(state.catch_var.into()),
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![assign_error],
                    ..Default::default()
                },
            }),
            finalizer: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![dispose_stmt],
                ..Default::default()
            }),
        };

        new.push(T::from_stmt(Stmt::Try(Box::new(try_stmt))));
        new.extend(extras);

        *stmts = new;
    }
}

impl VisitMut for ExplicitResourceManagement {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        maybe_grow_default(|| n.visit_mut_children_with(self));
    }

    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        n.visit_mut_children_with(self);

        if let ForHead::UsingDecl(decl) = &mut n.left {
            let state = State::default();

            n.left = ForHead::VarDecl(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Const,
                declare: false,
                decls: decl.decls.take(),
                ..Default::default()
            }));

            let mut body = vec![*n.body.take()];
            self.wrap_with_try(state, &mut body);
            n.body = Box::new(Stmt::Block(BlockStmt {
                span: DUMMY_SP,
                stmts: body,
                ..Default::default()
            }))
        }
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(stmts)
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        maybe_grow_default(|| s.visit_mut_children_with(self));

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
                            callee: state
                                .using_ctx
                                .clone()
                                .make_member(if decl.is_await {
                                    quote_ident!("a")
                                } else {
                                    quote_ident!("u")
                                })
                                .as_callee(),
                            args: vec![d.init.unwrap().as_arg()],
                            ..Default::default()
                        };

                        VarDeclarator {
                            init: Some(init.into()),
                            ..d
                        }
                    })
                    .collect(),
                ..Default::default()
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
