use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{
    errors::{DiagnosticBuilder, HANDLER},
    Span, SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
    rules::utils::{extract_arg_val, ArgValue},
};

const OBJ_NAMES: &[&str] = &["Number", "globalThis"];

const MISSING_PARAMS_MESSAGE: &str = "Missing parameters";
const REDUNDANT_RADIX_MESSAGE: &str = "Redundant radix parameter";
const MISSING_RADIX_MESSAGE: &str = "Missing radix parameter";
const INVALID_RADIX_MESSAGE: &str = "Invalid radix parameter, must be an integer between 2 and 36";
const ADD_10_RADIX_MESSAGE: &str = "Add radix parameter `10` for parsing decimal numbers";

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
enum RadixMode {
    Always,
    #[serde(alias = "asNeeded")]
    AsNeeded,
}

impl Default for RadixMode {
    fn default() -> Self {
        Self::Always
    }
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RadixConfig {
    mode: Option<RadixMode>,
    unwrap_parens_and_seqs: Option<bool>,
}

pub fn radix(
    unresolved_ctxt: SyntaxContext,
    config: &RuleConfig<RadixConfig>,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(Radix::new(unresolved_ctxt, config))),
    }
}

#[derive(Default, Debug)]
struct Radix {
    expected_reaction: LintRuleReaction,
    unresolved_ctxt: SyntaxContext,

    radix_mode: RadixMode,
    unwrap_parens_and_seqs: bool,

    classes_depth: usize,
    objects_depth: usize,
    arrow_fns_depth: usize,
}

impl Radix {
    fn new(unresolved_ctxt: SyntaxContext, config: &RuleConfig<RadixConfig>) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            unresolved_ctxt,

            radix_mode: rule_config.mode.unwrap_or_default(),
            unwrap_parens_and_seqs: rule_config.unwrap_parens_and_seqs.unwrap_or(true),

