use swc_ecma_ast::arena::Expr;
#[cfg(feature = "verify")]
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::Parser;
use crate::{PResult, Tokens};

impl<'a, I: Tokens> Parser<'a, I> {
    #[cfg(feature = "verify")]
    pub(in crate::parser) fn verify_expr(&mut self, expr: Box<Expr>) -> PResult<Box<Expr>> {
        let mut v = Verifier { errors: Vec::new() };

        v.visit_expr(&expr);

        for (span, error) in v.errors {
            self.emit_err(span, error);
        }

        Ok(expr)
    }

    #[cfg(not(feature = "verify"))]
    pub(crate) fn verify_expr(&mut self, expr: Expr<'a>) -> PResult<Expr<'a>> {
        Ok(expr)
    }
}

#[cfg(feature = "verify")]
pub(crate) struct Verifier {
    pub errors: Vec<(Span, SyntaxError)>,
}

#[cfg(feature = "verify")]
impl Visit for Verifier {
    noop_visit_type!();

    fn visit_assign_prop(&mut self, p: &AssignProp) {
        self.errors.push((p.span(), SyntaxError::AssignProperty));
    }

    fn visit_expr(&mut self, e: &Expr) {
        match *e {
            Expr::Fn(..) | Expr::Arrow(..) => {}
            _ => e.visit_children_with(self),
        }
    }
}
