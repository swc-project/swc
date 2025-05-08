use std::{fmt::Write, ops::DerefMut};

use either::Either;
use swc_common::Spanned;
use swc_ecma_lexer::common::parser::{
    expr::parse_lit,
    ident::{parse_ident_name, parse_maybe_private_name},
    is_simple_param_list::IsSimpleParameterList,
    make_decl_declare,
    typescript::{
        eat_any_ts_modifier, expect_then_parse_ts_type, is_ts_start_of_construct_signature,
        parse_ts_bracketed_list, parse_ts_entity_name, parse_ts_enum_decl,
        parse_ts_heritage_clause, parse_ts_list, parse_ts_lit_type_node,
        parse_ts_mapped_type_param, parse_ts_modifier, parse_ts_this_type_node,
        parse_ts_this_type_predicate, parse_ts_type_ann, parse_ts_type_args,
        parse_ts_type_member_semicolon, parse_ts_type_or_type_predicate_ann, parse_ts_type_params,
        parse_ts_type_ref, parse_ts_union_or_intersection_type, try_parse_ts, try_parse_ts_type,
        try_parse_ts_type_ann, try_parse_ts_type_or_type_predicate_ann, try_parse_ts_type_params,
        ts_look_ahead, ParsingContext, SignatureParsingMode, UnionOrIntersection,
    },
};

use super::*;
use crate::{lexer::Token, parser::Parser, token};

impl<I: Tokens> Parser<I> {
    /// `tsParseImportType`
    fn parse_ts_import_type(&mut self) -> PResult<TsImportType> {
        let start = cur_pos!(self);
        assert_and_bump!(self, "import");

        expect!(self, '(');

        let _ = cur!(self, false);

        let arg_span = self.input.cur_span();

        let arg = match cur!(self, true) {
            Token::Str => match bump!(self) {
                Token::Str => {
                    let (value, raw) = self.input.expect_string_token_value();
                    Str {
                        span: arg_span,
                        value,
                        raw: Some(raw),
                    }
                }
                _ => unreachable!(),
            },
            _ => {
                bump!(self);
                self.emit_err(arg_span, SyntaxError::TS1141);
                Str {
                    span: arg_span,
                    value: "".into(),
                    raw: Some("\"\"".into()),
                }
            }
        };

        // the "assert" keyword is deprecated and this syntax is niche, so
        // don't support it
        let attributes =
            if eat!(self, ',') && self.input.syntax().import_attributes() && is!(self, '{') {
                Some(self.parse_ts_call_options()?)
            } else {
                None
            };

        expect!(self, ')');

        let qualifier = if eat!(self, '.') {
            parse_ts_entity_name(self, false).map(Some)?
        } else {
            None
        };

        let type_args = if is!(self, '<') {
            parse_ts_type_args(
                self.with_ctx(self.ctx() & !Context::ShouldNotLexLtOrGtAsType)
                    .deref_mut(),
            )
            .map(Some)?
        } else {
            None
        };

        Ok(TsImportType {
            span: span!(self, start),
            arg,
            qualifier,
            type_args,
            attributes,
        })
    }

    fn parse_ts_call_options(&mut self) -> PResult<TsImportCallOptions> {
        debug_assert!(self.input.syntax().typescript());
        let start = cur_pos!(self);
        assert_and_bump!(self, '{');

        expect!(self, "with");
        expect!(self, ':');

        let value = match self.parse_object::<Expr>()? {
            Expr::Object(v) => v,
            _ => unreachable!(),
        };
        eat!(self, ',');
        expect!(self, '}');
        Ok(TsImportCallOptions {
            span: span!(self, start),
            with: Box::new(value),
        })
    }

