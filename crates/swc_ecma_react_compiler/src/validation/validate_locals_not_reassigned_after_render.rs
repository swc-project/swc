use std::collections::HashSet;

use swc_ecma_ast::{ArrowExpr, AssignExpr, AssignTarget, Expr, Function, Pat, UpdateExpr};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

pub fn validate_locals_not_reassigned_after_render(hir: &HirFunction) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };

    let mut locals = HashSet::<String>::new();
    for param in &hir.function.params {
        collect_pat_bindings(&param.pat, &mut locals);
    }
    collect_block_bindings(body, &mut locals);
    let render_locals = locals.clone();

    #[derive(Default)]
    struct Finder {
        locals: HashSet<String>,
        nested_async_depth: usize,
        errors: Vec<CompilerErrorDetail>,
    }

    impl Finder {
        fn push_reassign(&mut self, span: swc_common::Span, name: &str) {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                "Cannot reassign variable in async function",
            );
            detail.description = Some(format!(
                "Reassigning a variable in an async function can cause inconsistent behavior on \
                 subsequent renders. Consider using state instead. Cannot reassign `{name}`."
            ));
            detail.loc = Some(span);
            self.errors.push(detail);
        }
    }

    impl Visit for Finder {
        fn visit_function(&mut self, function: &swc_ecma_ast::Function) {
            if function.is_async {
                self.nested_async_depth += 1;
            }
            function.visit_children_with(self);
            if function.is_async {
                self.nested_async_depth -= 1;
            }
        }

        fn visit_arrow_expr(&mut self, arrow: &swc_ecma_ast::ArrowExpr) {
            if arrow.is_async {
                self.nested_async_depth += 1;
            }
            arrow.visit_children_with(self);
            if arrow.is_async {
                self.nested_async_depth -= 1;
            }
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if self.nested_async_depth > 0 {
                if let AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(binding)) =
                    &assign.left
                {
                    let name = binding.id.sym.as_ref();
                    if self.locals.contains(name) {
                        self.push_reassign(assign.span, name);
                    }
                }
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &UpdateExpr) {
            if self.nested_async_depth > 0 {
                if let Expr::Ident(ident) = &*update.arg {
                    let name = ident.sym.as_ref();
                    if self.locals.contains(name) {
                        self.push_reassign(update.span, name);
                    }
                }
            }
            update.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        locals,
        ..Default::default()
    };
    body.visit_with(&mut finder);
    finder
        .errors
        .extend(find_self_reassigning_function_initializers(
            body,
            &render_locals,
        ));

    if finder.errors.is_empty() {
        Ok(())
    } else {
        Err(CompilerError {
            details: finder.errors,
        })
    }
}

fn find_self_reassigning_function_initializers(
    body: &swc_ecma_ast::BlockStmt,
    render_locals: &HashSet<String>,
) -> Vec<CompilerErrorDetail> {
    let mut errors = Vec::new();

    for stmt in &body.stmts {
        let swc_ecma_ast::Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) = stmt else {
            continue;
        };

        for decl in &var_decl.decls {
            let Pat::Ident(binding) = &decl.name else {
                continue;
            };
            let Some(init) = &decl.init else {
                continue;
            };

            if let Some(span) =
                function_initializer_self_reassign_span(init, binding.id.sym.as_ref())
            {
                let mut detail = CompilerErrorDetail::error(
                    ErrorCategory::Immutability,
                    "Cannot reassign variable after render completes",
                );
                detail.description = Some(format!(
                    "Reassigning `{}` after render has completed can cause inconsistent behavior \
                     on subsequent renders. Consider using state instead.",
                    binding.id.sym
                ));
                detail.loc = Some(span);
                errors.push(detail);
            }
        }

        continue;
    }

    for stmt in &body.stmts {
        let swc_ecma_ast::Stmt::Decl(swc_ecma_ast::Decl::Fn(fn_decl)) = stmt else {
            continue;
        };
        if let Some((span, name)) =
            function_reassigns_outer_binding_span(&fn_decl.function, render_locals)
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                "Cannot reassign variable after render completes",
            );
            detail.description = Some(format!(
                "Reassigning `{name}` after render has completed can cause inconsistent behavior \
                 on subsequent renders. Consider using state instead."
            ));
            detail.loc = Some(span);
            errors.push(detail);
        }
    }

    errors
}

