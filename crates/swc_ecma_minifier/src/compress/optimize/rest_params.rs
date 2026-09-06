use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use super::Optimizer;

/// Returns true if a function body has a strict-mode directive.
pub(super) fn has_use_strict_directive(f: &Function) -> bool {
    f.body.as_ref().is_some_and(|body| {
        body.stmts
            .iter()
            .take_while(|stmt| {
                matches!(stmt, Stmt::Expr(ExprStmt { expr, .. }) if matches!(&**expr, Expr::Lit(Lit::Str(..))))
            })
            .any(|stmt| {
                matches!(stmt,
                    Stmt::Expr(ExprStmt {
                        expr,
                        ..
                    }) if matches!(
                        &**expr,
                        Expr::Lit(Lit::Str(Str { value, raw, .. }))
                            if match raw {
                                Some(raw) => raw == "\"use strict\"" || raw == "'use strict'",
                                None => value == "use strict",
                            }
                    )
                )
            })
    })
}

fn is_direct_eval_callee(callee: &Callee) -> bool {
    let mut expr = match callee {
        Callee::Expr(expr) => &**expr,
        _ => return false,
    };

    while let Expr::Paren(ParenExpr { expr: inner, .. }) = expr {
        expr = inner;
    }

    matches!(expr, Expr::Ident(ident) if ident.sym == "eval")
}

