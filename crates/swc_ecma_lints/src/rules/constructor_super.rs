use std::mem;

use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const BAD_SUPER_MESSAGE: &str = "Unexpected 'super()' because 'super' is not a constructor";
const CALL_SUPER_EXCPECTED_MESSAGE: &str = "Expected to call 'super()'";
const UNEXPECTED_DUPLICATE_SUPER_CALL_MESSAGE: &str = "Unexpected duplicate 'super()'";
const LACKED_CALL_SUPER_MESSAGE: &str = "Lacked a call of 'super()' in some code path";
const MORE_THAN_ONE_CALL_POSSIBLE_MESSAGE: &str = "More than one call 'super()' possible into loop";

pub fn constructor_super(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(ConstructorSuper::new(rule_reaction))),
    }
}

#[derive(Debug, Clone, Copy, Default)]
enum SuperClass {
    Valid,
    Invalid,
    #[default]
    NotSetted,
}

#[derive(Debug, Default)]
struct ClassMeta {
    super_class: SuperClass,
    constructor_scope: usize,
    code_path: CodePath,
    loop_span: Option<Span>,
}

#[derive(Debug, Default, Clone)]
struct CodePath {
    super_calls_count: usize,
    possibly_returned: bool,
    super_call_missed: bool,

    // only for switch-case
    break_exists: bool,
}

#[derive(Debug, Default)]
struct ConstructorSuper {
    expected_reaction: LintRuleReaction,
    class_meta: ClassMeta,
    scope: usize,
}

impl ConstructorSuper {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self {
            expected_reaction,
            scope: 0,
            class_meta: Default::default(),
        }
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

    fn collect_class(&mut self, class: &Class) {
        self.class_meta.super_class = match &class.super_class {
            Some(super_class) => match super_class.unwrap_seqs_and_parens() {
                Expr::Ident(_) | Expr::Class(_) => SuperClass::Valid,
                _ => SuperClass::Invalid,
            },
            None => SuperClass::NotSetted,
        };
    }

    fn check_on_super_call(&mut self, span: Span) {
        match self.class_meta.super_class {
            SuperClass::Invalid => {
                self.emit_report(span, BAD_SUPER_MESSAGE);
            }
            SuperClass::NotSetted => {
                if let Some(span) = self.class_meta.loop_span {
                    self.emit_report(span, MORE_THAN_ONE_CALL_POSSIBLE_MESSAGE);
                } else if self.class_meta.code_path.super_calls_count > 1 {
                    self.emit_report(span, UNEXPECTED_DUPLICATE_SUPER_CALL_MESSAGE);
                } else {
                    self.emit_report(span, CALL_SUPER_EXCPECTED_MESSAGE);
                }
            }
            SuperClass::Valid => {
                if let Some(span) = self.class_meta.loop_span {
                    self.emit_report(span, MORE_THAN_ONE_CALL_POSSIBLE_MESSAGE);
                } else if self.class_meta.code_path.super_calls_count > 1 {
                    self.emit_report(span, UNEXPECTED_DUPLICATE_SUPER_CALL_MESSAGE);
                }
            }
        }
    }

    fn check_on_constructor(&self, span: Span) {
        match self.class_meta.super_class {
            SuperClass::Valid => {
                if self.class_meta.code_path.super_call_missed {
                    self.emit_report(span, LACKED_CALL_SUPER_MESSAGE);
                }

                if self.class_meta.code_path.super_calls_count == 0 {
                    self.emit_report(span, CALL_SUPER_EXCPECTED_MESSAGE);
                }
            }
            SuperClass::NotSetted => {}
            SuperClass::Invalid => {
                if self.class_meta.code_path.super_calls_count == 0 {
                    self.emit_report(span, CALL_SUPER_EXCPECTED_MESSAGE);
                }
            }
        }
    }

    fn update_current_code_path(&mut self, ordered_pathes: &[CodePath]) {
        let current_code_path = &mut self.class_meta.code_path;

        for code_path in ordered_pathes.iter() {
            current_code_path.possibly_returned =
                current_code_path.possibly_returned || code_path.possibly_returned;

            current_code_path.super_calls_count = std::cmp::max(
                current_code_path.super_calls_count,
                code_path.super_calls_count,
            );

            current_code_path.super_call_missed = current_code_path.super_call_missed
                || code_path.super_call_missed
                || code_path.super_calls_count == 0;
        }
    }
}

impl Visit for ConstructorSuper {
    fn visit_class(&mut self, class: &Class) {
        let prev_class_markers = mem::take(&mut self.class_meta);

        self.collect_class(class);

        class.visit_children_with(self);

        self.class_meta = prev_class_markers;
    }

    fn visit_constructor(&mut self, constructor: &Constructor) {
        self.scope += 1;

        self.class_meta.constructor_scope = self.scope;

        constructor.visit_children_with(self);

        self.check_on_constructor(constructor.span);

        self.scope -= 1;
    }

