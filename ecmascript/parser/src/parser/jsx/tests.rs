use super::*;
use crate::parser::test_parser;

fn jsx(src: &'static str) -> Box<Expr> {
    test_parser(src, Syntax::Jsx, |p| p.parse_expr())
}

#[test]
fn simple_01() {}
