use swc_ecma_ast::{CallExpr, Callee, Expr, MemberProp};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

/// Validates that obviously impure builtins are not called during render.
///
/// This pass is intentionally conservative and only checks known builtins that
/// are covered by upstream fixtures.
pub fn validate_no_impure_functions_in_render(hir: &HirFunction) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };

    #[derive(Default)]
    struct Finder {
        errors: Vec<CompilerErrorDetail>,
    }

    impl Finder {
        fn push(&mut self, call: &CallExpr, callee_name: &str) {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Purity,
                "Cannot call impure function during render",
            );
            detail.description = Some(format!(
                "`{callee_name}` is an impure function. Calling an impure function can produce \
                 unstable results that update unpredictably when the component happens to \
                 re-render. \
                 (https://react.dev/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent)."
            ));
            detail.loc = Some(call.span);
            self.errors.push(detail);
        }
    }

    impl Visit for Finder {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {
            // Skip nested functions; only validate the current render body.
        }

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            // Skip nested functions; only validate the current render body.
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if let Some(name) = impure_builtin_name(call) {
                self.push(call, name);
            }
            call.visit_children_with(self);
        }
    }

    fn impure_builtin_name(call: &CallExpr) -> Option<&'static str> {
        let Callee::Expr(callee) = &call.callee else {
            return None;
        };
        let Expr::Member(member) = &**callee else {
            return None;
        };
        let Expr::Ident(object) = &*member.obj else {
            return None;
        };
        let MemberProp::Ident(prop) = &member.prop else {
            return None;
        };

        match (object.sym.as_ref(), prop.sym.as_ref()) {
            ("Date", "now") => Some("Date.now"),
            ("Math", "random") => Some("Math.random"),
            ("performance", "now") => Some("performance.now"),
            _ => None,
        }
    }

    let mut finder = Finder::default();
    body.visit_with(&mut finder);

    if finder.errors.is_empty() {
        Ok(())
    } else {
        Err(CompilerError {
            details: finder.errors,
        })
    }
}
