//! 13.3.3 Destructuring Binding Patterns

use swc_common::Spanned;

use super::*;
use crate::{
    common::parser::{is_not_this, pat_type::PatType},
    parser::expr::AssignTargetOrSpread,
    tok,
    token::Token,
};

impl<I: Tokens<TokenAndSpan>> Parser<I> {
    pub fn parse_pat(&mut self) -> PResult<Pat> {
        self.parse_binding_pat_or_ident(false)
    }

    pub(super) fn parse_binding_pat_or_ident(&mut self, disallow_let: bool) -> PResult<Pat> {
        trace_cur!(self, parse_binding_pat_or_ident);

        match *cur!(self, true) {
            tok!("yield") | Token::Word(..) => {
                self.parse_binding_ident(disallow_let).map(Pat::from)
            }
            tok!('[') => self.parse_array_binding_pat(),
            tok!('{') => self.parse_object(),
            // tok!('(') => {
            //     bump!(self);
            //     let pat = self.parse_binding_pat_or_ident()?;
            //     expect!(self, ')');
            //     Ok(pat)
            // }
            _ => unexpected!(self, "yield, an identifier, [ or {"),
        }
    }

    /// babel: `parseBindingAtom`
    pub(super) fn parse_binding_element(&mut self) -> PResult<Pat> {
        trace_cur!(self, parse_binding_element);

        let start = cur_pos!(self);
        let left = self.parse_binding_pat_or_ident(false)?;

        if eat!(self, '=') {
            let right = self.include_in_expr(true).parse_assignment_expr()?;

            if self.ctx().contains(Context::InDeclare) {
                self.emit_err(span!(self, start), SyntaxError::TS2371);
            }

            return Ok(AssignPat {
                span: span!(self, start),
                left: Box::new(left),
                right,
            }
            .into());
        }

        Ok(left)
    }

    fn parse_array_binding_pat(&mut self) -> PResult<Pat> {
        let start = cur_pos!(self);

        assert_and_bump!(self, '[');

        let mut elems = Vec::new();

        let mut rest_span = Span::default();

        while !eof!(self) && !is!(self, ']') {
            if eat!(self, ',') {
                elems.push(None);
                continue;
            }

            if !rest_span.is_dummy() {
                self.emit_err(rest_span, SyntaxError::NonLastRestParam);
            }

            let start = cur_pos!(self);

            let mut is_rest = false;
            if eat!(self, "...") {
                is_rest = true;
                let dot3_token = span!(self, start);

                let pat = self.parse_binding_pat_or_ident(false)?;
                rest_span = span!(self, start);
                let pat = RestPat {
                    span: rest_span,
                    dot3_token,
                    arg: Box::new(pat),
                    type_ann: None,
                }
                .into();
                elems.push(Some(pat));
            } else {
                elems.push(self.parse_binding_element().map(Some)?);
            }

            if !is!(self, ']') {
                expect!(self, ',');
                if is_rest && is!(self, ']') {
                    self.emit_err(self.input.prev_span(), SyntaxError::CommaAfterRestElement);
                }
            }
        }

        expect!(self, ']');
        let optional = (self.input.syntax().dts() || self.ctx().contains(Context::InDeclare))
            && eat!(self, '?');

        Ok(ArrayPat {
            span: span!(self, start),
            elems,
            optional,
            type_ann: None,
        }
        .into())
    }

