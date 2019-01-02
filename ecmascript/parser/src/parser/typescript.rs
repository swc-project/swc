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
    fn is_ts_list_terminator(&mut self, kind: ParsingContext) -> PResult<'a, bool> {
        Ok(match kind {
            ParsingContext::EnumMembers | ParsingContext::TypeMembers => is!('}'),
            ParsingContext::HeritageClauseElement => is!('{'),
            ParsingContext::TupleElementTypes => is!(']'),
            ParsingContext::TypeParametersOrArguments => is!('>'),
        })
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

    // tsParseThisTypePredicate(lhs: N.TsThisType): N.TsTypePredicate {
    //   this.next();
    //   const node: N.TsTypePredicate = this.startNode();
    //   node.parameterName = lhs;
    //   node.typeAnnotation = this.tsParseTypeAnnotation(/* eatColon */ false);
    //   return this.finishNode(node, "TSTypePredicate");
    // }

    // tsParseThisTypeNode(): N.TsThisType {
    //   const node: N.TsThisType = this.startNode();
    //   this.next();
    //   return this.finishNode(node, "TSThisType");
    // }

    // tsParseTypeQuery(): N.TsTypeQuery {
    //   const node: N.TsTypeQuery = this.startNode();
    //   this.expect(tt._typeof);
    //   node.exprName = this.tsParseEntityName(/* allowReservedWords */ true);
    //   return this.finishNode(node, "TSTypeQuery");
    // }

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

        return Ok(false);
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
                //       const thisKeyword = this.tsParseThisTypeNode();
                //       if (this.isContextual("is") && !this.hasPrecedingLineBreak()) {
                //         return this.tsParseThisTypePredicate(thisKeyword);
                //       } else {
                //         return thisKeyword;
                //       }
            }
            tok!("typeof") => {
                return self.parse_ts_type_query();
            }

            tok!('{') => {
                //       return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this))
                //         ? this.tsParseMappedType()
                //         : this.tsParseTypeLiteral();
            }
            tok!('[') => {
                return self.parse_ts_tuple_type();
            }
            tok!('(') => {
                return self.parse_ts_parenthesized_type();
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
