//! TypeScript declarations and type productions.

use swc_common::{Span, Spanned};
use swc_ecma_ast::{
    Decl, Expr, Ident, IdentName, Lit, Stmt, TruePlusMinus, TsArrayType, TsConditionalType,
    TsConstructorType, TsEntityName, TsEnumDecl, TsEnumMember, TsEnumMemberId, TsFnParam, TsFnType,
    TsIndexedAccessType, TsInferType, TsInterfaceBody, TsInterfaceDecl, TsIntersectionType,
    TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType, TsMappedType, TsOptionalType,
    TsParenthesizedType, TsPropertySignature, TsQualifiedName, TsRestType, TsThisType,
    TsThisTypeOrIdent, TsTupleElement, TsTupleType, TsType, TsTypeAliasDecl, TsTypeAnn,
    TsTypeElement, TsTypeLit, TsTypeOperator, TsTypeOperatorOp, TsTypeParam, TsTypeParamDecl,
    TsTypeParamInstantiation, TsTypePredicate, TsTypeQuery, TsTypeQueryExpr, TsTypeRef,
    TsUnionType,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{
        lexer::config::Config,
        parser::{context::Context, cursor::Parser},
    },
};

impl<C: Config> Parser<'_, C> {
    pub(crate) fn parse_ts_interface_declaration(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        debug_assert!(self.eat(Kind::Interface));
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        let (body_span, body) = self.parse_ts_type_members()?;
        Ok(Stmt::Decl(Decl::TsInterface(Box::new(TsInterfaceDecl {
            span: Span::new_with_checked(start, body_span.hi),
            id,
            declare: false,
            type_params,
            extends: Vec::new(),
            body: TsInterfaceBody {
                span: body_span,
                body,
            },
        }))))
    }

    pub(crate) fn parse_ts_enum_declaration(&mut self, is_const: bool) -> Result<Stmt, Error> {
        let start = self.token().start();
        if is_const {
            debug_assert!(self.eat(Kind::Const));
        }
        if !self.expect(Kind::Enum) {
            return Err(self.expected_error(Kind::Enum));
        }
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.advance();
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let mut members = Vec::with_capacity(8);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            let member_start = self.token().start();
            let token = self.token();
            let id = if self.at(Kind::Str) {
                let expression = self.parse_primary_expression()?;
                let Expr::Lit(Lit::Str(value)) = *expression else {
                    unreachable!("string enum member must produce a string literal")
                };
                TsEnumMemberId::Str(value)
            } else if self.at_identifier_name() {
                let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
                self.advance();
                TsEnumMemberId::Ident(id)
            } else {
                return Err(self.expected_error(Kind::Ident));
            };
            let init = if self.eat(Kind::Eq) {
                Some(self.parse_assignment_expression()?)
            } else {
                None
            };
            let end = init
                .as_ref()
                .map_or_else(|| id.span().hi, |expression| expression.span().hi);
            members.push(TsEnumMember {
                span: Span::new_with_checked(member_start, end),
                id,
                init,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok(Stmt::Decl(Decl::TsEnum(Box::new(TsEnumDecl {
            span: Span::new_with_checked(start, self.previous_end()),
            declare: false,
            is_const,
            id,
            members,
        }))))
    }

    pub(crate) fn parse_ts_type_alias_declaration(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        debug_assert!(self.at(Kind::Type));
        self.advance();
        let token = self.token();
        if !self.at_identifier_reference() {
            return Err(self.expected_error(Kind::Ident));
        }
        let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        if !self.expect(Kind::Eq) {
            return Err(self.expected_error(Kind::Eq));
        }
        let type_ann = self.parse_ts_type()?;
        let end = type_ann.span().hi;
        self.consume_semicolon()?;
        Ok(Stmt::Decl(Decl::TsTypeAlias(Box::new(TsTypeAliasDecl {
            span: Span::new_with_checked(start, end),
            declare: false,
            id,
            type_params,
            type_ann,
        }))))
    }

    pub(crate) fn parse_ts_type(&mut self) -> Result<Box<TsType>, Error> {
        if self.at(Kind::Asserts)
            || ((self.at(Kind::This) || self.at_identifier_name())
                && self.lookahead(|parser| {
                    parser.advance();
                    parser.at(Kind::Is)
                }))
        {
            return self.parse_ts_type_predicate();
        }
        let check_type = self.parse_ts_union_type()?;
        if self.context().contains(Context::DISALLOW_CONDITIONAL_TYPES) || !self.eat(Kind::Extends)
        {
            return Ok(check_type);
        }
        let extends_type = self.with_context(
            Context::DISALLOW_CONDITIONAL_TYPES,
            Context::empty(),
            Self::parse_ts_union_type,
        )?;
        if !self.expect(Kind::QuestionMark) {
            return Err(self.expected_error(Kind::QuestionMark));
        }
        let true_type = self.parse_ts_type()?;
        if !self.expect(Kind::Colon) {
            return Err(self.expected_error(Kind::Colon));
        }
        let false_type = self.parse_ts_type()?;
        Ok(Box::new(TsType::TsConditionalType(TsConditionalType {
            span: Span::new_with_checked(check_type.span().lo, false_type.span().hi),
            check_type,
            extends_type,
            true_type,
            false_type,
        })))
    }

    fn parse_ts_type_predicate(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        let asserts = self.eat(Kind::Asserts);
        let token = self.token();
        let param_name = if self.at(Kind::This) {
            self.advance();
            TsThisTypeOrIdent::TsThisType(TsThisType { span: token.span() })
        } else if self.at_identifier_name() {
            let ident = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
            self.advance();
            TsThisTypeOrIdent::Ident(ident)
        } else {
            return Err(self.expected_error(Kind::Ident));
        };
        let type_ann = if self.eat(Kind::Is) {
            let type_ann = self.parse_ts_type()?;
            Some(Box::new(TsTypeAnn {
                span: Span::new_with_checked(token.end(), type_ann.span().hi),
                type_ann,
            }))
        } else {
            None
        };
        let end = type_ann.as_ref().map_or(token.end(), |ty| ty.span.hi);
        Ok(Box::new(TsType::TsTypePredicate(TsTypePredicate {
            span: Span::new_with_checked(start, end),
            asserts,
            param_name,
            type_ann,
        })))
    }

    pub(crate) fn parse_ts_type_annotation(&mut self) -> Result<Box<TsTypeAnn>, Error> {
        let start = self.token().start();
        if !self.expect(Kind::Colon) {
            return Err(self.expected_error(Kind::Colon));
        }
        let type_ann = self.parse_ts_type()?;
        Ok(Box::new(TsTypeAnn {
            span: Span::new_with_checked(start, type_ann.span().hi),
            type_ann,
        }))
    }

    pub(crate) fn parse_ts_type_parameters(&mut self) -> Result<Box<TsTypeParamDecl>, Error> {
        let start = self.token().start();
        debug_assert!(self.at(Kind::Lt));
        self.advance();
        let mut params = Vec::with_capacity(2);
        while !matches!(
            self.kind(),
            Kind::Gt | Kind::RShift | Kind::ZeroFillRShift | Kind::Eof
        ) {
            let parameter_start = self.token().start();
            let mut is_in = false;
            let mut is_out = false;
            let mut is_const = false;
            loop {
                match self.kind() {
                    Kind::In => is_in = true,
                    Kind::Out => is_out = true,
                    Kind::Const => is_const = true,
                    _ => break,
                }
                self.advance();
            }
            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let name = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
            self.advance();
            let constraint = if self.eat(Kind::Extends) {
                Some(self.parse_ts_type()?)
            } else {
                None
            };
            let default = if self.eat(Kind::Eq) {
                Some(self.parse_ts_type()?)
            } else {
                None
            };
            let end = default
                .as_ref()
                .or(constraint.as_ref())
                .map_or(name.span.hi, |ty| ty.span().hi);
            params.push(TsTypeParam {
                span: Span::new_with_checked(parameter_start, end),
                name,
                is_in,
                is_out,
                is_const,
                constraint,
                default,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        self.expect_ts_right_angle()?;
        Ok(Box::new(TsTypeParamDecl {
            span: Span::new_with_checked(start, self.previous_end()),
            params,
        }))
    }

    pub(crate) fn parse_ts_type_arguments(
        &mut self,
    ) -> Result<Box<TsTypeParamInstantiation>, Error> {
        let start = self.token().start();
        if !self.expect(Kind::Lt) {
            return Err(self.expected_error(Kind::Lt));
        }
        let mut params = Vec::with_capacity(2);
        loop {
            params.push(self.parse_ts_type()?);
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        self.expect_ts_right_angle()?;
        Ok(Box::new(TsTypeParamInstantiation {
            span: Span::new_with_checked(start, self.previous_end()),
            params,
        }))
    }

    fn parse_ts_union_type(&mut self) -> Result<Box<TsType>, Error> {
        let leading = self.eat(Kind::Pipe);
        let first = self.parse_ts_intersection_type()?;
        if !leading && !self.at(Kind::Pipe) {
            return Ok(first);
        }
        let start = first.span().lo;
        let mut types = Vec::with_capacity(2);
        types.push(first);
        while self.eat(Kind::Pipe) {
            types.push(self.parse_ts_intersection_type()?);
        }
        let end = types.last().unwrap().span().hi;
        Ok(Box::new(TsType::TsUnionOrIntersectionType(
            swc_ecma_ast::TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                span: Span::new_with_checked(start, end),
                types,
            }),
        )))
    }

    fn parse_ts_intersection_type(&mut self) -> Result<Box<TsType>, Error> {
        let leading = self.eat(Kind::Ampersand);
        let first = self.parse_ts_array_type()?;
        if !leading && !self.at(Kind::Ampersand) {
            return Ok(first);
        }
        let start = first.span().lo;
        let mut types = Vec::with_capacity(2);
        types.push(first);
        while self.eat(Kind::Ampersand) {
            types.push(self.parse_ts_array_type()?);
        }
        let end = types.last().unwrap().span().hi;
        Ok(Box::new(TsType::TsUnionOrIntersectionType(
            swc_ecma_ast::TsUnionOrIntersectionType::TsIntersectionType(TsIntersectionType {
                span: Span::new_with_checked(start, end),
                types,
            }),
        )))
    }

    fn parse_ts_array_type(&mut self) -> Result<Box<TsType>, Error> {
        let mut ty = self.parse_ts_primary_type()?;
        while self.at(Kind::LBracket) {
            let start = ty.span().lo;
            self.advance();
            if self.eat(Kind::RBracket) {
                ty = Box::new(TsType::TsArrayType(TsArrayType {
                    span: Span::new_with_checked(start, self.previous_end()),
                    elem_type: ty,
                }));
            } else {
                let index_type = self.parse_ts_type()?;
                if !self.expect(Kind::RBracket) {
                    return Err(self.expected_error(Kind::RBracket));
                }
                ty = Box::new(TsType::TsIndexedAccessType(TsIndexedAccessType {
                    span: Span::new_with_checked(start, self.previous_end()),
                    readonly: false,
                    obj_type: ty,
                    index_type,
                }));
            }
        }
        Ok(ty)
    }

    fn parse_ts_primary_type(&mut self) -> Result<Box<TsType>, Error> {
        let token = self.token();
        if token.kind() == Kind::This {
            self.advance();
            return Ok(Box::new(TsType::TsThisType(TsThisType {
                span: token.span(),
            })));
        }
        if token.kind() == Kind::Infer {
            self.advance();
            let parameter_start = self.token().start();
            let name_token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let name = Ident::new_no_ctxt(self.identifier_atom(name_token), name_token.span());
            self.advance();
            let constraint = if self.at(Kind::Extends) {
                let checkpoint = self.checkpoint();
                self.advance();
                let constraint = self.parse_ts_union_type()?;
                if self.at(Kind::QuestionMark)
                    && !self.context().contains(Context::DISALLOW_CONDITIONAL_TYPES)
                {
                    self.rewind(checkpoint);
                    None
                } else {
                    Some(constraint)
                }
            } else {
                None
            };
            let end = constraint.as_ref().map_or(name.span.hi, |ty| ty.span().hi);
            return Ok(Box::new(TsType::TsInferType(TsInferType {
                span: Span::new_with_checked(token.start(), end),
                type_param: TsTypeParam {
                    span: Span::new_with_checked(parameter_start, end),
                    name,
                    is_in: false,
                    is_out: false,
                    is_const: false,
                    constraint,
                    default: None,
                },
            })));
        }
        if token.kind() == Kind::Minus {
            self.advance();
            let number_token = self.token();
            let expression = self.parse_primary_expression()?;
            let Expr::Lit(Lit::Num(mut number)) = *expression else {
                return Err(self.expected_error(Kind::Num));
            };
            number.value = -number.value;
            number.span = Span::new_with_checked(token.start(), number_token.end());
            return Ok(Box::new(TsType::TsLitType(TsLitType {
                span: number.span,
                lit: TsLit::Number(number),
            })));
        }
        if matches!(token.kind(), Kind::Keyof | Kind::Readonly | Kind::Unique) {
            let op = match token.kind() {
                Kind::Keyof => TsTypeOperatorOp::KeyOf,
                Kind::Readonly => TsTypeOperatorOp::ReadOnly,
                Kind::Unique => TsTypeOperatorOp::Unique,
                _ => unreachable!(),
            };
            self.advance();
            let type_ann = self.parse_ts_array_type()?;
            return Ok(Box::new(TsType::TsTypeOperator(TsTypeOperator {
                span: Span::new_with_checked(token.start(), type_ann.span().hi),
                op,
                type_ann,
            })));
        }
        if token.kind() == Kind::TypeOf {
            self.advance();
            let type_name = self.parse_ts_entity_name()?;
            return Ok(Box::new(TsType::TsTypeQuery(TsTypeQuery {
                span: Span::new_with_checked(token.start(), self.previous_end()),
                expr_name: TsTypeQueryExpr::TsEntityName(type_name),
                type_args: None,
            })));
        }
        if self.at(Kind::Lt) && self.is_ts_function_type_start() {
            return self.parse_ts_function_type();
        }
        if self.at(Kind::New) {
            return self.parse_ts_constructor_type(false);
        }
        if let Some(kind) = ts_keyword_type(token.kind()) {
            self.advance();
            return Ok(Box::new(TsType::TsKeywordType(TsKeywordType {
                span: token.span(),
                kind,
            })));
        }
        if matches!(
            token.kind(),
            Kind::Str | Kind::Num | Kind::BigInt | Kind::True | Kind::False
        ) {
            let expression = self.parse_primary_expression()?;
            let lit = match *expression {
                Expr::Lit(Lit::Str(value)) => TsLit::Str(value),
                Expr::Lit(Lit::Num(value)) => TsLit::Number(value),
                Expr::Lit(Lit::BigInt(value)) => TsLit::BigInt(value),
                Expr::Lit(Lit::Bool(value)) => TsLit::Bool(value),
                _ => unreachable!("TypeScript literal token must produce a literal expression"),
            };
            return Ok(Box::new(TsType::TsLitType(TsLitType {
                span: token.span(),
                lit,
            })));
        }
        if self.at(Kind::LParen) && self.is_ts_function_type_start() {
            return self.parse_ts_function_type();
        }
        if self.eat(Kind::LParen) {
            let start = token.start();
            let type_ann = self.parse_ts_type()?;
            if !self.expect(Kind::RParen) {
                return Err(self.expected_error(Kind::RParen));
            }
            return Ok(Box::new(TsType::TsParenthesizedType(TsParenthesizedType {
                span: Span::new_with_checked(start, self.previous_end()),
                type_ann,
            })));
        }
        if self.at(Kind::LBracket) {
            return self.parse_ts_tuple_type();
        }
        if self.at(Kind::LBrace) {
            if self.is_ts_mapped_type_start() {
                return self.parse_ts_mapped_type();
            }
            let (span, members) = self.parse_ts_type_members()?;
            return Ok(Box::new(TsType::TsTypeLit(TsTypeLit { span, members })));
        }
        self.parse_ts_type_reference()
    }

    fn parse_ts_constructor_type(&mut self, is_abstract: bool) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        let params = self
            .parse_method_parameters()?
            .into_iter()
            .map(|param| match param.pat {
                swc_ecma_ast::Pat::Ident(value) => TsFnParam::Ident(value),
                swc_ecma_ast::Pat::Array(value) => TsFnParam::Array(value),
                swc_ecma_ast::Pat::Rest(value) => TsFnParam::Rest(value),
                swc_ecma_ast::Pat::Object(value) => TsFnParam::Object(value),
                _ => unreachable!("constructor type parameters are binding patterns"),
            })
            .collect();
        if !self.expect(Kind::Arrow) {
            return Err(self.expected_error(Kind::Arrow));
        }
        let type_ann = self.parse_ts_type()?;
        let end = type_ann.span().hi;
        Ok(Box::new(TsType::TsFnOrConstructorType(
            swc_ecma_ast::TsFnOrConstructorType::TsConstructorType(TsConstructorType {
                span: Span::new_with_checked(start, end),
                params,
                type_params,
                type_ann: Box::new(TsTypeAnn {
                    span: Span::new_with_checked(start, end),
                    type_ann,
                }),
                is_abstract,
            }),
        )))
    }

    fn is_ts_mapped_type_start(&mut self) -> bool {
        self.lookahead(|parser| {
            parser.advance();
            if matches!(parser.kind(), Kind::Plus | Kind::Minus) {
                parser.advance();
            }
            parser.eat(Kind::Readonly);
            parser.at(Kind::LBracket)
        })
    }

    fn parse_ts_mapped_type(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        self.advance();
        let readonly = self.parse_ts_mapped_modifier(Kind::Readonly)?;
        if !self.expect(Kind::LBracket) {
            return Err(self.expected_error(Kind::LBracket));
        }
        let parameter_start = self.token().start();
        let name_token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let name = Ident::new_no_ctxt(self.identifier_atom(name_token), name_token.span());
        self.advance();
        if !self.expect(Kind::In) {
            return Err(self.expected_error(Kind::In));
        }
        let constraint = self.parse_ts_type()?;
        let name_type = if self.eat(Kind::As) {
            Some(self.parse_ts_type()?)
        } else {
            None
        };
        if !self.expect(Kind::RBracket) {
            return Err(self.expected_error(Kind::RBracket));
        }
        let optional = self.parse_ts_mapped_modifier(Kind::QuestionMark)?;
        let type_ann = if self.eat(Kind::Colon) {
            Some(self.parse_ts_type()?)
        } else {
            None
        };
        self.eat(Kind::Semi);
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok(Box::new(TsType::TsMappedType(TsMappedType {
            span: Span::new_with_checked(start, self.previous_end()),
            readonly,
            type_param: TsTypeParam {
                span: Span::new_with_checked(parameter_start, constraint.span().hi),
                name,
                is_in: false,
                is_out: false,
                is_const: false,
                constraint: Some(constraint),
                default: None,
            },
            name_type,
            optional,
            type_ann,
        })))
    }

    fn parse_ts_mapped_modifier(&mut self, keyword: Kind) -> Result<Option<TruePlusMinus>, Error> {
        if self.eat(keyword) {
            return Ok(Some(TruePlusMinus::True));
        }
        let modifier = match self.kind() {
            Kind::Plus => TruePlusMinus::Plus,
            Kind::Minus => TruePlusMinus::Minus,
            _ => return Ok(None),
        };
        self.advance();
        if !self.expect(keyword) {
            return Err(self.expected_error(keyword));
        }
        Ok(Some(modifier))
    }

    fn parse_ts_tuple_type(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        self.advance();
        let mut elem_types = Vec::with_capacity(4);
        while !self.at(Kind::RBracket) && !self.at(Kind::Eof) {
            let element_start = self.token().start();
            let is_rest = self.eat(Kind::DotDotDot);
            let mut ty = self.parse_ts_type()?;
            if self.eat(Kind::QuestionMark) {
                ty = Box::new(TsType::TsOptionalType(TsOptionalType {
                    span: Span::new_with_checked(element_start, self.previous_end()),
                    type_ann: ty,
                }));
            }
            if is_rest {
                ty = Box::new(TsType::TsRestType(TsRestType {
                    span: Span::new_with_checked(element_start, ty.span().hi),
                    type_ann: ty,
                }));
            }
            elem_types.push(TsTupleElement {
                span: Span::new_with_checked(element_start, ty.span().hi),
                label: None,
                ty,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RBracket) {
            return Err(self.expected_error(Kind::RBracket));
        }
        Ok(Box::new(TsType::TsTupleType(TsTupleType {
            span: Span::new_with_checked(start, self.previous_end()),
            elem_types,
        })))
    }

    fn is_ts_function_type_start(&mut self) -> bool {
        self.lookahead(|parser| {
            if parser.at(Kind::Lt) && parser.parse_ts_type_parameters().is_err() {
                return false;
            }
            parser.parse_method_parameters().is_ok() && parser.at(Kind::Arrow)
        })
    }

    fn parse_ts_function_type(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        let params = self
            .parse_method_parameters()?
            .into_iter()
            .map(|param| match param.pat {
                swc_ecma_ast::Pat::Ident(value) => TsFnParam::Ident(value),
                swc_ecma_ast::Pat::Array(value) => TsFnParam::Array(value),
                swc_ecma_ast::Pat::Rest(value) => TsFnParam::Rest(value),
                swc_ecma_ast::Pat::Object(value) => TsFnParam::Object(value),
                _ => unreachable!("function type parameters are binding patterns"),
            })
            .collect();
        if !self.expect(Kind::Arrow) {
            return Err(self.expected_error(Kind::Arrow));
        }
        let type_ann = self.parse_ts_type()?;
        let end = type_ann.span().hi;
        Ok(Box::new(TsType::TsFnOrConstructorType(
            swc_ecma_ast::TsFnOrConstructorType::TsFnType(TsFnType {
                span: Span::new_with_checked(start, end),
                params,
                type_params,
                type_ann: Box::new(TsTypeAnn {
                    span: Span::new_with_checked(start, end),
                    type_ann,
                }),
            }),
        )))
    }

    fn parse_ts_entity_name(&mut self) -> Result<TsEntityName, Error> {
        let start = self.token().start();
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let mut name = TsEntityName::Ident(Ident::new_no_ctxt(
            self.identifier_atom(token),
            token.span(),
        ));
        self.advance();
        while self.eat(Kind::Dot) {
            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let right = IdentName {
                span: token.span(),
                sym: self.identifier_atom(token),
            };
            self.advance();
            name = TsEntityName::TsQualifiedName(Box::new(TsQualifiedName {
                span: Span::new_with_checked(start, right.span.hi),
                left: name,
                right,
            }));
        }
        Ok(name)
    }

    fn parse_ts_type_members(&mut self) -> Result<(Span, Vec<TsTypeElement>), Error> {
        let start = self.token().start();
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let mut members = Vec::with_capacity(8);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            let member_start = self.token().start();
            let readonly = self.eat(Kind::Readonly);
            let key_token = self.token();
            let key = if self.at_identifier_name() {
                let expression = Expr::Ident(Ident::new_no_ctxt(
                    self.identifier_atom(key_token),
                    key_token.span(),
                ));
                self.advance();
                Box::new(expression)
            } else if matches!(self.kind(), Kind::Str | Kind::Num) {
                self.parse_primary_expression()?
            } else {
                return Err(self.expected_error(Kind::Ident));
            };
            let optional = self.eat(Kind::QuestionMark);
            let type_ann = if self.at(Kind::Colon) {
                Some(self.parse_ts_type_annotation()?)
            } else {
                None
            };
            let end = type_ann.as_ref().map_or(key.span().hi, |ann| ann.span.hi);
            members.push(TsTypeElement::TsPropertySignature(TsPropertySignature {
                span: Span::new_with_checked(member_start, end),
                readonly,
                key,
                computed: false,
                optional,
                type_ann,
            }));
            if !self.eat(Kind::Semi)
                && !self.eat(Kind::Comma)
                && !self.at(Kind::RBrace)
                && !self.token().had_line_break()
            {
                return Err(self.expected_error(Kind::Semi));
            }
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok((Span::new_with_checked(start, self.previous_end()), members))
    }

    fn parse_ts_type_reference(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let mut type_name = TsEntityName::Ident(Ident::new_no_ctxt(
            self.identifier_atom(token),
            token.span(),
        ));
        self.advance();
        while self.eat(Kind::Dot) {
            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let right = IdentName {
                span: token.span(),
                sym: self.identifier_atom(token),
            };
            self.advance();
            type_name = TsEntityName::TsQualifiedName(Box::new(TsQualifiedName {
                span: Span::new_with_checked(start, right.span.hi),
                left: type_name,
                right,
            }));
        }
        let type_params = if self.eat(Kind::Lt) {
            let arguments_start = self.previous_end();
            let mut params = Vec::with_capacity(2);
            loop {
                params.push(self.parse_ts_type()?);
                if !self.eat(Kind::Comma) {
                    break;
                }
            }
            self.expect_ts_right_angle()?;
            Some(Box::new(TsTypeParamInstantiation {
                span: Span::new_with_checked(arguments_start, self.previous_end()),
                params,
            }))
        } else {
            None
        };
        Ok(Box::new(TsType::TsTypeRef(TsTypeRef {
            span: Span::new_with_checked(start, self.previous_end()),
            type_name,
            type_params,
        })))
    }

    fn expect_ts_right_angle(&mut self) -> Result<(), Error> {
        if matches!(self.kind(), Kind::RShift | Kind::ZeroFillRShift) {
            self.re_lex_ts_right_angle();
        }
        if !self.expect(Kind::Gt) {
            return Err(self.expected_error(Kind::Gt));
        }
        Ok(())
    }
}

fn ts_keyword_type(kind: Kind) -> Option<TsKeywordTypeKind> {
    Some(match kind {
        Kind::Any => TsKeywordTypeKind::TsAnyKeyword,
        Kind::Unknown => TsKeywordTypeKind::TsUnknownKeyword,
        Kind::Number => TsKeywordTypeKind::TsNumberKeyword,
        Kind::Object => TsKeywordTypeKind::TsObjectKeyword,
        Kind::Boolean => TsKeywordTypeKind::TsBooleanKeyword,
        Kind::Bigint => TsKeywordTypeKind::TsBigIntKeyword,
        Kind::String => TsKeywordTypeKind::TsStringKeyword,
        Kind::Symbol => TsKeywordTypeKind::TsSymbolKeyword,
        Kind::Void => TsKeywordTypeKind::TsVoidKeyword,
        Kind::Undefined => TsKeywordTypeKind::TsUndefinedKeyword,
        Kind::Null => TsKeywordTypeKind::TsNullKeyword,
        Kind::Never => TsKeywordTypeKind::TsNeverKeyword,
        Kind::Intrinsic => TsKeywordTypeKind::TsIntrinsicKeyword,
        _ => return None,
    })
}
