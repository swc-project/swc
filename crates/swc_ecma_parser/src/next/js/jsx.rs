//! JSX element and fragment productions with parser-directed child lexing.

use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{Span, Spanned};
use swc_ecma_ast::{
    Expr, Ident, IdentName, JSXAttr, JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXClosingElement,
    JSXClosingFragment, JSXElement, JSXElementChild, JSXElementName, JSXEmptyExpr, JSXExpr,
    JSXExprContainer, JSXFragment, JSXOpeningElement, JSXOpeningFragment, JSXSpreadChild, JSXText,
    SpreadElement, Str,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    /// Parse JSX starting at a normal `<` token or a re-lexed child tag start.
    pub(crate) fn parse_jsx_expression(&mut self) -> Result<Box<Expr>, Error> {
        self.parse_jsx(false)
    }

    fn parse_jsx(&mut self, nested: bool) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        debug_assert!(matches!(self.kind(), Kind::Lt | Kind::JSXTagStart));
        self.advance();
        if self.at(Kind::Gt) {
            return self.parse_jsx_fragment(start, nested);
        }
        self.parse_jsx_element(start, nested)
    }

    fn parse_jsx_element(
        &mut self,
        start: swc_common::BytePos,
        nested: bool,
    ) -> Result<Box<Expr>, Error> {
        let name = self.parse_jsx_element_name()?;
        let mut attributes = Vec::with_capacity(8);
        while !matches!(self.kind(), Kind::Gt | Kind::Slash | Kind::Eof) {
            attributes.push(self.parse_jsx_attribute()?);
        }

        let self_closing = self.eat(Kind::Slash);
        if !self.at(Kind::Gt) {
            return Err(self.expected_error(Kind::Gt));
        }
        let opening_end = self.token().end();
        let opening = JSXOpeningElement {
            name,
            span: Span::new_with_checked(start, opening_end),
            attrs: attributes,
            self_closing,
            type_args: None,
        };
        if self_closing {
            self.advance_after_jsx(nested);
            return Ok(Box::new(Expr::JSXElement(Box::new(JSXElement {
                span: opening.span,
                opening,
                children: Vec::new(),
                closing: None,
            }))));
        }

        self.advance_as_jsx_child();
        let mut children = Vec::with_capacity(8);
        loop {
            match self.kind() {
                Kind::JSXText => {
                    let token = self.token();
                    let raw = Atom::new(self.token_source(token));
                    children.push(JSXElementChild::JSXText(JSXText {
                        span: token.span(),
                        value: raw.clone(),
                        raw,
                    }));
                    self.advance_as_jsx_child();
                }
                Kind::LBrace => children.push(self.parse_jsx_expression_child()?),
                Kind::JSXTagStart if self.is_jsx_closing_start() => break,
                Kind::JSXTagStart => {
                    let expression = self.parse_jsx(true)?;
                    match *expression {
                        Expr::JSXElement(element) => {
                            children.push(JSXElementChild::JSXElement(element))
                        }
                        Expr::JSXFragment(fragment) => {
                            children.push(JSXElementChild::JSXFragment(fragment))
                        }
                        _ => unreachable!(),
                    }
                }
                _ => return Err(self.expected_error(Kind::JSXTagStart)),
            }
        }

        self.advance();
        if !self.expect(Kind::Slash) {
            return Err(self.expected_error(Kind::Slash));
        }
        let closing_start = self.previous_end() - swc_common::BytePos(2);
        let closing_name = self.parse_jsx_element_name()?;
        if !self.at(Kind::Gt) {
            return Err(self.expected_error(Kind::Gt));
        }
        let end = self.token().end();
        let closing = JSXClosingElement {
            span: Span::new_with_checked(closing_start, end),
            name: closing_name,
        };
        self.advance_after_jsx(nested);
        Ok(Box::new(Expr::JSXElement(Box::new(JSXElement {
            span: Span::new_with_checked(start, end),
            opening,
            children,
            closing: Some(closing),
        }))))
    }

    fn parse_jsx_fragment(
        &mut self,
        start: swc_common::BytePos,
        nested: bool,
    ) -> Result<Box<Expr>, Error> {
        let opening_end = self.token().end();
        self.advance_as_jsx_child();
        let mut children = Vec::with_capacity(8);
        loop {
            match self.kind() {
                Kind::JSXText => {
                    let token = self.token();
                    let raw = Atom::new(self.token_source(token));
                    children.push(JSXElementChild::JSXText(JSXText {
                        span: token.span(),
                        value: raw.clone(),
                        raw,
                    }));
                    self.advance_as_jsx_child();
                }
                Kind::LBrace => children.push(self.parse_jsx_expression_child()?),
                Kind::JSXTagStart if self.is_jsx_closing_fragment_start() => break,
                Kind::JSXTagStart => {
                    let expression = self.parse_jsx(true)?;
                    match *expression {
                        Expr::JSXElement(element) => {
                            children.push(JSXElementChild::JSXElement(element))
                        }
                        Expr::JSXFragment(fragment) => {
                            children.push(JSXElementChild::JSXFragment(fragment))
                        }
                        _ => unreachable!(),
                    }
                }
                _ => return Err(self.expected_error(Kind::JSXTagStart)),
            }
        }
        let closing_start = self.token().start();
        self.advance();
        self.advance();
        if !self.at(Kind::Gt) {
            return Err(self.expected_error(Kind::Gt));
        }
        let end = self.token().end();
        self.advance_after_jsx(nested);
        Ok(Box::new(Expr::JSXFragment(JSXFragment {
            span: Span::new_with_checked(start, end),
            opening: JSXOpeningFragment {
                span: Span::new_with_checked(start, opening_end),
            },
            children,
            closing: JSXClosingFragment {
                span: Span::new_with_checked(closing_start, end),
            },
        })))
    }

    fn parse_jsx_element_name(&mut self) -> Result<JSXElementName, Error> {
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let name = JSXElementName::Ident(Ident::new_no_ctxt(
            Atom::new(self.token_source(token)),
            token.span(),
        ));
        self.advance();
        Ok(name)
    }

    fn parse_jsx_attribute(&mut self) -> Result<JSXAttrOrSpread, Error> {
        if self.at(Kind::LBrace) {
            let start = self.token().span();
            self.advance();
            if !self.expect(Kind::DotDotDot) {
                return Err(self.expected_error(Kind::DotDotDot));
            }
            let expression = self.parse_assignment_expression()?;
            if !self.expect(Kind::RBrace) {
                return Err(self.expected_error(Kind::RBrace));
            }
            return Ok(JSXAttrOrSpread::SpreadElement(SpreadElement {
                dot3_token: start,
                expr: expression,
            }));
        }
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let name = JSXAttrName::Ident(IdentName {
            span: token.span(),
            sym: Atom::new(self.token_source(token)),
        });
        self.advance();
        let value = if self.eat(Kind::Eq) {
            Some(self.parse_jsx_attribute_value()?)
        } else {
            None
        };
        let end = value.as_ref().map_or(token.end(), Spanned::span_hi);
        Ok(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: Span::new_with_checked(token.start(), end),
            name,
            value,
        }))
    }

    fn parse_jsx_attribute_value(&mut self) -> Result<JSXAttrValue, Error> {
        if self.at(Kind::Str) {
            let token = self.token();
            let raw = self.token_source(token);
            let value = if token.escaped() {
                self.escaped_string(token)
                    .expect("escaped JSX string must have a decoded value")
                    .clone()
            } else {
                Wtf8Atom::new(&raw[1..raw.len() - 1])
            };
            self.advance();
            return Ok(JSXAttrValue::Str(Str {
                span: token.span(),
                value,
                raw: Some(Atom::new(raw)),
            }));
        }
        if self.at(Kind::LBrace) {
            let start = self.token().start();
            self.advance();
            let expression = self.parse_expression()?;
            if !self.expect(Kind::RBrace) {
                return Err(self.expected_error(Kind::RBrace));
            }
            return Ok(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span: Span::new_with_checked(start, self.previous_end()),
                expr: JSXExpr::Expr(expression),
            }));
        }
        Err(self.expected_error(Kind::Str))
    }

    fn parse_jsx_expression_child(&mut self) -> Result<JSXElementChild, Error> {
        let start = self.token().start();
        self.advance();
        if self.at(Kind::RBrace) {
            let end = self.token().end();
            self.advance_as_jsx_child();
            return Ok(JSXElementChild::JSXExprContainer(JSXExprContainer {
                span: Span::new_with_checked(start, end),
                expr: JSXExpr::JSXEmptyExpr(JSXEmptyExpr {
                    span: Span::new_with_checked(
                        start + swc_common::BytePos(1),
                        self.previous_end(),
                    ),
                }),
            }));
        }
        if self.eat(Kind::DotDotDot) {
            let expression = self.parse_expression()?;
            if !self.at(Kind::RBrace) {
                return Err(self.expected_error(Kind::RBrace));
            }
            let end = self.token().end();
            self.advance_as_jsx_child();
            return Ok(JSXElementChild::JSXSpreadChild(JSXSpreadChild {
                span: Span::new_with_checked(start, end),
                expr: expression,
            }));
        }
        let expression = self.parse_expression()?;
        if !self.at(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        let end = self.token().end();
        self.advance_as_jsx_child();
        Ok(JSXElementChild::JSXExprContainer(JSXExprContainer {
            span: Span::new_with_checked(start, end),
            expr: JSXExpr::Expr(expression),
        }))
    }

    fn is_jsx_closing_start(&mut self) -> bool {
        self.lookahead(|parser| {
            parser.advance();
            parser.at(Kind::Slash)
        })
    }

    fn is_jsx_closing_fragment_start(&mut self) -> bool {
        self.lookahead(|parser| {
            parser.advance();
            if !parser.eat(Kind::Slash) {
                return false;
            }
            parser.at(Kind::Gt)
        })
    }

    fn advance_after_jsx(&mut self, nested: bool) {
        if nested {
            self.advance_as_jsx_child();
        } else {
            self.advance();
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{Expr, JSXElementChild};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn parses_jsx_elements_fragments_and_children_directly() {
        let source = "<App enabled value={answer} {...props}> hello <Child /> {item} <></></App>";
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let expression = parser.parse_expression().unwrap();
        let Expr::JSXElement(element) = &*expression else {
            panic!("expected JSX element")
        };
        assert_eq!(element.opening.attrs.len(), 3);
        assert!(element
            .children
            .iter()
            .any(|child| matches!(child, JSXElementChild::JSXElement(_))));
        assert!(element
            .children
            .iter()
            .any(|child| matches!(child, JSXElementChild::JSXFragment(_))));
    }
}
