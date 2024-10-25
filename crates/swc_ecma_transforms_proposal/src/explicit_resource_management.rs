use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    private_ident, quote_ident, stack_size::maybe_grow_default, ExprFactory, ModuleItemLike,
    StmtLike,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

pub fn explicit_resource_management() -> impl Pass {
    visit_mut_pass(ExplicitResourceManagement::default())
}

#[derive(Default)]
struct ExplicitResourceManagement {
    state: Option<State>,

    is_not_top_level: bool,
}

struct State {
    env: Ident,
    has_await: bool,

    vars: Vec<(Pat, Box<Expr>)>,
}

impl Default for State {
    fn default() -> Self {
        Self {
            env: private_ident!("env"),
            has_await: false,
            vars: Vec::new(),
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
        let mut new = Vec::new();
        let mut extras = Vec::new();

        let env = state.env;
        let catch_e = private_ident!("e");

        let is_async = state.has_await;

        // const env_1 = { stack: [], error: void 0, hasError: false };
        new.push(T::from(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Const,
            declare: false,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(env.clone().into()),
                init: Some(Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(quote_ident!("stack")),
                            value: Box::new(Expr::Array(ArrayLit {
                                span: DUMMY_SP,
                                elems: vec![],
                            })),
                        }))),
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(quote_ident!("error")),
                            value: Expr::undefined(DUMMY_SP),
                        }))),
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(quote_ident!("hasError")),
                            value: Box::new(Expr::Lit(Lit::Bool(Bool {
                                span: DUMMY_SP,
                                value: false,
                            }))),
                        }))),
                    ],
                }))),
                definite: false,
            }],
            ..Default::default()
        })))));

        let mut try_block = BlockStmt {
            stmts: vec![],
            ..Default::default()
        };

        for (name, disposable) in state.vars {
            let init_var_decl = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Const,
                declare: false,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name,
                    init: Some(
                        CallExpr {
                            callee: helper!(ts, ts_add_disposable_resource),
                            args: vec![
                                env.clone().as_arg(),
                                disposable.as_arg(),
                                is_async.as_arg(),
                            ],
                            ..Default::default()
                        }
                        .into(),
                    ),
                    definite: false,
                }],
                ..Default::default()
            })));

            try_block.stmts.push(init_var_decl);
        }

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => try_block.stmts.push(stmt),
                Err(t) => extras.push(t),
            }
        }

        let catch_clause = CatchClause {
            span: DUMMY_SP,
            param: Some(Pat::Ident(catch_e.clone().into())),
            body: BlockStmt {
                span: DUMMY_SP,
                stmts: vec![
                    // env.e = e;
                    AssignExpr {
                        span: DUMMY_SP,
                        left: MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(env.clone().into()),
                            prop: MemberProp::Ident(quote_ident!("error")),
                        }
                        .into(),
                        op: op!("="),
                        right: Box::new(catch_e.clone().into()),
                    }
                    .into_stmt(),
                    // env.hasError = true;
                    AssignExpr {
                        span: DUMMY_SP,
                        left: MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(env.clone().into()),
                            prop: MemberProp::Ident(quote_ident!("hasError")),
                        }
                        .into(),
                        op: op!("="),
                        right: Box::new(Expr::Lit(Lit::Bool(Bool {
                            span: DUMMY_SP,
                            value: true,
                        }))),
                    }
                    .into_stmt(),
                ],
                ..Default::default()
            },
        };

        let finally_block = if is_async {
            // Code:
            // const result_1 = _ts_dispose_resources(env_1);
            // if (result_1)
            //      await result_1;

            let result = private_ident!("result");

            let var_decl = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                kind: VarDeclKind::Const,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(result.clone().into()),
                    init: Some(
                        CallExpr {
                            callee: helper!(ts, ts_dispose_resources),
                            args: vec![env.clone().as_arg()],
                            ..Default::default()
                        }
                        .into(),
                    ),
                    definite: false,
                }],
                ..Default::default()
            })));
            let if_stmt = Stmt::If(IfStmt {
                span: DUMMY_SP,
                test: result.clone().into(),
                // Code:
                //      await result_1;
                cons: Stmt::Expr(ExprStmt {
                    expr: Box::new(Expr::Await(AwaitExpr {
                        arg: result.clone().into(),
                        ..Default::default()
                    })),
                    ..Default::default()
                })
                .into(),
                ..Default::default()
            });

            vec![var_decl, if_stmt]
        } else {
            // Code:
            // _ts_dispose_resources(env_1);
            vec![CallExpr {
                callee: helper!(ts, ts_dispose_resources),
                args: vec![env.clone().as_arg()],
                ..Default::default()
            }
            .into_stmt()]
        };

        let try_stmt = TryStmt {
            span: DUMMY_SP,
            block: try_block,
            handler: Some(catch_clause),
            finalizer: Some(BlockStmt {
                stmts: finally_block,
                ..Default::default()
            }),
        };

        new.push(T::from(try_stmt.into()));
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

        if let ForHead::UsingDecl(using) = &mut n.left {
            let mut state = State::default();
            state.has_await |= using.is_await;

            let mut inner_var_decl = VarDecl {
                kind: VarDeclKind::Const,
                ..Default::default()
            };

            for decl in &mut using.decls {
                let new_var = private_ident!("_");

                inner_var_decl.decls.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: decl.name.take(),
                    init: Some(
                        CallExpr {
                            callee: helper!(ts, ts_add_disposable_resource),
                            args: vec![
                                state.env.clone().as_arg(),
                                new_var.clone().as_arg(),
                                using.is_await.as_arg(),
                            ],
                            ..Default::default()
                        }
                        .into(),
                    ),
                    definite: false,
                });

                decl.name = Pat::Ident(new_var.clone().into());
            }

            let var_decl = Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Const,
                declare: false,
                decls: using.decls.take(),
                ..Default::default()
            });

            let mut body = vec![
                Stmt::Decl(Decl::Var(Box::new(inner_var_decl))),
                *n.body.take(),
            ];
            self.wrap_with_try(state, &mut body);

            n.left = ForHead::VarDecl(var_decl);
            n.body = Box::new(
                BlockStmt {
                    span: DUMMY_SP,
                    stmts: body,
                    ..Default::default()
                }
                .into(),
            )
        }
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(stmts)
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        maybe_grow_default(|| s.visit_mut_children_with(self));

        if let Stmt::Decl(Decl::Using(using)) = s {
            let state = self.state.get_or_insert_with(Default::default);

            let decl = handle_using_decl(using, state);
            if decl.decls.is_empty() {
                s.take();
                return;
            }

            *s = Stmt::Decl(Decl::Var(decl));
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let old_is_not_top_level = self.is_not_top_level;
        self.is_not_top_level = true;
        self.visit_mut_stmt_likes(stmts);
        self.is_not_top_level = old_is_not_top_level;
    }
}

fn handle_using_decl(using: &mut UsingDecl, state: &mut State) -> Box<VarDecl> {
    state.has_await |= using.is_await;

    for decl in &mut using.decls {
        decl.init = Some(
            CallExpr {
                callee: helper!(ts, ts_add_disposable_resource),
                args: vec![
                    state.env.clone().as_arg(),
                    decl.init.take().unwrap().as_arg(),
                    using.is_await.as_arg(),
                ],
                ..Default::default()
            }
            .into(),
        );
    }

    Box::new(VarDecl {
        span: DUMMY_SP,
        kind: VarDeclKind::Const,
        declare: false,
        decls: using.decls.take(),
        ..Default::default()
    })
}
