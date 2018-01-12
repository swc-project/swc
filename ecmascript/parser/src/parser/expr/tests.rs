use super::*;
use lexer::Lexer;

fn mk<'a>(s: &'static str) -> Parser<impl 'a + Input> {
    let logger = ::testing::logger().new(o!("src" => s));
    Parser::new_for_module(logger.clone(), Lexer::new_from_str(logger, s))
}

fn lhs(s: &'static str) -> Box<Expr> {
    mk(s)
        .parse_lhs_expr()
        .expect("failed to parse lhs expression")
}

fn expr(s: &'static str) -> Box<Expr> {
    mk(s).parse_expr().expect("failed to parse an expression")
}

#[allow(non_upper_case_globals)]
const span: Span = Span::DUMMY;

#[test]
fn new_expr_should_not_eat_too_much() {
    assert_eq_ignore_span!(
        mk("new Date().toString()").parse_new_expr().unwrap(),
        box Expr {
            span: Default::default(),
            node: ExprKind::Member {
                obj: mk("new Date()")
                    .parse_member_expr()
                    .map(ExprOrSuper::Expr)
                    .unwrap(),
                prop: Ident {
                    sym: "toString".into(),
                    span: Default::default(),
                }.into(),
                computed: false,
            },
        }
    );
}
#[test]
fn lhs_expr_as_new_expr_prod() {
    assert_eq_ignore_span!(
        lhs("new Date.toString()"),
        box Expr {
            span: Default::default(),
            node: ExprKind::New {
                callee: lhs("Date.toString"),
                args: Some(vec![]),
            },
        }
    );
}

#[test]
fn lhs_expr_as_call() {
    assert_eq_ignore_span!(
        lhs("new Date.toString()()"),
        box Expr {
            span: Default::default(),
            node: ExprKind::Call {
                callee: ExprOrSuper::Expr(lhs("new Date.toString()")),
                args: vec![],
            },
        }
    )
}

#[test]
fn arrow_fn_no_args() {
    assert_eq_ignore_span!(
        expr("() => 1"),
        box Expr {
            span,
            node: ExprKind::Arrow {
                is_async: false,
                is_generator: false,
                params: vec![],
                body: BlockStmtOrExpr::Expr(expr("1")),
            },
        }
    );
}
#[test]
fn arrow_fn() {
    assert_eq_ignore_span!(
        expr("(a) => 1"),
        box Expr {
            span,
            node: ExprKind::Arrow {
                is_async: false,
                is_generator: false,
                params: vec![
                    Pat {
                        span,
                        node: PatKind::Ident(Ident {
                            span,
                            sym: "a".into(),
                        }),
                    },
                ],
                body: BlockStmtOrExpr::Expr(expr("1")),
            },
        }
    );
}
#[test]
fn arrow_fn_rest() {
    assert_eq_ignore_span!(
        expr("(...a) => 1"),
        box Expr {
            span,
            node: ExprKind::Arrow {
                is_async: false,
                is_generator: false,
                params: vec![
                    Pat {
                        span,
                        node: PatKind::Rest(box Pat {
                            span,
                            node: PatKind::Ident(Ident {
                                span,
                                sym: "a".into(),
                            }),
                        }),
                    },
                ],
                body: BlockStmtOrExpr::Expr(expr("1")),
            },
        }
    );
}
#[test]
fn arrow_fn_no_paren() {
    assert_eq_ignore_span!(
        expr("a => 1"),
        box Expr {
            span,
            node: ExprKind::Arrow {
                is_async: false,
                is_generator: false,
                params: vec![
                    Pat {
                        span,
                        node: PatKind::Ident(Ident {
                            span,
                            sym: "a".into(),
                        }),
                    },
                ],
                body: BlockStmtOrExpr::Expr(expr("1")),
            },
        }
    );
}

#[test]
fn new_no_paren() {
    assert_eq_ignore_span!(
        expr("new a"),
        box Expr {
            span,
            node: ExprKind::New {
                callee: expr("a"),
                args: None,
            },
        }
    );
}

#[test]
fn new_new_no_paren() {
    assert_eq_ignore_span!(
        expr("new new a"),
        box Expr {
            span,
            node: ExprKind::New {
                callee: expr("new a"),
                args: None,
            },
        }
    );
}
