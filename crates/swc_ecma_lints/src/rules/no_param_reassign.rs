use dashmap::DashMap;
use regex::Regex;
use serde::{Deserialize, Serialize};
use swc_common::{
    collections::{AHashMap, AHashSet, ARandomState},
    errors::HANDLER,
    sync::Lazy,
    Span,
};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const INVALID_REGEX_MESSAGE: &str = "no-param-reassign: invalid regex pattern in allowPattern. Check syntax documentation https://docs.rs/regex/latest/regex/#syntax";

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoParamReassignConfig {
    props: Option<bool>,
    ignore_property_modifications_for: Option<AHashSet<String>>,
    ignore_property_modifications_for_regex: Option<Vec<String>>,
}

pub fn no_param_reassign(config: &RuleConfig<NoParamReassignConfig>) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoParamReassign::new(config))),
    }
}

#[derive(Debug, Default)]
struct NoParamReassign {
    expected_reaction: LintRuleReaction,
    scoped_params: AHashMap<Span, AHashSet<Id>>,
    scopes: Vec<Span>,
    check_props: bool,
    ignore_names: Option<AHashSet<String>>,
    ignore_names_patterns: Option<Vec<String>>,
}

impl NoParamReassign {
    fn new(config: &RuleConfig<NoParamReassignConfig>) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            scoped_params: Default::default(),
            scopes: Vec::new(),
            check_props: rule_config.props.unwrap_or(true),
            ignore_names: rule_config.ignore_property_modifications_for.clone(),
            ignore_names_patterns: rule_config.ignore_property_modifications_for_regex.clone(),
        }
    }

    fn emit_report(&self, span: Span, name: &str) {
        let message = format!("Assignment to function parameter '{}'", name);

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

    fn collect_function_params(&mut self, pat: &Pat) {
        match pat {
            Pat::Ident(id) => {
                self.scoped_params
                    .get_mut(self.scopes.last().unwrap())
                    .unwrap()
                    .insert(id.to_id());
            }
            Pat::Object(ObjectPat { props, .. }) => props.iter().for_each(|prop| {
                match prop {
                    ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                        self.scoped_params
                            .get_mut(self.scopes.last().unwrap())
                            .unwrap()
                            .insert(key.to_id());
                    }
                    ObjectPatProp::KeyValue(KeyValuePatProp { value, .. }) => {
                        self.collect_function_params(value.as_ref());
                    }
                    _ => {}
                };
            }),
            Pat::Array(ArrayPat { elems, .. }) => elems.iter().for_each(|elem| {
                if let Some(elem) = elem {
                    self.collect_function_params(elem);
                }
            }),
            _ => {}
        }
    }

    fn is_satisfying_function_param(&self, ident: &Ident) -> bool {
        if let Some(ignore_names) = &self.ignore_names {
            if ignore_names.contains(&*ident.sym) {
                return false;
            }
        }

        let is_function_param = self.scopes.iter().rev().any(|scope| {
            self.scoped_params
                .get(scope)
                .unwrap()
                .contains(&ident.to_id())
        });

        if !is_function_param {
            return false;
        }

        if let Some(ignore_names_patterns) = &self.ignore_names_patterns {
            static REGEX_CACHE: Lazy<DashMap<String, Regex, ARandomState>> =
                Lazy::new(Default::default);

            let sym = &*ident.sym;

            let ignored_by_pattern = ignore_names_patterns.iter().any(|pattern| {
                if !REGEX_CACHE.contains_key(pattern) {
                    REGEX_CACHE.insert(
                        pattern.clone(),
                        Regex::new(pattern).expect(INVALID_REGEX_MESSAGE),
                    );
                }

                return REGEX_CACHE.get(pattern).unwrap().is_match(sym);
            });

            if ignored_by_pattern {
                return false;
            }
        }

        true
    }

    fn check_obj_member(&self, member_expr: &MemberExpr) {
        if !self.check_props {
            return;
        }

        match member_expr.obj.unwrap_seqs_and_parens() {
            Expr::Ident(ident) => {
                if self.is_satisfying_function_param(ident) {
                    self.emit_report(ident.span, &ident.sym);
                }
            }
            Expr::Member(member_expr) => {
                self.check_obj_member(member_expr);
            }
            _ => {}
        }
    }

    fn check_pat_or_expr(&self, pat_or_expr: &AssignTarget) {
        match pat_or_expr {
            AssignTarget::Pat(pat) => match pat {
                AssignTargetPat::Array(array_pat) => {
                    self.check_array_pat(array_pat);
                }
                AssignTargetPat::Object(object_pat) => {
                    self.check_object_pat(object_pat);
                }
                AssignTargetPat::Invalid(..) => {}
            },
            AssignTarget::Simple(expr) => match expr {
                SimpleAssignTarget::Ident(ident) => {
                    if self.is_satisfying_function_param(&Ident::from(ident)) {
                        self.emit_report(ident.span, &ident.sym);
                    }
                }
                SimpleAssignTarget::Member(member_expr) => {
                    self.check_obj_member(member_expr);
                }

                _ => {}
            },
        }
    }

    fn check_expr(&self, expr: &Expr) {
        match expr.unwrap_seqs_and_parens() {
            Expr::Ident(ident) => {
                if self.is_satisfying_function_param(ident) {
                    self.emit_report(ident.span, &ident.sym);
                }
            }
            Expr::Member(member_expr) => {
                self.check_obj_member(member_expr);
            }
            _ => {}
        }
    }

    fn check_array_pat(&self, ArrayPat { elems, .. }: &ArrayPat) {
        elems.iter().for_each(|elem| {
            if let Some(elem) = elem {
                self.check_pat(elem);
            }
        });
    }

    fn check_object_pat(&self, ObjectPat { props, .. }: &ObjectPat) {
        props.iter().for_each(|prop| match prop {
            ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                if self.is_satisfying_function_param(&Ident::from(key)) {
                    self.emit_report(key.span, &key.sym);
                }
            }
            ObjectPatProp::KeyValue(KeyValuePatProp { value, .. }) => {
                self.check_pat(value.as_ref());
            }
            _ => {}
        });
    }

    fn check_pat(&self, pat: &Pat) {
        match pat {
            Pat::Ident(id) => {
                if self.is_satisfying_function_param(&Ident::from(id)) {
                    self.emit_report(id.span, &id.sym);
                }
            }
            Pat::Expr(expr) => {
                if let Expr::Member(member_expr) = expr.as_ref() {
                    self.check_obj_member(member_expr);
                }
            }
            Pat::Object(p) => {
                self.check_object_pat(p);
            }
            Pat::Array(p) => {
                self.check_array_pat(p);
            }
            _ => {}
        }
    }
}

