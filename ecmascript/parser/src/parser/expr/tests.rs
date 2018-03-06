use super::*;
use swc_common::DUMMY_SP;

fn lhs(s: &'static str) -> Box<Expr> {
    test_parser(s, |p| {
        p.parse_lhs_expr().unwrap_or_else(|err| {
            err.emit();
            unreachable!("failed to parse lhs expression")
        })
    })
}

fn new_expr(s: &'static str) -> Box<Expr> {
    test_parser(s, |p| {
        p.parse_new_expr().unwrap_or_else(|err| {
            err.emit();
            unreachable!("failed to parse an expression")
        })
    })
}

fn member_expr(s: &'static str) -> Box<Expr> {
    test_parser(s, |p| {
        p.parse_member_expr().unwrap_or_else(|err| {
            err.emit();
            unreachable!("failed to parse an expression")
        })
    })
}

fn expr(s: &'static str) -> Box<Expr> {
    test_parser(s, |p| {
        p.parse_expr().unwrap_or_else(|err| {
            err.emit();
            unreachable!("failed to parse an expression")
        })
    })
}

#[allow(non_upper_case_globals)]
const span: Span = DUMMY_SP;

#[test]
fn arrow_assign() {
    assert_eq_ignore_span!(
        expr("a = b => false"),
        box Expr {
            span,
            node: Expr::Assign(AssignExpr {
                left: PatOrExpr::Pat(
                    Ident {
                        span,
                        sym: "a".into(),
                    }.into()
                ),
                op: op!("="),
                right: expr("b => false"),
            }),
        }
    );
}

#[test]
fn new_expr_should_not_eat_too_much() {
    assert_eq_ignore_span!(
        new_expr("new Date().toString()"),
        box Expr {
            span,
            node: Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(member_expr("new Date()")),
                prop: Ident {
                    sym: "toString".into(),
                    span,
                }.into(),
                computed: false,
            }),
        }
    );
}
#[test]
fn lhs_expr_as_new_expr_prod() {
    assert_eq_ignore_span!(
        lhs("new Date.toString()"),
        box Expr {
            span,
            node: Expr::New(NewExpr {
                callee: lhs("Date.toString"),
                args: Some(vec![]),
            }),
        }
    );
}

#[test]
fn lhs_expr_as_call() {
    assert_eq_ignore_span!(
        lhs("new Date.toString()()"),
        box Expr {
            span,
            node: Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(lhs("new Date.toString()")),
                args: vec![],
            }),
        }
    )
}

#[test]
fn arrow_fn_no_args() {
    assert_eq_ignore_span!(
        expr("() => 1"),
        box Expr {
            span,
            node: Expr::Arrow(ArrowExpr {
                is_async: false,
                is_generator: false,
                params: vec![],
                body: BlockStmtOrExpr::Expr(expr("1")),
            }),
        }
    );
}
#[test]
fn arrow_fn() {
    assert_eq_ignore_span!(
        expr("(a) => 1"),
        box Expr {
            span,
            node: Expr::Arrow(ArrowExpr {
                is_async: false,
                is_generator: false,
                params: vec![
                    Pat {
                        span,
                        node: Pat::Ident(Ident {
                            span,
                            sym: "a".into(),
                        }),
                    },
                ],
                body: BlockStmtOrExpr::Expr(expr("1")),
            }),
        }
    );
}
#[test]
fn arrow_fn_rest() {
    assert_eq_ignore_span!(
        expr("(...a) => 1"),
        box Expr {
            span,
            node: Expr::Arrow(ArrowExpr {
                is_async: false,
                is_generator: false,
                params: vec![
                    Pat {
                        span,
                        node: Pat::Rest(box Pat {
                            span,
                            node: Pat::Ident(Ident {
                                span,
                                sym: "a".into(),
                            }),
                        }),
                    },
                ],
                body: BlockStmtOrExpr::Expr(expr("1")),
            }),
        }
    );
}
#[test]
fn arrow_fn_no_paren() {
    assert_eq_ignore_span!(
        expr("a => 1"),
        box Expr {
            span,
            node: Expr::Arrow(ArrowExpr {
                is_async: false,
                is_generator: false,
                params: vec![
                    Pat {
                        span,
                        node: Pat::Ident(Ident {
                            span,
                            sym: "a".into(),
                        }),
                    },
                ],
                body: BlockStmtOrExpr::Expr(expr("1")),
            }),
        }
    );
}

#[test]
fn new_no_paren() {
    assert_eq_ignore_span!(
        expr("new a"),
        box Expr {
            span,
            node: Expr::New(NewExpr {
                callee: expr("a"),
                args: None,
            }),
        }
    );
}

#[test]
fn new_new_no_paren() {
    assert_eq_ignore_span!(
        expr("new new a"),
        box Expr {
            span,
            node: Expr::New(NewExpr {
                callee: expr("new a"),
                args: None,
            }),
        }
    );
}