            classes_depth: 0,
            objects_depth: 0,
            arrow_fns_depth: 0,
        }
    }

    fn emit_report(&self, span: Span, message: &str, note: Option<&str>) {
        HANDLER.with(|handler| {
            let mut builder: Option<DiagnosticBuilder> = None;

            match self.expected_reaction {
                LintRuleReaction::Error => {
                    builder = Some(handler.struct_span_err(span, message));
                }
                LintRuleReaction::Warning => {
                    builder = Some(handler.struct_span_warn(span, message));
                }
                _ => {}
            };

            if let Some(mut builder) = builder {
                if let Some(note) = note {
                    builder.span_note(span, note);
                }

                builder.emit();
            }
        });
    }

    fn is_inside_class(&self) -> bool {
        self.classes_depth > 0
    }

    fn is_inside_object(&self) -> bool {
        self.objects_depth > 0
    }

    fn is_inside_arrow_fn(&self) -> bool {
        self.arrow_fns_depth > 0
    }

    fn check(&self, call_expr: &CallExpr, obj: Option<JsWord>, prop: JsWord) {
        if let Some(obj) = obj {
            let obj: &str = &obj;

            if !OBJ_NAMES.contains(&obj) {
                return;
            }
        }

        if &*prop != "parseInt" {
            return;
        }

        if call_expr.args.is_empty() {
            self.emit_report(call_expr.span, MISSING_PARAMS_MESSAGE, None);

            return;
        }

        match call_expr.args.get(1) {
            Some(ExprOrSpread { expr, .. }) => {
                let expr = if self.unwrap_parens_and_seqs {
                    expr.unwrap_seqs_and_parens()
                } else {
                    expr.as_ref()
                };

                match &extract_arg_val(self.unresolved_ctxt, expr) {
                    ArgValue::Ident => {}
                    ArgValue::Number(radix) => {
                        if radix.fract() != 0.0 || !(2f64..=36f64).contains(radix) {
                            self.emit_report(call_expr.span, INVALID_RADIX_MESSAGE, None);

                            return;
                        }

                        if let RadixMode::AsNeeded = self.radix_mode {
                            if *radix == 10f64 {
                                self.emit_report(call_expr.span, REDUNDANT_RADIX_MESSAGE, None);
                            }
                        }
                    }
                    _ => {
                        self.emit_report(call_expr.span, INVALID_RADIX_MESSAGE, None);
                    }
                };
            }
            None => {
                if let RadixMode::Always = self.radix_mode {
                    self.emit_report(
                        call_expr.span,
                        MISSING_RADIX_MESSAGE,
                        Some(ADD_10_RADIX_MESSAGE),
                    );
                }
            }
        }
    }

    fn is_satisfying_indent(&self, ident: &Ident) -> bool {
        if ident.ctxt != self.unresolved_ctxt {
            return false;
        }

        true
    }

    fn extract_prop_value(&mut self, prop: &MemberProp) -> Option<JsWord> {
        match prop {
            MemberProp::Ident(IdentName { sym, .. }) => Some(sym.clone()),
            MemberProp::Computed(ComputedPropName { expr, .. }) => {
                if let Expr::Lit(Lit::Str(Str { value, .. })) = expr.as_ref() {
                    return Some(value.clone());
                }

                None
            }
            _ => None,
        }
    }

    fn extract_obj_and_prop_member_case(
        &mut self,
        member_expr: &MemberExpr,
    ) -> (Option<JsWord>, Option<JsWord>) {
        let MemberExpr { obj, prop, .. } = member_expr;

        match obj.as_ref() {
            Expr::Ident(obj) => {
                if !self.is_satisfying_indent(obj) {
                    return (None, None);
                }

                return (Some(obj.sym.clone()), self.extract_prop_value(prop));
            }
            Expr::This(_) => {
                let inside_arrow_fn = self.is_inside_arrow_fn();
                let inside_class = self.is_inside_class();

                if inside_arrow_fn && inside_class {
                    return (None, None);
                }

                if !inside_arrow_fn && (inside_class || self.is_inside_object()) {
                    return (None, None);
                }

                return (None, self.extract_prop_value(prop));
            }
            _ => {}
        };

        (None, None)
    }

    fn extract_obj_and_prop(&mut self, callee_expr: &Expr) -> (Option<JsWord>, Option<JsWord>) {
        match callee_expr {
            Expr::Ident(ident) => {
                if self.is_satisfying_indent(ident) {
                    return (None, Some(ident.sym.clone()));
                }
            }
            Expr::Member(member_expr) => {
                return self.extract_obj_and_prop_member_case(member_expr);
            }
            Expr::OptChain(OptChainExpr { base, .. }) => {
                if let OptChainBase::Member(member_expr) = &**base {
                    return self.extract_obj_and_prop_member_case(member_expr);
                }
            }
            Expr::Paren(ParenExpr { expr, .. }) => {
                return self.extract_obj_and_prop(expr.as_ref());
            }
            _ => {}
        }

        (None, None)
    }
}

impl Visit for Radix {
    noop_visit_type!();

    fn visit_call_expr(&mut self, call_expr: &CallExpr) {
        if let Callee::Expr(callee_expr) = &call_expr.callee {
            if let (obj, Some(prop)) = self.extract_obj_and_prop(callee_expr.as_ref()) {
                self.check(call_expr, obj, prop);
            }
        }

        call_expr.args.visit_children_with(self);
    }

    fn visit_class(&mut self, class: &Class) {
        self.classes_depth += 1;

        class.visit_children_with(self);

        self.classes_depth -= 1;
    }

    fn visit_object_lit(&mut self, lit_obj: &ObjectLit) {
        self.objects_depth += 1;

        lit_obj.visit_children_with(self);

        self.objects_depth -= 1;
    }

    fn visit_arrow_expr(&mut self, arrow_fn: &ArrowExpr) {
        self.arrow_fns_depth += 1;

        arrow_fn.visit_children_with(self);

        self.arrow_fns_depth -= 1;
    }
}
