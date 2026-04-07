// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

use react_compiler_hir::environment::is_react_like_name;
use swc_ecma_ast::{
    ArrowExpr, AssignExpr, AssignTarget, CallExpr, Callee, Class, ExportDefaultDecl,
    ExportDefaultExpr, Expr, FnDecl, FnExpr, MemberProp, Module, Pat, SimpleAssignTarget, Stmt,
    VarDeclarator,
};
use swc_ecma_visit::{Visit, VisitWith};

/// Checks if a module contains React-like functions (components or hooks).
///
/// A React-like function is one whose name:
/// - Starts with an uppercase letter (component convention)
/// - Matches the pattern `use[A-Z0-9]` (hook convention)
pub fn has_react_like_functions(module: &Module) -> bool {
    let mut visitor = ReactLikeVisitor::default();
    visitor.visit_module(module);
    visitor.found
}

fn is_hook_like_name(name: &str) -> bool {
    name.starts_with("use") && is_react_like_name(name)
}

#[derive(Default)]
struct ReactLikeVisitor {
    found: bool,
    current_name: Option<String>,
    is_interested: bool,
}

impl Visit for ReactLikeVisitor {
    fn visit_callee(&mut self, callee: &Callee) {
        if self.is_interested {
            if let Callee::Expr(expr) = callee {
                if let Expr::Ident(ident) = &**expr {
                    if ident.sym.starts_with("use") {
                        self.found = true;
                        return;
                    }
                }
            }
        }

        callee.visit_children_with(self);
    }

    fn visit_var_declarator(&mut self, decl: &VarDeclarator) {
        if self.found {
            return;
        }

        let name = match &decl.name {
            Pat::Ident(binding_ident) => Some(binding_ident.id.sym.to_string()),
            _ => None,
        };

        let prev_name = self.current_name.take();
        let prev_interested = self.is_interested;
        self.current_name = name;
        if matches!(decl.init.as_deref(), Some(Expr::Fn(..) | Expr::Arrow(..))) {
            self.is_interested =
                prev_interested || self.current_name.as_deref().is_some_and(is_react_like_name);
        }

        if let Some(init) = &decl.init {
            self.visit_expr(init);
        }

        self.current_name = prev_name;
        self.is_interested = prev_interested;
    }

    fn visit_assign_expr(&mut self, expr: &AssignExpr) {
        if self.found {
            return;
        }

        let name = match &expr.left {
            AssignTarget::Simple(SimpleAssignTarget::Ident(binding_ident)) => {
                Some(binding_ident.id.sym.to_string())
            }
            _ => None,
        };

        let prev_name = self.current_name.take();
        let prev_interested = self.is_interested;
        self.current_name = name;
        if matches!(&*expr.right, Expr::Fn(..) | Expr::Arrow(..)) {
            self.is_interested =
                prev_interested || self.current_name.as_deref().is_some_and(is_react_like_name);
        }

        self.visit_expr(&expr.right);

        self.current_name = prev_name;
        self.is_interested = prev_interested;
    }

    fn visit_fn_decl(&mut self, decl: &FnDecl) {
        if self.found {
            return;
        }

        if is_hook_like_name(&decl.ident.sym) {
            self.found = true;
            return;
        }

        let prev_interested = self.is_interested;
        self.is_interested = is_react_like_name(&decl.ident.sym);

        decl.visit_children_with(self);

        self.is_interested = prev_interested;
    }

    fn visit_fn_expr(&mut self, expr: &FnExpr) {
        if self.found {
            return;
        }

        if expr
            .ident
            .as_ref()
            .is_some_and(|ident| is_hook_like_name(&ident.sym))
            || expr.ident.is_none() && self.current_name.as_deref().is_some_and(is_hook_like_name)
        {
            self.found = true;
            return;
        }

        let prev_interested = self.is_interested;
        self.is_interested = self.is_interested
            || expr
                .ident
                .as_ref()
                .is_some_and(|ident| is_react_like_name(&ident.sym))
            || expr.ident.is_none() && self.current_name.as_deref().is_some_and(is_react_like_name);

        expr.visit_children_with(self);

        self.is_interested = prev_interested;
    }

    fn visit_arrow_expr(&mut self, expr: &ArrowExpr) {
        if self.found {
            return;
        }

        if self.current_name.as_deref().is_some_and(is_hook_like_name) {
            self.found = true;
            return;
        }

        let prev_interested = self.is_interested;
        self.is_interested =
            self.is_interested || self.current_name.as_deref().is_some_and(is_react_like_name);

        expr.visit_children_with(self);

        self.is_interested = prev_interested;
    }

    fn visit_call_expr(&mut self, call: &CallExpr) {
        if self.found {
            return;
        }

        if is_memo_or_forward_ref_call(call)
            && (self.is_interested || self.current_name.as_deref().is_some_and(is_react_like_name))
        {
            if let Some(first_arg) = call.args.first() {
                if matches!(&*first_arg.expr, Expr::Fn(_) | Expr::Arrow(_)) {
                    self.found = true;
                    return;
                }
            }
        }

        call.visit_children_with(self);
    }

    fn visit_class(&mut self, _class: &Class) {
        // Skip class bodies entirely.
    }

    fn visit_export_default_decl(&mut self, export: &ExportDefaultDecl) {
        let prev_interested = self.is_interested;
        self.is_interested = true;

        export.visit_children_with(self);

        self.is_interested = prev_interested;
    }

    fn visit_export_default_expr(&mut self, export: &ExportDefaultExpr) {
        let prev_interested = self.is_interested;
        self.is_interested = true;

        export.visit_children_with(self);

        self.is_interested = prev_interested;
    }

    fn visit_expr(&mut self, expr: &Expr) {
        if self.found {
            return;
        }

        if self.is_interested
            && matches!(
                expr,
                Expr::JSXMember(..)
                    | Expr::JSXNamespacedName(..)
                    | Expr::JSXEmpty(..)
                    | Expr::JSXElement(..)
                    | Expr::JSXFragment(..)
            )
        {
            self.found = true;
            return;
        }

        expr.visit_children_with(self);
    }

    fn visit_stmt(&mut self, stmt: &Stmt) {
        if self.found {
            return;
        }

        stmt.visit_children_with(self);
    }
}

fn is_memo_or_forward_ref_call(call: &CallExpr) -> bool {
    match &call.callee {
        Callee::Expr(expr) => match &**expr {
            // Direct calls: memo(...) or forwardRef(...)
            Expr::Ident(ident) => ident.sym == "memo" || ident.sym == "forwardRef",
            // Member expression: React.memo(...) or React.forwardRef(...)
            Expr::Member(member) => {
                if let Expr::Ident(obj) = &*member.obj {
                    if obj.sym == "React" {
                        if let MemberProp::Ident(prop) = &member.prop {
                            return prop.sym == "memo" || prop.sym == "forwardRef";
                        }
                    }
                }
                false
            }
            _ => false,
        },
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_react_like_name() {
        assert!(is_react_like_name("Component"));
        assert!(is_react_like_name("MyComponent"));
        assert!(is_react_like_name("A"));
        assert!(is_react_like_name("useState"));
        assert!(is_react_like_name("useEffect"));
        assert!(is_react_like_name("use0"));

        assert!(!is_react_like_name("component"));
        assert!(!is_react_like_name("myFunction"));
        assert!(!is_react_like_name("use"));
        assert!(!is_react_like_name("user"));
        assert!(!is_react_like_name("useful"));
        assert!(!is_react_like_name(""));
    }
}
