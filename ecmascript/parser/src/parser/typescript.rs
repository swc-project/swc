use super::*;

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

    fn is_ts_list_terminator(&mut self, kind: ParsingContext) -> PResult<'a, bool> {
        Ok(match kind {
            ParsingContext::EnumMembers | ParsingContext::TypeMembers => is!('}'),
            ParsingContext::HeritageClauseElement => is!('{'),
            ParsingContext::TupleElementTypes => is!(']'),
            ParsingContext::TypeParametersOrArguments => is!('>'),
        })
    }

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

    /// `tsParseUnionTypeOrHigher`
    fn parse_ts_union_type_or_higher(&mut self) -> PResult<'a, Box<TsType>> {
        unimplemented!("parse_ts_union_type_or_higher")
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ParsingContext {
    EnumMembers,
    HeritageClauseElement,
    TupleElementTypes,
    TypeMembers,
    TypeParametersOrArguments,
}
