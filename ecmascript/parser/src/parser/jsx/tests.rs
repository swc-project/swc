use super::*;
use crate::parser::test_parser;
use swc_common::DUMMY_SP as span;

fn jsx(src: &'static str) -> Box<Expr> {
    test_parser(
        src,
        ::Syntax::Es(::EsConfig {
            jsx: true,
            ..Default::default()
        }),
        |p| {
            p.parse_expr().map_err(|e| {
                e.emit();
                ()
            })
        },
    )
}

#[test]
fn self_closing_01() {
    assert_eq_ignore_span!(
        jsx("<a />"),
        box Expr::JSXElement(JSXElement {
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
        })
    );
}

#[test]
fn normal_01() {
    assert_eq_ignore_span!(
        jsx("<a>foo</a>"),
        box Expr::JSXElement(JSXElement {
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
        })
    );
}

#[test]
fn escape_in_attr() {
    assert_eq_ignore_span!(
        jsx(r#"<div id="w &lt; w" />;"#),
        box Expr::JSXElement(JSXElement {
            span,
            opening: JSXOpeningElement {
                span,
                attrs: vec![JSXAttrOrSpread::JSXAttr(JSXAttr {
                    span,
                    name: JSXAttrName::Ident(Ident::new("id".into(), span)),
                    value: Some(box Expr::Lit(Lit::Str(Str {
                        span,
                        value: "w < w".into(),
                        has_escape: false,
                    }))),
                })],
                name: JSXElementName::Ident(Ident::new("div".into(), span)),
                self_closing: true,
                type_args: None,
            },
            children: vec![],
            closing: None
        })
    );
}
