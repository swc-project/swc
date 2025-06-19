use swc_common::{Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_lexer::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            buffer::Buffer,
            expr::{parse_assignment_expr, parse_str_lit},
            get_qualified_jsx_name,
            jsx::{
                jsx_expr_container_to_jsx_attr_value, parse_jsx_expr_container,
                parse_jsx_spread_child,
            },
            typescript::{parse_ts_type_args, try_parse_ts},
            PResult, Parser as ParserTrait,
        },
    },
    error::SyntaxError,
    lexer::TokenFlags,
};

use super::{input::Tokens, Parser};
use crate::lexer::Token;

impl<I: Tokens> Parser<I> {
    fn parse_jsx_text(&mut self) -> JSXText {
        let text = swc_ecma_lexer::common::parser::jsx::parse_jsx_text(self);
        self.input_mut().scan_jsx_token(true);
        text
    }

    fn parse_jsx_ident(&mut self) -> PResult<Ident> {
        debug_assert!(self.input().syntax().jsx());
        trace_cur!(self, parse_jsx_ident);
        if self
            .input_mut()
            .cur()
            .is_some_and(|t| matches!(t, Token::JSXName | Token::Ident))
        {
            if self.input().token_flags().contains(TokenFlags::UNICODE) {
                syntax_error!(
                    self,
                    self.input().cur_span(),
                    SyntaxError::InvalidUnicodeEscape
                );
            }
            let t = self.bump();
            let name = t.take_jsx_name(self.input_mut());
            let span = self.input().prev_span();
            Ok(Ident::new_no_ctxt(name, span))
        } else {
            unexpected!(self, "jsx identifier")
        }
    }

    fn parse_jsx_tag_name(&mut self) -> PResult<JSXAttrName> {
        debug_assert!(self.input().syntax().jsx());
        trace_cur!(self, parse_jsx_tag_name);
        let start = self.input_mut().cur_pos();
        self.input_mut().scan_jsx_identifier();

        let ns = self.parse_jsx_ident()?.into();
        Ok(if self.input_mut().eat(&Token::Colon) {
            self.input_mut().scan_jsx_identifier();
            let name: IdentName = self.parse_jsx_ident()?.into();
            JSXAttrName::JSXNamespacedName(JSXNamespacedName {
                span: Span::new(start, name.span.hi),
                ns,
                name,
            })
        } else {
            JSXAttrName::Ident(ns)
        })
    }

    fn parse_jsx_element_name(&mut self) -> PResult<JSXElementName> {
        debug_assert!(self.input().syntax().jsx());
        trace_cur!(self, parse_jsx_element_name);
        let start = self.input_mut().cur_pos();
        let mut node = match self.parse_jsx_tag_name()? {
            JSXAttrName::Ident(i) => JSXElementName::Ident(i.into()),
            JSXAttrName::JSXNamespacedName(i) => JSXElementName::JSXNamespacedName(i),
        };
        while self.input_mut().eat(&Token::Dot) {
            let _ = self.input_mut().cur();
            let prop: IdentName = self.parse_jsx_ident()?.into();
            let new_node = JSXElementName::JSXMemberExpr(JSXMemberExpr {
                span: self.span(start),
                obj: match node {
                    JSXElementName::Ident(i) => JSXObject::Ident(i),
                    JSXElementName::JSXMemberExpr(i) => JSXObject::JSXMemberExpr(Box::new(i)),
                    _ => unreachable!("JSXNamespacedName -> JSXObject"),
                },
                prop,
            });
            node = new_node;
        }
        Ok(node)
    }

    fn parse_jsx_closing_element(
        &mut self,
        in_expr_context: bool,
        open_name: &JSXElementName,
    ) -> PResult<JSXClosingElement> {
        let start = self.cur_pos();
        self.expect(&Token::LessSlash)?;
        let tagname = self.parse_jsx_element_name()?;
        self.expect_without_advance(&Token::Gt)?;
        if in_expr_context {
            self.bump();
        } else {
            self.input_mut().scan_jsx_token(true);
        }

        if get_qualified_jsx_name(open_name) != get_qualified_jsx_name(&tagname) {
            syntax_error!(
                self,
                tagname.span(),
                SyntaxError::JSXExpectedClosingTag {
                    tag: get_qualified_jsx_name(open_name),
                }
            )
        }

        let span = if in_expr_context {
            Span::new(start, self.last_pos())
        } else {
            Span::new(start, self.cur_pos())
        };
        Ok(JSXClosingElement {
            span,
            name: tagname,
        })
    }

