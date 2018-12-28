use super::*;
use crate::parser::test_parser;
use swc_common::DUMMY_SP as span;

fn jsx(src: &'static str) -> Box<Expr> {
    test_parser(src, Syntax::Jsx, |p| p.parse_expr())
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
                attrs: vec![]
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
                attrs: vec![]
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
