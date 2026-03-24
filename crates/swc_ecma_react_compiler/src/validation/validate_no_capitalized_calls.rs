use swc_ecma_ast::{CallExpr, Callee, Expr, MemberProp};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

const CAPITALIZED_CALL_REASON: &str =
    "Capitalized functions are reserved for components, which must be invoked with JSX. If this \
     is a component, render it with JSX. Otherwise, ensure that it has no hook calls and rename \
     it to begin with a lowercase letter. Alternatively, if you know for a fact that this \
     function is not a component, you can allowlist it via the compiler config";

pub fn validate_no_capitalized_calls(hir: &HirFunction) -> Result<(), CompilerError> {
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
                ErrorCategory::CapitalizedCalls,
                CAPITALIZED_CALL_REASON,
            );
            detail.loc = Some(span);
            self.errors.push(detail);
        }
    }

    impl Visit for Finder {
        fn visit_call_expr(&mut self, call: &CallExpr) {
            let should_report = match &call.callee {
                Callee::Expr(expr) => match &**expr {
                    Expr::Ident(ident) => ident
                        .sym
                        .as_ref()
                        .chars()
                        .next()
                        .is_some_and(|ch| ch.is_ascii_uppercase()),
                    Expr::Member(member) => match &member.prop {
                        MemberProp::Ident(prop) => prop
                            .sym
                            .as_ref()
                            .chars()
                            .next()
                            .is_some_and(|ch| ch.is_ascii_uppercase()),
                        MemberProp::Computed(_) | MemberProp::PrivateName(_) => false,
                    },
                    _ => false,
                },
                Callee::Import(_) | Callee::Super(_) => false,
            };

            if should_report {
                self.push(call.span);
            }

            call.visit_children_with(self);
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
