use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "Use the isNaN function to compare with NaN";

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UseIsNanConfig {
    enforce_for_switch_case: Option<bool>,
    enforce_for_index_of: Option<bool>,
    check_any_cast: Option<bool>,
}

pub fn use_is_nan(
    unresolved_ctxt: SyntaxContext,
    config: &RuleConfig<UseIsNanConfig>,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(UseIsNan::new(unresolved_ctxt, config))),
    }
}

#[derive(Debug, Default)]
struct UseIsNan {
    expected_reaction: LintRuleReaction,
    unresolved_ctxt: SyntaxContext,

    enforce_for_switch_case: bool,
    enforce_for_index_of: bool,
    check_any_cast: bool,
}

impl UseIsNan {
    fn new(unresolved_ctxt: SyntaxContext, config: &RuleConfig<UseIsNanConfig>) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            unresolved_ctxt,
            enforce_for_switch_case: rule_config.enforce_for_switch_case.unwrap_or(true),
            enforce_for_index_of: rule_config.enforce_for_index_of.unwrap_or(true),
            check_any_cast: rule_config.check_any_cast.unwrap_or(true),
        }
    }

    fn emit_report(&self, span: Span, label_msg: &str) {
        HANDLER.with(|handler| {
            match self.expected_reaction {
                LintRuleReaction::Error => handler.struct_span_err(span, MESSAGE),
                LintRuleReaction::Warning => handler.struct_span_warn(span, MESSAGE),
                _ => {
                    return;
                }
            }
            .span_label(span, label_msg)
            .help("NaN is a special value and `NaN == NaN` is false")
            .emit();
        });
    }

    fn check(&self, expr_span: Option<Span>, expr: &Expr, label_msg: &str) {
        match expr {
            Expr::TsAs(TsAsExpr {
                expr,
                type_ann,
                span,
                ..
            }) => {
                if self.check_any_cast {
                    if let TsType::TsKeywordType(TsKeywordType {
                        kind: TsKeywordTypeKind::TsAnyKeyword,
                        ..
                    }) = type_ann.as_ref()
                    {
                        self.check(expr_span.or(Some(*span)), expr.as_ref(), label_msg);
                    }
                }
            }
            Expr::Ident(ident) => {
                if &*ident.sym == "NaN" {
                    self.emit_report(expr_span.unwrap_or(ident.span), label_msg);
                }
            }
            Expr::Member(MemberExpr {
                obj, prop, span, ..
            }) => {
                if let Expr::Ident(obj) = obj.as_ref() {
                    if obj.ctxt != self.unresolved_ctxt {
                        return;
                    }

                    if &*obj.sym == "Number" {
                        match prop {
                            MemberProp::Ident(ident) => {
                                if &*ident.sym == "NaN" {
                                    self.emit_report(expr_span.unwrap_or(*span), label_msg);
                                }
                            }
                            MemberProp::Computed(ComputedPropName { expr, .. }) => {
                                if let Expr::Lit(Lit::Str(Str { value, .. })) = expr.as_ref() {
                                    if value == "NaN" {
                                        self.emit_report(expr_span.unwrap_or(*span), label_msg);
                                    }
                                }
                            }
                            _ => {}
                        }
                    }
                }
            }
            _ => {}
        }
    }
}

impl Visit for UseIsNan {
    fn visit_bin_expr(&mut self, bin_expr: &BinExpr) {
        if let op!("==") | op!("!=") = bin_expr.op {
            let label_msg = if bin_expr.op == op!("==") {
                "this will always return false"
            } else {
                "this will always return true"
            };
            self.check(Some(bin_expr.span), bin_expr.left.as_ref(), label_msg);
            self.check(Some(bin_expr.span), bin_expr.right.as_ref(), label_msg);
        }
    }

    fn visit_call_expr(&mut self, call_expr: &CallExpr) {
        if self.enforce_for_index_of {
            if let Callee::Expr(expr) = &call_expr.callee {
                if let Expr::Member(MemberExpr {
                    prop: MemberProp::Ident(prop),
                    ..
                }) = expr.as_ref()
                {
                    let sym: &str = &prop.sym;

                    if sym == "indexOf" || sym == "lastIndexOf" {
                        if let Some(ExprOrSpread { expr, .. }) = call_expr.args.first() {
                            self.check(Some(call_expr.span), expr, "this will always return -1");
                        }
                    }
                }
            }
        }

        call_expr.visit_children_with(self);
    }

    fn visit_switch_case(&mut self, switch_case: &SwitchCase) {
        if self.enforce_for_switch_case {
            if let Some(test) = &switch_case.test {
                self.check(
                    None,
                    test.as_ref(),
                    "this will never match the discriminant",
                );
            }
        }

        switch_case.visit_children_with(self);
    }

    fn visit_switch_stmt(&mut self, switch_stmt: &SwitchStmt) {
        if self.enforce_for_switch_case {
            self.check(
                None,
                switch_stmt.discriminant.as_ref(),
                "this will never match the test of any case",
            );
        }

        switch_stmt.visit_children_with(self);
    }
}
