use serde::{Deserialize, Serialize};
use swc_common::{
    collections::{AHashMap, AHashSet},
    errors::HANDLER,
    Span, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoUseBeforeDefineConfig {
    variables: Option<bool>,
    functions: Option<bool>,
    classes: Option<bool>,
}

pub fn no_use_before_define(config: &RuleConfig<NoUseBeforeDefineConfig>) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoUseBeforeDefine::new(config))),
    }
}

#[derive(Debug, Hash, PartialEq, Eq)]
struct SpansScopeId {
    ident_id: Id,
    block_span: Span,
}

#[derive(Debug, Default)]
struct NoUseBeforeDefine {
    expected_reaction: LintRuleReaction,
    // means variables defined with "var" keyword
    check_vars: bool,
    check_functions: bool,
    check_classes: bool,

    scoped_indents: AHashMap<Span, AHashSet<Id>>,
    scope: Vec<Span>,
    scoped_spans: AHashMap<SpansScopeId, AHashSet<Span>>,
}

impl NoUseBeforeDefine {
    fn new(config: &RuleConfig<NoUseBeforeDefineConfig>) -> Self {
        let rule_config = config.get_rule_config();

        let root_scope = DUMMY_SP;

        let mut scoped_indents: AHashMap<Span, AHashSet<Id>> = Default::default();

        scoped_indents.insert(root_scope, Default::default());

        Self {
            expected_reaction: config.get_rule_reaction(),
            scoped_indents,
            scope: vec![root_scope],
            scoped_spans: Default::default(),
            check_vars: rule_config.variables.unwrap_or(false),
            check_functions: rule_config.functions.unwrap_or(false),
            check_classes: rule_config.classes.unwrap_or(false),
        }
    }

    fn insert_ident_to_current_scope(&mut self, id: Id, span: Span) {
        let current_scope = self.scope.last().unwrap();

        self.scoped_indents
            .get_mut(current_scope)
            .unwrap()
            .insert(id.clone());

        let spans_block_id = SpansScopeId {
            ident_id: id,
            block_span: *current_scope,
        };

        if let Some(spans) = self.scoped_spans.get_mut(&spans_block_id) {
            spans.insert(span);
        } else {
            let mut spans: AHashSet<Span> = Default::default();

            spans.insert(span);

            self.scoped_spans.insert(spans_block_id, spans);
        }
    }

    fn has_access_before_define(&self, id: &Id) -> bool {
        let current_scope = self.scope.last().unwrap();

        self.scoped_indents.get(current_scope).unwrap().contains(id)
    }

    fn get_ident_spans_in_current_scope(&self, id: &Id) -> &AHashSet<Span> {
        let current_block = self.scope.last().unwrap();

        let spans_block_id = SpansScopeId {
            ident_id: id.clone(),
            block_span: *current_block,
        };

        self.scoped_spans.get(&spans_block_id).unwrap()
    }

    fn emit_report(&self, es6_var_check: bool, span: Span, name: &str) {
        let message = format!("'{}' was used before it was defined", name);

        let expected_reaction = if es6_var_check {
            LintRuleReaction::Error
        } else {
            self.expected_reaction
        };

        HANDLER.with(|handler| match expected_reaction {
            LintRuleReaction::Error => {
                handler.struct_span_err(span, &message).emit();
            }
            LintRuleReaction::Warning => {
                handler.struct_span_warn(span, &message).emit();
            }
            _ => {}
        });
    }

    fn check_ident(&self, es6_var_check: bool, ident: &Ident) {
        let ident_id = ident.to_id();

        if self.has_access_before_define(&ident_id) {
            let sym = &*ident.sym;
            let mut spans = self
                .get_ident_spans_in_current_scope(&ident_id)
                .iter()
                .copied()
                .collect::<Vec<Span>>();

            spans.sort();

            spans.into_iter().for_each(|span| {
                self.emit_report(es6_var_check, span, sym);
            });
        }
    }

    fn check_pat(&self, es6_var_check: bool, pat: &Pat) {
        match pat {
            Pat::Ident(id) => {
                self.check_ident(es6_var_check, &Ident::from(id));
            }
            Pat::Array(ArrayPat { elems, .. }) => {
                elems.iter().for_each(|elem| {
                    if let Some(elem) = elem {
                        self.check_pat(es6_var_check, elem);
                    }
                });
            }
            Pat::Object(ObjectPat { props, .. }) => {
                props.iter().for_each(|prop| match prop {
                    ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                        self.check_ident(es6_var_check, &Ident::from(key));
                    }
                    ObjectPatProp::KeyValue(KeyValuePatProp { value, .. }) => {
                        self.check_pat(es6_var_check, value.as_ref());
                    }
                    ObjectPatProp::Rest(RestPat { arg, .. }) => {
                        self.check_pat(es6_var_check, arg.as_ref());
                    }
                });
            }
            Pat::Rest(RestPat { arg, .. }) => {
                self.check_pat(es6_var_check, arg.as_ref());
            }
            Pat::Assign(AssignPat { left, .. }) => {
                self.check_pat(es6_var_check, left.as_ref());
            }
            Pat::Invalid(_) => {}
            Pat::Expr(_) => {}
        }
    }
}

impl Visit for NoUseBeforeDefine {
    noop_visit_type!();

    fn visit_ident(&mut self, ident: &Ident) {
        self.insert_ident_to_current_scope(ident.to_id(), ident.span);
    }

    fn visit_block_stmt(&mut self, block: &BlockStmt) {
        self.scoped_indents.insert(block.span, Default::default());
        self.scope.push(block.span);

        block.visit_children_with(self);

        self.scoped_indents.remove(&block.span);
        self.scope.pop();
    }

    fn visit_var_decl(&mut self, var_decl: &VarDecl) {
        let es6_var_check = !matches!(&var_decl.kind, VarDeclKind::Var);

        var_decl.decls.iter().for_each(|declarator| {
            declarator.init.visit_with(self);

            if let VarDeclKind::Var = var_decl.kind {
                if !self.check_vars {
                    return;
                }
            }

            self.check_pat(es6_var_check, &declarator.name);
        });
    }

    fn visit_fn_decl(&mut self, function: &FnDecl) {
        if self.check_functions {
            self.check_ident(false, &function.ident);
        }

        function.visit_children_with(self);
    }

    fn visit_class_decl(&mut self, class: &ClassDecl) {
        if self.check_classes {
            self.check_ident(false, &class.ident);
        }

        class.visit_children_with(self);
    }
}
