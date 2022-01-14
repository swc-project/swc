use crate::rule::{visitor_rule, Rule};
use swc_common::errors::HANDLER;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit};

const MESSAGE: &'static str = "Unexpected console statement";

pub fn no_console() -> Box<dyn Rule> {
    visitor_rule(NoConsole::default())
}

#[derive(Debug, Default)]
struct NoConsole;

impl NoConsole {
    fn check(&mut self, id: &Ident) {
        if id.sym.eq("console") {
            if id.span.ctxt.outer().as_u32() == 1 {
                HANDLER.with(|handler| handler.struct_span_err(id.span, MESSAGE).emit());
            }
        }
    }
}

impl Visit for NoConsole {
    noop_visit_type!();

    fn visit_ident(&mut self, id: &Ident) {
        self.check(id);
    }
}