/// Returns true if a direct eval can read the rest binding.
fn uses_rest_in_direct_eval(f: &Function, rest_id: &Id) -> bool {
    fn eval_source_may_read_rest(source: &str, rest_name: &str) -> bool {
        // A source containing `eval` can construct a later direct eval, and an escaped
        // identifier can spell either the rest name or `eval` without appearing as
        // text.
        source.contains(rest_name) || source.contains("eval") || source.contains('\\')
    }

    fn pat_binds_name(pat: &Pat, name: &str) -> bool {
        match pat {
            Pat::Ident(ident) => ident.id.sym == name,
            Pat::Array(array) => array
                .elems
                .iter()
                .flatten()
                .any(|pat| pat_binds_name(pat, name)),
            Pat::Rest(rest) => pat_binds_name(&rest.arg, name),
            Pat::Object(object) => object.props.iter().any(|prop| match prop {
                ObjectPatProp::KeyValue(prop) => pat_binds_name(&prop.value, name),
                ObjectPatProp::Assign(prop) => prop.key.id.sym == name,
                ObjectPatProp::Rest(rest) => pat_binds_name(&rest.arg, name),
            }),
            Pat::Assign(assign) => pat_binds_name(&assign.left, name),
            Pat::Invalid(..) | Pat::Expr(..) => false,
        }
    }

    fn stmts_shadow_name(stmts: &[Stmt], name: &str) -> bool {
        stmts.iter().any(|stmt| {
            matches!(stmt, Stmt::Decl(Decl::Var(var)) if var.kind != VarDeclKind::Var
                && var.decls.iter().any(|decl| pat_binds_name(&decl.name, name)))
        })
    }

    struct Finder<'a> {
        rest_name: &'a str,
        shadowed: usize,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_function_body(&mut self, body: &FunctionBody) {
            if self.found {
                return;
            }

            let shadowed = stmts_shadow_name(&body.stmts, self.rest_name);
            self.shadowed += usize::from(shadowed);
            body.stmts.visit_with(self);
            self.shadowed -= usize::from(shadowed);
        }

        fn visit_block_stmt(&mut self, block: &BlockStmt) {
            if self.found {
                return;
            }

            let shadowed = stmts_shadow_name(&block.stmts, self.rest_name);
            self.shadowed += usize::from(shadowed);
            block.stmts.visit_with(self);
            self.shadowed -= usize::from(shadowed);
        }

        fn visit_switch_stmt(&mut self, switch_stmt: &SwitchStmt) {
            if self.found {
                return;
            }

            switch_stmt.discriminant.visit_with(self);
            if self.found {
                return;
            }

            let shadowed = switch_stmt
                .cases
                .iter()
                .any(|case| stmts_shadow_name(&case.cons, self.rest_name));
            self.shadowed += usize::from(shadowed);
            switch_stmt.cases.visit_with(self);
            self.shadowed -= usize::from(shadowed);
        }

        fn visit_for_stmt(&mut self, for_stmt: &ForStmt) {
            if self.found {
                return;
            }

            let shadowed = matches!(
                &for_stmt.init,
                Some(VarDeclOrExpr::VarDecl(var)) if var.kind != VarDeclKind::Var
                    && var.decls.iter().any(|decl| pat_binds_name(&decl.name, self.rest_name))
            );
            self.shadowed += usize::from(shadowed);
            for_stmt.init.visit_with(self);
            for_stmt.test.visit_with(self);
            for_stmt.update.visit_with(self);
            for_stmt.body.visit_with(self);
            self.shadowed -= usize::from(shadowed);
        }

        fn visit_for_in_stmt(&mut self, for_in: &ForInStmt) {
            if self.found {
                return;
            }

            let shadowed = matches!(
                &for_in.left,
                ForHead::VarDecl(var) if var.kind != VarDeclKind::Var
                    && var.decls.iter().any(|decl| pat_binds_name(&decl.name, self.rest_name))
            );
            self.shadowed += usize::from(shadowed);
            for_in.left.visit_with(self);
            for_in.right.visit_with(self);
            for_in.body.visit_with(self);
            self.shadowed -= usize::from(shadowed);
        }

        fn visit_for_of_stmt(&mut self, for_of: &ForOfStmt) {
            if self.found {
                return;
            }

            let shadowed = matches!(
                &for_of.left,
                ForHead::VarDecl(var) if var.kind != VarDeclKind::Var
                    && var.decls.iter().any(|decl| pat_binds_name(&decl.name, self.rest_name))
            );
            self.shadowed += usize::from(shadowed);
            for_of.left.visit_with(self);
            for_of.right.visit_with(self);
            for_of.body.visit_with(self);
            self.shadowed -= usize::from(shadowed);
        }

        fn visit_catch_clause(&mut self, catch: &CatchClause) {
            if self.found {
                return;
            }

            let shadowed = catch
                .param
                .as_ref()
                .is_some_and(|param| pat_binds_name(param, self.rest_name));
            self.shadowed += usize::from(shadowed);
            catch.param.visit_with(self);
            catch.body.visit_with(self);
            self.shadowed -= usize::from(shadowed);
        }

        fn visit_function(&mut self, function: &Function) {
            if self.found {
                return;
            }

            function.decorators.visit_with(self);
            for param in &function.params {
                param.decorators.visit_with(self);
            }
            if self.found {
                return;
            }

            let shadowed = function
                .params
                .iter()
                .any(|param| pat_binds_name(&param.pat, self.rest_name));
            self.shadowed += usize::from(shadowed);
            function.params.visit_with(self);
            function.body.visit_with(self);
            self.shadowed -= usize::from(shadowed);
        }

        fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
            if self.found {
                return;
            }

            let shadowed = arrow
                .params
                .iter()
                .any(|param| pat_binds_name(param, self.rest_name));
            self.shadowed += usize::from(shadowed);
            arrow.params.visit_with(self);
            arrow.body.visit_with(self);
            self.shadowed -= usize::from(shadowed);
        }

        fn visit_stmts(&mut self, stmts: &[Stmt]) {
            for stmt in stmts {
                if self.found {
                    return;
                }

                stmt.visit_with(self);
            }
        }

        fn visit_expr_or_spreads(&mut self, exprs: &[ExprOrSpread]) {
            for expr in exprs {
                if self.found {
                    return;
                }

                expr.visit_with(self);
            }
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if self.found {
                return;
            }

            if is_direct_eval_callee(&call.callee) && self.shadowed == 0 {
                // A non-literal source can access any enclosing binding. For a literal
                // source, preserve the rest for visible or escaped references and for
                // sources that can construct a later direct eval in the same scope.
                self.found = match call.args.first() {
                    Some(ExprOrSpread { spread: None, expr }) => match &**expr {
                        Expr::Lit(Lit::Str(Str { value, .. })) => {
                            eval_source_may_read_rest(&value.to_string_lossy(), self.rest_name)
                        }
                        _ => true,
                    },
                    _ => true,
                };
                if self.found {
                    return;
                }

                // Additional arguments are evaluated normally and can contain a
                // relevant direct eval even though the outer call ignores them.
                call.args[1..].visit_with(self);
                return;
            }

            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        rest_name: rest_id.0.as_ref(),
        shadowed: 0,
        found: false,
    };

    // Parameter initializers execute in the function's parameter scope. Although
    // the rest binding is still in its TDZ at that point, direct eval can
    // create a closure that reads it after parameter initialization completes.
    f.params[..f.params.len() - 1].visit_with(&mut finder);
    if finder.found {
        return true;
    }

    f.body.visit_with(&mut finder);
    finder.found
}

