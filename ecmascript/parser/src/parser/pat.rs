//! 13.3.3 Destructuring Binding Patterns
use super::{util::ExprExt, *};
use crate::parser::class_and_fn::is_not_this;
use crate::{parser::expr::PatOrExprOrSpread, token::AssignOpToken};
use std::iter;
use swc_atoms::js_word;
use swc_common::Spanned;

impl<'a, I: Tokens> Parser<I> {
    pub(super) fn parse_opt_binding_ident(&mut self) -> PResult<Option<BindingIdent>> {
        trace_cur!(self, parse_opt_binding_ident);

        if is!(self, BindingIdent) || (self.input.syntax().typescript() && is!(self, "this")) {
            self.parse_binding_ident().map(Some)
        } else {
            Ok(None)
        }
    }

    /// babel: `parseBindingIdentifier`
    ///
    /// spec: `BindingIdentifier`
    pub(super) fn parse_binding_ident(&mut self) -> PResult<BindingIdent> {
        trace_cur!(self, parse_binding_ident);

        // "yield" and "await" is **lexically** accepted.
        let ident = self.parse_ident(true, true)?;
        if ident.sym == js_word!("arguments") || ident.sym == js_word!("eval") {
            self.emit_strict_mode_err(ident.span, SyntaxError::EvalAndArgumentsInStrict);
        }
        if self.ctx().in_async && ident.sym == js_word!("await") {
            self.emit_err(ident.span, SyntaxError::ExpectedIdent);
        }
        if self.ctx().in_generator && ident.sym == js_word!("yield") {
            self.emit_err(ident.span, SyntaxError::ExpectedIdent);
        }

        Ok(ident.into())
    }

    pub(super) fn parse_binding_pat_or_ident(&mut self) -> PResult<Pat> {
        trace_cur!(self, parse_binding_pat_or_ident);

        match *cur!(self, true)? {
            tok!("yield") | Word(..) => self.parse_binding_ident().map(Pat::from),
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
        let left = self.parse_binding_pat_or_ident()?;

        if eat!(self, '=') {
            let right = self.include_in_expr(true).parse_assignment_expr()?;

            if self.ctx().in_declare {
                self.emit_err(span!(self, start), SyntaxError::TS2371);
            }

            return Ok(Pat::Assign(AssignPat {
                span: span!(self, start),
                left: Box::new(left),
                right,
                type_ann: None,
            }));
        }

        Ok(left)
    }

    fn parse_array_binding_pat(&mut self) -> PResult<Pat> {
        let start = cur_pos!(self);

        assert_and_bump!(self, '[');

        let mut elems = vec![];
        let mut comma = 0;

        while !eof!(self) && !is!(self, ']') {
            if eat!(self, ',') {
                comma += 1;
                continue;
            }
            if comma > 0 {
                // One comma is used for separating elements
                let cnt = if elems.is_empty() { comma } else { comma - 1 };
                elems.extend(iter::repeat(None).take(cnt));
                comma = 0;
            }
            let start = cur_pos!(self);

            if eat!(self, "...") {
                let dot3_token = span!(self, start);

                let pat = self.parse_binding_pat_or_ident()?;
                let pat = Pat::Rest(RestPat {
                    span: span!(self, start),
                    dot3_token,
                    arg: Box::new(pat),
                    type_ann: None,
                });
                elems.push(Some(pat));
                // Trailing comma isn't allowed
                break;
            } else {
                elems.push(self.parse_binding_element().map(Some)?);
            }
        }

        expect!(self, ']');
        let optional = (self.input.syntax().dts() || self.ctx().in_declare) && eat!(self, '?');

        Ok(Pat::Array(ArrayPat {
            span: span!(self, start),
            elems,
            optional,
            type_ann: None,
        }))
    }

    pub(super) fn eat_any_ts_modifier(&mut self) -> PResult<bool> {
        let has_modifier = self.syntax().typescript()
            && match *cur!(self, false)? {
                Word(Word::Ident(js_word!("public")))
                | Word(Word::Ident(js_word!("protected")))
                | Word(Word::Ident(js_word!("private")))
                | Word(Word::Ident(js_word!("readonly"))) => true,
                _ => false,
            }
            && (peeked_is!(self, IdentName) || peeked_is!(self, '{') || peeked_is!(self, '['));
        if has_modifier {
            let _ = self.parse_ts_modifier(&["public", "protected", "private", "readonly"]);
        }

        return Ok(has_modifier);
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
                    _ if self.input.syntax().dts() || self.ctx().in_declare => {}
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
                | Pat::Ident(BindingIdent {
                    ref mut type_ann,
                    id: Ident { ref mut span, .. },
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
                        *span = Span::new(pat_start, self.input.prev_span().hi, Default::default());
                    }
                    *type_ann = new_type_ann;
                }
                Pat::Assign(AssignPat {
                    ref mut type_ann,
                    ref mut span,
                    ..
                }) => {
                    if let Some(_) = self.try_parse_ts_type_ann()? {
                        *span = Span::new(pat_start, self.input.prev_span().hi, Default::default());
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
            if self.ctx().in_declare {
                self.emit_err(span!(self, start), SyntaxError::TS2371);
            }

            Pat::Assign(AssignPat {
                span: span!(self, start),
                left: Box::new(pat),
                type_ann: None,
                right,
            })
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
        let mut first = true;
        let mut params = vec![];

        while !eof!(self) && !is!(self, ')') {
            if first {
                first = false;
            } else {
                expect!(self, ',');
                // Handle trailing comma.
                if is!(self, ')') {
                    break;
                }
            }

            let param_start = cur_pos!(self);
            let decorators = self.parse_decorators(false)?;
            let pat_start = cur_pos!(self);

            if eat!(self, "...") {
                let dot3_token = span!(self, pat_start);

                let pat = self.parse_binding_pat_or_ident()?;
                let type_ann = if self.input.syntax().typescript() && is!(self, ':') {
                    let cur_pos = cur_pos!(self);
                    Some(self.parse_ts_type_ann(/* eat_colon */ true, cur_pos)?)
                } else {
                    None
                };

                let pat = Pat::Rest(RestPat {
                    span: span!(self, pat_start),
                    dot3_token,
                    arg: Box::new(pat),
                    type_ann,
                });
                params.push(ParamOrTsParamProp::Param(Param {
                    span: span!(self, param_start),
                    decorators,
                    pat,
                }));
                break;
            } else {
                params.push(self.parse_constructor_param(param_start, decorators)?);
            }
        }

        Ok(params)
    }

    fn parse_constructor_param(
        &mut self,
        param_start: BytePos,
        decorators: Vec<Decorator>,
    ) -> PResult<ParamOrTsParamProp> {
        let (accessibility, readonly) = if self.input.syntax().typescript() {
            let accessibility = self.parse_access_modifier()?;
            (
                accessibility,
                self.parse_ts_modifier(&["readonly"])?.is_some(),
            )
        } else {
            (None, false)
        };
        if accessibility == None && !readonly {
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
                readonly,
                decorators,
                param,
            }))
        }
    }

    pub(super) fn parse_setter_param(&mut self, key_span: Span) -> PResult<Param> {
        let params = self.parse_formal_params()?;
        let cnt = params.iter().filter(|p| is_not_this(p)).count();

        if cnt != 1 {
            self.emit_err(key_span, SyntaxError::TS1094);
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
        let mut first = true;
        let mut params = vec![];
        let mut dot3_token = Span::default();

        while !eof!(self) && !is!(self, ')') {
            if first {
                first = false;
            } else {
                if dot3_token.is_dummy() {
                    expect!(self, ',');
                } else {
                    // We are handling error.

                    eat!(self, ',');
                }

                // Handle trailing comma.
                if is!(self, ')') {
                    break;
                }
            }

            let param_start = cur_pos!(self);

            if !dot3_token.is_dummy() {
                self.emit_err(dot3_token, SyntaxError::TS1014);
            }

            let decorators = self.parse_decorators(false)?;
            let pat_start = cur_pos!(self);

            let pat = if eat!(self, "...") {
                dot3_token = span!(self, pat_start);

                let mut pat = self.parse_binding_pat_or_ident()?;

                if eat!(self, '=') {
                    let right = self.parse_assignment_expr()?;
                    self.emit_err(pat.span(), SyntaxError::TS1048);
                    pat = AssignPat {
                        span: span!(self, pat_start),
                        left: Box::new(pat),
                        right,
                        type_ann: None,
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

                let pat = Pat::Rest(RestPat {
                    span: span!(self, pat_start),
                    dot3_token,
                    arg: Box::new(pat),
                    type_ann,
                });

                if self.syntax().typescript() && eat!(self, '?') {
                    self.emit_err(self.input.prev_span(), SyntaxError::TS1047);
                    //
                }

                pat
            } else {
                self.parse_formal_param_pat()?
            };

            params.push(Param {
                span: span!(self, param_start),
                decorators,
                pat,
            });
        }

        Ok(params)
    }

    pub(super) fn parse_unique_formal_params(&mut self) -> PResult<Vec<Param>> {
        // FIXME: This is wrong
        self.parse_formal_params()
    }
}

///
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PatType {
    BindingPat,
    BindingElement,
    /// AssignmentPattern
    AssignPat,
    AssignElement,
}

impl PatType {
    pub fn element(self) -> Self {
        match self {
            PatType::BindingPat | PatType::BindingElement => PatType::BindingElement,
            PatType::AssignPat | PatType::AssignElement => PatType::AssignElement,
        }
    }
}

impl<'a, I: Tokens> Parser<I> {
    /// This does not return 'rest' pattern because non-last parameter cannot be
    /// rest.
    pub(super) fn reparse_expr_as_pat(&mut self, pat_ty: PatType, expr: Box<Expr>) -> PResult<Pat> {
        if let Expr::Invalid(i) = *expr {
            return Ok(Pat::Invalid(i));
        }

        if pat_ty == PatType::AssignPat {
            match *expr {
                Expr::Object(..) | Expr::Array(..) => {
                    // It is a Syntax Error if LeftHandSideExpression is either
                    // an ObjectLiteral or an ArrayLiteral
                    // and LeftHandSideExpression cannot
                    // be reparsed as an AssignmentPattern.
                }

                _ => {
                    self.check_assign_target(&expr, true);
                }
            }
        }

        self.reparse_expr_as_pat_inner(pat_ty, expr)
    }

    pub(super) fn reparse_expr_as_pat_inner(
        &mut self,
        pat_ty: PatType,
        expr: Box<Expr>,
    ) -> PResult<Pat> {
        // In dts, we do not reparse.
        debug_assert!(!self.input.syntax().dts());

        let span = expr.span();

        if pat_ty == PatType::AssignPat {
            match *expr {
                Expr::Object(..) | Expr::Array(..) => {
                    // It is a Syntax Error if LeftHandSideExpression is either
                    // an ObjectLiteral or an ArrayLiteral
                    // and LeftHandSideExpression cannot
                    // be reparsed as an AssignmentPattern.
                }

                _ => match *expr {
                    // It is a Syntax Error if the LeftHandSideExpression is
                    // CoverParenthesizedExpressionAndArrowParameterList:(Expression) and
                    // Expression derives a phrase that would produce a Syntax Error according
                    // to these rules if that phrase were substituted for
                    // LeftHandSideExpression. This rule is recursively applied.
                    Expr::Paren(..) => {
                        return Ok(Pat::Expr(expr));
                    }
                    Expr::Ident(i) => return Ok(i.into()),
                    _ => {
                        return Ok(Pat::Expr(expr));
                    }
                },
            }
        }

        // AssignmentElement:
        //      DestructuringAssignmentTarget Initializer[+In]?
        //
        // DestructuringAssignmentTarget:
        //      LeftHandSideExpression
        if pat_ty == PatType::AssignElement {
            match *expr {
                Expr::Array(..) | Expr::Object(..) => {}

                Expr::Member(..)
                | Expr::Call(..)
                | Expr::New(..)
                | Expr::Lit(..)
                | Expr::Ident(..)
                | Expr::Fn(..)
                | Expr::Class(..)
                | Expr::Tpl(..) => {
                    if !expr.is_valid_simple_assignment_target(self.ctx().strict) {
                        self.emit_err(span, SyntaxError::NotSimpleAssign)
                    }
                    match *expr {
                        Expr::Ident(i) => return Ok(i.into()),
                        _ => {
                            return Ok(Pat::Expr(expr));
                        }
                    }
                }

                // It's special because of optional initializer
                Expr::Assign(..) => {}

                _ => self.emit_err(span, SyntaxError::InvalidPat),
            }
        }

        match *expr {
            Expr::Paren(..) => {
                self.emit_err(span, SyntaxError::InvalidPat);
                Ok(Pat::Invalid(Invalid { span }))
            }
            Expr::Assign(
                assign_expr
                @
                AssignExpr {
                    op: AssignOpToken::Assign,
                    ..
                },
            ) => {
                let AssignExpr {
                    span, left, right, ..
                } = assign_expr;
                Ok(Pat::Assign(AssignPat {
                    span,
                    left: match left {
                        PatOrExpr::Expr(left) => Box::new(self.reparse_expr_as_pat(pat_ty, left)?),
                        PatOrExpr::Pat(left) => left,
                    },
                    right,
                    type_ann: None,
                }))
            }
            Expr::Object(ObjectLit { span, props }) => {
                // {}
                Ok(Pat::Object(ObjectPat {
                    span,
                    props: props
                        .into_iter()
                        .map(|prop| {
                            let span = prop.span();
                            match prop {
                                PropOrSpread::Prop(prop) => match *prop {
                                    Prop::Shorthand(id) => {
                                        Ok(ObjectPatProp::Assign(AssignPatProp {
                                            span: id.span(),
                                            key: id,
                                            value: None,
                                        }))
                                    }
                                    Prop::KeyValue(kv_prop) => {
                                        Ok(ObjectPatProp::KeyValue(KeyValuePatProp {
                                            key: kv_prop.key,
                                            value: Box::new(self.reparse_expr_as_pat(
                                                pat_ty.element(),
                                                kv_prop.value,
                                            )?),
                                        }))
                                    }
                                    Prop::Assign(assign_prop) => {
                                        Ok(ObjectPatProp::Assign(AssignPatProp {
                                            span,
                                            key: assign_prop.key,
                                            value: Some(assign_prop.value),
                                        }))
                                    }
                                    _ => syntax_error!(self, prop.span(), SyntaxError::InvalidPat),
                                },

                                PropOrSpread::Spread(SpreadElement { dot3_token, expr }) => {
                                    Ok(ObjectPatProp::Rest(RestPat {
                                        span,
                                        dot3_token,
                                        // FIXME: is BindingPat correct?
                                        arg: Box::new(
                                            self.reparse_expr_as_pat(PatType::BindingPat, expr)?,
                                        ),
                                        type_ann: None,
                                    }))
                                }
                            }
                        })
                        .collect::<PResult<_>>()?,
                    optional: false,
                    type_ann: None,
                }))
            }
            Expr::Ident(ident) => Ok(ident.into()),
            Expr::Member(..) => Ok(Pat::Expr(expr)),
            Expr::Array(ArrayLit {
                elems: mut exprs, ..
            }) => {
                if exprs.is_empty() {
                    return Ok(Pat::Array(ArrayPat {
                        span,
                        elems: vec![],
                        optional: false,
                        type_ann: None,
                    }));
                }

                // Trailing comma may exist. We should remove those commas.
                let count_of_trailing_comma =
                    exprs.iter().rev().take_while(|e| e.is_none()).count();

                let len = exprs.len();
                let mut params = Vec::with_capacity(exprs.len() - count_of_trailing_comma);

                // Comma or other pattern cannot follow a rest pattern.
                let idx_of_rest_not_allowed = if count_of_trailing_comma == 0 {
                    len - 1
                } else {
                    // last element is comma, so rest is not allowed for every pattern element.
                    len - count_of_trailing_comma
                };

                for expr in exprs.drain(..idx_of_rest_not_allowed) {
                    match expr {
                        Some(
                            expr
                            @
                            ExprOrSpread {
                                spread: Some(..), ..
                            },
                        ) => {
                            if self.syntax().early_errors() {
                                syntax_error!(self, expr.span(), SyntaxError::NonLastRestParam)
                            }
                        }
                        Some(ExprOrSpread { expr, .. }) => {
                            params.push(self.reparse_expr_as_pat(pat_ty.element(), expr).map(Some)?)
                        }
                        None => params.push(None),
                    }
                }

                if count_of_trailing_comma == 0 {
                    let expr = exprs.into_iter().next().unwrap();
                    let last = match expr {
                        // Rest
                        Some(ExprOrSpread {
                            spread: Some(dot3_token),
                            expr,
                        }) => {
                            // TODO: is BindingPat correct?
                            let expr_span = expr.span();
                            self.reparse_expr_as_pat(pat_ty.element(), expr)
                                .map(|pat| {
                                    Pat::Rest(RestPat {
                                        span: expr_span,
                                        dot3_token,
                                        arg: Box::new(pat),
                                        type_ann: None,
                                    })
                                })
                                .map(Some)?
                        }
                        Some(ExprOrSpread { expr, .. }) => {
                            // TODO: is BindingPat correct?
                            self.reparse_expr_as_pat(pat_ty.element(), expr).map(Some)?
                        }
                        // TODO: syntax error if last element is ellison and ...rest exists.
                        None => None,
                    };
                    params.push(last);
                }
                Ok(Pat::Array(ArrayPat {
                    span,
                    elems: params,
                    optional: false,
                    type_ann: None,
                }))
            }

            // Invalid patterns.
            // Note that assignment expression with '=' is valid, and handled above.
            Expr::Lit(..) | Expr::Assign(..) => {
                self.emit_err(span, SyntaxError::InvalidPat);
                Ok(Pat::Invalid(Invalid { span }))
            }

            Expr::Yield(..) if self.ctx().in_generator => {
                self.emit_err(span, SyntaxError::InvalidPat);
                Ok(Pat::Invalid(Invalid { span }))
            }

            _ => {
                self.emit_err(span, SyntaxError::InvalidPat);

                Ok(Pat::Invalid(Invalid { span }))
            }
        }
    }

    pub(super) fn parse_paren_items_as_params(
        &mut self,
        mut exprs: Vec<PatOrExprOrSpread>,
    ) -> PResult<Vec<Pat>> {
        let pat_ty = PatType::BindingPat;

        let len = exprs.len();
        if len == 0 {
            return Ok(vec![]);
        }

        let mut params = Vec::with_capacity(len);

        for expr in exprs.drain(..len - 1) {
            match expr {
                PatOrExprOrSpread::ExprOrSpread(ExprOrSpread {
                    spread: Some(..), ..
                })
                | PatOrExprOrSpread::Pat(Pat::Rest(..)) => {
                    if self.syntax().early_errors() {
                        syntax_error!(self, expr.span(), SyntaxError::NonLastRestParam)
                    }
                }
                PatOrExprOrSpread::ExprOrSpread(ExprOrSpread {
                    spread: None, expr, ..
                }) => params.push(self.reparse_expr_as_pat(pat_ty, expr)?),
                PatOrExprOrSpread::Pat(pat) => params.push(pat),
            }
        }

        debug_assert_eq!(exprs.len(), 1);
        let expr = exprs.into_iter().next().unwrap();
        let last = match expr {
            // Rest
            PatOrExprOrSpread::ExprOrSpread(ExprOrSpread {
                spread: Some(dot3_token),
                expr,
            }) => {
                let expr_span = expr.span();
                self.reparse_expr_as_pat(pat_ty, expr).map(|pat| {
                    Pat::Rest(RestPat {
                        span: expr_span,
                        dot3_token,
                        arg: Box::new(pat),
                        type_ann: None,
                    })
                })?
            }
            PatOrExprOrSpread::ExprOrSpread(ExprOrSpread { expr, .. }) => {
                self.reparse_expr_as_pat(pat_ty, expr)?
            }
            PatOrExprOrSpread::Pat(pat) => pat,
        };
        params.push(last);

        Ok(params)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::DUMMY_SP as span;
    use swc_ecma_visit::assert_eq_ignore_span;

    fn array_pat(s: &'static str) -> Pat {
        test_parser(s, Syntax::default(), |p| p.parse_array_binding_pat())
    }

    fn object_pat(s: &'static str) -> Pat {
        test_parser(s, Syntax::default(), |p| p.parse_binding_pat_or_ident())
    }

    fn ident(s: &str) -> Ident {
        Ident::new(s.into(), span)
    }

    fn rest() -> Option<Pat> {
        Some(Pat::Rest(RestPat {
            span,
            dot3_token: span,
            type_ann: None,
            arg: Box::new(Pat::Ident(ident("tail").into())),
        }))
    }

    #[test]
    fn array_pat_simple() {
        assert_eq_ignore_span!(
            array_pat("[a, [b], [c]]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![
                    Some(Pat::Ident(ident("a").into())),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("b").into()))],
                        type_ann: None
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("c").into()))],
                        type_ann: None
                    }))
                ],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_pat_empty_start() {
        assert_eq_ignore_span!(
            array_pat("[, a, [b], [c]]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![
                    None,
                    Some(Pat::Ident(ident("a").into())),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("b").into()))],
                        type_ann: None
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("c").into()))],
                        type_ann: None
                    }))
                ],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_pat_empty() {
        assert_eq_ignore_span!(
            array_pat("[a, , [b], [c]]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![
                    Some(Pat::Ident(ident("a").into())),
                    None,
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("b").into()))],
                        type_ann: None
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("c").into()))],
                        type_ann: None
                    }))
                ],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_binding_pattern_tail() {
        assert_eq_ignore_span!(
            array_pat("[...tail]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![rest()],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_binding_pattern_assign() {
        assert_eq_ignore_span!(
            array_pat("[,a=1,]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![
                    None,
                    Some(Pat::Assign(AssignPat {
                        type_ann: None,
                        span,
                        left: Box::new(Pat::Ident(ident("a").into())),
                        right: Box::new(Expr::Lit(Lit::Num(Number { span, value: 1.0 })))
                    }))
                ],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_binding_pattern_tail_with_elems() {
        assert_eq_ignore_span!(
            array_pat("[,,,...tail]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![None, None, None, rest()],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_binding_pattern_tail_inside_tail() {
        assert_eq_ignore_span!(
            array_pat("[,,,...[...tail]]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![
                    None,
                    None,
                    None,
                    Some(Pat::Rest(RestPat {
                        span,
                        dot3_token: span,
                        type_ann: None,
                        arg: Box::new(Pat::Array(ArrayPat {
                            span,
                            optional: false,
                            elems: vec![rest()],
                            type_ann: None
                        }))
                    }))
                ],
                type_ann: None
            })
        );
    }

    #[test]
    fn object_binding_pattern_tail() {
        assert_eq_ignore_span!(
            object_pat("{...obj}"),
            Pat::Object(ObjectPat {
                span,
                type_ann: None,
                optional: false,
                props: vec![ObjectPatProp::Rest(RestPat {
                    span,
                    dot3_token: span,
                    type_ann: None,
                    arg: Box::new(Pat::Ident(ident("obj").into()))
                })]
            })
        );
    }

    #[test]
    fn object_binding_pattern_with_prop() {
        assert_eq_ignore_span!(
            object_pat("{prop = 10 }"),
            Pat::Object(ObjectPat {
                span,
                type_ann: None,
                optional: false,
                props: vec![ObjectPatProp::Assign(AssignPatProp {
                    span,
                    key: ident("prop"),
                    value: Some(Box::new(Expr::Lit(Lit::Num(Number { span, value: 10.0 }))))
                })]
            })
        );
    }

    #[test]
    fn object_binding_pattern_with_prop_and_label() {
        fn prop(key: PropName, assign_name: &str, expr: Expr) -> PropOrSpread {
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key,
                value: Box::new(Expr::Assign(AssignExpr {
                    span,
                    op: AssignOp::Assign,
                    left: PatOrExpr::Pat(Box::new(Pat::Ident(ident(assign_name).into()))),
                    right: Box::new(expr),
                })),
            })))
        }

        assert_eq_ignore_span!(
            object_pat(
                "{obj = {$: num = 10, '': sym = '', \" \": quote = \" \", _: under = [...tail],}}"
            ),
            Pat::Object(ObjectPat {
                span,
                type_ann: None,
                optional: false,
                props: vec![ObjectPatProp::Assign(AssignPatProp {
                    span,
                    key: ident("obj"),
                    value: Some(Box::new(Expr::Object(ObjectLit {
                        span,
                        props: vec![
                            prop(
                                PropName::Ident(ident("$")),
                                "num",
                                Expr::Lit(Lit::Num(Number { span, value: 10.0 }))
                            ),
                            prop(
                                PropName::Str(Str {
                                    span,
                                    has_escape: false,
                                    value: "".into(),
                                    kind: StrKind::Normal {
                                        contains_quote: true
                                    }
                                }),
                                "sym",
                                Expr::Lit(Lit::Str(Str {
                                    span,
                                    has_escape: false,
                                    value: "".into(),
                                    kind: StrKind::Normal {
                                        contains_quote: true
                                    }
                                }))
                            ),
                            prop(
                                PropName::Str(Str {
                                    span,
                                    has_escape: false,
                                    value: " ".into(),
                                    kind: StrKind::Normal {
                                        contains_quote: true
                                    }
                                }),
                                "quote",
                                Expr::Lit(Lit::Str(Str {
                                    span,
                                    has_escape: false,
                                    value: " ".into(),
                                    kind: StrKind::Normal {
                                        contains_quote: true
                                    }
                                }))
                            ),
                            prop(
                                PropName::Ident(ident("_")),
                                "under",
                                Expr::Array(ArrayLit {
                                    span,
                                    elems: vec![Some(ExprOrSpread {
                                        spread: Some(span),
                                        expr: Box::new(Expr::Ident(ident("tail")))
                                    })]
                                })
                            ),
                        ]
                    })))
                })]
            })
        );
    }
}
