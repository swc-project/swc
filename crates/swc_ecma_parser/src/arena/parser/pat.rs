//! 13.3.3 Destructuring Binding Patterns

use swc_allocator::arena::{Box, Vec};
use swc_common::Spanned;
use util::ExprExt;

use super::{class_and_fn::is_not_this, expr::AssignTargetOrSpread, *};
use crate::{
    token::{IdentLike, Keyword},
    Tokens,
};

impl<'a, I: Tokens> Parser<'a, I> {
    pub fn parse_pat(&mut self) -> PResult<Pat<'a>> {
        self.parse_binding_pat_or_ident(false)
    }

    pub(crate) fn parse_opt_binding_ident(
        &mut self,
        disallow_let: bool,
    ) -> PResult<Option<BindingIdent<'a>>> {
        trace_cur!(self, parse_opt_binding_ident);

        if is!(self, BindingIdent) || (self.input.syntax().typescript() && is!(self, "this")) {
            self.parse_binding_ident(disallow_let).map(Some)
        } else {
            Ok(None)
        }
    }

    /// babel: `parseBindingIdentifier`
    ///
    /// spec: `BindingIdentifier`
    pub(crate) fn parse_binding_ident(&mut self, disallow_let: bool) -> PResult<BindingIdent<'a>> {
        trace_cur!(self, parse_binding_ident);

        if disallow_let {
            if let Some(Token::Word(Word::Keyword(Keyword::Let))) = self.input.cur() {
                unexpected!(self, "let is reserved in const, let, class declaration")
            }
        }

        // "yield" and "await" is **lexically** accepted.
        let ident = self.parse_ident(true, true)?;
        if ident.is_reserved_in_strict_bind() {
            self.emit_strict_mode_err(ident.span, SyntaxError::EvalAndArgumentsInStrict);
        }
        if (self.ctx().in_async || self.ctx().in_static_block) && ident.sym == "await" {
            self.emit_err(ident.span, SyntaxError::ExpectedIdent);
        }
        if self.ctx().in_generator && ident.sym == "yield" {
            self.emit_err(ident.span, SyntaxError::ExpectedIdent);
        }

        Ok(ident.into())
    }

    pub(crate) fn parse_binding_pat_or_ident(&mut self, disallow_let: bool) -> PResult<Pat<'a>> {
        trace_cur!(self, parse_binding_pat_or_ident);

        match *cur!(self, true) {
            tok!("yield") | Word(..) => self
                .parse_binding_ident(disallow_let)
                .map(|ident| Pat::Ident(self.ast(ident))),
            tok!('[') => self.parse_array_binding_pat(),
            tok!('{') => self.parse_object_pat(),
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
    pub(crate) fn parse_binding_element(&mut self) -> PResult<Pat<'a>> {
        trace_cur!(self, parse_binding_element);

        let start = cur_pos!(self);
        let left = self.parse_binding_pat_or_ident(false)?;

        if eat!(self, '=') {
            let right = self.include_in_expr(true).parse_assignment_expr()?;

            if self.ctx().in_declare {
                self.emit_err(span!(self, start), SyntaxError::TS2371);
            }

            return Ok(Pat::Assign(self.ast(AssignPat {
                span: span!(self, start),
                left,
                right,
            })));
        }

        Ok(left)
    }

    fn parse_array_binding_pat(&mut self) -> PResult<Pat<'a>> {
        let start = cur_pos!(self);

        assert_and_bump!(self, '[');

        let mut elems = Vec::new_in(self.alloc);
        let mut comma = 0;
        let mut rest_span = Span::default();

        while !eof!(self) && !is!(self, ']') {
            if !rest_span.is_dummy() {
                self.emit_err(rest_span, SyntaxError::NonLastRestParam);
            }

            if eat!(self, ',') {
                comma += 1;
                continue;
            }
            if comma > 0 {
                for _ in 0..comma {
                    elems.push(None);
                }
                comma = 0;
            }
            let start = cur_pos!(self);

            let mut is_rest = false;
            if eat!(self, "...") {
                is_rest = true;
                let dot3_token = span!(self, start);

                let pat = self.parse_binding_pat_or_ident(false)?;
                rest_span = span!(self, start);
                let pat = Pat::Rest(self.ast(RestPat {
                    span: rest_span,
                    dot3_token,
                    arg: pat,
                    type_ann: None,
                }));
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
        let optional = (self.input.syntax().dts() || self.ctx().in_declare) && eat!(self, '?');

        Ok(Pat::Array(self.ast(ArrayPat {
            span: span!(self, start),
            elems,
            optional,
            type_ann: None,
        })))
    }

    pub(crate) fn eat_any_ts_modifier(&mut self) -> PResult<bool> {
        let has_modifier = self.syntax().typescript()
            && matches!(
                *cur!(self, false)?,
                Word(Word::Ident(IdentLike::Known(
                    known_ident!("public")
                        | known_ident!("protected")
                        | known_ident!("private")
                        | known_ident!("readonly")
                )))
            )
            && (peeked_is!(self, IdentName) || peeked_is!(self, '{') || peeked_is!(self, '['));
        if has_modifier {
            let _ = self.parse_ts_modifier(&["public", "protected", "private", "readonly"], false);
        }

        Ok(has_modifier)
    }

    /// spec: 'FormalParameter'
    ///
    /// babel: `parseAssignableListItem`
    pub(crate) fn parse_formal_param_pat(&mut self) -> PResult<Pat<'a>> {
        let start = cur_pos!(self);

        let has_modifier = self.eat_any_ts_modifier()?;

        let pat_start = cur_pos!(self);
        let mut pat = self.parse_binding_element()?;
        let mut opt = false;

        if self.input.syntax().typescript() {
            if eat!(self, '?') {
                match &mut pat {
                    Pat::Ident(ident) => {
                        ident.id.optional = true;
                        opt = true;
                    }
                    Pat::Array(array_pat) => {
                        array_pat.optional = true;
                        opt = true;
                    }
                    Pat::Object(object_pat) => {
                        object_pat.optional = true;
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

            match &mut pat {
                Pat::Array(p) => {
                    let new_type_ann = self.try_parse_ts_type_ann()?;
                    if new_type_ann.is_some() {
                        p.span = Span::new(pat_start, self.input.prev_span().hi);
                    }
                    p.type_ann = new_type_ann;
                }
                Pat::Object(p) => {
                    let new_type_ann = self.try_parse_ts_type_ann()?;
                    if new_type_ann.is_some() {
                        p.span = Span::new(pat_start, self.input.prev_span().hi);
                    }
                    p.type_ann = new_type_ann;
                }
                Pat::Rest(p) => {
                    let new_type_ann = self.try_parse_ts_type_ann()?;
                    if new_type_ann.is_some() {
                        p.span = Span::new(pat_start, self.input.prev_span().hi);
                    }
                    p.type_ann = new_type_ann;
                }
                Pat::Ident(ident) => {
                    let new_type_ann = self.try_parse_ts_type_ann()?;
                    ident.type_ann = new_type_ann;
                }

                Pat::Assign(assign_pat) => {
                    if (self.try_parse_ts_type_ann()?).is_some() {
                        assign_pat.span = Span::new(pat_start, self.input.prev_span().hi);
                        self.emit_err(assign_pat.span, SyntaxError::TSTypeAnnotationAfterAssign);
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

            Pat::Assign(self.ast(AssignPat {
                span: span!(self, start),
                left: pat,
                right,
            }))
        } else {
            pat
        };

        if has_modifier {
            self.emit_err(span!(self, start), SyntaxError::TS2369);
            return Ok(pat);
        }

        Ok(pat)
    }

    pub(crate) fn parse_constructor_params(&mut self) -> PResult<Vec<'a, ParamOrTsParamProp<'a>>> {
        let mut params = Vec::new_in(self.alloc);
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
                let pat = Pat::Rest(self.ast(RestPat {
                    span: rest_span,
                    dot3_token,
                    arg: pat,
                    type_ann,
                }));
                params.push(ParamOrTsParamProp::Param(self.ast(Param {
                    span: span!(self, param_start),
                    decorators,
                    pat,
                })));
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
        decorators: Vec<'a, Decorator<'a>>,
    ) -> PResult<ParamOrTsParamProp<'a>> {
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
            Ok(ParamOrTsParamProp::Param(self.ast(Param {
                span: span!(self, param_start),
                decorators,
                pat,
            })))
        } else {
            let param = match self.parse_formal_param_pat()? {
                Pat::Ident(i) => TsParamPropParam::Ident(i),
                Pat::Assign(a) => TsParamPropParam::Assign(a),
                node => syntax_error!(self, node.span(), SyntaxError::TsInvalidParamPropPat),
            };
            Ok(ParamOrTsParamProp::TsParamProp(self.ast(TsParamProp {
                span: span!(self, param_start),
                accessibility,
                is_override,
                readonly,
                decorators,
                param,
            })))
        }
    }

    #[allow(dead_code)]
    pub(crate) fn parse_setter_param(&mut self, key_span: Span) -> PResult<Box<'a, Param<'a>>> {
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

        Ok(self.ast(params.into_iter().next().unwrap()))
    }

    pub(crate) fn parse_formal_params(&mut self) -> PResult<Vec<'a, Param<'a>>> {
        let mut params = Vec::new_in(self.alloc);
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
                    pat = Pat::Assign(self.ast(AssignPat {
                        span: span!(self, pat_start),
                        left: pat,
                        right,
                    }));
                }

                let type_ann = if self.input.syntax().typescript() && is!(self, ':') {
                    let cur_pos = cur_pos!(self);
                    let ty = self.parse_ts_type_ann(/* eat_colon */ true, cur_pos)?;
                    Some(ty)
                } else {
                    None
                };

                rest_span = span!(self, pat_start);
                let pat = Pat::Rest(self.ast(RestPat {
                    span: rest_span,
                    dot3_token,
                    arg: pat,
                    type_ann,
                }));

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

    pub(crate) fn parse_unique_formal_params(&mut self) -> PResult<Vec<'a, Param<'a>>> {
        // FIXME: This is wrong
        self.parse_formal_params()
    }
}

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

impl<'a, I: Tokens> Parser<'a, I> {
    /// This does not return 'rest' pattern because non-last parameter cannot be
    /// rest.
    pub(crate) fn reparse_expr_as_pat(
        &mut self,
        pat_ty: PatType,
        expr: Expr<'a>,
    ) -> PResult<Pat<'a>> {
        if let Expr::Invalid(i) = expr {
            return Ok(i.into());
        }

        if pat_ty == PatType::AssignPat {
            match expr {
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

    fn reparse_expr_as_pat_inner(&mut self, pat_ty: PatType, expr: Expr<'a>) -> PResult<Pat<'a>> {
        // In dts, we do not reparse.
        debug_assert!(!self.input.syntax().dts());

        let span = expr.span();

        if pat_ty == PatType::AssignPat {
            match expr {
                Expr::Object(..) | Expr::Array(..) => {
                    // It is a Syntax Error if LeftHandSideExpression is either
                    // an ObjectLiteral or an ArrayLiteral
                    // and LeftHandSideExpression cannot
                    // be reparsed as an AssignmentPattern.
                }

                _ => match expr {
                    // It is a Syntax Error if the LeftHandSideExpression is
                    // CoverParenthesizedExpressionAndArrowParameterList:(Expression) and
                    // Expression derives a phrase that would produce a Syntax Error according
                    // to these rules if that phrase were substituted for
                    // LeftHandSideExpression. This rule is recursively applied.
                    Expr::Paren(..) => {
                        return Ok(Pat::Expr(expr));
                    }
                    Expr::Ident(i) => return Ok(Pat::Ident(self.ast(i.into_inner().into()))),
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
            match expr {
                Expr::Array(..) | Expr::Object(..) => {}

                Expr::Member(..)
                | Expr::SuperProp(..)
                | Expr::Call(..)
                | Expr::New(..)
                | Expr::Lit(..)
                | Expr::Ident(..)
                | Expr::Fn(..)
                | Expr::Class(..)
                | Expr::Paren(..)
                | Expr::Tpl(..)
                | Expr::TsAs(..) => {
                    if !expr.is_valid_simple_assignment_target(self.ctx().strict) {
                        self.emit_err(span, SyntaxError::NotSimpleAssign)
                    }
                    match expr {
                        Expr::Ident(i) => return Ok(Pat::Ident(self.ast(i.into_inner().into()))),
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

        match expr {
            Expr::Paren(..) => {
                self.emit_err(span, SyntaxError::InvalidPat);
                Ok(Pat::Invalid(self.ast(Invalid { span })))
            }
            Expr::Assign(assign_expr) if assign_expr.op == AssignOp::Assign => {
                let AssignExpr {
                    span, left, right, ..
                } = assign_expr.into_inner();
                let left = match left {
                    AssignTarget::Simple(left) => {
                        self.reparse_expr_as_pat(pat_ty, left.into_expr(self.alloc))?
                    }
                    AssignTarget::Pat(pat) => pat.into(),
                };
                Ok(Pat::Assign(self.ast(AssignPat { span, left, right })))
            }
            Expr::Object(obj) => {
                let obj = obj.into_inner();
                let len = obj.props.len();
                let mut props = Vec::new_in(self.alloc);
                for (idx, prop) in obj.props.into_iter().enumerate() {
                    let span = prop.span();
                    let prop = match prop {
                        PropOrSpread::Prop(prop) => {
                            let prop = prop.into_inner();
                            match prop {
                                Prop::Shorthand(id) => {
                                    Ok(ObjectPatProp::Assign(self.ast(AssignPatProp {
                                        span: id.span(),
                                        key: id.into_inner().into(),
                                        value: None,
                                    })))
                                }
                                Prop::KeyValue(kv_prop) => {
                                    let kv_prop = kv_prop.into_inner();
                                    let value =
                                        self.reparse_expr_as_pat(pat_ty.element(), kv_prop.value)?;
                                    Ok(ObjectPatProp::KeyValue(self.ast(KeyValuePatProp {
                                        key: kv_prop.key,
                                        value,
                                    })))
                                }
                                Prop::Assign(assign_prop) => {
                                    let assign_prop = assign_prop.into_inner();
                                    Ok(ObjectPatProp::Assign(self.ast(AssignPatProp {
                                        span,
                                        key: assign_prop.key.into(),
                                        value: Some(assign_prop.value),
                                    })))
                                }
                                _ => syntax_error!(self, prop.span(), SyntaxError::InvalidPat),
                            }
                        }

                        PropOrSpread::Spread(spread) => {
                            let spread = spread.into_inner();
                            if idx != len - 1 {
                                self.emit_err(span, SyntaxError::NonLastRestParam)
                            } else if let Some(trailing_comma) =
                                self.state.trailing_commas.get(&obj.span.lo)
                            {
                                self.emit_err(*trailing_comma, SyntaxError::CommaAfterRestElement);
                            };

                            let element_pat_ty = pat_ty.element();
                            let pat = if let PatType::BindingElement = element_pat_ty {
                                if let Expr::Ident(i) = spread.expr {
                                    Pat::Ident(self.ast(i.into_inner().into()))
                                } else {
                                    self.emit_err(span, SyntaxError::DotsWithoutIdentifier);
                                    Pat::Invalid(self.ast(Invalid { span }))
                                }
                            } else {
                                self.reparse_expr_as_pat(element_pat_ty, spread.expr)?
                            };

                            if let Pat::Assign(_) = pat {
                                self.emit_err(span, SyntaxError::TS1048)
                            };

                            Ok(ObjectPatProp::Rest(self.ast(RestPat {
                                span,
                                dot3_token: spread.dot3_token,
                                arg: pat,
                                type_ann: None,
                            })))
                        }
                    }?;
                    props.push(prop);
                }
                Ok(Pat::Object(self.ast(ObjectPat {
                    span: obj.span,
                    props,
                    optional: false,
                    type_ann: None,
                })))
            }
            Expr::Ident(ident) => Ok(Pat::Ident(self.ast(ident.into_inner().into()))),
            Expr::Array(array) => {
                let mut array = array.into_inner();
                if array.elems.is_empty() {
                    return Ok(Pat::Array(self.ast(ArrayPat {
                        span,
                        elems: Vec::new_in(self.alloc),
                        optional: false,
                        type_ann: None,
                    })));
                }

                // Trailing comma may exist. We should remove those commas.
                let count_of_trailing_comma =
                    array.elems.iter().rev().take_while(|e| e.is_none()).count();

                let len = array.elems.len();
                let mut params =
                    Vec::with_capacity_in(array.elems.len() - count_of_trailing_comma, self.alloc);

                // Comma or other pattern cannot follow a rest pattern.
                let idx_of_rest_not_allowed = if count_of_trailing_comma == 0 {
                    len - 1
                } else {
                    // last element is comma, so rest is not allowed for every pattern element.
                    len - count_of_trailing_comma
                };

                for expr in array.elems.drain(..idx_of_rest_not_allowed) {
                    match expr {
                        Some(
                            expr @ ExprOrSpread {
                                spread: Some(..), ..
                            },
                        ) => self.emit_err(expr.span(), SyntaxError::NonLastRestParam),
                        Some(ExprOrSpread { expr, .. }) => {
                            params.push(self.reparse_expr_as_pat(pat_ty.element(), expr).map(Some)?)
                        }
                        None => params.push(None),
                    }
                }

                if count_of_trailing_comma == 0 {
                    let expr = array.elems.into_iter().next().unwrap();
                    let outer_expr_span = expr.span();
                    let last = match expr {
                        // Rest
                        Some(ExprOrSpread {
                            spread: Some(dot3_token),
                            expr,
                        }) => {
                            // TODO: is BindingPat correct?
                            if let Expr::Assign(_) = expr {
                                self.emit_err(outer_expr_span, SyntaxError::TS1048);
                            };
                            if let Some(trailing_comma) = self.state.trailing_commas.get(&span.lo) {
                                self.emit_err(*trailing_comma, SyntaxError::CommaAfterRestElement);
                            }
                            let expr_span = expr.span();
                            self.reparse_expr_as_pat(pat_ty.element(), expr)
                                .map(|pat| {
                                    Pat::Rest(self.ast(RestPat {
                                        span: expr_span,
                                        dot3_token,
                                        arg: pat,
                                        type_ann: None,
                                    }))
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
                Ok(Pat::Array(self.ast(ArrayPat {
                    span,
                    elems: params,
                    optional: false,
                    type_ann: None,
                })))
            }

            // Invalid patterns.
            // Note that assignment expression with '=' is valid, and handled above.
            Expr::Lit(..) | Expr::Assign(..) => {
                self.emit_err(span, SyntaxError::InvalidPat);
                Ok(Pat::Invalid(self.ast(Invalid { span })))
            }

            Expr::Yield(..) if self.ctx().in_generator => {
                self.emit_err(span, SyntaxError::InvalidPat);
                Ok(Pat::Invalid(self.ast(Invalid { span })))
            }

            _ => {
                self.emit_err(span, SyntaxError::InvalidPat);

                Ok(Pat::Invalid(self.ast(Invalid { span })))
            }
        }
    }

    pub(crate) fn parse_paren_items_as_params(
        &mut self,
        mut exprs: Vec<'a, AssignTargetOrSpread<'a>>,
        trailing_comma: Option<Span>,
    ) -> PResult<Vec<'a, Pat<'a>>> {
        let pat_ty = PatType::BindingPat;

        let len = exprs.len();
        if len == 0 {
            return Ok(Vec::new_in(self.alloc));
        }

        let mut params = Vec::with_capacity_in(len, self.alloc);

        for expr in exprs.drain(..len - 1) {
            match expr {
                AssignTargetOrSpread::ExprOrSpread(expr_or_spread) => {
                    if expr_or_spread.spread.is_some() {
                        self.emit_err(expr_or_spread.span(), SyntaxError::TS1014)
                    } else {
                        params.push(
                            self.reparse_expr_as_pat(pat_ty, expr_or_spread.into_inner().expr)?,
                        )
                    }
                }
                AssignTargetOrSpread::Pat(ref pat) if pat.is_rest() => {
                    self.emit_err(expr.span(), SyntaxError::TS1014)
                }
                AssignTargetOrSpread::Pat(pat) => params.push(pat),
            }
        }

        debug_assert_eq!(exprs.len(), 1);
        let expr = exprs.into_iter().next().unwrap();
        let outer_expr_span = expr.span();
        let last = match expr {
            // Rest
            AssignTargetOrSpread::ExprOrSpread(expr_or_spread) => {
                if let Some(dot3_token) = expr_or_spread.spread {
                    if expr_or_spread.expr.is_assign() {
                        self.emit_err(outer_expr_span, SyntaxError::TS1048)
                    };
                    if let Some(trailing_comma) = trailing_comma {
                        self.emit_err(trailing_comma, SyntaxError::CommaAfterRestElement);
                    }
                    let expr_span = expr_or_spread.expr.span();
                    self.reparse_expr_as_pat(pat_ty, expr_or_spread.into_inner().expr)
                        .map(|pat| {
                            Pat::Rest(self.ast(RestPat {
                                span: expr_span,
                                dot3_token,
                                arg: pat,
                                type_ann: None,
                            }))
                        })?
                } else {
                    self.reparse_expr_as_pat(pat_ty, expr_or_spread.into_inner().expr)?
                }
            }
            AssignTargetOrSpread::Pat(pat) => {
                if let Some(trailing_comma) = trailing_comma {
                    if pat.is_rest() {
                        self.emit_err(trailing_comma, SyntaxError::CommaAfterRestElement);
                    }
                }
                pat
            }
        };
        params.push(last);

        if self.ctx().strict {
            for param in params.iter() {
                self.pat_is_valid_argument_in_strict(param)
            }
        }

        Ok(params)
    }

    /// argument of arrow is pattern, although idents in pattern is already
    /// checked if is a keyword, it should also be checked if is arguments or
    /// eval
    fn pat_is_valid_argument_in_strict(&self, pat: &Pat<'a>) {
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
                        ObjectPatProp::KeyValue(kv) => {
                            self.pat_is_valid_argument_in_strict(&kv.value)
                        }
                        ObjectPatProp::Rest(rest_pat) => {
                            self.pat_is_valid_argument_in_strict(&rest_pat.arg)
                        }
                        ObjectPatProp::Assign(assign_pat) => {
                            if assign_pat.key.is_reserved_in_strict_bind() {
                                self.emit_strict_mode_err(
                                    assign_pat.key.span,
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

#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP as span;
    use swc_ecma_visit::assert_eq_ignore_span;

    use super::*;

    fn array_pat(s: &'static str) -> Pat<'static> {
        test_parser(s, Syntax::default(), |p| p.parse_array_binding_pat())
    }

    fn object_pat(s: &'static str) -> Pat<'static> {
        test_parser(s, Syntax::default(), |p| {
            p.parse_binding_pat_or_ident(false)
        })
    }

    fn ident(s: &str) -> Ident {
        Ident::new_no_ctxt(s.into(), span)
    }

    fn ident_name(s: &str) -> IdentName {
        IdentName::new(s.into(), span)
    }

    fn rest() -> Option<Pat<'static>> {
        Some(
            RestPat {
                span,
                dot3_token: span,
                type_ann: None,
                arg: ident("tail").into(),
            }
            .into(),
        )
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
                        span,
                        left: Box::new(Pat::Ident(ident("a").into())),
                        right: Box::new(Expr::Lit(Lit::Num(Number {
                            span,
                            value: 1.0,
                            raw: Some("1".into())
                        })))
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
                    key: ident("prop").into(),
                    value: Some(Box::new(Expr::Lit(Lit::Num(Number {
                        span,
                        value: 10.0,
                        raw: Some("10".into())
                    }))))
                })]
            })
        );
    }

    #[test]
    fn object_binding_pattern_with_prop_and_label() {
        fn prop(key: PropName, assign_name: &str, expr: Expr) -> PropOrSpread<'static> {
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key,
                value: AssignExpr {
                    span,
                    op: AssignOp::Assign,
                    left: ident(assign_name).into(),
                    right: Box::new(expr),
                }
                .into(),
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
                    key: ident("obj").into(),
                    value: Some(Box::new(Expr::Object(ObjectLit {
                        span,
                        props: vec![
                            prop(
                                PropName::Ident(ident_name("$")),
                                "num",
                                Expr::Lit(Lit::Num(Number {
                                    span,
                                    value: 10.0,
                                    raw: Some("10".into())
                                }))
                            ),
                            prop(
                                PropName::Str(Str {
                                    span,
                                    value: "".into(),
                                    raw: Some("''".into()),
                                }),
                                "sym",
                                Expr::Lit(Lit::Str(Str {
                                    span,
                                    value: "".into(),
                                    raw: Some("''".into()),
                                }))
                            ),
                            prop(
                                PropName::Str(Str {
                                    span,
                                    value: " ".into(),
                                    raw: Some("\" \"".into()),
                                }),
                                "quote",
                                Expr::Lit(Lit::Str(Str {
                                    span,
                                    value: " ".into(),
                                    raw: Some("\" \"".into()),
                                }))
                            ),
                            prop(
                                PropName::Ident(ident_name("_")),
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
