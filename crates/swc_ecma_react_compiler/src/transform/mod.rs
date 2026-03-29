use swc_ecma_ast::{Decl, Expr, FnExpr, Pat, Stmt, VarDeclarator};
use swc_ecma_visit::{VisitMut, VisitMutWith};

use crate::hir::HirFunction;

/// React function kind used by compile selection and lowering.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ReactFunctionType {
    Component,
    Hook,
    Other,
}

/// Assigns stable names to anonymous function expressions where a local binding
/// name exists (e.g. `const foo = function () {}` -> `const foo = function
/// foo(){}`).
pub fn name_anonymous_functions(hir: &mut HirFunction) {
    let Some(body) = &mut hir.function.body else {
        return;
    };

    struct NameAnonymousFunctions;

    impl NameAnonymousFunctions {
        fn maybe_name_from_binding(decl: &mut VarDeclarator) {
            let Pat::Ident(binding) = &decl.name else {
                return;
            };
            let Some(init) = &mut decl.init else {
                return;
            };
            let Expr::Fn(FnExpr { ident, .. }) = &mut **init else {
                return;
            };
            if ident.is_none() {
                *ident = Some(binding.id.clone());
            }
        }
    }

    impl VisitMut for NameAnonymousFunctions {
        fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
            if let Stmt::Decl(Decl::Var(var_decl)) = stmt {
                for decl in &mut var_decl.decls {
                    Self::maybe_name_from_binding(decl);
                }
            }
            stmt.visit_mut_children_with(self);
        }
    }

    let mut pass = NameAnonymousFunctions;
    body.visit_mut_with(&mut pass);
}
