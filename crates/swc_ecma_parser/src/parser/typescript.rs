use std::{fmt::Write, mem};

use either::Either;
use swc_atoms::{atom, Atom, Wtf8Atom};
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::*;

use crate::{
    error::SyntaxError, input::Tokens, lexer::Token, parser::util::IsSimpleParameterList, Context,
    PResult, Parser,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ParsingContext {
    EnumMembers,
    HeritageClauseElement,
    TupleElementTypes,
    TypeMembers,
    TypeParametersOrArguments,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum UnionOrIntersection {
    Union,
    Intersection,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum SignatureParsingMode {
    TSCallSignatureDeclaration,
    TSConstructSignatureDeclaration,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum FlowEnumKind {
    String,
    Number,
    Boolean,
    Symbol,
    BigInt,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum FlowEnumMemberKind {
    Defaulted,
    String,
    Number,
    Boolean,
    BigInt,
    Invalid,
}

/// Mark as declare
fn make_decl_declare(mut decl: Decl) -> Decl {
    match decl {
        Decl::Class(ref mut c) => c.declare = true,
        Decl::Fn(ref mut f) => f.declare = true,
        Decl::Var(ref mut v) => v.declare = true,
        Decl::TsInterface(ref mut i) => i.declare = true,
        Decl::TsTypeAlias(ref mut a) => a.declare = true,
        Decl::TsEnum(ref mut e) => e.declare = true,
        Decl::TsModule(ref mut m) => m.declare = true,
        Decl::Using(..) => unreachable!("Using is not a valid declaration for `declare` keyword"),
        #[cfg(swc_ast_unknown)]
        _ => unreachable!(),
    }

    decl
}

fn flow_binding_has_type_ann(pat: &Pat) -> bool {
    match pat {
        Pat::Ident(binding) => binding.type_ann.is_some(),
        Pat::Array(array) => array.type_ann.is_some(),
        Pat::Object(object) => object.type_ann.is_some(),
        Pat::Rest(rest) => rest.type_ann.is_some() || flow_binding_has_type_ann(rest.arg.as_ref()),
        Pat::Assign(assign) => flow_binding_has_type_ann(assign.left.as_ref()),
        _ => false,
    }
}

fn has_legacy_octal_escape(raw: &str) -> bool {
    let bytes = raw.as_bytes();
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'\\' {
            if i + 1 >= bytes.len() {
                break;
            }
            let c = bytes[i + 1];
            if (b'1'..=b'7').contains(&c)
                || (c == b'0' && i + 2 < bytes.len() && bytes[i + 2].is_ascii_digit())
            {
                return true;
            }
            i += 2;
            continue;
        }
        i += 1;
    }

    false
}

fn is_legacy_octal_number_raw(raw: &str) -> bool {
    let raw = raw.strip_prefix('-').unwrap_or(raw);
    let bytes = raw.as_bytes();
    if bytes.len() <= 1 || bytes[0] != b'0' || !bytes[1].is_ascii_digit() {
        return false;
    }

    bytes[1..].iter().all(|b| b.is_ascii_digit() && *b <= b'7')
}

#[derive(Debug)]
enum FlowComponentParam {
    Prop { key: PropName, value: Pat },
    Rest { rest: RestPat },
}

impl<I: Tokens> Parser<I> {
    fn make_flow_any_keyword_type(&mut self, start: BytePos) -> Box<TsType> {
        Box::new(TsType::TsKeywordType(TsKeywordType {
            span: self.span(start),
            kind: TsKeywordTypeKind::TsAnyKeyword,
        }))
    }

    pub(super) fn is_flow_reserved_type_name(name: &str) -> bool {
        matches!(
            name,
            "_" | "extends"
                | "interface"
                | "static"
                | "keyof"
                | "readonly"
                | "never"
                | "undefined"
                | "unknown"
                | "string"
                | "number"
                | "boolean"
                | "symbol"
                | "null"
                | "void"
                | "any"
                | "true"
                | "false"
        )
    }

    pub(super) fn emit_flow_reserved_type_name_error(&mut self, span: Span, name: &str) {
        if self.syntax().flow() && Self::is_flow_reserved_type_name(name) {
            self.emit_err(span, SyntaxError::TS1003);
        }
    }

    fn is_flow_contextual_word(&mut self, word: &str) -> bool {
        self.input().syntax().flow()
            && self.input().cur().is_word()
            && self.input().cur().take_word(&self.input) == word
    }

    fn make_flow_component_fallback_binding(&mut self, span: Span) -> Pat {
        Pat::Ident(BindingIdent {
            id: Ident::new_no_ctxt(atom!("component_prop"), span),
            type_ann: None,
        })
    }

    fn make_flow_component_rest_fallback_binding(&mut self, span: Span) -> Pat {
        Pat::Ident(BindingIdent {
            id: Ident::new_no_ctxt(atom!("component_rest"), span),
            type_ann: None,
        })
    }

    fn flow_mark_pat_optional(&mut self, pat: &mut Pat) {
        match pat {
            Pat::Ident(binding) => {
                binding.id.optional = true;
            }
            Pat::Array(array) => {
                array.optional = true;
            }
            Pat::Object(object) => {
                object.optional = true;
            }
            _ => {
                self.emit_err(pat.span(), SyntaxError::TS1003);
            }
        }
    }

    fn flow_apply_type_ann_to_pat(&mut self, pat: &mut Pat, type_ann: Box<TsTypeAnn>) {
        match pat {
            Pat::Ident(binding) => binding.type_ann = Some(type_ann),
            Pat::Array(array) => array.type_ann = Some(type_ann),
            Pat::Object(object) => object.type_ann = Some(type_ann),
            Pat::Rest(rest) => rest.type_ann = Some(type_ann),
            Pat::Assign(assign) => {
                self.flow_apply_type_ann_to_pat(assign.left.as_mut(), type_ann);
            }
            _ => {
                self.emit_err(pat.span(), SyntaxError::TS1003);
            }
        }
    }

    fn parse_flow_component_param(
        &mut self,
        require_type_ann: bool,
        string_key_requires_as: bool,
        allow_rest_type: bool,
    ) -> PResult<FlowComponentParam> {
        let start = self.cur_pos();

        if self.input_mut().eat(Token::DotDotDot) {
            let dot3_token = self.input().prev_span();

            if allow_rest_type && self.can_start_flow_component_rest_type() {
                if self.can_direct_parse_flow_component_rest_type() {
                    let type_ann = self.in_type(Self::parse_ts_type)?;
                    let type_ann_span = type_ann.span();
                    return Ok(FlowComponentParam::Rest {
                        rest: RestPat {
                            span: self.span(start),
                            dot3_token,
                            arg: Box::new(
                                self.make_flow_component_rest_fallback_binding(self.span(start)),
                            ),
                            type_ann: Some(Box::new(TsTypeAnn {
                                span: type_ann_span,
                                type_ann,
                            })),
                        },
                    });
                }

                if let Some(type_ann) = self.try_parse_ts(|p| {
                    let ty = p.in_type(Self::parse_ts_type)?;
                    if p.input().is(Token::Comma) || p.input().is(Token::RParen) {
                        Ok(Some(ty))
                    } else {
                        Ok(None)
                    }
                }) {
                    let type_ann_span = type_ann.span();
                    return Ok(FlowComponentParam::Rest {
                        rest: RestPat {
                            span: self.span(start),
                            dot3_token,
                            arg: Box::new(
                                self.make_flow_component_rest_fallback_binding(self.span(start)),
                            ),
                            type_ann: Some(Box::new(TsTypeAnn {
                                span: type_ann_span,
                                type_ann,
                            })),
                        },
                    });
                }
            }

            let mut arg = self.parse_binding_pat_or_ident(false)?;
            if self.input_mut().eat(Token::QuestionMark) {
                self.flow_mark_pat_optional(&mut arg);
            }

            let type_ann = if self.input().is(Token::Colon) {
                Some(self.parse_ts_type_ann(true, self.cur_pos())?)
            } else {
                None
            };

            return Ok(FlowComponentParam::Rest {
                rest: RestPat {
                    span: self.span(start),
                    dot3_token,
                    arg: Box::new(arg),
                    type_ann,
                },
            });
        }

        if self.input().is(Token::LBrace) || self.input().is(Token::LBracket) {
            self.emit_err(self.input().cur_span(), SyntaxError::TS1003);

            let mut value = self.parse_binding_pat_or_ident(false)?;
            let mut has_type_ann = false;
            if self.input().is(Token::Colon) {
                has_type_ann = true;
                let type_ann = self.parse_ts_type_ann(true, self.cur_pos())?;
                self.flow_apply_type_ann_to_pat(&mut value, type_ann);
            }
            if self.input_mut().eat(Token::Eq) {
                let right = self.parse_assignment_expr()?;
                value = Pat::Assign(AssignPat {
                    span: self.span(start),
                    left: Box::new(value),
                    right,
                });
            }
            if require_type_ann && !has_type_ann {
                self.emit_err(self.span(start), SyntaxError::TS1003);
            }

            return Ok(FlowComponentParam::Prop {
                key: PropName::Ident(IdentName::new(atom!("component_prop"), self.span(start))),
                value,
            });
        }

        let key = if self.input().is(Token::Str) {
            PropName::Str(self.parse_str_lit())
        } else if self.input().cur().is_word() {
            PropName::Ident(self.parse_ident_name()?)
        } else {
            unexpected!(self, "identifier or string literal for a component prop")
        };

        let optional = self.input_mut().eat(Token::QuestionMark);
        let has_as = self.input_mut().eat(Token::As);

        let mut value = if has_as {
            self.parse_binding_pat_or_ident(false)?
        } else {
            match &key {
                PropName::Ident(id) => Pat::Ident(BindingIdent {
                    id: Ident::new_no_ctxt(id.sym.clone(), id.span),
                    type_ann: None,
                }),
                PropName::Str(str_lit) => {
                    if string_key_requires_as {
                        self.emit_err(str_lit.span, SyntaxError::TS1003);
                    }
                    self.make_flow_component_fallback_binding(str_lit.span)
                }
                _ => {
                    self.emit_err(key.span(), SyntaxError::TS1003);
                    self.make_flow_component_fallback_binding(key.span())
                }
            }
        };

        if optional {
            self.flow_mark_pat_optional(&mut value);
        }

        let mut has_type_ann = false;
        if self.input().is(Token::Colon) {
            has_type_ann = true;
            let type_ann = self.parse_ts_type_ann(true, self.cur_pos())?;
            self.flow_apply_type_ann_to_pat(&mut value, type_ann);
        }

        if self.input_mut().eat(Token::Eq) {
            let right = self.parse_assignment_expr()?;
            value = Pat::Assign(AssignPat {
                span: self.span(start),
                left: Box::new(value),
                right,
            });
        }

        if require_type_ann && !has_type_ann {
            self.emit_err(self.span(start), SyntaxError::TS1003);
        }

        Ok(FlowComponentParam::Prop { key, value })
    }

    fn can_start_flow_component_rest_type(&mut self) -> bool {
        let cur = self.input().cur();

        if cur == Token::Interface {
            return peek!(self).is_some_and(|peek| peek == Token::LBrace);
        }

        if cur.is_word() {
            return !peek!(self).is_some_and(|peek| {
                matches!(peek, Token::Colon | Token::QuestionMark | Token::Eq)
            });
        }

        matches!(
            cur,
            Token::LParen
                | Token::LBrace
                | Token::LBracket
                | Token::QuestionMark
                | Token::Asterisk
                | Token::Minus
                | Token::Str
                | Token::Num
                | Token::BigInt
                | Token::True
                | Token::False
                | Token::BackQuote
                | Token::NoSubstitutionTemplateLiteral
                | Token::TemplateHead
                | Token::Import
                | Token::This
                | Token::TypeOf
                | Token::Void
                | Token::Null
                | Token::Any
                | Token::Boolean
                | Token::Bigint
                | Token::Never
                | Token::Number
                | Token::Object
                | Token::String
                | Token::Symbol
                | Token::Unknown
                | Token::Undefined
                | Token::Intrinsic
                | Token::Readonly
                | Token::Keyof
                | Token::Unique
                | Token::Infer
        )
    }

    fn can_start_flow_renders_type(&mut self) -> bool {
        self.is_flow_contextual_word("renders")
            && peek!(self).is_some_and(|peek| matches!(peek, Token::QuestionMark | Token::Asterisk))
    }

    fn can_direct_parse_flow_component_rest_type(&mut self) -> bool {
        match self.input().cur() {
            Token::Interface => peek!(self).is_some_and(|peek| peek == Token::LBrace),
            cur if cur.is_word() => {
                // `Foo.Bar`, `Foo[Bar]`, and `Foo<T>` cannot be fallback
                // bindings, so they are safe to parse directly as types.
                peek!(self).is_some_and(|peek| {
                    matches!(
                        peek,
                        Token::Lt | Token::LShift | Token::Dot | Token::LBracket
                    )
                })
            }
            // Component rest fallback bindings can only start with identifiers,
            // object patterns, or array patterns, so a parenthesized type is
            // unambiguous here and can parse directly without a checkpoint.
            Token::LBrace | Token::LBracket => false,
            cur => !cur.is_word() && self.can_start_flow_component_rest_type(),
        }
    }

    fn parse_flow_renders_type(&mut self) -> PResult<Box<TsType>> {
        debug_assert!(self.input().syntax().flow());
        debug_assert!(self.can_start_flow_renders_type());

        self.bump();
        if !(self.input_mut().eat(Token::QuestionMark) || self.input_mut().eat(Token::Asterisk)) {
            unexpected!(self, "? or *")
        }

        self.parse_ts_non_array_type()
    }

    fn parse_flow_component_params(
        &mut self,
        require_type_ann: bool,
        string_key_requires_as: bool,
        allow_rest_type: bool,
    ) -> PResult<Vec<FlowComponentParam>> {
        expect!(self, Token::LParen);

        let mut params = Vec::new();
        while !self.input().is(Token::RParen) {
            params.push(self.parse_flow_component_param(
                require_type_ann,
                string_key_requires_as,
                allow_rest_type,
            )?);

            if self.input().is(Token::RParen) {
                break;
            }

            expect!(self, Token::Comma);
            if self.input().is(Token::RParen) {
                break;
            }
        }

        expect!(self, Token::RParen);
        Ok(params)
    }

    fn make_flow_component_props_pat(
        &mut self,
        start: BytePos,
        params: Vec<FlowComponentParam>,
    ) -> ObjectPat {
        let mut props = Vec::with_capacity(params.len());

        for param in params {
            match param {
                FlowComponentParam::Prop { key, value, .. } => {
                    props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                        key,
                        value: Box::new(value),
                    }));
                }
                FlowComponentParam::Rest { rest, .. } => {
                    props.push(ObjectPatProp::Rest(rest));
                }
            }
        }

        ObjectPat {
            span: self.span(start),
            props,
            optional: false,
            type_ann: None,
        }
    }

    fn parse_flow_component_renders_ann(&mut self) -> PResult<Option<Box<TsTypeAnn>>> {
        if !self.is_flow_contextual_word("renders") {
            return Ok(None);
        }

        let start = self.cur_pos();
        self.bump();

        let type_ann = self.in_type(Self::parse_ts_type)?;
        Ok(Some(Box::new(TsTypeAnn {
            span: self.span(start),
            type_ann,
        })))
    }

    fn parse_flow_component_decl(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
        declare: bool,
    ) -> PResult<Decl> {
        let ident = self.parse_binding_ident(false)?.id;

        let type_params = self.try_parse_ts_type_params(false, true)?;
        let component_params = self.parse_flow_component_params(declare, !declare, declare)?;
        let params = vec![Param {
            span: self.span(start),
            decorators: Vec::new(),
            pat: Pat::Object(self.make_flow_component_props_pat(start, component_params)),
        }];

        if self.input().is(Token::Colon) {
            self.emit_err(self.input().cur_span(), SyntaxError::TS1003);
            let _ = self.parse_ts_type_or_type_predicate_ann(Token::Colon)?;
        }
        let return_type = self.parse_flow_component_renders_ann()?;

        let body = self.parse_fn_block_body(false, false, false, true)?;
        if self.syntax().flow() && body.is_none() && !self.ctx().contains(Context::InDeclare) {
            self.emit_err(self.input().cur_span(), SyntaxError::TS1005);
        }

        Ok(Decl::Fn(FnDecl {
            declare,
            ident,
            function: Box::new(Function {
                span: self.span(start),
                decorators,
                type_params,
                params,
                body,
                is_async: false,
                is_generator: false,
                return_type,
                ctxt: Default::default(),
            }),
        }))
    }

    fn parse_flow_hook_decl(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
        declare: bool,
    ) -> PResult<Decl> {
        if self.input().is(Token::Function) {
            self.emit_err(self.input().cur_span(), SyntaxError::TS1003);
            return self.parse_fn_decl(decorators);
        }

        let ident = self.parse_binding_ident(false)?.id;
        let function =
            self.parse_fn_args_body(decorators, start, Self::parse_formal_params, false, false)?;
        if self.syntax().flow() && declare && function.return_type.is_none() {
            self.emit_err(ident.span, SyntaxError::TS1003);
        }

        Ok(Decl::Fn(FnDecl {
            declare,
            ident,
            function,
        }))
    }

    fn parse_flow_component_type(&mut self, start: BytePos) -> PResult<TsType> {
        let type_params = self.try_parse_ts_type_params(false, true)?;
        let component_params = self.parse_flow_component_params(false, false, true)?;

        if self.input().is(Token::Colon) {
            self.emit_err(self.input().cur_span(), SyntaxError::TS1003);
            let _ = self.parse_ts_type_or_type_predicate_ann(Token::Colon)?;
        }

        let type_ann = if let Some(renders) = self.parse_flow_component_renders_ann()? {
            renders
        } else {
            Box::new(TsTypeAnn {
                span: self.span(start),
                type_ann: self.make_flow_any_keyword_type(start),
            })
        };

        let params = vec![TsFnParam::Object(
            self.make_flow_component_props_pat(start, component_params),
        )];

        Ok(TsType::TsFnOrConstructorType(
            TsFnOrConstructorType::TsFnType(TsFnType {
                span: self.span(start),
                params,
                type_params,
                type_ann,
            }),
        ))
    }

    fn parse_flow_hook_type(&mut self, start: BytePos) -> PResult<TsType> {
        let type_params = self.try_parse_ts_type_params(false, true)?;
        expect!(self, Token::LParen);

        let mut params = Vec::new();
        while !self.input().is(Token::RParen) {
            let param_start = self.cur_pos();
            let dot3_token = if self.input_mut().eat(Token::DotDotDot) {
                Some(self.input().prev_span())
            } else {
                None
            };

            let ty = self.parse_ts_type()?;
            params.push(self.make_flow_anon_fn_param(param_start, params.len(), dot3_token, ty));

            if self.input().is(Token::RParen) {
                break;
            }

            expect!(self, Token::Comma);
            if self.input().is(Token::RParen) {
                break;
            }
        }

        expect!(self, Token::RParen);
        let type_ann = self.parse_ts_type_or_type_predicate_ann(Token::Arrow)?;

        Ok(TsType::TsFnOrConstructorType(
            TsFnOrConstructorType::TsFnType(TsFnType {
                span: self.span(start),
                params,
                type_params,
                type_ann,
            }),
        ))
    }

    fn make_flow_synthetic_declare_export_alias_decl(&mut self, start: BytePos) -> Decl {
        let mut id = String::with_capacity(40);
        id.push_str("__flow_declare_export_");
        write!(&mut id, "{}", start.0).unwrap();
        let type_ann = self.make_flow_any_keyword_type(start);

        Decl::TsTypeAlias(self.make_flow_synthetic_type_alias_decl(start, id.into(), type_ann))
    }

    fn parse_flow_declare_export_from_clause(&mut self) -> PResult<()> {
        expect!(self, Token::From);

        if self.input().is(Token::Str) {
            let _ = self.parse_str_lit();
            Ok(())
        } else {
            unexpected!(self, "a string literal")
        }
    }

    fn parse_flow_declare_export_named_specifier(&mut self) -> PResult<()> {
        if self.input().is(Token::Type) || self.input().is(Token::TypeOf) {
            self.bump();
        }

        let cur = self.input().cur();
        if cur == Token::Str || cur.is_word() {
            let _ = self.parse_module_export_name()?;
        } else {
            unexpected!(self, "an identifier or string literal")
        }

        if self.input_mut().eat(Token::As) {
            let _ = self.parse_module_export_name()?;
        }

        Ok(())
    }

    fn parse_flow_declare_export_named_or_all(&mut self, start: BytePos) -> PResult<Decl> {
        if self.input_mut().eat(Token::Asterisk) {
            if self.input_mut().eat(Token::As) {
                let _ = self.parse_ident_name()?;
            }

            self.parse_flow_declare_export_from_clause()?;
            self.expect_general_semi()?;
            return Ok(self.make_flow_synthetic_declare_export_alias_decl(start));
        }

        expect!(self, Token::LBrace);
        while !self.input().is(Token::RBrace) {
            self.parse_flow_declare_export_named_specifier()?;
            if !self.input_mut().eat(Token::Comma) {
                break;
            }
        }
        expect!(self, Token::RBrace);

        if self.input().is(Token::From) {
            self.parse_flow_declare_export_from_clause()?;
        }

        self.expect_general_semi()?;
        Ok(self.make_flow_synthetic_declare_export_alias_decl(start))
    }

    fn normalize_flow_declare_export_default(
        &mut self,
        declare_start: BytePos,
        decl: ExportDefaultDecl,
    ) -> Decl {
        match decl.decl {
            DefaultDecl::Class(ClassExpr {
                ident: Some(ident),
                class,
            }) => Decl::Class(ClassDecl {
                declare: true,
                ident,
                class: Box::new(Class {
                    span: Span {
                        lo: declare_start,
                        ..class.span
                    },
                    ..*class
                }),
            }),
            DefaultDecl::Fn(FnExpr {
                ident: Some(ident),
                function,
            }) => Decl::Fn(FnDecl {
                declare: true,
                ident,
                function: Box::new(Function {
                    span: Span {
                        lo: declare_start,
                        ..function.span
                    },
                    ..*function
                }),
            }),
            DefaultDecl::Class(ClassExpr { ident: None, .. })
            | DefaultDecl::Fn(FnExpr { ident: None, .. }) => {
                let type_ann = self.make_flow_any_keyword_type(declare_start);
                Decl::TsTypeAlias(self.make_flow_synthetic_type_alias_decl(
                    declare_start,
                    atom!("__flow_default_export"),
                    type_ann,
                ))
            }
            DefaultDecl::TsInterfaceDecl(..) => unreachable!(),
            #[cfg(swc_ast_unknown)]
            _ => unreachable!(),
        }
    }

    /// `tsParseList`
    fn parse_ts_list<T, F>(&mut self, kind: ParsingContext, mut parse_element: F) -> PResult<Vec<T>>
    where
        F: FnMut(&mut Self) -> PResult<T>,
    {
        debug_assert!(self.input().syntax().typescript());
        let mut buf = Vec::with_capacity(8);
        while !self.is_ts_list_terminator(kind) {
            // Skipping "parseListElement" from the TS source since that's just for error
            // handling.
            buf.push(parse_element(self)?);
        }
        Ok(buf)
    }

    /// `tsParseDelimitedList`
    fn parse_ts_delimited_list_inner<T, F>(
        &mut self,
        kind: ParsingContext,
        mut parse_element: F,
    ) -> PResult<Vec<T>>
    where
        F: FnMut(&mut Self) -> PResult<(BytePos, T)>,
    {
        debug_assert!(self.input().syntax().typescript());
        let mut buf = Vec::new();
        loop {
            trace_cur!(self, parse_ts_delimited_list_inner__element);

            if self.is_ts_list_terminator(kind) {
                break;
            }

            let (_, element) = parse_element(self)?;
            buf.push(element);

            if self.input_mut().eat(Token::Comma) {
                continue;
            }

            if self.is_ts_list_terminator(kind) {
                break;
            }

            if kind == ParsingContext::EnumMembers {
                let expect = Token::Comma;
                let cur = self.input().cur();
                let cur = cur.to_string();
                self.emit_err(
                    self.input().cur_span(),
                    SyntaxError::Expected(format!("{expect:?}"), cur),
                );
                continue;
            }
            // This will fail with an error about a missing comma
            expect!(self, Token::Comma);
        }

        Ok(buf)
    }

    /// In no lexer context
    pub(crate) fn ts_in_no_context<T, F>(&mut self, op: F) -> PResult<T>
    where
        F: FnOnce(&mut Self) -> PResult<T>,
    {
        debug_assert!(self.input().syntax().typescript());
        trace_cur!(self, ts_in_no_context__before);
        let res = op(self);
        trace_cur!(self, ts_in_no_context__after);
        res
    }

    /// `tsIsListTerminator`
    fn is_ts_list_terminator(&mut self, kind: ParsingContext) -> bool {
        debug_assert!(self.input().syntax().typescript());
        let cur = self.input().cur();
        match kind {
            ParsingContext::EnumMembers | ParsingContext::TypeMembers => cur == Token::RBrace,
            ParsingContext::HeritageClauseElement => {
                matches!(cur, Token::LBrace | Token::Implements | Token::Extends)
            }
            ParsingContext::TupleElementTypes => cur == Token::RBracket,
            ParsingContext::TypeParametersOrArguments => cur == Token::Gt,
        }
    }

    /// `tsNextTokenCanFollowModifier`
    pub(super) fn ts_next_token_can_follow_modifier_fast(&mut self) -> bool {
        debug_assert!(self.input().syntax().typescript());

        let Some(next) = self.input_mut().peek() else {
            return false;
        };

        (!self.input_mut().has_linebreak_between_cur_and_peeked()
            && matches!(
                next,
                Token::LBracket
                    | Token::LBrace
                    | Token::Asterisk
                    | Token::DotDotDot
                    | Token::Hash
                    | Token::Str
                    | Token::Num
                    | Token::BigInt
            ))
            || next.is_word()
    }

    /// `tsTryParse`
    pub(crate) fn try_parse_ts<T, F>(&mut self, op: F) -> Option<T>
    where
        F: FnOnce(&mut Self) -> PResult<Option<T>>,
    {
        if !self.input().syntax().typescript() {
            return None;
        }
        debug_tracing!(self, "try_parse_ts");

        trace_cur!(self, try_parse_ts);

        let checkpoint = self.start_speculative_parse();
        let res = op(self);
        match res {
            Ok(Some(res)) => {
                trace_cur!(self, try_parse_ts__success_value);
                self.commit_speculative_parse(checkpoint);
                Some(res)
            }
            Ok(None) => {
                trace_cur!(self, try_parse_ts__success_no_value);
                self.rollback_speculative_parse(checkpoint);
                None
            }
            Err(..) => {
                trace_cur!(self, try_parse_ts__fail);
                self.rollback_speculative_parse(checkpoint);
                None
            }
        }
    }

    /// `tsParseTypeMemberSemicolon`
    fn parse_ts_type_member_semicolon(&mut self) -> PResult<()> {
        debug_assert!(self.input().syntax().typescript());

        if self.input_mut().eat(Token::Comma) || self.input_mut().eat(Token::Semi) {
            return Ok(());
        }

        if self.input().syntax().flow()
            && self.input().is(Token::Pipe)
            && peek!(self).is_some_and(|peek| peek == Token::RBrace)
        {
            return Ok(());
        }

        self.expect_general_semi()
    }

    /// `tsParseDelimitedList`
    fn parse_ts_delimited_list<T, F>(
        &mut self,
        kind: ParsingContext,
        mut parse_element: F,
    ) -> PResult<Vec<T>>
    where
        F: FnMut(&mut Self) -> PResult<T>,
    {
        self.parse_ts_delimited_list_inner(kind, |p| {
            let start = p.input().cur_pos();
            Ok((start, parse_element(p)?))
        })
    }

    /// `tsParseUnionOrIntersectionType`
    fn parse_ts_union_or_intersection_type<F>(
        &mut self,
        kind: UnionOrIntersection,
        mut parse_constituent_type: F,
        operator: Token,
    ) -> PResult<Box<TsType>>
    where
        F: FnMut(&mut Self) -> PResult<Box<TsType>>,
    {
        trace_cur!(self, parse_ts_union_or_intersection_type);

        debug_assert!(self.input().syntax().typescript());

        let start = self.input().cur_pos(); // include the leading operator in the start
        self.input_mut().eat(operator);
        trace_cur!(self, parse_ts_union_or_intersection_type__first_type);

        let ty = parse_constituent_type(self)?;
        trace_cur!(self, parse_ts_union_or_intersection_type__after_first);

        let is_flow_exact_object_end = |p: &mut Self| {
            p.input().syntax().flow()
                && operator == Token::Pipe
                && p.input().is(Token::Pipe)
                && peek!(p).is_some_and(|peek| peek == Token::RBrace)
        };
        if is_flow_exact_object_end(self) {
            return Ok(ty);
        }

        if self.input().is(operator) {
            let mut types = vec![ty];

            while self.input().is(operator) {
                if is_flow_exact_object_end(self) {
                    break;
                }
                self.bump();
                trace_cur!(self, parse_ts_union_or_intersection_type__constituent);

                types.push(parse_constituent_type(self)?);
            }

            return Ok(Box::new(TsType::TsUnionOrIntersectionType(match kind {
                UnionOrIntersection::Union => TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                    span: self.span(start),
                    types,
                }),
                UnionOrIntersection::Intersection => {
                    TsUnionOrIntersectionType::TsIntersectionType(TsIntersectionType {
                        span: self.span(start),
                        types,
                    })
                }
            })));
        }
        Ok(ty)
    }

    pub(crate) fn eat_any_ts_modifier(&mut self) -> PResult<bool> {
        if self.syntax().typescript()
            && {
                let cur = self.input().cur();
                matches!(
                    cur,
                    Token::Public | Token::Protected | Token::Private | Token::Readonly
                )
            }
            && peek!(self)
                .is_some_and(|t| t.is_word() || matches!(t, Token::LBrace | Token::LBracket))
        {
            let _ = self.parse_ts_modifier(
                &[
                    Token::Public,
                    Token::Protected,
                    Token::Private,
                    Token::Readonly,
                ],
                false,
            );
            Ok(true)
        } else {
            Ok(false)
        }
    }

    /// Parses a modifier matching one the given modifier names.
    ///
    /// `tsParseModifier`
    pub(crate) fn parse_ts_modifier(
        &mut self,
        allowed_modifiers: &[Token],
        stop_on_start_of_class_static_blocks: bool,
    ) -> PResult<Option<Token>> {
        debug_assert!(self.input().syntax().typescript());
        let cur = self.input().cur();

        // Check if current token is in the allowed modifiers list
        let pos = allowed_modifiers.iter().position(|&t| t == cur);

        if cur == Token::Error {
            let err = self.input_mut().expect_error_token_and_bump();
            return Err(err);
        }

        if cur == Token::Eof {
            return Err(self.eof_error());
        }

        if let Some(pos) = pos {
            if stop_on_start_of_class_static_blocks
                && self.input().is(Token::Static)
                && peek!(self).is_some_and(|peek| peek == Token::LBrace)
            {
                return Ok(None);
            }
            if self.ts_next_token_can_follow_modifier_fast() {
                self.bump();
                return Ok(Some(allowed_modifiers[pos]));
            }
        }
        Ok(None)
    }

    fn parse_ts_bracketed_list<T, F>(
        &mut self,
        kind: ParsingContext,
        parse_element: F,
        bracket: bool,
        skip_first_token: bool,
    ) -> PResult<Vec<T>>
    where
        F: FnMut(&mut Self) -> PResult<T>,
    {
        debug_assert!(self.input().syntax().typescript());
        if !skip_first_token {
            if bracket {
                expect!(self, Token::LBracket);
            } else {
                expect!(self, Token::Lt);
            }
        }
        let result = self.parse_ts_delimited_list(kind, parse_element)?;
        if bracket {
            expect!(self, Token::RBracket);
        } else {
            expect!(self, Token::Gt);
        }
        Ok(result)
    }

    /// `tsParseThisTypeNode`
    fn parse_ts_this_type_node(&mut self) -> PResult<TsThisType> {
        debug_assert!(self.input().syntax().typescript());
        expect!(self, Token::This);
        Ok(TsThisType {
            span: self.input().prev_span(),
        })
    }

    /// `tsParseEntityName`
    fn parse_ts_entity_name(&mut self, allow_reserved_words: bool) -> PResult<TsEntityName> {
        debug_assert!(self.input().syntax().typescript());
        trace_cur!(self, parse_ts_entity_name);
        let start = self.input().cur_pos();
        let init_token = self.input().cur();
        let init = self.parse_ident_name()?;
        if init_token == Token::Void {
            let dot_start = self.input().cur_pos();
            let dot_span = self.span(dot_start);
            self.emit_err(dot_span, SyntaxError::TS1005)
        }
        let mut entity = TsEntityName::Ident(init.into());
        while self.input_mut().eat(Token::Dot) {
            let dot_start = self.input().cur_pos();
            let cur = self.input().cur();
            if cur != Token::Hash && !cur.is_word() {
                self.emit_err(
                    Span::new_with_checked(dot_start, dot_start),
                    SyntaxError::TS1003,
                );
                return Ok(entity);
            }
            let left = entity;
            let right = if allow_reserved_words {
                self.parse_ident_name()?
            } else {
                self.parse_ident(false, false)?.into()
            };
            let span = self.span(start);
            entity = TsEntityName::TsQualifiedName(Box::new(TsQualifiedName { span, left, right }));
        }
        Ok(entity)
    }

    pub(crate) fn ts_look_ahead<T, F>(&mut self, op: F) -> T
    where
        F: FnOnce(&mut Self) -> T,
    {
        debug_assert!(self.input().syntax().typescript());
        let checkpoint = self.start_speculative_parse();
        let ret = op(self);
        self.rollback_speculative_parse(checkpoint);
        ret
    }

    /// `tsParseTypeArguments`
    pub(crate) fn parse_ts_type_args(&mut self) -> PResult<Box<TsTypeParamInstantiation>> {
        trace_cur!(self, parse_ts_type_args);
        debug_assert!(self.input().syntax().typescript());

        let start = self.input().cur_pos();
        let params = self.in_type(|p| {
            // Temporarily remove a JSX parsing context, which makes us scan different
            // tokens.
            p.ts_in_no_context(|p| {
                if p.input().is(Token::LShift) {
                    p.input_mut().cut_lshift();
                } else {
                    expect!(p, Token::Lt);
                }
                if p.syntax().flow() {
                    p.parse_ts_delimited_list(ParsingContext::TypeParametersOrArguments, |p| {
                        trace_cur!(p, parse_ts_type_args__arg);

                        p.do_outside_of_context(
                            Context::DisallowFlowAnonFnType,
                            Self::parse_ts_type,
                        )
                    })
                } else {
                    p.parse_ts_delimited_list(ParsingContext::TypeParametersOrArguments, |p| {
                        trace_cur!(p, parse_ts_type_args__arg);

                        p.parse_ts_type()
                    })
                }
            })
        })?;
        // This reads the next token after the `>` too, so do this in the enclosing
        // context. But be sure not to parse a regex in the jsx expression
        // `<C<number> />`, so set exprAllowed = false
        self.input_mut().set_expr_allowed(false);
        self.expect_without_advance(Token::Gt)?;
        let span = Span::new_with_checked(start, self.input().cur_span().hi);

        // Report grammar error for empty type argument list like `I<>`.
        // Flow allows this form in several positions.
        if params.is_empty() && !self.syntax().flow() {
            self.emit_err(span, SyntaxError::EmptyTypeArgumentList);
        }

        Ok(Box::new(TsTypeParamInstantiation { span, params }))
    }

    /// `tsParseTypeReference`
    fn parse_ts_type_ref(&mut self) -> PResult<TsTypeRef> {
        trace_cur!(self, parse_ts_type_ref);
        debug_assert!(self.input().syntax().typescript());

        let start = self.input().cur_pos();

        let has_modifier = self.eat_any_ts_modifier()?;

        let type_name = self.parse_ts_entity_name(/* allow_reserved_words */ true)?;
        if self.syntax().flow() {
            if let TsEntityName::Ident(ident) = &type_name {
                if &*ident.sym != "readonly" {
                    self.emit_flow_reserved_type_name_error(ident.span, &ident.sym);
                }
            }
        }
        trace_cur!(self, parse_ts_type_ref__type_args);
        let type_params = if (self.syntax().flow() || !self.input().had_line_break_before_cur())
            && (self.input().is(Token::Lt) || self.input().is(Token::LShift))
        {
            let ret = self.do_outside_of_context(
                Context::ShouldNotLexLtOrGtAsType,
                Self::parse_ts_type_args,
            )?;
            self.assert_and_bump(Token::Gt);
            Some(ret)
        } else {
            None
        };

        if has_modifier {
            self.emit_err(self.span(start), SyntaxError::TS2369);
        }

        Ok(TsTypeRef {
            span: self.span(start),
            type_name,
            type_params,
        })
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    pub(crate) fn parse_ts_type_ann(
        &mut self,
        eat_colon: bool,
        start: BytePos,
    ) -> PResult<Box<TsTypeAnn>> {
        trace_cur!(self, parse_ts_type_ann);

        debug_assert!(self.input().syntax().typescript());

        self.in_type(|p| {
            if eat_colon {
                p.assert_and_bump(Token::Colon);
            }

            trace_cur!(p, parse_ts_type_ann__after_colon);

            let type_ann = p.parse_ts_type()?;

            Ok(Box::new(TsTypeAnn {
                span: p.span(start),
                type_ann,
            }))
        })
    }

    /// `tsParseThisTypePredicate`
    fn parse_ts_this_type_predicate(
        &mut self,
        start: BytePos,
        has_asserts_keyword: bool,
        lhs: TsThisType,
    ) -> PResult<TsTypePredicate> {
        debug_assert!(self.input().syntax().typescript());

        let param_name = TsThisTypeOrIdent::TsThisType(lhs);
        let type_ann = if self.input_mut().eat(Token::Is) {
            let cur_pos = self.input().cur_pos();
            Some(self.parse_ts_type_ann(false, cur_pos)?)
        } else {
            None
        };

        Ok(TsTypePredicate {
            span: self.span(start),
            asserts: has_asserts_keyword,
            param_name,
            type_ann,
        })
    }

    /// `tsEatThenParseType`
    fn eat_then_parse_ts_type(&mut self, token_to_eat: Token) -> PResult<Option<Box<TsType>>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        self.in_type(|p| {
            if !p.input_mut().eat(token_to_eat) {
                return Ok(None);
            }

            p.parse_ts_type().map(Some)
        })
    }

    /// `tsExpectThenParseType`
    fn expect_then_parse_ts_type(
        &mut self,
        token: Token,
        token_str: &'static str,
    ) -> PResult<Box<TsType>> {
        debug_assert!(self.input().syntax().typescript());

        self.in_type(|p| {
            if !p.input_mut().eat(token) {
                let got = format!("{:?}", p.input().cur());
                syntax_error!(
                    p,
                    p.input().cur_span(),
                    SyntaxError::Unexpected {
                        got,
                        expected: token_str
                    }
                );
            }

            p.parse_ts_type()
        })
    }

    /// `tsParseMappedTypeParameter`
    fn parse_ts_mapped_type_param(&mut self) -> PResult<TsTypeParam> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.input().cur_pos();
        let name = self.parse_ident_name()?;
        let constraint = Some(self.expect_then_parse_ts_type(Token::In, "in")?);

        Ok(TsTypeParam {
            span: self.span(start),
            name: name.into(),
            is_in: false,
            is_out: false,
            is_const: false,
            constraint,
            default: None,
        })
    }

    /// `tsParseTypeParameter`
    fn parse_ts_type_param(
        &mut self,
        permit_in_out: bool,
        permit_const: bool,
    ) -> PResult<TsTypeParam> {
        debug_assert!(self.input().syntax().typescript());

        let mut is_in = false;
        let mut is_out = false;
        let mut is_const = false;

        let start = self.input().cur_pos();

        loop {
            if self.syntax().flow() {
                if self.input_mut().eat(Token::Plus) {
                    if is_out {
                        self.emit_err(self.input().prev_span(), SyntaxError::TS1030(atom!("out")));
                    } else if is_in {
                        self.emit_err(
                            self.input().prev_span(),
                            SyntaxError::TS1029(atom!("in"), atom!("out")),
                        );
                    }
                    is_out = true;
                    continue;
                }

                if self.input_mut().eat(Token::Minus) {
                    if is_in {
                        self.emit_err(self.input().prev_span(), SyntaxError::TS1030(atom!("in")));
                    } else if is_out {
                        self.emit_err(
                            self.input().prev_span(),
                            SyntaxError::TS1029(atom!("in"), atom!("out")),
                        );
                    }
                    is_in = true;
                    continue;
                }

                let cur = self.input().cur();
                if matches!(cur, Token::Const | Token::In | Token::Out) {
                    let should_treat_as_modifier = if cur == Token::Const {
                        true
                    } else {
                        peek!(self).is_some_and(|next| {
                            next.is_word() || matches!(next, Token::Plus | Token::Minus)
                        })
                    };
                    if !should_treat_as_modifier {
                        // `in` / `out` can be identifiers in Flow type parameters.
                        break;
                    }

                    self.bump();

                    match cur {
                        Token::Const => {
                            is_const = true;
                            if is_in || is_out {
                                self.emit_err(
                                    self.input().prev_span(),
                                    SyntaxError::TS1277(atom!("const")),
                                );
                            }
                        }
                        Token::In => {
                            is_in = true;
                        }
                        Token::Out => {
                            is_out = true;
                        }
                        _ => unreachable!(),
                    }

                    continue;
                }
            }

            let Some(modifier) = self.parse_ts_modifier(
                &[
                    Token::Public,
                    Token::Private,
                    Token::Protected,
                    Token::Readonly,
                    Token::Abstract,
                    Token::Const,
                    Token::Override,
                    Token::In,
                    Token::Out,
                ],
                false,
            )?
            else {
                break;
            };

            match modifier {
                Token::Const => {
                    is_const = true;
                    if self.syntax().flow() && (is_in || is_out) {
                        self.emit_err(
                            self.input().prev_span(),
                            SyntaxError::TS1277(atom!("const")),
                        );
                    } else if !permit_const && !self.syntax().flow() {
                        self.emit_err(
                            self.input().prev_span(),
                            SyntaxError::TS1277(atom!("const")),
                        );
                    }
                }
                Token::In => {
                    if !permit_in_out {
                        self.emit_err(self.input().prev_span(), SyntaxError::TS1274(atom!("in")));
                    } else if is_in {
                        self.emit_err(self.input().prev_span(), SyntaxError::TS1030(atom!("in")));
                    } else if is_out {
                        self.emit_err(
                            self.input().prev_span(),
                            SyntaxError::TS1029(atom!("in"), atom!("out")),
                        );
                    }
                    is_in = true;
                }
                Token::Out => {
                    if !permit_in_out {
                        self.emit_err(self.input().prev_span(), SyntaxError::TS1274(atom!("out")));
                    } else if is_out {
                        self.emit_err(self.input().prev_span(), SyntaxError::TS1030(atom!("out")));
                    }
                    is_out = true;
                }
                other => self.emit_err(
                    self.input().prev_span(),
                    SyntaxError::TS1273(other.to_string().into()),
                ),
            };
        }

        let name = self.in_type(Self::parse_ident_name)?;
        if self.syntax().flow() {
            self.emit_flow_reserved_type_name_error(name.span, &name.sym);
        }
        let name = name.into();
        let constraint = if self.syntax().flow() {
            if self.input().is(Token::Colon) {
                self.eat_then_parse_ts_type(Token::Colon)?
            } else {
                self.eat_then_parse_ts_type(Token::Extends)?
            }
        } else {
            self.eat_then_parse_ts_type(Token::Extends)?
        };
        let default = self.eat_then_parse_ts_type(Token::Eq)?;

        Ok(TsTypeParam {
            span: self.span(start),
            name,
            is_in,
            is_out,
            is_const,
            constraint,
            default,
        })
    }

    /// `tsParseTypeParameter`
    pub(crate) fn parse_ts_type_params(
        &mut self,
        permit_in_out: bool,
        permit_const: bool,
    ) -> PResult<Box<TsTypeParamDecl>> {
        self.in_type(|p| {
            p.ts_in_no_context(|p| {
                let start = p.input().cur_pos();
                let cur = p.input().cur();
                if cur != Token::Lt && cur != Token::JSXTagStart {
                    unexpected!(p, "< (jsx tag start)")
                }
                p.bump();

                let params = p.parse_ts_bracketed_list(
                    ParsingContext::TypeParametersOrArguments,
                    |p| p.parse_ts_type_param(permit_in_out, permit_const), // bracket
                    false,
                    // skip_first_token
                    true,
                )?;

                if p.syntax().flow() && params.is_empty() {
                    p.emit_err(p.span(start), SyntaxError::TS1005);
                }

                if p.syntax().flow() {
                    let mut saw_default = false;
                    for param in &params {
                        if param.default.is_some() {
                            saw_default = true;
                        } else if saw_default {
                            // Flow requires all subsequent parameters to provide defaults once
                            // one default is introduced.
                            p.emit_err(param.span, SyntaxError::TS1005);
                        }
                    }
                }

                Ok(Box::new(TsTypeParamDecl {
                    span: p.span(start),
                    params,
                }))
            })
        })
    }

    /// `tsTryParseTypeParameters`
    pub(crate) fn try_parse_ts_type_params(
        &mut self,
        permit_in_out: bool,
        permit_const: bool,
    ) -> PResult<Option<Box<TsTypeParamDecl>>> {
        if !cfg!(feature = "typescript") {
            return Ok(None);
        }

        if self.input().cur() == Token::Lt {
            return self
                .parse_ts_type_params(permit_in_out, permit_const)
                .map(Some);
        }

        Ok(None)
    }

    /// `tsParseTypeOrTypePredicateAnnotation`
    pub(crate) fn parse_ts_type_or_type_predicate_ann(
        &mut self,
        return_token: Token,
    ) -> PResult<Box<TsTypeAnn>> {
        debug_assert!(self.input().syntax().typescript());

        self.in_type(|p| {
            let return_token_start = p.input().cur_pos();
            if !p.input_mut().eat(return_token) {
                let cur = format!("{:?}", p.input().cur());
                let span = p.input().cur_span();
                syntax_error!(
                    p,
                    span,
                    SyntaxError::Expected(format!("{return_token:?}"), cur)
                )
            }

            if p.input().syntax().flow() && p.input_mut().eat(Token::Percent) {
                let is_checks = p.input().cur().is_word()
                    && p.input().cur().take_word(&p.input) == atom!("checks");
                if !is_checks {
                    unexpected!(p, "checks");
                }
                p.bump();

                if p.input_mut().eat(Token::LParen) {
                    if !p.input().is(Token::RParen) {
                        p.allow_in_expr(Self::parse_assignment_expr)?;
                    }
                    expect!(p, Token::RParen);
                }

                return Ok(Box::new(TsTypeAnn {
                    span: p.span(return_token_start),
                    type_ann: p.make_flow_any_keyword_type(return_token_start),
                }));
            }

            let type_pred_start = p.input().cur_pos();
            let has_type_pred_asserts = p.input().cur() == Token::Asserts && {
                let ctx = p.ctx();
                peek!(p).is_some_and(|peek| {
                    if peek.is_word() {
                        !peek.is_reserved(ctx)
                    } else {
                        false
                    }
                })
            };
            let has_flow_implies = p.syntax().flow()
                && p.input().cur().is_word()
                && p.input().cur().take_word(&p.input) == atom!("implies")
                && peek!(p).is_some_and(|peek| peek.is_word() || peek == Token::This);

            if has_type_pred_asserts {
                p.assert_and_bump(Token::Asserts);
            }

            let has_type_pred_is = (p.is_ident_ref() || p.input().is(Token::This))
                && peek!(p).is_some_and(|peek| peek == Token::Is)
                && !p.input_mut().has_linebreak_between_cur_and_peeked();
            let is_type_predicate = has_type_pred_asserts || has_type_pred_is || has_flow_implies;
            if !is_type_predicate {
                return p.parse_ts_type_ann(
                    // eat_colon
                    false,
                    return_token_start,
                );
            }

            if has_flow_implies {
                p.bump();
            }

            if has_type_pred_asserts
                && p.syntax().flow()
                && p.input().cur().is_word()
                && p.input().cur().take_word(&p.input) == atom!("implies")
            {
                p.emit_err(p.input().cur_span(), SyntaxError::TS1003);
            }

            let param_name = if p.input().is(Token::This) {
                TsThisTypeOrIdent::TsThisType(p.parse_ts_this_type_node()?)
            } else {
                let ident = p.parse_ident_name()?;
                if has_flow_implies && ident.sym == *"implies" {
                    p.emit_err(ident.span, SyntaxError::TS1003);
                }
                TsThisTypeOrIdent::Ident(ident.into())
            };
            let type_ann = if has_type_pred_is {
                p.assert_and_bump(Token::Is);
                let pos = p.input().cur_pos();
                Some(p.parse_ts_type_ann(false, pos)?)
            } else if has_flow_implies {
                if p.input_mut().eat(Token::Is) {
                    let pos = p.input().cur_pos();
                    Some(p.parse_ts_type_ann(false, pos)?)
                } else {
                    p.emit_err(p.input().cur_span(), SyntaxError::TS1003);
                    None
                }
            } else {
                None
            };

            let node = Box::new(TsType::TsTypePredicate(TsTypePredicate {
                span: p.span(type_pred_start),
                asserts: has_type_pred_asserts,
                param_name,
                type_ann,
            }));

            Ok(Box::new(TsTypeAnn {
                span: p.span(return_token_start),
                type_ann: node,
            }))
        })
    }

    fn is_start_of_expr(&mut self) -> bool {
        self.is_start_of_left_hand_side_expr() || {
            let cur = self.input().cur();
            matches!(
                cur,
                Token::Plus
                    | Token::Minus
                    | Token::Tilde
                    | Token::Bang
                    | Token::Delete
                    | Token::TypeOf
                    | Token::Void
                    | Token::PlusPlus
                    | Token::MinusMinus
                    | Token::Lt
                    | Token::Await
                    | Token::Yield
            ) || (cur == Token::Hash && peek!(self).is_some_and(|peek| peek.is_word()))
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    pub(super) fn try_parse_ts_type_args(&mut self) -> Option<Box<TsTypeParamInstantiation>> {
        trace_cur!(self, try_parse_ts_type_args);
        debug_assert!(self.input().syntax().typescript());

        if !self.can_start_ts_type_args_fast() {
            return None;
        }

        self.try_parse_ts(|p| {
            let type_args = p.parse_ts_type_args()?;
            p.assert_and_bump(Token::Gt);
            let cur = p.input().cur();
            if matches!(
                cur,
                Token::Lt
                    | Token::Gt
                    | Token::Eq
                    | Token::RShift
                    | Token::GtEq
                    | Token::Plus
                    | Token::Minus
                    | Token::LParen
                    | Token::NoSubstitutionTemplateLiteral
                    | Token::TemplateHead
                    | Token::BackQuote
            )
            // these should be type
            // arguments in function
            // call or template, not
            // instantiation
            // expression
            {
                Ok(None)
            } else if p.input().had_line_break_before_cur()
                || p.input().cur().is_bin_op()
                || !p.is_start_of_expr()
            {
                Ok(Some(type_args))
            } else {
                Ok(None)
            }
        })
    }

    /// `tsTryParseType`
    fn try_parse_ts_type(&mut self) -> PResult<Option<Box<TsType>>> {
        if !cfg!(feature = "typescript") {
            return Ok(None);
        }

        self.eat_then_parse_ts_type(Token::Colon)
    }

    /// `tsTryParseTypeAnnotation`
    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    pub(crate) fn try_parse_ts_type_ann(&mut self) -> PResult<Option<Box<TsTypeAnn>>> {
        if !cfg!(feature = "typescript") {
            return Ok(None);
        }

        if self.input().is(Token::Colon) {
            let pos = self.cur_pos();
            return self.parse_ts_type_ann(/* eat_colon */ true, pos).map(Some);
        }

        Ok(None)
    }

    /// `tsNextThenParseType`
    pub(super) fn next_then_parse_ts_type(&mut self) -> PResult<Box<TsType>> {
        debug_assert!(self.input().syntax().typescript());

        let result = self.in_type(|p| {
            p.bump();
            p.parse_ts_type()
        });

        if !self.ctx().contains(Context::InType) && {
            let cur = self.input().cur();
            cur == Token::Lt || cur == Token::Gt
        } {
            self.input_mut().merge_lt_gt();
        }

        result
    }

    fn parse_flow_enum_explicit_kind(&mut self) -> PResult<Option<FlowEnumKind>> {
        let ty = self.parse_ident_name()?;
        let kind = match &*ty.sym {
            "string" => Some(FlowEnumKind::String),
            "number" => Some(FlowEnumKind::Number),
            "boolean" => Some(FlowEnumKind::Boolean),
            "symbol" => Some(FlowEnumKind::Symbol),
            "bigint" => Some(FlowEnumKind::BigInt),
            _ => None,
        };

        if kind.is_none() {
            self.emit_err(ty.span, SyntaxError::TS1003);
        }

        Ok(kind)
    }

    fn flow_enum_kind_from_member(kind: FlowEnumMemberKind) -> Option<FlowEnumKind> {
        match kind {
            FlowEnumMemberKind::String => Some(FlowEnumKind::String),
            FlowEnumMemberKind::Number => Some(FlowEnumKind::Number),
            FlowEnumMemberKind::Boolean => Some(FlowEnumKind::Boolean),
            FlowEnumMemberKind::BigInt => Some(FlowEnumKind::BigInt),
            FlowEnumMemberKind::Defaulted | FlowEnumMemberKind::Invalid => None,
        }
    }

    fn flow_enum_kind_matches_member(expected: FlowEnumKind, actual: FlowEnumMemberKind) -> bool {
        matches!(
            (expected, actual),
            (FlowEnumKind::String, FlowEnumMemberKind::String)
                | (FlowEnumKind::Number, FlowEnumMemberKind::Number)
                | (FlowEnumKind::Boolean, FlowEnumMemberKind::Boolean)
                | (FlowEnumKind::BigInt, FlowEnumMemberKind::BigInt)
        )
    }

    fn parse_flow_enum_member(
        &mut self,
    ) -> PResult<(TsEnumMember, Span, Atom, FlowEnumMemberKind)> {
        let start = self.cur_pos();
        let id = self.parse_ident_name()?;
        let member_name = id.sym.clone();

        if id
            .sym
            .chars()
            .next()
            .is_some_and(|ch| ch.is_ascii_lowercase())
        {
            self.emit_err(id.span, SyntaxError::TS1003);
        }

        let init = if self.input_mut().eat(Token::Eq) {
            Some(self.parse_assignment_expr()?)
        } else {
            None
        };

        let member_kind = match init.as_deref() {
            None => FlowEnumMemberKind::Defaulted,
            Some(Expr::Lit(Lit::Str(..))) => FlowEnumMemberKind::String,
            Some(Expr::Lit(Lit::Num(..))) => FlowEnumMemberKind::Number,
            Some(Expr::Lit(Lit::Bool(..))) => FlowEnumMemberKind::Boolean,
            Some(Expr::Lit(Lit::BigInt(..))) => FlowEnumMemberKind::BigInt,
            Some(Expr::Unary(UnaryExpr {
                op: UnaryOp::Minus,
                arg,
                ..
            })) => {
                if matches!(arg.as_ref(), Expr::Lit(Lit::Num(..))) {
                    FlowEnumMemberKind::Number
                } else if matches!(arg.as_ref(), Expr::Lit(Lit::BigInt(..))) {
                    FlowEnumMemberKind::BigInt
                } else {
                    FlowEnumMemberKind::Invalid
                }
            }
            _ => FlowEnumMemberKind::Invalid,
        };

        let span = self.span(start);
        Ok((
            TsEnumMember {
                span,
                id: TsEnumMemberId::Ident(id.into()),
                init,
            },
            span,
            member_name,
            member_kind,
        ))
    }

    fn validate_flow_enum_members(
        &mut self,
        explicit_kind: Option<FlowEnumKind>,
        members: &[(Span, Atom, FlowEnumMemberKind)],
    ) {
        let inferred_kind = explicit_kind
            .or_else(|| {
                members
                    .iter()
                    .find_map(|(_, _, kind)| Self::flow_enum_kind_from_member(*kind))
            })
            .unwrap_or(FlowEnumKind::String);
        let mut saw_defaulted_string_member = false;
        let mut saw_initialized_string_member = false;

        for (idx, (span, name, kind)) in members.iter().enumerate() {
            if members
                .iter()
                .take(idx)
                .any(|(_, prev_name, _)| prev_name == name)
            {
                self.emit_err(*span, SyntaxError::TS1003);
            }

            if *kind == FlowEnumMemberKind::Invalid {
                self.emit_err(*span, SyntaxError::TS1003);
                continue;
            }

            if let Some(explicit_kind) = explicit_kind {
                match kind {
                    FlowEnumMemberKind::Defaulted => {
                        if explicit_kind == FlowEnumKind::String {
                            saw_defaulted_string_member = true;
                        }
                        if !matches!(explicit_kind, FlowEnumKind::String | FlowEnumKind::Symbol) {
                            self.emit_err(*span, SyntaxError::TS1003);
                        }
                    }
                    _ => {
                        if explicit_kind == FlowEnumKind::String
                            && *kind == FlowEnumMemberKind::String
                        {
                            saw_initialized_string_member = true;
                        }
                        if explicit_kind == FlowEnumKind::Symbol
                            || !Self::flow_enum_kind_matches_member(explicit_kind, *kind)
                        {
                            self.emit_err(*span, SyntaxError::TS1003);
                        }
                    }
                }
            } else {
                match kind {
                    FlowEnumMemberKind::Defaulted => {
                        if matches!(
                            inferred_kind,
                            FlowEnumKind::Number | FlowEnumKind::Boolean | FlowEnumKind::BigInt
                        ) {
                            self.emit_err(*span, SyntaxError::TS1003);
                        }
                    }
                    _ => {
                        if !Self::flow_enum_kind_matches_member(inferred_kind, *kind) {
                            self.emit_err(*span, SyntaxError::TS1003);
                        }
                    }
                }
            }
        }

        if explicit_kind == Some(FlowEnumKind::String)
            && saw_defaulted_string_member
            && saw_initialized_string_member
        {
            self.emit_err(members[0].0, SyntaxError::TS1003);
        }
    }

    fn parse_flow_enum_decl(&mut self, start: BytePos, is_const: bool) -> PResult<Box<TsEnumDecl>> {
        let id = self.parse_ident_name()?;
        if id.is_reserved() {
            self.emit_err(id.span, SyntaxError::ExpectedIdent);
        }

        let explicit_kind = if self.input_mut().eat(Token::Of) {
            self.parse_flow_enum_explicit_kind()?
        } else {
            None
        };

        expect!(self, Token::LBrace);

        let mut members = Vec::new();
        let mut member_meta = Vec::new();
        let mut has_unknown_members = false;

        while !self.input().is(Token::RBrace) {
            if self.input().is(Token::Eof) {
                return Err(self.eof_error());
            }

            if self.input_mut().eat(Token::DotDotDot) {
                if has_unknown_members {
                    self.emit_err(self.input().prev_span(), SyntaxError::TS1003);
                }
                has_unknown_members = true;

                if self.input_mut().eat(Token::Comma) {
                    self.emit_err(self.input().prev_span(), SyntaxError::TS1003);
                }

                continue;
            }

            if has_unknown_members {
                self.emit_err(self.input().cur_span(), SyntaxError::TS1003);
            }

            let (member, span, name, kind) = self.parse_flow_enum_member()?;
            members.push(member);
            member_meta.push((span, name, kind));

            if self.input_mut().eat(Token::Comma) {
                continue;
            }

            if self.input().is(Token::RBrace) {
                break;
            }

            let cur = self.input().cur();
            self.emit_err(
                self.input().cur_span(),
                SyntaxError::Expected(format!("{:?}", Token::Comma), cur.to_string()),
            );
            if cur == Token::Eof {
                return Err(self.eof_error());
            }
            self.bump();
        }

        expect!(self, Token::RBrace);

        self.validate_flow_enum_members(explicit_kind, &member_meta);

        Ok(Box::new(TsEnumDecl {
            span: self.span(start),
            declare: false,
            is_const,
            id: id.into(),
            members,
        }))
    }

    /// `tsParseEnumMember`
    fn parse_ts_enum_member(&mut self) -> PResult<TsEnumMember> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();
        // TypeScript allows computed property names with literal expressions in enums.
        // Non-literal computed properties (like ["a" + "b"]) are rejected.
        // We normalize literal computed properties (["\t"] → "\t") to keep AST simple.
        // See https://github.com/swc-project/swc/issues/11160
        let cur = self.input().cur();
        let id = if cur == Token::Str {
            TsEnumMemberId::Str(self.parse_str_lit())
        } else if cur == Token::Num {
            let token_span = self.input.cur_span();
            let value = self.input_mut().expect_number_token_value();
            self.bump();

            let raw = self.input.iter.read_string(token_span);
            let mut new_raw = String::with_capacity(raw.len() + 2);

            new_raw.push('"');
            new_raw.push_str(raw);
            new_raw.push('"');

            let span = self.span(start);
            // Recover from error
            self.emit_err(span, SyntaxError::TS2452);

            TsEnumMemberId::Str(Str {
                span,
                value: value.to_string().into(),
                raw: Some(new_raw.into()),
            })
        } else if cur == Token::LBracket {
            self.assert_and_bump(Token::LBracket);
            let expr = self.parse_expr()?;
            self.assert_and_bump(Token::RBracket);
            let bracket_span = self.span(start);

            match *expr {
                Expr::Lit(Lit::Str(str_lit)) => {
                    // String literal: ["\t"] → "\t"
                    TsEnumMemberId::Str(str_lit)
                }
                Expr::Tpl(mut tpl) if tpl.exprs.is_empty() => {
                    // Template literal without substitution: [`hello`] → "hello"

                    let tpl = mem::take(tpl.quasis.first_mut().unwrap());

                    let span = tpl.span;
                    let value = tpl.cooked.unwrap();

                    TsEnumMemberId::Str(Str {
                        span,
                        value,
                        raw: None,
                    })
                }
                _ => {
                    // Non-literal expression: report error
                    self.emit_err(bracket_span, SyntaxError::TS1164);
                    TsEnumMemberId::Ident(Ident::new_no_ctxt(atom!(""), bracket_span))
                }
            }
        } else if cur == Token::Error {
            let err = self.input_mut().expect_error_token_and_bump();
            return Err(err);
        } else {
            self.parse_ident_name()
                .map(Ident::from)
                .map(TsEnumMemberId::from)?
        };

        let init = if self.input_mut().eat(Token::Eq) {
            Some(self.parse_assignment_expr()?)
        } else if self.input().cur() == Token::Comma || self.input().cur() == Token::RBrace {
            None
        } else if self.input().cur() == Token::Eof {
            return Err(self.eof_error());
        } else {
            let start = self.cur_pos();
            self.bump();
            self.input_mut().store(Token::Comma);
            self.emit_err(Span::new_with_checked(start, start), SyntaxError::TS1005);
            None
        };

        Ok(TsEnumMember {
            span: self.span(start),
            id,
            init,
        })
    }

    /// `tsParseEnumDeclaration`
    pub(crate) fn parse_ts_enum_decl(
        &mut self,
        start: BytePos,
        is_const: bool,
    ) -> PResult<Box<TsEnumDecl>> {
        debug_assert!(self.input().syntax().typescript());

        if self.input().syntax().flow() {
            return self.parse_flow_enum_decl(start, is_const);
        }

        let id = self.parse_ident_name()?;
        expect!(self, Token::LBrace);
        let members =
            self.parse_ts_delimited_list(ParsingContext::EnumMembers, Self::parse_ts_enum_member)?;
        expect!(self, Token::RBrace);

        Ok(Box::new(TsEnumDecl {
            span: self.span(start),
            declare: false,
            is_const,
            id: id.into(),
            members,
        }))
    }

    /// `tsTryParseTypeOrTypePredicateAnnotation`
    ///
    /// Used for parsing return types.
    fn try_parse_ts_type_or_type_predicate_ann(&mut self) -> PResult<Option<Box<TsTypeAnn>>> {
        if !cfg!(feature = "typescript") {
            return Ok(None);
        }

        if self.input().is(Token::Colon) {
            self.parse_ts_type_or_type_predicate_ann(Token::Colon)
                .map(Some)
        } else {
            Ok(None)
        }
    }

    /// `tsParseTemplateLiteralType`
    fn parse_ts_tpl_lit_type(&mut self) -> PResult<TsTplLitType> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();

        self.assert_and_bump(Token::BackQuote);

        let (types, quasis) = self.parse_ts_tpl_type_elements()?;

        expect!(self, Token::BackQuote);

        Ok(TsTplLitType {
            span: self.span(start),
            types,
            quasis,
        })
    }

    fn parse_ts_tpl_type_elements(&mut self) -> PResult<(Vec<Box<TsType>>, Vec<TplElement>)> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        trace_cur!(self, parse_tpl_elements);

        let mut types = Vec::new();

        let cur_elem = self.parse_tpl_element(false)?;
        let mut is_tail = cur_elem.tail;
        let mut quasis = vec![cur_elem];

        while !is_tail {
            expect!(self, Token::DollarLBrace);
            types.push(self.parse_ts_type()?);
            expect!(self, Token::RBrace);
            let elem = self.parse_tpl_element(false)?;
            is_tail = elem.tail;
            quasis.push(elem);
        }

        Ok((types, quasis))
    }

    /// `tsParseLiteralTypeNode`
    fn parse_ts_lit_type_node(&mut self) -> PResult<TsLitType> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();

        let lit = if self.input().is(Token::BackQuote) {
            let tpl = self.parse_ts_tpl_lit_type()?;
            TsLit::Tpl(tpl)
        } else {
            match self.parse_lit()? {
                Lit::BigInt(n) => TsLit::BigInt(n),
                Lit::Bool(n) => TsLit::Bool(n),
                Lit::Num(n) => {
                    if self.input().syntax().flow()
                        && n.raw.as_deref().is_some_and(is_legacy_octal_number_raw)
                    {
                        self.emit_err(n.span, SyntaxError::TS1003);
                    }
                    TsLit::Number(n)
                }
                Lit::Str(n) => {
                    if self.input().syntax().flow()
                        && n.raw.as_deref().is_some_and(has_legacy_octal_escape)
                    {
                        self.emit_err(n.span, SyntaxError::TS1003);
                    }
                    TsLit::Str(n)
                }
                _ => unreachable!(),
            }
        };

        Ok(TsLitType {
            span: self.span(start),
            lit,
        })
    }

    /// `tsParseHeritageClause`
    pub(crate) fn parse_ts_heritage_clause(&mut self) -> PResult<Vec<TsExprWithTypeArgs>> {
        debug_assert!(self.input().syntax().typescript());

        self.parse_ts_delimited_list(
            ParsingContext::HeritageClauseElement,
            Self::parse_ts_heritage_clause_element,
        )
    }

    fn parse_ts_heritage_clause_element(&mut self) -> PResult<TsExprWithTypeArgs> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();
        // Note: TS uses parseLeftHandSideExpressionOrHigher,
        // then has grammar errors later if it's not an EntityName.

        let ident = self.parse_ident_name()?.into();
        let expr = self.parse_subscripts(Callee::Expr(ident), true, true)?;
        if !matches!(
            &*expr,
            Expr::Ident(..) | Expr::Member(..) | Expr::TsInstantiation(..)
        ) {
            self.emit_err(self.span(start), SyntaxError::TS2499);
        }

        match *expr {
            Expr::TsInstantiation(v) => Ok(TsExprWithTypeArgs {
                span: v.span,
                expr: v.expr,
                type_args: Some(v.type_args),
            }),
            _ => {
                let type_args = if self.input().is(Token::Lt) {
                    let ret = self.parse_ts_type_args()?;
                    self.assert_and_bump(Token::Gt);
                    Some(ret)
                } else {
                    None
                };

                Ok(TsExprWithTypeArgs {
                    span: self.span(start),
                    expr,
                    type_args,
                })
            }
        }
    }

    /// `tsSkipParameterStart`
    fn skip_ts_parameter_start(&mut self) -> PResult<bool> {
        debug_assert!(self.input().syntax().typescript());

        let _ = self.eat_any_ts_modifier()?;

        let cur = self.input().cur();

        if cur == Token::Void {
            Ok(false)
        } else if cur.is_word() || cur == Token::This {
            self.bump();
            Ok(true)
        } else if (cur == Token::LBrace || cur == Token::LBracket)
            && self.parse_binding_pat_or_ident(false).is_ok()
        {
            Ok(true)
        } else {
            Ok(false)
        }
    }

    /// `tsIsUnambiguouslyStartOfFunctionType`
    fn is_ts_unambiguously_start_of_fn_type(&mut self) -> PResult<bool> {
        debug_assert!(self.input().syntax().typescript());

        let disallow_flow_anon_fn_type =
            self.is_flow_syntax() && self.ctx().contains(Context::DisallowFlowAnonFnType);

        self.assert_and_bump(Token::LParen);
        let starts_with_parenthesized_object_or_array =
            matches!(self.input().cur(), Token::LBrace | Token::LBracket);

        let cur = self.input().cur();
        if cur == Token::RParen || cur == Token::DotDotDot {
            // ( )
            // ( ...
            return Ok(true);
        }
        if self.skip_ts_parameter_start()? {
            let cur = self.input().cur();
            if cur == Token::QuestionMark
                && !(self.is_flow_syntax()
                    && peek!(self).is_some_and(|peek| {
                        !matches!(
                            peek,
                            Token::Colon | Token::Comma | Token::Eq | Token::RParen
                        )
                    }))
            {
                return Ok(true);
            }

            if matches!(cur, Token::Colon | Token::Comma | Token::Eq) {
                // ( xxx :
                // ( xxx ,
                // ( xxx ?
                // ( xxx =
                if disallow_flow_anon_fn_type && starts_with_parenthesized_object_or_array {
                    return Ok(false);
                }
                return Ok(true);
            }
            if self.input_mut().eat(Token::RParen) && self.input().cur() == Token::Arrow {
                if disallow_flow_anon_fn_type {
                    // In arrow return type context, `(T) => U` should bind to
                    // the outer arrow unless the function type is parenthesized.
                    return Ok(false);
                }
                // ( xxx ) =>
                return Ok(true);
            }
        }

        if self.is_flow_syntax()
            // The outer `ts_look_ahead` already provides rollback and
            // `IgnoreError`, so this nested probe only needs a parser-state
            // checkpoint while checking Flow's anonymous-signature parameter
            // form.
            && self.parser_look_ahead(|p| {
                p.try_parse_flow_anon_signature_param(0)
                    .ok()
                    .flatten()
                    .is_some()
            })
        {
            if self.input().is(Token::Comma) {
                if disallow_flow_anon_fn_type && starts_with_parenthesized_object_or_array {
                    return Ok(false);
                }
                return Ok(true);
            }

            if self.input_mut().eat(Token::RParen) && self.input().cur() == Token::Arrow {
                if disallow_flow_anon_fn_type {
                    // In arrow return type context, `(T) => U` should bind to
                    // the outer arrow unless the function type is parenthesized.
                    return Ok(false);
                }

                return Ok(true);
            }
        }

        Ok(false)
    }

    fn is_ts_start_of_fn_type(&mut self) -> bool {
        debug_assert!(self.input().syntax().typescript());

        if self.input().cur() == Token::Lt {
            return true;
        }

        self.input().cur() == Token::LParen
            && self
                .ts_look_ahead(Self::is_ts_unambiguously_start_of_fn_type)
                .unwrap_or_default()
    }

    /// `tsIsUnambiguouslyIndexSignature`
    fn is_ts_unambiguously_index_signature(&mut self) -> bool {
        debug_assert!(self.input().syntax().typescript());

        // Note: babel's comment is wrong
        self.assert_and_bump(Token::LBracket); // Skip '['

        // ',' is for error recovery
        let has_ident = if self.input().syntax().flow() {
            if self.input().cur().is_word() {
                self.bump();
                true
            } else {
                false
            }
        } else {
            self.eat_ident_ref()
        };

        has_ident && {
            let cur = self.input().cur();
            cur == Token::Comma || cur == Token::Colon
        }
    }

    /// `tsTryParseIndexSignature`
    pub(crate) fn try_parse_ts_index_signature(
        &mut self,
        index_signature_start: BytePos,
        readonly: bool,
        is_static: bool,
    ) -> PResult<Option<TsIndexSignature>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        if !(self.input().cur() == Token::LBracket
            && self.token_look_ahead(Self::is_ts_unambiguously_index_signature))
        {
            return Ok(None);
        }

        expect!(self, Token::LBracket);

        let ident_start = self.cur_pos();
        let mut id = self.parse_ident_name().map(BindingIdent::from)?;
        let type_ann_start = self.cur_pos();

        if self.input_mut().eat(Token::Comma) {
            self.emit_err(id.span, SyntaxError::TS1096);
        } else {
            expect!(self, Token::Colon);
        }

        let type_ann = self.parse_ts_type_ann(/* eat_colon */ false, type_ann_start)?;
        id.span = self.span(ident_start);
        id.type_ann = Some(type_ann);

        expect!(self, Token::RBracket);

        let params = vec![TsFnParam::Ident(id)];

        let ty = self.try_parse_ts_type_ann()?;
        let type_ann = ty;

        self.parse_ts_type_member_semicolon()?;

        Ok(Some(TsIndexSignature {
            span: self.span(index_signature_start),
            readonly,
            is_static,
            params,
            type_ann,
        }))
    }

    /// Flow supports unnamed object indexers like `[keyof T]: V`.
    fn try_parse_flow_anon_index_signature(
        &mut self,
        index_signature_start: BytePos,
        readonly: bool,
        is_static: bool,
    ) -> PResult<Option<TsIndexSignature>> {
        if !self.input().syntax().flow()
            || !self.ctx().contains(Context::InType)
            || self.input().cur() != Token::LBracket
        {
            return Ok(None);
        }

        // Flow internal slots use a double-bracket form like `[[foo]]`.
        // Those members are parsed by the regular property/method path, so the
        // anonymous indexer fast-path must not consume them.
        if peek!(self).is_some_and(|peek| peek == Token::LBracket) {
            return Ok(None);
        }

        expect!(self, Token::LBracket);

        let key_start = self.cur_pos();
        let key_type = self.parse_ts_type()?;
        expect!(self, Token::RBracket);

        let params = vec![self.make_flow_anon_fn_param(key_start, 0, None, key_type)];
        let type_ann = Some(self.parse_ts_type_or_type_predicate_ann(Token::Colon)?);

        self.parse_ts_type_member_semicolon()?;

        Ok(Some(TsIndexSignature {
            span: self.span(index_signature_start),
            readonly,
            is_static,
            params,
            type_ann,
        }))
    }

    /// `tsIsExternalModuleReference`
    fn is_ts_external_module_ref(&mut self) -> bool {
        debug_assert!(self.input().syntax().typescript());
        self.input().is(Token::Require) && peek!(self).is_some_and(|t| t == Token::LParen)
    }

    /// `tsParseModuleReference`
    fn parse_ts_module_ref(&mut self) -> PResult<TsModuleRef> {
        debug_assert!(self.input().syntax().typescript());

        if self.is_ts_external_module_ref() {
            self.parse_ts_external_module_ref().map(From::from)
        } else {
            self.parse_ts_entity_name(/* allow_reserved_words */ false)
                .map(From::from)
        }
    }

    /// `tsParseExternalModuleReference`
    fn parse_ts_external_module_ref(&mut self) -> PResult<TsExternalModuleRef> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();
        expect!(self, Token::Require);
        expect!(self, Token::LParen);
        let cur = self.input().cur();
        if cur == Token::Error {
            let err = self.input_mut().expect_error_token_and_bump();
            return Err(err);
        } else if cur != Token::Str {
            unexpected!(self, "a string literal")
        }
        let expr = self.parse_str_lit();
        expect!(self, Token::RParen);
        Ok(TsExternalModuleRef {
            span: self.span(start),
            expr,
        })
    }

    /// `tsParseImportEqualsDeclaration`
    pub(crate) fn parse_ts_import_equals_decl(
        &mut self,
        start: BytePos,
        id: Ident,
        is_export: bool,
        is_type_only: bool,
    ) -> PResult<Box<TsImportEqualsDecl>> {
        debug_assert!(self.input().syntax().typescript());

        expect!(self, Token::Eq);
        let module_ref = self.parse_ts_module_ref()?;
        self.expect_general_semi()?;

        Ok(Box::new(TsImportEqualsDecl {
            span: self.span(start),
            id,
            is_export,
            is_type_only,
            module_ref,
        }))
    }

    /// `tsParseBindingListForSignature`
    ///
    /// Eats ')` at the end but does not eat `(` at start.
    fn parse_ts_binding_list_for_signature(&mut self) -> PResult<Vec<TsFnParam>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        debug_assert!(self.input().syntax().typescript());

        fn pat_to_ts_fn_param<I: Tokens>(p: &mut Parser<I>, pat: Pat) -> PResult<TsFnParam> {
            let item = match pat {
                Pat::Ident(pat) => {
                    if p.input().syntax().flow() && &*pat.id.sym == "static" {
                        p.emit_err(
                            pat.span(),
                            SyntaxError::InvalidIdentInStrict(atom!("static")),
                        );
                    }

                    TsFnParam::Ident(pat)
                }
                Pat::Array(pat) => TsFnParam::Array(pat),
                Pat::Object(pat) => TsFnParam::Object(pat),
                Pat::Rest(pat) => TsFnParam::Rest(pat),
                _ => unexpected!(
                    p,
                    "an identifier, [ for an array pattern, { for an object patter or ... for a \
                     rest pattern"
                ),
            };

            Ok(item)
        }

        if self.input().syntax().flow() && self.ctx().contains(Context::InType) {
            let mut list = Vec::with_capacity(4);
            let mut rest_span = Span::default();

            while !self.input().is(Token::RParen) {
                if !rest_span.is_dummy() {
                    self.emit_err(rest_span, SyntaxError::TS1014);
                }

                let can_try_flow_anon_param = if self.input().is(Token::DotDotDot) {
                    self.token_look_ahead(|p| {
                        p.bump();
                        p.flow_starts_like_anon_signature_param_type()
                    })
                } else {
                    self.flow_starts_like_anon_signature_param_type()
                };

                if can_try_flow_anon_param {
                    let param = if self.can_direct_parse_flow_anon_signature_param() {
                        self.try_parse_flow_anon_signature_param(list.len())?
                    } else {
                        self.try_parse_ts(|p| p.try_parse_flow_anon_signature_param(list.len()))
                    };

                    if let Some(param) = param {
                        if matches!(param, TsFnParam::Rest(..)) {
                            rest_span = param.span();
                        }
                        list.push(param);
                        if !self.input().is(Token::RParen) {
                            expect!(self, Token::Comma);
                            if !rest_span.is_dummy() && self.input().is(Token::RParen) {
                                self.emit_err(
                                    self.input().prev_span(),
                                    SyntaxError::CommaAfterRestElement,
                                );
                            }
                        }
                        continue;
                    }
                }

                {
                    let pat_start = self.cur_pos();
                    let pat = if self.input_mut().eat(Token::DotDotDot) {
                        let dot3_token = self.span(pat_start);

                        let mut pat = self.parse_binding_pat_or_ident(false)?;

                        if self.input_mut().eat(Token::Eq) {
                            let right = self.parse_assignment_expr()?;
                            self.emit_err(pat.span(), SyntaxError::TS1048);
                            pat = AssignPat {
                                span: self.span(pat_start),
                                left: Box::new(pat),
                                right,
                            }
                            .into();
                        }

                        let type_ann = if self.input().syntax().typescript()
                            && self.input().is(Token::Colon)
                        {
                            let cur_pos = self.cur_pos();
                            Some(self.parse_ts_type_ann(/* eat_colon */ true, cur_pos)?)
                        } else {
                            None
                        };

                        let pat: Pat = RestPat {
                            span: self.span(pat_start),
                            dot3_token,
                            arg: Box::new(pat),
                            type_ann,
                        }
                        .into();

                        if self.syntax().typescript() && self.input_mut().eat(Token::QuestionMark) {
                            self.emit_err(self.input().prev_span(), SyntaxError::TS1047);
                        }

                        rest_span = pat.span();
                        pat
                    } else {
                        self.parse_formal_param_pat()?
                    };

                    let is_rest = matches!(pat, Pat::Rest(..));
                    let item = pat_to_ts_fn_param(self, pat)?;
                    list.push(item);

                    if is_rest && !self.input().is(Token::RParen) {
                        rest_span = list.last().expect("rest param").span();
                    }
                }

                if !self.input().is(Token::RParen) {
                    expect!(self, Token::Comma);
                    if !rest_span.is_dummy() && self.input().is(Token::RParen) {
                        self.emit_err(self.input().prev_span(), SyntaxError::CommaAfterRestElement);
                    }
                }
            }

            expect!(self, Token::RParen);
            return Ok(list);
        }

        let params = self.parse_formal_params()?;
        let mut list = Vec::with_capacity(4);

        for param in params {
            list.push(pat_to_ts_fn_param(self, param.pat)?);
        }
        expect!(self, Token::RParen);
        Ok(list)
    }

    /// `tsIsStartOfMappedType`
    fn is_ts_start_of_mapped_type(&mut self) -> bool {
        debug_assert!(self.input().syntax().typescript());

        self.bump();
        if self.input_mut().eat(Token::Plus) || self.input_mut().eat(Token::Minus) {
            return self.input().is(Token::Readonly);
        }

        self.input_mut().eat(Token::Readonly);

        if !self.input().is(Token::LBracket) {
            return false;
        }
        self.bump();
        if !self.is_ident_ref() {
            return false;
        }
        self.bump();

        self.input().is(Token::In)
    }

    /// `tsParseSignatureMember`
    fn parse_ts_signature_member(
        &mut self,
        kind: SignatureParsingMode,
    ) -> PResult<Either<TsCallSignatureDecl, TsConstructSignatureDecl>> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();

        if kind == SignatureParsingMode::TSConstructSignatureDeclaration {
            expect!(self, Token::New);
        }

        // ----- inlined self.tsFillSignature(tt.colon, node);
        let type_params = self.try_parse_ts_type_params(false, true)?;
        expect!(self, Token::LParen);
        let params = self.parse_ts_binding_list_for_signature()?;
        let type_ann = if self.input().is(Token::Colon) {
            Some(self.parse_ts_type_or_type_predicate_ann(Token::Colon)?)
        } else {
            None
        };
        if self.input().syntax().flow() && type_ann.is_none() {
            self.emit_err(self.span(start), SyntaxError::TS1003);
        }
        // -----

        self.parse_ts_type_member_semicolon()?;

        match kind {
            SignatureParsingMode::TSCallSignatureDeclaration => {
                Ok(Either::Left(TsCallSignatureDecl {
                    span: self.span(start),
                    params,
                    type_ann,
                    type_params,
                }))
            }
            SignatureParsingMode::TSConstructSignatureDeclaration => {
                Ok(Either::Right(TsConstructSignatureDecl {
                    span: self.span(start),
                    params,
                    type_ann,
                    type_params,
                }))
            }
        }
    }

    fn try_parse_ts_tuple_element_name(&mut self) -> Option<Pat> {
        if !cfg!(feature = "typescript") {
            return Default::default();
        }

        if !self.can_start_ts_tuple_element_name() {
            return None;
        }

        // The token lookahead above has already proven the `...foo?:` / `foo:` shape,
        // so we can parse the label directly without opening a speculative checkpoint.
        let start = self.cur_pos();

        let rest = if self.input_mut().eat(Token::DotDotDot) {
            Some(self.input().prev_span())
        } else {
            None
        };

        let mut ident = match self.parse_ident_name().map(Ident::from) {
            Ok(ident) => ident,
            Err(err) => {
                self.emit_error(err);
                return None;
            }
        };
        if self.input_mut().eat(Token::QuestionMark) {
            ident.optional = true;
            ident.span = ident.span.with_hi(self.input().prev_span().hi);
        }

        if self.input().syntax().flow() && rest.is_some() && ident.optional {
            self.emit_err(ident.span, SyntaxError::TS1003);
        }
        self.assert_and_bump(Token::Colon);

        Some(if let Some(dot3_token) = rest {
            RestPat {
                span: self.span(start),
                dot3_token,
                arg: ident.into(),
                type_ann: None,
            }
            .into()
        } else {
            ident.into()
        })
    }

    fn can_start_ts_tuple_element_name(&mut self) -> bool {
        self.token_look_ahead(|p| {
            p.input_mut().eat(Token::DotDotDot);

            if !p.input().cur().is_word() {
                return false;
            }

            p.bump();
            p.input_mut().eat(Token::QuestionMark);
            p.input().is(Token::Colon)
        })
    }

    /// `tsParseTupleElementType`
    fn parse_ts_tuple_element_type(&mut self) -> PResult<TsTupleElement> {
        debug_assert!(self.input().syntax().typescript());

        // parses `...TsType[]`
        let start = self.cur_pos();

        if self.input().syntax().flow()
            && self.is_ident_ref()
            && self.token_look_ahead(|p| {
                p.bump();
                p.input_mut().eat(Token::QuestionMark) && !p.input().is(Token::Colon)
            })
        {
            self.emit_err(self.input().cur_span(), SyntaxError::TS1003);
        }

        let variance_span = if self.input().syntax().flow() {
            if self.input_mut().eat(Token::Plus) || self.input_mut().eat(Token::Minus) {
                Some(self.input().prev_span())
            } else {
                None
            }
        } else {
            None
        };

        let label = self.try_parse_ts_tuple_element_name();

        if self.input().syntax().flow() {
            if variance_span.is_some() && label.is_none() {
                self.emit_err(variance_span.unwrap(), SyntaxError::TS1003);
            }

            if let Some(Pat::Rest(rest)) = &label {
                if let Pat::Ident(ident) = rest.arg.as_ref() {
                    if ident.id.optional {
                        self.emit_err(ident.id.span, SyntaxError::TS1003);
                    }
                }
            }
        }

        if self.input_mut().eat(Token::DotDotDot) {
            let type_ann = if self.input().syntax().flow()
                && (self.input().is(Token::RBracket) || self.input().is(Token::Comma))
            {
                if self.input().is(Token::Comma) {
                    self.emit_err(self.input().cur_span(), SyntaxError::TS1003);
                }
                self.make_flow_any_keyword_type(start)
            } else {
                self.parse_ts_type()?
            };
            return Ok(TsTupleElement {
                span: self.span(start),
                label,
                ty: Box::new(TsType::TsRestType(TsRestType {
                    span: self.span(start),
                    type_ann,
                })),
            });
        }

        let ty = self.parse_ts_type()?;
        // parses `TsType?`
        if self.input_mut().eat(Token::QuestionMark) {
            let type_ann = ty;
            return Ok(TsTupleElement {
                span: self.span(start),
                label,
                ty: Box::new(TsType::TsOptionalType(TsOptionalType {
                    span: self.span(start),
                    type_ann,
                })),
            });
        }

        Ok(TsTupleElement {
            span: self.span(start),
            label,
            ty,
        })
    }

    /// `tsParseTupleType`
    fn parse_ts_tuple_type(&mut self) -> PResult<TsTupleType> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();
        let elems = if self.input().syntax().flow() {
            self.do_outside_of_context(Context::DisallowFlowAnonFnType, |p| {
                p.parse_ts_bracketed_list(
                    ParsingContext::TupleElementTypes,
                    Self::parse_ts_tuple_element_type,
                    /* bracket */ true,
                    /* skipFirstToken */ false,
                )
            })?
        } else {
            self.parse_ts_bracketed_list(
                ParsingContext::TupleElementTypes,
                Self::parse_ts_tuple_element_type,
                /* bracket */ true,
                /* skipFirstToken */ false,
            )?
        };

        // Validate the elementTypes to ensure:
        //   No mandatory elements may follow optional elements
        //   If there's a rest element, it must be at the end of the tuple

        let mut seen_optional_element = false;

        for elem in elems.iter() {
            match *elem.ty {
                TsType::TsRestType(..) => {}
                TsType::TsOptionalType(..) => {
                    seen_optional_element = true;
                }
                _ if seen_optional_element => {
                    syntax_error!(self, self.span(start), SyntaxError::TsRequiredAfterOptional)
                }
                _ => {}
            }
        }

        Ok(TsTupleType {
            span: self.span(start),
            elem_types: elems,
        })
    }

    /// `tsParseMappedType`
    fn parse_ts_mapped_type(&mut self) -> PResult<TsMappedType> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();
        expect!(self, Token::LBrace);
        let mut readonly = None;
        let cur = self.input().cur();
        if cur == Token::Plus || cur == Token::Minus {
            readonly = Some(if cur == Token::Plus {
                TruePlusMinus::Plus
            } else {
                TruePlusMinus::Minus
            });
            self.bump();
            expect!(self, Token::Readonly)
        } else if self.input_mut().eat(Token::Readonly) {
            readonly = Some(TruePlusMinus::True);
        }

        expect!(self, Token::LBracket);
        let type_param = self.parse_ts_mapped_type_param()?;
        let name_type = if self.input_mut().eat(Token::As) {
            Some(self.parse_ts_type()?)
        } else {
            None
        };
        expect!(self, Token::RBracket);

        let mut optional = None;
        let cur = self.input().cur();
        if cur == Token::Plus || cur == Token::Minus {
            optional = Some(if cur == Token::Plus {
                TruePlusMinus::Plus
            } else {
                TruePlusMinus::Minus
            });
            self.bump(); // +, -
            expect!(self, Token::QuestionMark);
        } else if self.input_mut().eat(Token::QuestionMark) {
            optional = Some(TruePlusMinus::True);
        }

        let type_ann = self.try_parse_ts_type()?;

        if !(self.input().syntax().flow() && self.input_mut().eat(Token::Comma)) {
            self.expect_general_semi()?;
        }

        expect!(self, Token::RBrace);

        Ok(TsMappedType {
            span: self.span(start),
            readonly,
            optional,
            type_param,
            name_type,
            type_ann,
        })
    }

    fn can_start_flow_mapped_member(&mut self) -> bool {
        self.input().syntax().flow()
            && self.input().is(Token::LBracket)
            && self.token_look_ahead(|p| {
                p.bump();

                if !p.input().cur().is_word() {
                    return false;
                }

                p.bump();
                if !p.input().is(Token::In) {
                    return false;
                }

                let mut depth = 1usize;
                loop {
                    match p.input().cur() {
                        Token::LBracket => depth += 1,
                        Token::RBracket => {
                            depth = depth.saturating_sub(1);
                            if depth == 0 {
                                p.bump();
                                return matches!(
                                    p.input().cur(),
                                    Token::QuestionMark | Token::Colon
                                );
                            }
                        }
                        Token::Eof => return false,
                        _ => {}
                    }

                    p.bump();
                }
            })
    }

    fn can_start_flow_parenthesized_fn_type(&mut self) -> bool {
        self.is_flow_syntax() && self.input().is(Token::LParen) && self.is_ts_start_of_fn_type()
    }

    /// `tsParseParenthesizedType`
    fn parse_ts_parenthesized_type(&mut self) -> PResult<TsParenthesizedType> {
        debug_assert!(self.input().syntax().typescript());
        trace_cur!(self, parse_ts_parenthesized_type);

        let start = self.cur_pos();
        expect!(self, Token::LParen);
        let type_ann = if self.input().syntax().flow() {
            self.do_outside_of_context(Context::DisallowFlowAnonFnType, Self::parse_ts_type)?
        } else {
            self.parse_ts_type()?
        };
        expect!(self, Token::RParen);
        Ok(TsParenthesizedType {
            span: self.span(start),
            type_ann,
        })
    }

    /// `tsParseTypeAliasDeclaration`
    pub(crate) fn parse_ts_type_alias_decl(
        &mut self,
        start: BytePos,
    ) -> PResult<Box<TsTypeAliasDecl>> {
        debug_assert!(self.input().syntax().typescript());

        let id = self.parse_ident_name()?;
        if self.syntax().flow() {
            self.emit_flow_reserved_type_name_error(id.span, &id.sym);
        }
        let type_params = self.try_parse_ts_type_params(true, false)?;
        let type_ann = self.expect_then_parse_ts_type(Token::Eq, "=")?;
        self.expect_general_semi()?;
        Ok(Box::new(TsTypeAliasDecl {
            declare: false,
            span: self.span(start),
            id: id.into(),
            type_params,
            type_ann,
        }))
    }

    fn make_flow_synthetic_type_alias_decl(
        &mut self,
        start: BytePos,
        id: Atom,
        type_ann: Box<TsType>,
    ) -> Box<TsTypeAliasDecl> {
        Box::new(TsTypeAliasDecl {
            declare: false,
            span: self.span(start),
            id: Ident::new_no_ctxt(id, self.span(start)),
            type_params: None,
            type_ann,
        })
    }

    fn parse_flow_opaque_type_alias_decl(
        &mut self,
        start: BytePos,
    ) -> PResult<Box<TsTypeAliasDecl>> {
        debug_assert!(self.input().syntax().flow());

        expect!(self, Token::Type);
        let id = self.parse_ident_name()?;
        if self.syntax().flow() {
            self.emit_flow_reserved_type_name_error(id.span, &id.sym);
        }
        let type_params = self.try_parse_ts_type_params(true, false)?;

        // Flow opaque type may have a supertype annotation before `=`.
        if self.input_mut().eat(Token::Colon) {
            let _ = self.in_type(Self::parse_ts_type)?;
        }

        let type_ann = if self.input_mut().eat(Token::Eq) {
            if self.ctx().contains(Context::InDeclare) {
                self.emit_err(self.input().prev_span(), SyntaxError::TS1003);
            }
            self.in_type(Self::parse_ts_type)?
        } else {
            self.make_flow_any_keyword_type(start)
        };

        self.expect_general_semi()?;

        Ok(Box::new(TsTypeAliasDecl {
            declare: false,
            span: self.span(start),
            id: id.into(),
            type_params,
            type_ann,
        }))
    }

    /// `tsParseFunctionOrConstructorType`
    fn parse_ts_fn_or_constructor_type(
        &mut self,
        is_fn_type: bool,
    ) -> PResult<TsFnOrConstructorType> {
        trace_cur!(self, parse_ts_fn_or_constructor_type);

        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();
        let is_abstract = if !is_fn_type {
            self.input_mut().eat(Token::Abstract)
        } else {
            false
        };
        if !is_fn_type {
            expect!(self, Token::New);
        }

        // ----- inlined `self.tsFillSignature(tt.arrow, node)`
        let type_params = self.try_parse_ts_type_params(false, true)?;
        expect!(self, Token::LParen);
        let params = self.parse_ts_binding_list_for_signature()?;
        let type_ann = self.parse_ts_type_or_type_predicate_ann(Token::Arrow)?;
        // ----- end

        Ok(if is_fn_type {
            TsFnOrConstructorType::TsFnType(TsFnType {
                span: self.span(start),
                type_params,
                params,
                type_ann,
            })
        } else {
            TsFnOrConstructorType::TsConstructorType(TsConstructorType {
                span: self.span(start),
                type_params,
                params,
                type_ann,
                is_abstract,
            })
        })
    }

    fn make_flow_anon_fn_param(
        &mut self,
        start: BytePos,
        index: usize,
        dot3_token: Option<Span>,
        type_ann: Box<TsType>,
    ) -> TsFnParam {
        let ann_span = type_ann.span();
        let type_ann = Some(Box::new(TsTypeAnn {
            span: ann_span,
            type_ann,
        }));
        let param_span = Span::new_with_checked(start, ann_span.hi);
        let ident = BindingIdent {
            id: Ident::new_no_ctxt(
                format!("__flow_anon_param_{index}").into(),
                Span::new_with_checked(param_span.lo, param_span.lo),
            ),
            type_ann,
        };

        if let Some(dot3_token) = dot3_token {
            TsFnParam::Rest(RestPat {
                span: param_span,
                dot3_token,
                arg: Box::new(Pat::Ident(ident)),
                type_ann: None,
            })
        } else {
            TsFnParam::Ident(ident)
        }
    }

    fn flow_starts_like_anon_signature_param_type(&mut self) -> bool {
        let cur = self.input().cur();

        if matches!(
            cur,
            Token::LParen
                | Token::LBrace
                | Token::LBracket
                | Token::QuestionMark
                | Token::Asterisk
                | Token::Minus
                | Token::Str
                | Token::Num
                | Token::BigInt
                | Token::True
                | Token::False
                | Token::BackQuote
                | Token::NoSubstitutionTemplateLiteral
                | Token::TemplateHead
                | Token::Import
                | Token::This
                | Token::TypeOf
                | Token::Void
                | Token::Null
                | Token::Any
                | Token::Boolean
                | Token::Bigint
                | Token::Never
                | Token::Number
                | Token::Object
                | Token::String
                | Token::Symbol
                | Token::Unknown
                | Token::Undefined
                | Token::Intrinsic
                | Token::Readonly
                | Token::Keyof
                | Token::Unique
                | Token::Infer
        ) {
            return true;
        }

        if cur == Token::Interface {
            return peek!(self).is_some_and(|peek| peek == Token::LBrace);
        }

        cur.is_word()
            && peek!(self).is_some_and(|peek| {
                matches!(
                    peek,
                    Token::Lt | Token::LShift | Token::Dot | Token::LBracket
                )
            })
    }

    fn can_direct_parse_flow_anon_signature_param_type(&mut self) -> bool {
        if self.input().is(Token::Interface) {
            return peek!(self).is_some_and(|peek| peek == Token::LBrace);
        }

        if self.input().cur().is_word() {
            return peek!(self).is_some_and(|peek| {
                matches!(
                    peek,
                    Token::Lt | Token::LShift | Token::Dot | Token::LBracket
                )
            });
        }

        matches!(
            self.input().cur(),
            Token::LParen
                | Token::QuestionMark
                | Token::Asterisk
                | Token::Minus
                | Token::Str
                | Token::Num
                | Token::BigInt
                | Token::True
                | Token::False
                | Token::BackQuote
                | Token::NoSubstitutionTemplateLiteral
                | Token::TemplateHead
                | Token::Import
                | Token::This
                | Token::TypeOf
                | Token::Void
                | Token::Null
                | Token::Any
                | Token::Boolean
                | Token::Bigint
                | Token::Never
                | Token::Number
                | Token::Object
                | Token::String
                | Token::Symbol
                | Token::Unknown
                | Token::Undefined
                | Token::Intrinsic
                | Token::Readonly
                | Token::Keyof
                | Token::Unique
                | Token::Infer
        )
    }

    fn can_direct_parse_flow_anon_signature_param(&mut self) -> bool {
        if !self.input().syntax().flow() || !self.ctx().contains(Context::InType) {
            return false;
        }

        if self.input().is(Token::DotDotDot) {
            return self.token_look_ahead(|p| {
                p.bump();
                p.can_direct_parse_flow_anon_signature_param_type()
            });
        }

        self.can_direct_parse_flow_anon_signature_param_type()
    }

    fn can_start_flow_anon_fn_type(&mut self) -> bool {
        self.is_flow_syntax()
            && self.input().is(Token::LParen)
            && self.token_look_ahead(|p| {
                p.bump();

                if p.input().is(Token::RParen) {
                    return false;
                }

                if p.input().is(Token::DotDotDot) {
                    p.bump();
                }

                p.flow_starts_like_anon_signature_param_type()
            })
    }

    fn try_parse_flow_anon_signature_param(&mut self, index: usize) -> PResult<Option<TsFnParam>> {
        if !self.input().syntax().flow() || !self.ctx().contains(Context::InType) {
            return Ok(None);
        }

        let start = self.cur_pos();
        let dot3_token = if self.input_mut().eat(Token::DotDotDot) {
            Some(self.input().prev_span())
        } else {
            None
        };

        if !self.flow_starts_like_anon_signature_param_type() {
            return Ok(None);
        }

        let ty = self.parse_ts_type()?;
        if matches!(
            self.input().cur(),
            Token::Colon | Token::QuestionMark | Token::Eq
        ) {
            return Ok(None);
        }
        if !(self.input().is(Token::Comma) || self.input().is(Token::RParen)) {
            return Ok(None);
        }

        Ok(Some(
            self.make_flow_anon_fn_param(start, index, dot3_token, ty),
        ))
    }

    fn try_parse_flow_anon_fn_type(&mut self) -> PResult<Option<TsFnType>> {
        if !self.input().syntax().flow()
            || self.ctx().contains(Context::DisallowFlowAnonFnType)
            || !self.input().is(Token::LParen)
        {
            return Ok(None);
        }

        let start = self.cur_pos();
        expect!(self, Token::LParen);

        // `() =>` is handled by the regular function type parser.
        if self.input().is(Token::RParen) {
            return Ok(None);
        }

        let mut params = Vec::new();

        loop {
            let param_start = self.cur_pos();
            let dot3_token = if self.input_mut().eat(Token::DotDotDot) {
                Some(self.input().prev_span())
            } else {
                None
            };
            let ty = self.parse_ts_type()?;

            // Named parameters are handled by the regular signature parser.
            if matches!(
                self.input().cur(),
                Token::Colon | Token::QuestionMark | Token::Eq
            ) {
                return Ok(None);
            }

            params.push(self.make_flow_anon_fn_param(param_start, params.len(), dot3_token, ty));

            if !self.input_mut().eat(Token::Comma) {
                break;
            }

            if self.input().is(Token::RParen) {
                break;
            }
        }

        expect!(self, Token::RParen);
        if !self.input().is(Token::Arrow) {
            return Ok(None);
        }

        let type_ann = self.parse_ts_type_or_type_predicate_ann(Token::Arrow)?;
        Ok(Some(TsFnType {
            span: self.span(start),
            params,
            type_params: None,
            type_ann,
        }))
    }

    /// `tsParseUnionTypeOrHigher`
    fn parse_ts_union_type_or_higher(&mut self) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_union_type_or_higher);
        debug_assert!(self.input().syntax().typescript());

        self.parse_ts_union_or_intersection_type(
            UnionOrIntersection::Union,
            Self::parse_ts_intersection_type_or_higher,
            Token::Pipe,
        )
    }

    /// `tsParseIntersectionTypeOrHigher`
    fn parse_ts_intersection_type_or_higher(&mut self) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_intersection_type_or_higher);

        debug_assert!(self.input().syntax().typescript());

        self.parse_ts_union_or_intersection_type(
            UnionOrIntersection::Intersection,
            Self::parse_ts_type_operator_or_higher,
            Token::Ampersand,
        )
    }

    /// `tsParseTypeOperatorOrHigher`
    fn parse_ts_type_operator_or_higher(&mut self) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_type_operator_or_higher);
        debug_assert!(self.input().syntax().typescript());

        let operator = if self.input().is(Token::Keyof) {
            Some(TsTypeOperatorOp::KeyOf)
        } else if self.input().is(Token::Unique) {
            Some(TsTypeOperatorOp::Unique)
        } else if self.input().is(Token::Readonly) {
            Some(TsTypeOperatorOp::ReadOnly)
        } else {
            None
        };

        match operator {
            Some(operator) => self
                .parse_ts_type_operator(operator)
                .map(TsType::from)
                .map(Box::new),
            None => {
                trace_cur!(self, parse_ts_type_operator_or_higher__not_operator);

                if self.input().is(Token::Infer) {
                    self.parse_ts_infer_type().map(TsType::from).map(Box::new)
                } else {
                    if self.is_ts_start_of_fn_type() {
                        return self
                            .parse_ts_fn_or_constructor_type(true)
                            .map(TsType::from)
                            .map(Box::new);
                    }

                    let start = self.cur_pos();
                    let readonly = self.parse_ts_modifier(&[Token::Readonly], false)?.is_some();
                    let ty = self.parse_ts_array_type_or_higher(readonly)?;

                    if self.is_flow_syntax()
                        && !self.ctx().contains(Context::DisallowFlowAnonFnType)
                        && !self.input().had_line_break_before_cur()
                        && self.input().is(Token::Arrow)
                        && !matches!(&*ty, TsType::TsThisType(..))
                    {
                        let param = self.make_flow_anon_fn_param(ty.span_lo(), 0, None, ty);
                        let type_ann = self.parse_ts_type_or_type_predicate_ann(Token::Arrow)?;
                        return Ok(Box::new(TsType::TsFnOrConstructorType(
                            TsFnOrConstructorType::TsFnType(TsFnType {
                                span: self.span(start),
                                type_params: None,
                                params: vec![param],
                                type_ann,
                            }),
                        )));
                    }

                    Ok(ty)
                }
            }
        }
    }

    /// `tsParseTypeOperator`
    fn parse_ts_type_operator(&mut self, op: TsTypeOperatorOp) -> PResult<TsTypeOperator> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();
        match op {
            TsTypeOperatorOp::Unique => expect!(self, Token::Unique),
            TsTypeOperatorOp::KeyOf => expect!(self, Token::Keyof),
            TsTypeOperatorOp::ReadOnly => expect!(self, Token::Readonly),
            #[cfg(swc_ast_unknown)]
            _ => unreachable!(),
        }

        let type_ann = self.parse_ts_type_operator_or_higher()?;
        Ok(TsTypeOperator {
            span: self.span(start),
            op,
            type_ann,
        })
    }

    /// `tsParseInferType`
    fn parse_ts_infer_type(&mut self) -> PResult<TsInferType> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();
        expect!(self, Token::Infer);
        let type_param_name = self.parse_ident_name()?;
        let constraint = if self.input().is(Token::Extends) {
            if self.ctx().contains(Context::DisallowConditionalTypes) {
                // Callers that already disallow conditional types never need the
                // speculative `infer U extends T ? ...` probe. Parse the constraint
                // directly and leave `?` to the enclosing type parser.
                self.bump();
                Some(self.parse_ts_non_conditional_type()?)
            } else {
                self.try_parse_ts(|p| {
                    expect!(p, Token::Extends);
                    let constraint = p.parse_ts_non_conditional_type();
                    if p.input().is(Token::QuestionMark) {
                        Ok(None)
                    } else {
                        constraint.map(Some)
                    }
                })
            }
        } else {
            None
        };
        let type_param = TsTypeParam {
            span: type_param_name.span(),
            name: type_param_name.into(),
            is_in: false,
            is_out: false,
            is_const: false,
            constraint,
            default: None,
        };
        Ok(TsInferType {
            span: self.span(start),
            type_param,
        })
    }

    /// `tsParseNonConditionalType`
    fn parse_ts_non_conditional_type(&mut self) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_non_conditional_type);

        debug_assert!(self.input().syntax().typescript());

        if self.can_start_flow_parenthesized_fn_type() {
            if self.can_start_flow_anon_fn_type() {
                if let Some(fn_type) = self.try_parse_ts(Self::try_parse_flow_anon_fn_type) {
                    return Ok(Box::new(TsType::TsFnOrConstructorType(
                        TsFnOrConstructorType::TsFnType(fn_type),
                    )));
                }
            }

            return self
                .parse_ts_fn_or_constructor_type(true)
                .map(TsType::from)
                .map(Box::new);
        }

        if self.is_ts_start_of_fn_type() {
            return self
                .parse_ts_fn_or_constructor_type(true)
                .map(TsType::from)
                .map(Box::new);
        }
        if (self.input().is(Token::Abstract) && peek!(self).is_some_and(|cur| cur == Token::New))
            || self.input().is(Token::New)
        {
            // As in `new () => Date`
            return self
                .parse_ts_fn_or_constructor_type(false)
                .map(TsType::from)
                .map(Box::new);
        }

        self.parse_ts_union_type_or_higher()
    }

    /// `tsParseArrayTypeOrHigher`
    fn parse_ts_array_type_or_higher(&mut self, readonly: bool) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_array_type_or_higher);
        debug_assert!(self.input().syntax().typescript());

        let mut ty = self.parse_ts_non_array_type()?;

        while !self.input().had_line_break_before_cur() {
            let has_index = if self.input_mut().eat(Token::LBracket) {
                true
            } else if self.input().syntax().flow() && self.input_mut().eat(Token::OptionalChain) {
                if self.input_mut().eat(Token::LBracket) {
                    true
                } else {
                    self.emit_err(self.input().cur_span(), SyntaxError::TS1003);
                    false
                }
            } else if self.input().syntax().flow()
                && self.input().is(Token::QuestionMark)
                && peek!(self).is_some_and(|peek| peek == Token::Dot)
            {
                self.token_look_ahead(|p| {
                    p.input_mut().eat(Token::QuestionMark)
                        && p.input_mut().eat(Token::Dot)
                        && p.input_mut().eat(Token::LBracket)
                })
            } else {
                false
            };

            if !has_index {
                break;
            }

            if self.input_mut().eat(Token::RBracket) {
                ty = Box::new(TsType::TsArrayType(TsArrayType {
                    span: self.span(ty.span_lo()),
                    elem_type: ty,
                }));
            } else {
                let index_type = self.parse_ts_type()?;
                expect!(self, Token::RBracket);
                ty = Box::new(TsType::TsIndexedAccessType(TsIndexedAccessType {
                    span: self.span(ty.span_lo()),
                    readonly,
                    obj_type: ty,
                    index_type,
                }))
            }
        }

        Ok(ty)
    }

    /// Be sure to be in a type context before calling self.
    ///
    /// `tsParseType`
    pub(crate) fn parse_ts_type(&mut self) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_type);

        debug_assert!(self.input().syntax().typescript());

        // Need to set `state.inType` so that we don't parse JSX in a type context.
        debug_assert!(self.ctx().contains(Context::InType));

        let start = self.cur_pos();

        self.do_outside_of_context(Context::DisallowConditionalTypes, |p| {
            let ty = p.parse_ts_non_conditional_type()?;
            if p.input().syntax().flow()
                && !p.input().had_line_break_before_cur()
                && p.input().is(Token::Arrow)
            {
                if let TsType::TsThisType(this_ty) = &*ty {
                    let this_ident = BindingIdent {
                        id: Ident::new_no_ctxt(atom!("this"), this_ty.span),
                        type_ann: None,
                    };
                    let type_ann = p.parse_ts_type_or_type_predicate_ann(Token::Arrow)?;
                    return Ok(Box::new(TsType::TsFnOrConstructorType(
                        TsFnOrConstructorType::TsFnType(TsFnType {
                            span: p.span(start),
                            type_params: None,
                            params: vec![TsFnParam::Ident(this_ident)],
                            type_ann,
                        }),
                    )));
                }
            }
            if p.input().had_line_break_before_cur() || !p.input_mut().eat(Token::Extends) {
                return Ok(ty);
            }

            let check_type = ty;
            let extends_type = p.do_inside_of_context(
                Context::DisallowConditionalTypes,
                Self::parse_ts_non_conditional_type,
            )?;

            expect!(p, Token::QuestionMark);

            let true_type = p.parse_ts_type()?;

            expect!(p, Token::Colon);

            let false_type = p.parse_ts_type()?;

            Ok(Box::new(TsType::TsConditionalType(TsConditionalType {
                span: p.span(start),
                check_type,
                extends_type,
                true_type,
                false_type,
            })))
        })
    }

    /// `parsePropertyName` in babel.
    ///
    /// Returns `(computed, key)`.
    fn parse_ts_property_name(&mut self) -> PResult<(bool, Box<Expr>)> {
        let (computed, key) = if self.input().syntax().flow()
            && self.input().is(Token::At)
            && peek!(self).is_some_and(|peek| peek == Token::At)
        {
            let start = self.cur_pos();
            self.assert_and_bump(Token::At);
            self.assert_and_bump(Token::At);

            if !self.input().cur().is_word() {
                unexpected!(self, "identifier");
            }
            let key = self.input_mut().expect_word_token_and_bump();

            (
                false,
                Box::new(Expr::Lit(Lit::Str(Str {
                    span: self.span(start),
                    value: format!("@@{key}").into(),
                    raw: None,
                }))),
            )
        } else if self.input_mut().eat(Token::LBracket) {
            let key = self.parse_assignment_expr()?;
            expect!(self, Token::RBracket);
            (true, key)
        } else {
            self.do_inside_of_context(Context::InPropertyName, |p| {
                // We check if it's valid for it to be a private name when we push it.
                let cur = p.input().cur();

                let key = if cur == Token::Num || cur == Token::Str {
                    p.parse_new_expr()
                } else if cur == Token::Error {
                    let err = p.input_mut().expect_error_token_and_bump();
                    return Err(err);
                } else {
                    p.parse_maybe_private_name().map(|e| match e {
                        Either::Left(e) => {
                            p.emit_err(e.span(), SyntaxError::PrivateNameInInterface);

                            e.into()
                        }
                        Either::Right(e) => e.into(),
                    })
                };
                key.map(|key| (false, key))
            })?
        };

        Ok((computed, key))
    }

    /// `tsParsePropertyOrMethodSignature`
    fn parse_ts_property_or_method_signature(
        &mut self,
        start: BytePos,
        readonly: bool,
    ) -> PResult<Either<TsPropertySignature, TsMethodSignature>> {
        debug_assert!(self.input().syntax().typescript());

        let (computed, key) = self.parse_ts_property_name()?;

        if self.input().syntax().flow() && readonly && computed && matches!(*key, Expr::Array(..)) {
            self.emit_err(key.span(), SyntaxError::TS1003);
        }

        let optional = self.input_mut().eat(Token::QuestionMark);

        let cur = self.input().cur();
        if matches!(cur, Token::LParen | Token::Lt) {
            if readonly {
                syntax_error!(self, SyntaxError::ReadOnlyMethod);
            }

            let type_params = self.try_parse_ts_type_params(false, true)?;
            expect!(self, Token::LParen);
            let params = self.parse_ts_binding_list_for_signature()?;
            let type_ann = if self.input().is(Token::Colon) {
                self.parse_ts_type_or_type_predicate_ann(Token::Colon)
                    .map(Some)?
            } else {
                None
            };
            // -----

            self.parse_ts_type_member_semicolon()?;
            Ok(Either::Right(TsMethodSignature {
                span: self.span(start),
                computed,
                key,
                optional,
                type_params,
                params,
                type_ann,
            }))
        } else {
            let type_ann = self.try_parse_ts_type_ann()?;

            if self.input().syntax().flow() && type_ann.is_none() {
                self.emit_err(self.span(start), SyntaxError::TS1003);
            }

            self.parse_ts_type_member_semicolon()?;
            Ok(Either::Left(TsPropertySignature {
                span: self.span(start),
                computed,
                readonly,
                key,
                optional,
                type_ann,
            }))
        }
    }

    /// `tsParseTypeMember`
    fn parse_ts_type_member(&mut self) -> PResult<TsTypeElement> {
        debug_assert!(self.input().syntax().typescript());

        fn into_type_elem(
            e: Either<TsCallSignatureDecl, TsConstructSignatureDecl>,
        ) -> TsTypeElement {
            match e {
                Either::Left(e) => e.into(),
                Either::Right(e) => e.into(),
            }
        }
        let cur = self.input().cur();
        if cur == Token::LParen || cur == Token::Lt {
            return self
                .parse_ts_signature_member(SignatureParsingMode::TSCallSignatureDeclaration)
                .map(into_type_elem);
        }
        if self.input().is(Token::New)
            && peek!(self).is_some_and(|peek| matches!(peek, Token::LParen | Token::Lt))
        {
            return self
                .parse_ts_signature_member(SignatureParsingMode::TSConstructSignatureDeclaration)
                .map(into_type_elem);
        }
        // Instead of fullStart, we create a node here.
        let start = self.cur_pos();
        let mut readonly = self.parse_ts_modifier(&[Token::Readonly], false)?.is_some();
        let mut flow_minus_variance = false;

        if self.input().syntax().flow() {
            if self.input_mut().eat(Token::Plus) {
                readonly = true;
            } else {
                flow_minus_variance = self.input_mut().eat(Token::Minus);
            }
        }

        if self.can_start_flow_mapped_member() {
            return self.parse_flow_mapped_type_member(readonly);
        }

        if self.input().syntax().flow() && self.input_mut().eat(Token::DotDotDot) {
            if readonly || flow_minus_variance {
                self.emit_err(self.span(start), SyntaxError::TS1003);
            }

            let type_ann = if self.input().is(Token::Comma)
                || self.input().is(Token::Semi)
                || self.input().is(Token::RBrace)
                || (self.input().is(Token::Pipe)
                    && peek!(self).is_some_and(|peek| peek == Token::RBrace))
            {
                None
            } else {
                let type_ann = self.parse_ts_type()?;
                Some(Box::new(TsTypeAnn {
                    span: Span::new_with_checked(start, self.input().prev_span().hi),
                    type_ann,
                }))
            };

            self.input_mut().eat(Token::Comma);
            self.input_mut().eat(Token::Semi);

            return Ok(TsPropertySignature {
                span: self.span(start),
                computed: false,
                readonly: false,
                key: Box::new(Expr::Ident(Ident::new_no_ctxt(
                    atom!("__flow_spread"),
                    self.span(start),
                ))),
                optional: false,
                type_ann,
            }
            .into());
        }

        let idx = self.try_parse_ts_index_signature(start, readonly, false)?;
        if let Some(idx) = idx {
            return Ok(idx.into());
        }

        let flow_anon_idx = self.try_parse_flow_anon_index_signature(start, readonly, false)?;
        if let Some(idx) = flow_anon_idx {
            return Ok(idx.into());
        }

        // Plain Flow object members dominate this path. Fully disambiguated
        // getter signatures can parse directly, while the remaining accessor
        // shapes still use the speculative path for recovery.
        if self.can_direct_parse_flow_getter_sig() {
            return self.parse_flow_getter_sig_member(readonly);
        }

        if self.can_direct_parse_flow_setter_sig() {
            return self.parse_flow_setter_sig_member(readonly);
        }

        if self.can_start_flow_accessor_sig() {
            if let Some(v) = self.try_parse_ts(|p| {
                let start = p.input().cur_pos();

                if readonly {
                    syntax_error!(p, SyntaxError::GetterSetterCannotBeReadonly)
                }

                let is_get = if p.input_mut().eat(Token::Get) {
                    true
                } else {
                    expect!(p, Token::Set);
                    false
                };

                let (computed, key) = p.parse_ts_property_name()?;

                if is_get {
                    expect!(p, Token::LParen);
                    expect!(p, Token::RParen);
                    let type_ann = p.try_parse_ts_type_ann()?;

                    p.parse_ts_type_member_semicolon()?;

                    Ok(Some(TsTypeElement::TsGetterSignature(TsGetterSignature {
                        span: p.span(start),
                        key,
                        computed,
                        type_ann,
                    })))
                } else {
                    expect!(p, Token::LParen);
                    let params = p.parse_ts_binding_list_for_signature()?;
                    if params.is_empty() {
                        syntax_error!(p, SyntaxError::SetterParamRequired)
                    }
                    let param = params.into_iter().next().unwrap();

                    if p.input().syntax().flow() && p.input().is(Token::Colon) {
                        let _ = p.parse_ts_type_or_type_predicate_ann(Token::Colon)?;
                    }

                    p.parse_ts_type_member_semicolon()?;

                    Ok(Some(TsTypeElement::TsSetterSignature(TsSetterSignature {
                        span: p.span(start),
                        key,
                        computed,
                        param,
                    })))
                }
            }) {
                return Ok(v);
            }
        }

        self.parse_ts_property_or_method_signature(start, readonly)
            .map(|e| match e {
                Either::Left(e) => e.into(),
                Either::Right(e) => {
                    if flow_minus_variance {
                        self.emit_err(e.span, SyntaxError::TS1003);
                    }
                    e.into()
                }
            })
    }

    fn parse_flow_getter_sig_member(&mut self, readonly: bool) -> PResult<TsTypeElement> {
        let start = self.input().cur_pos();

        if readonly {
            syntax_error!(self, SyntaxError::GetterSetterCannotBeReadonly)
        }

        expect!(self, Token::Get);
        let (computed, key) = self.parse_ts_property_name()?;
        expect!(self, Token::LParen);
        expect!(self, Token::RParen);
        let type_ann = self.try_parse_ts_type_ann()?;
        self.parse_ts_type_member_semicolon()?;

        Ok(TsTypeElement::TsGetterSignature(TsGetterSignature {
            span: self.span(start),
            key,
            computed,
            type_ann,
        }))
    }

    fn parse_flow_setter_sig_member(&mut self, readonly: bool) -> PResult<TsTypeElement> {
        let start = self.input().cur_pos();

        if readonly {
            syntax_error!(self, SyntaxError::GetterSetterCannotBeReadonly)
        }

        expect!(self, Token::Set);
        let (computed, key) = self.parse_ts_property_name()?;
        expect!(self, Token::LParen);
        let params = self.parse_ts_binding_list_for_signature()?;
        if params.is_empty() {
            syntax_error!(self, SyntaxError::SetterParamRequired)
        }
        let param = params.into_iter().next().unwrap();

        if self.input().syntax().flow() && self.input().is(Token::Colon) {
            let _ = self.parse_ts_type_or_type_predicate_ann(Token::Colon)?;
        }

        self.parse_ts_type_member_semicolon()?;

        Ok(TsTypeElement::TsSetterSignature(TsSetterSignature {
            span: self.span(start),
            key,
            computed,
            param,
        }))
    }

    fn parse_flow_mapped_type_member(&mut self, readonly: bool) -> PResult<TsTypeElement> {
        let start = self.cur_pos();
        expect!(self, Token::LBracket);
        let _ = self.parse_ts_mapped_type_param()?;
        expect!(self, Token::RBracket);

        let optional = self.input_mut().eat(Token::QuestionMark);
        let type_ann = Some(self.parse_ts_type_or_type_predicate_ann(Token::Colon)?);
        self.parse_ts_type_member_semicolon()?;

        Ok(TsTypeElement::TsPropertySignature(TsPropertySignature {
            span: self.span(start),
            computed: false,
            readonly,
            key: Box::new(Expr::Ident(Ident::new_no_ctxt(
                atom!("__flow_mapped"),
                self.span(start),
            ))),
            optional,
            type_ann,
        }))
    }

    fn can_start_flow_accessor_sig(&mut self) -> bool {
        matches!(self.input().cur(), Token::Get | Token::Set)
            && self.token_look_ahead(|p| {
                p.bump();

                if !Self::can_start_ts_property_name_token(p.input().cur()) {
                    return false;
                }

                if p.input().is(Token::LBracket) {
                    let mut depth = 0usize;
                    loop {
                        match p.input().cur() {
                            Token::LBracket => depth += 1,
                            Token::RBracket => {
                                depth = depth.saturating_sub(1);
                                if depth == 0 {
                                    p.bump();
                                    return p.input().is(Token::LParen);
                                }
                            }
                            Token::Eof => return false,
                            _ => {}
                        }

                        p.bump();
                    }
                }

                p.bump();
                p.input().is(Token::LParen)
            })
    }

    fn can_direct_parse_flow_getter_sig(&mut self) -> bool {
        self.input().is(Token::Get)
            && self.token_look_ahead(|p| {
                p.bump();

                if !Self::can_start_ts_property_name_token(p.input().cur()) {
                    return false;
                }

                if p.input().is(Token::LBracket) {
                    let mut depth = 0usize;
                    loop {
                        match p.input().cur() {
                            Token::LBracket => depth += 1,
                            Token::RBracket => {
                                depth = depth.saturating_sub(1);
                                if depth == 0 {
                                    p.bump();
                                    break;
                                }
                            }
                            Token::Eof => return false,
                            _ => {}
                        }

                        p.bump();
                    }
                } else {
                    p.bump();
                }

                if !p.input().is(Token::LParen) {
                    return false;
                }
                p.bump();

                if !p.input().is(Token::RParen) {
                    return false;
                }
                p.bump();

                p.can_follow_flow_type_member_after_params()
            })
    }

    fn can_direct_parse_flow_setter_sig(&mut self) -> bool {
        self.input().is(Token::Set) && self.can_start_flow_accessor_sig()
    }

    fn can_follow_flow_type_member_after_params(&mut self) -> bool {
        self.input().is(Token::Colon)
            || self.input().is(Token::Comma)
            || self.input().is(Token::Semi)
            || self.input().is(Token::RBrace)
            || (self.input().is(Token::Pipe)
                && peek!(self).is_some_and(|peek| peek == Token::RBrace))
    }

    fn can_start_ts_property_name_token(token: Token) -> bool {
        token.is_word()
            || matches!(
                token,
                Token::LBracket | Token::Num | Token::Str | Token::Hash | Token::At
            )
    }

    /// `tsParseObjectTypeMembers`
    fn parse_ts_object_type_members(&mut self) -> PResult<Vec<TsTypeElement>> {
        debug_assert!(self.input().syntax().typescript());

        expect!(self, Token::LBrace);
        let exact = self.input().syntax().flow() && self.input_mut().eat(Token::Pipe);
        let parse_members = |p: &mut Self| -> PResult<Vec<TsTypeElement>> {
            if exact {
                let mut members = Vec::new();
                while !(p.input().is(Token::Pipe)
                    && peek!(p).is_some_and(|peek| peek == Token::RBrace))
                {
                    members.push(p.parse_ts_type_member()?);
                }
                expect!(p, Token::Pipe);
                Ok(members)
            } else {
                p.parse_ts_list(ParsingContext::TypeMembers, |p| p.parse_ts_type_member())
            }
        };
        let members = if self.input().syntax().flow() {
            self.do_outside_of_context(Context::DisallowFlowAnonFnType, parse_members)?
        } else {
            parse_members(self)?
        };

        if self.input().syntax().flow() {
            let is_flow_inexact = |member: &TsTypeElement| {
                matches!(
                    member,
                    TsTypeElement::TsPropertySignature(TsPropertySignature {
                        computed: false,
                        key,
                        type_ann: None,
                        ..
                    }) if matches!(&**key, Expr::Ident(Ident { sym, .. }) if &**sym == "__flow_spread")
                )
            };

            let inexact_positions = members
                .iter()
                .enumerate()
                .filter_map(|(idx, member)| is_flow_inexact(member).then_some(idx))
                .collect::<Vec<_>>();

            if let Some(first_idx) = inexact_positions.first().copied() {
                if exact || inexact_positions.len() > 1 || first_idx + 1 != members.len() {
                    self.emit_err(members[first_idx].span(), SyntaxError::TS1003);
                }
            }
        }
        expect!(self, Token::RBrace);
        Ok(members)
    }

    /// `tsParseTypeLiteral`
    fn parse_ts_type_lit(&mut self) -> PResult<TsTypeLit> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();
        let members = self.parse_ts_object_type_members()?;
        Ok(TsTypeLit {
            span: self.span(start),
            members,
        })
    }

    /// `tsParseInterfaceDeclaration`
    pub(crate) fn parse_ts_interface_decl(
        &mut self,
        start: BytePos,
    ) -> PResult<Box<TsInterfaceDecl>> {
        debug_assert!(self.input().syntax().typescript());

        let id = self.parse_ident_name()?;
        match &*id.sym {
            "string" | "null" | "number" | "object" | "any" | "unknown" | "boolean" | "bigint"
            | "symbol" | "void" | "never" | "intrinsic" => {
                self.emit_err(id.span, SyntaxError::TS2427);
            }
            _ => {}
        }

        let type_params = self.try_parse_ts_type_params(true, false)?;

        let extends = if self.input_mut().eat(Token::Extends) {
            self.parse_ts_heritage_clause()?
        } else {
            Vec::new()
        };

        // Recover from
        //
        //     interface I extends A extends B {}
        if self.input().is(Token::Extends) {
            self.emit_err(self.input().cur_span(), SyntaxError::TS1172);

            while self.input().cur() != Token::Eof && !self.input().is(Token::LBrace) {
                self.bump();
            }
        }

        let body_start = self.cur_pos();
        let body_members = self.in_type(Self::parse_ts_object_type_members)?;

        if self.input().syntax().flow() {
            for member in &body_members {
                if matches!(
                    member,
                    TsTypeElement::TsPropertySignature(TsPropertySignature {
                        computed: false,
                        key,
                        ..
                    }) if matches!(&**key, Expr::Ident(Ident { sym, .. }) if &**sym == "__flow_spread")
                ) {
                    self.emit_err(member.span(), SyntaxError::TS1003);
                }
            }
        }

        let body = TsInterfaceBody {
            span: self.span(body_start),
            body: body_members,
        };
        Ok(Box::new(TsInterfaceDecl {
            span: self.span(start),
            declare: false,
            id: id.into(),
            type_params,
            extends,
            body,
        }))
    }

    /// `tsParseTypeAssertion`
    pub(crate) fn parse_ts_type_assertion(&mut self, start: BytePos) -> PResult<TsTypeAssertion> {
        debug_assert!(self.input().syntax().typescript());

        if self.input().syntax().disallow_ambiguous_jsx_like() {
            self.emit_err(self.span(start), SyntaxError::ReservedTypeAssertion);
        }

        // Not actually necessary to set state.inType because we never reach here if JSX
        // plugin is enabled, but need `tsInType` to satisfy the assertion in
        // `tsParseType`.
        let type_ann = self.in_type(Self::parse_ts_type)?;
        expect!(self, Token::Gt);
        let expr = self.parse_unary_expr()?;
        Ok(TsTypeAssertion {
            span: self.span(start),
            type_ann,
            expr,
        })
    }

    /// `tsParseImportType`
    fn parse_ts_import_type(&mut self) -> PResult<TsImportType> {
        let start = self.cur_pos();
        self.assert_and_bump(Token::Import);

        expect!(self, Token::LParen);

        let cur = self.input().cur();

        let arg = if cur == Token::Str {
            self.parse_str_lit()
        } else if cur == Token::Error {
            let err = self.input_mut().expect_error_token_and_bump();
            return Err(err);
        } else {
            let arg_span = self.input().cur_span();
            self.bump();
            self.emit_err(arg_span, SyntaxError::TS1141);
            Str {
                span: arg_span,
                value: Wtf8Atom::default(),
                raw: Some(atom!("\"\"")),
            }
        };

        // the "assert" keyword is deprecated and this syntax is niche, so
        // don't support it
        let attributes = if self.input_mut().eat(Token::Comma)
            && self.input().syntax().import_attributes()
            && self.input().is(Token::LBrace)
        {
            Some(self.parse_ts_call_options()?)
        } else {
            None
        };

        expect!(self, Token::RParen);

        let qualifier = if self.input_mut().eat(Token::Dot) {
            self.parse_ts_entity_name(false).map(Some)?
        } else {
            None
        };

        let type_args = if self.input().is(Token::Lt) {
            let ret = self.do_outside_of_context(
                Context::ShouldNotLexLtOrGtAsType,
                Self::parse_ts_type_args,
            )?;
            self.assert_and_bump(Token::Gt);
            Some(ret)
        } else {
            None
        };

        Ok(TsImportType {
            span: self.span(start),
            arg,
            qualifier,
            type_args,
            attributes,
        })
    }

    fn parse_ts_call_options(&mut self) -> PResult<TsImportCallOptions> {
        debug_assert!(self.input().syntax().typescript());
        let start = self.cur_pos();
        self.assert_and_bump(Token::LBrace);

        expect!(self, Token::With);
        expect!(self, Token::Colon);

        let value = match self.parse_object_expr()? {
            Expr::Object(v) => v,
            _ => unreachable!(),
        };
        self.input_mut().eat(Token::Comma);
        expect!(self, Token::RBrace);
        Ok(TsImportCallOptions {
            span: self.span(start),
            with: Box::new(value),
        })
    }

    /// `tsParseTypeQuery`
    fn parse_ts_type_query(&mut self) -> PResult<TsTypeQuery> {
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();
        expect!(self, Token::TypeOf);
        let expr_name = if self.input().syntax().flow() && self.input_mut().eat(Token::LParen) {
            let expr_name = if self.input().is(Token::Import) {
                self.parse_ts_import_type().map(From::from)?
            } else {
                self.parse_ts_entity_name(true).map(From::from)?
            };
            expect!(self, Token::RParen);
            expr_name
        } else if self.input().is(Token::Import) {
            self.parse_ts_import_type().map(From::from)?
        } else {
            self.parse_ts_entity_name(true).map(From::from)?
        };

        let type_args = if !self.input().had_line_break_before_cur() && self.input().is(Token::Lt) {
            let ret = self.do_outside_of_context(
                Context::ShouldNotLexLtOrGtAsType,
                Self::parse_ts_type_args,
            )?;
            self.assert_and_bump(Token::Gt);
            Some(ret)
        } else {
            None
        };

        Ok(TsTypeQuery {
            span: self.span(start),
            expr_name,
            type_args,
        })
    }

    /// `tsParseModuleBlock`
    fn parse_ts_module_block(&mut self) -> PResult<TsModuleBlock> {
        trace_cur!(self, parse_ts_module_block);

        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();
        expect!(self, Token::LBrace);
        let body = self.do_inside_of_context(Context::TsModuleBlock, |p| {
            p.do_outside_of_context(Context::TopLevel, |p| {
                p.parse_module_item_block_body(false, Some(Token::RBrace))
            })
        })?;

        Ok(TsModuleBlock {
            span: self.span(start),
            body,
        })
    }

    /// `tsParseModuleOrNamespaceDeclaration`
    fn parse_ts_module_or_ns_decl(
        &mut self,
        start: BytePos,
        namespace: bool,
    ) -> PResult<Box<TsModuleDecl>> {
        debug_assert!(self.input().syntax().typescript());

        let id = self.parse_ident_name()?;
        let body: TsNamespaceBody = if self.input_mut().eat(Token::Dot) {
            let inner_start = self.cur_pos();
            let inner = self.parse_ts_module_or_ns_decl(inner_start, namespace)?;
            let inner = TsNamespaceDecl {
                span: inner.span,
                id: match inner.id {
                    TsModuleName::Ident(i) => i,
                    _ => unreachable!(),
                },
                body: Box::new(inner.body.unwrap()),
                declare: inner.declare,
                global: inner.global,
            };
            inner.into()
        } else {
            self.parse_ts_module_block().map(From::from)?
        };

        Ok(Box::new(TsModuleDecl {
            span: self.span(start),
            declare: false,
            id: TsModuleName::Ident(id.into()),
            body: Some(body),
            global: false,
            namespace,
        }))
    }

    /// `tsParseAmbientExternalModuleDeclaration`
    fn parse_ts_ambient_external_module_decl(
        &mut self,
        start: BytePos,
    ) -> PResult<Box<TsModuleDecl>> {
        debug_assert!(self.input().syntax().typescript());

        let (global, id) = if self.input().is(Token::Global) {
            let id = self.parse_ident_name()?;
            (true, TsModuleName::Ident(id.into()))
        } else if self.input().cur() == Token::Str {
            let id = TsModuleName::Str(self.parse_str_lit());
            (false, id)
        } else {
            unexpected!(self, "global or a string literal");
        };

        let body = if self.input().is(Token::LBrace) {
            Some(self.parse_ts_module_block().map(TsNamespaceBody::from)?)
        } else {
            self.expect_general_semi()?;
            None
        };

        Ok(Box::new(TsModuleDecl {
            span: self.span(start),
            declare: false,
            id,
            global,
            body,
            namespace: false,
        }))
    }

    /// `tsParseNonArrayType`
    fn parse_ts_non_array_type(&mut self) -> PResult<Box<TsType>> {
        if !cfg!(feature = "typescript") {
            unreachable!()
        }
        trace_cur!(self, parse_ts_non_array_type);
        debug_assert!(self.input().syntax().typescript());

        let start = self.cur_pos();

        let cur = self.input().cur();
        if self.input().syntax().flow() {
            if cur == Token::Interface && peek!(self).is_some_and(|peek| peek == Token::LBrace) {
                self.bump();
                return self.parse_ts_type_lit().map(TsType::from).map(Box::new);
            }

            if self.can_start_flow_renders_type() {
                return self.parse_flow_renders_type();
            }

            if self.input().syntax().flow_components() {
                if self.is_flow_contextual_word("component") {
                    self.bump();
                    return self.parse_flow_component_type(start).map(Box::new);
                }

                if self.is_flow_contextual_word("hook") {
                    self.bump();
                    return self.parse_flow_hook_type(start).map(Box::new);
                }
            }
        }

        if cur.is_known_ident()
            || matches!(
                cur,
                Token::Ident
                    | Token::Void
                    | Token::Yield
                    | Token::Null
                    | Token::Await
                    | Token::Break
                    | Token::Switch
            )
            || (self.input().syntax().flow() && matches!(cur, Token::In | Token::Out))
        {
            if self.input().is(Token::Asserts)
                && peek!(self).is_some_and(|peek| peek == Token::This)
            {
                self.bump();
                let this_keyword = self.parse_ts_this_type_node()?;
                return self
                    .parse_ts_this_type_predicate(start, true, this_keyword)
                    .map(TsType::from)
                    .map(Box::new);
            }
            let kind = if self.input().is(Token::Void) {
                Some(TsKeywordTypeKind::TsVoidKeyword)
            } else if self.input().is(Token::Null) {
                Some(TsKeywordTypeKind::TsNullKeyword)
            } else if self.input().is(Token::Any) {
                Some(TsKeywordTypeKind::TsAnyKeyword)
            } else if self.input().is(Token::Boolean) {
                Some(TsKeywordTypeKind::TsBooleanKeyword)
            } else if self.input().is(Token::Bigint) {
                Some(TsKeywordTypeKind::TsBigIntKeyword)
            } else if self.input().is(Token::Never) {
                Some(TsKeywordTypeKind::TsNeverKeyword)
            } else if self.input().is(Token::Number) {
                Some(TsKeywordTypeKind::TsNumberKeyword)
            } else if self.input().is(Token::Object) {
                Some(TsKeywordTypeKind::TsObjectKeyword)
            } else if self.input().is(Token::String) {
                Some(TsKeywordTypeKind::TsStringKeyword)
            } else if self.input().is(Token::Symbol) {
                Some(TsKeywordTypeKind::TsSymbolKeyword)
            } else if self.input().is(Token::Unknown) {
                Some(TsKeywordTypeKind::TsUnknownKeyword)
            } else if self.input().is(Token::Undefined) {
                Some(TsKeywordTypeKind::TsUndefinedKeyword)
            } else if self.input().is(Token::Intrinsic) {
                Some(TsKeywordTypeKind::TsIntrinsicKeyword)
            } else {
                None
            };

            let peeked_is_dot = peek!(self).is_some_and(|cur| cur == Token::Dot);

            match kind {
                Some(kind) if !peeked_is_dot => {
                    self.bump();
                    return Ok(Box::new(TsType::TsKeywordType(TsKeywordType {
                        span: self.span(start),
                        kind,
                    })));
                }
                _ => {
                    return self.parse_ts_type_ref().map(TsType::from).map(Box::new);
                }
            }
        } else if matches!(
            cur,
            Token::BigInt | Token::Str | Token::Num | Token::True | Token::False | Token::BackQuote
        ) {
            return self
                .parse_ts_lit_type_node()
                .map(TsType::from)
                .map(Box::new);
        } else if cur == Token::NoSubstitutionTemplateLiteral || cur == Token::TemplateHead {
            if self.input().syntax().flow() {
                self.emit_err(self.input().cur_span(), SyntaxError::TS1003);
            }
            return self.parse_tagged_tpl_ty().map(TsType::from).map(Box::new);
        } else if cur == Token::Minus {
            let start = self.cur_pos();

            self.bump();

            let cur = self.input().cur();
            if !(cur == Token::Num || cur == Token::BigInt) {
                unexpected!(self, "numeric literal or bigint literal")
            }

            let lit = self.parse_lit()?;
            let lit = match lit {
                Lit::Num(Number { span, value, raw }) => {
                    if self.input().syntax().flow()
                        && raw.as_deref().is_some_and(is_legacy_octal_number_raw)
                    {
                        self.emit_err(span, SyntaxError::TS1003);
                    }

                    let mut new_raw = String::from("-");

                    match raw {
                        Some(raw) => {
                            new_raw.push_str(&raw);
                        }
                        _ => {
                            write!(new_raw, "{value}").unwrap();
                        }
                    };

                    TsLit::Number(Number {
                        span,
                        value: -value,
                        raw: Some(new_raw.into()),
                    })
                }
                Lit::BigInt(BigInt { span, value, raw }) => {
                    let mut new_raw = String::from("-");

                    match raw {
                        Some(raw) => {
                            new_raw.push_str(&raw);
                        }
                        _ => {
                            write!(new_raw, "{value}").unwrap();
                        }
                    };

                    TsLit::BigInt(BigInt {
                        span,
                        value: Box::new(-*value),
                        raw: Some(new_raw.into()),
                    })
                }
                _ => unreachable!(),
            };

            return Ok(Box::new(TsType::TsLitType(TsLitType {
                span: self.span(start),
                lit,
            })));
        } else if self.input().syntax().flow() && cur == Token::QuestionMark {
            self.bump();

            // Flow's nullable type (`?T`) is represented as `T | null | undefined`.
            // Only use the non-conditional parser for actual function forms
            // (`?() =>`, `?(x: T) =>`, `?(...A) =>`) so non-function grouped
            // types keep their original precedence (`?(T)[]` etc.).
            let is_nullable_fn_type = self.can_start_flow_parenthesized_fn_type();

            let inner_type = if is_nullable_fn_type {
                self.parse_ts_non_conditional_type()?
            } else {
                self.parse_ts_non_array_type()?
            };
            let span = self.span(start);

            let null_type = Box::new(TsType::TsKeywordType(TsKeywordType {
                span,
                kind: TsKeywordTypeKind::TsNullKeyword,
            }));
            let undefined_type = Box::new(TsType::TsKeywordType(TsKeywordType {
                span,
                kind: TsKeywordTypeKind::TsUndefinedKeyword,
            }));

            return Ok(Box::new(TsType::TsUnionOrIntersectionType(
                TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                    span,
                    types: vec![inner_type, null_type, undefined_type],
                }),
            )));
        } else if self.input().syntax().flow() && cur == Token::Asterisk {
            self.bump();
            return Ok(Box::new(TsType::TsKeywordType(TsKeywordType {
                span: self.span(start),
                kind: TsKeywordTypeKind::TsAnyKeyword,
            })));
        } else if cur == Token::Import {
            return self.parse_ts_import_type().map(TsType::from).map(Box::new);
        } else if cur == Token::This {
            let start = self.cur_pos();
            let this_keyword = self.parse_ts_this_type_node()?;
            return if !self.input().had_line_break_before_cur() && self.input().is(Token::Is) {
                self.parse_ts_this_type_predicate(start, false, this_keyword)
                    .map(TsType::from)
                    .map(Box::new)
            } else {
                Ok(Box::new(TsType::TsThisType(this_keyword)))
            };
        } else if cur == Token::TypeOf {
            return self.parse_ts_type_query().map(TsType::from).map(Box::new);
        } else if cur == Token::LBrace {
            return if self.token_look_ahead(Self::is_ts_start_of_mapped_type) {
                self.parse_ts_mapped_type().map(TsType::from).map(Box::new)
            } else {
                self.parse_ts_type_lit().map(TsType::from).map(Box::new)
            };
        } else if cur == Token::LBracket {
            return self.parse_ts_tuple_type().map(TsType::from).map(Box::new);
        } else if cur == Token::LParen {
            return self
                .parse_ts_parenthesized_type()
                .map(TsType::from)
                .map(Box::new);
        }

        //   switch (self.state.type) {
        //   }

        unexpected!(
            self,
            "an identifier, void, yield, null, await, break, a string literal, a numeric literal, \
             true, false, `, -, import, this, typeof, {, [, ("
        )
    }

    /// `tsParseExpressionStatement`
    pub(crate) fn parse_ts_expr_stmt(
        &mut self,
        decorators: Vec<Decorator>,
        expr: Ident,
    ) -> PResult<Option<Decl>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        let start = expr.span_lo();

        match &*expr.sym {
            "declare" => {
                let decl = self.try_parse_ts_declare(start, decorators)?;
                if let Some(decl) = decl {
                    Ok(Some(make_decl_declare(decl)))
                } else {
                    Ok(None)
                }
            }
            "global" => {
                // `global { }` (with no `declare`) may appear inside an ambient module
                // declaration.
                // Would like to use tsParseAmbientExternalModuleDeclaration here, but already
                // ran past "global".
                if self.input().is(Token::LBrace) {
                    let global = true;
                    let id = TsModuleName::Ident(expr);
                    let body = self
                        .parse_ts_module_block()
                        .map(TsNamespaceBody::from)
                        .map(Some)?;
                    Ok(Some(
                        TsModuleDecl {
                            span: self.span(start),
                            global,
                            declare: false,
                            namespace: false,
                            id,
                            body,
                        }
                        .into(),
                    ))
                } else {
                    Ok(None)
                }
            }
            _ => self.parse_ts_decl(start, decorators, expr.sym, /* next */ false),
        }
    }

    /// `tsTryParseDeclare`
    pub(crate) fn try_parse_ts_declare(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
    ) -> PResult<Option<Decl>> {
        if !self.syntax().typescript() {
            return Ok(None);
        }

        if !self.syntax().flow()
            && self
                .ctx()
                .contains(Context::InDeclare | Context::TsModuleBlock)
        {
            let span_of_declare = self.span(start);
            self.emit_err(span_of_declare, SyntaxError::TS1038);
        }

        let declare_start = start;
        self.do_inside_of_context(Context::InDeclare, |p| {
            if p.input().is(Token::Function) {
                return p
                    .parse_fn_decl(decorators)
                    .map(|decl| match decl {
                        Decl::Fn(f) => {
                            if p.syntax().flow() && f.function.return_type.is_none() {
                                p.emit_err(f.ident.span, SyntaxError::TS1003);
                            }
                            FnDecl {
                                declare: true,
                                function: Box::new(Function {
                                    span: Span {
                                        lo: declare_start,
                                        ..f.function.span
                                    },
                                    ..*f.function
                                }),
                                ..f
                            }
                            .into()
                        }
                        _ => decl,
                    })
                    .map(Some);
            }

            if p.input().is(Token::Class) {
                return p
                    .parse_class_decl(start, start, decorators, false)
                    .map(|decl| match decl {
                        Decl::Class(c) => ClassDecl {
                            declare: true,
                            class: Box::new(Class {
                                span: Span {
                                    lo: declare_start,
                                    ..c.class.span
                                },
                                ..*c.class
                            }),
                            ..c
                        }
                        .into(),
                        _ => decl,
                    })
                    .map(Some);
            }

            if p.input().syntax().typescript_allows_enum()
                && p.input().is(Token::Const)
                && peek!(p).is_some_and(|peek| peek == Token::Enum)
            {
                p.assert_and_bump(Token::Const);
                p.assert_and_bump(Token::Enum);
                if p.input().syntax().flow() {
                    p.emit_err(p.span(start), SyntaxError::TS1003);
                }

                return p
                    .parse_ts_enum_decl(start, /* is_const */ true)
                    .map(|decl| TsEnumDecl {
                        declare: true,
                        span: Span {
                            lo: declare_start,
                            ..decl.span
                        },
                        ..*decl
                    })
                    .map(Box::new)
                    .map(From::from)
                    .map(Some);
            }

            let cur = p.input().cur();
            if matches!(cur, Token::Const | Token::Var | Token::Let) {
                return p
                    .parse_var_stmt(false)
                    .map(|decl| {
                        if p.syntax().flow() {
                            for declr in &decl.decls {
                                if !flow_binding_has_type_ann(&declr.name) {
                                    p.emit_err(declr.name.span(), SyntaxError::TS1003);
                                }
                            }
                        }
                        VarDecl {
                            declare: true,
                            span: Span {
                                lo: declare_start,
                                ..decl.span
                            },
                            ..*decl
                        }
                    })
                    .map(Box::new)
                    .map(From::from)
                    .map(Some);
            }

            if p.input().is(Token::Global) {
                return p
                    .parse_ts_ambient_external_module_decl(start)
                    .map(Decl::from)
                    .map(make_decl_declare)
                    .map(Some);
            } else if p.input().syntax().flow() && p.input_mut().eat(Token::Export) {
                if p.input_mut().eat(Token::Default) {
                    if p.input().is(Token::Class) {
                        return p
                            .parse_default_class(
                                declare_start,
                                declare_start,
                                decorators.clone(),
                                false,
                            )
                            .map(|decl| {
                                p.normalize_flow_declare_export_default(declare_start, decl)
                            })
                            .map(Some);
                    }

                    if p.input().is(Token::Async)
                        && peek!(p).is_some_and(|peek| peek == Token::Function)
                        && !p.input_mut().has_linebreak_between_cur_and_peeked()
                    {
                        return p
                            .parse_default_async_fn(declare_start, decorators.clone())
                            .map(|decl| {
                                p.normalize_flow_declare_export_default(declare_start, decl)
                            })
                            .map(Some);
                    }

                    if p.input().is(Token::Function) {
                        return p
                            .parse_default_fn(declare_start, decorators.clone())
                            .map(|decl| {
                                p.normalize_flow_declare_export_default(declare_start, decl)
                            })
                            .map(Some);
                    }

                    if p.input().is(Token::Interface) {
                        p.assert_and_bump(Token::Interface);
                        return p
                            .parse_ts_interface_decl(declare_start)
                            .map(Decl::from)
                            .map(make_decl_declare)
                            .map(Some);
                    }

                    if p.input().syntax().flow_components() && p.input().cur().is_word() {
                        let value = p.input().cur().take_word(&p.input);
                        if value == atom!("component") || value == atom!("hook") {
                            return p
                                .parse_ts_decl(
                                    start,
                                    decorators.clone(),
                                    value,
                                    /* next */ true,
                                )
                                .map(|v| v.map(make_decl_declare));
                        }
                    }

                    let type_ann = p.in_type(Self::parse_ts_type)?;
                    p.expect_general_semi()?;

                    let decl = Decl::TsTypeAlias(p.make_flow_synthetic_type_alias_decl(
                        declare_start,
                        atom!("__flow_default_export"),
                        type_ann,
                    ));
                    return Ok(Some(make_decl_declare(decl)));
                }

                if p.input().is(Token::LBrace) || p.input().is(Token::Asterisk) {
                    return p
                        .parse_flow_declare_export_named_or_all(declare_start)
                        .map(make_decl_declare)
                        .map(Some);
                }

                if p.input().is(Token::Function) {
                    return p
                        .parse_fn_decl(decorators.clone())
                        .map(|decl| match decl {
                            Decl::Fn(f) => {
                                if p.syntax().flow() && f.function.return_type.is_none() {
                                    p.emit_err(f.ident.span, SyntaxError::TS1003);
                                }
                                FnDecl {
                                    declare: true,
                                    function: Box::new(Function {
                                        span: Span {
                                            lo: declare_start,
                                            ..f.function.span
                                        },
                                        ..*f.function
                                    }),
                                    ..f
                                }
                                .into()
                            }
                            _ => decl,
                        })
                        .map(Some);
                }

                if p.input().is(Token::Class) {
                    return p
                        .parse_class_decl(start, start, decorators.clone(), false)
                        .map(|decl| match decl {
                            Decl::Class(c) => ClassDecl {
                                declare: true,
                                class: Box::new(Class {
                                    span: Span {
                                        lo: declare_start,
                                        ..c.class.span
                                    },
                                    ..*c.class
                                }),
                                ..c
                            }
                            .into(),
                            _ => decl,
                        })
                        .map(Some);
                }

                let cur = p.input().cur();
                if matches!(cur, Token::Const | Token::Var | Token::Let) {
                    return p
                        .parse_var_stmt(false)
                        .map(|decl| {
                            if p.syntax().flow() {
                                for declr in &decl.decls {
                                    if !flow_binding_has_type_ann(&declr.name) {
                                        p.emit_err(declr.name.span(), SyntaxError::TS1003);
                                    }
                                }
                            }
                            VarDecl {
                                declare: true,
                                span: Span {
                                    lo: declare_start,
                                    ..decl.span
                                },
                                ..*decl
                            }
                        })
                        .map(Box::new)
                        .map(From::from)
                        .map(Some);
                }

                if p.input().cur().is_word() {
                    let value = p.input().cur().take_word(&p.input);
                    if !p.can_probe_ts_decl_from_word(&value) {
                        return Ok(None);
                    }
                    return p
                        .parse_ts_decl(start, decorators, value, /* next */ true)
                        .map(|v| v.map(make_decl_declare));
                }

                return Ok(None);
            } else if p.input().cur().is_word() {
                let value = p.input().cur().take_word(&p.input);
                if !p.can_probe_ts_decl_from_word(&value) {
                    return Ok(None);
                }
                return p
                    .parse_ts_decl(start, decorators, value, /* next */ true)
                    .map(|v| v.map(make_decl_declare));
            }

            Ok(None)
        })
    }

    /// `tsTryParseExportDeclaration`
    ///
    /// Note: this won't be called unless the keyword is allowed in
    /// `shouldParseExportDeclaration`.
    ///
    /// Callers only reach this after `can_probe_ts_decl_from_word` succeeds, so
    /// `export <keyword>` can parse directly without opening a speculative
    /// checkpoint.
    pub(crate) fn parse_ts_export_decl_if_possible(
        &mut self,
        decorators: Vec<Decorator>,
        value: Atom,
    ) -> PResult<Option<Decl>> {
        if !cfg!(feature = "typescript") {
            return Ok(None);
        }

        if !self.can_probe_ts_decl_from_word(&value) {
            return Ok(None);
        }

        let start = self.cur_pos();
        self.parse_ts_decl(start, decorators, value, true)
    }

    /// Common to tsTryParseDeclare, export declaration probing, and
    /// tsParseExpressionStatement.
    ///
    /// `tsParseDeclaration`
    ///
    /// This lets callers avoid opening a speculative parser checkpoint when the
    /// current word token cannot begin any TS/Flow declaration form handled by
    /// `parse_ts_decl`.
    pub(crate) fn can_start_ts_decl_from_word(&self, value: &Atom) -> bool {
        match &**value {
            "abstract" | "interface" | "module" | "namespace" | "type" => true,
            "enum" => self.input().syntax().typescript_allows_enum(),
            "component" | "hook" => {
                self.input().syntax().flow() && self.input().syntax().flow_components()
            }
            "opaque" => self.input().syntax().flow(),
            _ => false,
        }
    }

    fn can_probe_flow_named_decl_after_keyword(&mut self) -> bool {
        self.token_look_ahead(|p| {
            if !p.input().cur().is_word() {
                return false;
            }

            p.bump();
            matches!(
                p.input().cur(),
                Token::LParen | Token::Lt | Token::Eof | Token::Error
            )
        })
    }

    fn can_probe_ts_named_decl_after_keyword(&mut self, allowed_follow: &[Token]) -> bool {
        self.token_look_ahead(|p| {
            p.bump();

            if !p.input().cur().is_word() {
                return false;
            }

            p.bump();
            p.input().is(Token::Eof)
                || p.input().is(Token::Error)
                || allowed_follow.contains(&p.input().cur())
        })
    }

    fn can_probe_flow_hook_decl_after_keyword(&mut self) -> bool {
        self.token_look_ahead(|p| {
            if p.input().cur() == Token::Function {
                p.bump();
                return p.input().cur().is_word();
            }

            if !p.input().cur().is_word() {
                return false;
            }

            p.bump();
            matches!(
                p.input().cur(),
                Token::LParen | Token::Lt | Token::Eof | Token::Error
            )
        })
    }

    pub(super) fn can_start_ts_generic_async_arrow_type_params(&mut self) -> bool {
        matches!(self.input().cur(), Token::Lt | Token::JSXTagStart)
            && self.token_look_ahead(|p| {
                p.bump();

                if matches!(p.input().cur(), Token::Const | Token::In | Token::Out) {
                    p.bump();
                }

                if !(p.input().cur().is_word() || p.input().cur() == Token::JSXName) {
                    return false;
                }

                p.bump();
                matches!(
                    p.input().cur(),
                    Token::Gt | Token::RShift | Token::Comma | Token::Extends | Token::Eq
                )
            })
    }

    fn can_start_ts_type_fast(&mut self) -> bool {
        let cur = self.input().cur();

        if cur == Token::Lt {
            return true;
        }

        if cur == Token::Abstract {
            return peek!(self).is_some_and(|peek| peek == Token::New);
        }

        if cur == Token::New {
            return true;
        }

        if self.input().syntax().flow() {
            if cur == Token::Interface {
                return peek!(self).is_some_and(|peek| peek == Token::LBrace);
            }

            if self.input().syntax().flow_components()
                && (self.is_flow_contextual_word("component")
                    || self.is_flow_contextual_word("hook"))
            {
                return true;
            }

            if self.is_flow_contextual_word("renders")
                && peek!(self)
                    .is_some_and(|peek| matches!(peek, Token::QuestionMark | Token::Asterisk))
            {
                return true;
            }
        }

        cur.is_known_ident()
            || matches!(
                cur,
                Token::Ident
                    | Token::Void
                    | Token::Yield
                    | Token::Null
                    | Token::Await
                    | Token::Break
                    | Token::Switch
                    | Token::BigInt
                    | Token::Str
                    | Token::Num
                    | Token::True
                    | Token::False
                    | Token::BackQuote
                    | Token::NoSubstitutionTemplateLiteral
                    | Token::TemplateHead
                    | Token::Minus
                    | Token::Import
                    | Token::This
                    | Token::TypeOf
                    | Token::LBrace
                    | Token::LBracket
                    | Token::LParen
            )
            || (self.input().syntax().flow()
                && matches!(
                    cur,
                    Token::QuestionMark | Token::Asterisk | Token::In | Token::Out
                ))
    }

    pub(super) fn can_start_ts_type_args_fast(&mut self) -> bool {
        self.input().is(Token::Lt)
            && self.token_look_ahead(|p| {
                p.bump();

                let cur = p.input().cur();
                if !p.can_start_ts_type_fast() {
                    return false;
                }

                let is_simple_type_start = matches!(
                    cur,
                    Token::Ident
                        | Token::JSXName
                        | Token::Num
                        | Token::Str
                        | Token::BigInt
                        | Token::True
                        | Token::False
                        | Token::Null
                        | Token::This
                        | Token::Any
                        | Token::Bigint
                        | Token::Boolean
                        | Token::Intrinsic
                        | Token::Never
                        | Token::Number
                        | Token::Object
                        | Token::String
                        | Token::Symbol
                        | Token::Undefined
                        | Token::Unknown
                        | Token::Void
                );

                if !is_simple_type_start {
                    return true;
                }

                !peek!(p).is_some_and(|next| {
                    matches!(
                        next,
                        Token::Plus
                            | Token::Minus
                            | Token::Asterisk
                            | Token::Slash
                            | Token::Percent
                            | Token::Eq
                            | Token::Colon
                            | Token::QuestionMark
                            | Token::Arrow
                            | Token::LParen
                    )
                })
            })
    }

    pub(super) fn can_start_ts_expr_type_params_fast(&mut self) -> bool {
        matches!(self.input().cur(), Token::Lt | Token::JSXTagStart)
            && self.token_look_ahead(|p| {
                p.bump();

                let cur = p.input().cur();
                if !(cur.is_word() || cur == Token::JSXName) {
                    return false;
                }

                if !p.input().syntax().jsx() || p.input().syntax().flow() {
                    return true;
                }

                // In TSX mode, a bare `<T>`/`<div>` start is dominated by JSX and
                // cannot be the start of an unambiguous generic arrow head.
                if matches!(cur, Token::Const | Token::In | Token::Out) {
                    return true;
                }

                p.bump();
                matches!(p.input().cur(), Token::Comma | Token::Extends | Token::Eq)
            })
    }

    pub(super) fn can_start_ts_type_or_type_predicate_ann_fast(
        &mut self,
        return_token: Token,
    ) -> bool {
        self.input().is(return_token)
            && self.token_look_ahead(|p| {
                p.bump();

                if p.input().syntax().flow() && p.input().is(Token::Percent) {
                    return true;
                }

                if p.input().is(Token::Asserts) {
                    let ctx = p.ctx();
                    return peek!(p).is_some_and(|peek| {
                        if peek.is_word() {
                            !peek.is_reserved(ctx)
                        } else {
                            false
                        }
                    });
                }

                let cur = p.input().cur();
                if !p.can_start_ts_type_fast() {
                    return false;
                }

                let is_simple_type_start = matches!(
                    cur,
                    Token::Ident
                        | Token::JSXName
                        | Token::Num
                        | Token::Str
                        | Token::BigInt
                        | Token::True
                        | Token::False
                        | Token::Null
                        | Token::This
                        | Token::Any
                        | Token::Bigint
                        | Token::Boolean
                        | Token::Intrinsic
                        | Token::Never
                        | Token::Number
                        | Token::Object
                        | Token::String
                        | Token::Symbol
                        | Token::Undefined
                        | Token::Unknown
                        | Token::Void
                );

                if !is_simple_type_start {
                    return true;
                }

                !peek!(p).is_some_and(|next| {
                    matches!(
                        next,
                        Token::Plus
                            | Token::Minus
                            | Token::Asterisk
                            | Token::Slash
                            | Token::Percent
                            | Token::Eq
                            | Token::Colon
                            | Token::QuestionMark
                            | Token::LParen
                    )
                })
            })
    }

    fn can_probe_ts_decl_from_word(&mut self, value: &Atom) -> bool {
        if !self.can_start_ts_decl_from_word(value) {
            return false;
        }

        match &**value {
            "abstract" => peek!(self).is_some_and(|peek| peek == Token::Class),
            "interface" => self.can_probe_ts_named_decl_after_keyword(&[
                Token::Lt,
                Token::Extends,
                Token::LBrace,
            ]),
            "namespace" => self.can_probe_ts_named_decl_after_keyword(&[Token::Dot, Token::LBrace]),
            "type" => self.can_probe_ts_named_decl_after_keyword(&[Token::Lt, Token::Eq]),
            "enum" => self.can_probe_ts_named_decl_after_keyword(&[Token::LBrace]),
            "module" => {
                peek!(self).is_some_and(|peek| {
                    peek == Token::Str
                        || peek == Token::Eof
                        || peek == Token::Error
                        || (self.input().syntax().flow()
                            && self.ctx().contains(Context::InDeclare)
                            && peek == Token::Dot)
                }) || self.can_probe_ts_named_decl_after_keyword(&[Token::Dot, Token::LBrace])
            }
            "opaque" => {
                !self.input_mut().has_linebreak_between_cur_and_peeked()
                    && peek!(self).is_some_and(|peek| peek == Token::Type)
            }
            "component" => self.can_probe_flow_named_decl_after_keyword(),
            "hook" => self.can_probe_flow_hook_decl_after_keyword(),
            _ => true,
        }
    }

    #[allow(clippy::collapsible_match)]
    fn parse_ts_decl(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
        value: Atom,
        next: bool,
    ) -> PResult<Option<Decl>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        match &*value {
            "abstract" => {
                if next
                    || (self.input().is(Token::Class) && !self.input().had_line_break_before_cur())
                {
                    if next {
                        self.bump();
                    }
                    return Ok(Some(self.parse_class_decl(start, start, decorators, true)?));
                }
            }

            "enum" => {
                let allow_ts_enum = self.input().syntax().typescript_allows_enum();
                if allow_ts_enum && (next || self.is_ident_ref()) {
                    if next {
                        self.bump();
                    }
                    return self
                        .parse_ts_enum_decl(start, /* is_const */ false)
                        .map(From::from)
                        .map(Some);
                }
            }

            "interface" => {
                if next || (self.is_ident_ref()) {
                    if next {
                        self.bump();
                    }

                    return self
                        .parse_ts_interface_decl(start)
                        .map(From::from)
                        .map(Some);
                }
            }

            "module" if !self.input().had_line_break_before_cur() => {
                if next {
                    self.bump();
                }

                if self.input().syntax().flow()
                    && self.ctx().contains(Context::InDeclare)
                    && self.input_mut().eat(Token::Dot)
                {
                    let is_exports = self.input().cur().is_word()
                        && self.input().cur().take_word(&self.input) == atom!("exports");

                    if !is_exports {
                        unexpected!(self, "exports")
                    }
                    self.bump();

                    expect!(self, Token::Colon);
                    let type_ann = self.in_type(Self::parse_ts_type)?;
                    self.expect_general_semi()?;

                    return Ok(Some(Decl::TsTypeAlias(
                        self.make_flow_synthetic_type_alias_decl(
                            start,
                            atom!("__flow_module_exports"),
                            type_ann,
                        ),
                    )));
                }

                let cur = self.input().cur();
                if cur == Token::Str {
                    return self
                        .parse_ts_ambient_external_module_decl(start)
                        .map(From::from)
                        .map(Some);
                } else if cur == Token::Error {
                    let err = self.input_mut().expect_error_token_and_bump();
                    return Err(err);
                } else if cur == Token::Eof {
                    return Err(self.eof_error());
                } else if next || self.is_ident_ref() {
                    return self
                        .parse_ts_module_or_ns_decl(start, false)
                        .map(From::from)
                        .map(Some);
                }
            }

            "namespace" => {
                if next || self.is_ident_ref() {
                    if next {
                        self.bump();
                    }
                    return self
                        .parse_ts_module_or_ns_decl(start, true)
                        .map(From::from)
                        .map(Some);
                }
            }

            "type" => {
                if next || (!self.input().had_line_break_before_cur() && self.is_ident_ref()) {
                    if next {
                        self.bump();
                    }
                    return self
                        .parse_ts_type_alias_decl(start)
                        .map(From::from)
                        .map(Some);
                }
            }

            "component"
                if self.input().syntax().flow() && self.input().syntax().flow_components() =>
            {
                if next || self.is_ident_ref() {
                    if next {
                        self.bump();
                    }
                    let declare = self.ctx().contains(Context::InDeclare);
                    return self
                        .parse_flow_component_decl(start, decorators, declare)
                        .map(Some);
                }
            }

            "hook" if self.input().syntax().flow() && self.input().syntax().flow_components() => {
                if next || self.is_ident_ref() || self.input().is(Token::Function) {
                    if next {
                        self.bump();
                    }
                    let declare = self.ctx().contains(Context::InDeclare);
                    return self
                        .parse_flow_hook_decl(start, decorators, declare)
                        .map(Some);
                }
            }

            "opaque" if self.input().syntax().flow() => {
                if next {
                    self.bump();
                }
                if self.input().is(Token::Type) && !self.input().had_line_break_before_cur() {
                    return self
                        .parse_flow_opaque_type_alias_decl(start)
                        .map(From::from)
                        .map(Some);
                }
            }

            _ => {}
        }

        Ok(None)
    }

    /// `tsTryParseGenericAsyncArrowFunction`
    pub(crate) fn try_parse_ts_generic_async_arrow_fn(
        &mut self,
        start: BytePos,
    ) -> PResult<Option<ArrowExpr>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        if !self.can_start_ts_generic_async_arrow_type_params() {
            return Ok(None);
        }

        let type_params = self.parse_ts_type_params(false, false)?;

        // Callers already wrap this path in a speculative checkpoint. Parse the
        // async arrow head directly here so the hot path does not pay for a
        // second nested checkpoint.
        if self.input().syntax().jsx() && type_params.params.len() == 1 {
            let single_param = &type_params.params[0];
            let has_trailing_comma = type_params.span.hi.0 - single_param.span.hi.0 > 1;
            let dominated_by_jsx = single_param.constraint.is_none()
                && single_param.default.is_none()
                && !has_trailing_comma;

            if dominated_by_jsx {
                return Ok(None);
            }
        }

        // Don't use overloaded parseFunctionParams which would look for "<" again.
        expect!(self, Token::LParen);
        let params: Vec<Pat> = self
            .parse_formal_params()?
            .into_iter()
            .map(|p| p.pat)
            .collect();
        expect!(self, Token::RParen);
        let return_type = self.try_parse_ts_type_or_type_predicate_ann()?;
        expect!(self, Token::Arrow);

        self.do_inside_of_context(Context::InAsync, |p| {
            p.do_outside_of_context(Context::InGenerator, |p| {
                let is_generator = false;
                let is_async = true;
                let body = p.parse_fn_block_or_expr_body(
                    true,
                    false,
                    true,
                    params.is_simple_parameter_list(),
                )?;
                Ok(Some(ArrowExpr {
                    span: p.span(start),
                    body,
                    is_async,
                    is_generator,
                    type_params: Some(type_params),
                    params,
                    return_type,
                    ..Default::default()
                }))
            })
        })
    }
}

