use super::*;
#[cfg(feature = "verify")]
use swc_common::{Span, Spanned, Visit, VisitWith};

impl<'a, I: Tokens> Parser<'a, I> {
    #[cfg(feature = "verify")]
    pub(in crate::parser) fn verify_expr(&self, expr: Box<Expr>) -> PResult<'a, Box<Expr>> {
        let mut v = Verifier { errors: vec![] };

        v.visit(&expr);

        if v.errors.is_empty() {
            return Ok(expr);
        }

        //TODO
        let (span, error) = v.errors.into_iter().next().unwrap();
        syntax_error!(self, span, error)
    }

    #[cfg(not(feature = "verify"))]
    pub(in crate::parser) fn verify_expr(&self, expr: Box<Expr>) -> PResult<'a, Box<Expr>> {
        // TODO(kdy1): Somehow verify it
        Ok(expr)
    }
}

#[cfg(feature = "verify")]
pub(super) struct Verifier {
    pub errors: Vec<(Span, SyntaxError)>,
}

#[cfg(feature = "verify")]
impl Visit<Expr> for Verifier {
    fn visit(&mut self, e: &Expr) {
        match *e {
            Expr::Fn(..) | Expr::Arrow(..) => {}
            _ => e.visit_children_with(self),
        }
    }
}

#[cfg(feature = "verify")]
impl Visit<Prop> for Verifier {
    fn visit(&mut self, p: &Prop) {
        match *p {
            Prop::Assign { .. } => {
                self.errors.push((p.span(), SyntaxError::AssignProperty));
            }
            _ => p.visit_children_with(self),
        }
    }
}
