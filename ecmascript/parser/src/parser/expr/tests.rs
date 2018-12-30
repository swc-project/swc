use super::*;
use swc_common::DUMMY_SP as span;

fn lhs(s: &'static str) -> Box<Expr> {
    test_parser(s, Syntax::Es2019, |p| p.parse_lhs_expr())
}

fn new_expr(s: &'static str) -> Box<Expr> {
    test_parser(s, Syntax::Es2019, |p| p.parse_new_expr())
}

fn member_expr(s: &'static str) -> Box<Expr> {
    test_parser(s, Syntax::Es2019, |p| p.parse_member_expr())
}

fn expr(s: &'static str) -> Box<Expr> {
    test_parser(s, Syntax::Es2019, |p| {
        p.parse_stmt(true).map(|stmt| match stmt {
            Stmt::Expr(expr) => expr,
            _ => unreachable!(),
        })
    })
}

#[test]
fn arrow_assign() {
    assert_eq_ignore_span!(
        expr("a = b => false"),
        box Expr::Assign(AssignExpr {
            span,
            left: PatOrExpr::Pat(
                box Ident {
                    span,
                    sym: "a".into(),
                }
                .into()
            ),
            op: op!("="),
            right: expr("b => false"),
        })
    );
}

#[test]
fn async_call() {
    assert_eq_ignore_span!(
        expr("async()"),
        box Expr::Call(CallExpr {
            span,
            callee: ExprOrSuper::Expr(expr("async")),
            args: vec![],
        })
    );
}

#[test]
fn async_arrow() {
    assert_eq_ignore_span!(
        expr("async () => foo"),
        box Expr::Arrow(ArrowExpr {
            span,
            is_async: true,
            is_generator: false,
            params: vec![],
            body: BlockStmtOrExpr::Expr(expr("foo")),
        })
    );
}

#[test]
fn object_rest_pat() {
    assert_eq_ignore_span!(
        expr("({ ...a34 }) => {}"),
        box Expr::Arrow(ArrowExpr {
            span,
            is_async: false,
            is_generator: false,
            params: vec![Pat::Object(ObjectPat {
                span,
                props: vec![ObjectPatProp::Rest(RestPat {
                    dot3_token: span,
                    arg: box Pat::Ident(Ident::new("a34".into(), span))
                })]
            })
            .into()],
            body: BlockStmtOrExpr::BlockStmt(BlockStmt {
                span,
                stmts: vec![]
            })
        })
    );
}

#[test]
fn object_spread() {
    assert_eq_ignore_span!(
        expr("foo = {a, ...bar, b}"),
        box Expr::Assign(AssignExpr {
            span,
            left: PatOrExpr::Pat(box Pat::Ident(
                Ident {
                    span,
                    sym: "foo".into()
                }
                .into()
            )),
            op: op!("="),
            right: box Expr::Object(ObjectLit {
                span,
                props: vec![
                    PropOrSpread::Prop(
                        box Ident {
                            span,
                            sym: "a".into()
                        }
                        .into()
                    ),
                    PropOrSpread::Spread(SpreadElement {
                        dot3_token: span,
                        expr: box Expr::Ident(Ident {
                            span,
                            sym: "bar".into(),
                        })
                    }),
                    PropOrSpread::Prop(
                        box Ident {
                            span,
                            sym: "b".into()
                        }
                        .into()
                    ),
                ]
            })
        })
    );
}

#[test]
fn new_expr_should_not_eat_too_much() {
    assert_eq_ignore_span!(
        new_expr("new Date().toString()"),
        box Expr::Member(MemberExpr {
            span,
            obj: ExprOrSuper::Expr(member_expr("new Date()")),
            prop: box Ident {
                sym: "toString".into(),
                span,
            }
            .into(),
            computed: false,
        })
    );
}
#[test]
fn lhs_expr_as_new_expr_prod() {
    assert_eq_ignore_span!(
        lhs("new Date.toString()"),
        box Expr::New(NewExpr {
            span,
            callee: lhs("Date.toString"),
            args: Some(vec![]),
        })
    );
}

#[test]
fn lhs_expr_as_call() {
    assert_eq_ignore_span!(
        lhs("new Date.toString()()"),
        box Expr::Call(CallExpr {
            span,
            callee: ExprOrSuper::Expr(lhs("new Date.toString()")),
            args: vec![],
        })
    )
}

#[test]
fn arrow_fn_no_args() {
    assert_eq_ignore_span!(
        expr("() => 1"),
        box Expr::Arrow(ArrowExpr {
            span,
            is_async: false,
            is_generator: false,
            params: vec![],
            body: BlockStmtOrExpr::Expr(expr("1")),
        })
    );
}
#[test]
fn arrow_fn() {
    assert_eq_ignore_span!(
        expr("(a) => 1"),
        box Expr::Arrow(ArrowExpr {
            span,
            is_async: false,
            is_generator: false,
            params: vec![Pat::Ident(Ident {
                span,
                sym: "a".into(),
            })],
            body: BlockStmtOrExpr::Expr(expr("1")),
        })
    );
}
#[test]
fn arrow_fn_rest() {
    assert_eq_ignore_span!(
        expr("(...a) => 1"),
        box Expr::Arrow(ArrowExpr {
            span,
            is_async: false,
            is_generator: false,
            params: vec![Pat::Rest(RestPat {
                dot3_token: span,
                arg: box Pat::Ident(Ident {
                    span,
                    sym: "a".into(),
                }),
            })],
            body: BlockStmtOrExpr::Expr(expr("1")),
        })
    );
}
#[test]
fn arrow_fn_no_paren() {
    assert_eq_ignore_span!(
        expr("a => 1"),
        box Expr::Arrow(ArrowExpr {
            span,
            is_async: false,
            is_generator: false,
            params: vec![Pat::Ident(Ident {
                span,
                sym: "a".into(),
            })],
            body: BlockStmtOrExpr::Expr(expr("1")),
        })
    );
}

#[test]
fn new_no_paren() {
    assert_eq_ignore_span!(
        expr("new a"),
        box Expr::New(NewExpr {
            span,
            callee: expr("a"),
            args: None,
        })
    );
}

#[test]
fn new_new_no_paren() {
    assert_eq_ignore_span!(
        expr("new new a"),
        box Expr::New(NewExpr {
            span,
            callee: expr("new a"),
            args: None,
        })
    );
}

#[test]
fn array_lit() {
    assert_eq_ignore_span!(
        expr("[a,,,,, ...d,, e]"),
        box Expr::Array(ArrayLit {
            span,
            elems: vec![
                Some(ExprOrSpread {
                    spread: None,
                    expr: box Expr::Ident(Ident::new("a".into(), span))
                }),
                None,
                None,
                None,
                None,
                Some(ExprOrSpread {
                    spread: Some(span),
                    expr: box Expr::Ident(Ident::new("d".into(), span))
                }),
                None,
                Some(ExprOrSpread {
                    spread: None,
                    expr: box Expr::Ident(Ident::new("e".into(), span))
                }),
            ]
        })
    );
}
