//! JavaScript binding patterns shared by declarations and parameters.

use swc_atoms::Atom;
use swc_common::{Span, Spanned};
use swc_ecma_ast::{
    ArrayPat, AssignPat, AssignPatProp, BindingIdent, Ident, IdentName, KeyValuePatProp, ObjectPat,
    ObjectPatProp, Pat, PropName, RestPat,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    /// Parse a binding identifier, array pattern, or object pattern.
    pub(crate) fn parse_binding_pattern(&mut self, allow_default: bool) -> Result<Pat, Error> {
        let pattern = match self.kind() {
            Kind::LBracket => Pat::Array(self.parse_array_binding_pattern()?),
            Kind::LBrace => Pat::Object(self.parse_object_binding_pattern()?),
            _ => {
                let token = self.token();
                if !self.at_identifier_reference() {
                    return Err(self.expected_error(Kind::Ident));
                }
                let identifier =
                    Ident::new_no_ctxt(Atom::new(self.token_source(token)), token.span());
                self.advance();
                Pat::Ident(BindingIdent {
                    id: identifier,
                    type_ann: None,
                })
            }
        };

        if !allow_default || !self.eat(Kind::Eq) {
            return Ok(pattern);
        }
        let start = pattern.span().lo;
        let right = self.parse_assignment_expression()?;
        Ok(Pat::Assign(AssignPat {
            span: Span::new_with_checked(start, right.span().hi),
            left: Box::new(pattern),
            right,
        }))
    }

    fn parse_array_binding_pattern(&mut self) -> Result<ArrayPat, Error> {
        let start = self.token().start();
        self.advance();
        let mut elements = Vec::with_capacity(8);
        while !self.at(Kind::RBracket) && !self.at(Kind::Eof) {
            if self.eat(Kind::Comma) {
                elements.push(None);
                continue;
            }
            if self.at(Kind::DotDotDot) {
                let dot3_token = self.token().span();
                self.advance();
                let argument = self.parse_binding_pattern(false)?;
                let span = Span::new_with_checked(dot3_token.lo, argument.span().hi);
                elements.push(Some(Pat::Rest(RestPat {
                    span,
                    dot3_token,
                    arg: Box::new(argument),
                    type_ann: None,
                })));
                self.eat(Kind::Comma);
                break;
            }
            elements.push(Some(self.parse_binding_pattern(true)?));
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RBracket) {
            return Err(self.expected_error(Kind::RBracket));
        }
        Ok(ArrayPat {
            span: Span::new_with_checked(start, self.previous_end()),
            elems: elements,
            optional: false,
            type_ann: None,
        })
    }

    fn parse_object_binding_pattern(&mut self) -> Result<ObjectPat, Error> {
        let start = self.token().start();
        self.advance();
        let mut properties = Vec::with_capacity(8);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            if self.at(Kind::DotDotDot) {
                let dot3_token = self.token().span();
                self.advance();
                let argument = self.parse_binding_pattern(false)?;
                let span = Span::new_with_checked(dot3_token.lo, argument.span().hi);
                properties.push(ObjectPatProp::Rest(RestPat {
                    span,
                    dot3_token,
                    arg: Box::new(argument),
                    type_ann: None,
                }));
                self.eat(Kind::Comma);
                break;
            }

            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let symbol = Atom::new(self.token_source(token));
            let key = PropName::Ident(IdentName {
                span: token.span(),
                sym: symbol.clone(),
            });
            self.advance();
            if self.eat(Kind::Colon) {
                let value = self.parse_binding_pattern(true)?;
                properties.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                    key,
                    value: Box::new(value),
                }));
            } else {
                let value = if self.eat(Kind::Eq) {
                    Some(self.parse_assignment_expression()?)
                } else {
                    None
                };
                let end = value
                    .as_ref()
                    .map_or(token.end(), |expression| expression.span().hi);
                properties.push(ObjectPatProp::Assign(AssignPatProp {
                    span: Span::new_with_checked(token.start(), end),
                    key: BindingIdent {
                        id: Ident::new_no_ctxt(symbol, token.span()),
                        type_ann: None,
                    },
                    value,
                }));
            }
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok(ObjectPat {
            span: Span::new_with_checked(start, self.previous_end()),
            props: properties,
            optional: false,
            type_ann: None,
        })
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{ObjectPatProp, Pat};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn parses_nested_binding_patterns_directly() {
        let lexer = Lexer::new(
            "{ first: [value = 1, ...tail], other, ...rest }",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let Pat::Object(object) = parser.parse_binding_pattern(false).unwrap() else {
            panic!("expected object pattern")
        };
        assert_eq!(object.props.len(), 3);
        let ObjectPatProp::KeyValue(first) = &object.props[0] else {
            panic!("expected key-value pattern")
        };
        assert!(matches!(&*first.value, Pat::Array(_)));
        assert!(matches!(object.props[2], ObjectPatProp::Rest(_)));
    }
}
