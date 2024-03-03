use swc_atoms::Atom;
use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const METHODS: [&str; 3] = ["hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable"];

pub fn no_prototype_builtins(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoPrototypeBuiltins::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct CallInfo {
    chain: Vec<Atom>,
    method_span: Option<Span>,
}

#[derive(Debug, Default)]
struct NoPrototypeBuiltins {
    expected_reaction: LintRuleReaction,
    call_info: CallInfo,
}

impl NoPrototypeBuiltins {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self {
            expected_reaction,
            call_info: Default::default(),
        }
    }

    fn emit_error(&self, span: Span, method: &str) {
        let message = format!(
            "Do not access Object.prototype method '{}' from target object",
            method
        );

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

    fn extend_chain(&mut self, span: Span, atom: Atom) {
        if self.call_info.method_span.is_none() {
            self.call_info.method_span = Some(span);
        }

        self.call_info.chain.push(atom);
    }

    fn extract_path(&mut self, expr: &Expr) {
        match expr {
            Expr::Member(member) => {
                match &member.prop {
                    MemberProp::Ident(ident) => {
                        self.extend_chain(ident.span, ident.sym.clone());
                    }
                    MemberProp::Computed(computed_prop_name) => {
                        match computed_prop_name.expr.as_ref() {
                            Expr::Lit(_) | Expr::Tpl(_) | Expr::Paren(_) | Expr::Seq(_) => {
                                self.extract_path(&computed_prop_name.expr);
                            }
                            _ => {}
                        }
                    }
                    _ => {}
                }

                self.extract_path(member.obj.as_ref());
            }
            Expr::OptChain(OptChainExpr { base, .. }) => {
                if let Some(member_expr) = base.as_member() {
                    if let Some(ident) = member_expr.prop.as_ident() {
                        self.extend_chain(ident.span, ident.sym.clone());
                    }

                    self.extract_path(member_expr.obj.as_ref());
                }
            }
            Expr::Paren(ParenExpr { expr, .. }) => {
                self.extract_path(expr.as_ref());
            }
            Expr::Seq(SeqExpr { exprs, .. }) => {
                self.extract_path(exprs.last().unwrap().as_ref());
            }
            Expr::Lit(Lit::Str(lit_str)) => {
                self.extend_chain(lit_str.span, lit_str.value.clone());
            }
            Expr::Tpl(tpl) => {
                if tpl.exprs.is_empty() && tpl.quasis.len() == 1 {
                    self.extend_chain(tpl.span, tpl.quasis[0].raw.clone());
                }
            }
            Expr::Ident(ident) => {
                self.extend_chain(ident.span, ident.sym.clone());
            }
            _ => {}
        }
    }

    fn check(&mut self, expr: &Expr) {
        let prev_call_info = std::mem::take(&mut self.call_info);

        self.extract_path(expr);

        if self.call_info.chain.len() > 1 {
            let method_name = self.call_info.chain[0].as_str();

            if METHODS.contains(&method_name) {
                self.emit_error(self.call_info.method_span.unwrap(), method_name);
            }
        }

        self.call_info = prev_call_info;
    }
}

impl Visit for NoPrototypeBuiltins {
    fn visit_opt_chain_base(&mut self, opt_chai_base: &OptChainBase) {
        if let OptChainBase::Call(opt_call) = opt_chai_base {
            self.check(opt_call.callee.as_expr());
        }

        opt_chai_base.visit_children_with(self);
    }

    fn visit_call_expr(&mut self, call_expr: &CallExpr) {
        if let Some(expr) = call_expr.callee.as_expr() {
            self.check(expr.as_ref());
        }

        call_expr.visit_children_with(self);
    }
}
