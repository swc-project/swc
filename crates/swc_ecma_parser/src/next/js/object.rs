//! Array and object literal productions.

use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    ArrayLit, AssignProp, ComputedPropName, Expr, ExprOrSpread, Function, GetterProp, Ident,
    IdentName, KeyValueProp, MethodProp, ObjectLit, Prop, PropName, PropOrSpread, SetterProp,
    SpreadElement,
};

use crate::{
    error::Error,
    next::lexer::TokenKind as Kind,
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
                properties.push(self.parse_object_property()?);
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

    fn parse_object_property(&mut self) -> Result<PropOrSpread, Error> {
        let start = self.token().start();
        if self.eat(Kind::Asterisk) {
            let key = self.parse_property_name()?;
            return self.parse_object_method(start, key, false, true, None);
        }

        let prefix = self.kind();
        let prefix_had_escape = self.token().escaped();
        let key = self.parse_property_name()?;
        if self.eat(Kind::Colon) {
            return Ok(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key,
                value: self.parse_assignment_expression()?,
            }))));
        }
        if self.at(Kind::LParen) {
            return self.parse_object_method(start, key, false, false, None);
        }

        #[cfg(feature = "typescript")]
        if self
            .context()
            .contains(crate::next::parser::context::Context::TYPESCRIPT)
            && self.at(Kind::Lt)
        {
            let type_params = Some(self.parse_ts_type_parameters()?);
            return self.parse_object_method(start, key, false, false, type_params);
        }

        if !prefix_had_escape
            && matches!(prefix, Kind::Get | Kind::Set)
            && !matches!(
                self.kind(),
                Kind::Comma | Kind::RBrace | Kind::Eq | Kind::Colon
            )
        {
            let accessor_key = self.parse_property_name()?;
            return self.parse_object_accessor(start, accessor_key, prefix == Kind::Get);
        }
        if !prefix_had_escape
            && prefix == Kind::Async
            && !self.token().had_line_break()
            && !matches!(self.kind(), Kind::Comma | Kind::RBrace | Kind::Eq)
        {
            let is_generator = self.eat(Kind::Asterisk);
            let method_key = self.parse_property_name()?;
            #[cfg(feature = "typescript")]
            let type_params = if self
                .context()
                .contains(crate::next::parser::context::Context::TYPESCRIPT)
                && self.at(Kind::Lt)
            {
                Some(self.parse_ts_type_parameters()?)
            } else {
                None
            };
            #[cfg(not(feature = "typescript"))]
            let type_params = None;
            return self.parse_object_method(start, method_key, true, is_generator, type_params);
        }

        let PropName::Ident(name) = key else {
            return Err(self.expected_error(Kind::Colon));
        };
        let identifier = Ident::new_no_ctxt(name.sym, name.span);
        if self.eat(Kind::Eq) {
            let value = self.parse_assignment_expression()?;
            self.set_cover_initialized_name(Span::new_with_checked(start, value.span().hi));
            return Ok(PropOrSpread::Prop(Box::new(Prop::Assign(AssignProp {
                span: Span::new_with_checked(start, value.span().hi),
                key: identifier,
                value,
            }))));
        }
        Ok(PropOrSpread::Prop(Box::new(Prop::Shorthand(identifier))))
    }

    pub(crate) fn parse_property_name(&mut self) -> Result<PropName, Error> {
        let token = self.token();
        match token.kind() {
            Kind::Str | Kind::Num | Kind::BigInt => {
                let expression = self.parse_primary_expression()?;
                match *expression {
                    Expr::Lit(swc_ecma_ast::Lit::Str(value)) => Ok(PropName::Str(value)),
                    Expr::Lit(swc_ecma_ast::Lit::Num(value)) => Ok(PropName::Num(value)),
                    Expr::Lit(swc_ecma_ast::Lit::BigInt(value)) => Ok(PropName::BigInt(value)),
                    _ => unreachable!("property literal token must produce a literal expression"),
                }
            }
            Kind::LBracket => {
                let start = token.start();
                self.advance();
                let expression = self.with_context(
                    crate::next::parser::context::Context::IN,
                    crate::next::parser::context::Context::empty(),
                    Self::parse_assignment_expression,
                )?;
                if !self.expect(Kind::RBracket) {
                    return Err(self.expected_error(Kind::RBracket));
                }
                Ok(PropName::Computed(ComputedPropName {
                    span: Span::new_with_checked(start, self.previous_end()),
                    expr: expression,
                }))
            }
            _ if self.at_identifier_name() => {
                let name = IdentName {
                    span: token.span(),
                    sym: self.identifier_atom(token),
                };
                self.advance();
                Ok(PropName::Ident(name))
            }
            _ => Err(self.expected_error(Kind::Ident)),
        }
    }

    fn parse_object_method(
        &mut self,
        start: swc_common::BytePos,
        key: PropName,
        is_async: bool,
        is_generator: bool,
        type_params: Option<Box<swc_ecma_ast::TsTypeParamDecl>>,
    ) -> Result<PropOrSpread, Error> {
        let mut parameter_context = crate::next::parser::context::Context::NEW_TARGET;
        if is_async {
            parameter_context.insert(crate::next::parser::context::Context::AWAIT);
        }
        if is_generator {
            parameter_context.insert(crate::next::parser::context::Context::YIELD);
        }
        let parameters = self.with_context(
            parameter_context,
            crate::next::parser::context::Context::YIELD
                | crate::next::parser::context::Context::AWAIT,
            Self::parse_method_parameters,
        )?;
        #[cfg(feature = "typescript")]
        let return_type = if self
            .context()
            .contains(crate::next::parser::context::Context::TYPESCRIPT)
            && self.at(Kind::Colon)
        {
            Some(self.parse_ts_type_annotation()?)
        } else {
            None
        };
        #[cfg(not(feature = "typescript"))]
        let return_type = None;
        if !self.at(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let mut context = crate::next::parser::context::Context::RETURN
            | crate::next::parser::context::Context::NEW_TARGET;
        if is_async {
            context.insert(crate::next::parser::context::Context::AWAIT);
        }
        if is_generator {
            context.insert(crate::next::parser::context::Context::YIELD);
        }
        let body = self.with_context(
            context,
            crate::next::parser::context::Context::TOP_LEVEL
                | crate::next::parser::context::Context::RETURN
                | crate::next::parser::context::Context::YIELD
                | crate::next::parser::context::Context::AWAIT,
            Self::parse_block_statement,
        )?;
        let span = Span::new_with_checked(start, body.span.hi);
        Ok(PropOrSpread::Prop(Box::new(Prop::Method(MethodProp {
            key,
            function: Box::new(Function {
                params: parameters,
                decorators: Vec::new(),
                span,
                ctxt: SyntaxContext::empty(),
                body: Some(body),
                is_generator,
                is_async,
                type_params,
                return_type,
            }),
        }))))
    }

    fn parse_object_accessor(
        &mut self,
        start: swc_common::BytePos,
        key: PropName,
        is_getter: bool,
    ) -> Result<PropOrSpread, Error> {
        let mut parameters = self.with_context(
            crate::next::parser::context::Context::NEW_TARGET,
            crate::next::parser::context::Context::YIELD
                | crate::next::parser::context::Context::AWAIT,
            Self::parse_method_parameters,
        )?;
        #[cfg(feature = "typescript")]
        let type_ann = if self
            .context()
            .contains(crate::next::parser::context::Context::TYPESCRIPT)
            && self.at(Kind::Colon)
        {
            Some(self.parse_ts_type_annotation()?)
        } else {
            None
        };
        #[cfg(not(feature = "typescript"))]
        let type_ann = None;
        if (is_getter && !parameters.is_empty()) || (!is_getter && parameters.len() != 1) {
            return Err(self.expected_error(Kind::LBrace));
        }
        if !self.at(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let body = self.with_context(
            crate::next::parser::context::Context::RETURN
                | crate::next::parser::context::Context::NEW_TARGET,
            crate::next::parser::context::Context::TOP_LEVEL
                | crate::next::parser::context::Context::RETURN
                | crate::next::parser::context::Context::YIELD
                | crate::next::parser::context::Context::AWAIT,
            Self::parse_block_statement,
        )?;
        let span = Span::new_with_checked(start, body.span.hi);
        let property = if is_getter {
            Prop::Getter(GetterProp {
                span,
                key,
                type_ann,
                body: Some(body),
            })
        } else {
            Prop::Setter(SetterProp {
                span,
                key,
                this_param: None,
                param: Box::new(
                    parameters
                        .pop()
                        .expect("setter parameter was validated")
                        .pat,
                ),
                body: Some(body),
            })
        };
        Ok(PropOrSpread::Prop(Box::new(property)))
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
