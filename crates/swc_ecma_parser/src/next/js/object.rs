//! Array and object literal productions.

use swc_atoms::Atom;
use swc_common::Span;
use swc_ecma_ast::{
    ArrayLit, Expr, ExprOrSpread, Ident, IdentName, KeyValueProp, ObjectLit, Prop, PropName,
    PropOrSpread, SpreadElement,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    pub(crate) fn parse_array_literal(&mut self) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        debug_assert!(self.at(Kind::LBracket));
        self.advance();
        let mut elements = Vec::with_capacity(8);

        while !self.at(Kind::RBracket) && !self.at(Kind::Eof) {
            if self.eat(Kind::Comma) {
                elements.push(None);
                continue;
            }
            let spread = if self.at(Kind::DotDotDot) {
                let span = self.token().span();
                self.advance();
                Some(span)
            } else {
                None
            };
            elements.push(Some(ExprOrSpread {
                spread,
                expr: self.parse_assignment_expression()?,
            }));
            if !self.eat(Kind::Comma) {
                break;
            }
        }

        if !self.expect(Kind::RBracket) {
            return Err(self.expected_error(Kind::RBracket));
        }
        Ok(Box::new(Expr::Array(ArrayLit {
            span: Span::new_with_checked(start, self.previous_end()),
            elems: elements,
        })))
    }

    pub(crate) fn parse_object_literal(&mut self) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        debug_assert!(self.at(Kind::LBrace));
        self.advance();
        let mut properties = Vec::with_capacity(8);

        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            if self.at(Kind::DotDotDot) {
                let spread = self.token().span();
                self.advance();
                properties.push(PropOrSpread::Spread(SpreadElement {
                    dot3_token: spread,
                    expr: self.parse_assignment_expression()?,
                }));
            } else {
                let token = self.token();
                if !self.at_identifier_name() {
                    return Err(self.expected_error(Kind::Ident));
                }
                let symbol = Atom::new(self.token_source(token));
                let identifier = Ident::new_no_ctxt(symbol.clone(), token.span());
                self.advance();
                let property = if self.eat(Kind::Colon) {
                    Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(IdentName {
                            span: token.span(),
                            sym: symbol,
                        }),
                        value: self.parse_assignment_expression()?,
                    })
                } else {
                    Prop::Shorthand(identifier)
                };
                properties.push(PropOrSpread::Prop(Box::new(property)));
            }

            if !self.eat(Kind::Comma) {
                break;
            }
        }

        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok(Box::new(Expr::Object(ObjectLit {
            span: Span::new_with_checked(start, self.previous_end()),
            props: properties,
        })))
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{Expr, Prop, PropOrSpread};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    fn parse(source: &str) -> Box<Expr> {
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        parser.parse_expression().unwrap()
    }

    #[test]
    fn parses_array_holes_and_spread() {
        let expression = parse("[first,, ...rest]");
        let Expr::Array(array) = &*expression else {
            panic!("expected array")
        };
        assert_eq!(array.elems.len(), 3);
        assert!(array.elems[1].is_none());
        assert!(array.elems[2].as_ref().unwrap().spread.is_some());
    }

    #[test]
    fn parses_object_properties_and_spread() {
        let expression = parse("{value, answer: 42, ...rest}");
        let Expr::Object(object) = &*expression else {
            panic!("expected object")
        };
        assert_eq!(object.props.len(), 3);
        assert!(matches!(
            &object.props[0],
            PropOrSpread::Prop(property) if matches!(&**property, Prop::Shorthand(_))
        ));
        assert!(matches!(&object.props[2], PropOrSpread::Spread(_)));
    }
}
