#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP as span;
    use swc_ecma_ast::*;
    use swc_ecma_lexer::{common::parser::expr::parse_bin_expr, Syntax};
    use swc_ecma_visit::assert_eq_ignore_span;

    use crate::test_parser;

    fn bin(s: &'static str) -> Box<Expr> {
        test_parser(s, Syntax::default(), |p| parse_bin_expr(p))
    }

    #[test]
    fn simple() {
        assert_eq_ignore_span!(
            bin("5 + 4 * 7"),
            Box::new(Expr::Bin(BinExpr {
                span,
                op: op!(bin, "+"),
                left: bin("5"),
                right: bin("4 * 7"),
            }))
        );
    }

    #[test]
    fn same_prec() {
        assert_eq_ignore_span!(
            bin("5 + 4 + 7"),
            Box::new(Expr::Bin(BinExpr {
                span,
                op: op!(bin, "+"),
                left: bin("5 + 4"),
                right: bin("7"),
            }))
        );
    }
}
