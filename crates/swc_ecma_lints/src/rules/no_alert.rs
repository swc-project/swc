use swc_atoms::JsWord;
use swc_common::{errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const FN_NAMES: &[&str] = &["alert", "confirm", "prompt"];
const GLOBAL_THIS_PROP: &str = "globalThis";
const OBJ_NAMES: &[&str] = &["window", GLOBAL_THIS_PROP];

pub fn no_alert(
    config: &RuleConfig<()>,
    unresolved_ctxt: SyntaxContext,
    es_version: EsVersion,
) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoAlert::new(
            rule_reaction,
            unresolved_ctxt,
            es_version,
        ))),
    }
}

#[derive(Debug, Default)]
struct NoAlert {
    expected_reaction: LintRuleReaction,
    unresolved_ctxt: SyntaxContext,
    pass_call_on_global_this: bool,
    inside_callee: bool,
    classes_depth: usize,
    objects_depth: usize,
    arrow_fns_depth: usize,
    obj: Option<JsWord>,
    prop: Option<JsWord>,
}

impl NoAlert {
    fn new(
        expected_reaction: LintRuleReaction,
        unresolved_ctxt: SyntaxContext,
        es_version: EsVersion,
    ) -> Self {
        Self {
            expected_reaction,
            unresolved_ctxt,
            pass_call_on_global_this: es_version < EsVersion::Es2020,
            inside_callee: false,
            classes_depth: 0,
            objects_depth: 0,
            arrow_fns_depth: 0,
            obj: None,
            prop: None,
        }
    }

    fn emit_report(&self, span: Span, fn_name: &str) {
        let message = format!("Unexpected {}", fn_name);

        HANDLER.with(|handler| match self.expected_reaction {
            LintRuleReaction::Error => {
                handler.struct_span_err(span, &message).emit();
            }
            LintRuleReaction::Warning => {
                handler.struct_span_warn(span, &message).emit();
            }
            _ => {}
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

    fn check(&self, call_span: Span, obj: &Option<JsWord>, prop: &JsWord) {
        if let Some(obj) = obj {
            let obj_name: &str = obj;

            if self.pass_call_on_global_this && obj_name == GLOBAL_THIS_PROP {
                return;
            }

            if !OBJ_NAMES.contains(&obj_name) {
                return;
            }
        }

        let fn_name: &str = prop;

        if FN_NAMES.contains(&fn_name) {
            self.emit_report(call_span, fn_name);
        }
    }

    fn is_satisfying_indent(&self, ident: &Ident) -> bool {
        if ident.ctxt != self.unresolved_ctxt {
            return false;
        }

        true
    }

    fn handle_member_prop(&mut self, prop: &MemberProp) {
        match prop {
            MemberProp::Ident(IdentName { sym, .. }) => {
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

    fn handle_member_expr(&mut self, member_expr: &MemberExpr) {
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

    fn handle_callee(&mut self, expr: &Expr) {
        match expr {
            Expr::Ident(ident) => {
                if self.is_satisfying_indent(ident) {
                    self.prop = Some(ident.sym.clone());
                }
            }
            Expr::Member(member_expr) => self.handle_member_expr(member_expr),
            Expr::OptChain(OptChainExpr { base, .. }) if base.is_member() => {
                let member_expr = base.as_member().unwrap();
                self.handle_member_expr(member_expr);
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

        if let Some(prop) = &self.prop {
            self.check(call_expr.span, &self.obj, prop);

            self.obj = None;
            self.prop = None;
        }
    }
}

impl Visit for NoAlert {
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
