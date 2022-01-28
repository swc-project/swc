use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};
use serde::{Deserialize, Serialize};
use swc_common::{collections::AHashSet, errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

const MESSAGE: &str = "Unexpected console statement";

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct PreferRegexLiteralsConfig {
    #[serde(rename = "disallowRedundantWrapping")]
    disallow_redundant_wrapping: Option<bool>,
}

pub fn prefer_regex_literals(
    config: &RuleConfig<PreferRegexLiteralsConfig>,
    top_level_ctxt: SyntaxContext,
    // program required to resolve root redefined vars
) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    let disallow_redundant_wrapping = config
        .get_rule_config()
        .disallow_redundant_wrapping
        .unwrap_or(false);

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(PreferRegexLiterals::new(
            *rule_reaction,
            disallow_redundant_wrapping,
            top_level_ctxt,
        ))),
    }
}
#[derive(Debug)]
enum ArgValueType {
    Str,
    RegExp,
    Another,
}

#[derive(Debug, Default)]
struct PreferRegexLiterals {
    expected_reaction: LintRuleReaction,
    disallow_redundant_wrapping: bool,
    top_level_ctxt: SyntaxContext,
    call_span: Option<Span>,
    first_arg: Option<ArgValueType>,
    second_arg: Option<ArgValueType>,
}

impl PreferRegexLiterals {
    fn new(
        expected_reaction: LintRuleReaction,
        disallow_redundant_wrapping: bool,
        top_level_ctxt: SyntaxContext,
    ) -> Self {
        Self {
            expected_reaction,
            disallow_redundant_wrapping,
            top_level_ctxt,
            call_span: None,
            first_arg: None,
            second_arg: None,
        }
    }

    fn reset_state(&mut self) {
        self.call_span = None;
        self.first_arg = None;
        self.second_arg = None;
    }

    fn set_state(&mut self, call_span: Span, args: &Vec<ExprOrSpread>) {
        self.call_span = Some(call_span);

        if let Some(ExprOrSpread { expr, .. }) = args.get(0) {
            let value = match expr.as_ref() {
                Expr::Lit(Lit::Str(_)) => ArgValueType::Str,
                Expr::Lit(Lit::Regex(_)) => ArgValueType::RegExp,
                Expr::Tpl(Tpl { exprs, .. }) => match exprs.len() {
                    0 => ArgValueType::Str,
                    _ => ArgValueType::Another,
                },
                Expr::TaggedTpl(TaggedTpl {
                    tpl: Tpl { exprs, .. },
                    ..
                }) => match exprs.len() {
                    0 => ArgValueType::Str,
                    _ => ArgValueType::Another,
                },
                _ => ArgValueType::Another,
            };

            self.first_arg = Some(value);
        }

        if let Some(ExprOrSpread { expr, .. }) = args.get(1) {
            let value = match expr.as_ref() {
                Expr::Lit(Lit::Str(_)) => ArgValueType::Str,
                Expr::Tpl(Tpl { exprs, .. }) => match exprs.len() {
                    0 => ArgValueType::Str,
                    _ => ArgValueType::Another,
                },
                Expr::TaggedTpl(TaggedTpl {
                    tpl: Tpl { exprs, .. },
                    ..
                }) => match exprs.len() {
                    0 => ArgValueType::Str,
                    _ => ArgValueType::Another,
                },
                _ => ArgValueType::Another,
            };

            self.second_arg = Some(value);
        }
    }

    fn emit_report(&self) {
        let span = self.call_span.unwrap();

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

    fn check(&self, ident: &Ident) {
        use ArgValueType::*;

        if &*ident.sym == "RegExp" {
            match (self.first_arg.as_ref(), self.second_arg.as_ref()) {
                (Some(Str), None) => self.emit_report(),
                (Some(Str), Some(Str)) => self.emit_report(),
                (Some(RegExp), _) => {
                    if self.disallow_redundant_wrapping {
                        self.emit_report();
                    }
                }
                _ => {}
            }
        }
    }
}

impl Visit for PreferRegexLiterals {
    noop_visit_type!();

    fn visit_new_expr(&mut self, new_expr: &NewExpr) {
        if let Some(args) = &new_expr.args {
            self.set_state(new_expr.span, args);
        }

        new_expr.visit_children_with(self);

        self.reset_state();
    }

    fn visit_call_expr(&mut self, call_expr: &CallExpr) {
        self.set_state(call_expr.span, &call_expr.args);

        call_expr.visit_children_with(self);

        self.reset_state();
    }

    fn visit_ident(&mut self, ident: &Ident) {
        if ident.span.ctxt != self.top_level_ctxt {
            return;
        }

        // check here is redefined

        self.check(ident);
    }
}
