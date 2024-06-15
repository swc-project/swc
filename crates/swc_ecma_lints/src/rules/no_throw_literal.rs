use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const EXPECTED_AN_ERROR_OBJECT: &str = "Expected an error object to be thrown";
const NO_THROW_UNDEFINED: &str = "Do not throw undefined";

pub fn no_throw_literal(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoThrowLiteral::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct NoThrowLiteral {
    expected_reaction: LintRuleReaction,
}

impl NoThrowLiteral {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self { expected_reaction }
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

    fn could_simple_target_be_error(&self, expr: &SimpleAssignTarget) -> bool {
        match expr {
            SimpleAssignTarget::Ident(_) | SimpleAssignTarget::Member(_) => true,
            SimpleAssignTarget::SuperProp(_) => false,
            _ => false,
        }
    }

    #[allow(clippy::only_used_in_recursion)]
    fn could_be_error(&self, expr: &Expr) -> bool {
        match expr.unwrap_seqs_and_parens() {
            Expr::Ident(_)
            | Expr::New(_)
            | Expr::Call(_)
            | Expr::Member(_)
            | Expr::TaggedTpl(_)
            | Expr::Yield(_)
            | Expr::Await(_)
            | Expr::OptChain(_) => true,

            Expr::Assign(AssignExpr {
                op, left, right, ..
            }) => match op {
                op!("=") | op!("&&=") => self.could_be_error(right.as_ref()),
                op!("||=") | op!("??=") => {
                    if let AssignTarget::Simple(left) = left {
                        self.could_simple_target_be_error(left)
                            || self.could_be_error(right.as_ref())
                    } else {
                        false
                    }
                }
                _ => false,
            },

            Expr::Bin(BinExpr {
                op, left, right, ..
            }) => {
                if let op!("&&") = op {
                    self.could_be_error(right.as_ref())
                } else {
                    self.could_be_error(left.as_ref()) || self.could_be_error(right.as_ref())
                }
            }

            Expr::Cond(CondExpr { cons, alt, .. }) => {
                self.could_be_error(cons.as_ref()) || self.could_be_error(alt.as_ref())
            }

            _ => false,
        }
    }

    fn check(&self, throw_stmt: &ThrowStmt) {
        let arg = throw_stmt.arg.unwrap_seqs_and_parens();

        if !self.could_be_error(arg) {
            self.emit_report(throw_stmt.span, EXPECTED_AN_ERROR_OBJECT);

            return;
        }

        if let Expr::Ident(Ident { sym, .. }) = arg {
            if sym == "undefined" {
                self.emit_report(throw_stmt.span, NO_THROW_UNDEFINED);
            }
        }
    }
}

impl Visit for NoThrowLiteral {
    fn visit_throw_stmt(&mut self, throw_stmt: &ThrowStmt) {
        self.check(throw_stmt);

        throw_stmt.visit_children_with(self);
    }
}
