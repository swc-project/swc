use super::*;

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    pub(super) fn parse_ts_type_or_type_predicate_ann(&mut self) -> PResult<'a, TsTypeAnn> {
        unimplemented!("parse_ts_type_or_type_predicate_ann")
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
        let ctx = Context {
            in_type: true,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_with(|p| {
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
        unimplemented!("parse_ts_non_conditional_type")
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
