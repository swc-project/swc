use rustc_hash::FxHashSet;
use serde::{Deserialize, Serialize};
use swc_atoms::Atom;
use swc_common::{errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "Unexpected console statement";

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct NoConsoleConfig {
    allow: Option<FxHashSet<String>>,
}

pub fn no_console(
    config: &RuleConfig<NoConsoleConfig>,
    unresolved_ctxt: SyntaxContext,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoConsole::new(config, unresolved_ctxt))),
    }
}

#[derive(Debug, Default)]
struct NoConsole {
    expected_reaction: LintRuleReaction,
    unresolved_ctxt: SyntaxContext,
    allow: Option<FxHashSet<Atom>>,
}

impl NoConsole {
    fn new(config: &RuleConfig<NoConsoleConfig>, unresolved_ctxt: SyntaxContext) -> Self {
        Self {
            expected_reaction: config.get_rule_reaction(),
            allow: config.get_rule_config().allow.as_ref().map(|method_names| {
                method_names
                    .iter()
                    .map(|method_name| Atom::from(method_name.as_str()))
                    .collect()
            }),
            unresolved_ctxt,
        }
    }

    fn check(&self, span: Span, ident: &Ident, method: &Atom) {
        if &*ident.sym == "console" && ident.ctxt == self.unresolved_ctxt {
            if let Some(allow) = &self.allow {
                if allow.contains(method) {
                    return;
                }
            }

            HANDLER.with(|handler| match self.expected_reaction {
                LintRuleReaction::Error => {
                    handler.struct_span_err(span, MESSAGE).emit();
                }
                LintRuleReaction::Warning => {
                    handler.struct_span_warn(span, MESSAGE).emit();
                }
                _ => {}
            });
        }
    }
}

impl Visit for NoConsole {
    noop_visit_type!();

    fn visit_member_expr(&mut self, member: &MemberExpr) {
        if let Expr::Ident(ident) = member.obj.as_ref() {
            match &member.prop {
                MemberProp::Ident(IdentName { sym, .. }) => {
                    self.check(member.span, ident, sym);
                }
                MemberProp::Computed(ComputedPropName { expr, .. }) => {
                    if let Expr::Lit(Lit::Str(Str { value, .. })) = expr.as_ref() {
                        let method_atom = value.to_atom_lossy();
                        self.check(member.span, ident, method_atom.as_ref());
                    } else {
                        expr.visit_with(self);
                    }
                }
                _ => {}
            }
        }
    }
}
