use std::hint::black_box;

use swc_allocator::{
    arena::{Allocator, Box, Vec},
    vec,
};
use swc_common::{FileName, SourceMap, SyntaxContext, DUMMY_SP as span};
use swc_ecma_ast::{arena::*, op};
use swc_ecma_visit::assert_eq_ignore_span_arena;

use crate::{
    arena::{
        parse_file_as_expr,
        parser::{bench_parser, test_parser, Bencher},
    },
    EsSyntax, Syntax,
};

fn syntax() -> Syntax {
    Syntax::Es(EsSyntax {
        allow_super_outside_method: true,
        ..Default::default()
    })
}

fn lhs<'a>(alloc: &'a Allocator, s: &'static str) -> Expr<'a> {
    test_parser(alloc, s, syntax(), |p| p.parse_lhs_expr())
}

fn new_expr<'a>(alloc: &'a Allocator, s: &'static str) -> Expr<'a> {
    test_parser(alloc, s, syntax(), |p| p.parse_new_expr())
}

fn member_expr<'a>(alloc: &'a Allocator, s: &'static str) -> Expr<'a> {
    test_parser(alloc, s, syntax(), |p| p.parse_member_expr())
}

fn expr<'a>(alloc: &'a Allocator, s: &'static str) -> Expr<'a> {
    test_parser(alloc, s, syntax(), |p| {
        p.parse_stmt(true).map(|stmt| match stmt {
            Stmt::Expr(expr) => expr.into_inner().expr,
            _ => unreachable!(),
        })
    })
}
fn regex_expr(alloc: &Allocator) -> Expr<'_> {
    Expr::Assign(Box::new_in(
        AssignExpr {
            span,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(Box::new_in(
                Ident::new_no_ctxt("re".into(), span).into(),
                alloc,
            ))),
            op: AssignOp::Assign,
            right: Expr::Lit(Box::new_in(
                Lit::Regex(Box::new_in(
                    Regex {
                        span,
                        exp: "w+".into(),
                        flags: "".into(),
                    },
                    alloc,
                )),
                alloc,
            )),
        },
        alloc,
    ))
}
#[test]
fn regex_single_line_comment() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(
            &alloc,
            r#"re = // ...
            /w+/"#
        ),
        regex_expr(&alloc)
    )
}

#[test]
fn regex_multi_line_comment() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(expr(&alloc, r#"re = /* ... *//w+/"#), regex_expr(&alloc))
}
#[test]
fn regex_multi_line_comment_with_lines() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(
            &alloc,
            r#"re =
            /*
             ...
             */
             /w+/"#
        ),
        regex_expr(&alloc)
    )
}

#[test]
fn arrow_assign() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "a = b => false"),
        Expr::Assign(Box::new_in(
            AssignExpr {
                span,
                left: AssignTarget::Simple(SimpleAssignTarget::Ident(Box::new_in(
                    Ident::new_no_ctxt("a".into(), span).into(),
                    &alloc
                ))),
                op: op!("="),
                right: expr(&alloc, "b => false"),
            },
            &alloc
        ))
    );
}

#[test]
fn async_call() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "async()"),
        Expr::Call(Box::new_in(
            CallExpr {
                span,
                callee: Callee::Expr(expr(&alloc, "async")),
                args: Vec::new_in(&alloc),
                ctxt: SyntaxContext::default(),
                type_args: None
            },
            &alloc
        ))
    );
}

#[test]
fn async_arrow() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "async () => foo"),
        Expr::Arrow(Box::new_in(
            ArrowExpr {
                span,
                is_async: true,
                is_generator: false,
                params: Vec::new_in(&alloc),
                body: BlockStmtOrExpr::Expr(expr(&alloc, "foo")),
                ctxt: SyntaxContext::default(),
                return_type: None,
                type_params: None,
            },
            &alloc
        ))
    );
}

