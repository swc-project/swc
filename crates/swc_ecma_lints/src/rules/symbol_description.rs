use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
    rules::utils::{extract_arg_val, ArgValue},
};

const SYMBOL_EXPECTED_MESSAGE: &str = "Expected Symbol to have a description";
const SYMBOL_STRING_DESCRIPTION_EXPECTED_MESSAGE: &str = "Symbol description should be a string";

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SymbolDescriptionConfig {
    enforce_string_description: Option<bool>,
}

pub fn symbol_description(
    unresolved_ctxt: SyntaxContext,
    config: &RuleConfig<SymbolDescriptionConfig>,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(SymbolDescription::new(
            unresolved_ctxt,
            config,
        ))),
    }
}

#[derive(Debug, Default)]
struct SymbolDescription {
    expected_reaction: LintRuleReaction,
    unresolved_ctxt: SyntaxContext,

    enforce_string_description: bool,
}

impl SymbolDescription {
    fn new(unresolved_ctxt: SyntaxContext, config: &RuleConfig<SymbolDescriptionConfig>) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            unresolved_ctxt,

            enforce_string_description: rule_config.enforce_string_description.unwrap_or(true),
        }
    }

    fn is_symbol_call(&self, ident: &Ident) -> bool {
        if ident.ctxt != self.unresolved_ctxt {
            return false;
        }

        &*ident.sym == "Symbol"
    }

    fn check(&self, span: Span, first_arg: Option<&ExprOrSpread>) {
        if let Some(ExprOrSpread { expr, .. }) = first_arg {
            if self.enforce_string_description {
                match extract_arg_val(self.unresolved_ctxt, expr.unwrap_seqs_and_parens()) {
                    ArgValue::Str(_) => {}
                    _ => {
                        self.emit_report(span, SYMBOL_STRING_DESCRIPTION_EXPECTED_MESSAGE);
                    }
                }
            }

            return;
        }

        self.emit_report(span, SYMBOL_EXPECTED_MESSAGE);
    }

    fn emit_report(&self, span: Span, message: &str) {
        HANDLER.with(|handler| match self.expected_reaction {
            LintRuleReaction::Error => {
                handler.struct_span_err(span, message).emit();
            }
            LintRuleReaction::Warning => {
                handler.struct_span_warn(span, message).emit();
            }
            _ => {}
        });
    }
}

impl Visit for SymbolDescription {
    fn visit_call_expr(&mut self, call_expr: &CallExpr) {
        if let Callee::Expr(expr) = &call_expr.callee {
            if let Expr::Ident(ident) = expr.as_ref() {
                if self.is_symbol_call(ident) {
                    self.check(call_expr.span, call_expr.args.first());
                }
            }
        }

        call_expr.visit_children_with(self);
    }
}
