// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

use react_compiler_hir::environment::is_react_like_name;
use swc_ecma_ast as swc;
use swc_ecma_visit::{Visit, VisitWith};

/// Whether the program contains a component or hook candidate.
pub fn has_react_like_functions(program: &swc::Program) -> bool {
    let mut visitor = ReactLikeVisitor {
        found: false,
        current_name: None,
    };
    program.visit_with(&mut visitor);
    visitor.found
}

/// Whether the program contains `using` or `await using` declarations.
pub fn has_resource_management_declarations(program: &swc::Program) -> bool {
    let mut visitor = ResourceManagementVisitor { found: false };
    program.visit_with(&mut visitor);
    visitor.found
}

/// `memo`/`forwardRef` wrappers mark callback functions as component-like even
/// when the callback itself is anonymous.
fn is_component_wrapper(callee: &swc::Callee) -> bool {
    let is_wrapper = |name: &str| matches!(name, "memo" | "forwardRef");
    match callee {
        swc::Callee::Expr(expr) => match &**expr {
            swc::Expr::Ident(id) => is_wrapper(&id.sym),
            swc::Expr::Member(member) => match &member.prop {
                swc::MemberProp::Ident(prop) => is_wrapper(&prop.sym),
                _ => false,
            },
            _ => false,
        },
        _ => false,
    }
}

struct ReactLikeVisitor {
    found: bool,
    current_name: Option<String>,
}

struct ResourceManagementVisitor {
    found: bool,
}

impl Visit for ResourceManagementVisitor {
    fn visit_var_decl(&mut self, decl: &swc::VarDecl) {
        if self.found {
            return;
        }
        decl.visit_children_with(self);
    }

    fn visit_using_decl(&mut self, decl: &swc::UsingDecl) {
        if self.found {
            return;
        }
        self.found = true;
        let _ = decl;
    }
}

impl Visit for ReactLikeVisitor {
    fn visit_var_declarator(&mut self, decl: &swc::VarDeclarator) {
        if self.found {
            return;
        }

        let name = match &decl.name {
            swc::Pat::Ident(ident) => Some(ident.id.sym.to_string()),
            _ => None,
        };

        let prev_name = self.current_name.take();
        self.current_name = name;

        if let Some(init) = &decl.init {
            init.visit_with(self);
        }

        self.current_name = prev_name;
    }

    fn visit_assign_expr(&mut self, expr: &swc::AssignExpr) {
        if self.found {
            return;
        }

        let name = match &expr.left {
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::Ident(ident)) => {
                Some(ident.id.sym.to_string())
            }
            _ => None,
        };

        let prev_name = self.current_name.take();
        self.current_name = name;

        expr.right.visit_with(self);

        self.current_name = prev_name;
    }

    fn visit_fn_decl(&mut self, decl: &swc::FnDecl) {
        if self.found {
            return;
        }

        if is_react_like_name(&decl.ident.sym) {
            self.found = true;
        }

        // Do not traverse into function bodies.
    }

    fn visit_fn_expr(&mut self, expr: &swc::FnExpr) {
        if self.found {
            return;
        }

        if let Some(id) = &expr.ident {
            if is_react_like_name(&id.sym) {
                self.found = true;
                return;
            }
        }

        if expr.ident.is_none() {
            if let Some(name) = &self.current_name {
                if is_react_like_name(name) {
                    self.found = true;
                }
            }
        }

        // Do not traverse into function bodies.
    }

    fn visit_arrow_expr(&mut self, expr: &swc::ArrowExpr) {
        if self.found {
            return;
        }

        if let Some(name) = &self.current_name {
            if is_react_like_name(name) {
                self.found = true;
                return;
            }
        }

        // Do not traverse into function bodies.
        let _ = expr;
    }

    fn visit_call_expr(&mut self, call: &swc::CallExpr) {
        if self.found {
            return;
        }

        if is_component_wrapper(&call.callee)
            && call
                .args
                .iter()
                .any(|arg| matches!(&*arg.expr, swc::Expr::Fn(_) | swc::Expr::Arrow(_)))
        {
            self.found = true;
            return;
        }

        call.visit_children_with(self);
    }

    fn visit_class(&mut self, class: &swc::Class) {
        // Skip class bodies entirely.
        let _ = class;
    }
}
