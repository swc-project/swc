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
    mock_vars: Vec<Id>,
}

impl Jest {
    fn visit_mut_stmt_like<T>(&mut self, orig: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        // First pass to collect mock variable declarations
        for item in &mut *orig {
            // Check for declarations with identifiers starting with "mock"
            if let Some(Stmt::Decl(Decl::Var(var_decl))) = item.as_stmt() {
                for decl in &var_decl.decls {
                    if let Pat::Ident(ident) = &decl.name {
                        let name = &*ident.id.sym;
                        if name.starts_with("mock") {
                            self.mock_vars.push(ident.id.to_id());
                        }
                    }
                }
            }

            // Standard visitation
            item.visit_mut_with(self);
        }

        let items = orig.take();

        let mut new = Vec::with_capacity(items.len());
        let mut hoisted = Vec::with_capacity(8);

        items.into_iter().for_each(|item| {
            match item.try_into_stmt() {
                Ok(stmt) => {
                    // Check for mock variable declarations to hoist
                    if let Stmt::Decl(Decl::Var(var_decl)) = &stmt {
                        let mut should_hoist = false;
                        for decl in &var_decl.decls {
                            if let Pat::Ident(ident) = &decl.name {
                                if self.mock_vars.iter().any(|id| *id == ident.id.to_id()) {
                                    should_hoist = true;
                                    break;
                                }
                            }
                        }

                        if should_hoist {
                            hoisted.push(T::from(stmt));
                            return;
                        }
                    }

                    // Check for jest calls to hoist
                    if let Stmt::Expr(ExprStmt { expr, .. }) = &stmt {
                        if let Expr::Call(CallExpr {
                            callee: Callee::Expr(callee),
                            ..
                        }) = &**expr
                        {
                            if self.should_hoist(callee) {
                                hoisted.push(T::from(stmt));
                                return;
                            }
                        }
                    }

                    new.push(T::from(stmt));
                }
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
        // First collect imported jest methods
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

        // After collecting imports, scan and find mock variables
        for item in items.iter() {
            if let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl))) = item {
                for decl in &var_decl.decls {
                    if let Pat::Ident(ident) = &decl.name {
                        let name = &*ident.id.sym;
                        if name.starts_with("mock") {
                            self.mock_vars.push(ident.id.to_id());
                        }
                    }
                }
            }
        }

        // Now process and hoist as needed
        self.visit_mut_stmt_like(items)
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        // Check for mock variables in statements as well
        for stmt in stmts.iter() {
            if let Stmt::Decl(Decl::Var(var_decl)) = stmt {
                for decl in &var_decl.decls {
                    if let Pat::Ident(ident) = &decl.name {
                        let name = &*ident.id.sym;
                        if name.starts_with("mock") {
                            self.mock_vars.push(ident.id.to_id());
                        }
                    }
                }
            }
        }

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
