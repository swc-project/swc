use std::collections::HashSet;

use swc_ecma_ast::{
    ArrowExpr, BlockStmt, CallExpr, Callee, Decl, Expr, Function, Pat, Stmt, VarDeclKind,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

pub fn validate_no_eval_unsupported(hir: &HirFunction) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };

    #[derive(Default)]
    struct Finder {
        scope_stack: Vec<HashSet<String>>,
        errors: Vec<CompilerErrorDetail>,
    }

    impl Finder {
        fn is_shadowed(&self, name: &str) -> bool {
            self.scope_stack
                .iter()
                .rev()
                .any(|scope| scope.contains(name))
        }

        fn push_eval_unsupported(&mut self, span: swc_common::Span) {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::UnsupportedSyntax,
                "Compilation Skipped: The 'eval' function is not supported",
            );
            detail.description = Some(
                "Eval is an anti-pattern in JavaScript, and the code executed cannot be evaluated \
                 by React Compiler."
                    .into(),
            );
            detail.loc = Some(span);
            self.errors.push(detail);
        }

        fn with_scope(&mut self, scope: HashSet<String>, f: impl FnOnce(&mut Self)) {
            self.scope_stack.push(scope);
            f(self);
            self.scope_stack.pop();
        }
    }

    impl Visit for Finder {
        fn visit_call_expr(&mut self, call: &CallExpr) {
            if let Callee::Expr(callee_expr) = &call.callee {
                if let Expr::Ident(callee) = &**callee_expr {
                    if callee.sym == "eval" && !self.is_shadowed("eval") {
                        self.push_eval_unsupported(call.span);
                    }
                }
            }
            call.visit_children_with(self);
        }

        fn visit_fn_expr(&mut self, fn_expr: &swc_ecma_ast::FnExpr) {
            let mut scope = HashSet::new();
            if let Some(ident) = &fn_expr.ident {
                scope.insert(ident.sym.to_string());
            }

            self.with_scope(scope, |finder| {
                fn_expr.function.visit_with(finder);
            });
        }

        fn visit_function(&mut self, function: &Function) {
            let mut scope = HashSet::new();
            for param in &function.params {
                collect_pat_bindings(&param.pat, &mut scope);
            }
            if let Some(body) = &function.body {
                collect_function_scoped_bindings(body, &mut scope);
            }

            self.with_scope(scope, |finder| {
                if let Some(body) = &function.body {
                    body.visit_with(finder);
                }
            });
        }

        fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
            let mut scope = HashSet::new();
            for param in &arrow.params {
                collect_pat_bindings(param, &mut scope);
            }
            if let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) = &*arrow.body {
                collect_function_scoped_bindings(block, &mut scope);
            }

            self.with_scope(scope, |finder| {
                arrow.body.visit_with(finder);
            });
        }

        fn visit_block_stmt(&mut self, block: &BlockStmt) {
            let mut lexical_scope = HashSet::new();
            collect_block_lexical_bindings(block, &mut lexical_scope);

            self.with_scope(lexical_scope, |finder| {
                block.visit_children_with(finder);
            });
        }

        fn visit_catch_clause(&mut self, catch: &swc_ecma_ast::CatchClause) {
            let mut scope = HashSet::new();
            if let Some(param) = &catch.param {
                collect_pat_bindings(param, &mut scope);
            }

            self.with_scope(scope, |finder| {
                catch.body.visit_with(finder);
            });
        }
    }

    let mut finder = Finder::default();
    let mut root_scope = HashSet::new();
    if let Some(id) = &hir.id {
        root_scope.insert(id.sym.to_string());
    }
    for param in &hir.function.params {
        collect_pat_bindings(&param.pat, &mut root_scope);
    }
    collect_function_scoped_bindings(body, &mut root_scope);

    finder.with_scope(root_scope, |finder| {
        body.visit_with(finder);
    });

    if finder.errors.is_empty() {
        Ok(())
    } else {
        Err(CompilerError {
            details: finder.errors,
        })
    }
}

