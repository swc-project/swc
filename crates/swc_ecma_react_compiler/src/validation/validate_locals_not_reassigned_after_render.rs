use std::collections::HashSet;

use swc_ecma_ast::{AssignExpr, AssignTarget, Expr, Pat, UpdateExpr};
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
