use serde::{Deserialize, Serialize};
use swc_common::{collections::AHashSet, errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls_with_ctxt, ident::IdentLike};
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
    program: &Program,
    top_level_ctxt: SyntaxContext,
    config: &RuleConfig<UseIsNanConfig>,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(UseIsNan::new(
            collect_decls_with_ctxt(program, top_level_ctxt),
            top_level_ctxt,
            config,
        ))),
    }
}

#[derive(Debug, Default)]
struct UseIsNan {
    expected_reaction: LintRuleReaction,
    top_level_ctxt: SyntaxContext,
    top_level_declared_vars: AHashSet<Id>,
    enforce_for_switch_case: bool,
    enforce_for_index_of: bool,
    check_any_cast: bool,
}

impl UseIsNan {
    fn new(
        top_level_declared_vars: AHashSet<Id>,
        top_level_ctxt: SyntaxContext,
        config: &RuleConfig<UseIsNanConfig>,
    ) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            top_level_declared_vars,
            top_level_ctxt,
            enforce_for_switch_case: rule_config.enforce_for_switch_case.unwrap_or(true),
            enforce_for_index_of: rule_config.enforce_for_index_of.unwrap_or(true),
            check_any_cast: rule_config.check_any_cast.unwrap_or(true),
        }
    }

    fn emit_report(&self, span: Span) {
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

    fn check(&self, expr_span: Option<Span>, expr: &Expr) {
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
                        self.check(expr_span.or(Some(*span)), expr.as_ref());
                    }
                }
            }
            Expr::Ident(ident) => {
                if &*ident.sym == "NaN" {
                    self.emit_report(expr_span.unwrap_or(ident.span));
                }
            }
            Expr::Member(MemberExpr {
                obj, prop, span, ..
            }) => {
                if let Expr::Ident(obj) = obj.as_ref() {
                    if obj.span.ctxt != self.top_level_ctxt {
                        return;
                    }

                    if self.top_level_declared_vars.contains(&obj.to_id()) {
                        return;
                    }

                    if &*obj.sym == "Number" {
                        match prop {
                            MemberProp::Ident(ident) => {
                                if &*ident.sym == "NaN" {
                                    self.emit_report(expr_span.unwrap_or(*span));
                                }
                            }
                            MemberProp::Computed(ComputedPropName { expr, .. }) => {
                                if let Expr::Lit(Lit::Str(Str { value, .. })) = expr.as_ref() {
                                    if &*value == "NaN" {
                                        self.emit_report(expr_span.unwrap_or(*span));
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
            self.check(Some(bin_expr.span), bin_expr.left.as_ref());
            self.check(Some(bin_expr.span), bin_expr.right.as_ref());
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
                    let sym: &str = &*prop.sym;

                    if sym == "indexOf" || sym == "lastIndexOf" {
                        if let Some(ExprOrSpread { expr, .. }) = call_expr.args.first() {
                            self.check(Some(call_expr.span), expr);
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
                self.check(None, test.as_ref());
            }
        }

        switch_case.visit_children_with(self);
    }

    fn visit_switch_stmt(&mut self, switch_stmt: &SwitchStmt) {
        if self.enforce_for_switch_case {
            self.check(None, switch_stmt.discriminant.as_ref());
        }

        switch_stmt.visit_children_with(self);
    }
}
