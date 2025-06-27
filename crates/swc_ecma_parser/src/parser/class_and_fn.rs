#[cfg(test)]
mod tests {

    use swc_common::DUMMY_SP as span;
    use swc_ecma_ast::*;
    use swc_ecma_lexer::Syntax;
    use swc_ecma_visit::assert_eq_ignore_span;

    use crate::test_parser;

    fn expr(s: &'static str) -> Box<Expr> {
        test_parser(s, Syntax::default(), |p| p.parse_expr())
    }

    #[test]
    fn class_expr() {
        assert_eq_ignore_span!(
            expr("(class extends a {})"),
            Box::new(Expr::Paren(ParenExpr {
                span,
                expr: Box::new(Expr::Class(ClassExpr {
                    ident: None,
                    class: Box::new(Class {
                        decorators: Vec::new(),
                        span,
                        body: Vec::new(),
                        super_class: Some(expr("a")),
                        implements: Vec::new(),
                        is_abstract: false,
                        ..Default::default()
                    }),
                })),
            }))
        );
    }
}
