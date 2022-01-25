use crate::{
    config::LintRuleReaction,
    rule::{visitor_rule, Rule},
};
use swc_common::{errors::HANDLER, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit};

const MESSAGE: &'static str = "Unexpected console statement";

pub fn no_console(
    config: &LintRuleReaction,
    top_level_ctxt: SyntaxContext,
) -> Option<Box<dyn Rule>> {
    match config {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoConsole::new(config.clone(), top_level_ctxt))),
    }
}

#[derive(Debug, Default)]
struct NoConsole {
    expected_reaction: LintRuleReaction,
    top_level_ctxt: SyntaxContext,
}

impl NoConsole {
    fn new(expected_reaction: LintRuleReaction, top_level_ctxt: SyntaxContext) -> Self {
        Self {
            expected_reaction,
            top_level_ctxt,
        }
    }

    fn check(&mut self, id: &Ident) {
        if &*id.sym == "console" {
            if id.span.ctxt == self.top_level_ctxt {
                HANDLER.with(|handler| match self.expected_reaction {
                    LintRuleReaction::Error => {
                        handler.struct_span_err(id.span, MESSAGE).emit();
                    }
                    LintRuleReaction::Warning => {
                        handler.struct_span_warn(id.span, MESSAGE).emit();
                    }
                    _ => {}
                });
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
