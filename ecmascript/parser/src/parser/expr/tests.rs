extern crate test;

use super::*;
use crate::EsConfig;
use std::hint::black_box;
use swc_common::DUMMY_SP as span;
use swc_ecma_visit::assert_eq_ignore_span;
use test::Bencher;

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        dynamic_import: true,
        ..Default::default()
    })
}

fn lhs(s: &'static str) -> Box<Expr> {
    test_parser(s, syntax(), |p| {
        p.parse_lhs_expr().map_err(|mut e| {
            e.emit();
        })
    })
}

fn new_expr(s: &'static str) -> Box<Expr> {
    test_parser(s, syntax(), |p| {
        p.parse_new_expr().map_err(|mut e| {
            e.emit();
        })
    })
}

fn member_expr(s: &'static str) -> Box<Expr> {
    test_parser(s, syntax(), |p| {
        p.parse_member_expr().map_err(|mut e| {
            e.emit();
        })
    })
}

fn expr(s: &'static str) -> Box<Expr> {
    test_parser(s, syntax(), |p| {
        p.parse_stmt(true)
            .map(|stmt| match stmt {
                Stmt::Expr(expr) => expr.expr,
                _ => unreachable!(),
            })
            .map_err(|mut e| {
                e.emit();
            })
    })
}

#[test]
fn arrow_assign() {
    assert_eq_ignore_span!(
        expr("a = b => false"),
        box Expr::Assign(AssignExpr {
            span,
            left: PatOrExpr::Pat(box Ident::new("a".into(), span).into()),
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
            type_args: None,
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
            return_type: None,
            type_params: None,
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
                optional: false,
                props: vec![ObjectPatProp::Rest(RestPat {
                    span,
                    dot3_token: span,
                    arg: box Pat::Ident(Ident::new("a34".into(), span)),
                    type_ann: None,
                })],
                type_ann: None
            })],
            body: BlockStmtOrExpr::BlockStmt(BlockStmt {
                span,
                stmts: vec![]
            }),
            return_type: None,
            type_params: None,
        })
    );
}

#[test]
fn object_spread() {
    assert_eq_ignore_span!(
        expr("foo = {a, ...bar, b}"),
        box Expr::Assign(AssignExpr {
            span,
            left: PatOrExpr::Pat(box Pat::Ident(Ident::new("foo".into(), span))),
            op: op!("="),
            right: box Expr::Object(ObjectLit {
                span,
                props: vec![
                    PropOrSpread::Prop(box Ident::new("a".into(), span).into()),
                    PropOrSpread::Spread(SpreadElement {
                        dot3_token: span,
                        expr: box Expr::Ident(Ident::new("bar".into(), span))
                    }),
                    PropOrSpread::Prop(box Ident::new("b".into(), span).into()),
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
            prop: box Ident::new("toString".into(), span).into(),
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
            type_args: None,
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
            type_args: None,
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
            return_type: None,
            type_params: None,
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
            params: vec![Pat::Ident(Ident::new("a".into(), span))],
            body: BlockStmtOrExpr::Expr(expr("1")),
            return_type: None,
            type_params: None,
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
                span,
                dot3_token: span,
                arg: box Pat::Ident(Ident::new("a".into(), span)),
                type_ann: None
            })],
            body: BlockStmtOrExpr::Expr(expr("1")),
            return_type: None,
            type_params: None,
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
            params: vec![Pat::Ident(Ident::new("a".into(), span))],
            body: BlockStmtOrExpr::Expr(expr("1")),
            type_params: None,
            return_type: None,
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
            type_args: None,
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
            type_args: None,
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

#[test]
fn max_integer() {
    assert_eq_ignore_span!(
        expr("1.7976931348623157e+308"),
        box Expr::Lit(Lit::Num(Number {
            span,
            value: 1.797_693_134_862_315_7e308
        }))
    )
}

#[test]
fn iife() {
    assert_eq_ignore_span!(
        box Expr::Call(CallExpr {
            span,
            callee: ExprOrSuper::Expr(expr("(function(){})")),
            args: vec![],
            type_args: Default::default(),
        }),
        expr("(function(){})()")
    )
}

#[test]
fn issue_319_1() {
    assert_eq_ignore_span!(
        expr("obj(({ async f() { await g(); } }));"),
        box Expr::Call(CallExpr {
            span,
            callee: ExprOrSuper::Expr(expr("obj")),
            args: vec![ExprOrSpread {
                spread: None,
                expr: expr("({ async f() { await g(); } })"),
            }],
            type_args: Default::default(),
        })
    );
}

#[test]
fn issue_328() {
    assert_eq_ignore_span!(
        test_parser(
            "import('test')",
            Syntax::Es(EsConfig {
                dynamic_import: true,
                ..Default::default()
            }),
            |p| {
                p.parse_stmt(true).map_err(|mut e| {
                    e.emit();
                })
            }
        ),
        Stmt::Expr(ExprStmt {
            span,
            expr: box Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(box Expr::Ident(Ident::new("import".into(), span))),
                args: vec![ExprOrSpread {
                    spread: None,
                    expr: box Expr::Lit(Lit::Str(Str {
                        span,
                        value: "test".into(),
                        has_escape: false
                    }))
                }],
                type_args: Default::default(),
            })
        })
    );
}

#[test]
fn issue_337() {
    test_parser(
        "const foo = 'bar' in bas ? 'beep' : 'boop';",
        Default::default(),
        |p| {
            p.parse_module().map_err(|mut e| {
                e.emit();
            })
        },
    );
}

#[test]
fn issue_350() {
    assert_eq_ignore_span!(
        expr(
            r#""ok\
ok\
hehe.";"#,
        ),
        box Expr::Lit(Lit::Str(Str {
            span,
            value: "okokhehe.".into(),
            has_escape: true,
        }))
    );
}

#[test]
fn issue_380() {
    expr(
        " import('../foo/bar')
    .then(bar => {
        // bar should be {default: DEFAULT_EXPORTED_THING_IN_BAR} or atleast what it is supposed \
         to be
    })
}",
    );
}

#[test]
fn issue_675() {
    expr("Object.setPrototypeOf(this, new.target.prototype)");
}

#[bench]
fn bench_new_expr_ts(b: &mut Bencher) {
    bench_parser(
        b,
        "new Foo()",
        Syntax::Typescript(Default::default()),
        |p| {
            black_box(p.parse_expr()?);
            Ok(())
        },
    );
}

#[bench]
fn bench_new_expr_es(b: &mut Bencher) {
    bench_parser(b, "new Foo()", Syntax::Es(Default::default()), |p| {
        black_box(p.parse_expr()?);
        Ok(())
    });
}

#[bench]
fn bench_member_expr_ts(b: &mut Bencher) {
    bench_parser(
        b,
        "a.b.c.d.e.f",
        Syntax::Typescript(Default::default()),
        |p| {
            black_box(p.parse_expr()?);
            Ok(())
        },
    );
}

#[bench]
fn bench_member_expr_es(b: &mut Bencher) {
    bench_parser(b, "a.b.c.d.e.f", Syntax::Es(Default::default()), |p| {
        black_box(p.parse_expr()?);
        Ok(())
    });
}
