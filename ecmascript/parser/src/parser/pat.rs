//! 13.3.3 Destructuring Binding Patterns
use super::{util::ExprExt, *};
use crate::{parser::expr::PatOrExprOrSpread, token::AssignOpToken};
use std::iter;
use swc_atoms::js_word;
use swc_common::Spanned;

#[parser]
impl<'a, I: Tokens> Parser<I> {
    pub(super) fn parse_opt_binding_ident(&mut self) -> PResult<Option<Ident>> {
        trace_cur!(parse_opt_binding_ident);

        if is!(BindingIdent) || (self.input.syntax().typescript() && is!("this")) {
            self.parse_binding_ident().map(Some)
        } else {
            Ok(None)
        }
    }

    /// babel: `parseBindingIdentifier`
    ///
    /// spec: `BindingIdentifier`
    pub(super) fn parse_binding_ident(&mut self) -> PResult<Ident> {
        trace_cur!(parse_binding_ident);

        // "yield" and "await" is **lexically** accepted.
        let ident = self.parse_ident(true, true)?;
        if self.ctx().strict && (&*ident.sym == "arguments" || &*ident.sym == "eval") {
            self.emit_err(ident.span, SyntaxError::EvalAndArgumentsInStrict);
        }
        if self.ctx().in_async && ident.sym == js_word!("await") {
            self.emit_err(ident.span, SyntaxError::ExpectedIdent);
        }
        if self.ctx().in_generator && ident.sym == js_word!("yield") {
            self.emit_err(ident.span, SyntaxError::ExpectedIdent);
        }

        Ok(ident)
    }

    pub(super) fn parse_binding_pat_or_ident(&mut self) -> PResult<Pat> {
        trace_cur!(parse_binding_pat_or_ident);

        match *cur!(true)? {
            tok!("yield") | Word(..) => self.parse_binding_ident().map(Pat::from),
            tok!('[') => self.parse_array_binding_pat(),
            tok!('{') => self.parse_object(),
            // tok!('(') => {
            //     bump!();
            //     let pat = self.parse_binding_pat_or_ident()?;
            //     expect!(')');
            //     Ok(pat)
            // }
            _ => unexpected!("yield, an identifier, [ or {"),
        }
    }

    /// babel: `parseBindingAtom`
    pub(super) fn parse_binding_element(&mut self) -> PResult<Pat> {
        trace_cur!(parse_binding_element);

        let start = cur_pos!();
        let left = self.parse_binding_pat_or_ident()?;

        if eat!('=') {
            let right = self.include_in_expr(true).parse_assignment_expr()?;

            if self.ctx().in_declare {
                self.emit_err(span!(start), SyntaxError::TS2371);
            }

            return Ok(Pat::Assign(AssignPat {
                span: span!(start),
                left: Box::new(left),
                right,
                type_ann: None,
            }));
        }

        Ok(left)
    }

    fn parse_array_binding_pat(&mut self) -> PResult<Pat> {
        let start = cur_pos!();

        assert_and_bump!('[');

        let mut elems = vec![];
        let mut comma = 0;

        while !eof!() && !is!(']') {
            if eat!(',') {
                comma += 1;
                continue;
            }
            if comma > 0 {
                // One comma is used for separating elements
                let cnt = if elems.is_empty() { comma } else { comma - 1 };
                elems.extend(iter::repeat(None).take(cnt));
                comma = 0;
            }
            let start = cur_pos!();

            if eat!("...") {
                let dot3_token = span!(start);

                let pat = self.parse_binding_pat_or_ident()?;
                let pat = Pat::Rest(RestPat {
                    span: span!(start),
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

        expect!(']');
        let optional = (self.input.syntax().dts() || self.ctx().in_declare) && eat!('?');

        Ok(Pat::Array(ArrayPat {
            span: span!(start),
            elems,
            optional,
            type_ann: None,
        }))
    }

    pub(super) fn eat_any_ts_modifier(&mut self) -> PResult<bool> {
        let has_modifier = self.syntax().typescript()
            && match *cur!(false)? {
                Word(Word::Ident(js_word!("public")))
                | Word(Word::Ident(js_word!("protected")))
                | Word(Word::Ident(js_word!("private")))
                | Word(Word::Ident(js_word!("readonly"))) => true,
                _ => false,
            }
            && (peeked_is!(IdentName) || peeked_is!('{') || peeked_is!('['));
        if has_modifier {
            let _ = self.parse_ts_modifier(&["public", "protected", "private", "readonly"]);
        }

        return Ok(has_modifier);
    }

    /// spec: 'FormalParameter'
    ///
    /// babel: `parseAssignableListItem`
    pub(super) fn parse_formal_param_pat(&mut self) -> PResult<Pat> {
        let start = cur_pos!();

        let has_modifier = self.eat_any_ts_modifier()?;

        let pat_start = cur_pos!();
        let mut pat = self.parse_binding_element()?;
        let mut opt = false;

        if self.input.syntax().typescript() {
            if eat!('?') {
                match pat {
                    Pat::Ident(Ident {
                        ref mut optional, ..
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
                | Pat::Assign(AssignPat {
                    ref mut type_ann,
                    ref mut span,
                    ..
                })
                | Pat::Ident(Ident {
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
                        *span = Span::new(pat_start, self.input.prev_span().hi, Default::default());
                    }
                    *type_ann = new_type_ann;
                }
                Pat::Invalid(..) => {}
                _ => unreachable!("invalid syntax: Pat: {:?}", pat),
            }
        }

        let pat = if eat!('=') {
            // `=` cannot follow optional parameter.
            if opt {
                self.emit_err(pat.span(), SyntaxError::TS1015);
            }

            let right = self.parse_assignment_expr()?;
            if self.ctx().in_declare {
                self.emit_err(span!(start), SyntaxError::TS2371);
            }

            Pat::Assign(AssignPat {
                span: span!(start),
                left: Box::new(pat),
                type_ann: None,
                right,
            })
        } else {
            pat
        };

        if has_modifier {
            self.emit_err(span!(start), SyntaxError::TS2369);
            return Ok(pat);
        }

        Ok(pat)
    }

    pub(super) fn parse_constructor_params(&mut self) -> PResult<Vec<ParamOrTsParamProp>> {
        let mut first = true;
        let mut params = vec![];

        while !eof!() && !is!(')') {
            if first {
                first = false;
            } else {
                expect!(',');
                // Handle trailing comma.
                if is!(')') {
                    break;
                }
            }

            let param_start = cur_pos!();
            let decorators = self.parse_decorators(false)?;
            let pat_start = cur_pos!();

            if eat!("...") {
                let dot3_token = span!(pat_start);

                let pat = self.parse_binding_pat_or_ident()?;
                let type_ann = if self.input.syntax().typescript() && is!(':') {
                    let cur_pos = cur_pos!();
                    Some(self.parse_ts_type_ann(/* eat_colon */ true, cur_pos)?)
                } else {
                    None
                };

                let pat = Pat::Rest(RestPat {
                    span: span!(pat_start),
                    dot3_token,
                    arg: Box::new(pat),
                    type_ann,
                });
                params.push(ParamOrTsParamProp::Param(Param {
                    span: span!(param_start),
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
                span: span!(param_start),
                decorators,
                pat,
            }))
        } else {
            let param = match self.parse_formal_param_pat()? {
                Pat::Ident(i) => TsParamPropParam::Ident(i),
                Pat::Assign(a) => TsParamPropParam::Assign(a),
                node => syntax_error!(node.span(), SyntaxError::TsInvalidParamPropPat),
            };
            Ok(ParamOrTsParamProp::TsParamProp(TsParamProp {
                span: span!(param_start),
                accessibility,
                readonly,
                decorators,
                param,
            }))
        }
    }

    pub(super) fn parse_formal_params(&mut self) -> PResult<Vec<Param>> {
        let mut first = true;
        let mut params = vec![];
        let mut dot3_token = Span::default();

        while !eof!() && !is!(')') {
            if first {
                first = false;
            } else {
                if dot3_token.is_dummy() {
                    expect!(',');
                } else {
                    // We are handling error.

                    eat!(',');
                }

                // Handle trailing comma.
                if is!(')') {
                    break;
                }
            }

            let param_start = cur_pos!();

            if !dot3_token.is_dummy() {
                self.emit_err(dot3_token, SyntaxError::TS1014);
            }

            let decorators = self.parse_decorators(false)?;
            let pat_start = cur_pos!();

            let pat = if eat!("...") {
                dot3_token = span!(pat_start);

                let mut pat = self.parse_binding_pat_or_ident()?;

                if eat!('=') {
                    let right = self.parse_assignment_expr()?;
                    self.emit_err(pat.span(), SyntaxError::TS1048);
                    pat = AssignPat {
                        span: span!(pat_start),
                        left: Box::new(pat),
                        right,
                        type_ann: None,
                    }
                    .into();
                }

                let type_ann = if self.input.syntax().typescript() && is!(':') {
                    let cur_pos = cur_pos!();
                    let ty = self.parse_ts_type_ann(/* eat_colon */ true, cur_pos)?;
                    Some(ty)
                } else {
                    None
                };

                let pat = Pat::Rest(RestPat {
                    span: span!(pat_start),
                    dot3_token,
                    arg: Box::new(pat),
                    type_ann,
                });

                if self.syntax().typescript() && eat!('?') {
                    self.emit_err(self.input.prev_span(), SyntaxError::TS1047);
                    //
                }

                pat
            } else {
                self.parse_formal_param_pat()?
            };

            params.push(Param {
                span: span!(param_start),
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
    /// AssigmentPattern
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

#[parser]
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

                // It's special because of optional intializer
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
                                    _ => syntax_error!(prop.span(), SyntaxError::InvalidPat),
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
                                syntax_error!(expr.span(), SyntaxError::NonLastRestParam)
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
                        // TODO: sytax error if last element is ellison and ...rest exists.
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
                        syntax_error!(expr.span(), SyntaxError::NonLastRestParam)
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

    fn ident(s: &str) -> Ident {
        Ident::new(s.into(), span)
    }

    #[test]
    fn array_pat_simple() {
        assert_eq_ignore_span!(
            array_pat("[a, [b], [c]]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![
                    Some(Pat::Ident(ident("a"))),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("b")))],
                        type_ann: None
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("c")))],
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
                    Some(Pat::Ident(ident("a"))),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("b")))],
                        type_ann: None
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("c")))],
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
                    Some(Pat::Ident(ident("a"))),
                    None,
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("b")))],
                        type_ann: None
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("c")))],
                        type_ann: None
                    }))
                ],
                type_ann: None
            })
        );
    }
}
