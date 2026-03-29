use std::collections::HashSet;

use swc_ecma_ast::{
    AssignExpr, AssignTarget, CallExpr, Callee, Decl, Expr, MemberExpr, MemberProp, Pat, Stmt,
    VarDeclKind,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

/// Best-effort validation that flags freezing callbacks that mutate
/// render-local values. This is a conservative subset of upstream behavior.
pub fn validate_no_freezing_known_mutable_functions(
    hir: &HirFunction,
) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };

    let mut render_locals = HashSet::<String>::new();
    for param in &hir.function.params {
        collect_pat_bindings(&param.pat, &mut render_locals);
    }
    for stmt in &body.stmts {
        collect_stmt_bindings(stmt, &mut render_locals);
    }

    let mut mutable_callbacks = HashSet::<String>::new();
    for stmt in &body.stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        if !matches!(var_decl.kind, VarDeclKind::Const | VarDeclKind::Let) {
            continue;
        }
        for decl in &var_decl.decls {
            let Pat::Ident(binding) = &decl.name else {
                continue;
            };
            let Some(init) = &decl.init else {
                continue;
            };
            if !matches!(&**init, Expr::Arrow(_) | Expr::Fn(_)) {
                continue;
            }

            if function_like_mutates_any_render_local(init, &render_locals) {
                mutable_callbacks.insert(binding.id.sym.to_string());
            }
        }
    }

    #[derive(Default)]
    struct Finder {
        mutable_callbacks: HashSet<String>,
        errors: Vec<CompilerErrorDetail>,
    }

    impl Visit for Finder {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {
            // Skip nested functions; only validate the outer render body.
        }

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            // Skip nested functions; only validate the outer render body.
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if !is_object_freeze_call(call) {
                call.visit_children_with(self);
                return;
            }

            let Some(first) = call.args.first() else {
                return;
            };
            let Expr::Ident(ident) = &*first.expr else {
                return;
            };
            if !self.mutable_callbacks.contains(ident.sym.as_ref()) {
                return;
            }

            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                "Cannot modify local variables after render completes",
            );
            detail.description = Some(format!(
                "This argument is a function which may reassign or mutate `{}` after render, \
                 which can cause inconsistent behavior on subsequent renders. Consider using \
                 state instead.",
                ident.sym
            ));
            detail.loc = Some(call.span);
            self.errors.push(detail);
        }
    }

    let mut finder = Finder {
        mutable_callbacks,
        ..Default::default()
    };
    body.visit_with(&mut finder);

    if finder.errors.is_empty() {
        Ok(())
    } else {
        Err(CompilerError {
            details: finder.errors,
        })
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

fn collect_stmt_bindings(stmt: &Stmt, out: &mut HashSet<String>) {
    match stmt {
        Stmt::Decl(Decl::Var(var_decl)) => {
            for decl in &var_decl.decls {
                collect_pat_bindings(&decl.name, out);
            }
        }
        Stmt::Decl(Decl::Fn(fn_decl)) => {
            out.insert(fn_decl.ident.sym.to_string());
        }
        _ => {}
    }
}

fn function_like_mutates_any_render_local(expr: &Expr, render_locals: &HashSet<String>) -> bool {
    struct Finder<'a> {
        render_locals: &'a HashSet<String>,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {
            // Do not recurse into nested function declarations/expressions.
        }

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            // Do not recurse into nested arrows.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if self.found {
                return;
            }

            match &assign.left {
                AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(binding)) => {
                    if self.render_locals.contains(binding.id.sym.as_ref()) {
                        self.found = true;
                        return;
                    }
                }
                AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Member(member)) => {
                    if member_targets_render_local(member, self.render_locals) {
                        self.found = true;
                        return;
                    }
                }
                _ => {}
            }
            assign.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        render_locals,
        found: false,
    };
    expr.visit_with(&mut finder);
    finder.found
}

fn member_targets_render_local(member: &MemberExpr, render_locals: &HashSet<String>) -> bool {
    let Expr::Ident(obj) = &*member.obj else {
        return false;
    };
    if !render_locals.contains(obj.sym.as_ref()) {
        return false;
    }
    matches!(
        &member.prop,
        MemberProp::Ident(_) | MemberProp::Computed(_) | MemberProp::PrivateName(_)
    )
}

fn is_object_freeze_call(call: &CallExpr) -> bool {
    let Callee::Expr(callee) = &call.callee else {
        return false;
    };
    let Expr::Member(member) = &**callee else {
        return false;
    };
    let Expr::Ident(object) = &*member.obj else {
        return false;
    };
    let MemberProp::Ident(prop) = &member.prop else {
        return false;
    };

    object.sym == "Object" && prop.sym == "freeze"
}
