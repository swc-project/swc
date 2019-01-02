use super::*;
use swc_common::Spanned;

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    pub(super) fn parse_ts_type_or_type_predicate_ann(
        &mut self,
        return_token: &'static Token,
    ) -> PResult<'a, TsTypeAnn> {
        self.in_type().parse_with(|p| {
            let start = cur_pos!();

            if !p.input.eat(return_token) {
                unexpected!()
            }

            let type_pred_var = if is!(IdentRef) {
                p.try_ts_parse(|p| p.parse_ts_type_predicate_prefix())?
            } else {
                None
            };

            let type_pred_var = match type_pred_var {
                Some(v) => v.into(),
                None => {
                    return p.parse_ts_type_ann(
                        // eat_colon
                        false, start,
                    );
                }
            };

            let pos = cur_pos!();
            let type_ann = p.parse_ts_type_ann(
                // eat_colon
                false, pos,
            )?;

            let node = box TsType::TsTypePredicate(TsTypePredicate {
                span: span!(start),
                param_name: type_pred_var,
                type_ann,
            });

            Ok(TsTypeAnn {
                span: span!(start),
                type_ann: node,
            })
        })
    }

    fn parse_ts_type_predicate_prefix(&mut self) -> PResult<'a, Option<Ident>> {
        let id = self.parse_ident(false, false)?;

        if is!("is") && !self.input.had_line_break_before_cur() {
            assert_and_bump!("is");
            return Ok(Some(id));
        }

        Ok(None)
    }

    fn try_ts_parse<T, F>(&mut self, op: F) -> PResult<'a, Option<T>>
    where
        F: FnOnce(&mut Self) -> PResult<'a, Option<T>>,
    {
        let mut cloned = self.clone();
        let res = op(&mut cloned)?;
        match res {
            Some(res) => {
                *self = cloned;
                Ok(Some(res))
            }
            _ => Ok(None),
        }
    }

    fn parse_ts_type_ann(&mut self, eat_colon: bool, start: BytePos) -> PResult<'a, TsTypeAnn> {
        self.in_type().parse_with(|p| {
            if eat_colon {
                expect!(':');
            }

            let type_ann = p.parse_ts_type()?;

            Ok(TsTypeAnn {
                span: span!(start),
                type_ann,
            })
        })
    }

    /// `tsIsListTerminator`
    #[inline(always)]
    fn is_ts_list_terminator(&mut self, kind: ParsingContext) -> PResult<'a, bool> {
        Ok(match kind {
            ParsingContext::EnumMembers | ParsingContext::TypeMembers => is!('}'),
            ParsingContext::HeritageClauseElement => is!('{'),
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
        F: for<'b> FnMut(&'b mut Self) -> PResult<'b, T>,
    {
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
        F: for<'b> FnMut(&'b mut Self) -> PResult<'b, T>,
    {
        let mut buf = vec![];

        loop {
            if self.is_ts_list_terminator(kind)? {
                break;
            }

            let element = parse_element(self)?;
            buf.push(element);

            if eat!(',') {
                continue;
            }

            if self.is_ts_list_terminator(kind)? {
                break;
            }

            // This will fail with an error about a missing comma
            expect!(',');
        }

        Ok(buf)
    }

    fn parse_ts_bracketed_list<T, F>(
        &mut self,
        kind: ParsingContext,
        parse_element: F,
        bracket: bool,
        skip_first_token: bool,
    ) -> PResult<'a, Vec<T>>
    where
        F: for<'b> FnMut(&'b mut Self) -> PResult<'b, T>,
    {
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
        let mut entity = TsEntityName::Ident(self.parse_ident(false, false)?);
        while eat!('.') {
            let left = entity;
            let right = self.parse_ident(allow_reserved_words, allow_reserved_words)?;
            entity = TsEntityName::TsQualifiedName(box TsQualifiedName { left, right });
        }

        Ok(entity)
    }

    /// `tsParseTypeReference`
    fn parse_ts_type_ref(&mut self) -> PResult<'a, TsTypeRef> {
        let start = cur_pos!();
        let type_name = self.parse_ts_entity_name(/* allow_reserved_words */ false)?;
        let type_params = if !self.input.had_line_break_before_cur() && is!('<') {
            Some(self.parse_ts_type_args()?)
        } else {
            None
        };
        Ok(TsTypeRef {
            span: span!(start),
            type_name,
            type_params,
        })
    }

    /// `tsParseThisTypePredicate`
    fn parse_ts_this_type_predicate(&mut self, lhs: TsThisType) -> PResult<'a, TsTypePredicate> {
        assert_and_bump!("is");
        let start = cur_pos!();

        let param_name = TsThisTypeOrIdent::TsThisType(lhs);
        let cur_pos = cur_pos!();
        let type_ann = self.parse_ts_type_ann(
            // eat_colon
            false, cur_pos,
        )?;

        Ok(TsTypePredicate {
            span: span!(start),
            param_name,
            type_ann,
        })
    }

    /// `tsParseThisTypeNode`
    fn parse_ts_this_type_node(&mut self) -> PResult<'a, TsThisType> {
        expect!("this");

        Ok(TsThisType {
            span: self.input.prev_span(),
        })
    }

    /// `tsParseTypeQuery`
    fn parse_ts_type_query(&mut self) -> PResult<'a, TsTypeQuery> {
        let start = cur_pos!();
        expect!("typeof");
        let expr_name = self.parse_ts_entity_name(
            // allow_reserved_word
            true,
        )?;
        Ok(TsTypeQuery {
            span: span!(start),
            expr_name,
        })
    }

    /// `tsParseTypeParameter`
    pub(super) fn parse_ts_type_params(&mut self) -> PResult<'a, TsTypeParamDecl> {
        let start = cur_pos!();

        if !is!('<') && !is!(JSXTagStart) {
            unexpected!()
        }

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

    fn parse_ts_type_param(&mut self) -> PResult<'a, TsTypeParam> {
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
        self.in_type().parse_with(|p| {
            if !p.input.eat(token) {
                unexpected!()
            }

            p.parse_ts_type()
        })
    }

    /// Be sure to be in a type context before calling this.
    fn parse_ts_type(&mut self) -> PResult<'a, Box<TsType>> {
        // Need to set `state.inType` so that we don't parse JSX in a type context.
        assert!(self.ctx().in_type);

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

        Ok(box TsType::TsConditionalType(TsConditionalType {
            span: span!(start),
            check_type,
            extends_type,
            true_type,
            false_type,
        }))
    }

    fn parse_ts_non_conditional_type(&mut self) -> PResult<'a, Box<TsType>> {
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
        if is!('<') {
            return Ok(true);
        }

        Ok(is!('(') && self.ts_look_ahead(|p| p.is_ts_unambiguously_start_of_fn_type())?)
    }

    fn ts_look_ahead<T, F>(&mut self, op: F) -> PResult<'a, T>
    where
        F: FnOnce(&mut Self) -> PResult<'a, T>,
    {
        let mut cloned = self.clone();
        op(&mut cloned)
    }

    /// `tsIsUnambiguouslyStartOfFunctionType`
    fn is_ts_unambiguously_start_of_fn_type(&mut self) -> PResult<'a, bool> {
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
            if eat!(')') {
                if is!("=>") {
                    // ( xxx ) =>
                    return Ok(true);
                }
            }
        }
        Ok(false)
    }

    /// `tsSkipParameterStart`
    fn skip_ts_parameter_start(&mut self) -> PResult<'a, bool> {
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

    // tsParseBindingListForSignature(): $ReadOnlyArray<
    //   N.Identifier | N.RestElement | N.ObjectPattern,
    // > {
    //   return this.parseBindingList(tt.parenR).map(pattern => {
    //     if (
    //       pattern.type !== "Identifier" &&
    //       pattern.type !== "RestElement" &&
    //       pattern.type !== "ObjectPattern"
    //     ) {
    //       throw this.unexpected(
    //         pattern.start,
    //         `Name in a signature must be an Identifier or ObjectPattern, instead
    // got ${           pattern.type
    //         }`,
    //       );
    //     }
    //     return pattern;
    //   });
    // }

    // tsParseTypeMemberSemicolon(): void {
    //   if (!this.eat(tt.comma)) {
    //     this.semicolon();
    //   }
    // }

    // tsParseSignatureMember(
    //   kind: "TSCallSignatureDeclaration" | "TSConstructSignatureDeclaration",
    // ): N.TsCallSignatureDeclaration | N.TsConstructSignatureDeclaration {
    //   const node:
    //     | N.TsCallSignatureDeclaration
    //     | N.TsConstructSignatureDeclaration = this.startNode();
    //   if (kind === "TSConstructSignatureDeclaration") {
    //     this.expect(tt._new);
    //   }
    //   this.tsFillSignature(tt.colon, node);
    //   this.tsParseTypeMemberSemicolon();
    //   return this.finishNode(node, kind);
    // }

    // tsIsUnambiguouslyIndexSignature() {
    //   this.next(); // Skip '{'
    //   return this.eat(tt.name) && this.match(tt.colon);
    // }

    // tsTryParseIndexSignature(node: N.TsIndexSignature): ?N.TsIndexSignature {
    //   if (
    //     !(
    //       this.match(tt.bracketL) &&
    //       this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this))
    //     )
    //   ) {
    //     return undefined;
    //   }

    //   this.expect(tt.bracketL);
    //   const id = this.parseIdentifier();
    //   this.expect(tt.colon);
    //   id.typeAnnotation = this.tsParseTypeAnnotation(/* eatColon */ false);
    //   this.expect(tt.bracketR);
    //   node.parameters = [id];

    //   const type = this.tsTryParseTypeAnnotation();
    //   if (type) node.typeAnnotation = type;
    //   this.tsParseTypeMemberSemicolon();
    //   return this.finishNode(node, "TSIndexSignature");
    // }

    // tsParsePropertyOrMethodSignature(
    //   node: N.TsPropertySignature | N.TsMethodSignature,
    //   readonly: boolean,
    // ): N.TsPropertySignature | N.TsMethodSignature {
    //   this.parsePropertyName(node);
    //   if (this.eat(tt.question)) node.optional = true;
    //   const nodeAny: any = node;

    //   if (!readonly && (this.match(tt.parenL) || this.isRelational("<"))) {
    //     const method: N.TsMethodSignature = nodeAny;
    //     this.tsFillSignature(tt.colon, method);
    //     this.tsParseTypeMemberSemicolon();
    //     return this.finishNode(method, "TSMethodSignature");
    //   } else {
    //     const property: N.TsPropertySignature = nodeAny;
    //     if (readonly) property.readonly = true;
    //     const type = this.tsTryParseTypeAnnotation();
    //     if (type) property.typeAnnotation = type;
    //     this.tsParseTypeMemberSemicolon();
    //     return this.finishNode(property, "TSPropertySignature");
    //   }
    // }

    // tsParseTypeMember(): N.TsTypeElement {
    //   if (this.match(tt.parenL) || this.isRelational("<")) {
    //     return this.tsParseSignatureMember("TSCallSignatureDeclaration");
    //   }
    //   if (
    //     this.match(tt._new) &&
    //     this.tsLookAhead(this.tsIsStartOfConstructSignature.bind(this))
    //   ) {
    //     return this.tsParseSignatureMember("TSConstructSignatureDeclaration");
    //   }
    //   // Instead of fullStart, we create a node here.
    //   const node: any = this.startNode();
    //   const readonly = !!this.tsParseModifier(["readonly"]);

    //   const idx = this.tsTryParseIndexSignature(node);
    //   if (idx) {
    //     if (readonly) node.readonly = true;
    //     return idx;
    //   }
    //   return this.tsParsePropertyOrMethodSignature(node, readonly);
    // }

    // tsIsStartOfConstructSignature() {
    //   this.next();
    //   return this.match(tt.parenL) || this.isRelational("<");
    // }

    /// `tsParseTypeLiteral`
    fn parse_ts_type_lit(&mut self) -> PResult<'a, TsTypeLit> {
        let start = cur_pos!();
        let members = self.parse_ts_object_type_members()?;
        Ok(TsTypeLit {
            span: span!(start),
            members,
        })
    }

    /// `tsParseObjectTypeMembers`
    fn parse_ts_object_type_members(&mut self) -> PResult<'a, Vec<TsTypeElement>> {
        expect!('{');
        let members =
            self.parse_ts_list(ParsingContext::TypeMembers, |p| p.parse_ts_type_member())?;
        expect!('}');
        Ok(members)
    }

    /// `tsIsStartOfMappedType`
    fn is_ts_start_of_mapped_type(&mut self) -> PResult<'a, bool> {
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
    fn parse_ts_mapped_type(&mut self) -> PResult<'a, TsMappedType> {
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
        } else if is!("readonly") {
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
            bump!();
            expect!('?');
        } else if eat!('?') {
            optional = Some(TruePlusMinus::True);
        }

        let type_ann = self.try_parse_ts_type()?;
        eat!(';');
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
        // parses `...TsType[]`
        let start = cur_pos!();

        if eat!("...") {
            let type_ann = self.parse_ts_type()?;
            return Ok(box TsType::TsRestType(TsRestType {
                span: span!(start),
                type_ann,
            }));
        }

        let ty = self.parse_ts_type()?;
        // parses `TsType?`
        if eat!('?') {
            let type_ann = ty;
            return Ok(box TsType::TsOptionalType(TsOptionalType {
                span: span!(start),
                type_ann,
            }));
        }

        Ok(ty)
    }

    /// `tsParseParenthesizedType`
    fn parse_ts_parenthesized_type(&mut self) -> PResult<'a, TsParenthesizedType> {
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
        let start = cur_pos!();
        if !is_fn_type {
            expect!("new");
        }

        // ----- inlined `this.tsFillSignature(tt.arrow, node)`
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
        //     return this.parseBindingList(tt.parenR).map(pattern => {
        //     if (
        //       pattern.type !== "Identifier" &&
        //       pattern.type !== "RestElement" &&
        //       pattern.type !== "ObjectPattern"
        //     ) {
        //       throw this.unexpected(
        //         pattern.start,
        //         `Name in a signature must be an Identifier or ObjectPattern, instead
        // got ${           pattern.type
        //         }`,
        //       );
        //     }
        //     return pattern;
        //   });
        unimplemented!("parse_ts_binding_list_for_signature")
    }

    /// `tsTryParseTypeOrTypePredicateAnnotation`
    fn try_parse_ts_type_or_type_predicate_ann(&mut self) -> PResult<'a, Option<TsTypeAnn>> {
        if is!(':') {
            self.parse_ts_type_or_type_predicate_ann(&tok!(':'))
                .map(Some)
        } else {
            Ok(None)
        }
    }

    /// `tsTryParseTypeAnnotation`
    fn try_parse_ts_type_ann(&mut self) -> PResult<'a, Option<TsTypeAnn>> {
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
    fn try_parse_ts_type_params(&mut self) -> PResult<'a, Option<TsTypeParamDecl>> {
        if is!('<') {
            return self.parse_ts_type_params().map(Some);
        }
        Ok(None)
    }

    /// `tsParseNonArrayType`
    fn parse_ts_non_array_type(&mut self) -> PResult<'a, Box<TsType>> {
        let start = cur_pos!();

        match *cur!(true)? {
            Token::Word(Word::Ident(..)) | tok!("void") | tok!("null") => {
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
                } else {
                    None
                };

                let peeked_is_dot = peeked_is!('.');

                match kind {
                    Some(kind) if !peeked_is_dot => {
                        bump!();
                        return Ok(box TsType::TsKeywordType(TsKeywordType {
                            span: span!(start),
                            kind,
                        }));
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

                return Ok(box TsType::TsLitType(TsLitType {
                    span: span!(start),
                    lit,
                }));
            }

            tok!("this") => {
                let this_keyword = self.parse_ts_this_type_node()?;
                if !self.input.had_line_break_before_cur() && is!("is") {
                    return self
                        .parse_ts_this_type_predicate(this_keyword)
                        .map(TsType::from)
                        .map(Box::new);
                } else {
                    return Ok(box TsType::TsThisType(this_keyword));
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
        //   switch (this.state.type) {
        //   }

        unexpected!()
    }

    /// `tsParseArrayTypeOrHigher`
    fn parse_ts_array_type_or_higher(&mut self) -> PResult<'a, Box<TsType>> {
        let mut ty = self.parse_ts_non_array_type()?;

        while !self.input.had_line_break_before_cur() && eat!('[') {
            if eat!(']') {
                ty = box TsType::TsArrayType(TsArrayType {
                    span: span!(ty.span().lo()),
                    elem_type: ty,
                });
            } else {
                let index_type = self.parse_ts_type()?;
                expect!(']');
                ty = box TsType::TsIndexedAccessType(TsIndexedAccessType {
                    span: span!(ty.span().lo()),
                    obj_type: ty,
                    index_type,
                })
            }
        }

        Ok(ty)
    }

    /// `tsParseTypeOperator`
    fn parse_ts_type_operator(&mut self, op: TsTypeOperatorOp) -> PResult<'a, TsTypeOperator> {
        let start = cur_pos!();
        match op {
            TsTypeOperatorOp::Unique => expect!("unique"),
            TsTypeOperatorOp::KeyOf => expect!("keyof"),
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
        let operator = if is!("keyof") {
            Some(TsTypeOperatorOp::KeyOf)
        } else if is!("unique") {
            Some(TsTypeOperatorOp::Unique)
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
                    self.parse_ts_array_type_or_higher()
                }
            }
        }
    }

    /// `tsParseTypeArguments`
    fn parse_ts_type_args(&mut self) -> PResult<'a, TsTypeParamInstantiation> {
        unimplemented!("parse_ts_type_args")
    }

    /// `tsParseIntersectionTypeOrHigher`
    fn parse_ts_intersection_type_or_higher(&mut self) -> PResult<'a, Box<TsType>> {
        self.parse_ts_union_or_intersection_type(
            UnionOrIntersection::Intersection,
            |p| p.parse_ts_type_operator_or_higher(),
            &tok!('&'),
        )
    }

    /// `tsParseUnionTypeOrHigher`
    fn parse_ts_union_type_or_higher(&mut self) -> PResult<'a, Box<TsType>> {
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
        self.input.eat(operator);

        let start = cur_pos!();
        let ty = parse_constituent_type(self)?;
        if self.input.is(&operator) {
            let mut types = vec![ty];

            while self.input.eat(operator) {
                types.push(parse_constituent_type(self)?);
            }

            return Ok(box TsType::TsUnionOrIntersectionType(match kind {
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
            }));
        }

        Ok(ty)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
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
