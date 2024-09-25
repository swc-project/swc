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
    env: Ident,
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

    fn wrap_with_try<T>(&mut self, state: State, disposable: Box<Expr>, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike,
    {
        let mut new = Vec::new();
        let mut extras = Vec::new();
        let mut try_body = Vec::new();

        let env = private_ident!("env");
        let catch_e = private_ident!("e");

        let try_block = BlockStmt {};

        let catch_clause = CatchClause {
            span: DUMMY_SP,
            param: Some(Pat::Ident(catch_e.clone())),
            body: Box::new(
                BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![],
                    ..Default::default()
                }
                .into(),
            ),
        };

        let try_stmt = TryStmt {
            span: DUMMY_SP,
            block: try_block,
            handler: Some(catch_clause),
            finalizer: Some(BlockStmt {
                stmts: vec![CallExpr {
                    callee: helper!(ts, ts_dispose_resources),
                    args: vec![env.clone().as_arg()],
                    ..Default::default()
                }
                .into_stmt()],
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

        if let Stmt::Decl(Decl::Using(decl)) = s {
            let state = self.state.get_or_insert_with(Default::default);

            state.has_await |= decl.is_await;

            *s = VarDecl {
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
            }
            .into();
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let old_is_not_top_level = self.is_not_top_level;
        self.is_not_top_level = true;
        self.visit_mut_stmt_likes(stmts);
        self.is_not_top_level = old_is_not_top_level;
    }
}
