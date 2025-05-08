//! 13.3.3 Destructuring Binding Patterns

use swc_common::Spanned;
use swc_ecma_lexer::common::parser::{
    class_and_fn::parse_decorators,
    is_not_this,
    typescript::{
        eat_any_ts_modifier, parse_ts_modifier, parse_ts_type_ann, try_parse_ts_type_ann,
    },
};

use super::*;
use crate::{lexer::Token, parser::Parser, token};

impl<I: Tokens> Parser<I> {
    pub fn parse_pat(&mut self) -> PResult<Pat> {
        self.parse_binding_pat_or_ident(false)
    }

    pub(super) fn parse_binding_pat_or_ident(&mut self, disallow_let: bool) -> PResult<Pat> {
        trace_cur!(self, parse_binding_pat_or_ident);

        let t = cur!(self, true);
        match t {
            token!('[') => self.parse_array_binding_pat(),
            token!('{') => self.parse_object(),
            // tok!('(') => {
            //     bump!(self);
            //     let pat = self.parse_binding_pat_or_ident()?;
            //     expect!(self, ')');
            //     Ok(pat)
            // }
            token!("yield") => self.parse_binding_ident(disallow_let).map(Pat::from),
            _ if t.is_word() => self.parse_binding_ident(disallow_let).map(Pat::from),
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

        let has_modifier = eat_any_ts_modifier(self)?;

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
                    let new_type_ann = try_parse_ts_type_ann(self)?;
                    if new_type_ann.is_some() {
                        *span = Span::new(pat_start, self.input.prev_span().hi);
                    }
                    *type_ann = new_type_ann;
                }

                Pat::Ident(BindingIdent {
                    ref mut type_ann, ..
                }) => {
                    let new_type_ann = try_parse_ts_type_ann(self)?;
                    *type_ann = new_type_ann;
                }

                Pat::Assign(AssignPat { ref mut span, .. }) => {
                    if (try_parse_ts_type_ann(self)?).is_some() {
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
            let decorators = parse_decorators(self, false)?;
            let pat_start = cur_pos!(self);

            let mut is_rest = false;
            if eat!(self, "...") {
                is_rest = true;
                let dot3_token = span!(self, pat_start);

                let pat = self.parse_binding_pat_or_ident(false)?;
                let type_ann = if self.input.syntax().typescript() && is!(self, ':') {
                    let cur_pos = cur_pos!(self);
                    Some(parse_ts_type_ann(self, /* eat_colon */ true, cur_pos)?)
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
                parse_ts_modifier(self, &["override"], false)?.is_some(),
                parse_ts_modifier(self, &["readonly"], false)?.is_some(),
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
            let decorators = parse_decorators(self, false)?;
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
                    let ty = parse_ts_type_ann(self, /* eat_colon */ true, cur_pos)?;
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

#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP as span;
    use swc_ecma_visit::assert_eq_ignore_span;

    use super::*;

    fn array_pat(s: &'static str) -> Pat {
        test_parser(s, Syntax::default(), |p| p.parse_array_binding_pat())
    }

    fn object_pat(s: &'static str) -> Pat {
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

    fn rest() -> Option<Pat> {
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
    fn array_pat_empty_end() {
        assert_eq_ignore_span!(
            array_pat("[a, ,]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![Some(Pat::Ident(ident("a").into())), None,],
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
        fn prop(key: PropName, assign_name: &str, expr: Expr) -> PropOrSpread {
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
