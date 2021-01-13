use std::mem::take;
use swc_ecma_ast::*;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

/// Merge varaibles.
pub(super) fn var_reducer() -> impl VisitMut {
    Reducer {}
}

struct Reducer {}

impl Reducer {
    fn handle_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self>,
    {
        stmts.visit_mut_children_with(self);
    }
}

impl VisitMut for Reducer {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.handle_stmt_likes(stmts);
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.handle_stmt_likes(stmts);

        // Merge var declarations fully, if possible.
        if stmts.windows(2).any(|stmts| match (&stmts[0], &stmts[1]) {
            (Stmt::Decl(Decl::Var(..)), Stmt::Decl(Decl::Var(..))) => true,
            _ => false,
        }) {
            let orig = take(stmts);
            let mut new = Vec::with_capacity(orig.len());

            let mut var_decl: Option<VarDecl> = None;

            for stmt in orig {
                match stmt {
                    Stmt::Decl(Decl::Var(below)) => {
                        //
                        match var_decl.take() {
                            Some(mut upper) if upper.kind == below.kind => {
                                upper.decls.extend(below.decls);
                                var_decl = Some(upper);
                            }
                            _ => {
                                new.extend(var_decl.take().map(Decl::Var).map(Stmt::Decl));
                                var_decl = Some(below);
                            }
                        }
                    }
                    _ => {
                        // If it's not a var decl,

                        new.extend(var_decl.take().map(Decl::Var).map(Stmt::Decl));
                        new.push(stmt);
                    }
                }
            }

            *stmts = new
        }
    }
}
