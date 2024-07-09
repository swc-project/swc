use std::hint::black_box;

use swc_common::{FileName, SourceMap, DUMMY_SP as span};
use swc_ecma_visit::assert_eq_ignore_span;

use super::*;
use crate::{parse_file_as_expr, EsSyntax};

fn syntax() -> Syntax {
    Syntax::Es(EsSyntax {
        allow_super_outside_method: true,
        ..Default::default()
    })
}

fn lhs(s: &'static str) -> Expr {
    test_parser(s, syntax(), |p| p.parse_lhs_expr())
}

fn new_expr(s: &'static str) -> Expr {
    test_parser(s, syntax(), |p| p.parse_new_expr())
}

fn member_expr(s: &'static str) -> Expr {
    test_parser(s, syntax(), |p| p.parse_member_expr())
}

fn expr(s: &'static str) -> Expr {
    test_parser(s, syntax(), |p| {
        p.parse_stmt(true).map(|stmt| match stmt {
            Stmt::Expr(expr) => expr.expr,
            _ => unreachable!(),
        })
    })
}
fn regex_expr() -> Expr {
    AssignExpr {
        span,
        left: Ident::new_no_ctxt("re".into(), span).into(),
        op: AssignOp::Assign,
        right: Lit::Regex(Regex {
            span,
            exp: "w+".into(),
            flags: "".into(),
        })
        .into(),
    }
    .into()
}
#[test]
fn regex_single_line_comment() {
    assert_eq_ignore_span!(
        expr(
            r#"re = // ...
            /w+/"#
        ),
        regex_expr()
    )
}

