use crate::util::MapWithMut;
use phf::phf_set;
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend_stmts, StmtLike};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

static HOIST_METHODS: phf::Set<&str> = phf_set![
    "mock",
    "unmock",
    "enableAutomock",
    "disableAutomock",
    "deepUnmock"
];

pub fn jest() -> impl Fold {
    as_folder(Jest)
}

struct Jest;

impl Jest {
    fn visit_mut_stmt_like<T>(&mut self, orig: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        for item in &mut *orig {
            item.visit_mut_with(self);
        }

        let items = orig.take();

        let mut new = Vec::with_capacity(items.len());
        let mut hoisted = Vec::with_capacity(8);
        items.into_iter().for_each(|item| {
            match item.try_into_stmt() {
                Ok(stmt) => match &stmt {
                    Stmt::Expr(ExprStmt { expr, .. }) => match &**expr {
                        Expr::Call(CallExpr {
                            callee: ExprOrSuper::Expr(callee),
                            ..
                        }) => match &**callee {
                            Expr::Member(
                                callee
                                @
                                MemberExpr {
                                    computed: false, ..
                                },
                            ) => match &callee.obj {
                                ExprOrSuper::Super(_) => new.push(T::from_stmt(stmt)),
                                ExprOrSuper::Expr(callee_obj) => match &**callee_obj {
                                    Expr::Ident(i) if i.sym == *"jest" => match &*callee.prop {
                                        Expr::Ident(prop) if HOIST_METHODS.contains(&*prop.sym) => {
                                            hoisted.push(T::from_stmt(stmt));
                                            return;
                                        }
                                        _ => new.push(T::from_stmt(stmt)),
                                    },
                                    _ => new.push(T::from_stmt(stmt)),
                                },
                            },
                            _ => new.push(T::from_stmt(stmt)),
                        },
                        _ => new.push(T::from_stmt(stmt)),
                    },

                    _ => new.push(T::from_stmt(stmt)),
                },
                Err(node) => new.push(node),
            };
        });

        prepend_stmts(&mut new, hoisted.into_iter());

        *orig = new;
    }
}

impl VisitMut for Jest {
    noop_visit_mut_type!();

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(stmts)
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(items)
    }
}
