use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};
use serde::{Deserialize, Serialize};
use swc_common::{collections::AHashSet, errors::HANDLER, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit};

const MESSAGE: &str = "Unexpected console statement";

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct NoConsoleConfig {
    // not used for now
    allow: Option<AHashSet<String>>,
}

pub fn no_console(
    config: &RuleConfig<NoConsoleConfig>,
    top_level_ctxt: SyntaxContext,
) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoConsole::new(
            rule_reaction.clone(),
            top_level_ctxt,
        ))),
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
        if &*id.sym == "console" && id.span.ctxt == self.top_level_ctxt {
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

impl Visit for NoConsole {
    noop_visit_type!();

    fn visit_ident(&mut self, id: &Ident) {
        self.check(id);
    }
}