#[test]
fn object_rest_pat() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "({ ...a34 }) => {}"),
        Expr::Arrow(Box::new_in(
            ArrowExpr {
                span,
                is_async: false,
                is_generator: false,
                params: vec![in &alloc; Pat::Object(Box::new_in(
                ObjectPat {
                span,
                optional: false,
                props: vec![in &alloc; ObjectPatProp::Rest(Box::new_in(
                    RestPat {
                    span,
                    dot3_token: span,
                    arg: Pat::Ident(Box::new_in(Ident::new_no_ctxt("a34".into(), span).into(), &alloc)),
                    type_ann: None,
                }
                    , &alloc))],
                type_ann: None
            }
                , &alloc))],
                body: BlockStmtOrExpr::BlockStmt(Box::new_in(
                    BlockStmt {
                        span,
                        ctxt: SyntaxContext::default(),
                        stmts: Vec::new_in(&alloc)
                    },
                    &alloc
                )),
                ctxt: SyntaxContext::default(),
                return_type: None,
                type_params: None
            },
            &alloc
        ))
    );
}

#[test]
fn object_spread() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "foo = {a, ...bar, b}"),
        Expr::Assign(Box::new_in(
            AssignExpr {
                span,
                left: AssignTarget::Simple(SimpleAssignTarget::Ident(Box::new_in(
                    Ident::new_no_ctxt("foo".into(), span).into(),
                    &alloc
                ))),
                op: op!("="),
                right: Expr::Object(Box::new_in(
                    ObjectLit {
                        span,
                        props: vec![in &alloc;
                                                    PropOrSpread::Prop(Box::new_in(Prop::Shorthand(Box::new_in(Ident::new_no_ctxt("a".into(), span), &alloc)), &alloc)),
                                                    PropOrSpread::Spread(Box::new_in(
                        SpreadElement {
                                                        dot3_token: span,
                                                        expr: Expr::Ident(Box::new_in(Ident::new_no_ctxt("bar".into(), span), &alloc)),
                                                    }
                                                        , &alloc)),
                                                    PropOrSpread::Prop(Box::new_in(Prop::Shorthand(Box::new_in(Ident::new_no_ctxt("b".into(), span),&alloc)), &alloc)),
                                                ]
                    },
                    &alloc
                ))
            },
            &alloc
        ))
    );
}

#[test]
fn new_expr_should_not_eat_too_much() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        new_expr(&alloc, "new Date().toString()"),
        Expr::Member(Box::new_in(
            MemberExpr {
                span,
                obj: member_expr(&alloc, "new Date()"),
                prop: MemberProp::Ident(Box::new_in(
                    IdentName::new("toString".into(), span),
                    &alloc
                )),
            },
            &alloc
        ))
    );
}
#[test]
fn lhs_expr_as_new_expr_prod() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        lhs(&alloc, "new Date.toString()"),
        Expr::New(Box::new_in(
            NewExpr {
                span,
                callee: lhs(&alloc, "Date.toString"),
                args: Some(Vec::new_in(&alloc)),
                ctxt: SyntaxContext::default(),
                type_args: None,
            },
            &alloc
        ))
    );
}

#[test]
fn lhs_expr_as_call() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        lhs(&alloc, "new Date.toString()()"),
        Expr::Call(Box::new_in(
            CallExpr {
                span,
                callee: Callee::Expr(lhs(&alloc, "new Date.toString()")),
                args: Vec::new_in(&alloc),
                ctxt: SyntaxContext::default(),
                type_args: None,
            },
            &alloc
        ))
    )
}

#[test]
fn arrow_fn_no_args() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "() => 1"),
        Expr::Arrow(Box::new_in(
            ArrowExpr {
                span,
                is_async: false,
                is_generator: false,
                params: Vec::new_in(&alloc),
                body: BlockStmtOrExpr::Expr(expr(&alloc, "1")),
                ctxt: SyntaxContext::default(),
                return_type: None,
                type_params: None,
            },
            &alloc
        ))
    );
}
#[test]
fn arrow_fn() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "(a) => 1"),
        Expr::Arrow(Box::new_in(
            ArrowExpr {
                span,
                is_async: false,
                is_generator: false,
                params: vec![in &alloc; Pat::Ident(Box::new_in(Ident::new_no_ctxt("a".into(), span).into(), &alloc))],
                body: BlockStmtOrExpr::Expr(expr(&alloc, "1")),
                ctxt: SyntaxContext::default(),
                return_type: None,
                type_params: None
            },
            &alloc
        ))
    );
}
#[test]
fn arrow_fn_rest() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "(...a) => 1"),
        Expr::Arrow(Box::new_in(
            ArrowExpr {
                span,
                is_async: false,
                is_generator: false,
                params: vec![in &alloc; Pat::Rest(Box::new_in(
                    RestPat {
                    span,
                    dot3_token: span,
                    arg: Pat::Ident(Box::new_in(Ident::new_no_ctxt("a".into(), span).into(), &alloc)),
                    type_ann: None
                }
                    , &alloc))],
                body: BlockStmtOrExpr::Expr(expr(&alloc, "1")),
                ctxt: SyntaxContext::default(),
                return_type: None,
                type_params: None,
            },
            &alloc
        ))
    );
}
#[test]
fn arrow_fn_no_paren() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "a => 1"),
        Expr::Arrow(Box::new_in(
            ArrowExpr {
                span,
                params: vec![in &alloc; Pat::Ident(Box::new_in(Ident::new_no_ctxt("a".into(), span).into(), &alloc))],
                body: BlockStmtOrExpr::Expr(expr(&alloc, "1")),
                ctxt: SyntaxContext::default(),
                is_async: false,
                is_generator: false,
                return_type: None,
                type_params: None
            },
            &alloc
        ))
    );
}

