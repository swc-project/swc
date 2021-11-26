use swc_ecma_ast::*;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::{VisitMut, VisitMutWith};

/// Removes trivial nodes.
///
/// TODO: Remove this?
pub(crate) fn clean_ast() -> impl VisitMut {
    CleanAst
}

struct CleanAst;

impl CleanAst {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self>,
    {
        stmts.visit_mut_children_with(self);

        stmts.retain(|s| match s.as_stmt() {
            Some(Stmt::Empty(..)) => false,
            _ => true,
        });
    }
}

impl VisitMut for CleanAst {
    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(stmts);
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(stmts);
    }
}