    /// `tsParseTypeQuery`
    fn parse_ts_type_query(&mut self) -> PResult<TsTypeQuery> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);
        expect!(self, "typeof");
        let expr_name = if is!(self, "import") {
            self.parse_ts_import_type().map(From::from)?
        } else {
            parse_ts_entity_name(
                self, // allow_reserved_word
                true,
            )
            .map(From::from)?
        };

        let type_args = if !self.input.had_line_break_before_cur() && is!(self, '<') {
            Some(parse_ts_type_args(
                self.with_ctx(self.ctx() & !Context::ShouldNotLexLtOrGtAsType)
                    .deref_mut(),
            )?)
        } else {
            None
        };

        Ok(TsTypeQuery {
            span: span!(self, start),
            expr_name,
            type_args,
        })
    }

    /// `tsParseModuleBlock`
    fn parse_ts_module_block(&mut self) -> PResult<TsModuleBlock> {
        trace_cur!(self, parse_ts_module_block);

        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);
        expect!(self, '{');
        // Inside of a module block is considered "top-level", meaning it can have
        // imports and exports.
        let body = self
            .with_ctx(self.ctx() | Context::TopLevel)
            .parse_with(|p| {
                p.parse_block_body(
                    /* directives */ false,
                    /* end */ Some(Token::RBrace),
                )
            })?;

        Ok(TsModuleBlock {
            span: span!(self, start),
            body,
        })
    }

    /// `tsParseModuleOrNamespaceDeclaration`
    fn parse_ts_module_or_ns_decl(
        &mut self,
        start: BytePos,
        namespace: bool,
    ) -> PResult<Box<TsModuleDecl>> {
        debug_assert!(self.input.syntax().typescript());

        let id = parse_ident_name(self)?;
        let body: TsNamespaceBody = if eat!(self, '.') {
            let inner_start = cur_pos!(self);
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
            span: span!(self, start),
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
        debug_assert!(self.input.syntax().typescript());

        let (global, id) = if is!(self, "global") {
            let id = parse_ident_name(self)?;
            (true, TsModuleName::Ident(id.into()))
        } else if matches!(cur!(self, true), Token::Str) {
            let id = parse_lit(self).map(|lit| match lit {
                Lit::Str(s) => TsModuleName::Str(s),
                _ => unreachable!(),
            })?;
            (false, id)
        } else {
            unexpected!(self, "global or a string literal");
        };

        let body = if is!(self, '{') {
            Some(self.parse_ts_module_block().map(TsNamespaceBody::from)?)
        } else {
            expect!(self, ';');
            None
        };

        Ok(Box::new(TsModuleDecl {
            span: span!(self, start),
            declare: false,
            id,
            global,
            body,
            namespace: false,
        }))
    }

    pub fn parse_type(&mut self) -> PResult<Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        self.in_type().parse_ts_type()
    }

    /// Be sure to be in a type context before calling self.
    ///
    /// `tsParseType`
    pub(super) fn parse_ts_type(&mut self) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_type);

        debug_assert!(self.input.syntax().typescript());

        // Need to set `state.inType` so that we don't parse JSX in a type context.
        debug_assert!(self.ctx().contains(Context::InType));

        let start = cur_pos!(self);

        let ctx = self.ctx() & !Context::DisallowConditionalTypes;
        self.with_ctx(ctx).parse_with(|p| {
            let ty = p.parse_ts_non_conditional_type()?;
            if p.input.had_line_break_before_cur() || !eat!(p, "extends") {
                return Ok(ty);
            }

            let check_type = ty;
            let extends_type = {
                p.with_ctx(p.ctx() | Context::DisallowConditionalTypes)
                    .parse_ts_non_conditional_type()?
            };

            expect!(p, '?');

            let true_type = p.parse_ts_type()?;

            expect!(p, ':');

            let false_type = p.parse_ts_type()?;

            Ok(Box::new(TsType::TsConditionalType(TsConditionalType {
                span: span!(p, start),
                check_type,
                extends_type,
                true_type,
                false_type,
            })))
        })
    }

    /// `tsParseNonConditionalType`
    fn parse_ts_non_conditional_type(&mut self) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_non_conditional_type);

        debug_assert!(self.input.syntax().typescript());

        if self.is_ts_start_of_fn_type()? {
            return self
                .parse_ts_fn_or_constructor_type(true)
                .map(TsType::from)
                .map(Box::new);
        }
        if (is!(self, "abstract") && peeked_is!(self, "new")) || is!(self, "new") {
            // As in `new () => Date`
            return self
                .parse_ts_fn_or_constructor_type(false)
                .map(TsType::from)
                .map(Box::new);
        }

        self.parse_ts_union_type_or_higher()
    }

    fn is_ts_start_of_fn_type(&mut self) -> PResult<bool> {
        debug_assert!(self.input.syntax().typescript());

        if is!(self, '<') {
            return Ok(true);
        }

        Ok(is!(self, '(') && ts_look_ahead(self, |p| p.is_ts_unambiguously_start_of_fn_type())?)
    }

    /// `tsParseTypeAssertion`
    pub(super) fn parse_ts_type_assertion(&mut self, start: BytePos) -> PResult<TsTypeAssertion> {
        debug_assert!(self.input.syntax().typescript());

        if self.input.syntax().disallow_ambiguous_jsx_like() {
            self.emit_err(span!(self, start), SyntaxError::ReservedTypeAssertion);
        }

        // Not actually necessary to set state.inType because we never reach here if JSX
        // plugin is enabled, but need `tsInType` to satisfy the assertion in
        // `tsParseType`.
        let type_ann = self.in_type().parse_with(|p| p.parse_ts_type())?;
        expect!(self, '>');
        let expr = self.parse_unary_expr()?;
        Ok(TsTypeAssertion {
            span: span!(self, start),
            type_ann,
            expr,
        })
    }

    /// `tsParseInterfaceDeclaration`
    pub(super) fn parse_ts_interface_decl(
        &mut self,
        start: BytePos,
    ) -> PResult<Box<TsInterfaceDecl>> {
        debug_assert!(self.input.syntax().typescript());

        let id = parse_ident_name(self)?;
        match &*id.sym {
            "string" | "null" | "number" | "object" | "any" | "unknown" | "boolean" | "bigint"
            | "symbol" | "void" | "never" | "intrinsic" => {
                self.emit_err(id.span, SyntaxError::TS2427);
            }
            _ => {}
        }

        let type_params = try_parse_ts_type_params(self, true, false)?;

        let extends = if eat!(self, "extends") {
            parse_ts_heritage_clause(self)?
        } else {
            Vec::new()
        };

        // Recover from
        //
        //     interface I extends A extends B {}
        if is!(self, "extends") {
            self.emit_err(self.input.cur_span(), SyntaxError::TS1172);

            while !eof!(self) && !is!(self, '{') {
                bump!(self);
            }
        }

        let body_start = cur_pos!(self);
        let body = self
            .in_type()
            .parse_with(|p| p.parse_ts_object_type_members())?;
        let body = TsInterfaceBody {
            span: span!(self, body_start),
            body,
        };
        Ok(Box::new(TsInterfaceDecl {
            span: span!(self, start),
            declare: false,
            id: id.into(),
            type_params,
            extends,
            body,
        }))
    }

    /// `tsParseTypeAliasDeclaration`
    pub(super) fn parse_ts_type_alias_decl(
        &mut self,
        start: BytePos,
    ) -> PResult<Box<TsTypeAliasDecl>> {
        debug_assert!(self.input.syntax().typescript());

        let id = parse_ident_name(self)?;
        let type_params = try_parse_ts_type_params(self, true, false)?;
        let type_ann = expect_then_parse_ts_type(self, &Token::Eq, "=")?;
        expect!(self, ';');
        Ok(Box::new(TsTypeAliasDecl {
            declare: false,
            span: span!(self, start),
            id: id.into(),
            type_params,
            type_ann,
        }))
    }

    /// `tsParseImportEqualsDeclaration`
    pub(super) fn parse_ts_import_equals_decl(
        &mut self,
        start: BytePos,
        id: Ident,
        is_export: bool,
        is_type_only: bool,
    ) -> PResult<Box<TsImportEqualsDecl>> {
        debug_assert!(self.input.syntax().typescript());

        expect!(self, '=');

        let module_ref = self.parse_ts_module_ref()?;
        expect!(self, ';');
        Ok(Box::new(TsImportEqualsDecl {
            span: span!(self, start),
            id,
            is_export,
            is_type_only,
            module_ref,
        }))
    }

    /// `tsIsExternalModuleReference`
    fn is_ts_external_module_ref(&mut self) -> PResult<bool> {
        debug_assert!(self.input.syntax().typescript());

        Ok(is!(self, "require") && peeked_is!(self, '('))
    }

    /// `tsParseModuleReference`
    fn parse_ts_module_ref(&mut self) -> PResult<TsModuleRef> {
        debug_assert!(self.input.syntax().typescript());

        if self.is_ts_external_module_ref()? {
            self.parse_ts_external_module_ref().map(From::from)
        } else {
            parse_ts_entity_name(self, /* allow_reserved_words */ false).map(From::from)
        }
    }

    /// `tsParseExternalModuleReference`
    fn parse_ts_external_module_ref(&mut self) -> PResult<TsExternalModuleRef> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);
        expect!(self, "require");
        expect!(self, '(');
        match cur!(self, true) {
            Token::Str => {}
            _ => unexpected!(self, "a string literal"),
        }
        let expr = match parse_lit(self)? {
            Lit::Str(s) => s,
            _ => unreachable!(),
        };
        expect!(self, ')');
        Ok(TsExternalModuleRef {
            span: span!(self, start),
            expr,
        })
    }

    /// `tsIsUnambiguouslyStartOfFunctionType`
    fn is_ts_unambiguously_start_of_fn_type(&mut self) -> PResult<bool> {
        debug_assert!(self.input.syntax().typescript());

        assert_and_bump!(self, '(');
        if is_one_of!(self, ')', "...") {
            // ( )
            // ( ...
            return Ok(true);
        }
        if self.skip_ts_parameter_start()? {
            if is_one_of!(self, ':', ',', '?', '=') {
                // ( xxx :
                // ( xxx ,
                // ( xxx ?
                // ( xxx =
                return Ok(true);
            }
            if eat!(self, ')') && is!(self, "=>") {
                // ( xxx ) =>
                return Ok(true);
            }
        }
        Ok(false)
    }

    /// `tsSkipParameterStart`
    fn skip_ts_parameter_start(&mut self) -> PResult<bool> {
        debug_assert!(self.input.syntax().typescript());

        let _ = eat_any_ts_modifier(self)?;

        if is_one_of!(self, IdentName, "this") {
            bump!(self);
            return Ok(true);
        }

        if (is!(self, '{') || is!(self, '[')) && self.parse_binding_pat_or_ident(false).is_ok() {
            return Ok(true);
        }

        Ok(false)
    }

    /// `tsParseSignatureMember`
    fn parse_ts_signature_member(
        &mut self,
        kind: SignatureParsingMode,
    ) -> PResult<Either<TsCallSignatureDecl, TsConstructSignatureDecl>> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);

        if kind == SignatureParsingMode::TSConstructSignatureDeclaration {
            expect!(self, "new");
        }

        // ----- inlined self.tsFillSignature(tt.colon, node);
        let type_params = try_parse_ts_type_params(self, false, true)?;
        expect!(self, '(');
        let params = self.parse_ts_binding_list_for_signature()?;
        let type_ann = if is!(self, ':') {
            Some(parse_ts_type_or_type_predicate_ann(self, &Token::Colon)?)
        } else {
            None
        };
        // -----

        parse_ts_type_member_semicolon(self)?;

        match kind {
            SignatureParsingMode::TSCallSignatureDeclaration => {
                Ok(Either::Left(TsCallSignatureDecl {
                    span: span!(self, start),
                    params,
                    type_ann,
                    type_params,
                }))
            }
            SignatureParsingMode::TSConstructSignatureDeclaration => {
                Ok(Either::Right(TsConstructSignatureDecl {
                    span: span!(self, start),
                    params,
                    type_ann,
                    type_params,
                }))
            }
        }
    }

    /// `tsIsUnambiguouslyIndexSignature`
    fn is_ts_unambiguously_index_signature(&mut self) -> PResult<bool> {
        debug_assert!(self.input.syntax().typescript());

        // Note: babel's comment is wrong
        assert_and_bump!(self, '['); // Skip '['

        // ',' is for error recovery
        Ok(eat!(self, IdentRef) && is_one_of!(self, ':', ','))
    }

    /// `tsTryParseIndexSignature`
    pub(super) fn try_parse_ts_index_signature(
        &mut self,
        index_signature_start: BytePos,
        readonly: bool,
        is_static: bool,
    ) -> PResult<Option<TsIndexSignature>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        if !(is!(self, '[') && ts_look_ahead(self, |p| p.is_ts_unambiguously_index_signature())?) {
            return Ok(None);
        }

        expect!(self, '[');

        let ident_start = cur_pos!(self);
        let mut id = parse_ident_name(self).map(BindingIdent::from)?;
        let type_ann_start = cur_pos!(self);

        if eat!(self, ',') {
            self.emit_err(id.span, SyntaxError::TS1096);
        } else {
            expect!(self, ':');
        }

        let type_ann = parse_ts_type_ann(self, /* eat_colon */ false, type_ann_start)?;
        id.span = span!(self, ident_start);
        id.type_ann = Some(type_ann);

        expect!(self, ']');
        let params = vec![TsFnParam::Ident(id)];

        let ty = try_parse_ts_type_ann(self)?;
        let type_ann = ty;

        parse_ts_type_member_semicolon(self)?;
        Ok(Some(TsIndexSignature {
            span: span!(self, index_signature_start),
            readonly,
            is_static,
            params,
            type_ann,
        }))
    }

    /// `parsePropertyName` in babel.
    ///
    /// Returns `(computed, key)`.
    fn parse_ts_property_name(&mut self) -> PResult<(bool, Box<Expr>)> {
        let (computed, key) = if eat!(self, '[') {
            let key = self.parse_assignment_expr()?;
            expect!(self, ']');
            (true, key)
        } else {
            let ctx = self.ctx() | Context::InPropertyName;
            self.with_ctx(ctx).parse_with(|p| {
                // We check if it's valid for it to be a private name when we push it.
                let key = match cur!(p, true) {
                    Token::Num | Token::Str => p.parse_new_expr(),
                    _ => parse_maybe_private_name(p).map(|e| match e {
                        Either::Left(e) => {
                            p.emit_err(e.span(), SyntaxError::PrivateNameInInterface);

                            e.into()
                        }
                        Either::Right(e) => e.into(),
                    }),
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
        debug_assert!(self.input.syntax().typescript());

        let (computed, key) = self.parse_ts_property_name()?;

        let optional = eat!(self, '?');

        if is_one_of!(self, '(', '<') {
            if readonly {
                syntax_error!(self, SyntaxError::ReadOnlyMethod)
            }

            let type_params = try_parse_ts_type_params(self, false, true)?;
            expect!(self, '(');
            let params = self.parse_ts_binding_list_for_signature()?;
            let type_ann = if is!(self, ':') {
                parse_ts_type_or_type_predicate_ann(self, &Token::Colon).map(Some)?
            } else {
                None
            };
            // -----

            parse_ts_type_member_semicolon(self)?;
            Ok(Either::Right(TsMethodSignature {
                span: span!(self, start),
                computed,
                key,
                optional,
                type_params,
                params,
                type_ann,
            }))
        } else {
            let type_ann = try_parse_ts_type_ann(self)?;

            parse_ts_type_member_semicolon(self)?;
            Ok(Either::Left(TsPropertySignature {
                span: span!(self, start),
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
        debug_assert!(self.input.syntax().typescript());

        fn into_type_elem(
            e: Either<TsCallSignatureDecl, TsConstructSignatureDecl>,
        ) -> TsTypeElement {
            match e {
                Either::Left(e) => e.into(),
                Either::Right(e) => e.into(),
            }
        }
        if is_one_of!(self, '(', '<') {
            return self
                .parse_ts_signature_member(SignatureParsingMode::TSCallSignatureDeclaration)
                .map(into_type_elem);
        }
        if is!(self, "new") && ts_look_ahead(self, is_ts_start_of_construct_signature)? {
            return self
                .parse_ts_signature_member(SignatureParsingMode::TSConstructSignatureDeclaration)
                .map(into_type_elem);
        }
        // Instead of fullStart, we create a node here.
        let start = cur_pos!(self);
        let readonly = parse_ts_modifier(self, &["readonly"], false)?.is_some();

        let idx = self.try_parse_ts_index_signature(start, readonly, false)?;
        if let Some(idx) = idx {
            return Ok(idx.into());
        }

        if let Some(v) = try_parse_ts(self, |p| {
            let start = p.input.cur_pos();

            if readonly {
                syntax_error!(p, SyntaxError::GetterSetterCannotBeReadonly)
            }

            let is_get = if eat!(p, "get") {
                true
            } else {
                expect!(p, "set");
                false
            };

            let (computed, key) = p.parse_ts_property_name()?;

            if is_get {
                expect!(p, '(');
                expect!(p, ')');
                let type_ann = try_parse_ts_type_ann(p)?;

                parse_ts_type_member_semicolon(p)?;

                Ok(Some(TsTypeElement::TsGetterSignature(TsGetterSignature {
                    span: span!(p, start),
                    key,
                    computed,
                    type_ann,
                })))
            } else {
                expect!(p, '(');
                let params = p.parse_ts_binding_list_for_signature()?;
                if params.is_empty() {
                    syntax_error!(p, SyntaxError::SetterParamRequired)
                }
                let param = params.into_iter().next().unwrap();

                parse_ts_type_member_semicolon(p)?;

                Ok(Some(TsTypeElement::TsSetterSignature(TsSetterSignature {
                    span: span!(p, start),
                    key,
                    computed,
                    param,
                })))
            }
        }) {
            return Ok(v);
        }

        self.parse_ts_property_or_method_signature(start, readonly)
            .map(|e| match e {
                Either::Left(e) => e.into(),
                Either::Right(e) => e.into(),
            })
    }

    /// `tsParseTypeLiteral`
    fn parse_ts_type_lit(&mut self) -> PResult<TsTypeLit> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);
        let members = self.parse_ts_object_type_members()?;
        Ok(TsTypeLit {
            span: span!(self, start),
            members,
        })
    }

    /// `tsParseObjectTypeMembers`
    fn parse_ts_object_type_members(&mut self) -> PResult<Vec<TsTypeElement>> {
        debug_assert!(self.input.syntax().typescript());

        expect!(self, '{');
        let members = parse_ts_list(self, ParsingContext::TypeMembers, |p| {
            p.parse_ts_type_member()
        })?;
        expect!(self, '}');
        Ok(members)
    }

    /// `tsIsStartOfMappedType`
    fn is_ts_start_of_mapped_type(&mut self) -> PResult<bool> {
        debug_assert!(self.input.syntax().typescript());

        bump!(self);
        if eat!(self, '+') || eat!(self, '-') {
            return Ok(is!(self, "readonly"));
        }
        if is!(self, "readonly") {
            bump!(self);
        }
        if !is!(self, '[') {
            return Ok(false);
        }
        bump!(self);
        if !is!(self, IdentRef) {
            return Ok(false);
        }
        bump!(self);

        Ok(is!(self, "in"))
    }

    /// `tsParseMappedType`
    fn parse_ts_mapped_type(&mut self) -> PResult<TsMappedType> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);
        expect!(self, '{');
        let mut readonly = None;
        if is_one_of!(self, '+', '-') {
            readonly = Some(if is!(self, '+') {
                TruePlusMinus::Plus
            } else {
                TruePlusMinus::Minus
            });
            bump!(self);
            expect!(self, "readonly")
        } else if eat!(self, "readonly") {
            readonly = Some(TruePlusMinus::True);
        }

        expect!(self, '[');
        let type_param = parse_ts_mapped_type_param(self)?;
        let name_type = if eat!(self, "as") {
            Some(self.parse_ts_type()?)
        } else {
            None
        };
        expect!(self, ']');

        let mut optional = None;
        if is_one_of!(self, '+', '-') {
            optional = Some(if is!(self, '+') {
                TruePlusMinus::Plus
            } else {
                TruePlusMinus::Minus
            });
            bump!(self); // +, -
            expect!(self, '?');
        } else if eat!(self, '?') {
            optional = Some(TruePlusMinus::True);
        }

        let type_ann = try_parse_ts_type(self)?;
        expect!(self, ';');
        expect!(self, '}');

        Ok(TsMappedType {
            span: span!(self, start),
            readonly,
            optional,
            type_param,
            name_type,
            type_ann,
        })
    }

    /// `tsParseTupleType`
    fn parse_ts_tuple_type(&mut self) -> PResult<TsTupleType> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);
        let elems = parse_ts_bracketed_list(
            self,
            ParsingContext::TupleElementTypes,
            |p| p.parse_ts_tuple_element_type(),
            /* bracket */ true,
            /* skipFirstToken */ false,
        )?;

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
                    syntax_error!(
                        self,
                        span!(self, start),
                        SyntaxError::TsRequiredAfterOptional
                    )
                }
                _ => {}
            }
        }

        Ok(TsTupleType {
            span: span!(self, start),
            elem_types: elems,
        })
    }

    fn try_parse_ts_tuple_element_name(&mut self) -> Option<Pat> {
        if !cfg!(feature = "typescript") {
            return Default::default();
        }

        try_parse_ts(self, |p| {
            let start = cur_pos!(p);

            let rest = if eat!(p, "...") {
                Some(p.input.prev_span())
            } else {
                None
            };

            let mut ident = parse_ident_name(p).map(Ident::from)?;
            if eat!(p, '?') {
                ident.optional = true;
                ident.span = ident.span.with_hi(p.input.prev_span().hi);
            }
            expect!(p, ':');

            Ok(Some(if let Some(dot3_token) = rest {
                RestPat {
                    span: span!(p, start),
                    dot3_token,
                    arg: ident.into(),
                    type_ann: None,
                }
                .into()
            } else {
                ident.into()
            }))
        })
    }

    /// `tsParseTupleElementType`
    fn parse_ts_tuple_element_type(&mut self) -> PResult<TsTupleElement> {
        debug_assert!(self.input.syntax().typescript());

        // parses `...TsType[]`
        let start = cur_pos!(self);

        let label = self.try_parse_ts_tuple_element_name();

        if eat!(self, "...") {
            let type_ann = self.parse_ts_type()?;
            return Ok(TsTupleElement {
                span: span!(self, start),
                label,
                ty: Box::new(TsType::TsRestType(TsRestType {
                    span: span!(self, start),
                    type_ann,
                })),
            });
        }

        let ty = self.parse_ts_type()?;
        // parses `TsType?`
        if eat!(self, '?') {
            let type_ann = ty;
            return Ok(TsTupleElement {
                span: span!(self, start),
                label,
                ty: Box::new(TsType::TsOptionalType(TsOptionalType {
                    span: span!(self, start),
                    type_ann,
                })),
            });
        }

        Ok(TsTupleElement {
            span: span!(self, start),
            label,
            ty,
        })
    }

    /// `tsParseParenthesizedType`
    fn parse_ts_parenthesized_type(&mut self) -> PResult<TsParenthesizedType> {
        debug_assert!(self.input.syntax().typescript());
        trace_cur!(self, parse_ts_parenthesized_type);

        let start = cur_pos!(self);
        expect!(self, '(');
        let type_ann = self.parse_ts_type()?;
        expect!(self, ')');
        Ok(TsParenthesizedType {
            span: span!(self, start),
            type_ann,
        })
    }

    /// `tsParseFunctionOrConstructorType`
    fn parse_ts_fn_or_constructor_type(
        &mut self,
        is_fn_type: bool,
    ) -> PResult<TsFnOrConstructorType> {
        trace_cur!(self, parse_ts_fn_or_constructor_type);

        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);
        let is_abstract = if !is_fn_type {
            eat!(self, "abstract")
        } else {
            false
        };
        if !is_fn_type {
            expect!(self, "new");
        }

        // ----- inlined `self.tsFillSignature(tt.arrow, node)`
        let type_params = try_parse_ts_type_params(self, false, true)?;
        expect!(self, '(');
        let params = self.parse_ts_binding_list_for_signature()?;
        let type_ann = parse_ts_type_or_type_predicate_ann(self, &Token::Arrow)?;
        // ----- end

        Ok(if is_fn_type {
            TsFnOrConstructorType::TsFnType(TsFnType {
                span: span!(self, start),
                type_params,
                params,
                type_ann,
            })
        } else {
            TsFnOrConstructorType::TsConstructorType(TsConstructorType {
                span: span!(self, start),
                type_params,
                params,
                type_ann,
                is_abstract,
            })
        })
    }

    /// `tsParseBindingListForSignature`
    ///
    /// Eats ')` at the end but does not eat `(` at start.
    fn parse_ts_binding_list_for_signature(&mut self) -> PResult<Vec<TsFnParam>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        debug_assert!(self.input.syntax().typescript());

        let params = self.parse_formal_params()?;
        let mut list = Vec::with_capacity(4);

        for param in params {
            let item = match param.pat {
                Pat::Ident(pat) => TsFnParam::Ident(pat),
                Pat::Array(pat) => TsFnParam::Array(pat),
                Pat::Object(pat) => TsFnParam::Object(pat),
                Pat::Rest(pat) => TsFnParam::Rest(pat),
                _ => unexpected!(
                    self,
                    "an identifier, [ for an array pattern, { for an object patter or ... for a \
                     rest pattern"
                ),
            };
            list.push(item);
        }
        expect!(self, ')');
        Ok(list)
    }

    /// `tsParseNonArrayType`
    fn parse_ts_non_array_type(&mut self) -> PResult<Box<TsType>> {
        if !cfg!(feature = "typescript") {
            unreachable!()
        }
        trace_cur!(self, parse_ts_non_array_type);
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);

        match cur!(self, true) {
            Token::Ident
            | Token::Void
            | Token::Yield
            | Token::Null
            | Token::Await
            | Token::Break => {
                let kind = if is!(self, "void") {
                    Some(TsKeywordTypeKind::TsVoidKeyword)
                } else if is!(self, "null") {
                    Some(TsKeywordTypeKind::TsNullKeyword)
                } else if is!(self, "any") {
                    Some(TsKeywordTypeKind::TsAnyKeyword)
                } else if is!(self, "boolean") {
                    Some(TsKeywordTypeKind::TsBooleanKeyword)
                } else if is!(self, "bigint") {
                    Some(TsKeywordTypeKind::TsBigIntKeyword)
                } else if is!(self, "never") {
                    Some(TsKeywordTypeKind::TsNeverKeyword)
                } else if is!(self, "number") {
                    Some(TsKeywordTypeKind::TsNumberKeyword)
                } else if is!(self, "object") {
                    Some(TsKeywordTypeKind::TsObjectKeyword)
                } else if is!(self, "string") {
                    Some(TsKeywordTypeKind::TsStringKeyword)
                } else if is!(self, "symbol") {
                    Some(TsKeywordTypeKind::TsSymbolKeyword)
                } else if is!(self, "unknown") {
                    Some(TsKeywordTypeKind::TsUnknownKeyword)
                } else if is!(self, "undefined") {
                    Some(TsKeywordTypeKind::TsUndefinedKeyword)
                } else if is!(self, "intrinsic") {
                    Some(TsKeywordTypeKind::TsIntrinsicKeyword)
                } else {
                    None
                };

                match kind {
                    Some(kind) if !peeked_is!(self, '.') => {
                        bump!(self);
                        return Ok(Box::new(TsType::TsKeywordType(TsKeywordType {
                            span: span!(self, start),
                            kind,
                        })));
                    }
                    _ => {
                        return parse_ts_type_ref(self).map(TsType::from).map(Box::new);
                    }
                }
            }
            t if t.is_known_ident() => {
                if is!(self, "asserts") && peeked_is!(self, "this") {
                    bump!(self);
                    let this_keyword = parse_ts_this_type_node(self)?;
                    return parse_ts_this_type_predicate(self, start, true, this_keyword)
                        .map(TsType::from)
                        .map(Box::new);
                }

                let kind = if is!(self, "void") {
                    Some(TsKeywordTypeKind::TsVoidKeyword)
                } else if is!(self, "null") {
                    Some(TsKeywordTypeKind::TsNullKeyword)
                } else if is!(self, "any") {
                    Some(TsKeywordTypeKind::TsAnyKeyword)
                } else if is!(self, "boolean") {
                    Some(TsKeywordTypeKind::TsBooleanKeyword)
                } else if is!(self, "bigint") {
                    Some(TsKeywordTypeKind::TsBigIntKeyword)
                } else if is!(self, "never") {
                    Some(TsKeywordTypeKind::TsNeverKeyword)
                } else if is!(self, "number") {
                    Some(TsKeywordTypeKind::TsNumberKeyword)
                } else if is!(self, "object") {
                    Some(TsKeywordTypeKind::TsObjectKeyword)
                } else if is!(self, "string") {
                    Some(TsKeywordTypeKind::TsStringKeyword)
                } else if is!(self, "symbol") {
                    Some(TsKeywordTypeKind::TsSymbolKeyword)
                } else if is!(self, "unknown") {
                    Some(TsKeywordTypeKind::TsUnknownKeyword)
                } else if is!(self, "undefined") {
                    Some(TsKeywordTypeKind::TsUndefinedKeyword)
                } else if is!(self, "intrinsic") {
                    Some(TsKeywordTypeKind::TsIntrinsicKeyword)
                } else {
                    None
                };

                let peeked_is_dot = peeked_is!(self, '.');

                match kind {
                    Some(kind) if !peeked_is_dot => {
                        bump!(self);
                        return Ok(Box::new(TsType::TsKeywordType(TsKeywordType {
                            span: span!(self, start),
                            kind,
                        })));
                    }
                    _ => {
                        return parse_ts_type_ref(self).map(TsType::from).map(Box::new);
                    }
                }
            }
            Token::BigInt
            | Token::Str
            | Token::Num
            | token!("true")
            | token!("false")
            | token!('`') => {
                return parse_ts_lit_type_node(self).map(TsType::from).map(Box::new);
            }
            token!('-') => {
                let start = cur_pos!(self);

                bump!(self);

                if !matches!(cur!(self, true), Token::Num | Token::BigInt) {
                    unexpected!(self, "numeric literal or bigint literal")
                }

                let lit = parse_lit(self)?;
                let lit = match lit {
                    Lit::Num(Number { span, value, raw }) => {
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
                    span: span!(self, start),
                    lit,
                })));
            }

            token!("import") => {
                return self.parse_ts_import_type().map(TsType::from).map(Box::new);
            }

            token!("this") => {
                let start = cur_pos!(self);
                let this_keyword = parse_ts_this_type_node(self)?;
                if !self.input.had_line_break_before_cur() && is!(self, "is") {
                    return parse_ts_this_type_predicate(self, start, false, this_keyword)
                        .map(TsType::from)
                        .map(Box::new);
                } else {
                    return Ok(Box::new(TsType::TsThisType(this_keyword)));
                }
            }
            token!("typeof") => {
                return self.parse_ts_type_query().map(TsType::from).map(Box::new);
            }

            token!('{') => {
                return if ts_look_ahead(self, |p| p.is_ts_start_of_mapped_type())? {
                    self.parse_ts_mapped_type().map(TsType::from).map(Box::new)
                } else {
                    self.parse_ts_type_lit().map(TsType::from).map(Box::new)
                };
            }
            token!('[') => {
                return self.parse_ts_tuple_type().map(TsType::from).map(Box::new);
            }
            token!('(') => {
                return self
                    .parse_ts_parenthesized_type()
                    .map(TsType::from)
                    .map(Box::new);
            }
            _ => {}
        }
        //   switch (self.state.type) {
        //   }

        unexpected!(
            self,
            "an identifier, void, yield, null, await, break, a string literal, a numeric literal, \
             true, false, `, -, import, this, typeof, {, [, ("
        )
    }

    /// `tsParseArrayTypeOrHigher`
    fn parse_ts_array_type_or_higher(&mut self, readonly: bool) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_array_type_or_higher);
        debug_assert!(self.input.syntax().typescript());

        let mut ty = self.parse_ts_non_array_type()?;

        while !self.input.had_line_break_before_cur() && eat!(self, '[') {
            if eat!(self, ']') {
                ty = Box::new(TsType::TsArrayType(TsArrayType {
                    span: span!(self, ty.span_lo()),
                    elem_type: ty,
                }));
            } else {
                let index_type = self.parse_ts_type()?;
                expect!(self, ']');
                ty = Box::new(TsType::TsIndexedAccessType(TsIndexedAccessType {
                    span: span!(self, ty.span_lo()),
                    readonly,
                    obj_type: ty,
                    index_type,
                }))
            }
        }

        Ok(ty)
    }

    /// `tsParseTypeOperator`
    fn parse_ts_type_operator(&mut self, op: TsTypeOperatorOp) -> PResult<TsTypeOperator> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);
        match op {
            TsTypeOperatorOp::Unique => expect!(self, "unique"),
            TsTypeOperatorOp::KeyOf => expect!(self, "keyof"),
            TsTypeOperatorOp::ReadOnly => expect!(self, "readonly"),
        }

        let type_ann = self.parse_ts_type_operator_or_higher()?;
        Ok(TsTypeOperator {
            span: span!(self, start),
            op,
            type_ann,
        })
    }

    /// `tsParseInferType`
    fn parse_ts_infer_type(&mut self) -> PResult<TsInferType> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);
        expect!(self, "infer");
        let type_param_name = parse_ident_name(self)?;
        let constraint = try_parse_ts(self, |p| {
            expect!(p, "extends");
            let constraint = p.parse_ts_non_conditional_type();
            if p.ctx().contains(Context::DisallowConditionalTypes) || !is!(p, '?') {
                constraint.map(Some)
            } else {
                Ok(None)
            }
        });
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
            span: span!(self, start),
            type_param,
        })
    }

    /// `tsParseTypeOperatorOrHigher`
    fn parse_ts_type_operator_or_higher(&mut self) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_type_operator_or_higher);
        debug_assert!(self.input.syntax().typescript());

        let operator = if is!(self, "keyof") {
            Some(TsTypeOperatorOp::KeyOf)
        } else if is!(self, "unique") {
            Some(TsTypeOperatorOp::Unique)
        } else if is!(self, "readonly") {
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

                if is!(self, "infer") {
                    self.parse_ts_infer_type().map(TsType::from).map(Box::new)
                } else {
                    let readonly = parse_ts_modifier(self, &["readonly"], false)?.is_some();
                    self.parse_ts_array_type_or_higher(readonly)
                }
            }
        }
    }

    /// `tsParseExpressionStatement`
    pub(super) fn parse_ts_expr_stmt(
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
                if is!(self, '{') {
                    let global = true;
                    let id = TsModuleName::Ident(expr);
                    let body = self
                        .parse_ts_module_block()
                        .map(TsNamespaceBody::from)
                        .map(Some)?;
                    Ok(Some(
                        TsModuleDecl {
                            span: span!(self, start),
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
    pub(super) fn try_parse_ts_declare(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
    ) -> PResult<Option<Decl>> {
        if !self.syntax().typescript() {
            return Ok(None);
        }

        if self.ctx().contains(Context::InDeclare)
            && matches!(
                self.syntax(),
                Syntax::Typescript(TsSyntax { dts: false, .. })
            )
        {
            let span_of_declare = span!(self, start);
            self.emit_err(span_of_declare, SyntaxError::TS1038);
        }

        let declare_start = start;
        let ctx = self.ctx() | Context::InDeclare;
        self.with_ctx(ctx).parse_with(|p| {
            if is!(p, "function") {
                return p
                    .parse_fn_decl(decorators)
                    .map(|decl| match decl {
                        Decl::Fn(f) => FnDecl {
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
                        .into(),
                        _ => decl,
                    })
                    .map(Some);
            }

            if is!(p, "class") {
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

            if is!(p, "const") && peeked_is!(p, "enum") {
                assert_and_bump!(p, "const");
                let _ = cur!(p, true);
                assert_and_bump!(p, "enum");

                return parse_ts_enum_decl(p, start, /* is_const */ true)
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
            if is_one_of!(p, "const", "var", "let") {
                return p
                    .parse_var_stmt(false)
                    .map(|decl| VarDecl {
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

            if is!(p, "global") {
                return p
                    .parse_ts_ambient_external_module_decl(start)
                    .map(Decl::from)
                    .map(make_decl_declare)
                    .map(Some);
            } else if is!(p, IdentName) {
                let t = *cur!(p, true);
                let value = t.as_word_atom(p.input.get_token_value()).unwrap();
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
    pub(super) fn try_parse_ts_export_decl(
        &mut self,
        decorators: Vec<Decorator>,
        value: Atom,
    ) -> Option<Decl> {
        if !cfg!(feature = "typescript") {
            return None;
        }

        try_parse_ts(self, |p| {
            let start = cur_pos!(p);
            let opt = p.parse_ts_decl(start, decorators, value, true)?;
            Ok(opt)
        })
    }

    /// Common to tsTryParseDeclare, tsTryParseExportDeclaration, and
    /// tsParseExpressionStatement.
    ///
    /// `tsParseDeclaration`
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
                if next || (is!(self, "class") && !self.input.had_line_break_before_cur()) {
                    if next {
                        bump!(self);
                    }
                    return Ok(Some(self.parse_class_decl(start, start, decorators, true)?));
                }
            }

            "enum" => {
                if next || is!(self, IdentRef) {
                    if next {
                        bump!(self);
                    }
                    return parse_ts_enum_decl(self, start, /* is_const */ false)
                        .map(From::from)
                        .map(Some);
                }
            }

            "interface" => {
                if next || (is!(self, IdentRef)) {
                    if next {
                        bump!(self);
                    }

                    return self
                        .parse_ts_interface_decl(start)
                        .map(From::from)
                        .map(Some);
                }
            }

            "module" if !self.input.had_line_break_before_cur() => {
                if next {
                    bump!(self);
                }

                if matches!(cur!(self, true), Token::Str) {
                    return self
                        .parse_ts_ambient_external_module_decl(start)
                        .map(From::from)
                        .map(Some);
                } else if next || is!(self, IdentRef) {
                    return self
                        .parse_ts_module_or_ns_decl(start, false)
                        .map(From::from)
                        .map(Some);
                }
            }

            "namespace" => {
                if next || is!(self, IdentRef) {
                    if next {
                        bump!(self);
                    }
                    return self
                        .parse_ts_module_or_ns_decl(start, true)
                        .map(From::from)
                        .map(Some);
                }
            }

            "type" => {
                if next || (!self.input.had_line_break_before_cur() && is!(self, IdentRef)) {
                    if next {
                        bump!(self);
                    }
                    return self
                        .parse_ts_type_alias_decl(start)
                        .map(From::from)
                        .map(Some);
                }
            }

            _ => {}
        }

        Ok(None)
    }

    /// `tsTryParseGenericAsyncArrowFunction`
    pub(super) fn try_parse_ts_generic_async_arrow_fn(
        &mut self,
        start: BytePos,
    ) -> PResult<Option<ArrowExpr>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        let res = if is_one_of!(self, '<', JSXTagStart) {
            try_parse_ts(self, |p| {
                let type_params = parse_ts_type_params(p, false, false)?;
                // Don't use overloaded parseFunctionParams which would look for "<" again.
                expect!(p, '(');
                let params: Vec<Pat> = p
                    .parse_formal_params()?
                    .into_iter()
                    .map(|p| p.pat)
                    .collect();
                expect!(p, ')');
                let return_type = try_parse_ts_type_or_type_predicate_ann(p)?;
                expect!(p, "=>");

                Ok(Some((type_params, params, return_type)))
            })
        } else {
            None
        };

        let (type_params, params, return_type) = match res {
            Some(v) => v,
            None => return Ok(None),
        };

        let ctx = (self.ctx() | Context::InAsync) & !Context::InGenerator;
        self.with_ctx(ctx).parse_with(|p| {
            let is_generator = false;
            let is_async = true;
            let body = p.parse_fn_body(true, false, true, params.is_simple_parameter_list())?;
            Ok(Some(ArrowExpr {
                span: span!(p, start),
                body,
                is_async,
                is_generator,
                type_params: Some(type_params),
                params,
                return_type,
                ..Default::default()
            }))
        })
    }

    /// `tsParseIntersectionTypeOrHigher`
    fn parse_ts_intersection_type_or_higher(&mut self) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_intersection_type_or_higher);

        debug_assert!(self.input.syntax().typescript());

        parse_ts_union_or_intersection_type(
            self,
            UnionOrIntersection::Intersection,
            |p| p.parse_ts_type_operator_or_higher(),
            &Token::Ampersand,
        )
    }

    /// `tsParseUnionTypeOrHigher`
    fn parse_ts_union_type_or_higher(&mut self) -> PResult<Box<TsType>> {
        trace_cur!(self, parse_ts_union_type_or_higher);
        debug_assert!(self.input.syntax().typescript());

        parse_ts_union_or_intersection_type(
            self,
            UnionOrIntersection::Union,
            |p| p.parse_ts_intersection_type_or_higher(),
            &Token::Pipe,
        )
    }
}

#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP;
    use swc_ecma_ast::*;
    use swc_ecma_visit::assert_eq_ignore_span;

    use crate::{test_parser, Syntax};

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
                    id: Ident::new_no_ctxt("test".into(), DUMMY_SP),
                    type_params: None,
                    type_ann: Box::new(TsType::TsLitType(TsLitType {
                        span: DUMMY_SP,
                        lit: TsLit::Number(Number {
                            span: DUMMY_SP,
                            value: -1.0,
                            raw: Some("-1".into()),
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
                        name: Pat::Ident(Ident::new_no_ctxt("t".into(), DUMMY_SP).into()),
                        init: Some(Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!(unary, "-"),
                            arg: Box::new(Expr::Lit(Lit::Num(Number {
                                span: DUMMY_SP,
                                value: 1.0,
                                raw: Some("1".into()),
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
}
