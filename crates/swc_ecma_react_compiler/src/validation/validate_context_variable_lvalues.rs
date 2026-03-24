use std::collections::HashSet;

use swc_ecma_ast::{
    op, AssignExpr, AssignTarget, Callee, Expr, MemberExpr, MemberProp, Pat, Stmt, UpdateExpr,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

const GLOBAL_REASSIGN_REASON: &str =
    "Cannot reassign variables declared outside of the component/hook";
const FROZEN_VALUE_REASON: &str = "This value cannot be modified";
const FROZEN_JSX_DESCRIPTION: &str = "Modifying a value used previously in JSX is not allowed. \
                                      Consider moving the modification before the JSX.";
const FROZEN_PROP_DESCRIPTION: &str = "Modifying component props or hook arguments is not \
                                       allowed. Consider using a local variable instead.";

pub fn validate_context_variable_lvalues(hir: &HirFunction) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };

    let mut params = HashSet::<String>::new();
    for param in &hir.function.params {
        collect_pat_bindings(&param.pat, &mut params);
    }

    let mut locals = params.clone();
    collect_block_bindings(body, &mut locals);

    let mut frozen_from_jsx = HashSet::<String>::new();
    let mut errors = Vec::<CompilerErrorDetail>::new();

    for stmt in &body.stmts {
        let mut mutations = Vec::<Mutation>::new();
        collect_stmt_mutations(stmt, &mut mutations);

        for mutation in &mutations {
            if params.contains(mutation.target.as_str()) {
                errors.push(modification_error(
                    mutation.span,
                    Some(FROZEN_PROP_DESCRIPTION),
                ));
                continue;
            }

            if frozen_from_jsx.contains(mutation.target.as_str()) {
                errors.push(modification_error(
                    mutation.span,
                    Some(FROZEN_JSX_DESCRIPTION),
                ));
                continue;
            }

            if !locals.contains(mutation.target.as_str()) && !is_known_global(&mutation.target) {
                errors.push(global_reassign_error(mutation.span));
            }
        }

        let mut jsx_refs = HashSet::<String>::new();
        collect_jsx_refs(stmt, &mut jsx_refs);
        frozen_from_jsx.extend(jsx_refs);
    }

    if errors.is_empty() {
        Ok(())
    } else {
        Err(CompilerError { details: errors })
    }
}

#[derive(Debug, Clone)]
struct Mutation {
    target: String,
    span: swc_common::Span,
}

fn global_reassign_error(span: swc_common::Span) -> CompilerErrorDetail {
    let mut detail =
        CompilerErrorDetail::error(ErrorCategory::Immutability, GLOBAL_REASSIGN_REASON);
    detail.loc = Some(span);
    detail
}

fn modification_error(span: swc_common::Span, description: Option<&str>) -> CompilerErrorDetail {
    let mut detail = CompilerErrorDetail::error(ErrorCategory::Immutability, FROZEN_VALUE_REASON);
    detail.description = description.map(str::to_string);
    detail.loc = Some(span);
    detail
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

fn collect_block_bindings(block: &swc_ecma_ast::BlockStmt, out: &mut HashSet<String>) {
    struct Finder<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {
            // Function-local mutability should not be affected by declarations
            // inside nested functions.
        }

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            // Function-local mutability should not be affected by declarations
            // inside nested functions.
        }

        fn visit_var_declarator(&mut self, decl: &swc_ecma_ast::VarDeclarator) {
            collect_pat_bindings(&decl.name, self.out);
            decl.visit_children_with(self);
        }

        fn visit_fn_decl(&mut self, decl: &swc_ecma_ast::FnDecl) {
            self.out.insert(decl.ident.sym.to_string());
            // No recursion needed: nested declaration body is skipped by
            // `visit_function`.
        }

        fn visit_class_decl(&mut self, decl: &swc_ecma_ast::ClassDecl) {
            self.out.insert(decl.ident.sym.to_string());
            decl.visit_children_with(self);
        }
    }

    block.visit_with(&mut Finder { out });
}