    /// spec: 'FormalParameter'
    ///
    /// babel: `parseAssignableListItem`
    pub(super) fn parse_formal_param_pat(&mut self) -> PResult<Pat> {
        let start = cur_pos!(self);

        let has_modifier = self.eat_any_ts_modifier()?;

        let pat_start = cur_pos!(self);
        let mut pat = self.parse_binding_element()?;
        let mut opt = false;

        if self.input.syntax().typescript() {
            if eat!(self, '?') {
                match pat {
                    Pat::Ident(BindingIdent {
                        id:
                            Ident {
                                ref mut optional, ..
                            },
                        ..
                    })
                    | Pat::Array(ArrayPat {
                        ref mut optional, ..
                    })
                    | Pat::Object(ObjectPat {
                        ref mut optional, ..
                    }) => {
                        *optional = true;
                        opt = true;
                    }
                    _ if self.input.syntax().dts() || self.ctx().contains(Context::InDeclare) => {}
                    _ => {
                        syntax_error!(
                            self,
                            self.input.prev_span(),
                            SyntaxError::TsBindingPatCannotBeOptional
                        );
                    }
                }
            }

            match pat {
                Pat::Array(ArrayPat {
                    ref mut type_ann,
                    ref mut span,
                    ..
                })
                | Pat::Object(ObjectPat {
                    ref mut type_ann,
                    ref mut span,
                    ..
                })
                | Pat::Rest(RestPat {
                    ref mut type_ann,
                    ref mut span,
                    ..
                }) => {
                    let new_type_ann = self.try_parse_ts_type_ann()?;
                    if new_type_ann.is_some() {
                        *span = Span::new(pat_start, self.input.prev_span().hi);
                    }
                    *type_ann = new_type_ann;
                }

                Pat::Ident(BindingIdent {
                    ref mut type_ann, ..
                }) => {
                    let new_type_ann = self.try_parse_ts_type_ann()?;
                    *type_ann = new_type_ann;
                }

                Pat::Assign(AssignPat { ref mut span, .. }) => {
                    if (self.try_parse_ts_type_ann()?).is_some() {
                        *span = Span::new(pat_start, self.input.prev_span().hi);
                        self.emit_err(*span, SyntaxError::TSTypeAnnotationAfterAssign);
                    }
                }
                Pat::Invalid(..) => {}
                _ => unreachable!("invalid syntax: Pat: {:?}", pat),
            }
        }

        let pat = if eat!(self, '=') {
            // `=` cannot follow optional parameter.
            if opt {
                self.emit_err(pat.span(), SyntaxError::TS1015);
            }

            let right = self.parse_assignment_expr()?;
            if self.ctx().contains(Context::InDeclare) {
                self.emit_err(span!(self, start), SyntaxError::TS2371);
            }

            AssignPat {
                span: span!(self, start),
                left: Box::new(pat),
                right,
            }
            .into()
        } else {
            pat
        };

        if has_modifier {
            self.emit_err(span!(self, start), SyntaxError::TS2369);
            return Ok(pat);
        }

        Ok(pat)
    }

    pub(super) fn parse_constructor_params(&mut self) -> PResult<Vec<ParamOrTsParamProp>> {
        let mut params = Vec::new();
        let mut rest_span = Span::default();

        while !eof!(self) && !is!(self, ')') {
            if !rest_span.is_dummy() {
                self.emit_err(rest_span, SyntaxError::TS1014);
            }

            let param_start = cur_pos!(self);
            let decorators = self.parse_decorators(false)?;
            let pat_start = cur_pos!(self);

            let mut is_rest = false;
            if eat!(self, "...") {
                is_rest = true;
                let dot3_token = span!(self, pat_start);

                let pat = self.parse_binding_pat_or_ident(false)?;
                let type_ann = if self.input.syntax().typescript() && is!(self, ':') {
                    let cur_pos = cur_pos!(self);
                    Some(self.parse_ts_type_ann(/* eat_colon */ true, cur_pos)?)
                } else {
                    None
                };

                rest_span = span!(self, pat_start);
                let pat = RestPat {
                    span: rest_span,
                    dot3_token,
                    arg: Box::new(pat),
                    type_ann,
                }
                .into();
                params.push(ParamOrTsParamProp::Param(Param {
                    span: span!(self, param_start),
                    decorators,
                    pat,
                }));
            } else {
                params.push(self.parse_constructor_param(param_start, decorators)?);
            }

            if !is!(self, ')') {
                expect!(self, ',');
                if is!(self, ')') && is_rest {
                    self.emit_err(self.input.prev_span(), SyntaxError::CommaAfterRestElement);
                }
            }
        }

        Ok(params)
    }

