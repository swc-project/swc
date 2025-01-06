use swc_allocator::{
    arena::{Allocator, Box, Vec},
    vec,
};
use swc_common::DUMMY_SP as span;
use swc_ecma_ast::arena::*;
use swc_ecma_visit::assert_eq_ignore_span_arena;

use crate::arena::parser::test_parser;

fn jsx<'a>(alloc: &'a Allocator, src: &'static str) -> Expr<'a> {
    test_parser(
        alloc,
        src,
        crate::Syntax::Es(crate::EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        |p| p.parse_expr(),
    )
}

#[test]
fn self_closing_01() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        jsx(&alloc, "<a />"),
        Expr::JSXElement(Box::new_in(
            JSXElement {
                span,
                opening: JSXOpeningElement {
                    span,
                    name: JSXElementName::Ident(Box::new_in(
                        Ident::new_no_ctxt("a".into(), span),
                        &alloc
                    )),
                    self_closing: true,
                    attrs: Vec::new_in(&alloc),
                    type_args: None,
                },
                children: Vec::new_in(&alloc),
                closing: None,
            },
            &alloc
        ))
    );
}

#[test]
fn normal_01() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        jsx(&alloc, "<a>foo</a>"),
        Expr::JSXElement(Box::new_in(
            JSXElement {
                span,
                opening: JSXOpeningElement {
                    span,
                    name: JSXElementName::Ident(Box::new_in(
                        Ident::new_no_ctxt("a".into(), span),
                        &alloc
                    )),
                    self_closing: false,
                    attrs: Vec::new_in(&alloc),
                    type_args: None,
                },
                children: vec![in &alloc; JSXElementChild::JSXText(Box::new_in(JSXText {
                span,
                raw: "foo".into(),
                value: "foo".into(),
            }, &alloc))],
                closing: Some(JSXClosingElement {
                    span,
                    name: JSXElementName::Ident(Box::new_in(
                        Ident::new_no_ctxt("a".into(), span),
                        &alloc
                    )),
                })
            },
            &alloc
        ))
    );
}

#[test]
fn escape_in_attr() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        jsx(&alloc, r#"<div id="w &lt; w" />;"#),
        Expr::JSXElement(Box::new_in(
            JSXElement {
                span,
                opening: JSXOpeningElement {
                    span,
                    attrs: vec![in &alloc; JSXAttrOrSpread::JSXAttr(Box::new_in(
                    JSXAttr {
                    span,
                    name: JSXAttrName::Ident(Box::new_in(IdentName::new("id".into(), span), &alloc)),
                    value: Some(JSXAttrValue::Lit(Box::new_in(Lit::Str(Box::new_in(
Str {
                        span,
                        value: "w < w".into(),
                        raw: Some("\"w &lt; w\"".into()),
                    }
                        , &alloc)), &alloc))),
                }
                    , &alloc))],
                    name: JSXElementName::Ident(Box::new_in(
                        Ident::new_no_ctxt("div".into(), span),
                        &alloc
                    )),
                    self_closing: true,
                    type_args: None,
                },
                children: Vec::new_in(&alloc),
                closing: None
            },
            &alloc
        ))
    );
}

#[test]
fn issue_584() {
    let alloc = Allocator::default();
    assert_eq_ignore_span_arena!(
        jsx(&alloc, r#"<test other={4} />;"#),
        Expr::JSXElement(Box::new_in(
            JSXElement {
                span,
                opening: JSXOpeningElement {
                    span,
                    name: JSXElementName::Ident(Box::new_in(
                        Ident::new_no_ctxt("test".into(), span),
                        &alloc
                    )),
                    attrs: vec![in &alloc; JSXAttrOrSpread::JSXAttr(Box::new_in(
                    JSXAttr {
                    span,
                    name: JSXAttrName::Ident(Box::new_in(IdentName::new("other".into(), span), &alloc)),
                    value: Some(JSXAttrValue::JSXExprContainer(Box::new_in(
JSXExprContainer {
                        span,
                        expr: JSXExpr::Expr(Expr::Lit(Box::new_in(Lit::Num(Box::new_in(
                            Number {
                            span,
                            value: 4.0,
                            raw: Some("4".into())
                        }
                            , &alloc)), &alloc)))
                    }
                        , &alloc))),
                }
                    , &alloc))],
                    self_closing: true,
                    type_args: None,
                },
                children: Vec::new_in(&alloc),
                closing: None
            },
            &alloc
        ))
    );
}