fn collect_stmt_mutations(stmt: &Stmt, out: &mut Vec<Mutation>) {
    struct Finder<'a> {
        out: &'a mut Vec<Mutation>,
    }

    impl Finder<'_> {
        fn push(&mut self, target: &str, span: swc_common::Span) {
            self.out.push(Mutation {
                target: target.to_string(),
                span,
            });
        }
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {
            // Skip nested functions. Mutations inside callbacks may or may not
            // execute during render; this pass only validates direct render
            // statements conservatively.
        }

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            // Skip nested arrows for the same reason as above.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            match &assign.left {
                AssignTarget::Simple(simple) => match simple {
                    swc_ecma_ast::SimpleAssignTarget::Ident(binding) => {
                        self.push(binding.id.sym.as_ref(), assign.span);
                    }
                    swc_ecma_ast::SimpleAssignTarget::Member(member) => {
                        if let Some(name) = member_root_ident(member) {
                            self.push(name, assign.span);
                        }
                    }
                    _ => {}
                },
                AssignTarget::Pat(pat) => {
                    collect_assign_pat_targets(pat, self.out, assign.span);
                }
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &UpdateExpr) {
            match &*update.arg {
                Expr::Ident(ident) => {
                    self.push(ident.sym.as_ref(), update.span);
                }
                Expr::Member(member) => {
                    if let Some(name) = member_root_ident(member) {
                        self.push(name, update.span);
                    }
                }
                _ => {}
            }
            update.visit_children_with(self);
        }

        fn visit_unary_expr(&mut self, unary: &swc_ecma_ast::UnaryExpr) {
            if unary.op == op!("delete") {
                if let Expr::Member(member) = &*unary.arg {
                    if let Some(name) = member_root_ident(member) {
                        self.push(name, unary.span);
                    }
                }
            }
            unary.visit_children_with(self);
        }

        fn visit_call_expr(&mut self, call: &swc_ecma_ast::CallExpr) {
            if let Some(name) = mutating_method_target(call) {
                self.push(name, call.span);
            }
            call.visit_children_with(self);
        }
    }

    stmt.visit_with(&mut Finder { out });
}

fn collect_assign_pat_targets(
    pat: &swc_ecma_ast::AssignTargetPat,
    out: &mut Vec<Mutation>,
    span: swc_common::Span,
) {
    match pat {
        swc_ecma_ast::AssignTargetPat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_mutation_targets_from_pat(elem, out, span);
            }
        }
        swc_ecma_ast::AssignTargetPat::Object(object) => {
            for prop in &object.props {
                match prop {
                    swc_ecma_ast::ObjectPatProp::Assign(assign) => {
                        out.push(Mutation {
                            target: assign.key.id.sym.to_string(),
                            span,
                        });
                    }
                    swc_ecma_ast::ObjectPatProp::KeyValue(key_value) => {
                        collect_mutation_targets_from_pat(&key_value.value, out, span);
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        collect_mutation_targets_from_pat(&rest.arg, out, span);
                    }
                }
            }
        }
        swc_ecma_ast::AssignTargetPat::Invalid(_) => {}
    }
}