/// Returns true if a function body reads its implicit `arguments` object.
///
/// A lexical `arguments` declaration has a distinct syntax context, while a
/// `var arguments` declaration aliases the implicit arguments object unless it
/// belongs to a nested arrow function. Its declaration occurrence is not a
/// read. This deliberately does not model the legacy `Function#arguments`
/// property; minification assumes code does not use that property to observe
/// the active arguments object.
fn uses_implicit_arguments(f: &Function) -> bool {
    struct ArrowVarFinder {
        ids: Vec<Id>,
    }

    impl ArrowVarFinder {
        /// Collects bindings declared by a pattern without visiting expressions
        /// in it.
        fn collect_pat(&mut self, pat: &Pat) {
            match pat {
                Pat::Ident(ident) => {
                    if ident.id.sym == "arguments" {
                        self.ids.push(ident.id.to_id());
                    }
                }
                Pat::Array(array) => {
                    for pat in array.elems.iter().flatten() {
                        self.collect_pat(pat);
                    }
                }
                Pat::Rest(rest) => self.collect_pat(&rest.arg),
                Pat::Object(object) => {
                    for prop in &object.props {
                        match prop {
                            ObjectPatProp::KeyValue(prop) => self.collect_pat(&prop.value),
                            ObjectPatProp::Assign(prop) => {
                                if prop.key.id.sym == "arguments" {
                                    self.ids.push(prop.key.id.to_id());
                                }
                            }
                            ObjectPatProp::Rest(rest) => self.collect_pat(&rest.arg),
                        }
                    }
                }
                Pat::Assign(assign) => self.collect_pat(&assign.left),
                Pat::Invalid(..) | Pat::Expr(..) => {}
            }
        }

        fn collect_lexical_var_decl(&mut self, var: &VarDecl) {
            if var.kind != VarDeclKind::Var {
                for declarator in &var.decls {
                    self.collect_pat(&declarator.name);
                }
            }
        }
    }

    impl Visit for ArrowVarFinder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

        fn visit_function(&mut self, _: &Function) {}

        fn visit_constructor(&mut self, _: &Constructor) {}

        fn visit_var_decl(&mut self, var: &VarDecl) {
            if var.kind == VarDeclKind::Var {
                for declarator in &var.decls {
                    self.collect_pat(&declarator.name);
                }
            }
        }
    }

    struct Finder {
        shadowed_arguments: Vec<Id>,
        found: bool,
    }

    impl Visit for Finder {
        fn visit_function_body(&mut self, body: &FunctionBody) {
            if self.found {
                return;
            }

            // A function body has its own lexical scope even though it is not represented
            // by a BlockStmt node.
            let mut binding_finder = ArrowVarFinder { ids: Vec::new() };
            for stmt in &body.stmts {
                if let Stmt::Decl(Decl::Var(var)) = stmt {
                    binding_finder.collect_lexical_var_decl(var);
                }
            }

            let shadowed_len = self.shadowed_arguments.len();
            self.shadowed_arguments.extend(binding_finder.ids);
            body.visit_children_with(self);
            self.shadowed_arguments.truncate(shadowed_len);
        }

        fn visit_block_stmt(&mut self, block: &BlockStmt) {
            if self.found {
                return;
            }

            // Lexical declarations shadow the implicit arguments object throughout their
            // containing block, including before their declaration is evaluated.
            let mut binding_finder = ArrowVarFinder { ids: Vec::new() };
            for stmt in &block.stmts {
                if let Stmt::Decl(Decl::Var(var)) = stmt {
                    binding_finder.collect_lexical_var_decl(var);
                }
            }

            let shadowed_len = self.shadowed_arguments.len();
            self.shadowed_arguments.extend(binding_finder.ids);
            block.visit_children_with(self);
            self.shadowed_arguments.truncate(shadowed_len);
        }

        fn visit_switch_stmt(&mut self, switch_stmt: &SwitchStmt) {
            if self.found {
                return;
            }

            // The discriminant is evaluated before the switch's lexical scope is
            // created, while lexical declarations in all case consequents share that
            // scope.
            switch_stmt.discriminant.visit_with(self);
            if self.found {
                return;
            }

            let mut binding_finder = ArrowVarFinder { ids: Vec::new() };
            for case in &switch_stmt.cases {
                for stmt in &case.cons {
                    if let Stmt::Decl(Decl::Var(var)) = stmt {
                        binding_finder.collect_lexical_var_decl(var);
                    }
                }
            }

            let shadowed_len = self.shadowed_arguments.len();
            self.shadowed_arguments.extend(binding_finder.ids);
            switch_stmt.cases.visit_with(self);
            self.shadowed_arguments.truncate(shadowed_len);
        }

        fn visit_for_stmt(&mut self, for_stmt: &ForStmt) {
            if self.found {
                return;
            }

            // A lexical declaration in a for initializer is in scope for the
            // initializer, condition, update, and body.
            let mut binding_finder = ArrowVarFinder { ids: Vec::new() };
            if let Some(VarDeclOrExpr::VarDecl(var)) = &for_stmt.init {
                binding_finder.collect_lexical_var_decl(var);
            }

            let shadowed_len = self.shadowed_arguments.len();
            self.shadowed_arguments.extend(binding_finder.ids);
            for_stmt.init.visit_with(self);
            for_stmt.test.visit_with(self);
            for_stmt.update.visit_with(self);
            for_stmt.body.visit_with(self);
            self.shadowed_arguments.truncate(shadowed_len);
        }

        fn visit_for_in_stmt(&mut self, for_in: &ForInStmt) {
            if self.found {
                return;
            }

            let mut binding_finder = ArrowVarFinder { ids: Vec::new() };
            if let ForHead::VarDecl(var) = &for_in.left {
                binding_finder.collect_lexical_var_decl(var);
            }

            // A lexical loop binding is in scope (and in its TDZ) while the
            // right-hand side is evaluated.
            let shadowed_len = self.shadowed_arguments.len();
            self.shadowed_arguments.extend(binding_finder.ids);
            for_in.left.visit_with(self);
            for_in.right.visit_with(self);
            for_in.body.visit_with(self);
            self.shadowed_arguments.truncate(shadowed_len);
        }

        fn visit_for_of_stmt(&mut self, for_of: &ForOfStmt) {
            if self.found {
                return;
            }

            let mut binding_finder = ArrowVarFinder { ids: Vec::new() };
            if let ForHead::VarDecl(var) = &for_of.left {
                binding_finder.collect_lexical_var_decl(var);
            }

            // A lexical loop binding is in scope (and in its TDZ) while the
            // right-hand side is evaluated.
            let shadowed_len = self.shadowed_arguments.len();
            self.shadowed_arguments.extend(binding_finder.ids);
            for_of.left.visit_with(self);
            for_of.right.visit_with(self);
            for_of.body.visit_with(self);
            self.shadowed_arguments.truncate(shadowed_len);
        }

        fn visit_catch_clause(&mut self, catch: &CatchClause) {
            if self.found {
                return;
            }

            let mut binding_finder = ArrowVarFinder { ids: Vec::new() };
            if let Some(param) = &catch.param {
                binding_finder.collect_pat(param);
            }

            let shadowed_len = self.shadowed_arguments.len();
            self.shadowed_arguments.extend(binding_finder.ids);
            catch.param.visit_with(self);
            catch.body.visit_with(self);
            self.shadowed_arguments.truncate(shadowed_len);
        }

        fn visit_stmts(&mut self, stmts: &[Stmt]) {
            for stmt in stmts {
                if self.found {
                    return;
                }

                stmt.visit_with(self);
            }
        }

        fn visit_expr_or_spreads(&mut self, exprs: &[ExprOrSpread]) {
            for expr in exprs {
                if self.found {
                    return;
                }

                expr.visit_with(self);
            }
        }

        fn visit_function(&mut self, function: &Function) {
            if self.found {
                return;
            }

            // Function and parameter decorators execute while the enclosing scope is
            // active, unlike the nested function's parameters and body.
            function.decorators.visit_with(self);
            for param in &function.params {
                if self.found {
                    return;
                }

                param.decorators.visit_with(self);
            }
        }

        fn visit_constructor(&mut self, constructor: &Constructor) {
            if self.found {
                return;
            }

            // Constructor parameter decorators execute in the enclosing scope. The
            // parameter patterns and constructor body execute in the constructor's
            // own scope and must remain skipped.
            for param in &constructor.params {
                if self.found {
                    return;
                }

                match param {
                    ParamOrTsParamProp::Param(param) => param.decorators.visit_with(self),
                    ParamOrTsParamProp::TsParamProp(param) => param.decorators.visit_with(self),
                }
            }
        }

        fn visit_labeled_stmt(&mut self, labeled: &LabeledStmt) {
            if self.found {
                return;
            }

            // Labels are not expression references and live in a separate namespace.
            labeled.body.visit_with(self);
        }

        fn visit_break_stmt(&mut self, _: &BreakStmt) {}

        fn visit_continue_stmt(&mut self, _: &ContinueStmt) {}

        fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
            if self.found {
                return;
            }

            let mut param_finder = ArrowVarFinder { ids: Vec::new() };
            // Arrow parameters shadow the enclosing implicit `arguments` object in both
            // their initializers and the arrow body.
            for param in &arrow.params {
                param_finder.collect_pat(param);
            }

            let shadowed_len = self.shadowed_arguments.len();
            self.shadowed_arguments.extend(param_finder.ids);
            arrow.params.visit_with(self);
            if self.found {
                self.shadowed_arguments.truncate(shadowed_len);
                return;
            }

            let mut var_finder = ArrowVarFinder { ids: Vec::new() };
            arrow.body.visit_with(&mut var_finder);
            self.shadowed_arguments.extend(var_finder.ids);
            arrow.body.visit_with(self);
            self.shadowed_arguments.truncate(shadowed_len);
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if self.found {
                return;
            }

            // Direct eval can read the enclosing implicit `arguments` object without a
            // corresponding identifier node. A locally resolved `eval` might hold the
            // intrinsic evaluator, so its syntax context alone cannot prove this call
            // indirect. Nested ordinary functions and constructors are skipped above,
            // while arrows share the enclosing lexical scope.
            if is_direct_eval_callee(&call.callee) && self.shadowed_arguments.is_empty() {
                self.found = true;
                return;
            }

            call.visit_children_with(self);
        }

        // A binding identifier declares a name, while expressions nested in a binding
        // pattern (defaults and computed keys) still execute and can read `arguments`.
        fn visit_binding_ident(&mut self, _: &BindingIdent) {}

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if assign.op != op!("=") {
                if let Some(SimpleAssignTarget::Ident(ident)) = assign.left.as_simple() {
                    self.visit_ident(&ident.id);
                }
            }

            assign.visit_children_with(self);
        }

        fn visit_ident(&mut self, ident: &Ident) {
            if self.found {
                return;
            }

            if ident.sym == "arguments" && !self.shadowed_arguments.contains(&ident.to_id()) {
                self.found = true;
            }
        }
    }

    let mut finder = Finder {
        shadowed_arguments: Vec::new(),
        found: false,
    };
    f.body.visit_with(&mut finder);
    finder.found
}
use crate::program_data::ScopeData;

