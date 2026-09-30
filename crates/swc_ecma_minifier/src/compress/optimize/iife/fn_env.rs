use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

/// Check both bindings in one traversal before removing an ordinary IIFE's
/// function environment. Arrows inherit these bindings, so visit their bodies
/// and parameters, but stop at ordinary functions and class initializer scopes.
pub(super) fn contains_this_or_new_target(body: &FunctionBody) -> bool {
    let mut visitor = FnEnvFinder::default();
    body.visit_with(&mut visitor);
    visitor.found
}

#[derive(Default)]
struct FnEnvFinder {
    found: bool,
}

impl Visit for FnEnvFinder {
    noop_visit_type!();

    fn visit_expr(&mut self, expr: &Expr) {
        if self.found {
            return;
        }

        match expr {
            Expr::This(_)
            | Expr::MetaProp(MetaPropExpr {
                kind: MetaPropKind::NewTarget,
                ..
            }) => self.found = true,
            _ => expr.visit_children_with(self),
        }
    }

    fn visit_stmt(&mut self, stmt: &Stmt) {
        if !self.found {
            stmt.visit_children_with(self);
        }
    }

    fn visit_function(&mut self, _: &Function) {}

    fn visit_constructor(&mut self, _: &Constructor) {}

    // Class computed keys and heritage use the enclosing function environment;
    // field initializers and static blocks provide their own this/new.target.
    fn visit_class_prop(&mut self, prop: &ClassProp) {
        prop.key.visit_with(self);
    }

    fn visit_private_prop(&mut self, _: &PrivateProp) {}

    fn visit_auto_accessor(&mut self, prop: &AutoAccessor) {
        prop.key.visit_with(self);
    }

    fn visit_static_block(&mut self, _: &StaticBlock) {}
}
