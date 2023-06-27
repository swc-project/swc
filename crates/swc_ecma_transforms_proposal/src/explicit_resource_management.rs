use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{ExprFactory, StmtLike};
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

impl ExplicitResourceManagement {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self>,
    {
        let old_state = self.state.take();

        stmts.visit_mut_with(self);

        if let Some(state) = self.state.take() {
            // var has_error = true
            let has_error_true = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: state.has_error.into(),
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
                    name: state.error_var.into(),
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
            };

            let try_stmt = TryStmt {
                span: DUMMY_SP,
                block: BlockStmt {
                    span: DUMMY_SP,
                    stmts: (),
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

            *stmts = T::from_stmt(Stmt::Try(try_stmt));
        }

        self.state = old_state;
    }
}

impl VisitMut for ExplicitResourceManagement {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(stmts)
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(stmts)
    }
}