    fn parse_jsx_closing_fragment(&mut self, in_expr_context: bool) -> PResult<JSXClosingFragment> {
        let start = self.cur_pos();
        self.expect(&Token::LessSlash)?;
        self.expect_without_advance(&Token::Gt)?;
        if in_expr_context {
            self.bump();
        } else {
            self.input_mut().scan_jsx_token(true);
        }
        let span = Span::new(start, self.cur_pos());
        Ok(JSXClosingFragment { span })
    }

    fn parse_jsx_children(&mut self) -> Vec<JSXElementChild> {
        let mut list = Vec::with_capacity(8);
        loop {
            self.input_mut().rescan_jsx_token(true);
            let Ok(Some(child)) = self.parse_jsx_child(self.input().get_cur().map(|c| c.token))
            else {
                break;
            };
            list.push(child);
        }
        list
    }

    fn parse_jsx_child(&mut self, t: Option<Token>) -> PResult<Option<JSXElementChild>> {
        debug_assert!(self.input().syntax().jsx());
        let Some(t) = t else {
            unexpected!(self, "< (jsx tag start), jsx text or {")
        };

        match t {
            Token::LessSlash => Ok(None),
            Token::LBrace => Ok(Some({
                let ctx = self.ctx() & !Context::InCondExpr & !Context::WillExpectColonForCond;
                self.with_ctx(ctx).parse_with(|p| {
                    if p.input_mut()
                        .peek()
                        .is_some_and(|cur| cur == &Token::DotDotDot)
                    {
                        parse_jsx_spread_child(p).map(JSXElementChild::JSXSpreadChild)
                    } else {
                        parse_jsx_expr_container(p).map(JSXElementChild::JSXExprContainer)
                    }
                })?
            })),
            Token::Lt => {
                let ele = self.parse_jsx_element(false)?;
                match ele {
                    either::Either::Left(frag) => Ok(Some(JSXElementChild::JSXFragment(frag))),
                    either::Either::Right(ele) => {
                        Ok(Some(JSXElementChild::JSXElement(Box::new(ele))))
                    }
                }
            }
            Token::JSXText => Ok(Some(JSXElementChild::JSXText(self.parse_jsx_text()))),
            _ => unreachable!(),
        }
    }

    fn parse_jsx_attr_name(&mut self) -> PResult<JSXAttrName> {
        debug_assert!(self.input().syntax().jsx());
        trace_cur!(self, parse_jsx_attr_name);
        let start = self.input_mut().cur_pos();
        self.input_mut().scan_jsx_identifier();

        let attr_name = self.parse_jsx_ident()?;
        if self.input_mut().eat(&Token::Colon) {
            self.input_mut().scan_jsx_identifier();
            let name = self.parse_jsx_ident()?;
            Ok(JSXAttrName::JSXNamespacedName(JSXNamespacedName {
                span: Span::new(start, name.span.hi),
                ns: attr_name.into(),
                name: name.into(),
            }))
        } else {
            Ok(JSXAttrName::Ident(attr_name.into()))
        }
    }

    fn parse_jsx_attr_value(&mut self) -> PResult<Option<JSXAttrValue>> {
        debug_assert!(self.input().syntax().jsx());
        trace_cur!(self, parse_jsx_attr_value);
        if self.input_mut().eat(&Token::Eq) {
            self.input_mut().scan_jsx_attribute_value();
            let Some(cur) = self.input_mut().cur else {
                let span = self.input().cur_span();
                syntax_error!(self, span, SyntaxError::InvalidJSXValue)
            };
            match cur.token {
                Token::Str => {
                    let value = parse_str_lit(self);
                    Ok(Some(JSXAttrValue::Lit(Lit::Str(value))))
                }
                Token::LBrace => {
                    let start = self.cur_pos();
                    let node = parse_jsx_expr_container(self)?;
                    jsx_expr_container_to_jsx_attr_value(self, start, node).map(Some)
                }
                Token::Lt => match self.parse_jsx_element(true)? {
                    either::Either::Left(frag) => Ok(Some(JSXAttrValue::JSXFragment(frag))),
                    either::Either::Right(ele) => Ok(Some(JSXAttrValue::JSXElement(Box::new(ele)))),
                },
                _ => {
                    let span = self.input().cur_span();
                    syntax_error!(self, span, SyntaxError::InvalidJSXValue)
                }
            }
        } else {
            Ok(None)
        }
    }

