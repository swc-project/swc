use swc_ecma_ast::*;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

pub fn explicit_resource_management() -> impl Fold + VisitMut {
    as_folder(ExplicitResourceManagement::default())
}

#[derive(Default)]
struct ExplicitResourceManagement {}

impl ExplicitResourceManagement {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        for stmt in stmts.iter_mut() {
            match stmt.as_stmt() {
                Some(stmt) => match stmt {
                    Stmt::Decl(Decl::Using(using)) => {}

                    _ => {}
                },
                None => {}
            }
        }
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