    fn visit_call_expr(&mut self, call_expr: &CallExpr) {
        if let Callee::Super(super_call) = &call_expr.callee {
            if !self.class_meta.code_path.possibly_returned
                && self.class_meta.constructor_scope == self.scope
            {
                self.class_meta.code_path.super_calls_count += 1;
                self.class_meta.code_path.super_call_missed = false;
            }

            self.check_on_super_call(super_call.span);
        }

        call_expr.visit_children_with(self);
    }

    fn visit_if_stmt(&mut self, if_stmt: &IfStmt) {
        if_stmt.test.visit_children_with(self);

        let parent_code_path = self.class_meta.code_path.clone();

        if_stmt.cons.visit_children_with(self);

        let cons_code_path = mem::replace(&mut self.class_meta.code_path, parent_code_path.clone());

        if_stmt.alt.visit_children_with(self);

        let alt_code_path = mem::replace(&mut self.class_meta.code_path, parent_code_path);

        self.update_current_code_path(&[cons_code_path, alt_code_path]);
    }

    fn visit_return_stmt(&mut self, n: &ReturnStmt) {
        if self.scope == self.class_meta.constructor_scope {
            self.class_meta.code_path.possibly_returned = true;
        }

        n.visit_children_with(self);
    }

    fn visit_cond_expr(&mut self, cond_expr: &CondExpr) {
        cond_expr.test.visit_children_with(self);

        let parent_code_path = self.class_meta.code_path.clone();

        cond_expr.cons.visit_children_with(self);

        let cons_code_path = mem::replace(&mut self.class_meta.code_path, parent_code_path.clone());

        cond_expr.alt.visit_children_with(self);

        let alt_code_path = mem::replace(&mut self.class_meta.code_path, parent_code_path);

        self.update_current_code_path(&[cons_code_path, alt_code_path]);
    }

    fn visit_switch_stmt(&mut self, switch_stmt: &SwitchStmt) {
        switch_stmt.discriminant.visit_children_with(self);

        let parent_code_path = self.class_meta.code_path.clone();

        let mut cases: Vec<CodePath> = Vec::with_capacity(switch_stmt.cases.len());

        for switch_case in switch_stmt.cases.iter() {
            switch_case.visit_children_with(self);

            if self.class_meta.code_path.break_exists {
                cases.push(mem::replace(
                    &mut self.class_meta.code_path,
                    parent_code_path.clone(),
                ));
            }
        }

        if cases.is_empty() {
            cases.push(mem::replace(
                &mut self.class_meta.code_path,
                parent_code_path,
            ));
        }

        self.update_current_code_path(cases.as_slice());
    }

    fn visit_try_stmt(&mut self, try_stmt: &TryStmt) {
        let parent_code_path = self.class_meta.code_path.clone();

        try_stmt.block.visit_children_with(self);

        let block_code_path =
            mem::replace(&mut self.class_meta.code_path, parent_code_path.clone());

        if try_stmt.handler.is_some() {
            try_stmt.handler.visit_children_with(self);

            let handler_code_path = mem::replace(&mut self.class_meta.code_path, parent_code_path);

            self.update_current_code_path(&[block_code_path, handler_code_path]);
        } else {
            self.update_current_code_path(&[block_code_path]);
        }

        try_stmt.finalizer.visit_children_with(self);
    }

    fn visit_break_stmt(&mut self, break_stmt: &BreakStmt) {
        self.class_meta.code_path.break_exists = true;

        break_stmt.visit_children_with(self);
    }

    fn visit_function(&mut self, function: &Function) {
        self.scope += 1;

        function.visit_children_with(self);

        self.scope -= 1;
    }

    fn visit_for_in_stmt(&mut self, for_in_stmt: &ForInStmt) {
        let prev_loop_span = mem::replace(&mut self.class_meta.loop_span, Some(for_in_stmt.span));

        for_in_stmt.visit_children_with(self);

        self.class_meta.loop_span = prev_loop_span;
    }

    fn visit_for_of_stmt(&mut self, for_of_stmt: &ForOfStmt) {
        let prev_loop_span = mem::replace(&mut self.class_meta.loop_span, Some(for_of_stmt.span));

        for_of_stmt.visit_children_with(self);

        self.class_meta.loop_span = prev_loop_span;
    }

    fn visit_for_stmt(&mut self, for_stmt: &ForStmt) {
        let prev_loop_span = mem::replace(&mut self.class_meta.loop_span, Some(for_stmt.span));

        for_stmt.visit_children_with(self);

        self.class_meta.loop_span = prev_loop_span;
    }

    fn visit_arrow_expr(&mut self, arrow_expr: &ArrowExpr) {
        self.scope += 1;

        arrow_expr.visit_children_with(self);

        self.scope -= 1;
    }
}
