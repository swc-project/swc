use serde::{Deserialize, Serialize};
use swc_common::{collections::AHashSet, errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls_with_ctxt, ident::IdentLike};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
    rules::utils::{extract_arg_val, unwrap_seqs_and_parens, ArgValue},
};

const SYMBOL_EXPECTED_MESSAGE: &str = "Expected Symbol to have a description";
const SYMBOL_STRING_DESCRIPTION_EXPECTED_MESSAGE: &str = "Symbol description should be a string";

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SymbolDescriptionConfig {
    enforce_string_description: Option<bool>,
}

pub fn symbol_description(
    program: &Program,
    top_level_ctxt: SyntaxContext,
    config: &RuleConfig<SymbolDescriptionConfig>,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(SymbolDescription::new(
            collect_decls_with_ctxt(program, top_level_ctxt),
            top_level_ctxt,
            config,
        ))),
    }
}

#[derive(Debug, Default)]
struct SymbolDescription {
    expected_reaction: LintRuleReaction,
    top_level_ctxt: SyntaxContext,
    top_level_declared_vars: AHashSet<Id>,
    enforce_string_description: bool,
}

impl SymbolDescription {
    fn new(
        top_level_declared_vars: AHashSet<Id>,
        top_level_ctxt: SyntaxContext,
        config: &RuleConfig<SymbolDescriptionConfig>,
    ) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            top_level_ctxt,
            top_level_declared_vars,
            enforce_string_description: rule_config.enforce_string_description.unwrap_or(true),
        }
    }

    fn is_symbol_call(&self, ident: &Ident) -> bool {
        if self.top_level_declared_vars.contains(&ident.to_id()) {
            return false;
        }

        if ident.span.ctxt != self.top_level_ctxt {
            return false;
        }

        &*ident.sym == "Symbol"
    }

    fn check(&self, span: Span, first_arg: Option<&ExprOrSpread>) {
        if let Some(ExprOrSpread { expr, .. }) = first_arg {
            if self.enforce_string_description {
                match extract_arg_val(
                    &self.top_level_ctxt,
                    &self.top_level_declared_vars,
                    unwrap_seqs_and_parens(expr),
                ) {
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
