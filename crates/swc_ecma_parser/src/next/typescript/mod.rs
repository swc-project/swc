//! TypeScript declarations and type productions.

use swc_atoms::Atom;
use swc_common::{Span, Spanned};
use swc_ecma_ast::{
    Decl, Expr, Ident, IdentName, Lit, Stmt, TsArrayType, TsEntityName, TsIntersectionType,
    TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType, TsParenthesizedType, TsQualifiedName,
    TsType, TsTypeAliasDecl, TsTypeAnn, TsTypeParamInstantiation, TsTypeRef, TsUnionType,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    pub(crate) fn parse_ts_type_alias_declaration(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        debug_assert!(self.at(Kind::Type));
        self.advance();
        let token = self.token();
        if !self.at_identifier_reference() {
            return Err(self.expected_error(Kind::Ident));
        }
        let id = Ident::new_no_ctxt(Atom::new(self.token_source(token)), token.span());
        self.advance();
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
            type_params: None,
            type_ann,
        }))))
    }

    pub(crate) fn parse_ts_type(&mut self) -> Result<Box<TsType>, Error> {
        self.parse_ts_union_type()
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
        while self.at(Kind::LBracket)
            && self.lookahead(|parser| {
                parser.advance();
                parser.at(Kind::RBracket)
            })
        {
            let start = ty.span().lo;
            self.advance();
            self.advance();
            ty = Box::new(TsType::TsArrayType(TsArrayType {
                span: Span::new_with_checked(start, self.previous_end()),
                elem_type: ty,
            }));
        }
        Ok(ty)
    }

    fn parse_ts_primary_type(&mut self) -> Result<Box<TsType>, Error> {
        let token = self.token();
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
        self.parse_ts_type_reference()
    }

    fn parse_ts_type_reference(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let mut type_name = TsEntityName::Ident(Ident::new_no_ctxt(
            Atom::new(self.token_source(token)),
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
                sym: Atom::new(self.token_source(token)),
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