#[cfg(test)]
mod tests {
    use swc_atoms::atom;
    use swc_common::DUMMY_SP;
    use swc_ecma_ast::{EsVersion, *};
    use swc_ecma_visit::assert_eq_ignore_span;

    #[cfg(feature = "flow")]
    use super::FlowComponentParam;
    #[cfg(feature = "flow")]
    use crate::syntax::FlowSyntax;
    use crate::{lexer::Token, parser::Context, test_parser, Parser, Syntax, TsSyntax};

    #[test]
    fn issue_708_1() {
        let actual = test_parser(
            "type test = -1;",
            Syntax::Typescript(Default::default()),
            |p| p.parse_module(),
        );

        let expected = Module {
            span: DUMMY_SP,
            shebang: None,
            body: {
                let first = TsTypeAliasDecl {
                    span: DUMMY_SP,
                    declare: false,
                    id: Ident::new_no_ctxt(atom!("test"), DUMMY_SP),
                    type_params: None,
                    type_ann: Box::new(TsType::TsLitType(TsLitType {
                        span: DUMMY_SP,
                        lit: TsLit::Number(Number {
                            span: DUMMY_SP,
                            value: -1.0,
                            raw: Some(atom!("-1")),
                        }),
                    })),
                }
                .into();
                vec![first]
            },
        };

        assert_eq_ignore_span!(actual, expected);
    }