impl Visit for NoParamReassign {
    noop_visit_type!();

    fn visit_function(&mut self, function: &Function) {
        self.scopes.push(function.span);
        self.scoped_params.insert(function.span, Default::default());

        function.params.iter().for_each(|param| {
            self.collect_function_params(&param.pat);
        });

        function.visit_children_with(self);

        self.scopes.pop();
        self.scoped_params.remove(&function.span);
    }

    fn visit_assign_expr(&mut self, assign_expr: &AssignExpr) {
        self.check_pat_or_expr(&assign_expr.left);

        assign_expr.visit_children_with(self);
    }

    fn visit_update_expr(&mut self, update_expr: &UpdateExpr) {
        self.check_expr(update_expr.arg.as_ref());

        update_expr.visit_children_with(self);
    }

    fn visit_for_of_stmt(&mut self, for_of_stmt: &ForOfStmt) {
        if let ForHead::Pat(pat) = &for_of_stmt.left {
            self.check_pat(pat);
        }

        for_of_stmt.visit_children_with(self);
    }

    fn visit_for_in_stmt(&mut self, for_in_stmt: &ForInStmt) {
        if let ForHead::Pat(pat) = &for_in_stmt.left {
            self.check_pat(pat);
        }

        for_in_stmt.visit_children_with(self);
    }

    fn visit_unary_expr(&mut self, unary_expr: &UnaryExpr) {
        if let op!("delete") = unary_expr.op {
            self.check_expr(unary_expr.arg.as_ref());
        }

        unary_expr.visit_children_with(self);
    }
}
