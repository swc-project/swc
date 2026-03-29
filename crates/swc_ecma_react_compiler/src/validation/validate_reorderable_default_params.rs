use std::collections::HashSet;

use swc_common::Spanned;
use swc_ecma_ast::{ArrowExpr, Expr, Function, Pat};
use swc_ecma_visit::{Visit, VisitWith};

use crate::error::{CompilerError, CompilerErrorDetail, ErrorCategory};

const DEFAULT_PARAM_REORDER_TODO_REASON: &str =
    "Todo: (BuildHIR::node.lowerReorderableExpression) Expression type `ArrowFunctionExpression` \
     cannot be safely reordered";

pub fn validate_reorderable_default_params(function: &Function) -> Result<(), CompilerError> {
    if function.params.is_empty() {
        return Ok(());
    }

    let mut all_param_names = HashSet::new();
    for param in &function.params {
        collect_pat_bindings(&param.pat, &mut all_param_names);
    }

    let mut errors = Vec::new();

    for param in &function.params {
        let Pat::Assign(assign_pat) = &param.pat else {
            continue;
        };

        let expr = &*assign_pat.right;
        if !matches!(expr, Expr::Arrow(_) | Expr::Fn(_)) {
            continue;
        }

        let mut outer_names = all_param_names.clone();
        let mut current_param_names = HashSet::new();
        collect_pat_bindings(&assign_pat.left, &mut current_param_names);
        for name in current_param_names {
            outer_names.remove(name.as_str());
        }

        if captures_outer_names(expr, &outer_names) {
            let mut detail =
                CompilerErrorDetail::error(ErrorCategory::Todo, DEFAULT_PARAM_REORDER_TODO_REASON);
            detail.loc = Some(assign_pat.right.span());
            errors.push(detail);
        }
    }

    if errors.is_empty() {
        Ok(())
    } else {
        Err(CompilerError { details: errors })
    }
}

fn captures_outer_names(expr: &Expr, outer_names: &HashSet<String>) -> bool {
    struct Finder<'a> {
        outer_names: &'a HashSet<String>,
        shadowed: HashSet<String>,
        found: bool,
    }

    impl Finder<'_> {
        fn is_shadowed(&self, name: &str) -> bool {
            self.shadowed.contains(name)
        }
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_ident(&mut self, ident: &swc_ecma_ast::Ident) {
            if self.found {
                return;
            }
            let name = ident.sym.as_ref();
            if self.outer_names.contains(name) && !self.is_shadowed(name) {
                self.found = true;
            }
        }
    }

    match expr {
        Expr::Arrow(arrow) => {
            let mut shadowed = HashSet::new();
            for param in &arrow.params {
                collect_pat_bindings(param, &mut shadowed);
            }
            if let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(body) = &*arrow.body {
                collect_block_bindings(body, &mut shadowed);
                let mut finder = Finder {
                    outer_names,
                    shadowed,
                    found: false,
                };
                body.visit_with(&mut finder);
                finder.found
            } else {
                let mut finder = Finder {
                    outer_names,
                    shadowed,
                    found: false,
                };
                arrow.body.visit_with(&mut finder);
                finder.found
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
                    outer_names,
                    shadowed,
                    found: false,
                };
                body.visit_with(&mut finder);
                finder.found
            } else {
                false
            }
        }
        _ => false,
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

fn collect_block_bindings(block: &swc_ecma_ast::BlockStmt, out: &mut HashSet<String>) {
    struct Finder<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &Function) {
            // Do not include bindings from nested functions.
        }

        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Do not include bindings from nested functions.
        }

        fn visit_var_declarator(&mut self, decl: &swc_ecma_ast::VarDeclarator) {
            collect_pat_bindings(&decl.name, self.out);
            decl.visit_children_with(self);
        }

        fn visit_fn_decl(&mut self, decl: &swc_ecma_ast::FnDecl) {
            self.out.insert(decl.ident.sym.to_string());
        }

        fn visit_class_decl(&mut self, decl: &swc_ecma_ast::ClassDecl) {
            self.out.insert(decl.ident.sym.to_string());
        }
    }

    block.visit_with(&mut Finder { out });
}
