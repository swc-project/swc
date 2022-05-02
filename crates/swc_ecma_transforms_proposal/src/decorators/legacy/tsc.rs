use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::{VisitMut, VisitMutWith};

pub struct TscDecorator {
    appended_stmts: Vec<Stmt>,
}

impl TscDecorator {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        let old_appended_stmts = self.appended_stmts.take();

        let mut new = vec![];

        for mut s in stmts.take() {
            debug_assert!(self.appended_stmts.is_empty());

            s.visit_mut_with(self);

            new.push(s);
            new.extend(
                self.appended_stmts
                    .drain(..)
                    .into_iter()
                    .map(|s| T::from_stmt(s)),
            );
        }

        *stmts = new;

        self.appended_stmts = old_appended_stmts;
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