fn function_initializer_self_reassign_span(init: &Expr, target: &str) -> Option<swc_common::Span> {
    struct Finder<'a> {
        target: &'a str,
        shadowed: HashSet<String>,
        found: Option<swc_common::Span>,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if self.found.is_some() {
                return;
            }
            if let AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(binding)) =
                &assign.left
            {
                let name = binding.id.sym.as_ref();
                if name == self.target && !self.shadowed.contains(name) {
                    self.found = Some(assign.span);
                    return;
                }
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &UpdateExpr) {
            if self.found.is_some() {
                return;
            }
            if let Expr::Ident(ident) = &*update.arg {
                let name = ident.sym.as_ref();
                if name == self.target && !self.shadowed.contains(name) {
                    self.found = Some(update.span);
                    return;
                }
            }
            update.visit_children_with(self);
        }
    }

    match init {
        Expr::Arrow(arrow) => {
            let mut shadowed = HashSet::new();
            for param in &arrow.params {
                collect_pat_bindings(param, &mut shadowed);
            }
            if let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(body) = &*arrow.body {
                collect_block_bindings(body, &mut shadowed);
                let mut finder = Finder {
                    target,
                    shadowed,
                    found: None,
                };
                body.visit_with(&mut finder);
                finder.found
            } else {
                None
            }
        }
        Expr::Fn(fn_expr) => {
            let mut shadowed = HashSet::new();
            for param in &fn_expr.function.params {
                collect_pat_bindings(&param.pat, &mut shadowed);
            }
            if let Some(body) = &fn_expr.function.body {
                collect_block_bindings(body, &mut shadowed);
                let mut finder = Finder {
                    target,
                    shadowed,
                    found: None,
                };
                body.visit_with(&mut finder);
                finder.found
            } else {
                None
            }
        }
        _ => None,
    }
}

fn function_reassigns_outer_binding_span(
    function: &Function,
    render_locals: &HashSet<String>,
) -> Option<(swc_common::Span, String)> {
    let mut shadowed = HashSet::new();
    for param in &function.params {
        collect_pat_bindings(&param.pat, &mut shadowed);
    }
    if let Some(body) = &function.body {
        collect_block_bindings(body, &mut shadowed);
    } else {
        return None;
    }

    struct Finder<'a> {
        render_locals: &'a HashSet<String>,
        shadowed: &'a HashSet<String>,
        found: Option<(swc_common::Span, String)>,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if self.found.is_some() {
                return;
            }
            if let AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(binding)) =
                &assign.left
            {
                let name = binding.id.sym.as_ref();
                if self.render_locals.contains(name) && !self.shadowed.contains(name) {
                    self.found = Some((assign.span, name.to_string()));
                    return;
                }
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &UpdateExpr) {
            if self.found.is_some() {
                return;
            }
            if let Expr::Ident(ident) = &*update.arg {
                let name = ident.sym.as_ref();
                if self.render_locals.contains(name) && !self.shadowed.contains(name) {
                    self.found = Some((update.span, name.to_string()));
                    return;
                }
            }
            update.visit_children_with(self);
        }
    }

    let body = function.body.as_ref().expect("checked above");
    let mut finder = Finder {
        render_locals,
        shadowed: &shadowed,
        found: None,
    };
    body.visit_with(&mut finder);
    finder.found
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
            // Do not include bindings from nested functions.
        }

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            // Do not include bindings from nested functions.
        }

        fn visit_var_declarator(&mut self, decl: &swc_ecma_ast::VarDeclarator) {
            collect_pat_bindings(&decl.name, self.out);
            decl.visit_children_with(self);
        }

        fn visit_fn_decl(&mut self, decl: &swc_ecma_ast::FnDecl) {
            self.out.insert(decl.ident.sym.to_string());
        }
    }

    block.visit_with(&mut Finder { out });
}