    fn parse_jsx_attr(&mut self) -> PResult<JSXAttrOrSpread> {
        debug_assert!(self.input().syntax().jsx());
        trace_cur!(self, parse_jsx_attr);
        if self.input_mut().eat(&Token::LBrace) {
            let dot3_start = self.input_mut().cur_pos();
            self.expect(&Token::DotDotDot)?;
            let dot3_token = self.span(dot3_start);
            let expr = parse_assignment_expr(self)?;
            self.expect(&Token::RBrace)?;
            Ok(JSXAttrOrSpread::SpreadElement(SpreadElement {
                dot3_token,
                expr,
            }))
        } else {
            let start = self.input_mut().cur_pos();
            let name = self.parse_jsx_attr_name()?;
            let value = self
                .with_ctx(self.ctx() & !Context::InCondExpr & !Context::WillExpectColonForCond)
                .parse_with(|p| p.parse_jsx_attr_value())?;
            Ok(JSXAttrOrSpread::JSXAttr(JSXAttr {
                span: self.span(start),
                name,
                value,
            }))
        }
    }

    fn parse_jsx_attrs(&mut self) -> PResult<Vec<JSXAttrOrSpread>> {
        let mut attrs = Vec::with_capacity(8);

        while let Some(cur) = self.input_mut().cur().copied() {
            trace_cur!(self, parse_jsx_opening__attrs_loop);
            if matches!(cur, Token::Gt | Token::Slash) {
                break;
            }
            let attr = self.parse_jsx_attr()?;
            attrs.push(attr);
        }

        Ok(attrs)
    }

    pub(crate) fn parse_jsx_element(
        &mut self,
        in_expr_context: bool,
    ) -> PResult<either::Either<JSXFragment, JSXElement>> {
        debug_assert!(self.input().syntax().jsx());
        trace_cur!(self, parse_jsx_element);

        let start = self.cur_pos();

        let ctx = self.ctx() & !Context::ShouldNotLexLtOrGtAsType;
        self.with_ctx(ctx).parse_with(|p| {
            p.expect(&Token::Lt)?;
            if p.input_mut().cur().is_some_and(|cur| cur == &Token::Gt) {
                // <>xxxxxx</>
                p.input_mut().scan_jsx_token(true);
                let opening = JSXOpeningFragment {
                    span: Span::new(
                        start,
                        p.input.get_cur().map(|cur| cur.span.lo).unwrap_or(start),
                    ),
                };
                let children = p.parse_jsx_children();
                let closing = p.parse_jsx_closing_fragment(in_expr_context)?;
                let span = if in_expr_context {
                    Span::new(start, p.last_pos())
                } else {
                    Span::new(start, p.cur_pos())
                };
                Ok(either::Either::Left(JSXFragment {
                    span,
                    opening,
                    children,
                    closing,
                }))
            } else {
                let name = p
                    .with_ctx(p.ctx() & !Context::ShouldNotLexLtOrGtAsType)
                    .parse_with(|p| p.parse_jsx_element_name())?;
                let type_args = if p.input().syntax().typescript() && p.input_mut().is(&Token::Lt) {
                    try_parse_ts(p, |this| parse_ts_type_args(this).map(Some))
                } else {
                    None
                };
                let attrs = p.parse_jsx_attrs()?;
                if p.input_mut().cur().is_some_and(|cur| cur == &Token::Gt) {
                    // <xxxxx>xxxxx</xxxxx>
                    p.input_mut().scan_jsx_token(true);
                    let span = Span::new(
                        start,
                        p.input.get_cur().map(|cur| cur.span.lo).unwrap_or(start),
                    );
                    let opening = JSXOpeningElement {
                        span,
                        name,
                        type_args,
                        attrs,
                        self_closing: false,
                    };
                    let children = p.parse_jsx_children();
                    let closing = p.parse_jsx_closing_element(in_expr_context, &opening.name)?;
                    let span = if in_expr_context {
                        Span::new(start, p.last_pos())
                    } else {
                        Span::new(start, p.cur_pos())
                    };
                    Ok(either::Either::Right(JSXElement {
                        span,
                        opening,
                        children,
                        closing: Some(closing),
                    }))
                } else {
                    // <xxxxx/>
                    p.expect(&Token::Slash)?;
                    if p.expect_without_advance(&Token::Gt).is_ok() {
                        if in_expr_context {
                            p.bump();
                        } else {
                            p.input_mut().scan_jsx_token(true);
                        }
                    }
                    let span = if in_expr_context {
                        Span::new(start, p.last_pos())
                    } else {
                        Span::new(start, p.cur_pos())
                    };
                    Ok(either::Either::Right(JSXElement {
                        span,
                        opening: JSXOpeningElement {
                            span,
                            name,
                            type_args,
                            attrs,
                            self_closing: true,
                        },
                        children: Vec::new(),
                        closing: None,
                    }))
                }
            }
        })
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