#[test]
fn new_no_paren() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "new a"),
        Expr::New(Box::new_in(
            NewExpr {
                span,
                callee: expr(&alloc, "a"),
                args: None,
                ctxt: SyntaxContext::default(),
                type_args: None,
            },
            &alloc
        ))
    );
}

#[test]
fn new_new_no_paren() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "new new a"),
        Expr::New(Box::new_in(
            NewExpr {
                span,
                callee: expr(&alloc, "new a"),
                args: None,
                ctxt: SyntaxContext::default(),
                type_args: None,
            },
            &alloc
        ))
    );
}

#[test]
fn array_lit() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "[a,,,,, ...d,, e]"),
        Expr::Array(Box::new_in(
            ArrayLit {
                span,
                elems: vec![in &alloc;
                    Some(ExprOrSpread {
                        spread: None,
                        expr: Expr::Ident(Box::new_in(Ident::new_no_ctxt("a".into(), span), &alloc)),
                    }),
                    None,
                    None,
                    None,
                    None,
                    Some(ExprOrSpread {
                        spread: Some(span),
                        expr: Expr::Ident(Box::new_in(Ident::new_no_ctxt("d".into(), span), &alloc)),
                    }),
                    None,
                    Some(ExprOrSpread {
                        spread: None,
                        expr: Expr::Ident(Box::new_in(Ident::new_no_ctxt("e".into(), span), &alloc)),
                    }),
                ]
            },
            &alloc
        ))
    );
}

#[test]
fn max_integer() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "1.7976931348623157e+308"),
        Expr::Lit(Box::new_in(
            Lit::Num(Box::new_in(
                Number {
                    span,
                    value: 1.797_693_134_862_315_7e308,
                    raw: Some("1.7976931348623157e+308".into()),
                },
                &alloc
            )),
            &alloc
        ))
    )
}

#[test]
fn iife() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "(function(){})()"),
        Expr::Call(Box::new_in(
            CallExpr {
                span,
                callee: Callee::Expr(expr(&alloc, "(function(){})")),
                args: Vec::new_in(&alloc),
                ctxt: SyntaxContext::default(),
                type_args: None,
            },
            &alloc
        ))
    )
}

#[test]
fn issue_319_1() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "obj(({ async f() { await g(); } }));"),
        Expr::Call(Box::new_in(
            CallExpr {
                span,
                callee: Callee::Expr(expr(&alloc, "obj")),
                args: vec![in &alloc; ExprOrSpread {
                    spread: None,
                    expr: expr(&alloc, "({ async f() { await g(); } })"),
                }],
                ctxt: SyntaxContext::default(),
                type_args: None,
            },
            &alloc
        ))
    );
}

