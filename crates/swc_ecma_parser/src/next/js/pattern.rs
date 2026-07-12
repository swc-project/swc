//! JavaScript binding patterns shared by declarations and parameters.

use swc_common::{Span, Spanned};
use swc_ecma_ast::{
    ArrayPat, AssignOp, AssignPat, AssignPatProp, AssignTarget, AssignTargetPat, BindingIdent,
    Expr, Ident, KeyValuePatProp, ObjectPat, ObjectPatProp, Pat, Prop, PropName, RestPat,
    SimpleAssignTarget,
};

#[cfg(feature = "typescript")]
use crate::next::parser::context::Context;
use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    /// Reinterpret an expression parsed before a `for-in`/`for-of` delimiter
    /// as an assignment pattern without cloning the parser or source.
    pub(crate) fn reparse_assignment_pattern(
        &mut self,
        expression: Box<Expr>,
    ) -> Result<Pat, Error> {
        let span = expression.span();
        match *expression {
            Expr::Ident(id) => Ok(Pat::Ident(BindingIdent { id, type_ann: None })),
            Expr::Paren(parenthesis) => self.reparse_assignment_pattern(parenthesis.expr),
            Expr::Array(array) => {
                let mut elements = Vec::with_capacity(array.elems.len());
                for element in array.elems {
                    elements.push(match element {
                        None => None,
                        Some(element) if element.spread.is_some() => {
                            let dot3_token = element.spread.unwrap();
                            let argument = self.reparse_assignment_pattern(element.expr)?;
                            Some(Pat::Rest(RestPat {
                                span: Span::new_with_checked(dot3_token.lo, argument.span().hi),
                                dot3_token,
                                arg: Box::new(argument),
                                type_ann: None,
                            }))
                        }
                        Some(element) => Some(self.reparse_assignment_pattern(element.expr)?),
                    });
                }
                while elements.last().is_some_and(Option::is_none) {
                    elements.pop();
                }
                Ok(Pat::Array(ArrayPat {
                    span: array.span,
                    elems: elements,
                    optional: false,
                    type_ann: None,
                }))
            }
            Expr::Object(object) => {
                let mut properties = Vec::with_capacity(object.props.len());
                for property in object.props {
                    properties.push(match property {
                        swc_ecma_ast::PropOrSpread::Spread(spread) => {
                            let argument = self.reparse_assignment_pattern(spread.expr)?;
                            ObjectPatProp::Rest(RestPat {
                                span: Span::new_with_checked(
                                    spread.dot3_token.lo,
                                    argument.span().hi,
                                ),
                                dot3_token: spread.dot3_token,
                                arg: Box::new(argument),
                                type_ann: None,
                            })
                        }
                        swc_ecma_ast::PropOrSpread::Prop(property) => match *property {
                            Prop::Shorthand(id) => ObjectPatProp::Assign(AssignPatProp {
                                span: id.span,
                                key: BindingIdent { id, type_ann: None },
                                value: None,
                            }),
                            Prop::Assign(property) => ObjectPatProp::Assign(AssignPatProp {
                                span: property.span,
                                key: BindingIdent {
                                    id: property.key,
                                    type_ann: None,
                                },
                                value: Some(property.value),
                            }),
                            Prop::KeyValue(property) => ObjectPatProp::KeyValue(KeyValuePatProp {
                                key: property.key,
                                value: Box::new(self.reparse_assignment_pattern(property.value)?),
                            }),
                            _ => {
                                return Err(Error::new(
                                    span,
                                    crate::error::SyntaxError::InvalidAssignTarget,
                                ));
                            }
                        },
                    });
                }
                Ok(Pat::Object(ObjectPat {
                    span: object.span,
                    props: properties,
                    optional: false,
                    type_ann: None,
                }))
            }
            Expr::Assign(assignment) if assignment.op == AssignOp::Assign => {
                let left = match assignment.left {
                    AssignTarget::Simple(SimpleAssignTarget::Ident(identifier)) => {
                        Pat::Ident(identifier)
                    }
                    AssignTarget::Simple(simple) => Pat::Expr(simple.into()),
                    AssignTarget::Pat(AssignTargetPat::Array(array)) => Pat::Array(array),
                    AssignTarget::Pat(AssignTargetPat::Object(object)) => Pat::Object(object),
                    AssignTarget::Pat(AssignTargetPat::Invalid(invalid)) => Pat::Invalid(invalid),
                };
                Ok(Pat::Assign(AssignPat {
                    span: assignment.span,
                    left: Box::new(left),
                    right: assignment.right,
                }))
            }
            expression @ (Expr::Member(_) | Expr::SuperProp(_)) => {
                Ok(Pat::Expr(Box::new(expression)))
            }
            _ => Err(Error::new(
                span,
                crate::error::SyntaxError::InvalidAssignTarget,
            )),
        }
    }

    pub(crate) fn reparse_assignment_target(
        &mut self,
        expression: Box<Expr>,
    ) -> Result<AssignTarget, Error> {
        match AssignTarget::try_from(expression) {
            Ok(target) => Ok(target),
            Err(expression) => {
                let pattern = self.reparse_assignment_pattern(expression)?;
                AssignTarget::try_from(pattern).map_err(|pattern| {
                    Error::new(
                        pattern.span(),
                        crate::error::SyntaxError::InvalidAssignTarget,
                    )
                })
            }
        }
    }

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
                let identifier = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
                self.advance();
                Pat::Ident(BindingIdent {
                    id: identifier,
                    type_ann: None,
                })
            }
        };

        #[cfg(feature = "typescript")]
        let pattern = {
            let mut pattern = pattern;
            if self.context().contains(Context::TYPESCRIPT) && self.at(Kind::Colon) {
                let type_ann = self.parse_ts_type_annotation()?;
                match &mut pattern {
                    Pat::Ident(pattern) => pattern.type_ann = Some(type_ann),
                    Pat::Array(pattern) => pattern.type_ann = Some(type_ann),
                    Pat::Object(pattern) => pattern.type_ann = Some(type_ann),
                    Pat::Rest(pattern) => pattern.type_ann = Some(type_ann),
                    _ => return Err(self.expected_error(Kind::Ident)),
                }
            }
            pattern
        };

        if !allow_default || !self.eat(Kind::Eq) {
            return Ok(pattern);
        }
        let start = pattern.span().lo;
        let right = self.with_context(
            crate::next::parser::context::Context::IN,
            crate::next::parser::context::Context::empty(),
            Self::parse_assignment_expression,
        )?;
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
            let key = self.parse_property_name()?;
            if self.eat(Kind::Colon) {
                let value = self.parse_binding_pattern(true)?;
                properties.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                    key,
                    value: Box::new(value),
                }));
            } else {
                let PropName::Ident(name) = key else {
                    return Err(self.expected_error(Kind::Colon));
                };
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
                        id: Ident::new_no_ctxt(name.sym, name.span),
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