    fn parse_constructor_param(
        &mut self,
        param_start: BytePos,
        decorators: Vec<Decorator>,
    ) -> PResult<ParamOrTsParamProp> {
        let (accessibility, is_override, readonly) = if self.input.syntax().typescript() {
            let accessibility = self.parse_access_modifier()?;
            (
                accessibility,
                self.parse_ts_modifier(&["override"], false)?.is_some(),
                self.parse_ts_modifier(&["readonly"], false)?.is_some(),
            )
        } else {
            (None, false, false)
        };
        if accessibility.is_none() && !is_override && !readonly {
            let pat = self.parse_formal_param_pat()?;
            Ok(ParamOrTsParamProp::Param(Param {
                span: span!(self, param_start),
                decorators,
                pat,
            }))
        } else {
            let param = match self.parse_formal_param_pat()? {
                Pat::Ident(i) => TsParamPropParam::Ident(i),
                Pat::Assign(a) => TsParamPropParam::Assign(a),
                node => syntax_error!(self, node.span(), SyntaxError::TsInvalidParamPropPat),
            };
            Ok(ParamOrTsParamProp::TsParamProp(TsParamProp {
                span: span!(self, param_start),
                accessibility,
                is_override,
                readonly,
                decorators,
                param,
            }))
        }
    }

    #[allow(dead_code)]
    pub(super) fn parse_setter_param(&mut self, key_span: Span) -> PResult<Param> {
        let params = self.parse_formal_params()?;
        let cnt = params.iter().filter(|p| is_not_this(p)).count();

        if cnt != 1 {
            self.emit_err(key_span, SyntaxError::SetterParam);
        }

        if !params.is_empty() {
            if let Pat::Rest(..) = params[0].pat {
                self.emit_err(params[0].pat.span(), SyntaxError::RestPatInSetter);
            }
        }

        if params.is_empty() {
            syntax_error!(self, SyntaxError::SetterParamRequired);
        }

        Ok(params.into_iter().next().unwrap())
    }

    pub(super) fn parse_formal_params(&mut self) -> PResult<Vec<Param>> {
        let mut params = Vec::new();
        let mut rest_span = Span::default();

        while !eof!(self) && !is!(self, ')') {
            if !rest_span.is_dummy() {
                self.emit_err(rest_span, SyntaxError::TS1014);
            }

            let param_start = cur_pos!(self);
            let decorators = self.parse_decorators(false)?;
            let pat_start = cur_pos!(self);

            let pat = if eat!(self, "...") {
                let dot3_token = span!(self, pat_start);

                let mut pat = self.parse_binding_pat_or_ident(false)?;

                if eat!(self, '=') {
                    let right = self.parse_assignment_expr()?;
                    self.emit_err(pat.span(), SyntaxError::TS1048);
                    pat = AssignPat {
                        span: span!(self, pat_start),
                        left: Box::new(pat),
                        right,
                    }
                    .into();
                }

                let type_ann = if self.input.syntax().typescript() && is!(self, ':') {
                    let cur_pos = cur_pos!(self);
                    let ty = self.parse_ts_type_ann(/* eat_colon */ true, cur_pos)?;
                    Some(ty)
                } else {
                    None
                };

                rest_span = span!(self, pat_start);
                let pat = RestPat {
                    span: rest_span,
                    dot3_token,
                    arg: Box::new(pat),
                    type_ann,
                }
                .into();

                if self.syntax().typescript() && eat!(self, '?') {
                    self.emit_err(self.input.prev_span(), SyntaxError::TS1047);
                    //
                }

                pat
            } else {
                self.parse_formal_param_pat()?
            };
            let is_rest = matches!(pat, Pat::Rest(_));

            params.push(Param {
                span: span!(self, param_start),
                decorators,
                pat,
            });

            if !is!(self, ')') {
                expect!(self, ',');
                if is_rest && is!(self, ')') {
                    self.emit_err(self.input.prev_span(), SyntaxError::CommaAfterRestElement);
                }
            }
        }

        Ok(params)
    }

    pub(super) fn parse_unique_formal_params(&mut self) -> PResult<Vec<Param>> {
        // FIXME: This is wrong
        self.parse_formal_params()
    }
}