/// Methods related to rest parameter optimization.
impl Optimizer<'_> {
    /// Removes unused rest parameters from functions.
    ///
    /// Example:
    /// ```js
    /// function f(a, ...b) {
    ///     console.log(a);
    /// }
    /// ```
    /// =>
    /// ```js
    /// function f(a) {
    ///     console.log(a);
    /// }
    /// ```
    pub(super) fn drop_unused_rest_params(&mut self, f: &mut Function, in_strict: bool) {
        if !self.options.arguments && !self.options.unused {
            return;
        }

        // Don't optimize if there's no rest parameter
        if f.params.is_empty() {
            return;
        }

        let last_param = match f.params.last() {
            Some(p) => p,
            None => return,
        };

        // Check if the last parameter is a rest parameter
        let rest_pat = match &last_param.pat {
            Pat::Rest(rest) => rest,
            _ => return,
        };

        // Get the identifier of the rest parameter
        let rest_id = match &*rest_pat.arg {
            Pat::Ident(BindingIdent { id, .. }) => id.to_id(),
            _ => return,
        };

        // Removing a rest parameter can make a sloppy function's parameter list simple.
        // In that case, `arguments` becomes mapped to the remaining parameters, which
        // changes observable behavior when the function uses `arguments`. Removing a
        // rest parameter named `arguments` can also expose the implicit binding.
        let can_make_arguments_mapped = f.params.len() > 1
            && !in_strict
            && f.params[..f.params.len() - 1].iter().all(|param| {
                matches!(
                    &param.pat,
                    Pat::Ident(BindingIdent { id, .. }) if id.sym != "arguments"
                )
            });
        let can_expose_implicit_arguments = !in_strict && rest_id.0 == "arguments";
        let can_change_arguments = can_make_arguments_mapped || can_expose_implicit_arguments;

        if let Some(usage) = self.data.vars.get(&rest_id) {
            // Preserve the rest parameter only if removing it can change an
            // `arguments` binding, change an arguments object from unmapped to mapped,
            // or make a binding unavailable to direct eval.
            if usage.ref_count == 0 {
                let uses_arguments = can_change_arguments && uses_implicit_arguments(f);
                if !can_change_arguments || !uses_arguments {
                    if let Some(scope) = self.data.get_scope(f.ctxt) {
                        let has_relevant_dynamic_scope = scope.contains(ScopeData::HAS_WITH_STMT)
                            || (scope.contains(ScopeData::HAS_EVAL_CALL)
                                && uses_rest_in_direct_eval(f, &rest_id));
                        if has_relevant_dynamic_scope {
                            return;
                        }
                    }

                    self.changed = true;
                    report_change!("rest_params: Removing unused rest parameter");
                    f.params.pop();
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_atoms::Atom;
    use swc_common::DUMMY_SP;

    use super::*;

    fn function_with_directive(value: &str, raw: Option<&str>) -> Function {
        Function {
            body: Some(FunctionBody {
                span: DUMMY_SP,
                stmts: vec![Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: value.into(),
                        raw: raw.map(Atom::from),
                    }))),
                })],
            }),
            ..Default::default()
        }
    }

    #[test]
    fn recognizes_synthesized_strict_directives() {
        assert!(has_use_strict_directive(&function_with_directive(
            "use strict",
            None
        )));
        assert!(!has_use_strict_directive(&function_with_directive(
            "use strict",
            Some("\"use\\x20strict\"")
        )));
    }
}
