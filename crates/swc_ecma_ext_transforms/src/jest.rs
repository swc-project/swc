use phf::phf_set;
use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend_stmts, StmtLike};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

static HOIST_METHODS: phf::Set<&str> = phf_set![
    "mock",
    "unmock",
    "enableAutomock",
    "disableAutomock",
    "deepUnmock"
];

pub fn jest() -> impl Pass {
    visit_mut_pass(Jest::default())
}

#[derive(Default)]
struct Jest {
    imported: Vec<Id>,
}

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
                            callee: Callee::Expr(callee),
                            ..
                        }) => {
                            if self.should_hoist(callee) {
                                hoisted.push(T::from(stmt))
                            } else {
                                new.push(T::from(stmt))
                            }
                        }
                        _ => new.push(T::from(stmt)),
                    },

                    _ => new.push(T::from(stmt)),
                },
                Err(node) => new.push(node),
            };
        });

        prepend_stmts(&mut new, hoisted.into_iter());

        *orig = new;
    }

    fn should_hoist(&self, e: &Expr) -> bool {
        match e {
            Expr::Ident(i) => self.imported.iter().any(|imported| *imported == i.to_id()),

            Expr::Member(
                callee @ MemberExpr {
                    prop: MemberProp::Ident(prop),
                    ..
                },
            ) => is_global_jest(&callee.obj) && HOIST_METHODS.contains(&*prop.sym),

            _ => false,
        }
    }
}

impl VisitMut for Jest {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        for item in items.iter() {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                specifiers, src, ..
            })) = item
            {
                if src.value == "@jest/globals" {
                    for s in specifiers {
                        match s {
                            ImportSpecifier::Named(ImportNamedSpecifier {
                                local,
                                imported: None,
                                is_type_only: false,
                                ..
                            }) => {
                                if HOIST_METHODS.contains(&*local.sym) {
                                    self.imported.push(local.to_id());
                                }
                            }

                            ImportSpecifier::Named(ImportNamedSpecifier {
                                local,
                                imported: Some(exported),
                                is_type_only: false,
                                ..
                            }) => {
                                if HOIST_METHODS.contains(exported.atom()) {
                                    self.imported.push(local.to_id());
                                }
                            }
                            _ => {}
                        }
                    }
                }
            }
        }

        self.visit_mut_stmt_like(items)
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(stmts)
    }
}

fn is_global_jest(e: &Expr) -> bool {
    match e {
        Expr::Ident(i) => i.sym == *"jest",
        Expr::Member(MemberExpr { obj, .. }) => is_global_jest(obj),
        Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            ..
        }) => is_global_jest(callee),
        _ => false,
    }
}
