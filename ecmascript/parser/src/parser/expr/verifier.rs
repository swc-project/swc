use super::*;
use swc_common::{Span, Spanned, Visit, VisitWith};

impl<'a, I: Input> Parser<'a, I> {
    pub(in parser) fn verify_expr(&self, expr: Box<Expr>) -> PResult<'a, Box<Expr>> {
        let mut v = Verifier { errors: vec![] };

        v.visit(&expr);

        if v.errors.is_empty() {
            return Ok(expr);
        }

        //TODO
        let (span, error) = v.errors.into_iter().next().unwrap();
        syntax_error!(self, span, error)
    }
}

pub(super) struct Verifier {
    pub errors: Vec<(Span, SyntaxError)>,
}

impl Visit<Expr> for Verifier {
    fn visit(&mut self, e: &Expr) {
        match *e {
            Expr::Fn(..) | Expr::Arrow(..) => {}
            _ => e.visit_children(self),
        }
    }
}

impl Visit<Prop> for Verifier {
    fn visit(&mut self, p: &Prop) {
        match *p {
            Prop::Assign { .. } => {
                self.errors.push((p.span(), SyntaxError::Unexpected));
            }
            _ => p.visit_children(self),
        }
    }
}
