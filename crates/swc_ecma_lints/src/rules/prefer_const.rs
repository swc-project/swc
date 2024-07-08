use serde::{Deserialize, Serialize};
use swc_common::{collections::AHashMap, errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

// todo: implement option destructuring: all | any
// https://eslint.org/docs/rules/prefer-const#destructuring

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreferConstConfig {
    #[serde(default)]
    ignore_read_before_assign: bool,
}

pub fn prefer_const(config: &RuleConfig<PreferConstConfig>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(PreferConst::new(
            rule_reaction,
            config.get_rule_config(),
        ))),
    }
}

#[derive(Debug)]
struct VariableMeta {
    span: Span,
    order: usize,
    initialized: bool,
    block_depth: usize,
    // for cases like
    // let a;
    // { a } = foo();
    destructuring_assign: bool,
    // for cases like
    // for (let x of arr) {}
    declared_into_cycle_head: bool,
    // for case
    // let a;
    // a = 10;
    postinitialized: bool,

    used_before_initialize: bool,
}

#[derive(Debug, Default)]
struct PreferConst {
    expected_reaction: LintRuleReaction,
    vars_meta: AHashMap<Id, VariableMeta>,
    scope_vars_idx: usize,
    block_depth: usize,
    cycle_head_depth: usize,

    ignore_read_before_assign: bool,
}

impl PreferConst {
    fn new(expected_reaction: LintRuleReaction, rule_config: &PreferConstConfig) -> Self {
        Self {
            expected_reaction,
            vars_meta: Default::default(),
            scope_vars_idx: 0,
            block_depth: 0,
            cycle_head_depth: 0,

            ignore_read_before_assign: rule_config.ignore_read_before_assign,
        }
    }

    fn emit_report(&self, span: Span, var_name: &str) {
        let message = format!("'{}' is never reassigned. Use 'const' insted", var_name);

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

    fn add_var_meta(&mut self, ident: &Ident, initialized: bool) {
        self.scope_vars_idx += 1;

        self.vars_meta.insert(
            ident.to_id(),
            VariableMeta {
                span: ident.span,
                order: self.scope_vars_idx,
                initialized,
                block_depth: self.block_depth,
                destructuring_assign: false,
                declared_into_cycle_head: self.cycle_head_depth != 0,
                postinitialized: false,
                used_before_initialize: false,
            },
        );
    }

    fn collect_decl_pat(&mut self, initialized: bool, pat: &Pat) {
        match pat {
            Pat::Ident(id) => {
                self.add_var_meta(&Ident::from(id), initialized);
            }
            Pat::Assign(AssignPat { left, .. }) => {
                self.collect_decl_pat(initialized, left.as_ref());
            }
            Pat::Array(ArrayPat { elems, .. }) => {
                elems.iter().flatten().for_each(|elem| {
                    self.collect_decl_pat(initialized, elem);
                });
            }
            Pat::Object(ObjectPat { props, .. }) => {
                props.iter().for_each(|prop| {
                    match prop {
                        ObjectPatProp::KeyValue(KeyValuePatProp { value, .. }) => {
                            self.collect_decl_pat(initialized, value.as_ref());
                        }
                        ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                            self.add_var_meta(&Ident::from(key), initialized);
                        }
                        ObjectPatProp::Rest(RestPat { arg, .. }) => {
                            self.collect_decl_pat(initialized, arg.as_ref());
                        }
                    };
                });
            }
            Pat::Rest(RestPat { arg, .. }) => {
                self.collect_decl_pat(initialized, arg.as_ref());
            }
            _ => {}
        }
    }

    fn consider_mutation_for_ident(&mut self, ident: &Ident, destructuring_assign: bool) {
        let id = ident.to_id();

        if let Some(var_meta) = self.vars_meta.get_mut(&id) {
            if destructuring_assign && !var_meta.initialized {
                var_meta.destructuring_assign = true;
                var_meta.span = ident.span;

                return;
            }

            if var_meta.initialized || self.block_depth > var_meta.block_depth {
                self.vars_meta.remove(&id);

                return;
            }

            var_meta.postinitialized = true;
        }
    }

