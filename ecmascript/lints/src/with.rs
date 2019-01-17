use swc_common::{errors::Handler, Visit};
use swc_ecma_ast::*;

pub struct With<'a> {
    pub handler: &'a Handler,
}

impl<'a> Visit<WithStmt> for With<'a> {
    fn visit(&mut self, stmt: &WithStmt) {
        self.handler
            .struct_warn("with statement")
            .set_span(stmt.span)
            .emit();
    }
}
