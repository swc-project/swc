//! Member and call expression chains.

use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    CallExpr, Callee, ComputedPropName, Expr, ExprOrSpread, IdentName, Import, ImportPhase,
    MemberExpr, MemberProp, MetaPropExpr, MetaPropKind, NewExpr, OptCall, OptChainBase,
    OptChainExpr, Super, SuperProp, SuperPropExpr, TaggedTpl,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    /// Parse member, computed member, and call suffixes.
    pub(crate) fn parse_left_hand_side_expression(&mut self) -> Result<Box<Expr>, Error> {
        let expression = if matches!(self.kind(), Kind::Super | Kind::Import) {
            self.parse_special_left_hand_side()?
        } else if self.at(Kind::New) {
            self.parse_new_expression()?
        } else {
            self.parse_primary_expression()?
        };
        self.parse_suffixes(expression, true)
    }

    fn parse_suffixes(
        &mut self,
        mut expression: Box<Expr>,
        allow_call: bool,
    ) -> Result<Box<Expr>, Error> {
        loop {
            match self.kind() {
                Kind::Dot => {
                    self.advance();
                    let property = self.parse_member_identifier()?;
                    expression = Self::make_member(expression, property, false);
                }
                Kind::LBracket => {
                    let property = self.parse_computed_member()?;
                    expression = Self::make_member(expression, property, false);
                }
                Kind::LParen if allow_call => {
                    let arguments = self.parse_arguments()?;
                    expression = Self::make_call(expression, arguments, self.previous_end(), false);
                }
                Kind::OptionalChain => {
                    self.advance();
                    if self.at(Kind::LBracket) {
                        let property = self.parse_computed_member()?;
                        expression = Self::make_member(expression, property, true);
                    } else if allow_call && self.at(Kind::LParen) {
                        let arguments = self.parse_arguments()?;
                        expression =
                            Self::make_call(expression, arguments, self.previous_end(), true);
                    } else {
                        let property = self.parse_member_identifier()?;
                        expression = Self::make_member(expression, property, true);
                    }
                }
                Kind::NoSubstitutionTemplateLiteral | Kind::TemplateHead => {
                    let start = expression.span().lo;
                    let template = self.parse_template_literal(true)?;
                    let end = template.span.hi;
                    expression = Box::new(Expr::TaggedTpl(TaggedTpl {
                        span: Span::new_with_checked(start, end),
                        ctxt: SyntaxContext::empty(),
                        tag: expression,
                        type_params: None,
                        tpl: Box::new(template),
                    }));
                }
                _ => break,
            }
        }

        Ok(expression)
    }

    fn parse_member_identifier(&mut self) -> Result<MemberProp, Error> {
        let property_token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let property = MemberProp::Ident(IdentName {
            span: property_token.span(),
            sym: self.identifier_atom(property_token),
        });
        self.advance();
        Ok(property)
    }

    fn parse_computed_member(&mut self) -> Result<MemberProp, Error> {
        let bracket_start = self.token().start();
        debug_assert!(self.at(Kind::LBracket));
        self.advance();
        let property = self.with_context(
            crate::next::parser::context::Context::IN,
            crate::next::parser::context::Context::empty(),
            Self::parse_expression,
        )?;
        if !self.expect(Kind::RBracket) {
            return Err(self.expected_error(Kind::RBracket));
        }
        Ok(MemberProp::Computed(ComputedPropName {
            span: Span::new_with_checked(bracket_start, self.previous_end()),
            expr: property,
        }))
    }

    fn make_member(expression: Box<Expr>, property: MemberProp, optional: bool) -> Box<Expr> {
        let span = Span::new_with_checked(expression.span().lo, property.span().hi);
        let was_optional_chain = matches!(&*expression, Expr::OptChain(_));
        let member = MemberExpr {
            span,
            obj: expression,
            prop: property,
        };
        if optional || was_optional_chain {
            Box::new(Expr::OptChain(OptChainExpr {
                span,
                optional,
                base: Box::new(OptChainBase::Member(member)),
            }))
        } else {
            Box::new(Expr::Member(member))
        }
    }

    fn make_call(
        expression: Box<Expr>,
        arguments: Vec<ExprOrSpread>,
        end: swc_common::BytePos,
        optional: bool,
    ) -> Box<Expr> {
        let span = Span::new_with_checked(expression.span().lo, end);
        let was_optional_chain = matches!(&*expression, Expr::OptChain(_));
        if optional || was_optional_chain {
            Box::new(Expr::OptChain(OptChainExpr {
                span,
                optional,
                base: Box::new(OptChainBase::Call(OptCall {
                    span,
                    ctxt: SyntaxContext::empty(),
                    callee: expression,
                    args: arguments,
                    type_args: None,
                })),
            }))
        } else {
            Box::new(Expr::Call(CallExpr {
                span,
                ctxt: SyntaxContext::empty(),
                callee: Callee::Expr(expression),
                args: arguments,
                type_args: None,
            }))
        }
    }

    fn parse_new_expression(&mut self) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        self.advance();
        if self.eat(Kind::Dot) {
            let property = self.token();
            if !self.at_identifier_name() || self.token_source(property) != "target" {
                return Err(self.expected_error(Kind::Target));
            }
            self.advance();
            return Ok(Box::new(Expr::MetaProp(MetaPropExpr {
                span: Span::new_with_checked(start, property.end()),
                kind: MetaPropKind::NewTarget,
            })));
        }
        let callee = if self.at(Kind::New) {
            self.parse_new_expression()?
        } else {
            let primary = if self.at(Kind::Super) {
                self.parse_special_left_hand_side()?
            } else {
                self.parse_primary_expression()?
            };
            self.parse_suffixes(primary, false)?
        };
        let arguments = if self.at(Kind::LParen) {
            Some(self.parse_arguments()?)
        } else {
            None
        };
        Ok(Box::new(Expr::New(NewExpr {
            span: Span::new_with_checked(start, self.previous_end()),
            ctxt: SyntaxContext::empty(),
            callee,
            args: arguments,
            type_args: None,
        })))
    }

    fn parse_special_left_hand_side(&mut self) -> Result<Box<Expr>, Error> {
        let token = self.token();
        if self.eat(Kind::Import) {
            if self.eat(Kind::Dot) {
                let property = self.token();
                if !self.at_identifier_name() || self.token_source(property) != "meta" {
                    return Err(self.expected_error(Kind::Meta));
                }
                self.advance();
                return Ok(Box::new(Expr::MetaProp(MetaPropExpr {
                    span: Span::new_with_checked(token.start(), property.end()),
                    kind: MetaPropKind::ImportMeta,
                })));
            }
            if !self.at(Kind::LParen) {
                return Err(self.expected_error(Kind::LParen));
            }
            let arguments = self.parse_arguments()?;
            return Ok(Box::new(Expr::Call(CallExpr {
                span: Span::new_with_checked(token.start(), self.previous_end()),
                ctxt: SyntaxContext::empty(),
                callee: Callee::Import(Import {
                    span: token.span(),
                    phase: ImportPhase::Evaluation,
                }),
                args: arguments,
                type_args: None,
            })));
        }

        debug_assert!(self.eat(Kind::Super));
        let super_object = Super { span: token.span() };
        if self.at(Kind::LParen) {
            let arguments = self.parse_arguments()?;
            return Ok(Box::new(Expr::Call(CallExpr {
                span: Span::new_with_checked(token.start(), self.previous_end()),
                ctxt: SyntaxContext::empty(),
                callee: Callee::Super(super_object),
                args: arguments,
                type_args: None,
            })));
        }
        let property = if self.eat(Kind::Dot) {
            let property_token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let property = SuperProp::Ident(IdentName {
                span: property_token.span(),
                sym: self.identifier_atom(property_token),
            });
            self.advance();
            property
        } else if self.eat(Kind::LBracket) {
            let start = self.previous_end();
            let expression = self.parse_expression()?;
            if !self.expect(Kind::RBracket) {
                return Err(self.expected_error(Kind::RBracket));
            }
            SuperProp::Computed(ComputedPropName {
                span: Span::new_with_checked(start, self.previous_end()),
                expr: expression,
            })
        } else {
            return Err(self.expected_error(Kind::Dot));
        };
        Ok(Box::new(Expr::SuperProp(SuperPropExpr {
            span: Span::new_with_checked(token.start(), self.previous_end()),
            obj: super_object,
            prop: property,
        })))
    }

    fn parse_arguments(&mut self) -> Result<Vec<ExprOrSpread>, Error> {
        debug_assert!(self.at(Kind::LParen));
        self.advance();
        let mut arguments = Vec::with_capacity(2);

        while !self.at(Kind::RParen) && !self.at(Kind::Eof) {
            let spread = if self.at(Kind::DotDotDot) {
                let span = self.token().span();
                self.advance();
                Some(span)
            } else {
                None
            };
            let expression = self.with_context(
                crate::next::parser::context::Context::IN,
                crate::next::parser::context::Context::empty(),
                Self::parse_assignment_expression,
            )?;
            arguments.push(ExprOrSpread {
                spread,
                expr: expression,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }

        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        Ok(arguments)
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{Callee, Expr, MemberProp, MetaPropKind, OptChainBase};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn builds_member_and_call_chain() {
        let lexer = Lexer::new("foo.bar[0](value, ...rest)", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let expression = parser.parse_expression().unwrap();

        let Expr::Call(call) = &*expression else {
            panic!("expected call")
        };
        assert_eq!(call.args.len(), 2);
        assert!(call.args[1].spread.is_some());
        let Callee::Expr(callee) = &call.callee else {
            panic!("expected expression callee")
        };
        let Expr::Member(computed) = &**callee else {
            panic!("expected computed member")
        };
        assert!(matches!(computed.prop, MemberProp::Computed(_)));
        let Expr::Member(dotted) = &*computed.obj else {
            panic!("expected dotted member")
        };
        assert!(matches!(&dotted.prop, MemberProp::Ident(name) if name.sym == "bar"));
    }

    #[test]
    fn builds_nested_new_and_member_expressions() {
        let lexer = Lexer::new("new new Factory(1).value", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let expression = parser.parse_expression().unwrap();
        let Expr::Member(member) = &*expression else {
            panic!("expected member expression")
        };
        let Expr::New(outer) = &*member.obj else {
            panic!("expected outer new expression")
        };
        assert!(matches!(&*outer.callee, Expr::New(_)));
    }

    #[test]
    fn builds_super_import_and_meta_expressions() {
        let lexer = Lexer::new(
            "super(value); super.member; import('dep'); import.meta; new.target;",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();
        assert!(matches!(
            &script.body[0],
            swc_ecma_ast::Stmt::Expr(statement)
                if matches!(&*statement.expr, Expr::Call(call) if matches!(call.callee, Callee::Super(_)))
        ));
        assert!(matches!(
            &script.body[1],
            swc_ecma_ast::Stmt::Expr(statement) if matches!(&*statement.expr, Expr::SuperProp(_))
        ));
        assert!(matches!(
            &script.body[2],
            swc_ecma_ast::Stmt::Expr(statement)
                if matches!(&*statement.expr, Expr::Call(call) if matches!(call.callee, Callee::Import(_)))
        ));
        assert!(matches!(
            &script.body[3],
            swc_ecma_ast::Stmt::Expr(statement)
                if matches!(&*statement.expr, Expr::MetaProp(meta) if meta.kind == MetaPropKind::ImportMeta)
        ));
        assert!(matches!(
            &script.body[4],
            swc_ecma_ast::Stmt::Expr(statement)
                if matches!(&*statement.expr, Expr::MetaProp(meta) if meta.kind == MetaPropKind::NewTarget)
        ));
    }

    #[test]
    fn builds_and_propagates_optional_chains() {
        let lexer = Lexer::new("source?.value.deep?.[key]?.(arg)", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let expression = parser.parse_expression().unwrap();
        let Expr::OptChain(call) = &*expression else {
            panic!("expected optional call")
        };
        assert!(call.optional);
        let OptChainBase::Call(call) = &*call.base else {
            panic!("expected optional call base")
        };
        let Expr::OptChain(computed) = &*call.callee else {
            panic!("expected optional computed member")
        };
        assert!(computed.optional);
        let OptChainBase::Member(computed) = &*computed.base else {
            panic!("expected computed member base")
        };
        let Expr::OptChain(deep) = &*computed.obj else {
            panic!("expected propagated member chain")
        };
        assert!(!deep.optional);
    }
}
