use std::collections::HashSet;

use swc_common::Spanned;
use swc_ecma_ast::{
    CallExpr, Callee, CondExpr, Expr, MemberExpr, MemberProp, Pat, Stmt, VarDeclarator,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
    utils::is_hook_name,
};

const HOOK_REFERENCE_REASON: &str = "Hooks may not be referenced as normal values, they must be called. See https://react.dev/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values";
const HOOK_CONDITIONAL_REASON: &str = "Hooks must always be called in a consistent order, and may not be called conditionally. See the Rules of Hooks (https://react.dev/warnings/invalid-hook-call-warning)";
const HOOK_NESTED_REASON: &str = "Hooks must be called at the top level in the body of a function component or custom hook, and may not be called within function expressions. See the Rules of Hooks (https://react.dev/warnings/invalid-hook-call-warning)";

pub fn validate_hooks_usage(hir: &HirFunction) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };
    let local_bindings = collect_local_bindings(hir);

    #[derive(Default)]
    struct Finder {
        errors: Vec<CompilerErrorDetail>,
        local_bindings: HashSet<String>,
        hook_aliases: HashSet<String>,
        in_binding: bool,
        in_direct_callee: bool,
        conditional_depth: usize,
        nested_function_depth: usize,
    }

    impl Finder {
        fn push(&mut self, span: swc_common::Span, reason: &'static str) {
            let mut detail = CompilerErrorDetail::error(ErrorCategory::Hooks, reason);
            detail.loc = Some(span);
            self.errors.push(detail);
        }

        fn hook_like_expr(expr: &Expr) -> bool {
            match expr {
                Expr::Ident(ident) => is_hook_name(ident.sym.as_ref()),
                Expr::Member(member) => hook_like_member(member),
                _ => false,
            }
        }
    }

    impl Visit for Finder {
        fn visit_pat(&mut self, pat: &Pat) {
            let prev = self.in_binding;
            self.in_binding = true;
            pat.visit_children_with(self);
            self.in_binding = prev;
        }

        fn visit_cond_expr(&mut self, expr: &CondExpr) {
            expr.test.visit_with(self);
            self.conditional_depth += 1;
            expr.cons.visit_with(self);
            expr.alt.visit_with(self);
            self.conditional_depth -= 1;
        }

        fn visit_stmt(&mut self, stmt: &Stmt) {
            let enters_conditional = matches!(
                stmt,
                Stmt::If(_)
                    | Stmt::For(_)
                    | Stmt::ForIn(_)
                    | Stmt::ForOf(_)
                    | Stmt::While(_)
                    | Stmt::DoWhile(_)
                    | Stmt::Switch(_)
                    | Stmt::Try(_)
            );
            if enters_conditional {
                self.conditional_depth += 1;
            }
            stmt.visit_children_with(self);
            if enters_conditional {
                self.conditional_depth -= 1;
            }
        }

        fn visit_function(&mut self, function: &swc_ecma_ast::Function) {
            self.nested_function_depth += 1;
            function.visit_children_with(self);
            self.nested_function_depth -= 1;
        }

        fn visit_arrow_expr(&mut self, arrow: &swc_ecma_ast::ArrowExpr) {
            self.nested_function_depth += 1;
            arrow.visit_children_with(self);
            self.nested_function_depth -= 1;
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if let Callee::Expr(callee) = &call.callee {
                if Finder::hook_like_expr(callee) {
                    let is_dynamic_local_hook_call = match &**callee {
                        Expr::Ident(ident) => self.local_bindings.contains(ident.sym.as_ref()),
                        Expr::Member(member) => {
                            if let Expr::Ident(obj) = &*member.obj {
                                self.local_bindings.contains(obj.sym.as_ref())
                            } else {
                                false
                            }
                        }
                        _ => false,
                    };
                    if self.nested_function_depth > 0 {
                        self.push(call.span, HOOK_NESTED_REASON);
                    } else if self.conditional_depth > 0 {
                        self.push(call.span, HOOK_CONDITIONAL_REASON);
                    } else if is_dynamic_local_hook_call {
                        self.push(call.span, HOOK_REFERENCE_REASON);
                    }
                } else if let Expr::Ident(ident) = &**callee {
                    if self.hook_aliases.contains(ident.sym.as_ref()) {
                        self.push(call.span, HOOK_REFERENCE_REASON);
                    }
                }
            }

            // Visit call args first with default behavior.
            for arg in &call.args {
                arg.visit_with(self);
            }

            // Then visit callee while marking direct-callee context.
            let prev = self.in_direct_callee;
            self.in_direct_callee = true;
            call.callee.visit_with(self);
            self.in_direct_callee = prev;
        }

        fn visit_var_declarator(&mut self, declarator: &VarDeclarator) {
            if self.nested_function_depth == 0 {
                if let Pat::Ident(binding) = &declarator.name {
                    if let Some(init) = &declarator.init {
                        if contains_hook_reference(init, &self.hook_aliases, &self.local_bindings) {
                            self.hook_aliases.insert(binding.id.sym.to_string());
                            self.push(init.span(), HOOK_REFERENCE_REASON);
                        }
                    }
                }
            }
            declarator.visit_children_with(self);
        }

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            member.obj.visit_with(self);
            if let MemberProp::Computed(computed) = &member.prop {
                computed.visit_with(self);
            }
        }

        fn visit_ident(&mut self, ident: &swc_ecma_ast::Ident) {
            if self.in_binding || self.in_direct_callee || !is_hook_name(ident.sym.as_ref()) {
                return;
            }
            if self.local_bindings.contains(ident.sym.as_ref())
                && !self.hook_aliases.contains(ident.sym.as_ref())
            {
                return;
            }
            self.push(ident.span, HOOK_REFERENCE_REASON);
        }
    }

    let mut finder = Finder {
        errors: Vec::new(),
        local_bindings,
        hook_aliases: HashSet::new(),
        in_binding: false,
        in_direct_callee: false,
        conditional_depth: 0,
        nested_function_depth: 0,
    };
    // Validate only the outer function body; nested traversal is controlled by
    // `nested_function_depth`.
    body.visit_with(&mut finder);

    if finder.errors.is_empty() {
        Ok(())
    } else {
        Err(CompilerError {
            details: finder.errors,
        })
    }
}

