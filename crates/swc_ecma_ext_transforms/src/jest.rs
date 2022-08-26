use phf::phf_set;
use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend_stmts, StmtOrModuleItem};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

static HOIST_METHODS: phf::Set<&str> = phf_set![
    "mock",
    "unmock",
    "enableAutomock",
    "disableAutomock",
    "deepUnmock"
];

pub fn jest() -> impl Fold + VisitMut {
    as_folder(Jest)
}

struct Jest;

impl Jest {
    fn visit_mut_stmt_like<T>(&mut self, orig: &mut Vec<T>)
    where
        T: StmtOrModuleItem + VisitMutWith<Self>,
    {
        for item in &mut *orig {
            item.visit_mut_with(self);
        }

        let items = orig.take();

        let mut new = Vec::with_capacity(items.len());
        let mut hoisted = Vec::with_capacity(8);
        items.into_iter().for_each(|item| {
            match item.into_stmt() {
                Ok(stmt) => match &stmt {
                    Stmt::Expr(ExprStmt { expr, .. }) => match &**expr {
                        Expr::Call(CallExpr {
                            callee: Callee::Expr(callee),
                            ..
                        }) => match &**callee {
                            Expr::Member(
                                callee @ MemberExpr {
                                    prop: MemberProp::Ident(prop),
                                    ..
                                },
                            ) => match &*callee.obj {
                                Expr::Ident(i)
                                    if i.sym == *"jest" && HOIST_METHODS.contains(&*prop.sym) =>
                                {
                                    hoisted.push(T::from_stmt(stmt))
                                }
                                _ => new.push(T::from_stmt(stmt)),
                            },
                            _ => new.push(T::from_stmt(stmt)),
                        },
                        _ => new.push(T::from_stmt(stmt)),
                    },

                    _ => new.push(T::from_stmt(stmt)),
                },
                Err(node) => new.push(T::try_from_module_decl(node).unwrap()),
            };
        });

        prepend_stmts(&mut new, hoisted.into_iter());

        *orig = new;
    }
}

impl VisitMut for Jest {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(items)
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(stmts)
    }
}
