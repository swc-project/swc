use swc_atoms::JsWord;
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

pub fn no_loop_func(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoLoopFunc::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct NoLoopFunc {
    expected_reaction: LintRuleReaction,
    current_var_kind: Option<VarDeclKind>,
    loop_depth: usize,
    function_depth: usize,
    inside_loop_decl: bool,
    scopes: Vec<Span>,
    scoped_unsafe_vars: AHashMap<Span, AHashSet<Id>>,
    current_fn_unsafe_vars: AHashSet<JsWord>,
}

impl NoLoopFunc {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        let root_scope = DUMMY_SP;

        let mut scoped_vars: AHashMap<Span, AHashSet<Id>> = Default::default();
        scoped_vars.insert(root_scope, Default::default());

        Self {
            expected_reaction,
            current_var_kind: None,
            loop_depth: 0,
            function_depth: 0,
            inside_loop_decl: false,
            scopes: vec![root_scope],
            scoped_unsafe_vars: scoped_vars,
            current_fn_unsafe_vars: Default::default(),
        }
    }

    fn emit_report(&self, span: Span) {
        let mut names = self
            .current_fn_unsafe_vars
            .iter()
            .map(|js_word| (&*js_word) as &str)
            .collect::<Vec<&str>>();

        let message = if names.len() == 1 {
            format!(
                "Function declared in a loop contains unsafe references to variable {}",
                names.join(", ")
            )
        } else {
            names.sort_unstable();

            format!(
                "Function declared in a loop contains unsafe references to variable(s) {}",
                names.join(", ")
            )
        };

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

    fn is_unsafe_variable(&self, id: &Id) -> bool {
        self.scopes
            .iter()
            .rev()
            .any(|scope| self.scoped_unsafe_vars.get(scope).unwrap().contains(id))
    }

    fn extract_vars(&mut self, pat: &Pat) {
        match pat {
            Pat::Ident(ident) => {
                self.scoped_unsafe_vars
                    .get_mut(self.scopes.last().unwrap())
                    .unwrap()
                    .insert(ident.to_id());
            }
            Pat::Array(ArrayPat { elems, .. }) => {
                elems.iter().for_each(|elem| {
                    if let Some(elem) = elem {
                        self.extract_vars(elem);
                    }
                });
            }
            Pat::Object(ObjectPat { props, .. }) => {
                props.iter().for_each(|prop| match prop {
                    ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                        self.scoped_unsafe_vars
                            .get_mut(self.scopes.last().unwrap())
                            .unwrap()
                            .insert(key.to_id());
                    }
                    ObjectPatProp::KeyValue(KeyValuePatProp { value, .. }) => {
                        self.extract_vars(value.as_ref());
                    }
                    ObjectPatProp::Rest(RestPat { arg, .. }) => {
                        self.extract_vars(arg.as_ref());
                    }
                });
            }
            Pat::Rest(RestPat { arg, .. }) => {
                self.extract_vars(arg.as_ref());
            }
            Pat::Assign(AssignPat { left, .. }) => {
                self.extract_vars(left.as_ref());
            }
            Pat::Invalid(_) => {}
            Pat::Expr(_) => {}
        }
    }
}

impl Visit for NoLoopFunc {
    noop_visit_type!();

    fn visit_block_stmt(&mut self, block: &BlockStmt) {
        self.scopes.push(block.span);
        self.scoped_unsafe_vars
            .insert(block.span, Default::default());

        block.visit_children_with(self);

        self.scopes.pop();
        self.scoped_unsafe_vars.remove(&block.span);
    }

    fn visit_for_stmt(&mut self, for_stmt: &ForStmt) {
        self.loop_depth += 1;

        self.inside_loop_decl = true;

        if let Some(clause) = &for_stmt.init {
            clause.visit_children_with(self);
        }

        if let Some(clause) = &for_stmt.test {
            clause.visit_children_with(self);
        }

        if let Some(clause) = &for_stmt.update {
            clause.visit_children_with(self);
        }

        self.inside_loop_decl = false;

        for_stmt.body.visit_children_with(self);

        self.loop_depth -= 1;
    }

    fn visit_for_of_stmt(&mut self, for_of_stmt: &ForOfStmt) {
        self.loop_depth += 1;

        self.inside_loop_decl = true;

        for_of_stmt.left.visit_children_with(self);
        for_of_stmt.right.visit_children_with(self);

        self.inside_loop_decl = false;

        for_of_stmt.body.visit_children_with(self);

        self.loop_depth -= 1;
    }

    fn visit_for_in_stmt(&mut self, for_in_stmt: &ForInStmt) {
        self.loop_depth += 1;

        self.inside_loop_decl = true;

        for_in_stmt.left.visit_children_with(self);
        for_in_stmt.right.visit_children_with(self);

        self.inside_loop_decl = false;

        for_in_stmt.body.visit_children_with(self);

        self.loop_depth -= 1;
    }

    fn visit_while_stmt(&mut self, while_stmt: &WhileStmt) {
        self.loop_depth += 1;

        self.inside_loop_decl = true;

        while_stmt.test.visit_children_with(self);

        self.inside_loop_decl = false;

        while_stmt.body.visit_children_with(self);

        self.loop_depth -= 1;
    }

    fn visit_do_while_stmt(&mut self, do_while_stmt: &DoWhileStmt) {
        self.loop_depth += 1;

        self.inside_loop_decl = true;

        do_while_stmt.test.visit_children_with(self);

        self.inside_loop_decl = false;

        do_while_stmt.body.visit_children_with(self);

        self.loop_depth -= 1;
    }

    fn visit_var_decl(&mut self, n: &VarDecl) {
        self.current_var_kind = Some(n.kind);

        n.visit_children_with(self);

        self.current_var_kind = None;
    }

    fn visit_var_declarator(&mut self, var_declarator: &VarDeclarator) {
        match self.current_var_kind {
            Some(VarDeclKind::Const) => {
                // const always safe
                return;
            }
            Some(VarDeclKind::Let) => {
                if self.inside_loop_decl {
                    // case when var declared into loop head
                    // for (let i = 0; ...) {}

                    return;
                }

                // case when var declared into loop
                // while (cond) { let x = v; ... }
                if self.loop_depth > 0 {
                    return;
                }
            }
            _ => {}
        };

        self.extract_vars(&var_declarator.name);
    }

    fn visit_function(&mut self, function: &Function) {
        let prev_fn_vars = std::mem::take(&mut self.current_fn_unsafe_vars);

        self.function_depth += 1;

        function.visit_children_with(self);

        if !self.current_fn_unsafe_vars.is_empty() {
            self.emit_report(function.span);
        }

        self.current_fn_unsafe_vars = prev_fn_vars;
        self.function_depth -= 1;
    }

    fn visit_arrow_expr(&mut self, arrow_function: &ArrowExpr) {
        let prev_fn_vars = std::mem::take(&mut self.current_fn_unsafe_vars);

        self.function_depth += 1;

        arrow_function.visit_children_with(self);

        if !self.current_fn_unsafe_vars.is_empty() {
            self.emit_report(arrow_function.span);
        }

        self.current_fn_unsafe_vars = prev_fn_vars;
        self.function_depth -= 1;
    }

    fn visit_ident(&mut self, ident: &Ident) {
        let inside_function_defined_in_loop = self.loop_depth > 0 && self.function_depth > 0;

        if inside_function_defined_in_loop && self.is_unsafe_variable(&ident.to_id()) {
            self.current_fn_unsafe_vars.insert(ident.sym.clone());
        }
    }
}