impl<I: Tokens<TokenAndSpan>> Parser<I> {
    pub(super) fn parse_paren_items_as_params(
        &mut self,
        mut exprs: Vec<AssignTargetOrSpread>,
        trailing_comma: Option<Span>,
    ) -> PResult<Vec<Pat>> {
        let pat_ty = PatType::BindingPat;

        let len = exprs.len();
        if len == 0 {
            return Ok(Vec::new());
        }

        let mut params = Vec::with_capacity(len);

        for expr in exprs.drain(..len - 1) {
            match expr {
                AssignTargetOrSpread::ExprOrSpread(ExprOrSpread {
                    spread: Some(..), ..
                })
                | AssignTargetOrSpread::Pat(Pat::Rest(..)) => {
                    self.emit_err(expr.span(), SyntaxError::TS1014)
                }
                AssignTargetOrSpread::ExprOrSpread(ExprOrSpread {
                    spread: None, expr, ..
                }) => params.push(self.reparse_expr_as_pat(pat_ty, expr)?),
                AssignTargetOrSpread::Pat(pat) => params.push(pat),
            }
        }

        debug_assert_eq!(exprs.len(), 1);
        let expr = exprs.into_iter().next().unwrap();
        let outer_expr_span = expr.span();
        let last = match expr {
            // Rest
            AssignTargetOrSpread::ExprOrSpread(ExprOrSpread {
                spread: Some(dot3_token),
                expr,
            }) => {
                if let Expr::Assign(_) = *expr {
                    self.emit_err(outer_expr_span, SyntaxError::TS1048)
                };
                if let Some(trailing_comma) = trailing_comma {
                    self.emit_err(trailing_comma, SyntaxError::CommaAfterRestElement);
                }
                let expr_span = expr.span();
                self.reparse_expr_as_pat(pat_ty, expr).map(|pat| {
                    RestPat {
                        span: expr_span,
                        dot3_token,
                        arg: Box::new(pat),
                        type_ann: None,
                    }
                    .into()
                })?
            }
            AssignTargetOrSpread::ExprOrSpread(ExprOrSpread { expr, .. }) => {
                self.reparse_expr_as_pat(pat_ty, expr)?
            }
            AssignTargetOrSpread::Pat(pat) => {
                if let Some(trailing_comma) = trailing_comma {
                    if let Pat::Rest(..) = pat {
                        self.emit_err(trailing_comma, SyntaxError::CommaAfterRestElement);
                    }
                }
                pat
            }
        };
        params.push(last);

        if self.ctx().contains(Context::Strict) {
            for param in params.iter() {
                self.pat_is_valid_argument_in_strict(param)
            }
        }

        Ok(params)
    }

    /// argument of arrow is pattern, although idents in pattern is already
    /// checked if is a keyword, it should also be checked if is arguments or
    /// eval
    fn pat_is_valid_argument_in_strict(&self, pat: &Pat) {
        match pat {
            Pat::Ident(i) => {
                if i.is_reserved_in_strict_bind() {
                    self.emit_strict_mode_err(i.span, SyntaxError::EvalAndArgumentsInStrict)
                }
            }
            Pat::Array(arr) => {
                for pat in arr.elems.iter().flatten() {
                    self.pat_is_valid_argument_in_strict(pat)
                }
            }
            Pat::Rest(r) => self.pat_is_valid_argument_in_strict(&r.arg),
            Pat::Object(obj) => {
                for prop in obj.props.iter() {
                    match prop {
                        ObjectPatProp::KeyValue(KeyValuePatProp { value, .. })
                        | ObjectPatProp::Rest(RestPat { arg: value, .. }) => {
                            self.pat_is_valid_argument_in_strict(value)
                        }
                        ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                            if key.is_reserved_in_strict_bind() {
                                self.emit_strict_mode_err(
                                    key.span,
                                    SyntaxError::EvalAndArgumentsInStrict,
                                )
                            }
                        }
                    }
                }
            }
            Pat::Assign(a) => self.pat_is_valid_argument_in_strict(&a.left),
            Pat::Invalid(_) | Pat::Expr(_) => (),
        }
    }
}
