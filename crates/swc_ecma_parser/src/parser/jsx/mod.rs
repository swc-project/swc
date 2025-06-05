use swc_ecma_ast::*;
use swc_ecma_lexer::common::parser::{
    buffer::Buffer,
    jsx::{parse_jsx_attrs, parse_jsx_element_name, parse_jsx_text},
    typescript::{parse_ts_type_args, try_parse_ts},
    PResult, Parser as ParserTrait,
};

use super::{input::Tokens, Parser};
use crate::lexer::Token;

impl<I: Tokens> Parser<I> {
    fn parse_jsx_closing_element(&mut self, _in_expr_context: bool) -> PResult<JSXClosingElement> {
        let start = self.cur_pos();
        self.expect(&Token::JSXTagEnd)?;
        let tagname = parse_jsx_element_name(self)?;
        self.expect(&Token::Gt)?;
        Ok(JSXClosingElement {
            span: self.span(start),
            name: tagname,
        })
    }

    fn parse_jsx_children(&mut self) -> Vec<JSXElementChild> {
        let mut list = Vec::with_capacity(8);
        loop {
            self.input_mut().scan_jsx_token(true);
            let Some(child) = self.parse_jsx_child(self.input().get_cur().map(|c| c.token)) else {
                break;
            };
            list.push(child);
        }
        list
    }

    fn parse_jsx_child(&mut self, t: Option<Token>) -> Option<JSXElementChild> {
        debug_assert!(self.input().syntax().jsx());
        let Some(t) = t else {
            todo!("error handle")
            // return None;
        };

        match t {
            Token::JSXTagEnd => None,
            Token::JSXText => Some(JSXElementChild::JSXText(parse_jsx_text(self))),
            Token::LBrace => todo!(),
            Token::Lt => todo!(),
            _ => unreachable!(),
        }
    }

    pub(crate) fn parse_jsx_element(
        &mut self,
        in_expr_context: bool,
    ) -> PResult<either::Either<JSXFragment, JSXElement>> {
        debug_assert!(self.input().syntax().jsx());

        trace_cur!(self, parse_jsx_element);

        let start = self.cur_pos();
        self.expect(&Token::Lt)?;
        if self.input_mut().cur().is_some_and(|cur| cur == &Token::Gt) {
            // <>xxxxxx</>
            self.input_mut().scan_jsx_token(true);
            todo!()
        } else {
            let name = parse_jsx_element_name(self)?;
            let type_args = if self.input().syntax().typescript() && self.input_mut().is(&Token::Lt)
            {
                try_parse_ts(self, |this| parse_ts_type_args(this).map(Some))
            } else {
                None
            };
            let attrs = parse_jsx_attrs(self)?;
            if self.input_mut().cur().is_some_and(|cur| cur == &Token::Gt) {
                // <xxxxx>xxxxx</xxxxx>
                self.input_mut().scan_jsx_token(true);
                let opening = JSXOpeningElement {
                    span: self.span(start),
                    name,
                    type_args,
                    attrs,
                    self_closing: false,
                };
                let children = self.parse_jsx_children();
                let closing = self.parse_jsx_closing_element(in_expr_context)?;
                return Ok(either::Either::Right(JSXElement {
                    span: self.span(start),
                    opening,
                    children,
                    closing: Some(closing),
                }));
            } else {
                // <xxxxx/>
                self.expect(&Token::Slash)?;
                todo!()
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_atoms::atom;
    use swc_common::DUMMY_SP as span;
    use swc_ecma_visit::assert_eq_ignore_span;

    use super::super::*;

    fn jsx(src: &'static str) -> Box<Expr> {
        test_parser(
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
        assert_eq_ignore_span!(
            jsx("<a />"),
            Box::new(Expr::JSXElement(Box::new(JSXElement {
                span,
                opening: JSXOpeningElement {
                    span,
                    name: JSXElementName::Ident(Ident::new_no_ctxt(atom!("a"), span)),
                    self_closing: true,
                    attrs: Vec::new(),
                    type_args: None,
                },
                children: Vec::new(),
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
                    name: JSXElementName::Ident(Ident::new_no_ctxt(atom!("a"), span)),
                    self_closing: false,
                    attrs: Vec::new(),
                    type_args: None,
                },
                children: vec![JSXElementChild::JSXText(JSXText {
                    span,
                    raw: atom!("foo"),
                    value: atom!("foo"),
                })],
                closing: Some(JSXClosingElement {
                    span,
                    name: JSXElementName::Ident(Ident::new_no_ctxt(atom!("a"), span)),
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
                        name: JSXAttrName::Ident(IdentName::new(atom!("id"), span)),
                        value: Some(JSXAttrValue::Lit(Lit::Str(Str {
                            span,
                            value: atom!("w < w"),
                            raw: Some(atom!("\"w &lt; w\"")),
                        }))),
                    })],
                    name: JSXElementName::Ident(Ident::new_no_ctxt(atom!("div"), span)),
                    self_closing: true,
                    type_args: None,
                },
                children: Vec::new(),
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
                    name: JSXElementName::Ident(Ident::new_no_ctxt(atom!("test"), span)),
                    attrs: vec![JSXAttrOrSpread::JSXAttr(JSXAttr {
                        span,
                        name: JSXAttrName::Ident(IdentName::new(atom!("other"), span)),
                        value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                            span,
                            expr: JSXExpr::Expr(Box::new(Expr::Lit(Lit::Num(Number {
                                span,
                                value: 4.0,
                                raw: Some(atom!("4"))
                            }))))
                        })),
                    })],
                    self_closing: true,
                    type_args: None,
                },
                children: Vec::new(),
                closing: None
            })))
        );
    }
}
