use swc_common::{errors::Handler, Visit, VisitWith};
use swc_ecma_ast::*;

pub struct With<'a> {
    pub handler: &'a Handler,
}

impl<'a> Visit<WithStmt> for With<'a> {
    fn visit(&mut self, stmt: &WithStmt) {
        self.handler.warn("with statement").span(stmt.span).emit();
    }
}
