use super::*;
use crate::lexer::TokenContexts;
use either::Either;
use smallvec::smallvec;
use swc_atoms::js_word;
use swc_common::{Spanned, SyntaxContext};

#[parser]
impl<'a, I: Tokens> Parser<'a, I> {
    /// `tsNextTokenCanFollowModifier`
    fn ts_next_token_can_follow_modifier(&mut self) -> PResult<'a, bool> {
        debug_assert!(self.input.syntax().typescript());

        // Note: TypeScript's implementation is much more complicated because
        // more things are considered modifiers there.
        // This implementation only handles modifiers not handled by @babel/parser
        // itself. And "static". TODO: Would be nice to avoid lookahead. Want a
        // hasLineBreakUpNext() method...
        bump!();
        Ok(!self.input.had_line_break_before_cur()
            && !is!('(')
            && !is!(')')
            && !is!(':')
            && !is!('=')
            && !is!('?'))
    }

    /// Parses a modifier matching one the given modifier names.
    ///
    /// `tsParseModifier`
    pub(super) fn parse_ts_modifier(
        &mut self,
        allowed_modifiers: &[&'static str],
    ) -> PResult<'a, Option<&'static str>> {
        if !self.input.syntax().typescript() {
            return Ok(None);
        }

        let pos = {
            let modifier = match *cur!(true)? {
                Token::Word(Word::Ident(ref w)) => w,
                _ => return Ok(None),
            };

            allowed_modifiers.iter().position(|s| **s == **modifier)
        };

        if let Some(pos) = pos {
            if self.try_parse_ts_bool(|p| p.ts_next_token_can_follow_modifier().map(Some))? {
                return Ok(Some(allowed_modifiers[pos]));
            }
        }

        Ok(None)
    }

    /// `tsIsListTerminator`

    fn is_ts_list_terminator(&mut self, kind: ParsingContext) -> PResult<'a, bool> {
        debug_assert!(self.input.syntax().typescript());

        Ok(match kind {
            ParsingContext::EnumMembers | ParsingContext::TypeMembers => is!('}'),
            ParsingContext::HeritageClauseElement { .. } => {
                is!('{') || is!("implements") || is!("extends")
            }
            ParsingContext::TupleElementTypes => is!(']'),
            ParsingContext::TypeParametersOrArguments => is!('>'),
        })
    }

    /// `tsParseList`
    fn parse_ts_list<T, F>(
        &mut self,
        kind: ParsingContext,
        mut parse_element: F,
    ) -> PResult<'a, Vec<T>>
    where
        F: FnMut(&mut Self) -> PResult<'a, T>,
    {
        debug_assert!(self.input.syntax().typescript());

        let mut buf = vec![];
        while !self.is_ts_list_terminator(kind)? {
            // Skipping "parseListElement" from the TS source since that's just for error
            // handling.
            buf.push(parse_element(self)?);
        }
        Ok(buf)
    }

    /// `tsParseDelimitedList`
    fn parse_ts_delimited_list<T, F>(
        &mut self,
        kind: ParsingContext,
        mut parse_element: F,
    ) -> PResult<'a, Vec<T>>
    where
        F: FnMut(&mut Self) -> PResult<'a, T>,
    {
        self.parse_ts_delimited_list_inner(kind, |p| {
            let start = p.input.cur_pos();

            Ok((start, parse_element(p)?))
        })
    }

    /// `tsParseDelimitedList`
    fn parse_ts_delimited_list_inner<T, F>(
        &mut self,
        kind: ParsingContext,
        mut parse_element: F,
    ) -> PResult<'a, Vec<T>>
    where
        F: FnMut(&mut Self) -> PResult<'a, (BytePos, T)>,
    {
        debug_assert!(self.input.syntax().typescript());

        let mut buf = vec![];

        loop {
            if self.is_ts_list_terminator(kind)? {
                break;
            }
            let (start, element) = parse_element(self)?;
            buf.push(element);

            if eat!(',') {
                continue;
            }

            if self.is_ts_list_terminator(kind)? {
                break;
            }

            match kind {
                // Recover
                // const enum D {
                //     d = 10
                //     g = 11
                // }
                ParsingContext::EnumMembers => {
                    const TOKEN: &Token = &Token::Comma;
                    let cur = format!("{:?}", cur!(false).ok());
                    self.emit_err(self.input.cur_span(), SyntaxError::Expected(TOKEN, cur));
                    continue;
                }
                _ => {}
            }
            // This will fail with an error about a missing comma
            expect!(',');
        }

        Ok(buf)
    }

    #[allow(clippy::cognitive_complexity)]
    fn parse_ts_bracketed_list<T, F>(
        &mut self,
        kind: ParsingContext,
        parse_element: F,
        bracket: bool,
        skip_first_token: bool,
    ) -> PResult<'a, Vec<T>>
    where
        F: FnMut(&mut Self) -> PResult<'a, T>,
    {
        debug_assert!(self.input.syntax().typescript());

        if !skip_first_token {
            if bracket {
                expect!('[');
            } else {
                expect!('<');
            }
        }

        let result = self.parse_ts_delimited_list(kind, parse_element)?;

        if bracket {
            expect!(']');
        } else {
            expect!('>');
        }

        Ok(result)
    }

    /// `tsParseEntityName`
    fn parse_ts_entity_name(&mut self, allow_reserved_words: bool) -> PResult<'a, TsEntityName> {
        debug_assert!(self.input.syntax().typescript());

        let init = self.parse_ident_name()?;
        match init {
            // Handle
            //
            // var a: void.x
            //            ^
            Ident {
                sym: js_word!("void"),
                ..
            } => {
                let dot_start = cur_pos!();
                let dot_span = span!(dot_start);
                self.emit_err(dot_span, SyntaxError::TS1005)
            }
            _ => {}
        }
        let mut entity = TsEntityName::Ident(init);
        while eat!('.') {
            let dot_start = cur_pos!();
            if !is!('#') && !is!(IdentName) {
                self.emit_err(
                    Span::new(dot_start, dot_start, Default::default()),
                    SyntaxError::TS1003,
                );
                return Ok(entity);
            }

            let left = entity;
            let right = if allow_reserved_words {
                self.parse_ident_name()?
            } else {
                self.parse_ident(false, false)?
            };
            entity = TsEntityName::TsQualifiedName(Box::new(TsQualifiedName { left, right }));
        }

        Ok(entity)
    }

    /// `tsParseTypeReference`
    fn parse_ts_type_ref(&mut self) -> PResult<'a, TsTypeRef> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();

        let has_modifier = self.eat_any_ts_modifier()?;

        let type_name = self.parse_ts_entity_name(/* allow_reserved_words */ true)?;
        let type_params = if !self.input.had_line_break_before_cur() && is!('<') {
            Some(self.parse_ts_type_args()?)
        } else {
            None
        };

        if has_modifier {
            self.emit_err(span!(start), SyntaxError::TS2369);
        }

        Ok(TsTypeRef {
            span: span!(start),
            type_name,
            type_params,
        })
    }

    /// `tsParseThisTypePredicate`
    fn parse_ts_this_type_predicate(
        &mut self,
        start: BytePos,
        has_asserts_keyword: bool,
        lhs: TsThisType,
    ) -> PResult<'a, TsTypePredicate> {
        debug_assert!(self.input.syntax().typescript());

        assert_and_bump!("is");

        let param_name = TsThisTypeOrIdent::TsThisType(lhs);
        let cur_pos = cur_pos!();
        let type_ann = self.parse_ts_type_ann(
            // eat_colon
            false, cur_pos,
        )?;

        Ok(TsTypePredicate {
            span: span!(start),
            asserts: has_asserts_keyword,
            param_name,
            type_ann,
        })
    }

    /// `tsParseThisTypeNode`
    fn parse_ts_this_type_node(&mut self) -> PResult<'a, TsThisType> {
        debug_assert!(self.input.syntax().typescript());

        expect!("this");

        Ok(TsThisType {
            span: self.input.prev_span(),
        })
    }

    /// `tsParseImportType`
    fn parse_ts_import_type(&mut self) -> PResult<'a, TsImportType> {
        let start = cur_pos!();
        assert_and_bump!("import");

        expect!('(');

        let lit = self.parse_lit()?;
        let arg = match lit {
            Lit::Str(arg) => arg,
            _ => {
                self.emit_err(lit.span(), SyntaxError::TS1141);
                Str {
                    span: lit.span(),
                    value: "".into(),
                    has_escape: false,
                }
            }
        };

        expect!(')');

        let qualifier = if eat!('.') {
            self.parse_ts_entity_name(false).map(Some)?
        } else {
            None
        };

        let type_args = if is!('<') {
            self.parse_ts_type_args().map(Some)?
        } else {
            None
        };

        Ok(TsImportType {
            span: span!(start),
            arg,
            qualifier,
            type_args,
        })
    }

    /// `tsParseTypeQuery`
    fn parse_ts_type_query(&mut self) -> PResult<'a, TsTypeQuery> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        expect!("typeof");
        let expr_name = if is!("import") {
            self.parse_ts_import_type().map(From::from)?
        } else {
            self.parse_ts_entity_name(
                // allow_reserved_word
                true,
            )
            .map(From::from)?
        };

        Ok(TsTypeQuery {
            span: span!(start),
            expr_name,
        })
    }

    /// `tsParseTypeParameter`
    fn parse_ts_type_param(&mut self) -> PResult<'a, TsTypeParam> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();

        let name = self.parse_ident_name()?;
        let constraint = self.eat_then_parse_ts_type(&tok!("extends"))?;
        let default = self.eat_then_parse_ts_type(&tok!('='))?;

        Ok(TsTypeParam {
            span: span!(start),
            name,
            constraint,
            default,
        })
    }

    /// `tsParseTypeParameter`
    pub(super) fn parse_ts_type_params(&mut self) -> PResult<'a, TsTypeParamDecl> {
        let start = cur_pos!();

        if !is!('<') && !is!(JSXTagStart) {
            unexpected!()
        }
        bump!(); // '<'

        let params = self.parse_ts_bracketed_list(
            ParsingContext::TypeParametersOrArguments,
            |p| p.parse_ts_type_param(), // bracket
            false,
            // skip_first_token
            true,
        )?;

        Ok(TsTypeParamDecl {
            span: span!(start),
            params,
        })
    }

    /// `tsParseTypeOrTypePredicateAnnotation`
    pub(super) fn parse_ts_type_or_type_predicate_ann(
        &mut self,
        return_token: &'static Token,
    ) -> PResult<'a, TsTypeAnn> {
        debug_assert!(self.input.syntax().typescript());

        self.in_type().parse_with(|p| {
            let return_token_start = cur_pos!();
            if !p.input.eat(return_token) {
                let cur = format!("{:?}", cur!(false).ok());
                let span = p.input.cur_span();
                syntax_error!(span, SyntaxError::Expected(return_token, cur))
            }

            let type_pred_start = cur_pos!();
            let type_pred_asserts = is!("asserts") && peeked_is!(IdentRef);
            if type_pred_asserts {
                assert_and_bump!("asserts");
                cur!(false)?;
            }

            let type_pred_var = if is!(IdentRef) && peeked_is!("is") {
                p.try_parse_ts(|p| p.parse_ts_type_predicate_prefix())
            } else {
                None
            };

            let type_pred_var = match type_pred_var {
                Some(v) => v.into(),
                None => {
                    return p.parse_ts_type_ann(
                        // eat_colon
                        false,
                        return_token_start,
                    );
                }
            };

            let pos = cur_pos!();
            let type_ann = p.parse_ts_type_ann(
                // eat_colon
                false, pos,
            )?;

            let node = Box::new(TsType::TsTypePredicate(TsTypePredicate {
                span: span!(type_pred_start),
                asserts: type_pred_asserts,
                param_name: type_pred_var,
                type_ann,
            }));

            Ok(TsTypeAnn {
                span: span!(return_token_start),
                type_ann: node,
            })
        })
    }

    fn parse_ts_type_predicate_prefix(&mut self) -> PResult<'a, Option<Ident>> {
        debug_assert!(self.input.syntax().typescript());

        let id = self.parse_ident_name()?;

        if is!("is") && !self.input.had_line_break_before_cur() {
            assert_and_bump!("is");
            return Ok(Some(id));
        }

        Ok(None)
    }

    /// `tsTryParse`
    fn try_parse_ts_bool<F>(&mut self, op: F) -> PResult<'a, bool>
    where
        F: FnOnce(&mut Self) -> PResult<'a, Option<bool>>,
    {
        if !self.input.syntax().typescript() {
            return Ok(false);
        }
        let mut cloned = self.clone();
        cloned.emit_err = false;
        let res = op(&mut cloned);
        match res {
            Ok(Some(res)) if res => {
                *self = cloned;
                self.emit_err = true;
                Ok(res)
            }
            Err(mut err) => {
                err.cancel();
                Ok(false)
            }
            _ => Ok(false),
        }
    }

    /// `tsTryParse`
    pub(super) fn try_parse_ts<T, F>(&mut self, op: F) -> Option<T>
    where
        F: FnOnce(&mut Self) -> PResult<'a, Option<T>>,
    {
        if !self.input.syntax().typescript() {
            return None;
        }
        let mut cloned = self.clone();
        cloned.emit_err = false;
        let res = op(&mut cloned);
        match res {
            Ok(Some(res)) => {
                *self = cloned;
                self.emit_err = true;
                Some(res)
            }
            Ok(None) => None,
            Err(mut err) => {
                err.cancel();
                None
            }
        }
    }

    pub(super) fn parse_ts_type_ann(
        &mut self,
        eat_colon: bool,
        start: BytePos,
    ) -> PResult<'a, TsTypeAnn> {
        debug_assert!(self.input.syntax().typescript());

        self.in_type().parse_with(|p| {
            if eat_colon {
                assert_and_bump!(':');
            }

            let type_ann = p.parse_ts_type()?;

            Ok(TsTypeAnn {
                span: span!(start),
                type_ann,
            })
        })
    }

    /// `tsEatThenParseType`
    fn eat_then_parse_ts_type(
        &mut self,
        token_to_eat: &'static Token,
    ) -> PResult<'a, Option<Box<TsType>>> {
        self.in_type().parse_with(|p| {
            if !p.input.eat(token_to_eat) {
                return Ok(None);
            }

            p.parse_ts_type().map(Some)
        })
    }

    /// `tsExpectThenParseType`
    fn expect_then_parse_ts_type(&mut self, token: &'static Token) -> PResult<'a, Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        self.in_type().parse_with(|p| {
            if !p.input.eat(token) {
                unexpected!()
            }

            p.parse_ts_type()
        })
    }

    /// `tsNextThenParseType`
    pub(super) fn next_then_parse_ts_type(&mut self) -> PResult<'a, Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        self.in_type().parse_with(|p| {
            bump!();

            p.parse_ts_type()
        })
    }

    /// `tsParseEnumMember`
    fn parse_ts_enum_member(&mut self) -> PResult<'a, TsEnumMember> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        // Computed property names are grammar errors in an enum, so accept just string
        // literal or identifier.
        let id = match *cur!(true)? {
            Token::Str { .. } => self.parse_lit().map(|lit| match lit {
                Lit::Str(s) => TsEnumMemberId::Str(s),
                _ => unreachable!(),
            })?,
            Token::Num(v) => {
                bump!();
                let span = span!(start);
                // Recover from error
                self.emit_err(span, SyntaxError::TS2452);

                TsEnumMemberId::Str(Str {
                    span,
                    value: v.to_string().into(),
                    has_escape: false,
                })
            }
            Token::LBracket => {
                assert_and_bump!('[');
                let _ = self.parse_expr()?;

                self.emit_err(span!(start), SyntaxError::TS1164);

                expect!(']');

                TsEnumMemberId::Ident(Ident::new(js_word!(""), span!(start)))
            }
            _ => self.parse_ident_name().map(TsEnumMemberId::from)?,
        };

        let init = if eat!('=') {
            Some(self.parse_assignment_expr()?)
        } else if is!(',') || is!('}') {
            None
        } else {
            let start = cur_pos!();
            bump!();
            store!(',');
            self.emit_err(
                Span::new(start, start, SyntaxContext::empty()),
                SyntaxError::TS1005,
            );
            None
        };

        Ok(TsEnumMember {
            span: span!(start),
            id,
            init,
        })
    }

    /// `tsParseEnumDeclaration`
    pub(super) fn parse_ts_enum_decl(
        &mut self,
        start: BytePos,
        is_const: bool,
    ) -> PResult<'a, TsEnumDecl> {
        debug_assert!(self.input.syntax().typescript());

        let id = self.parse_ident_name()?;
        expect!('{');
        let members = self
            .parse_ts_delimited_list(ParsingContext::EnumMembers, |p| p.parse_ts_enum_member())?;
        expect!('}');

        Ok(TsEnumDecl {
            span: span!(start),
            // TODO(kdy1): Is this correct?
            declare: self.ctx().in_declare,
            is_const,
            id,
            members,
        })
    }

    /// `tsParseModuleBlock`
    fn parse_ts_module_block(&mut self) -> PResult<'a, TsModuleBlock> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        expect!('{');
        // Inside of a module block is considered "top-level", meaning it can have
        // imports and exports.
        let body = self.parse_block_body(
            /* directives */ false,
            /* topLevel */ true,
            /* end */ Some(&tok!('}')),
        )?;

        Ok(TsModuleBlock {
            span: span!(start),
            body,
        })
    }

    /// `tsParseModuleOrNamespaceDeclaration`
    fn parse_ts_module_or_ns_decl(&mut self, start: BytePos) -> PResult<'a, TsModuleDecl> {
        debug_assert!(self.input.syntax().typescript());

        let id = self.parse_ident_name()?;
        let body: TsNamespaceBody = if eat!('.') {
            let inner_start = cur_pos!();
            let inner = self.parse_ts_module_or_ns_decl(inner_start)?;
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

        Ok(TsModuleDecl {
            span: span!(start),
            declare: self.ctx().in_declare,
            id: TsModuleName::Ident(id),
            body: Some(body),
            global: false,
        })
    }

    /// `tsParseAmbientExternalModuleDeclaration`
    fn parse_ts_ambient_external_module_decl(
        &mut self,
        start: BytePos,
    ) -> PResult<'a, TsModuleDecl> {
        debug_assert!(self.input.syntax().typescript());

        let (global, id) = if is!("global") {
            let id = self.parse_ident_name()?;
            (true, TsModuleName::Ident(id))
        } else if match *cur!(true)? {
            Token::Str { .. } => true,
            _ => false,
        } {
            let id = self.parse_lit().map(|lit| match lit {
                Lit::Str(s) => TsModuleName::Str(s),
                _ => unreachable!(),
            })?;
            (false, id)
        } else {
            unexpected!();
        };

        let body = if is!('{') {
            Some(self.parse_ts_module_block().map(TsNamespaceBody::from)?)
        } else {
            expect!(';');
            None
        };

        Ok(TsModuleDecl {
            span: span!(start),
            declare: self.ctx().in_declare,
            id,
            global,
            body,
        })
    }

    pub fn parse_type(&mut self) -> PResult<'a, Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        self.in_type().parse_ts_type()
    }

    /// Be sure to be in a type context before calling self.
    ///
    /// `tsParseType`
    pub(super) fn parse_ts_type(&mut self) -> PResult<'a, Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        // Need to set `state.inType` so that we don't parse JSX in a type context.
        debug_assert!(self.ctx().in_type);

        let start = cur_pos!();

        let ty = self.parse_ts_non_conditional_type()?;
        if self.input.had_line_break_before_cur() || !eat!("extends") {
            return Ok(ty);
        }

        let check_type = ty;
        let extends_type = self.parse_ts_non_conditional_type()?;

        expect!('?');

        let true_type = self.parse_ts_type()?;

        expect!(':');

        let false_type = self.parse_ts_type()?;

        Ok(Box::new(TsType::TsConditionalType(TsConditionalType {
            span: span!(start),
            check_type,
            extends_type,
            true_type,
            false_type,
        })))
    }

    /// `tsParseNonConditionalType`
    fn parse_ts_non_conditional_type(&mut self) -> PResult<'a, Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        if self.is_ts_start_of_fn_type()? {
            return self
                .parse_ts_fn_or_constructor_type(true)
                .map(TsType::from)
                .map(Box::new);
        }
        if is!("new") {
            // As in `new () => Date`
            return self
                .parse_ts_fn_or_constructor_type(false)
                .map(TsType::from)
                .map(Box::new);
        }

        self.parse_ts_union_type_or_higher()
    }

    fn is_ts_start_of_fn_type(&mut self) -> PResult<'a, bool> {
        debug_assert!(self.input.syntax().typescript());

        if is!('<') {
            return Ok(true);
        }

        Ok(is!('(') && self.ts_look_ahead(|p| p.is_ts_unambiguously_start_of_fn_type())?)
    }

    /// `tsParseTypeAssertion`
    pub(super) fn parse_ts_type_assertion(
        &mut self,
        start: BytePos,
    ) -> PResult<'a, TsTypeAssertion> {
        debug_assert!(self.input.syntax().typescript());

        // Not actually necessary to set state.inType because we never reach here if JSX
        // plugin is enabled, but need `tsInType` to satisfy the assertion in
        // `tsParseType`.
        let type_ann = self.in_type().parse_with(|p| p.parse_ts_type())?;
        expect!('>');
        let expr = self.parse_unary_expr()?;
        Ok(TsTypeAssertion {
            span: span!(start),
            type_ann,
            expr,
        })
    }

    /// `tsParseHeritageClause`
    pub(super) fn parse_ts_heritage_clause(&mut self) -> PResult<'a, Vec<TsExprWithTypeArgs>> {
        debug_assert!(self.input.syntax().typescript());

        self.parse_ts_delimited_list(ParsingContext::HeritageClauseElement, |p| {
            p.parse_expr_with_type_args()
        })
    }

    /// `tsParseExpressionWithTypeArguments`
    fn parse_expr_with_type_args(&mut self) -> PResult<'a, TsExprWithTypeArgs> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        // Note: TS uses parseLeftHandSideExpressionOrHigher,
        // then has grammar errors later if it's not an EntityName.

        let expr = self.parse_ts_entity_name(/* allow_reserved_words */ false)?;
        let type_args = if is!('<') {
            Some(self.parse_ts_type_args()?)
        } else {
            None
        };

        Ok(TsExprWithTypeArgs {
            span: span!(start),
            expr,
            type_args,
        })
    }
    /// `tsParseInterfaceDeclaration`
    pub(super) fn parse_ts_interface_decl(
        &mut self,
        start: BytePos,
    ) -> PResult<'a, TsInterfaceDecl> {
        debug_assert!(self.input.syntax().typescript());

        let id = self.parse_ident_name()?;
        match id.sym {
            js_word!("string")
            | js_word!("null")
            | js_word!("number")
            | js_word!("object")
            | js_word!("any")
            | js_word!("unknown")
            | js_word!("boolean")
            | js_word!("bigint")
            | js_word!("symbol")
            | js_word!("void")
            | js_word!("never") => {
                self.emit_err(id.span, SyntaxError::TS2427);
            }
            _ => {}
        }
        let type_params = self.try_parse_ts_type_params()?;

        let extends = if eat!("extends") {
            self.parse_ts_heritage_clause()?
        } else {
            vec![]
        };

        // Recover from
        //
        //     interface I extends A extends B {}
        if is!("extends") {
            self.emit_err(self.input.cur_span(), SyntaxError::TS1172);

            while !eof!() && !is!('{') {
                bump!();
            }
        }

        let body_start = cur_pos!();
        let body = self
            .in_type()
            .parse_with(|p| p.parse_ts_object_type_members())?;
        let body = TsInterfaceBody {
            span: span!(body_start),
            body,
        };
        Ok(TsInterfaceDecl {
            span: span!(start),
            declare: self.ctx().in_declare,
            id,
            type_params,
            extends,
            body,
        })
    }

    /// `tsParseTypeAliasDeclaration`
    fn parse_ts_type_alias_decl(&mut self, start: BytePos) -> PResult<'a, TsTypeAliasDecl> {
        debug_assert!(self.input.syntax().typescript());

        let id = self.parse_ident_name()?;
        let type_params = self.try_parse_ts_type_params()?;
        let type_ann = self.expect_then_parse_ts_type(&tok!('='))?;
        expect!(';');
        Ok(TsTypeAliasDecl {
            declare: self.ctx().in_declare,
            span: span!(start),
            id,
            type_params,
            type_ann,
        })
    }

    /// `tsParseImportEqualsDeclaration`
    pub(super) fn parse_ts_import_equals_decl(
        &mut self,
        start: BytePos,
        is_export: bool,
    ) -> PResult<'a, TsImportEqualsDecl> {
        debug_assert!(self.input.syntax().typescript());

        let id = self.parse_ident_name()?;
        expect!('=');

        let module_ref = self.parse_ts_module_ref()?;
        expect!(';');
        Ok(TsImportEqualsDecl {
            span: span!(start),
            declare: self.ctx().in_declare,
            id,
            is_export,
            module_ref,
        })
    }

    /// `tsIsExternalModuleReference`
    fn is_ts_external_module_ref(&mut self) -> PResult<'a, bool> {
        debug_assert!(self.input.syntax().typescript());

        Ok(is!("require") && peeked_is!('('))
    }

    /// `tsParseModuleReference`
    fn parse_ts_module_ref(&mut self) -> PResult<'a, TsModuleRef> {
        debug_assert!(self.input.syntax().typescript());

        if self.is_ts_external_module_ref()? {
            self.parse_ts_external_module_ref().map(From::from)
        } else {
            self.parse_ts_entity_name(/* allow_reserved_words */ false)
                .map(From::from)
        }
    }

    /// `tsParseExternalModuleReference`
    #[allow(clippy::cognitive_complexity)]
    fn parse_ts_external_module_ref(&mut self) -> PResult<'a, TsExternalModuleRef> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        expect!("require");
        expect!('(');
        match *cur!(true)? {
            Token::Str { .. } => {}
            _ => unexpected!(),
        }
        let expr = match self.parse_lit()? {
            Lit::Str(s) => s,
            _ => unreachable!(),
        };
        expect!(')');
        Ok(TsExternalModuleRef {
            span: span!(start),
            expr,
        })
    }

    pub(super) fn ts_look_ahead<T, F>(&mut self, op: F) -> PResult<'a, T>
    where
        F: FnOnce(&mut Self) -> PResult<'a, T>,
    {
        debug_assert!(self.input.syntax().typescript());

        let mut cloned = self.clone();
        cloned.emit_err = false;
        op(&mut cloned)
    }

    /// `tsIsUnambiguouslyStartOfFunctionType`
    fn is_ts_unambiguously_start_of_fn_type(&mut self) -> PResult<'a, bool> {
        debug_assert!(self.input.syntax().typescript());

        assert_and_bump!('(');
        if is_one_of!(')', "...") {
            // ( )
            // ( ...
            return Ok(true);
        }
        if self.skip_ts_parameter_start()? {
            if is_one_of!(':', ',', '?', '=') {
                // ( xxx :
                // ( xxx ,
                // ( xxx ?
                // ( xxx =
                return Ok(true);
            }
            if eat!(')') && is!("=>") {
                // ( xxx ) =>
                return Ok(true);
            }
        }
        Ok(false)
    }

    /// `tsSkipParameterStart`
    fn skip_ts_parameter_start(&mut self) -> PResult<'a, bool> {
        debug_assert!(self.input.syntax().typescript());

        let _ = self.eat_any_ts_modifier()?;

        if is_one_of!(IdentRef, "this") {
            bump!();
            return Ok(true);
        }

        if is!('{') {
            let mut brace_stack_counter = 1;
            bump!();

            while brace_stack_counter > 0 {
                if is!('{') {
                    brace_stack_counter += 1;
                } else if is!('}') {
                    brace_stack_counter -= 1;
                }
                bump!();
            }
            return Ok(true);
        }

        Ok(false)
    }

    /// `tsParseTypeMemberSemicolon`
    fn parse_ts_type_member_semicolon(&mut self) -> PResult<'a, ()> {
        debug_assert!(self.input.syntax().typescript());

        if !eat!(',') {
            expect!(';');
        }

        Ok(())
    }

    /// `tsParseSignatureMember`
    fn parse_ts_signature_member(
        &mut self,
        kind: SignatureParsingMode,
    ) -> PResult<'a, Either<TsCallSignatureDecl, TsConstructSignatureDecl>> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();

        if kind == SignatureParsingMode::TSConstructSignatureDeclaration {
            expect!("new");
        }

        // ----- inlined self.tsFillSignature(tt.colon, node);
        let type_params = self.try_parse_ts_type_params()?;
        expect!('(');
        let params = self.parse_ts_binding_list_for_signature()?;
        let type_ann = if is!(':') {
            Some(self.parse_ts_type_or_type_predicate_ann(&tok!(':'))?)
        } else {
            None
        };
        // -----

        self.parse_ts_type_member_semicolon()?;

        match kind {
            SignatureParsingMode::TSCallSignatureDeclaration => {
                Ok(Either::Left(TsCallSignatureDecl {
                    span: span!(start),
                    params,
                    type_ann,
                    type_params,
                }))
            }
            SignatureParsingMode::TSConstructSignatureDeclaration => {
                Ok(Either::Right(TsConstructSignatureDecl {
                    span: span!(start),
                    params,
                    type_ann,
                    type_params,
                }))
            }
        }
    }

    /// `tsIsUnambiguouslyIndexSignature`
    fn is_ts_unambiguously_index_signature(&mut self) -> PResult<'a, bool> {
        debug_assert!(self.input.syntax().typescript());

        // Note: babel's comment is wrong
        assert_and_bump!('['); // Skip '['

        // ',' is for error recovery
        Ok(eat!(IdentRef) && is_one_of!(':', ','))
    }

    /// `tsTryParseIndexSignature`
    pub(super) fn try_parse_ts_index_signature(
        &mut self,
        start: BytePos,
        readonly: bool,
    ) -> PResult<'a, Option<TsIndexSignature>> {
        if !(is!('[') && self.ts_look_ahead(|p| p.is_ts_unambiguously_index_signature())?) {
            return Ok(None);
        }

        expect!('[');

        let mut id = self.parse_ident_name()?;

        if eat!(',') {
            self.emit_err(id.span, SyntaxError::TS1096);
        } else {
            expect!(':');
        }

        let cur_pos = cur_pos!();
        id.type_ann = self
            .parse_ts_type_ann(/* eat_colon */ false, cur_pos)
            .map(Some)?;
        expect!(']');
        let params = vec![TsFnParam::Ident(id)];

        let ty = self.try_parse_ts_type_ann()?;
        let type_ann = if let Some(ty) = ty { Some(ty) } else { None };

        self.parse_ts_type_member_semicolon()?;
        Ok(Some(TsIndexSignature {
            span: span!(start),
            readonly,
            params,
            type_ann,
        }))
    }

    /// `tsParsePropertyOrMethodSignature`
    fn parse_ts_property_or_method_signature(
        &mut self,
        start: BytePos,
        readonly: bool,
    ) -> PResult<'a, Either<TsPropertySignature, TsMethodSignature>> {
        debug_assert!(self.input.syntax().typescript());

        // ----- inlined self.parsePropertyName(node);
        let (computed, key) = if eat!('[') {
            let key = self.parse_assignment_expr()?;
            expect!(']');
            (true, key)
        } else {
            let ctx = Context {
                in_property_name: true,
                ..self.ctx()
            };
            self.with_ctx(ctx).parse_with(|p| {
                // We check if it's valid for it to be a private name when we push it.
                let key = match *cur!(true)? {
                    Token::Num(..) | Token::Str { .. } => p.parse_new_expr(),
                    _ => p.parse_maybe_private_name().map(|e| match e {
                        Either::Left(_) => unreachable!(
                            "private name inside parse_ts_property_or_method_signature"
                        ),
                        Either::Right(e) => Box::new(Expr::Ident(e)),
                    }),
                };

                key.map(|key| (false, key))
            })?
        };
        // -----

        let optional = eat!('?');

        if !readonly && is_one_of!('(', '<') {
            let type_params = self.try_parse_ts_type_params()?;
            expect!('(');
            let params = self.parse_ts_binding_list_for_signature()?;
            let type_ann = if is!(':') {
                self.parse_ts_type_or_type_predicate_ann(&tok!(':'))
                    .map(Some)?
            } else {
                None
            };
            // -----

            self.parse_ts_type_member_semicolon()?;
            Ok(Either::Right(TsMethodSignature {
                span: span!(start),
                computed,
                readonly,
                key,
                optional,
                type_params,
                params,
                type_ann,
            }))
        } else {
            let type_ann = self.try_parse_ts_type_ann()?;

            self.parse_ts_type_member_semicolon()?;
            Ok(Either::Left(TsPropertySignature {
                span: span!(start),
                computed,
                readonly,
                key,
                optional,
                init: None,
                type_params: None,
                params: vec![],
                type_ann,
            }))
        }
    }

    /// `tsParseTypeMember`
    fn parse_ts_type_member(&mut self) -> PResult<'a, TsTypeElement> {
        debug_assert!(self.input.syntax().typescript());

        fn into_type_elem(
            e: Either<TsCallSignatureDecl, TsConstructSignatureDecl>,
        ) -> TsTypeElement {
            match e {
                Either::Left(e) => e.into(),
                Either::Right(e) => e.into(),
            }
        }
        if is_one_of!('(', '<') {
            return self
                .parse_ts_signature_member(SignatureParsingMode::TSCallSignatureDeclaration)
                .map(into_type_elem);
        }
        if is!("new") && self.ts_look_ahead(|p| p.is_ts_start_of_construct_signature())? {
            return self
                .parse_ts_signature_member(SignatureParsingMode::TSConstructSignatureDeclaration)
                .map(into_type_elem);
        }
        // Instead of fullStart, we create a node here.
        let start = cur_pos!();
        let readonly = self.parse_ts_modifier(&["readonly"])?.is_some();

        let idx = self.try_parse_ts_index_signature(start, readonly)?;
        if let Some(idx) = idx {
            return Ok(idx.into());
        }

        self.parse_ts_property_or_method_signature(start, readonly)
            .map(|e| match e {
                Either::Left(e) => e.into(),
                Either::Right(e) => e.into(),
            })
    }

    /// `tsIsStartOfConstructSignature`
    fn is_ts_start_of_construct_signature(&mut self) -> PResult<'a, bool> {
        debug_assert!(self.input.syntax().typescript());

        bump!();

        Ok(is!('(') || is!('<'))
    }

    /// `tsParseTypeLiteral`
    fn parse_ts_type_lit(&mut self) -> PResult<'a, TsTypeLit> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        let members = self.parse_ts_object_type_members()?;
        Ok(TsTypeLit {
            span: span!(start),
            members,
        })
    }

    /// `tsParseObjectTypeMembers`
    fn parse_ts_object_type_members(&mut self) -> PResult<'a, Vec<TsTypeElement>> {
        debug_assert!(self.input.syntax().typescript());

        expect!('{');
        let members =
            self.parse_ts_list(ParsingContext::TypeMembers, |p| p.parse_ts_type_member())?;
        expect!('}');
        Ok(members)
    }

    /// `tsIsStartOfMappedType`
    fn is_ts_start_of_mapped_type(&mut self) -> PResult<'a, bool> {
        debug_assert!(self.input.syntax().typescript());

        bump!();
        if eat!('+') || eat!('-') {
            return Ok(is!("readonly"));
        }
        if is!("readonly") {
            bump!();
        }
        if !is!('[') {
            return Ok(false);
        }
        bump!();
        if !is!(IdentRef) {
            return Ok(false);
        }
        bump!();

        Ok(is!("in"))
    }

    /// `tsParseMappedTypeParameter`
    fn parse_ts_mapped_type_param(&mut self) -> PResult<'a, TsTypeParam> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        let name = self.parse_ident_name()?;
        let constraint = Some(self.expect_then_parse_ts_type(&tok!("in"))?);

        Ok(TsTypeParam {
            span: span!(start),
            name,
            constraint,
            default: None,
        })
    }

    /// `tsParseMappedType`
    #[allow(clippy::cognitive_complexity)]
    fn parse_ts_mapped_type(&mut self) -> PResult<'a, TsMappedType> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        expect!('{');
        let mut readonly = None;
        if is_one_of!('+', '-') {
            readonly = Some(if is!('+') {
                TruePlusMinus::Plus
            } else {
                TruePlusMinus::Minus
            });
            bump!();
            expect!("readonly")
        } else if eat!("readonly") {
            readonly = Some(TruePlusMinus::True);
        }

        expect!('[');
        let type_param = self.parse_ts_mapped_type_param()?;
        expect!(']');

        let mut optional = None;
        if is_one_of!('+', '-') {
            optional = Some(if is!('+') {
                TruePlusMinus::Plus
            } else {
                TruePlusMinus::Minus
            });
            bump!(); // +, -
            expect!('?');
        } else if eat!('?') {
            optional = Some(TruePlusMinus::True);
        }

        let type_ann = self.try_parse_ts_type()?;
        expect!(';');
        expect!('}');

        Ok(TsMappedType {
            span: span!(start),
            readonly,
            optional,
            type_param,
            type_ann,
        })
    }

    /// `tsParseTupleType`
    fn parse_ts_tuple_type(&mut self) -> PResult<'a, TsTupleType> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        let elem_types = self.parse_ts_bracketed_list(
            ParsingContext::TupleElementTypes,
            |p| p.parse_ts_tuple_element_type(),
            /* bracket */ true,
            /* skipFirstToken */ false,
        )?;

        // Validate the elementTypes to ensure:
        //   No mandatory elements may follow optional elements
        //   If there's a rest element, it must be at the end of the tuple

        let mut seen_optional_element = false;
        let len = elem_types.len();
        for (i, elem_type) in elem_types.iter().enumerate() {
            match **elem_type {
                TsType::TsRestType(..) => {
                    if i != len - 1 {
                        syntax_error!(span!(start), SyntaxError::TsNonLastRest)
                    }
                }
                TsType::TsOptionalType(..) => {
                    seen_optional_element = true;
                }
                _ if seen_optional_element => {
                    syntax_error!(span!(start), SyntaxError::TsRequiredAfterOptional)
                }
                _ => {}
            }
        }

        Ok(TsTupleType {
            span: span!(start),
            elem_types,
        })
    }

    /// `tsParseTupleElementType`
    fn parse_ts_tuple_element_type(&mut self) -> PResult<'a, Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        // parses `...TsType[]`
        let start = cur_pos!();

        if eat!("...") {
            let type_ann = self.parse_ts_type()?;
            return Ok(Box::new(TsType::TsRestType(TsRestType {
                span: span!(start),
                type_ann,
            })));
        }

        let ty = self.parse_ts_type()?;
        // parses `TsType?`
        if eat!('?') {
            let type_ann = ty;
            return Ok(Box::new(TsType::TsOptionalType(TsOptionalType {
                span: span!(start),
                type_ann,
            })));
        }

        Ok(ty)
    }

    /// `tsParseParenthesizedType`
    fn parse_ts_parenthesized_type(&mut self) -> PResult<'a, TsParenthesizedType> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        expect!('(');
        let type_ann = self.parse_ts_type()?;
        expect!(')');
        Ok(TsParenthesizedType {
            span: span!(start),
            type_ann,
        })
    }

    /// `tsParseFunctionOrConstructorType`
    fn parse_ts_fn_or_constructor_type(
        &mut self,
        is_fn_type: bool,
    ) -> PResult<'a, TsFnOrConstructorType> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        if !is_fn_type {
            expect!("new");
        }

        // ----- inlined `self.tsFillSignature(tt.arrow, node)`
        let type_params = self.try_parse_ts_type_params()?;
        expect!('(');
        let params = self.parse_ts_binding_list_for_signature()?;
        let type_ann = self.parse_ts_type_or_type_predicate_ann(&tok!("=>"))?;
        // ----- end

        Ok(if is_fn_type {
            TsFnOrConstructorType::TsFnType(TsFnType {
                span: span!(start),
                type_params,
                params,
                type_ann,
            })
        } else {
            TsFnOrConstructorType::TsConstructorType(TsConstructorType {
                span: span!(start),
                type_params,
                params,
                type_ann,
            })
        })
    }

    /// `tsParseLiteralTypeNode`
    fn parse_ts_lit_type_node(&mut self) -> PResult<'a, TsLitType> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();

        let lit = match self.parse_lit()? {
            Lit::Bool(n) => TsLit::Bool(n),
            Lit::Num(n) => TsLit::Number(n),
            Lit::Str(n) => TsLit::Str(n),
            _ => unreachable!(),
        };

        Ok(TsLitType {
            span: span!(start),
            lit,
        })
    }

    /// `tsParseBindingListForSignature`
    fn parse_ts_binding_list_for_signature(&mut self) -> PResult<'a, Vec<TsFnParam>> {
        debug_assert!(self.input.syntax().typescript());

        let pats = self.parse_formal_params()?;
        let mut list = vec![];

        for pat in pats {
            let item = match pat {
                Pat::Ident(pat) => TsFnParam::Ident(pat),
                Pat::Object(pat) => TsFnParam::Object(pat),
                Pat::Rest(pat) => TsFnParam::Rest(pat),
                _ => unexpected!(),
            };
            list.push(item);
        }
        expect!(')');
        Ok(list)
    }

    /// `tsTryParseTypeOrTypePredicateAnnotation`
    ///
    /// Used for parsing return types.
    fn try_parse_ts_type_or_type_predicate_ann(&mut self) -> PResult<'a, Option<TsTypeAnn>> {
        if is!(':') {
            self.parse_ts_type_or_type_predicate_ann(&tok!(':'))
                .map(Some)
        } else {
            Ok(None)
        }
    }

    /// `tsTryParseTypeAnnotation`
    pub(super) fn try_parse_ts_type_ann(&mut self) -> PResult<'a, Option<TsTypeAnn>> {
        if is!(':') {
            let pos = cur_pos!();
            return self.parse_ts_type_ann(/* eat_colon */ true, pos).map(Some);
        }

        Ok(None)
    }

    /// `tsTryParseType`
    fn try_parse_ts_type(&mut self) -> PResult<'a, Option<Box<TsType>>> {
        self.eat_then_parse_ts_type(&tok!(':'))
    }

    /// `tsTryParseTypeParameters`
    pub(super) fn try_parse_ts_type_params(&mut self) -> PResult<'a, Option<TsTypeParamDecl>> {
        if is!('<') {
            return self.parse_ts_type_params().map(Some);
        }
        Ok(None)
    }

    /// `tsParseNonArrayType`
    #[allow(clippy::cognitive_complexity)]
    fn parse_ts_non_array_type(&mut self) -> PResult<'a, Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();

        match *cur!(true)? {
            Token::Word(Word::Ident(..)) | tok!("void") | tok!("null") => {
                if is!("asserts") && peeked_is!("this") {
                    bump!();
                    let this_keyword = self.parse_ts_this_type_node()?;
                    return self
                        .parse_ts_this_type_predicate(start, true, this_keyword)
                        .map(TsType::from)
                        .map(Box::new);
                }

                let kind = if is!("void") {
                    Some(TsKeywordTypeKind::TsVoidKeyword)
                } else if is!("null") {
                    Some(TsKeywordTypeKind::TsNullKeyword)
                } else if is!("any") {
                    Some(TsKeywordTypeKind::TsAnyKeyword)
                } else if is!("boolean") {
                    Some(TsKeywordTypeKind::TsBooleanKeyword)
                } else if is!("bigint") {
                    Some(TsKeywordTypeKind::TsBigIntKeyword)
                } else if is!("never") {
                    Some(TsKeywordTypeKind::TsNeverKeyword)
                } else if is!("number") {
                    Some(TsKeywordTypeKind::TsNumberKeyword)
                } else if is!("object") {
                    Some(TsKeywordTypeKind::TsObjectKeyword)
                } else if is!("string") {
                    Some(TsKeywordTypeKind::TsStringKeyword)
                } else if is!("symbol") {
                    Some(TsKeywordTypeKind::TsSymbolKeyword)
                } else if is!("unknown") {
                    Some(TsKeywordTypeKind::TsUnknownKeyword)
                } else if is!("undefined") {
                    Some(TsKeywordTypeKind::TsUndefinedKeyword)
                } else {
                    None
                };

                let peeked_is_dot = peeked_is!('.');

                match kind {
                    Some(kind) if !peeked_is_dot => {
                        bump!();
                        return Ok(Box::new(TsType::TsKeywordType(TsKeywordType {
                            span: span!(start),
                            kind,
                        })));
                    }
                    _ => {
                        return self.parse_ts_type_ref().map(TsType::from).map(Box::new);
                    }
                }
            }
            Token::Str { .. } | Token::Num { .. } | tok!("true") | tok!("false") => {
                return self
                    .parse_ts_lit_type_node()
                    .map(TsType::from)
                    .map(Box::new);
            }
            tok!('-') => {
                let start = cur_pos!();
                bump!();
                if match *cur!(true)? {
                    Token::Num(..) => false,
                    _ => true,
                } {
                    unexpected!()
                }
                let lit = self.parse_lit()?;
                let lit = match lit {
                    Lit::Num(num) => TsLit::Number(Number {
                        span: num.span,
                        value: -num.value,
                    }),
                    _ => unreachable!(),
                };

                return Ok(Box::new(TsType::TsLitType(TsLitType {
                    span: span!(start),
                    lit,
                })));
            }

            tok!("import") => {
                return self.parse_ts_import_type().map(TsType::from).map(Box::new);
            }

            tok!("this") => {
                let start = cur_pos!();
                let this_keyword = self.parse_ts_this_type_node()?;
                if !self.input.had_line_break_before_cur() && is!("is") {
                    return self
                        .parse_ts_this_type_predicate(start, false, this_keyword)
                        .map(TsType::from)
                        .map(Box::new);
                } else {
                    return Ok(Box::new(TsType::TsThisType(this_keyword)));
                }
            }
            tok!("typeof") => {
                return self.parse_ts_type_query().map(TsType::from).map(Box::new);
            }

            tok!('{') => {
                return if self.ts_look_ahead(|p| p.is_ts_start_of_mapped_type())? {
                    self.parse_ts_mapped_type().map(TsType::from).map(Box::new)
                } else {
                    self.parse_ts_type_lit().map(TsType::from).map(Box::new)
                };
            }
            tok!('[') => {
                return self.parse_ts_tuple_type().map(TsType::from).map(Box::new);
            }
            tok!('(') => {
                return self
                    .parse_ts_parenthesized_type()
                    .map(TsType::from)
                    .map(Box::new);
            }
            _ => {}
        }
        //   switch (self.state.type) {
        //   }

        unexpected!()
    }

    /// `tsParseArrayTypeOrHigher`
    fn parse_ts_array_type_or_higher(&mut self, readonly: bool) -> PResult<'a, Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        let mut ty = self.parse_ts_non_array_type()?;

        while !self.input.had_line_break_before_cur() && eat!('[') {
            if eat!(']') {
                ty = Box::new(TsType::TsArrayType(TsArrayType {
                    span: span!(ty.span().lo()),
                    elem_type: ty,
                }));
            } else {
                let index_type = self.parse_ts_type()?;
                expect!(']');
                ty = Box::new(TsType::TsIndexedAccessType(TsIndexedAccessType {
                    span: span!(ty.span().lo()),
                    readonly,
                    obj_type: ty,
                    index_type,
                }))
            }
        }

        Ok(ty)
    }

    /// `tsParseTypeOperator`
    fn parse_ts_type_operator(&mut self, op: TsTypeOperatorOp) -> PResult<'a, TsTypeOperator> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        match op {
            TsTypeOperatorOp::Unique => expect!("unique"),
            TsTypeOperatorOp::KeyOf => expect!("keyof"),
            TsTypeOperatorOp::ReadOnly => expect!("readonly"),
        }

        let type_ann = self.parse_ts_type_operator_or_higher()?;
        Ok(TsTypeOperator {
            span: span!(start),
            op,
            type_ann,
        })
    }

    /// `tsParseInferType`
    fn parse_ts_infer_type(&mut self) -> PResult<'a, TsInferType> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        expect!("infer");
        let type_param_name = self.parse_ident_name()?;
        let type_param = TsTypeParam {
            span: type_param_name.span(),
            name: type_param_name,
            constraint: None,
            default: None,
        };
        Ok(TsInferType {
            span: span!(start),
            type_param,
        })
    }

    /// `tsParseTypeOperatorOrHigher`
    fn parse_ts_type_operator_or_higher(&mut self) -> PResult<'a, Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        let operator = if is!("keyof") {
            Some(TsTypeOperatorOp::KeyOf)
        } else if is!("unique") {
            Some(TsTypeOperatorOp::Unique)
        } else if is!("readonly") {
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
                if is!("infer") {
                    self.parse_ts_infer_type().map(TsType::from).map(Box::new)
                } else {
                    let readonly = self.parse_ts_modifier(&["readonly"])?.is_some();
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
    ) -> PResult<'a, Option<Decl>> {
        let start = expr.span().lo();

        match &*expr.sym {
            "declare" => {
                let decl = self.try_parse_ts_declare(start, decorators)?;
                if let Some(mut decl) = decl {
                    match decl {
                        Decl::Class(ClassDecl {
                            ref mut declare, ..
                        })
                        | Decl::Fn(FnDecl {
                            ref mut declare, ..
                        })
                        | Decl::Var(VarDecl {
                            ref mut declare, ..
                        })
                        | Decl::TsInterface(TsInterfaceDecl {
                            ref mut declare, ..
                        })
                        | Decl::TsTypeAlias(TsTypeAliasDecl {
                            ref mut declare, ..
                        })
                        | Decl::TsEnum(TsEnumDecl {
                            ref mut declare, ..
                        })
                        | Decl::TsModule(TsModuleDecl {
                            ref mut declare, ..
                        }) => *declare = true,
                    }
                    Ok(Some(decl))
                } else {
                    Ok(None)
                }
            }
            "global" => {
                // `global { }` (with no `declare`) may appear inside an ambient module
                // declaration.
                // Would like to use tsParseAmbientExternalModuleDeclaration here, but already
                // ran past "global".
                if is!('{') {
                    let global = true;
                    let id = TsModuleName::Ident(expr);
                    let body = self
                        .parse_ts_module_block()
                        .map(TsNamespaceBody::from)
                        .map(Some)?;
                    Ok(Some(
                        TsModuleDecl {
                            span: span!(start),
                            global,
                            declare: self.ctx().in_declare,
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
    ) -> PResult<'a, Option<Decl>> {
        assert!(
            !is!("declare"),
            "try_parse_ts_declare should be called after eating `declare`"
        );

        if self.ctx().in_declare {
            let span_of_declare = span!(start);
            self.emit_err(span_of_declare, SyntaxError::TS1038);
        }

        let ctx = Context {
            in_declare: true,
            ..self.ctx()
        };

        self.with_ctx(ctx).parse_with(|p| {
            if is!("function") {
                return p
                    .parse_fn_decl(decorators)
                    .map(|decl| match decl {
                        Decl::Fn(f) => Decl::Fn(FnDecl { declare: true, ..f }),
                        _ => decl,
                    })
                    .map(Some);
            }

            if is!("class") {
                return p
                    .parse_class_decl(start, start, decorators)
                    .map(|decl| match decl {
                        Decl::Class(c) => Decl::Class(ClassDecl { declare: true, ..c }),
                        _ => decl,
                    })
                    .map(Some);
            }

            if is!("const") && peeked_is!("enum") {
                assert_and_bump!("const");
                let _ = cur!(true);
                assert_and_bump!("enum");

                return p
                    .parse_ts_enum_decl(start, /* is_const */ true)
                    .map(|decl| TsEnumDecl {
                        declare: true,
                        ..decl
                    })
                    .map(From::from)
                    .map(Some);
            }
            if is_one_of!("const", "var", "let") {
                return p
                    .parse_var_stmt(false)
                    .map(|decl| VarDecl {
                        declare: true,
                        ..decl
                    })
                    .map(From::from)
                    .map(Some);
            }

            if is!("global") {
                return p
                    .parse_ts_ambient_external_module_decl(start)
                    .map(From::from)
                    .map(Some);
            } else if is!(IdentName) {
                let value = match *cur!(true)? {
                    Token::Word(ref w) => w.clone().into(),
                    _ => unreachable!(),
                };
                return p.parse_ts_decl(start, decorators, value, /* next */ true);
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
        value: JsWord,
    ) -> PResult<'a, Option<Decl>> {
        let start = cur_pos!();

        self.parse_ts_decl(start, decorators, value, true)
    }

    /// Common to tsTryParseDeclare, tsTryParseExportDeclaration, and
    /// tsParseExpressionStatement.
    ///
    /// `tsParseDeclaration`
    #[allow(clippy::cognitive_complexity)]
    fn parse_ts_decl(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
        value: JsWord,
        next: bool,
    ) -> PResult<'a, Option<Decl>> {
        match value {
            js_word!("abstract") => {
                if next || is!("class") {
                    if next {
                        bump!();
                    }
                    let mut decl = self.parse_class_decl(start, start, decorators)?;
                    match decl {
                        Decl::Class(ClassDecl {
                            class:
                                Class {
                                    ref mut is_abstract,
                                    ..
                                },
                            ..
                        }) => *is_abstract = true,
                        _ => unreachable!(),
                    }
                    return Ok(Some(decl));
                }
            }

            js_word!("enum") => {
                if next || is!(IdentRef) {
                    if next {
                        bump!();
                    }
                    return self
                        .parse_ts_enum_decl(start, /* is_const */ false)
                        .map(From::from)
                        .map(Some);
                }
            }

            js_word!("interface") => {
                if next || (is!(IdentRef)) {
                    if next {
                        bump!();
                    }

                    return self
                        .parse_ts_interface_decl(start)
                        .map(From::from)
                        .map(Some);
                }
            }

            js_word!("module") => {
                if next {
                    bump!();
                }

                if match *cur!(true)? {
                    Token::Str { .. } => true,
                    _ => false,
                } {
                    return self
                        .parse_ts_ambient_external_module_decl(start)
                        .map(From::from)
                        .map(Some);
                } else if next || is!(IdentRef) {
                    return self
                        .parse_ts_module_or_ns_decl(start)
                        .map(From::from)
                        .map(Some);
                }
            }

            js_word!("namespace") => {
                if next || is!(IdentRef) {
                    if next {
                        bump!();
                    }
                    return self
                        .parse_ts_module_or_ns_decl(start)
                        .map(From::from)
                        .map(Some);
                }
            }

            js_word!("type") => {
                if next || is!(IdentRef) {
                    if next {
                        bump!();
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
    ) -> PResult<'a, Option<ArrowExpr>> {
        let res = if is_one_of!('<', JSXTagStart) {
            self.try_parse_ts(|p| {
                let type_params = p.parse_ts_type_params()?;
                // Don't use overloaded parseFunctionParams which would look for "<" again.
                expect!('(');
                let params = p.parse_formal_params()?;
                expect!(')');
                let return_type = p.try_parse_ts_type_or_type_predicate_ann()?;
                expect!("=>");

                Ok(Some((type_params, params, return_type)))
            })
        } else {
            None
        };

        let (type_params, params, return_type) = match res {
            Some(v) => v,
            None => return Ok(None),
        };

        let ctx = Context {
            in_async: true,
            in_generator: false,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_with(|p| {
            let is_generator = false;
            let expr = true; // May be set again by parseFunctionBody.
            let is_async = true;
            let body = p.parse_fn_body(true, false)?;
            Ok(Some(ArrowExpr {
                span: span!(start),
                body,
                is_async,
                is_generator,
                type_params: Some(type_params),
                params,
                return_type,
            }))
        })
    }

    /// `tsParseTypeArguments`
    pub fn parse_ts_type_args(&mut self) -> PResult<'a, TsTypeParamInstantiation> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!();
        let params = self.in_type().parse_with(|p| {
            // Temporarily remove a JSX parsing context, which makes us scan different
            // tokens.
            p.ts_in_no_context(|p| {
                expect!('<');
                p.parse_ts_delimited_list(ParsingContext::TypeParametersOrArguments, |p| {
                    p.parse_ts_type()
                })
            })
        })?;
        // This reads the next token after the `>` too, so do this in the enclosing
        // context. But be sure not to parse a regex in the jsx expression
        // `<C<number> />`, so set exprAllowed = false
        self.input.set_expr_allowed(false);
        expect!('>');
        Ok(TsTypeParamInstantiation {
            span: span!(start),
            params,
        })
    }

    /// `tsParseIntersectionTypeOrHigher`
    fn parse_ts_intersection_type_or_higher(&mut self) -> PResult<'a, Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        self.parse_ts_union_or_intersection_type(
            UnionOrIntersection::Intersection,
            |p| p.parse_ts_type_operator_or_higher(),
            &tok!('&'),
        )
    }

    /// `tsParseUnionTypeOrHigher`
    fn parse_ts_union_type_or_higher(&mut self) -> PResult<'a, Box<TsType>> {
        debug_assert!(self.input.syntax().typescript());

        self.parse_ts_union_or_intersection_type(
            UnionOrIntersection::Union,
            |p| p.parse_ts_intersection_type_or_higher(),
            &tok!('|'),
        )
    }

    /// `tsParseUnionOrIntersectionType`
    fn parse_ts_union_or_intersection_type<F>(
        &mut self,
        kind: UnionOrIntersection,
        mut parse_constituent_type: F,
        operator: &'static Token,
    ) -> PResult<'a, Box<TsType>>
    where
        F: FnMut(&mut Self) -> PResult<'a, Box<TsType>>,
    {
        debug_assert!(self.input.syntax().typescript());

        self.input.eat(operator);

        let start = cur_pos!();
        let ty = parse_constituent_type(self)?;
        if self.input.is(&operator) {
            let mut types = vec![ty];

            while self.input.eat(operator) {
                types.push(parse_constituent_type(self)?);
            }

            return Ok(Box::new(TsType::TsUnionOrIntersectionType(match kind {
                UnionOrIntersection::Union => TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                    span: span!(start),
                    types,
                }),
                UnionOrIntersection::Intersection => {
                    TsUnionOrIntersectionType::TsIntersectionType(TsIntersectionType {
                        span: span!(start),
                        types,
                    })
                }
            })));
        }

        Ok(ty)
    }
}

impl<'a, I: Tokens> Parser<'a, I> {
    /// In no lexer context
    fn ts_in_no_context<T, F>(&mut self, op: F) -> PResult<'a, T>
    where
        F: FnOnce(&mut Self) -> PResult<'a, T>,
    {
        debug_assert!(self.input.syntax().typescript());

        let cloned = self.input.token_context().clone();
        self.input
            .set_token_context(TokenContexts(smallvec![cloned.0[0]]));
        let res = op(self);
        self.input.set_token_context(cloned);

        res
    }
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum UnionOrIntersection {
    Union,
    Intersection,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ParsingContext {
    EnumMembers,
    HeritageClauseElement,
    TupleElementTypes,
    TypeMembers,
    TypeParametersOrArguments,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum SignatureParsingMode {
    TSCallSignatureDeclaration,
    TSConstructSignatureDeclaration,
}
