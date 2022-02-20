use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "Do not use 'new' for side effects";

pub fn no_new(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoNew::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct NoNew {
    expected_reaction: LintRuleReaction,
}

impl NoNew {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self { expected_reaction }
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

    fn check_and_pass_new_expr(&mut self, expr: &Expr) {
        match expr {
            Expr::New(NewExpr { args, .. }) => {
                // prevent report
                // new is expected

                // also check args is required
                if let Some(args) = args {
                    args.visit_children_with(self);
                }
            }
            Expr::Seq(SeqExpr { exprs, .. }) => {
                let last_idx = exprs.len() - 1;

                exprs.iter().enumerate().for_each(|(idx, expr)| {
                    // check case when new on end of seq
                    // var x = (0, new A());

                    if idx == last_idx {
                        self.check_and_pass_new_expr(expr.as_ref());
                    } else {
                        expr.visit_children_with(self);
                    }
                });
            }
            Expr::Paren(ParenExpr { expr, .. }) => {
                // dive into parens
                // (0, new A(), 0)
                self.check_and_pass_new_expr(expr.as_ref());
            }
            _ => {
                expr.visit_children_with(self);
            }
        }
    }

    fn check_var_name(&mut self, pat: &Pat) {
        match &pat {
            Pat::Assign(AssignPat { right, .. }) => {
                self.check_and_pass_new_expr(right.as_ref());
            }
            Pat::Array(ArrayPat { elems, .. }) => elems.iter().for_each(|elem| {
                if let Some(elem) = elem {
                    // cases
                    // var [ x = new A() ] = arr;
                    // var [ a, [ y = new A() ] ] = arr;

                    self.check_var_name(elem);
                }
            }),
            Pat::Object(ObjectPat { props, .. }) => {
                props.iter().for_each(|prop| match prop {
                    ObjectPatProp::KeyValue(KeyValuePatProp { value, .. }) => {
                        self.check_var_name(value.as_ref());
                    }
                    ObjectPatProp::Assign(AssignPatProp { value, .. }) => {
                        if let Some(expr) = value.as_ref() {
                            // cases
                            // var { x = new A() } = obj
                            // var { a: { x = new A() } } = obj

                            self.check_and_pass_new_expr(expr.as_ref());
                        }
                    }
                    _ => {}
                });
            }
            _ => {}
        }
    }
}

impl Visit for NoNew {
    noop_visit_type!();

    fn visit_var_declarator(&mut self, var_decl: &VarDeclarator) {
        self.check_var_name(&var_decl.name);

        if let Some(init) = &var_decl.init {
            self.check_and_pass_new_expr(init.as_ref())
        }
    }

    fn visit_key_value_prop(&mut self, key_value_prop: &KeyValueProp) {
        self.check_and_pass_new_expr(key_value_prop.value.as_ref());
    }

    fn visit_call_expr(&mut self, call: &CallExpr) {
        call.callee.visit_children_with(self);

        call.args.iter().for_each(|arg| {
            self.check_and_pass_new_expr(arg.expr.as_ref());
        });
    }

    fn visit_assign_expr(&mut self, assign_expr: &AssignExpr) {
        assign_expr.left.visit_children_with(self);

        self.check_and_pass_new_expr(assign_expr.right.as_ref());
    }

    fn visit_class_prop(&mut self, class_prop: &ClassProp) {
        class_prop.decorators.visit_children_with(self);
        class_prop.key.visit_children_with(self);

        if let Some(value) = &class_prop.value {
            self.check_and_pass_new_expr(value.as_ref());
        }
    }

    fn visit_new_expr(&mut self, new_expr: &NewExpr) {
        self.emit_report(new_expr.span);

        if let Some(args) = &new_expr.args {
            args.iter().for_each(|arg| {
                self.check_and_pass_new_expr(arg.expr.as_ref());
            });
        }
    }
}