#[test]
fn issue_328() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        test_parser(
            &alloc,
            "import('test')",
            Syntax::Es(Default::default()),
            |p| { p.parse_stmt(true) }
        ),
        Stmt::Expr(Box::new_in(
            ExprStmt {
                span,
                expr: Expr::Call(Box::new_in(
                    CallExpr {
                        span,
                        callee: Callee::Import(Box::new_in(
                            Import {
                                span,
                                phase: Default::default()
                            },
                            &alloc
                        )),
                        args: vec![in &alloc; ExprOrSpread {
                                                    spread: None,
                                                    expr: Expr::Lit(Box::new_in(
                                                        Lit::Str(Box::new_in(
                        Str {
                                                        span,
                                                        value: "test".into(),
                                                        raw: Some("'test'".into()),
                                                    }
                                                            , &alloc)),
                                                    &alloc)
                                                        ),
                                                }],
                        ctxt: SyntaxContext::default(),
                        type_args: None,
                    },
                    &alloc
                ))
            },
            &alloc
        ))
    );
}

#[test]
fn issue_337() {
    let alloc = Allocator::default();
    test_parser(
        &alloc,
        "const foo = 'bar' in bas ? 'beep' : 'boop';",
        Default::default(),
        |p| p.parse_module(),
    );
}

#[test]
fn issue_350() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(
            &alloc,
            r#""ok\
ok\
hehe.";"#,
        ),
        Expr::Lit(Box::new_in(
            Lit::Str(Box::new_in(
                Str {
                    span,
                    value: "okokhehe.".into(),
                    raw: Some("\"ok\\\nok\\\nhehe.\"".into()),
                },
                &alloc
            )),
            &alloc
        ))
    );
}

#[test]
fn issue_380() {
    let alloc = Allocator::default();
    expr(
        &alloc,
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
    let alloc = Allocator::default();
    expr(
        &alloc,
        "fn = function () { Object.setPrototypeOf(this, new.target.prototype); }",
    );
}

#[test]
fn super_expr() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "super.foo();"),
        Expr::Call(Box::new_in(
            CallExpr {
                span,
                callee: Callee::Expr(Expr::SuperProp(Box::new_in(
                    SuperPropExpr {
                        span,
                        obj: Super { span },
                        prop: SuperProp::Ident(Box::new_in(
                            IdentName {
                                span,
                                sym: "foo".into(),
                            },
                            &alloc
                        ))
                    },
                    &alloc
                ))),
                args: Vec::new_in(&alloc),
                ctxt: SyntaxContext::default(),
                type_args: None,
            },
            &alloc
        ))
    );
}

#[test]
fn super_expr_computed() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        expr(&alloc, "super[a] ??= 123;"),
        Expr::Assign(Box::new_in(
            AssignExpr {
                span,
                op: AssignOp::NullishAssign,
                left: AssignTarget::Simple(SimpleAssignTarget::SuperProp(Box::new_in(
                    SuperPropExpr {
                        span,
                        obj: Super { span },
                        prop: SuperProp::Computed(Box::new_in(
                            ComputedPropName {
                                span,
                                expr: Expr::Ident(Box::new_in(
                                    Ident {
                                        span,
                                        sym: "a".into(),
                                        ctxt: SyntaxContext::default(),
                                        optional: false,
                                    },
                                    &alloc
                                )),
                            },
                            &alloc
                        ))
                    },
                    &alloc
                ))),
                right: Expr::Lit(Box::new_in(
                    Lit::Num(Box::new_in(
                        Number {
                            span,
                            value: 123f64,
                            raw: Some("123".into()),
                        },
                        &alloc
                    )),
                    &alloc
                ))
            },
            &alloc
        ))
    );
}

#[test]
fn issue_3672_1() {
    let alloc = Allocator::default();
    test_parser(
        &alloc,
        "report({
    fix: fixable ? null : (): RuleFix => {},
});",
        Syntax::Typescript(Default::default()),
        |p| p.parse_module(),
    );
}

#[test]
fn issue_3672_2() {
    let alloc = Allocator::default();
    test_parser(
        &alloc,
        "f(a ? (): void => { } : (): void => { })",
        Syntax::Typescript(Default::default()),
        |p| p.parse_module(),
    );
}

#[test]
fn issue_5947() {
    let alloc = Allocator::default();
    test_parser(
        &alloc,
        "[a as number, b as number, c as string] = [1, 2, '3']",
        Syntax::Typescript(Default::default()),
        |p| p.parse_module(),
    );
}

#[test]
fn issue_6781() {
    let alloc = Allocator::default();
    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Anon.into(), "import.meta.env".to_string());
    let mut errors = std::vec::Vec::new();
    let expr = parse_file_as_expr(
        &alloc,
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
