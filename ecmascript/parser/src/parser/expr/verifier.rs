use super::*;
use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_visit::{Node, Visit, VisitWith};

impl<'a, I: Tokens> Parser<'a, I> {
    pub(in crate::parser) fn verify_expr(&self, expr: Box<Expr>) -> PResult<'a, Box<Expr>> {
        let mut v = Verifier { errors: vec![] };

        v.visit_expr(&expr, &Invalid { span: DUMMY_SP } as _);

        for (span, error) in v.errors {
            self.emit_err(span, error);
        }

        return Ok(expr);
    }
}

pub(super) struct Verifier {
    pub errors: Vec<(Span, SyntaxError)>,
}

impl Visit for Verifier {
    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        match *e {
            Expr::Fn(..) | Expr::Arrow(..) => {}
            _ => e.visit_children_with(self),
        }
    }

    fn visit_prop(&mut self, p: &Prop, _: &dyn Node) {
        match *p {
            Prop::Assign { .. } => {
                self.errors.push((p.span(), SyntaxError::AssignProperty));
            }
            _ => p.visit_children_with(self),
        }
    }
}
