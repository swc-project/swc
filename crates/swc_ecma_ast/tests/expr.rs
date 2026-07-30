use swc_common::DUMMY_SP;
use swc_ecma_ast::{Expr, Invalid, ParenExpr, SeqExpr, ThisExpr};

fn paren(expr: Expr) -> Expr {
    Expr::Paren(ParenExpr {
        span: DUMMY_SP,
        expr: Box::new(expr),
    })
}

#[test]
fn unwrap_parens_mut_descends_through_multiple_layers() {
    let mut expr = paren(paren(paren(Expr::Invalid(Invalid { span: DUMMY_SP }))));

    let unwrapped = expr.unwrap_parens_mut();

    assert!(matches!(unwrapped, Expr::Invalid(_)));

    *unwrapped = Expr::This(ThisExpr { span: DUMMY_SP });

    assert!(matches!(expr.unwrap_parens(), Expr::This(_)));
}

#[test]
fn unwrap_mut_with_supports_nested_expression_traversal() {
    let mut expr = paren(Expr::Seq(SeqExpr {
        span: DUMMY_SP,
        exprs: vec![
            Box::new(Expr::Invalid(Invalid { span: DUMMY_SP })),
            Box::new(paren(Expr::This(ThisExpr { span: DUMMY_SP }))),
        ],
    }));
    let mut visited = 0;

    let unwrapped = expr.unwrap_mut_with(|expr| {
        visited += 1;

        match expr {
            Expr::Paren(ParenExpr { expr, .. }) => Some(expr),
            Expr::Seq(SeqExpr { exprs, .. }) => exprs.last_mut().map(|expr| &mut **expr),
            _ => None,
        }
    });

    assert!(matches!(unwrapped, Expr::This(_)));
    assert_eq!(visited, 4);
}
