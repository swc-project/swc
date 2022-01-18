use crate::rule::{visitor_rule, Rule};
use swc_common::{errors::HANDLER, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit};

const MESSAGE: &'static str = "Unexpected console statement";

pub fn no_console(top_level_ctxt: SyntaxContext) -> Box<dyn Rule> {
    visitor_rule(NoConsole::new(top_level_ctxt))
}

#[derive(Debug, Default)]
struct NoConsole {
    top_level_ctxt: SyntaxContext,
}

impl NoConsole {
    fn new(top_level_ctxt: SyntaxContext) -> Self {
        Self { top_level_ctxt }
    }

    fn check(&mut self, id: &Ident) {
        if id.sym.eq("console") {
            if id.span.ctxt == self.top_level_ctxt {
                HANDLER.with(|handler| handler.struct_span_warn(id.span, MESSAGE).emit());
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
