use swc_ecma_ast::{CallExpr, Callee, Expr};
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
        errors: Vec<CompilerErrorDetail>,
    }

    impl Visit for Finder {
        fn visit_call_expr(&mut self, call: &CallExpr) {
            let Callee::Expr(callee_expr) = &call.callee else {
                call.visit_children_with(self);
                return;
            };
            let Expr::Ident(callee) = &**callee_expr else {
                call.visit_children_with(self);
                return;
            };
            if callee.sym == "eval" {
                let mut detail = CompilerErrorDetail::error(
                    ErrorCategory::UnsupportedSyntax,
                    "Compilation Skipped: The 'eval' function is not supported",
                );
                detail.description = Some(
                    "Eval is an anti-pattern in JavaScript, and the code executed cannot be \
                     evaluated by React Compiler."
                        .into(),
                );
                detail.loc = Some(call.span);
                self.errors.push(detail);
                return;
            }

            call.visit_children_with(self);
        }

        fn visit_function(&mut self, function: &swc_ecma_ast::Function) {
            function.visit_children_with(self);
        }

        fn visit_arrow_expr(&mut self, arrow: &swc_ecma_ast::ArrowExpr) {
            arrow.visit_children_with(self);
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
