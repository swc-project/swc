use super::*;

impl<I: Tokens> Parser<I> {
    #[cfg(feature = "verify")]
    pub(in crate::parser) fn verify_expr(&mut self, expr: Box<Expr>) -> PResult<Box<Expr>> {
        use swc_ecma_visit::Visit;
        let mut v = swc_ecma_lexer::common::parser::verifier::Verifier { errors: Vec::new() };
        v.visit_expr(&expr);
        for (span, error) in v.errors {
            self.emit_err(span, error);
        }
        Ok(expr)
    }

    #[cfg(not(feature = "verify"))]
    pub(in crate::parser) fn verify_expr(&mut self, expr: Box<Expr>) -> PResult<Box<Expr>> {
        Ok(expr)
    }
}
