use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{ExprFactory, StmtLike};
use swc_ecma_visit::{VisitMut, VisitMutWith};

pub struct TscDecorator {
    appended_exprs: Vec<Box<Expr>>,
}

impl TscDecorator {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        let old_appended_exprs = self.appended_exprs.take();

        let mut new = vec![];

        for mut s in stmts.take() {
            debug_assert!(self.appended_exprs.is_empty());

            s.visit_mut_with(self);

            new.push(s);

            new.extend(
                self.appended_exprs
                    .drain(..)
                    .into_iter()
                    .map(|expr| {
                        Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr,
                        })
                    })
                    .map(T::from_stmt),
            );
        }

        *stmts = new;

        self.appended_exprs = old_appended_exprs;
    }

    /// Creates `__decorator` calls.
    fn add_decorate_call(
        &mut self,
        decorators: impl IntoIterator<Item = Box<Expr>>,
        target: ExprOrSpread,
        key: ExprOrSpread,
        desc: ExprOrSpread,
    ) {
        let decorators = ArrayLit {
            span: DUMMY_SP,
            elems: decorators
                .into_iter()
                .map(|v| v.as_arg())
                .map(Some)
                .collect(),
        }
        .as_arg();

        self.appended_exprs.push(Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: helper!(decorate, "__decorate"),
            args: vec![decorators, target, key, desc],
            type_args: Default::default(),
        })));
    }
}

impl VisitMut for TscDecorator {
    fn visit_mut_module_items(&mut self, s: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(s)
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(s)
    }

    fn visit_mut_class_prop(&mut self, c: &mut ClassProp) {
        c.visit_mut_children_with(self);

        if !c.decorators.is_empty() {}
    }
}
