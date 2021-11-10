use super::*;
use crate::parser::test_parser;
use swc_common::DUMMY_SP as span;
use swc_ecma_visit::assert_eq_ignore_span;

fn jsx(src: &'static str) -> Box<Expr> {
    test_parser(
        src,
        crate::Syntax::Es(crate::EsConfig {
            jsx: true,
            ..Default::default()
        }),
        |p| p.parse_expr(),
    )
}

#[test]
fn self_closing_01() {
    assert_eq_ignore_span!(
        jsx("<a />"),
        Box::new(Expr::JSXElement(Box::new(JSXElement {
            span,
            opening: JSXOpeningElement {
                span,
                name: JSXElementName::Ident(Ident::new("a".into(), span)),
                self_closing: true,
                attrs: vec![],
                type_args: None,
            },
            children: vec![],
            closing: None,
        })))
    );
}

#[test]
fn normal_01() {
    assert_eq_ignore_span!(
        jsx("<a>foo</a>"),
        Box::new(Expr::JSXElement(Box::new(JSXElement {
            span,
            opening: JSXOpeningElement {
                span,
                name: JSXElementName::Ident(Ident::new("a".into(), span)),
                self_closing: false,
                attrs: vec![],
                type_args: None,
            },
            children: vec![JSXElementChild::JSXText(JSXText {
                span,
                raw: "foo".into(),
                value: "foo".into(),
            })],
            closing: Some(JSXClosingElement {
                span,
                name: JSXElementName::Ident(Ident::new("a".into(), span)),
            })
        })))
    );
}

#[test]
fn escape_in_attr() {
    assert_eq_ignore_span!(
        jsx(r#"<div id="w &lt; w" />;"#),
        Box::new(Expr::JSXElement(Box::new(JSXElement {
            span,
            opening: JSXOpeningElement {
                span,
                attrs: vec![JSXAttrOrSpread::JSXAttr(JSXAttr {
                    span,
                    name: JSXAttrName::Ident(Ident::new("id".into(), span)),
                    value: Some(JSXAttrValue::Lit(Lit::Str(Str {
                        span,
                        value: "w < w".into(),
                        has_escape: false,
                        kind: StrKind::Normal {
                            contains_quote: true
                        },
                    }))),
                })],
                name: JSXElementName::Ident(Ident::new("div".into(), span)),
                self_closing: true,
                type_args: None,
            },
            children: vec![],
            closing: None
        })))
    );
}

#[test]
fn issue_584() {
    assert_eq_ignore_span!(
        jsx(r#"<test other={4} />;"#),
        Box::new(Expr::JSXElement(Box::new(JSXElement {
            span,
            opening: JSXOpeningElement {
                span,
                name: JSXElementName::Ident(Ident::new("test".into(), span)),
                attrs: vec![JSXAttrOrSpread::JSXAttr(JSXAttr {
                    span,
                    name: JSXAttrName::Ident(Ident::new("other".into(), span)),
                    value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                        span,
                        expr: JSXExpr::Expr(Box::new(Expr::Lit(Lit::Num(Number {
                            span,
                            value: 4.0
                        }))))
                    })),
                })],
                self_closing: true,
                type_args: None,
            },
            children: vec![],
            closing: None
        })))
    );
}
