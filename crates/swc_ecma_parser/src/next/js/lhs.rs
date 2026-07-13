//! Member and call expression chains.

use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    CallExpr, Callee, ComputedPropName, Expr, ExprOrSpread, IdentName, Import, ImportPhase,
    MemberExpr, MemberProp, MetaPropExpr, MetaPropKind, NewExpr, OptCall, OptChainBase,
    OptChainExpr, PrivateName, Super, SuperProp, SuperPropExpr, TaggedTpl,
};
#[cfg(feature = "typescript")]
use swc_ecma_ast::{TsInstantiation, TsNonNullExpr, TsTypeParamInstantiation};

use crate::{
    error::Error,
    next::{
        lexer::{config::Config, TokenKind as Kind},
        parser::{context::Context, cursor::Parser},
    },
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
                    } else if self
                        .context()
                        .contains(crate::next::parser::context::Context::TYPESCRIPT)
                        && self.at(Kind::Lt)
                    {
                        let type_args = self.parse_ts_type_arguments()?;
                        if !self.at(Kind::LParen) {
                            return Err(self.expected_error(Kind::LParen));
                        }
                        let arguments = self.parse_arguments()?;
                        expression =
                            Self::make_call(expression, arguments, self.previous_end(), true);
                        Self::set_call_type_args(&mut expression, type_args);
                    } else {
                        let property = self.parse_member_identifier()?;
                        expression = Self::make_member(expression, property, true);
                    }
                }
                #[cfg(feature = "typescript")]
                Kind::Lt | Kind::LShift
                    if self
                        .context()
                        .contains(crate::next::parser::context::Context::TYPESCRIPT)
                        && allow_call
                        && self.lookahead(|parser| {
                            if parser.at(Kind::LShift) {
                                parser.re_lex_ts_left_angle();
                            }
                            if parser.parse_ts_type_arguments().is_err() {
                                return false;
                            }
                            if matches!(
                                parser.kind(),
                                Kind::LParen
                                    | Kind::NoSubstitutionTemplateLiteral
                                    | Kind::TemplateHead
                            ) {
                                return true;
                            }
                            if matches!(
                                parser.kind(),
                                Kind::Lt
                                    | Kind::Gt
                                    | Kind::GtEq
                                    | Kind::RShift
                                    | Kind::Plus
                                    | Kind::Minus
                                    | Kind::LBracket
                            ) {
                                return false;
                            }
                            parser.token().had_line_break()
                                || !matches!(
                                    parser.kind(),
                                    Kind::Ident
                                        | Kind::This
                                        | Kind::Num
                                        | Kind::BigInt
                                        | Kind::Str
                                        | Kind::True
                                        | Kind::False
                                        | Kind::Null
                                        | Kind::LBrace
                                        | Kind::Class
                                        | Kind::Function
                                )
                        }) =>
                {
                    if self.at(Kind::LShift) {
                        self.re_lex_ts_left_angle();
                    }
                    let start = expression.span().lo;
                    let type_args = self.parse_ts_type_arguments()?;
                    if allow_call && self.at(Kind::LParen) {
                        let arguments = self.parse_arguments()?;
                        expression =
                            Self::make_call(expression, arguments, self.previous_end(), false);
                        Self::set_call_type_args(&mut expression, type_args);
                    } else if matches!(
                        self.kind(),
                        Kind::NoSubstitutionTemplateLiteral | Kind::TemplateHead
                    ) {
                        let template = self.parse_template_literal(true)?;
                        let end = template.span.hi;
                        expression = Box::new(Expr::TaggedTpl(TaggedTpl {
                            span: Span::new_with_checked(start, end),
                            ctxt: SyntaxContext::empty(),
                            tag: expression,
                            type_params: Some(type_args),
                            tpl: Box::new(template),
                        }));
                    } else {
                        expression = Box::new(Expr::TsInstantiation(TsInstantiation {
                            span: Span::new_with_checked(start, self.previous_end()),
                            expr: expression,
                            type_args,
                        }));
                    }
                }
                Kind::NoSubstitutionTemplateLiteral | Kind::TemplateHead => {
                    if matches!(&*expression, Expr::OptChain(_))
                        && !self
                            .context()
                            .contains(crate::next::parser::context::Context::TYPESCRIPT)
                    {
                        return Err(Error::new(
                            expression.span(),
                            crate::error::SyntaxError::TaggedTplInOptChain,
                        ));
                    }
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
                #[cfg(feature = "typescript")]
                Kind::Bang
                    if self
                        .context()
                        .contains(crate::next::parser::context::Context::TYPESCRIPT)
                        && !self.token().had_line_break() =>
                {
                    let start = expression.span().lo;
                    self.advance();
                    expression = Box::new(Expr::TsNonNull(TsNonNullExpr {
                        span: Span::new_with_checked(start, self.previous_end()),
                        expr: expression,
                    }));
                }
                _ => break,
            }
        }

        Ok(expression)
    }

    fn parse_member_identifier(&mut self) -> Result<MemberProp, Error> {
        if self.at(Kind::Hash) {
            let hash = self.token();
            let start = hash.start();
            self.advance();
            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            if token.start() != hash.end() {
                self.emit_error(Error::new(
                    Span::new_with_checked(hash.start(), token.end()),
                    crate::error::SyntaxError::Unexpected {
                        got: "whitespace after #".into(),
                        expected: "private name adjacent to #",
                    },
                ));
            }
            let property = MemberProp::PrivateName(PrivateName {
                span: Span::new_with_checked(start, token.end()),
                name: self.identifier_atom(token),
            });
            if let MemberProp::PrivateName(private) = &property {
                self.record_private_use(private.name.clone(), private.span);
            }
            self.advance();
            return Ok(property);
        }
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

    #[cfg(feature = "typescript")]
    fn set_call_type_args(expression: &mut Box<Expr>, type_args: Box<TsTypeParamInstantiation>) {
        match &mut **expression {
            Expr::Call(call) => call.type_args = Some(type_args),
            Expr::OptChain(chain) => {
                let OptChainBase::Call(call) = &mut *chain.base else {
                    unreachable!("optional generic call must produce a call chain")
                };
                call.type_args = Some(type_args);
            }
            _ => unreachable!("generic call must produce a call expression"),
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
            if !self
                .context()
                .contains(crate::next::parser::context::Context::NEW_TARGET)
            {
                return Err(Error::new(
                    Span::new_with_checked(start, property.end()),
                    crate::error::SyntaxError::InvalidNewTarget,
                ));
            }
            return Ok(Box::new(Expr::MetaProp(MetaPropExpr {
                span: Span::new_with_checked(start, property.end()),
                kind: MetaPropKind::NewTarget,
            })));
        }
        let mut callee = if self.at(Kind::New) {
            self.parse_new_expression()?
        } else {
            let primary = if self.at(Kind::Super) {
                self.parse_special_left_hand_side()?
            } else {
                self.parse_primary_expression()?
            };
            self.parse_suffixes(primary, false)?
        };
        if matches!(&*callee, Expr::OptChain(_)) {
            return Err(Error::new(
                callee.span(),
                crate::error::SyntaxError::OptChainCannotFollowConstructorCall,
            ));
        }
        #[cfg(feature = "typescript")]
        let mut type_args = if self
            .context()
            .contains(crate::next::parser::context::Context::TYPESCRIPT)
            && matches!(self.kind(), Kind::Lt | Kind::LShift)
            && self.lookahead(|parser| {
                if parser.at(Kind::LShift) {
                    parser.re_lex_ts_left_angle();
                }
                parser.parse_ts_type_arguments().is_ok()
            }) {
            if self.at(Kind::LShift) {
                self.re_lex_ts_left_angle();
            }
            Some(self.parse_ts_type_arguments()?)
        } else {
            None
        };
        #[cfg(not(feature = "typescript"))]
        let mut type_args = None;
        #[cfg(feature = "typescript")]
        if matches!(
            self.kind(),
            Kind::NoSubstitutionTemplateLiteral | Kind::TemplateHead
        ) {
            let template = self.parse_template_literal(true)?;
            let tag_start = callee.span().lo;
            let end = template.span.hi;
            callee = Box::new(Expr::TaggedTpl(TaggedTpl {
                span: Span::new_with_checked(tag_start, end),
                ctxt: SyntaxContext::empty(),
                tag: callee,
                type_params: type_args.take(),
                tpl: Box::new(template),
            }));
        }
        let arguments = if self.at(Kind::LParen) {
            Some(self.parse_arguments()?)
        } else {
            None
        };
        #[cfg(feature = "typescript")]
        if arguments.is_none() {
            if let Some(type_args) = type_args.take() {
                let callee_start = callee.span().lo;
                callee = Box::new(Expr::TsInstantiation(TsInstantiation {
                    span: Span::new_with_checked(callee_start, type_args.span.hi),
                    expr: callee,
                    type_args,
                }));
            }
        }
        Ok(Box::new(Expr::New(NewExpr {
            span: Span::new_with_checked(start, self.previous_end()),
            ctxt: SyntaxContext::empty(),
            callee,
            args: arguments,
            type_args,
        })))
    }

    fn parse_special_left_hand_side(&mut self) -> Result<Box<Expr>, Error> {
        let token = self.token();
        if self.eat(Kind::Import) {
            if self.eat(Kind::Dot) {
                let property = self.token();
                if !self.at_identifier_name() {
                    return Err(self.expected_error(Kind::Meta));
                }
                let phase = match self.token_source(property) {
                    "meta" => {
                        self.advance();
                        return Ok(Box::new(Expr::MetaProp(MetaPropExpr {
                            span: Span::new_with_checked(token.start(), property.end()),
                            kind: MetaPropKind::ImportMeta,
                        })));
                    }
                    "source" => ImportPhase::Source,
                    "defer" => ImportPhase::Defer,
                    _ => return Err(self.expected_error(Kind::Meta)),
                };
                self.advance();
                if !self.at(Kind::LParen) {
                    return Err(self.expected_error(Kind::LParen));
                }
                let arguments = self.parse_arguments()?;
                if arguments.is_empty() || arguments.len() > 2 {
                    return Err(Error::new(
                        Span::new_with_checked(token.start(), self.previous_end()),
                        crate::error::SyntaxError::ImportRequiresOneOrTwoArgs,
                    ));
                }
                self.validate_import_options(&arguments);
                return Ok(Box::new(Expr::Call(CallExpr {
                    span: Span::new_with_checked(token.start(), self.previous_end()),
                    ctxt: SyntaxContext::empty(),
                    callee: Callee::Import(Import {
                        span: Span::new_with_checked(token.start(), property.end()),
                        phase,
                    }),
                    args: arguments,
                    type_args: None,
                })));
            }
            if !self.at(Kind::LParen) {
                return Err(self.expected_error(Kind::LParen));
            }
            let arguments = self.parse_arguments()?;
            if arguments.is_empty() || arguments.len() > 2 {
                return Err(Error::new(
                    Span::new_with_checked(token.start(), self.previous_end()),
                    crate::error::SyntaxError::ImportRequiresOneOrTwoArgs,
                ));
            }
            self.validate_import_options(&arguments);
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
            if !self.context().contains(Context::SUPER_CALL) {
                self.emit_error(Error::new(
                    token.span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "super()".into(),
                        expected: "direct super call in a derived constructor",
                    },
                ));
            }
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

    fn validate_import_options(&mut self, arguments: &[ExprOrSpread]) {
        if let Some(options) = arguments.get(1) {
            if !matches!(&*options.expr, Expr::Object(_)) {
                self.emit_error(Error::new(
                    options.expr.span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "non-object dynamic import options".into(),
                        expected: "object literal import options",
                    },
                ));
            }
        }
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
        let mut parser = Parser::new(lexer, Context::default() | Context::NEW_TARGET);
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
