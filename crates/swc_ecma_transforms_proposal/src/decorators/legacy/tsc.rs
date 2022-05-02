use swc_ecma_ast::*;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::VisitMut;

pub struct TscDecorator {
    extra_stmts: Vec<Stmt>,
}

impl TscDecorator {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        for s in stmts.iter_mut() {}
    }
}

impl VisitMut for TscDecorator {
    fn visit_mut_module_items(&mut self, s: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(s)
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(s)
    }
}
