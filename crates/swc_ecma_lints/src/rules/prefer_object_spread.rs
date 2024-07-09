use swc_common::{errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const USE_SPREAD_MESSAGE: &str =
    r#""Use an object spread instead of `Object.assign` eg: `{ ...foo }`""#;

const USE_LITERAL_MESSAGE: &str =
    r#""Use an object literal instead of `Object.assign`. eg: `{ foo: bar }`""#;

pub fn prefer_object_spread(
    config: &RuleConfig<()>,
    unresolved_ctxt: SyntaxContext,
    es_version: EsVersion,
) -> Option<Box<dyn Rule>> {
    if es_version < EsVersion::Es2018 {
        return None;
    }

    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(PreferObjectSpread::new(
            rule_reaction,
            unresolved_ctxt,
        ))),
    }
}

#[derive(Debug, Default)]
struct PreferObjectSpread {
    expected_reaction: LintRuleReaction,
    unresolved_ctxt: SyntaxContext,
}

#[derive(Debug)]
enum ArgType {
    EmptyLiteralObject,
    LiteralObjectWithFields,
    LiteralObjectWithGetterOrSetter,
    Ident,
    Spread,
    Other,
}

impl PreferObjectSpread {
    fn new(expected_reaction: LintRuleReaction, unresolved_ctxt: SyntaxContext) -> Self {
        Self {
            expected_reaction,
            unresolved_ctxt,
        }
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

    fn recognize_expr_arg(expr: &Expr) -> ArgType {
        match expr {
            Expr::Object(obj) => {
                if obj.props.is_empty() {
                    ArgType::EmptyLiteralObject
                } else {
                    let has_getter_or_setter = obj.props.iter().any(|prop| {
                        if let Some(prop) = prop.as_prop() {
                            return matches!(prop.as_ref(), Prop::Setter(_) | Prop::Getter(_));
                        }

                        false
                    });

                    if has_getter_or_setter {
                        ArgType::LiteralObjectWithGetterOrSetter
                    } else {
                        ArgType::LiteralObjectWithFields
                    }
                }
            }
            Expr::Ident(_) => ArgType::Ident,
            Expr::Paren(paren) => Self::recognize_expr_arg(&paren.expr),
            Expr::Seq(seq) => {
                let last = seq.exprs.last().unwrap();

                Self::recognize_expr_arg(last)
            }
            _ => ArgType::Other,
        }
    }

    fn recognize_arg(expr_or_spread: &ExprOrSpread) -> ArgType {
        if expr_or_spread.spread.is_some() {
            return ArgType::Spread;
        }

        Self::recognize_expr_arg(&expr_or_spread.expr)
    }

    fn is_global_object(&self, expr: &Expr) -> bool {
        if let Expr::Ident(ident) = expr {
            return ident.sym == "Object" && ident.ctxt == self.unresolved_ctxt;
        }

        false
    }

    fn is_method_assign(&self, mem_prop: &MemberProp) -> bool {
        match mem_prop {
            MemberProp::Ident(ident) => ident.sym == "assign",
            MemberProp::Computed(computed) => match computed.expr.as_ref() {
                Expr::Lit(Lit::Str(lit_str)) => lit_str.value == "assign",
                Expr::Tpl(tlp) => {
                    tlp.exprs.is_empty() && tlp.quasis.len() == 1 && tlp.quasis[0].raw == "assign"
                }
                _ => false,
            },
            _ => false,
        }
    }

    fn is_object_assign_call(&self, call_expr: &CallExpr) -> bool {
        if let Some(callee) = call_expr.callee.as_expr() {
            if let Some(MemberExpr { obj, prop, .. }) = callee.as_member() {
                return self.is_global_object(obj.as_expr()) && self.is_method_assign(prop);
            }
        }

        false
    }

    fn check(&mut self, call_expr: &CallExpr) {
        if call_expr.args.is_empty() {
            return;
        }

        if !self.is_object_assign_call(call_expr) {
            return;
        }

        let arg: ArgType = Self::recognize_arg(&call_expr.args[0]);

        match (call_expr.args.len(), &arg) {
            (1, ArgType::EmptyLiteralObject)
            | (1, ArgType::LiteralObjectWithFields)
            | (1, ArgType::LiteralObjectWithGetterOrSetter) => {
                self.emit_report(call_expr.span, USE_LITERAL_MESSAGE);
            }
            (_, ArgType::EmptyLiteralObject) | (_, ArgType::LiteralObjectWithFields) => {
                let has_spread_or_getter_setter = call_expr.args[1..].iter().any(|prop| {
                    matches!(
                        Self::recognize_arg(prop),
                        ArgType::Spread | ArgType::LiteralObjectWithGetterOrSetter
                    )
                });

                if has_spread_or_getter_setter {
                    return;
                }

                self.emit_report(call_expr.span, USE_SPREAD_MESSAGE);
            }
            _ => {}
        }
    }
}

impl Visit for PreferObjectSpread {
    noop_visit_type!();

    fn visit_call_expr(&mut self, call_expr: &CallExpr) {
        self.check(call_expr);

        call_expr.visit_children_with(self);
    }
}
