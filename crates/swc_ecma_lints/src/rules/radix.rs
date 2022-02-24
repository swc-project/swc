use std::{
    fmt::{self, Debug},
    sync::Arc,
};

use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{
    collections::AHashSet,
    errors::{DiagnosticBuilder, HANDLER},
    SourceMap, Span, SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls_with_ctxt, ident::IdentLike};
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
    check_parens: Option<bool>,
}

pub fn radix(
    program: &Program,
    source_map: &Arc<SourceMap>,
    top_level_ctxt: SyntaxContext,
    config: &RuleConfig<RadixConfig>,
) -> Option<Box<dyn Rule>> {
    let top_level_declared_vars: AHashSet<Id> = collect_decls_with_ctxt(program, top_level_ctxt);

    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(Radix::new(
            source_map.clone(),
            top_level_declared_vars,
            top_level_ctxt,
            config,
        ))),
    }
}

#[derive(Default)]
struct Radix {
    expected_reaction: LintRuleReaction,
    top_level_ctxt: SyntaxContext,
    top_level_declared_vars: AHashSet<Id>,
    source_map: Arc<SourceMap>,

    radix_mode: RadixMode,
    check_parens: bool,

    inside_callee: bool,
    classes_depth: usize,
    objects_depth: usize,
    arrow_fns_depth: usize,
    obj: Option<JsWord>,
    prop: Option<JsWord>,
}

impl Debug for Radix {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Radix")
            .field("expected_reaction", &self.expected_reaction)
            .field("top_level_ctxt", &self.top_level_ctxt)
            .field("top_level_declared_vars", &self.top_level_declared_vars)
            .field("radix_mode", &self.radix_mode)
            .field("check_parens", &self.check_parens)
            .field("inside_callee", &self.inside_callee)
            .field("classes_depth", &self.classes_depth)
            .field("classes_depth", &self.classes_depth)
            .field("objects_depth", &self.objects_depth)
            .field("arrow_fns_depth", &self.inside_callee)
            .field("obj", &self.obj)
            .field("prop", &self.prop)
            .finish()
    }
}

impl Radix {
    fn new(
        source_map: Arc<SourceMap>,
        top_level_declared_vars: AHashSet<Id>,
        top_level_ctxt: SyntaxContext,
        config: &RuleConfig<RadixConfig>,
    ) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            top_level_ctxt,
            top_level_declared_vars,
            source_map,

            radix_mode: rule_config.mode.unwrap_or_default(),
            check_parens: rule_config.check_parens.unwrap_or(true),

            inside_callee: false,
            classes_depth: 0,
            objects_depth: 0,
            arrow_fns_depth: 0,
            obj: None,
            prop: None,
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

    fn check(&self, call_span: Span, call_expr: &CallExpr) {
        if let Some(obj) = &self.obj {
            let obj: &str = &*obj;

            if !OBJ_NAMES.contains(&obj) {
                return;
            }
        }

        let prop = self.prop.as_ref().unwrap();

        if &*prop != "parseInt" {
            return;
        }

        if call_expr.args.get(0).is_none() {
            self.emit_report(call_span, MISSING_PARAMS_MESSAGE, None);

            return;
        }

        match call_expr.args.get(1) {
            Some(ExprOrSpread { expr, .. }) => {
                match &extract_arg_val(&self.source_map, expr.as_ref(), self.check_parens) {
                    ArgValue::Ident => {}
                    ArgValue::Number(radix) => {
                        if radix.fract() != 0.0 || !(2f64..=36f64).contains(radix) {
                            self.emit_report(call_span, INVALID_RADIX_MESSAGE, None);

                            return;
                        }

                        if let RadixMode::AsNeeded = self.radix_mode {
                            if *radix == 10f64 {
                                self.emit_report(call_span, REDUNDANT_RADIX_MESSAGE, None);
                            }
                        }
                    }
                    _ => {
                        self.emit_report(call_span, INVALID_RADIX_MESSAGE, None);
                    }
                };
            }
            None => {
                if let RadixMode::Always = self.radix_mode {
                    self.emit_report(call_span, MISSING_RADIX_MESSAGE, Some(ADD_10_RADIX_MESSAGE));
                }
            }
        }
    }

    fn is_satisfying_indent(&self, ident: &Ident) -> bool {
        if ident.span.ctxt != self.top_level_ctxt {
            return false;
        }

        if self.top_level_declared_vars.contains(&ident.to_id()) {
            return false;
        }

        true
    }

    fn handle_member_prop(&mut self, prop: &MemberProp) {
        match prop {
            MemberProp::Ident(Ident { sym, .. }) => {
                self.prop = Some(sym.clone());
            }
            MemberProp::Computed(comp) => {
                if let Expr::Lit(Lit::Str(Str { value, .. })) = comp.expr.as_ref() {
                    self.prop = Some(value.clone());
                }
            }
            _ => {}
        }
    }

    fn handle_callee(&mut self, expr: &Expr) {
        match expr {
            Expr::Ident(ident) => {
                if self.is_satisfying_indent(ident) {
                    self.prop = Some(ident.sym.clone());
                }
            }
            Expr::Member(member_expr) => {
                let MemberExpr { obj, prop, .. } = member_expr;

                match obj.as_ref() {
                    Expr::Ident(obj) => {
                        if !self.is_satisfying_indent(obj) {
                            return;
                        }

                        self.obj = Some(obj.sym.clone());

                        self.handle_member_prop(prop);
                    }
                    Expr::This(_) => {
                        let inside_arrow_fn = self.is_inside_arrow_fn();
                        let inside_class = self.is_inside_class();

                        if inside_arrow_fn && inside_class {
                            return;
                        }

                        if !inside_arrow_fn && (inside_class || self.is_inside_object()) {
                            return;
                        }

                        self.handle_member_prop(prop);
                    }
                    _ => {}
                }
            }
            Expr::OptChain(opt_chain) => {
                opt_chain.visit_children_with(self);
            }
            Expr::Paren(paren) => {
                paren.visit_children_with(self);
            }
            _ => {}
        }
    }

    fn handle_call(&mut self, call_expr: &CallExpr) {
        if let Some(callee) = call_expr.callee.as_expr() {
            self.inside_callee = true;

            callee.visit_with(self);

            self.inside_callee = false;
        }

        if self.prop.is_some() {
            self.check(call_expr.span, call_expr);

            self.obj = None;
            self.prop = None;
        }
    }
}

impl Visit for Radix {
    noop_visit_type!();

    fn visit_expr(&mut self, expr: &Expr) {
        if self.inside_callee {
            self.handle_callee(expr);
        } else {
            if let Expr::Call(call_expr) = expr {
                self.handle_call(call_expr);
            }

            expr.visit_children_with(self);
        }
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
