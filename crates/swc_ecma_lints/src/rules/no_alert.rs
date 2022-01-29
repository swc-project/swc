use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};
use swc_common::{collections::AHashSet, errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls_with_ctxt, ident::IdentLike};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

const FN_NAMES: &[&str] = &["alert", "confirm", "prompt"];
const GLOBAL_THIS_PROP: &str = "globalThis";
const OBJ_NAMES: &[&str] = &["window", GLOBAL_THIS_PROP];

pub fn no_alert(
    program: &Program,
    config: &RuleConfig<()>,
    top_level_ctxt: SyntaxContext,
    es_version: EsVersion,
) -> Option<Box<dyn Rule>> {
    let top_level_declared_vars: AHashSet<Id> = collect_decls_with_ctxt(program, top_level_ctxt);
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoAlert::new(
            *rule_reaction,
            top_level_declared_vars,
            top_level_ctxt,
            es_version,
        ))),
    }
}

#[derive(Debug, Default)]
struct NoAlert {
    expected_reaction: LintRuleReaction,
    top_level_ctxt: SyntaxContext,
    top_level_declared_vars: AHashSet<Id>,
    pass_call_on_global_this: bool,
    fn_names: AHashSet<&'static str>,
    obj_names: AHashSet<&'static str>,
    call_expr_span: Option<Span>,
}

impl NoAlert {
    fn new(
        expected_reaction: LintRuleReaction,
        top_level_declared_vars: AHashSet<Id>,
        top_level_ctxt: SyntaxContext,
        es_version: EsVersion,
    ) -> Self {
        Self {
            expected_reaction,
            top_level_ctxt,
            top_level_declared_vars,
            pass_call_on_global_this: es_version < EsVersion::Es2020,
            fn_names: FN_NAMES.iter().map(|n| *n).collect(),
            obj_names: OBJ_NAMES.iter().map(|n| *n).collect(),
            call_expr_span: None,
        }
    }

    fn emit_report(&self, fn_name: &str) {
        let span = self.call_expr_span.unwrap();
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

    fn check_names(&self, obj_name: Option<&str>, fn_name: &str) {
        if let Some(obj_name) = obj_name {
            if self.pass_call_on_global_this && obj_name == GLOBAL_THIS_PROP {
                return;
            }

            if !self.obj_names.contains(obj_name) {
                return;
            }
        }

        if self.fn_names.contains(fn_name) {
            self.emit_report(fn_name);
        }
    }

    fn check_member_expr(&self, member_expr: &MemberExpr) {
        let MemberExpr { obj, prop, .. } = member_expr;

        if let Expr::Ident(obj) = obj.as_ref() {
            if obj.span.ctxt != self.top_level_ctxt {
                return;
            }

            if self.top_level_declared_vars.contains(&obj.to_id()) {
                return;
            }

            let obj_sym = Some(&*obj.sym);

            match prop {
                MemberProp::Ident(prop) => self.check_names(obj_sym, &*prop.sym),
                MemberProp::Computed(comp) => {
                    if let Expr::Lit(Lit::Str(lit_str)) = comp.expr.as_ref() {
                        self.check_names(obj_sym, &*lit_str.value)
                    }
                }
                _ => {}
            }
        }

        // TODO: handle call alert on "this"
    }
}

impl Visit for NoAlert {
    noop_visit_type!();

    fn visit_expr(&mut self, expr: &Expr) {
        match expr {
            Expr::Ident(id) => {
                if id.span.ctxt != self.top_level_ctxt {
                    return;
                }

                if self.top_level_declared_vars.contains(&id.to_id()) {
                    return;
                }

                if self.call_expr_span.is_some() {
                    self.check_names(None, &*id.sym);
                }
            }
            Expr::Call(call_expr) => {
                if self.call_expr_span.is_none() {
                    self.call_expr_span = Some(call_expr.span);
                }

                call_expr.visit_children_with(self);

                self.call_expr_span = None;
            }
            Expr::Member(member_expr) => {
                self.check_member_expr(member_expr);
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
}