    fn consider_mutation(&mut self, pat: &Pat, destructuring_assign: bool) {
        match pat {
            Pat::Ident(id) => {
                self.consider_mutation_for_ident(&Ident::from(id), destructuring_assign);
            }
            Pat::Array(ArrayPat { elems, .. }) => elems.iter().flatten().for_each(|elem| {
                self.consider_mutation(elem, destructuring_assign);
            }),
            Pat::Object(ObjectPat { props, .. }) => {
                props.iter().for_each(|prop| match prop {
                    ObjectPatProp::KeyValue(KeyValuePatProp { value, .. }) => {
                        self.consider_mutation(value.as_ref(), true);
                    }
                    ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                        self.consider_mutation_for_ident(&Ident::from(key), true);
                    }
                    _ => {}
                });
            }
            _ => {}
        }
    }

    fn emit_ordered(&self) {
        let mut vars = self.vars_meta.iter().collect::<Vec<_>>();

        vars.sort_by(|(_, a), (_, b)| a.order.cmp(&b.order));

        vars.into_iter().for_each(|(id, var_meta)| {
            let postinitialized = if self.ignore_read_before_assign {
                var_meta.postinitialized && !var_meta.used_before_initialize
            } else {
                var_meta.postinitialized
            };

            if var_meta.initialized
                || postinitialized
                || var_meta.destructuring_assign
                || var_meta.declared_into_cycle_head
            {
                self.emit_report(var_meta.span, &id.0);
            }
        });
    }
}

impl Visit for PreferConst {
    fn visit_module(&mut self, module: &Module) {
        module.visit_children_with(self);

        self.emit_ordered();
    }

    fn visit_script(&mut self, script: &Script) {
        script.visit_children_with(self);

        self.emit_ordered();
    }

    fn visit_var_decl(&mut self, var_decl: &VarDecl) {
        if let VarDeclKind::Let = var_decl.kind {
            var_decl.decls.iter().for_each(|var_decl| {
                self.collect_decl_pat(var_decl.init.is_some(), &var_decl.name);
            })
        }

        var_decl.visit_children_with(self);
    }

    fn visit_assign_expr(&mut self, assign_expr: &AssignExpr) {
        if let op!("=") = assign_expr.op {
            match &assign_expr.left {
                AssignTarget::Simple(SimpleAssignTarget::Ident(l)) => {
                    self.consider_mutation_for_ident(&Ident::from(l), false);
                }

                AssignTarget::Pat(pat) => match pat {
                    AssignTargetPat::Array(ArrayPat { elems, .. }) => {
                        elems.iter().flatten().for_each(|elem| {
                            self.consider_mutation(elem, true);
                        })
                    }
                    AssignTargetPat::Object(ObjectPat { props, .. }) => {
                        props.iter().for_each(|prop| match prop {
                            ObjectPatProp::KeyValue(KeyValuePatProp { value, .. }) => {
                                self.consider_mutation(value.as_ref(), true);
                            }
                            ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                                self.consider_mutation_for_ident(&Ident::from(key), true);
                            }
                            _ => {}
                        });
                    }
                    AssignTargetPat::Invalid(_) => {}
                },
                _ => (),
            }
        }

        assign_expr.visit_children_with(self);
    }

    fn visit_block_stmt(&mut self, block_stmt: &BlockStmt) {
        self.block_depth += 1;

        block_stmt.visit_children_with(self);

        self.block_depth -= 1;
    }

    fn visit_for_in_stmt(&mut self, for_in_stmt: &ForInStmt) {
        self.cycle_head_depth += 1;
        for_in_stmt.left.visit_children_with(self);
        self.cycle_head_depth -= 1;

        for_in_stmt.right.visit_children_with(self);
        for_in_stmt.body.visit_children_with(self);
    }

    fn visit_for_of_stmt(&mut self, for_of_stmt: &ForOfStmt) {
        self.cycle_head_depth += 1;
        for_of_stmt.left.visit_children_with(self);
        self.cycle_head_depth -= 1;

        for_of_stmt.right.visit_children_with(self);
        for_of_stmt.body.visit_children_with(self);
    }

    fn visit_update_expr(&mut self, update_expr: &UpdateExpr) {
        if let Expr::Ident(ident) = update_expr.arg.unwrap_seqs_and_parens() {
            self.consider_mutation_for_ident(ident, false);
        }

        update_expr.visit_children_with(self);
    }

    fn visit_ident(&mut self, ident: &Ident) {
        if let Some(var_meta) = self.vars_meta.get_mut(&ident.to_id()) {
            if self.block_depth > var_meta.block_depth {
                var_meta.used_before_initialize = true;
            }
        }

        ident.visit_children_with(self);
    }
}