fn collect_function_scoped_bindings(block: &BlockStmt, out: &mut HashSet<String>) {
    for stmt in &block.stmts {
        collect_function_scoped_bindings_in_stmt(stmt, out);
    }
}

fn collect_function_scoped_bindings_in_stmt(stmt: &Stmt, out: &mut HashSet<String>) {
    match stmt {
        Stmt::Decl(Decl::Var(var_decl)) if var_decl.kind == VarDeclKind::Var => {
            for decl in &var_decl.decls {
                collect_pat_bindings(&decl.name, out);
            }
        }
        Stmt::Block(block) => collect_function_scoped_bindings(block, out),
        Stmt::If(if_stmt) => {
            collect_function_scoped_bindings_in_stmt(&if_stmt.cons, out);
            if let Some(alt) = &if_stmt.alt {
                collect_function_scoped_bindings_in_stmt(alt, out);
            }
        }
        Stmt::Labeled(labeled) => collect_function_scoped_bindings_in_stmt(&labeled.body, out),
        Stmt::With(with_stmt) => collect_function_scoped_bindings_in_stmt(&with_stmt.body, out),
        Stmt::For(for_stmt) => {
            if let Some(swc_ecma_ast::VarDeclOrExpr::VarDecl(var_decl)) = &for_stmt.init {
                if var_decl.kind == VarDeclKind::Var {
                    for decl in &var_decl.decls {
                        collect_pat_bindings(&decl.name, out);
                    }
                }
            }
            collect_function_scoped_bindings_in_stmt(&for_stmt.body, out);
        }
        Stmt::ForIn(for_in_stmt) => {
            if let swc_ecma_ast::ForHead::VarDecl(var_decl) = &for_in_stmt.left {
                if var_decl.kind == VarDeclKind::Var {
                    for decl in &var_decl.decls {
                        collect_pat_bindings(&decl.name, out);
                    }
                }
            }
            collect_function_scoped_bindings_in_stmt(&for_in_stmt.body, out);
        }
        Stmt::ForOf(for_of_stmt) => {
            if let swc_ecma_ast::ForHead::VarDecl(var_decl) = &for_of_stmt.left {
                if var_decl.kind == VarDeclKind::Var {
                    for decl in &var_decl.decls {
                        collect_pat_bindings(&decl.name, out);
                    }
                }
            }
            collect_function_scoped_bindings_in_stmt(&for_of_stmt.body, out);
        }
        Stmt::While(while_stmt) => collect_function_scoped_bindings_in_stmt(&while_stmt.body, out),
        Stmt::DoWhile(do_while_stmt) => {
            collect_function_scoped_bindings_in_stmt(&do_while_stmt.body, out);
        }
        Stmt::Switch(switch_stmt) => {
            for case in &switch_stmt.cases {
                for stmt in &case.cons {
                    collect_function_scoped_bindings_in_stmt(stmt, out);
                }
            }
        }
        Stmt::Try(try_stmt) => {
            collect_function_scoped_bindings(&try_stmt.block, out);
            if let Some(handler) = &try_stmt.handler {
                collect_function_scoped_bindings(&handler.body, out);
            }
            if let Some(finalizer) = &try_stmt.finalizer {
                collect_function_scoped_bindings(finalizer, out);
            }
        }
        _ => {}
    }
}

fn collect_block_lexical_bindings(block: &BlockStmt, out: &mut HashSet<String>) {
    for stmt in &block.stmts {
        let Stmt::Decl(decl) = stmt else {
            continue;
        };

        match decl {
            Decl::Var(var_decl) if var_decl.kind != VarDeclKind::Var => {
                for declarator in &var_decl.decls {
                    collect_pat_bindings(&declarator.name, out);
                }
            }
            Decl::Fn(fn_decl) => {
                out.insert(fn_decl.ident.sym.to_string());
            }
            Decl::Class(class_decl) => {
                out.insert(class_decl.ident.sym.to_string());
            }
            _ => {}
        }
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
        _ => {}
    }
}
