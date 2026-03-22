use swc_common::Spanned;
use swc_ecma_ast::{Expr, Stmt, TryStmt};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

pub fn validate_no_jsx_in_try_statement(hir: &HirFunction) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };

    #[derive(Default)]
    struct Finder {
        errors: Vec<CompilerErrorDetail>,
    }

    impl Finder {
        fn push(&mut self, span: swc_common::Span) {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::ErrorBoundaries,
                "JSX may not be created inside a try block",
            );
            detail.description = Some(
                "Creating JSX inside a try/catch block can hide render errors from React error \
                 boundaries. Prefer moving error handling to an Error Boundary component."
                    .into(),
            );
            detail.loc = Some(span);
            self.errors.push(detail);
        }
    }

    impl Visit for Finder {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {
            // Ignore nested functions.
        }

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            // Ignore nested arrows.
        }

        fn visit_try_stmt(&mut self, try_stmt: &TryStmt) {
            let mut jsx_finder = JsxFinder::default();
            try_stmt.block.visit_with(&mut jsx_finder);
            for span in jsx_finder.spans {
                self.push(span);
            }

            if let Some(handler) = &try_stmt.handler {
                handler.visit_children_with(self);
            }
            if let Some(finalizer) = &try_stmt.finalizer {
                finalizer.visit_children_with(self);
            }
        }
    }

    #[derive(Default)]
    struct JsxFinder {
        spans: Vec<swc_common::Span>,
    }

    impl Visit for JsxFinder {
        fn visit_expr(&mut self, expr: &Expr) {
            if matches!(expr, Expr::JSXElement(_) | Expr::JSXFragment(_)) {
                self.spans.push(expr.span());
            }
            expr.visit_children_with(self);
        }

        fn visit_stmt(&mut self, stmt: &Stmt) {
            stmt.visit_children_with(self);
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
