use swc_common::{errors::HANDLER, Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

static MESSAGE: &str = "Default parameters should be last.";

pub fn default_param_last(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(DefaultParamLast::new(config))),
    }
}

#[derive(Default, Debug)]
struct DefaultParamLast {
    expected_reaction: LintRuleReaction,
}

impl DefaultParamLast {
    pub fn new(config: &RuleConfig<()>) -> Self {
        Self {
            expected_reaction: config.get_rule_reaction(),
        }
    }

    fn check<'a, I>(&self, patterns: I)
    where
        I: IntoIterator<Item = (&'a Pat, Span)>,
    {
        patterns.into_iter().fold(false, |seen, (pat, span)| {
            if matches!(pat, Pat::Assign(..) | Pat::Rest(..)) {
                true
            } else {
                if seen {
                    self.emit_report(span);
                }
                seen
            }
        });
    }

    fn emit_report(&self, span: Span) {
        HANDLER.with(|handler| match self.expected_reaction {
            LintRuleReaction::Error => handler.struct_span_err(span, MESSAGE).emit(),
            LintRuleReaction::Warning => handler.struct_span_warn(span, MESSAGE).emit(),
            _ => {}
        })
    }
}

impl Visit for DefaultParamLast {
    noop_visit_type!();

    fn visit_function(&mut self, function: &Function) {
        self.check(function.params.iter().map(|param| (&param.pat, param.span)));

        function.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, arrow_expr: &ArrowExpr) {
        self.check(arrow_expr.params.iter().map(|pat| (pat, pat.span())));

        arrow_expr.visit_children_with(self);
    }

    fn visit_constructor(&mut self, constructor: &Constructor) {
        constructor
            .params
            .iter()
            .fold(false, |seen, param| match param {
                ParamOrTsParamProp::Param(Param { pat, span, .. }) => match pat {
                    Pat::Assign(..) | Pat::Rest(..) => true,
                    _ => {
                        if seen {
                            self.emit_report(*span);
                        }
                        seen
                    }
                },
                ParamOrTsParamProp::TsParamProp(TsParamProp { param, span, .. }) => match param {
                    TsParamPropParam::Assign(..) => true,
                    _ => {
                        if seen {
                            self.emit_report(*span);
                        }
                        seen
                    }
                },
            });

        constructor.visit_children_with(self);
    }

    fn visit_class_method(&mut self, class_method: &ClassMethod) {
        self.check(
            class_method
                .function
                .params
                .iter()
                .map(|param| (&param.pat, param.span)),
        );

        class_method.visit_children_with(self);
    }
}