fn collect_mutation_targets_from_pat(pat: &Pat, out: &mut Vec<Mutation>, span: swc_common::Span) {
    match pat {
        Pat::Ident(binding) => out.push(Mutation {
            target: binding.id.sym.to_string(),
            span,
        }),
        Pat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_mutation_targets_from_pat(elem, out, span);
            }
        }
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    swc_ecma_ast::ObjectPatProp::Assign(assign) => out.push(Mutation {
                        target: assign.key.id.sym.to_string(),
                        span,
                    }),
                    swc_ecma_ast::ObjectPatProp::KeyValue(key_value) => {
                        collect_mutation_targets_from_pat(&key_value.value, out, span);
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        collect_mutation_targets_from_pat(&rest.arg, out, span);
                    }
                }
            }
        }
        Pat::Assign(assign) => collect_mutation_targets_from_pat(&assign.left, out, span),
        Pat::Rest(rest) => collect_mutation_targets_from_pat(&rest.arg, out, span),
        Pat::Expr(expr) => match &**expr {
            Expr::Ident(ident) => out.push(Mutation {
                target: ident.sym.to_string(),
                span,
            }),
            Expr::Member(member) => {
                if let Some(name) = member_root_ident(member) {
                    out.push(Mutation {
                        target: name.to_string(),
                        span,
                    });
                }
            }
            _ => {}
        },
        Pat::Invalid(_) => {}
    }
}

fn member_root_ident(member: &MemberExpr) -> Option<&str> {
    match &*member.obj {
        Expr::Ident(ident) => Some(ident.sym.as_ref()),
        Expr::Member(inner) => member_root_ident(inner),
        _ => None,
    }
}

fn mutating_method_target(call: &swc_ecma_ast::CallExpr) -> Option<&str> {
    let Callee::Expr(callee) = &call.callee else {
        return None;
    };
    let Expr::Member(member) = &**callee else {
        return None;
    };
    let method = match &member.prop {
        MemberProp::Ident(ident) => ident.sym.as_ref(),
        MemberProp::Computed(computed) => match &*computed.expr {
            Expr::Lit(swc_ecma_ast::Lit::Str(value)) => value.value.as_str()?,
            _ => return None,
        },
        MemberProp::PrivateName(_) => return None,
    };

    if !matches!(
        method,
        "add"
            | "clear"
            | "copyWithin"
            | "delete"
            | "fill"
            | "pop"
            | "push"
            | "reverse"
            | "set"
            | "shift"
            | "sort"
            | "splice"
            | "unshift"
    ) {
        return None;
    }

    member_root_ident(member)
}

fn collect_jsx_refs(stmt: &Stmt, out: &mut HashSet<String>) {
    struct Finder<'a> {
        out: &'a mut HashSet<String>,
        in_jsx: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {}

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {}

        fn visit_jsx_element(&mut self, element: &swc_ecma_ast::JSXElement) {
            let prev = self.in_jsx;
            self.in_jsx = true;
            element.visit_children_with(self);
            self.in_jsx = prev;
        }

        fn visit_jsx_fragment(&mut self, fragment: &swc_ecma_ast::JSXFragment) {
            let prev = self.in_jsx;
            self.in_jsx = true;
            fragment.visit_children_with(self);
            self.in_jsx = prev;
        }

        fn visit_expr(&mut self, expr: &Expr) {
            if self.in_jsx {
                match expr {
                    Expr::Ident(ident) => {
                        self.out.insert(ident.sym.to_string());
                    }
                    Expr::Member(member) => {
                        if let Some(name) = member_root_ident(member) {
                            self.out.insert(name.to_string());
                        }
                    }
                    _ => {}
                }
            }
            expr.visit_children_with(self);
        }
    }

    stmt.visit_with(&mut Finder { out, in_jsx: false });
}

fn is_known_global(name: &str) -> bool {
    matches!(
        name,
        "globalThis"
            | "global"
            | "window"
            | "document"
            | "console"
            | "Math"
            | "Date"
            | "JSON"
            | "Number"
            | "String"
            | "Boolean"
            | "Object"
            | "Array"
            | "Map"
            | "Set"
            | "WeakMap"
            | "WeakSet"
            | "Promise"
            | "Symbol"
            | "Intl"
            | "Reflect"
            | "Proxy"
            | "RegExp"
            | "Error"
            | "TypeError"
            | "RangeError"
            | "URL"
            | "URLSearchParams"
            | "NaN"
            | "Infinity"
            | "undefined"
    )
}