    #[test]
    fn issue_708_2() {
        let actual = test_parser(
            "const t = -1;",
            Syntax::Typescript(Default::default()),
            |p| p.parse_module(),
        );

        let expected = Module {
            span: DUMMY_SP,
            shebang: None,
            body: {
                let second = VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Const,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(Ident::new_no_ctxt(atom!("t"), DUMMY_SP).into()),
                        init: Some(Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!(unary, "-"),
                            arg: Box::new(Expr::Lit(Lit::Num(Number {
                                span: DUMMY_SP,
                                value: 1.0,
                                raw: Some(atom!("1")),
                            }))),
                        }))),
                        definite: false,
                    }],
                    ..Default::default()
                }
                .into();
                vec![second]
            },
        };

        assert_eq_ignore_span!(actual, expected);
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_anon_signature_param_probe_uses_parser_look_ahead() {
        crate::with_test_sess("(?Foo) => Bar", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let is_fn_type = parser
                .ts_look_ahead(|p| p.is_ts_unambiguously_start_of_fn_type())
                .unwrap();

            assert!(is_fn_type);
            assert_eq!(parser.input().cur(), Token::LParen);
            assert!(parser.take_errors().is_empty());

            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn infer_type_without_extends_has_no_constraint() {
        let actual = test_parser(
            "type T<X> = X extends infer U ? U : never;",
            Syntax::Typescript(Default::default()),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsConditionalType(conditional) = &*alias.type_ann else {
            panic!("expected conditional type");
        };
        let TsType::TsInferType(infer) = &*conditional.extends_type else {
            panic!("expected infer type in extends clause");
        };

        assert!(infer.type_param.constraint.is_none());
    }

    #[test]
    fn infer_type_with_extends_keeps_constraint() {
        let actual = test_parser(
            "type T<X> = X extends infer U extends string ? U : never;",
            Syntax::Typescript(Default::default()),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsConditionalType(conditional) = &*alias.type_ann else {
            panic!("expected conditional type");
        };
        let TsType::TsInferType(infer) = &*conditional.extends_type else {
            panic!("expected infer type in extends clause");
        };

        assert!(matches!(
            infer.type_param.constraint.as_deref(),
            Some(TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsStringKeyword,
                ..
            }))
        ));
    }

    #[test]
    fn infer_type_in_disallow_conditional_context_keeps_constraint_and_question_mark() {
        crate::with_test_sess("infer U extends string ? never : never", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Typescript(Default::default()),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let infer = parser
                .in_type(|p| {
                    p.do_inside_of_context(Context::DisallowConditionalTypes, |p| {
                        p.parse_ts_infer_type()
                    })
                })
                .unwrap();

            assert!(matches!(
                infer.type_param.constraint.as_deref(),
                Some(TsType::TsKeywordType(TsKeywordType {
                    kind: TsKeywordTypeKind::TsStringKeyword,
                    ..
                }))
            ));
            assert_eq!(parser.input().cur(), Token::QuestionMark);

            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn ts_decl_keyword_guard_filters_non_declarations() {
        crate::with_test_sess("", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Typescript(Default::default()),
                EsVersion::Es2022,
                input,
                None,
            );
            let parser = Parser::new_from(lexer);

            assert!(parser.can_start_ts_decl_from_word(&atom!("abstract")));
            assert!(parser.can_start_ts_decl_from_word(&atom!("type")));
            assert!(parser.can_start_ts_decl_from_word(&atom!("interface")));
            assert!(!parser.can_start_ts_decl_from_word(&atom!("async")));
            assert!(!parser.can_start_ts_decl_from_word(&atom!("function")));

            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn ts_decl_probe_guard_checks_following_token_shape() {
        crate::with_test_sess("abstract foo", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Typescript(Default::default()),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(!parser.can_probe_ts_decl_from_word(&atom!("abstract")));
            assert_eq!(parser.input().cur(), Token::Abstract);

            Ok(())
        })
        .unwrap();

        crate::with_test_sess("abstract class Foo {}", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Typescript(Default::default()),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(parser.can_probe_ts_decl_from_word(&atom!("abstract")));

            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn ts_module_decl_probe_guard_filters_non_module_follow_ups() {
        crate::with_test_sess("module + 1", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Typescript(Default::default()),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(!parser.can_probe_ts_decl_from_word(&atom!("module")));
            assert!(parser.input().cur().is_word());
            assert_eq!(
                parser.input().cur().take_word(&parser.input),
                atom!("module")
            );

            Ok(())
        })
        .unwrap();

        crate::with_test_sess("module \"foo\" {}", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Typescript(Default::default()),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(parser.can_probe_ts_decl_from_word(&atom!("module")));

            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn ts_named_decl_probe_guards_filter_non_declaration_shapes() {
        for (src, keyword) in [
            ("type Foo + 1", atom!("type")),
            ("interface Foo + 1", atom!("interface")),
            ("enum Foo + 1", atom!("enum")),
            ("namespace Foo + 1", atom!("namespace")),
            ("module Foo + 1", atom!("module")),
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.can_probe_ts_decl_from_word(&keyword));
                assert!(parser.input().cur().is_word());

                Ok(())
            })
            .unwrap();
        }
    }

    #[test]
    fn ts_named_decl_probe_guards_keep_valid_declaration_shapes() {
        for (src, keyword) in [
            ("type Foo = Bar", atom!("type")),
            ("interface Foo {}", atom!("interface")),
            ("enum Foo {}", atom!("enum")),
            ("namespace Foo {}", atom!("namespace")),
            ("module Foo {}", atom!("module")),
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(parser.can_probe_ts_decl_from_word(&keyword));

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_decl_keyword_guard_allows_flow_only_declarations() {
        crate::with_test_sess("", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let parser = Parser::new_from(lexer);

            assert!(parser.can_start_ts_decl_from_word(&atom!("opaque")));
            assert!(parser.can_start_ts_decl_from_word(&atom!("component")));
            assert!(parser.can_start_ts_decl_from_word(&atom!("hook")));
            assert!(!parser.can_start_ts_decl_from_word(&atom!("async")));

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_decl_probe_guard_filters_invalid_follow_ups() {
        crate::with_test_sess("opaque\n type T = U;", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(!parser.can_probe_ts_decl_from_word(&atom!("opaque")));
            assert!(parser.input().cur().is_word());
            assert_eq!(
                parser.input().cur().take_word(&parser.input),
                atom!("opaque")
            );

            Ok(())
        })
        .unwrap();

        crate::with_test_sess("component Comp + 1", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(!parser.can_probe_ts_decl_from_word(&atom!("component")));

            Ok(())
        })
        .unwrap();

        crate::with_test_sess("hook useFoo + 1", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(!parser.can_probe_ts_decl_from_word(&atom!("hook")));

            Ok(())
        })
        .unwrap();

        crate::with_test_sess("hook function useFoo() {}", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(parser.can_probe_ts_decl_from_word(&atom!("hook")));

            Ok(())
        })
        .unwrap();

        crate::with_test_sess("hook function + 1", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(!parser.can_probe_ts_decl_from_word(&atom!("hook")));

            Ok(())
        })
        .unwrap();

        crate::with_test_sess("component Comp<T>() renders Foo {}", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(parser.can_probe_ts_decl_from_word(&atom!("component")));

            Ok(())
        })
        .unwrap();

        crate::with_test_sess("hook useFoo<T>(arg: T): T {}", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(parser.can_probe_ts_decl_from_word(&atom!("hook")));

            Ok(())
        })
        .unwrap();

        crate::with_test_sess("module.exports: T", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            parser.set_ctx(parser.ctx() | Context::InDeclare);

            assert!(parser.can_probe_ts_decl_from_word(&atom!("module")));

            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn ts_generic_async_arrow_type_param_guard_filters_non_word_starts() {
        for src in ["<1>() => {}", "<>() => {}", "<\"x\">() => {}"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.can_start_ts_generic_async_arrow_type_params());
                assert_eq!(parser.input().cur(), Token::Lt);

                Ok(())
            })
            .unwrap();
        }
    }

    #[test]
    fn ts_generic_async_arrow_type_param_guard_filters_non_type_param_shapes() {
        for src in [
            "<T + 1>() => {}",
            "<const T + 1>() => {}",
            "<in T + 1>() => {}",
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.can_start_ts_generic_async_arrow_type_params());
                assert_eq!(parser.input().cur(), Token::Lt);

                Ok(())
            })
            .unwrap();
        }
    }

    #[test]
    fn ts_generic_async_arrow_type_param_guard_keeps_word_starts() {
        for src in [
            "<T>() => {}",
            "<const T>() => {}",
            "<in T>() => {}",
            "<out T>() => {}",
            "<T extends U>() => {}",
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(parser.can_start_ts_generic_async_arrow_type_params());
                assert_eq!(parser.input().cur(), Token::Lt);

                Ok(())
            })
            .unwrap();
        }
    }

    #[test]
    fn ts_expr_type_param_guard_filters_jsx_dominated_starts() {
        for src in ["<div />", "<T>", "<A.B>", "<></>"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(TsSyntax {
                        tsx: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);
                let cur = parser.input().cur();

                assert!(!parser.can_start_ts_expr_type_params_fast());
                assert_eq!(parser.input().cur(), cur);

                Ok(())
            })
            .unwrap();
        }
    }

    #[test]
    fn ts_expr_type_param_guard_keeps_unambiguous_tsx_starts() {
        for src in [
            "<T,>() => {}",
            "<T extends unknown>() => {}",
            "<T = unknown>() => {}",
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(TsSyntax {
                        tsx: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);
                let cur = parser.input().cur();

                assert!(parser.can_start_ts_expr_type_params_fast());
                assert_eq!(parser.input().cur(), cur);

                Ok(())
            })
            .unwrap();
        }
    }

    #[test]
    fn ts_type_or_type_predicate_ann_guard_filters_non_type_starts() {
        for src in [": )", ": =>", ": number + 1", ": foo: bar", ": foo(bar)"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);
                let cur = parser.input().cur();

                assert!(!parser.can_start_ts_type_or_type_predicate_ann_fast(Token::Colon));
                assert_eq!(parser.input().cur(), cur);

                Ok(())
            })
            .unwrap();
        }
    }

    #[test]
    fn ts_type_or_type_predicate_ann_guard_keeps_valid_starts() {
        for src in [
            ": number",
            ": number[]",
            ": foo.Bar",
            ": foo is Bar",
            ": asserts foo",
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);
                let cur = parser.input().cur();

                assert!(parser.can_start_ts_type_or_type_predicate_ann_fast(Token::Colon));
                assert_eq!(parser.input().cur(), cur);

                Ok(())
            })
            .unwrap();
        }
    }

    #[test]
    fn ts_type_args_guard_filters_non_type_starts() {
        for src in ["<>()", "<,>()", "<)>()"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(
                    !parser.can_start_ts_type_args_fast(),
                    "unexpectedly accepted {src}"
                );
                assert_eq!(parser.input().cur(), Token::Lt);

                Ok(())
            })
            .unwrap();
        }
    }

    #[test]
    fn ts_type_args_guard_filters_invalid_simple_type_continuations() {
        for src in [
            "<T + 1>()",
            "<T = U>()",
            "<T: U>()",
            "<T =>()",
            "<1 + 2>()",
            "<\"x\" + 1>()",
            "<true ? T : U>()",
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.can_start_ts_type_args_fast());
                assert_eq!(parser.input().cur(), Token::Lt);

                Ok(())
            })
            .unwrap();
        }
    }

    #[test]
    fn ts_type_args_guard_keeps_valid_type_starts() {
        for src in [
            "<T>()",
            "<number>()",
            "<1>()",
            "<\"x\">()",
            "<T | U>()",
            "<T & U>()",
            "<T extends U ? X : Y>()",
            "<{ foo: string }>()",
            "<[T]>()",
            "<new () => Date>()",
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(
                    parser.can_start_ts_type_args_fast(),
                    "unexpectedly rejected {src}"
                );
                assert_eq!(parser.input().cur(), Token::Lt);

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_renders_type_guard_filters_non_special_forms() {
        for src in ["renders Foo", "renders", "foo?"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.in_type(|p| p.can_start_flow_renders_type()));
                assert!(parser.take_errors().is_empty());

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_renders_type_still_parses_underlying_type() {
        crate::with_test_sess("renders? Foo", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let ty = parser.in_type(|p| p.parse_ts_type()).unwrap();

            assert!(matches!(
                &*ty,
                TsType::TsTypeRef(TsTypeRef {
                    type_name: TsEntityName::Ident(ident),
                    ..
                }) if ident.sym == atom!("Foo")
            ));
            assert!(parser.take_errors().is_empty());

            Ok(())
        })
        .unwrap();

        crate::with_test_sess("renders* string", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let ty = parser.in_type(|p| p.parse_ts_type()).unwrap();

            assert!(matches!(
                &*ty,
                TsType::TsKeywordType(TsKeywordType {
                    kind: TsKeywordTypeKind::TsStringKeyword,
                    ..
                })
            ));
            assert!(parser.take_errors().is_empty());

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_component_rest_type_guard_filters_named_rest_params() {
        for src in ["rest: Rest", "rest?: Rest", "rest = value"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.can_start_flow_component_rest_type());

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_component_rest_type_guard_keeps_type_forms() {
        for src in ["Rest", "Rest<T>", "{ foo: string }", "?number"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(parser.can_start_flow_component_rest_type());

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_component_rest_type_direct_parse_guard_only_accepts_unambiguous_type_starts() {
        for src in [
            "string",
            "number",
            "(string)",
            "Foo.Bar",
            "Foo[Bar]",
            "typeof Foo",
            "interface {}",
            "Rest<T>",
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        components: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(parser.in_type(|p| p.can_direct_parse_flow_component_rest_type()));

                Ok(())
            })
            .unwrap();
        }

        for src in ["Rest", "{ foo: string }", "[string]"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        components: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.in_type(|p| p.can_direct_parse_flow_component_rest_type()));

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_component_rest_type_still_parses_keyword_types_without_checkpoint() {
        crate::with_test_sess("(...string)", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let params = parser
                .parse_flow_component_params(false, false, true)
                .unwrap();

            assert!(matches!(
                params.as_slice(),
                [FlowComponentParam::Rest {
                    rest: RestPat {
                        type_ann: Some(type_ann),
                        ..
                    },
                    ..
                }] if matches!(
                    &*type_ann.type_ann,
                    TsType::TsKeywordType(TsKeywordType {
                        kind: TsKeywordTypeKind::TsStringKeyword,
                        ..
                    })
                )
            ));
            assert!(parser.take_errors().is_empty());

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_component_rest_type_still_parses_generic_types_without_checkpoint() {
        crate::with_test_sess("(...Rest<T>)", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let params = parser
                .parse_flow_component_params(false, false, true)
                .unwrap();

            assert!(matches!(
                params.as_slice(),
                [FlowComponentParam::Rest {
                    rest: RestPat {
                        type_ann: Some(type_ann),
                        ..
                    },
                    ..
                }] if matches!(
                    &*type_ann.type_ann,
                    TsType::TsTypeRef(TsTypeRef {
                        type_name: TsEntityName::Ident(Ident { sym, .. }),
                        type_params: Some(type_params),
                        ..
                    }) if sym == "Rest" && type_params.params.len() == 1
                )
            ));
            assert!(parser.take_errors().is_empty());

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_component_rest_type_still_parses_parenthesized_types_without_checkpoint() {
        crate::with_test_sess("(...(string))", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let params = parser
                .parse_flow_component_params(false, false, true)
                .unwrap();

            assert!(matches!(
                params.as_slice(),
                [FlowComponentParam::Rest {
                    rest: RestPat {
                        type_ann: Some(type_ann),
                        ..
                    },
                    ..
                }] if matches!(&*type_ann.type_ann, TsType::TsParenthesizedType(..))
            ));
            assert!(parser.take_errors().is_empty());

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_component_rest_type_still_parses_qualified_types_without_checkpoint() {
        crate::with_test_sess("(...Foo.Bar)", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let params = parser
                .parse_flow_component_params(false, false, true)
                .unwrap();

            assert!(matches!(
                params.as_slice(),
                [FlowComponentParam::Rest {
                    rest: RestPat {
                        type_ann: Some(type_ann),
                        ..
                    },
                    ..
                }] if matches!(
                    &*type_ann.type_ann,
                    TsType::TsTypeRef(TsTypeRef {
                        type_name: TsEntityName::TsQualifiedName(qualified),
                        ..
                    }) if matches!(qualified.left, TsEntityName::Ident(Ident { ref sym, .. }) if sym == "Foo")
                        && qualified.right.sym == atom!("Bar")
                )
            ));
            assert!(parser.take_errors().is_empty());

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_component_rest_type_still_parses_indexed_access_types_without_checkpoint() {
        crate::with_test_sess("(...Foo[Bar])", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    components: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let params = parser
                .parse_flow_component_params(false, false, true)
                .unwrap();

            assert!(matches!(
                params.as_slice(),
                [FlowComponentParam::Rest {
                    rest: RestPat {
                        type_ann: Some(type_ann),
                        ..
                    },
                    ..
                }] if matches!(
                    &*type_ann.type_ann,
                    TsType::TsIndexedAccessType(TsIndexedAccessType {
                        obj_type,
                        index_type,
                        ..
                    }) if matches!(
                        &**obj_type,
                        TsType::TsTypeRef(TsTypeRef {
                            type_name: TsEntityName::Ident(Ident { sym, .. }),
                            ..
                        }) if sym == "Foo"
                    ) && matches!(
                        &**index_type,
                        TsType::TsTypeRef(TsTypeRef {
                            type_name: TsEntityName::Ident(Ident { sym, .. }),
                            ..
                        }) if sym == "Bar"
                    )
                )
            ));
            assert!(parser.take_errors().is_empty());

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_component_rest_type_and_named_rest_param_still_parse() {
        let component_type = test_parser(
            "type Comp = component(...Rest);",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &component_type.body[0] else {
            panic!("expected type alias");
        };
        assert!(matches!(
            &*alias.type_ann,
            TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(TsFnType { params, .. }))
                if matches!(params.first(), Some(TsFnParam::Object(ObjectPat { props, .. }))
                    if matches!(props.first(), Some(ObjectPatProp::Rest(RestPat { type_ann: Some(_), .. }))))
        ));

        let declare_component = test_parser(
            "declare component Comp(...rest: Rest);",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::Fn(fn_decl))) = &declare_component.body[0] else {
            panic!("expected function declaration");
        };
        assert!(matches!(
            fn_decl.function.params.first(),
            Some(Param { pat: Pat::Object(ObjectPat { props, .. }), .. })
                if matches!(props.first(), Some(ObjectPatProp::Rest(RestPat { arg, type_ann: Some(_), .. }))
                    if matches!(arg.as_ref(), Pat::Ident(BindingIdent {
                        id: Ident { sym, .. },
                        ..
                    }) if sym == "rest"))
        ));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_mapped_member_guard_filters_index_signatures() {
        crate::with_test_sess("[key: string]: number", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(!parser.can_start_flow_mapped_member());
            assert_eq!(parser.input().cur(), Token::LBracket);

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_mapped_member_guard_keeps_mapped_members() {
        for src in ["[K in keyof O]: V", "[K in keyof O]?: V"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(parser.can_start_flow_mapped_member());
                assert_eq!(parser.input().cur(), Token::LBracket);

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_mapped_member_guard_filters_non_property_shapes() {
        for src in ["[K in keyof O]()", "[K in keyof O]"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.can_start_flow_mapped_member());
                assert_eq!(parser.input().cur(), Token::LBracket);

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_object_type_still_parses_mapped_and_index_members() {
        let actual = test_parser(
            "type T = { [K in keyof O]: V, [key: string]: number };",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsTypeLit(type_lit) = &*alias.type_ann else {
            panic!("expected object type literal");
        };

        assert!(matches!(
            &type_lit.members[0],
            TsTypeElement::TsPropertySignature(TsPropertySignature { key, .. })
                if matches!(&**key, Expr::Ident(Ident { sym, .. }) if sym == "__flow_mapped")
        ));
        assert!(matches!(
            &type_lit.members[1],
            TsTypeElement::TsIndexSignature(TsIndexSignature { .. })
        ));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_object_type_still_parses_optional_mapped_members() {
        let actual = test_parser(
            "type T = { [K in keyof O]?: V };",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsTypeLit(type_lit) = &*alias.type_ann else {
            panic!("expected object type literal");
        };

        assert!(matches!(
            &type_lit.members[0],
            TsTypeElement::TsPropertySignature(TsPropertySignature {
                key,
                optional: true,
                ..
            }) if matches!(&**key, Expr::Ident(Ident { sym, .. }) if sym == "__flow_mapped")
        ));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_accessor_keyword_guard_filters_plain_members() {
        crate::with_test_sess("foo", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(!parser.can_start_flow_accessor_sig());

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_accessor_keyword_guard_filters_plain_get_property() {
        crate::with_test_sess("get: string", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(!parser.can_start_flow_accessor_sig());
            assert_eq!(parser.input().cur(), Token::Get);

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_accessor_keyword_guard_filters_non_accessor_shapes() {
        for src in ["get foo: string", "set foo: string"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.can_start_flow_accessor_sig());
                assert!(matches!(parser.input().cur(), Token::Get | Token::Set));

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_accessor_keyword_guard_keeps_accessor_keywords() {
        for src in ["get foo(): string", "set foo(value: string): void"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(parser.can_start_flow_accessor_sig());
                assert!(matches!(parser.input().cur(), Token::Get | Token::Set));

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_direct_getter_guard_keeps_empty_param_getters() {
        for src in ["get foo(): string", "get [foo](): string"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(parser.can_direct_parse_flow_getter_sig());
                assert_eq!(parser.input().cur(), Token::Get);

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_direct_getter_guard_filters_non_direct_accessor_shapes() {
        for src in [
            "set foo(value: string): void",
            "get foo(value: string): string",
            "get foo() => string",
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.can_direct_parse_flow_getter_sig());
                assert!(matches!(parser.input().cur(), Token::Get | Token::Set));

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_direct_setter_guard_keeps_setter_keywords() {
        for src in [
            "set foo(value: string): void",
            "set [foo](value: string): void",
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(parser.can_direct_parse_flow_setter_sig());
                assert_eq!(parser.input().cur(), Token::Set);

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_direct_setter_guard_filters_non_setter_keywords() {
        for src in ["get foo(): string", "set foo: string"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.can_direct_parse_flow_setter_sig());
                assert!(matches!(parser.input().cur(), Token::Get | Token::Set));

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_accessor_keyword_guard_filters_computed_non_accessor_shapes() {
        for src in ["get [foo]: string", "set [foo]: string"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(!parser.can_start_flow_accessor_sig());
                assert!(matches!(parser.input().cur(), Token::Get | Token::Set));

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_accessor_keyword_guard_keeps_computed_accessors() {
        for src in ["get [foo](): string", "set [foo](value: string): void"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(parser.can_start_flow_accessor_sig());
                assert!(matches!(parser.input().cur(), Token::Get | Token::Set));

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_object_type_still_parses_plain_and_accessor_members() {
        let actual = test_parser(
            "type T = { foo: string, get bar(): string, get: string };",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsTypeLit(type_lit) = &*alias.type_ann else {
            panic!("expected object type literal");
        };

        assert!(matches!(
            &type_lit.members[0],
            TsTypeElement::TsPropertySignature(TsPropertySignature { key, .. })
                if matches!(&**key, Expr::Ident(Ident { sym, .. }) if sym == "foo")
        ));
        assert!(matches!(
            &type_lit.members[1],
            TsTypeElement::TsGetterSignature(TsGetterSignature { key, .. })
                if matches!(&**key, Expr::Ident(Ident { sym, .. }) if sym == "bar")
        ));
        assert!(matches!(
            &type_lit.members[2],
            TsTypeElement::TsPropertySignature(TsPropertySignature { key, .. })
                if matches!(&**key, Expr::Ident(Ident { sym, .. }) if sym == "get")
        ));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_object_type_still_parses_computed_getter_and_setter_members() {
        let actual = test_parser(
            "type T = { get [bar](): string, set [baz](value: string): void };",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsTypeLit(type_lit) = &*alias.type_ann else {
            panic!("expected object type literal");
        };

        assert!(matches!(
            &type_lit.members[0],
            TsTypeElement::TsGetterSignature(TsGetterSignature { computed: true, .. })
        ));
        assert!(matches!(
            &type_lit.members[1],
            TsTypeElement::TsSetterSignature(TsSetterSignature { computed: true, .. })
        ));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_parenthesized_fn_type_guard_filters_grouped_types() {
        crate::with_test_sess("(string)", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let can_start = parser.in_type(|p| p.can_start_flow_parenthesized_fn_type());

            assert!(!can_start);
            assert_eq!(parser.input().cur(), Token::LParen);

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_parenthesized_fn_type_guard_keeps_function_types() {
        for src in [
            "(?Foo) => Bar",
            "(foo: string) => void",
            "(...string) => void",
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                let can_start = parser.in_type(|p| p.can_start_flow_parenthesized_fn_type());

                assert!(can_start);
                assert_eq!(parser.input().cur(), Token::LParen);

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_parenthesized_grouped_type_still_parses_as_grouped_type() {
        let actual = test_parser(
            "type T = (string);",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };

        assert!(matches!(&*alias.type_ann, TsType::TsParenthesizedType(..)));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_anon_fn_type_guard_filters_named_params() {
        crate::with_test_sess("(foo: string) => void", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let can_start = parser.in_type(|p| p.can_start_flow_anon_fn_type());

            assert!(!can_start);
            assert_eq!(parser.input().cur(), Token::LParen);

            Ok(())
        })
        .unwrap();
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_anon_fn_type_guard_keeps_anon_params() {
        for src in ["(?Foo) => Bar", "(...string) => void"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                let can_start = parser.in_type(|p| p.can_start_flow_anon_fn_type());

                assert!(can_start);
                assert_eq!(parser.input().cur(), Token::LParen);

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_anon_signature_param_direct_guard_filters_ambiguous_starts() {
        for src in ["{ foo: string }", "[string]"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);
                parser.set_ctx(parser.ctx() | Context::InType);
                let cur = parser.input().cur();

                assert!(!parser.can_direct_parse_flow_anon_signature_param());
                assert_eq!(parser.input().cur(), cur);

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_anon_signature_param_direct_guard_keeps_unambiguous_starts() {
        for src in [
            "string",
            "(string)",
            "...string",
            "Foo.Bar",
            "Foo[Bar]",
            "typeof Foo",
            "?Foo",
            "Foo<T>",
            "interface {}",
        ] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Flow(FlowSyntax {
                        all: true,
                        ..Default::default()
                    }),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);
                parser.set_ctx(parser.ctx() | Context::InType);
                let cur = parser.input().cur();

                assert!(parser.can_direct_parse_flow_anon_signature_param());
                assert_eq!(parser.input().cur(), cur);

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_nullable_fn_type_stays_function_type() {
        let actual = test_parser(
            "type Empty = ?() => void;",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(union)) =
            &*alias.type_ann
        else {
            panic!("expected nullable union type");
        };

        assert!(matches!(
            &*union.types[0],
            TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(..))
        ));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_nullable_grouped_array_keeps_grouped_precedence() {
        let actual = test_parser(
            "type GroupedArray = ?(string)[];",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(union)) =
            &*alias.type_ann
        else {
            panic!("expected nullable union type");
        };

        assert!(matches!(&*union.types[0], TsType::TsArrayType(..)));
    }

    #[test]
    fn ts_tuple_element_name_guard_filters_unlabeled_elements() {
        crate::with_test_sess("string", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Typescript(Default::default()),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert!(!parser.can_start_ts_tuple_element_name());
            assert_eq!(parser.input().cur(), Token::String);

            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn ts_tuple_element_name_guard_keeps_labeled_elements() {
        for src in ["foo: string", "foo?: string", "...rest: string"] {
            crate::with_test_sess(src, |_, input| {
                let lexer = crate::lexer::Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2022,
                    input,
                    None,
                );
                let mut parser = Parser::new_from(lexer);

                assert!(parser.can_start_ts_tuple_element_name());
                assert!(parser.try_parse_ts_tuple_element_name().is_some());

                Ok(())
            })
            .unwrap();
        }
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_tuple_rest_label_direct_parse_keeps_error_and_cursor() {
        crate::with_test_sess("...foo?: string", |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Flow(FlowSyntax {
                    all: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let label = parser.try_parse_ts_tuple_element_name();

            assert!(matches!(label, Some(Pat::Rest(RestPat { .. }))));
            assert_eq!(parser.input().cur(), Token::String);
            assert_eq!(parser.take_errors().len(), 1);

            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn ts_tuple_type_still_parses_labeled_and_unlabeled_elements() {
        let actual = test_parser(
            "type T = [string, foo: number, ...rest: boolean[]];",
            Syntax::Typescript(Default::default()),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsTupleType(tuple) = &*alias.type_ann else {
            panic!("expected tuple type");
        };

        assert!(tuple.elem_types[0].label.is_none());
        assert!(matches!(
            tuple.elem_types[1].label.as_ref(),
            Some(Pat::Ident(BindingIdent {
                id: Ident { sym, optional, .. },
                ..
            })) if sym == "foo" && !optional
        ));
        assert!(matches!(
            tuple.elem_types[2].label.as_ref(),
            Some(Pat::Rest(RestPat { arg, .. }))
                if matches!(arg.as_ref(), Pat::Ident(BindingIdent {
                    id: Ident { sym, .. },
                    ..
                }) if sym == "rest")
        ));
    }

    #[test]
    fn export_async_function_skips_ts_decl_probe() {
        let actual = test_parser(
            "export async function foo() {}",
            Syntax::Typescript(Default::default()),
            |p| p.parse_module(),
        );

        let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) = &actual.body[0] else {
            panic!("expected export declaration");
        };
        let Decl::Fn(fn_decl) = &export_decl.decl else {
            panic!("expected function declaration");
        };

        assert_eq!(fn_decl.ident.sym, atom!("foo"));
        assert!(fn_decl.function.is_async);
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_fn_type_named_param_skips_anon_signature_probe() {
        let actual = test_parser(
            "type T = (foo: string) => void;",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(fn_type)) =
            &*alias.type_ann
        else {
            panic!("expected function type");
        };

        assert!(matches!(
            &fn_type.params[0],
            TsFnParam::Ident(BindingIdent {
                id: Ident { sym, .. },
                ..
            }) if sym == "foo"
        ));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_fn_type_anon_rest_param_still_parses() {
        let actual = test_parser(
            "type T = (...string) => void;",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(fn_type)) =
            &*alias.type_ann
        else {
            panic!("expected function type");
        };

        assert!(matches!(&fn_type.params[0], TsFnParam::Rest(..)));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_fn_type_anon_keyword_params_still_parse() {
        let actual = test_parser(
            "type T = (string, number) => void;",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(fn_type)) =
            &*alias.type_ann
        else {
            panic!("expected function type");
        };

        assert!(matches!(&fn_type.params[0], TsFnParam::Ident(..)));
        assert!(matches!(&fn_type.params[1], TsFnParam::Ident(..)));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_fn_type_anon_generic_param_still_parses() {
        let actual = test_parser(
            "type T = (Foo<U>) => void;",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(fn_type)) =
            &*alias.type_ann
        else {
            panic!("expected function type");
        };

        assert!(matches!(
            &fn_type.params[0],
            TsFnParam::Ident(BindingIdent {
                type_ann: Some(type_ann),
                ..
            }) if matches!(
                &*type_ann.type_ann,
                TsType::TsTypeRef(TsTypeRef {
                    type_name: TsEntityName::Ident(Ident { sym, .. }),
                    type_params: Some(type_params),
                    ..
                }) if sym == "Foo" && type_params.params.len() == 1
            )
        ));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_fn_type_anon_parenthesized_param_still_parses() {
        let actual = test_parser(
            "type T = ((string)) => void;",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(fn_type)) =
            &*alias.type_ann
        else {
            panic!("expected function type");
        };

        assert!(matches!(
            &fn_type.params[0],
            TsFnParam::Ident(BindingIdent {
                type_ann: Some(type_ann),
                ..
            }) if matches!(&*type_ann.type_ann, TsType::TsParenthesizedType(..))
        ));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_fn_type_anon_qualified_param_still_parses() {
        let actual = test_parser(
            "type T = (Foo.Bar) => void;",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(fn_type)) =
            &*alias.type_ann
        else {
            panic!("expected function type");
        };

        assert!(matches!(
            &fn_type.params[0],
            TsFnParam::Ident(BindingIdent {
                type_ann: Some(type_ann),
                ..
            }) if matches!(
                &*type_ann.type_ann,
                TsType::TsTypeRef(TsTypeRef {
                    type_name: TsEntityName::TsQualifiedName(qualified),
                    ..
                }) if matches!(qualified.left, TsEntityName::Ident(Ident { ref sym, .. }) if sym == "Foo")
                    && qualified.right.sym == atom!("Bar")
            )
        ));
    }

    #[cfg(feature = "flow")]
    #[test]
    fn flow_fn_type_anon_indexed_access_param_still_parses() {
        let actual = test_parser(
            "type T = (Foo[Bar]) => void;",
            Syntax::Flow(FlowSyntax {
                all: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(alias))) = &actual.body[0] else {
            panic!("expected type alias");
        };
        let TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(fn_type)) =
            &*alias.type_ann
        else {
            panic!("expected function type");
        };

        assert!(matches!(
            &fn_type.params[0],
            TsFnParam::Ident(BindingIdent {
                type_ann: Some(type_ann),
                ..
            }) if matches!(
                &*type_ann.type_ann,
                TsType::TsIndexedAccessType(TsIndexedAccessType {
                    obj_type,
                    index_type,
                    ..
                }) if matches!(
                    &**obj_type,
                    TsType::TsTypeRef(TsTypeRef {
                        type_name: TsEntityName::Ident(Ident { sym, .. }),
                        ..
                    }) if sym == "Foo"
                ) && matches!(
                    &**index_type,
                    TsType::TsTypeRef(TsTypeRef {
                        type_name: TsEntityName::Ident(Ident { sym, .. }),
                        ..
                    }) if sym == "Bar"
                )
            )
        ));
    }
}