fn hook_like_member(member: &MemberExpr) -> bool {
    match &member.prop {
        MemberProp::Ident(ident) => is_hook_name(ident.sym.as_ref()),
        MemberProp::Computed(computed) => {
            matches!(&*computed.expr, Expr::Ident(ident) if is_hook_name(ident.sym.as_ref()))
        }
        MemberProp::PrivateName(_) => false,
    }
}

fn contains_hook_reference(
    expr: &Expr,
    known_aliases: &HashSet<String>,
    local_bindings: &HashSet<String>,
) -> bool {
    struct Finder<'a> {
        known_aliases: &'a HashSet<String>,
        local_bindings: &'a HashSet<String>,
        found: bool,
        in_binding: bool,
        in_direct_callee: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_pat(&mut self, pat: &Pat) {
            let prev = self.in_binding;
            self.in_binding = true;
            pat.visit_children_with(self);
            self.in_binding = prev;
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            for arg in &call.args {
                arg.visit_with(self);
            }
            let prev = self.in_direct_callee;
            self.in_direct_callee = true;
            call.callee.visit_with(self);
            self.in_direct_callee = prev;
        }

        fn visit_ident(&mut self, ident: &swc_ecma_ast::Ident) {
            if self.in_binding || self.in_direct_callee {
                return;
            }
            let name = ident.sym.as_ref();
            if self.known_aliases.contains(name) {
                self.found = true;
                return;
            }
            if is_hook_name(name) && !self.local_bindings.contains(name) {
                self.found = true;
            }
        }

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            if !self.in_direct_callee && hook_like_member(member) {
                if let Expr::Ident(obj) = &*member.obj {
                    let name = obj.sym.as_ref();
                    if self.local_bindings.contains(name) && !self.known_aliases.contains(name) {
                        member.obj.visit_with(self);
                        if let MemberProp::Computed(computed) = &member.prop {
                            computed.visit_with(self);
                        }
                        return;
                    }
                }
                self.found = true;
            }
            member.obj.visit_with(self);
            if let MemberProp::Computed(computed) = &member.prop {
                computed.visit_with(self);
            }
        }
    }

    let mut finder = Finder {
        known_aliases,
        local_bindings,
        found: false,
        in_binding: false,
        in_direct_callee: false,
    };
    expr.visit_with(&mut finder);
    finder.found
}

fn collect_local_bindings(hir: &HirFunction) -> HashSet<String> {
    let mut out = HashSet::new();
    for param in &hir.function.params {
        collect_pat_bindings(&param.pat, &mut out);
    }
    if let Some(body) = &hir.function.body {
        for stmt in &body.stmts {
            collect_stmt_bindings(stmt, &mut out);
        }
    }
    out
}

fn collect_stmt_bindings(stmt: &Stmt, out: &mut HashSet<String>) {
    match stmt {
        Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) => {
            for decl in &var_decl.decls {
                collect_pat_bindings(&decl.name, out);
            }
        }
        Stmt::Decl(swc_ecma_ast::Decl::Fn(fn_decl)) => {
            out.insert(fn_decl.ident.sym.to_string());
        }
        Stmt::Decl(swc_ecma_ast::Decl::Class(class_decl)) => {
            out.insert(class_decl.ident.sym.to_string());
        }
        _ => {}
    }
}

fn collect_pat_bindings(pat: &Pat, out: &mut HashSet<String>) {
    match pat {
        Pat::Ident(binding) => {
            out.insert(binding.id.sym.to_string());
        }
        Pat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_pat_bindings(elem, out);
            }
        }
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    swc_ecma_ast::ObjectPatProp::Assign(assign) => {
                        out.insert(assign.key.id.sym.to_string());
                    }
                    swc_ecma_ast::ObjectPatProp::KeyValue(key_value) => {
                        collect_pat_bindings(&key_value.value, out);
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        collect_pat_bindings(&rest.arg, out);
                    }
                }
            }
        }
        Pat::Assign(assign) => collect_pat_bindings(&assign.left, out),
        Pat::Rest(rest) => collect_pat_bindings(&rest.arg, out),
        Pat::Expr(_) | Pat::Invalid(_) => {}
    }
}