#[test]
fn regex_multi_line_comment() {
    assert_eq_ignore_span!(expr(r#"re = /* ... *//w+/"#), regex_expr())
}
#[test]
fn regex_multi_line_comment_with_lines() {
    assert_eq_ignore_span!(
        expr(
            r#"re =
            /*
             ...
             */
             /w+/"#
        ),
        regex_expr()
    )
}

#[test]
fn arrow_assign() {
    assert_eq_ignore_span!(
        expr("a = b => false"),
        Expr::Assign(Box::new(AssignExpr {
            span,
            left: Ident::new_no_ctxt("a".into(), span).into(),
            op: op!("="),
            right: expr("b => false"),
        }))
    );
}

#[test]
fn async_call() {
    assert_eq_ignore_span!(
        expr("async()"),
        Expr::Call(Box::new(CallExpr {
            span,
            callee: Callee::Expr(expr("async")),
            args: vec![],
            ..Default::default()
        }))
    );
}

#[test]
fn async_arrow() {
    assert_eq_ignore_span!(
        expr("async () => foo"),
        Expr::Arrow(Box::new(ArrowExpr {
            span,
            is_async: true,
            is_generator: false,
            params: vec![],
            body: Box::new(BlockStmtOrExpr::Expr(expr("foo"))),
            ..Default::default()
        }))
    );
}

#[test]
fn object_rest_pat() {
    assert_eq_ignore_span!(
        expr("({ ...a34 }) => {}"),
        Expr::Arrow(Box::new(ArrowExpr {
            span,
            is_async: false,
            is_generator: false,
            params: vec![Pat::Object(Box::new(ObjectPat {
                span,
                optional: false,
                props: vec![ObjectPatProp::Rest(RestPat {
                    span,
                    dot3_token: span,
                    arg: Box::new(Pat::Ident(Ident::new_no_ctxt("a34".into(), span).into())),
                    type_ann: None,
                })],
                type_ann: None
            }))],
            body: Box::new(BlockStmtOrExpr::BlockStmt(Box::new(BlockStmt {
                span,
                ..Default::default()
            }))),
            ..Default::default()
        }))
    );
}

#[test]
fn object_spread() {
    assert_eq_ignore_span!(
        expr("foo = {a, ...bar, b}"),
        Expr::Assign(Box::new(AssignExpr {
            span,
            left: Ident::new_no_ctxt("foo".into(), span).into(),
            op: op!("="),
            right: Expr::Object(Box::new(ObjectLit {
                span,
                props: vec![
                    PropOrSpread::Prop(Ident::new_no_ctxt("a".into(), span).into()),
                    PropOrSpread::Spread(SpreadElement {
                        dot3_token: span,
                        expr: Expr::Ident(Ident::new_no_ctxt("bar".into(), span)),
                    }),
                    PropOrSpread::Prop(Ident::new_no_ctxt("b".into(), span).into()),
                ]
            }))
        }))
    );
}

#[test]
fn new_expr_should_not_eat_too_much() {
    assert_eq_ignore_span!(
        new_expr("new Date().toString()"),
        Expr::Member(Box::new(MemberExpr {
            span,
            obj: member_expr("new Date()"),
            prop: MemberProp::Ident(Ident::new_no_ctxt("toString".into(), span)),
        }))
    );
}
#[test]
fn lhs_expr_as_new_expr_prod() {
    assert_eq_ignore_span!(
        lhs("new Date.toString()"),
        Expr::New(Box::new(NewExpr {
            span,
            callee: lhs("Date.toString"),
            args: Some(vec![]),
            ..Default::default()
        }))
    );
}

#[test]
fn lhs_expr_as_call() {
    assert_eq_ignore_span!(
        lhs("new Date.toString()()"),
        Expr::Call(Box::new(CallExpr {
            span,
            callee: Callee::Expr(lhs("new Date.toString()")),
            args: vec![],
            ..Default::default()
        }))
    )
}

#[test]
fn arrow_fn_no_args() {
    assert_eq_ignore_span!(
        expr("() => 1"),
        Expr::Arrow(Box::new(ArrowExpr {
            span,
            is_async: false,
            is_generator: false,
            params: vec![],
            body: Box::new(BlockStmtOrExpr::Expr(expr("1"))),
            ..Default::default()
        }))
    );
}
#[test]
fn arrow_fn() {
    assert_eq_ignore_span!(
        expr("(a) => 1"),
        Expr::Arrow(Box::new(ArrowExpr {
            span,
            is_async: false,
            is_generator: false,
            params: vec![Pat::Ident(Ident::new_no_ctxt("a".into(), span).into())],
            body: Box::new(BlockStmtOrExpr::Expr(expr("1"))),
            ..Default::default()
        }))
    );
}
#[test]
fn arrow_fn_rest() {
    assert_eq_ignore_span!(
        expr("(...a) => 1"),
        Expr::Arrow(Box::new(ArrowExpr {
            span,
            is_async: false,
            is_generator: false,
            params: vec![Pat::Rest(Box::new(RestPat {
                span,
                dot3_token: span,
                arg: Box::new(Pat::Ident(Ident::new_no_ctxt("a".into(), span).into())),
                type_ann: None
            }))],
            body: Box::new(BlockStmtOrExpr::Expr(expr("1"))),

            ..Default::default()
        }))
    );
}
#[test]
fn arrow_fn_no_paren() {
    assert_eq_ignore_span!(
        expr("a => 1"),
        Expr::Arrow(Box::new(ArrowExpr {
            span,
            params: vec![Pat::Ident(Ident::new_no_ctxt("a".into(), span).into())],
            body: Box::new(BlockStmtOrExpr::Expr(expr("1"))),
            ..Default::default()
        }))
    );
}

#[test]
fn new_no_paren() {
    assert_eq_ignore_span!(
        expr("new a"),
        Expr::New(Box::new(NewExpr {
            span,
            callee: expr("a"),
            args: None,
            ..Default::default()
        }))
    );
}

#[test]
fn new_new_no_paren() {
    assert_eq_ignore_span!(
        expr("new new a"),
        Expr::New(Box::new(NewExpr {
            span,
            callee: expr("new a"),
            args: None,
            ..Default::default()
        }))
    );
}

#[test]
fn array_lit() {
    assert_eq_ignore_span!(
        expr("[a,,,,, ...d,, e]"),
        Expr::Array(Box::new(ArrayLit {
            span,
            elems: vec![
                Some(ExprOrSpread {
                    spread: None,
                    expr: Expr::Ident(Ident::new_no_ctxt("a".into(), span)),
                }),
                None,
                None,
                None,
                None,
                Some(ExprOrSpread {
                    spread: Some(span),
                    expr: Expr::Ident(Ident::new_no_ctxt("d".into(), span)),
                }),
                None,
                Some(ExprOrSpread {
                    spread: None,
                    expr: Expr::Ident(Ident::new_no_ctxt("e".into(), span)),
                }),
            ]
        }))
    );
}

#[test]
fn max_integer() {
    assert_eq_ignore_span!(
        expr("1.7976931348623157e+308"),
        Expr::Lit(Box::new(Lit::Num(Number {
            span,
            value: 1.797_693_134_862_315_7e308,
            raw: Some("1.7976931348623157e+308".into()),
        })))
    )
}

#[test]
fn iife() {
    assert_eq_ignore_span!(
        expr("(function(){})()"),
        Expr::Call(Box::new(CallExpr {
            span,
            callee: Callee::Expr(expr("(function(){})")),
            args: vec![],
            ..Default::default()
        }))
    )
}

#[test]
fn issue_319_1() {
    assert_eq_ignore_span!(
        expr("obj(({ async f() { await g(); } }));"),
        Expr::Call(Box::new(CallExpr {
            span,
            callee: Callee::Expr(expr("obj")),
            args: vec![ExprOrSpread {
                spread: None,
                expr: expr("({ async f() { await g(); } })"),
            }],
            ..Default::default()
        }))
    );
}

#[test]
fn issue_328() {
    assert_eq_ignore_span!(
        test_parser("import('test')", Syntax::Es(Default::default()), |p| {
            p.parse_stmt(true)
        }),
        Stmt::Expr(ExprStmt {
            span,
            expr: Expr::Call(Box::new(CallExpr {
                span,
                callee: Callee::Import(Import {
                    span,
                    phase: Default::default()
                }),
                args: vec![ExprOrSpread {
                    spread: None,
                    expr: Expr::Lit(Box::new(Lit::Str(Str {
                        span,
                        value: "test".into(),
                        raw: Some("'test'".into()),
                    }))),
                }],
                ..Default::default()
            }))
        })
    );
}

#[test]
fn issue_337() {
    test_parser(
        "const foo = 'bar' in bas ? 'beep' : 'boop';",
        Default::default(),
        |p| p.parse_module(),
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
        Expr::Lit(Box::new(Lit::Str(Str {
            span,
            value: "okokhehe.".into(),
            raw: Some("\"ok\\\nok\\\nhehe.\"".into()),
        })))
    );
}

#[test]
fn issue_380() {
    expr(
        " import('../foo/bar')
    .then(bar => {
        // bar should be {default: DEFAULT_EXPORTED_THING_IN_BAR} or at least what it is supposed \
         to be
    })
}",
    );
}

#[test]
fn issue_675() {
    expr("fn = function () { Object.setPrototypeOf(this, new.target.prototype); }");
}

#[test]
fn super_expr() {
    assert_eq_ignore_span!(
        expr("super.foo();"),
        Expr::Call(Box::new(CallExpr {
            span,
            callee: Callee::Expr(Expr::SuperProp(Box::new(SuperPropExpr {
                span,
                obj: Super { span },
                prop: SuperProp::Ident(Ident {
                    span,
                    sym: "foo".into(),
                    ..Default::default()
                })
            }))),
            ..Default::default()
        }))
    );
}

#[test]
fn super_expr_computed() {
    assert_eq_ignore_span!(
        expr("super[a] ??= 123;"),
        Expr::Assign(Box::new(AssignExpr {
            span,
            op: AssignOp::NullishAssign,
            left: SuperPropExpr {
                span,
                obj: Super { span },
                prop: SuperProp::Computed(Box::new(ComputedPropName {
                    span,
                    expr: Expr::Ident(Ident {
                        span,
                        sym: "a".into(),
                        ..Default::default()
                    }),
                }))
            }
            .into(),
            right: Expr::Lit(Box::new(Lit::Num(Number {
                span,
                value: 123f64,
                raw: Some("123".into()),
            })))
        }))
    );
}

#[test]
fn issue_3672_1() {
    test_parser(
        "report({
    fix: fixable ? null : (): RuleFix => {},
});",
        Syntax::Typescript(Default::default()),
        |p| p.parse_module(),
    );
}

#[test]
fn issue_3672_2() {
    test_parser(
        "f(a ? (): void => { } : (): void => { })",
        Syntax::Typescript(Default::default()),
        |p| p.parse_module(),
    );
}

#[test]
fn issue_5947() {
    test_parser(
        "[a as number, b as number, c as string] = [1, 2, '3']",
        Syntax::Typescript(Default::default()),
        |p| p.parse_module(),
    );
}

#[test]
fn issue_6781() {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Anon.into(), "import.meta.env".to_string());
    let mut errors = vec![];
    let expr = parse_file_as_expr(
        &fm,
        Default::default(),
        Default::default(),
        None,
        &mut errors,
    );
    assert!(expr.is_ok());
    assert!(errors.is_empty());
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
