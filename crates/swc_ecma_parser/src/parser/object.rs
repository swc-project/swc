//! Parser for object literal.

use swc_common::{Spanned, DUMMY_SP};

use super::*;
use crate::parser::class_and_fn::is_not_this;

impl<I: Tokens> Parser<I> {
    /// Parse a object literal or object pattern.
    pub(super) fn parse_object<T>(&mut self) -> PResult<T>
    where
        Self: ParseObject<T>,
    {
        let ctx = Context {
            will_expect_colon_for_cond: false,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_with(|p| {
            trace_cur!(p, parse_object);

            let start = cur_pos!(p);
            let mut trailing_comma = None;
            assert_and_bump!(p, '{');

            let mut props = Vec::new();

            while !eat!(p, '}') {
                props.push(p.parse_object_prop()?);

                if !is!(p, '}') {
                    expect!(p, ',');
                    if is!(p, '}') {
                        trailing_comma = Some(p.input.prev_span());
                    }
                }
            }

            p.make_object(span!(p, start), props, trailing_comma)
        })
    }

    /// spec: 'PropertyName'
    pub(super) fn parse_prop_name(&mut self) -> PResult<PropName> {
        trace_cur!(self, parse_prop_name);

        let ctx = self.ctx();
        self.with_ctx(Context {
            in_property_name: true,
            ..ctx
        })
        .parse_with(|p| {
            let start = cur_pos!(p);

            let v = match *cur!(p, true) {
                Token::Str { .. } => match bump!(p) {
                    Token::Str { value, raw } => PropName::Str(Str {
                        span: span!(p, start),
                        value,
                        raw: Some(raw),
                    }),
                    _ => unreachable!(),
                },
                Token::Num { .. } => match bump!(p) {
                    Token::Num { value, raw } => PropName::Num(Number {
                        span: span!(p, start),
                        value,
                        raw: Some(raw),
                    }),
                    _ => unreachable!(),
                },
                Token::BigInt { .. } => match bump!(p) {
                    Token::BigInt { value, raw } => PropName::BigInt(BigInt {
                        span: span!(p, start),
                        value,
                        raw: Some(raw),
                    }),
                    _ => unreachable!(),
                },
                Word(..) => match bump!(p) {
                    Word(w) => PropName::Ident(IdentName::new(w.into(), span!(p, start))),
                    _ => unreachable!(),
                },
                tok!('[') => {
                    bump!(p);
                    let inner_start = cur_pos!(p);

                    let mut expr = p.include_in_expr(true).parse_assignment_expr()?;

                    if p.syntax().typescript() && is!(p, ',') {
                        let mut exprs = vec![expr];

                        while eat!(p, ',') {
                            exprs.push(p.include_in_expr(true).parse_assignment_expr()?);
                        }

                        p.emit_err(span!(p, inner_start), SyntaxError::TS1171);

                        expr = Box::new(
                            SeqExpr {
                                span: span!(p, inner_start),
                                exprs,
                            }
                            .into(),
                        );
                    }

                    expect!(p, ']');

                    PropName::Computed(ComputedPropName {
                        span: span!(p, start),
                        expr,
                    })
                }
                _ => unexpected!(
                    p,
                    "identifier, string literal, numeric literal or [ for the computed key"
                ),
            };

            Ok(v)
        })
    }
}

impl<I: Tokens> ParseObject<Box<Expr>> for Parser<I> {
    type Prop = PropOrSpread;

    fn make_object(
        &mut self,
        span: Span,
        props: Vec<Self::Prop>,
        trailing_comma: Option<Span>,
    ) -> PResult<Box<Expr>> {
        if let Some(trailing_comma) = trailing_comma {
            self.state.trailing_commas.insert(span.lo, trailing_comma);
        }
        Ok(ObjectLit { span, props }.into())
    }

    /// spec: 'PropertyDefinition'
    fn parse_object_prop(&mut self) -> PResult<Self::Prop> {
        trace_cur!(self, parse_object_prop);

        let start = cur_pos!(self);
        // Parse as 'MethodDefinition'

        if eat!(self, "...") {
            // spread element
            let dot3_token = span!(self, start);

            let expr = self.include_in_expr(true).parse_assignment_expr()?;

            return Ok(PropOrSpread::Spread(SpreadElement { dot3_token, expr }));
        }

        if eat!(self, '*') {
            let name = self.parse_prop_name()?;
            return self
                .with_ctx(Context {
                    allow_direct_super: true,
                    in_class_field: false,
                    ..self.ctx()
                })
                .parse_fn_args_body(
                    // no decorator in an object literal
                    Vec::new(),
                    start,
                    |p| p.parse_unique_formal_params(),
                    false,
                    true,
                )
                .map(|function| {
                    PropOrSpread::Prop(Box::new(Prop::Method(MethodProp {
                        key: name,
                        function,
                    })))
                });
        }

        let has_modifiers = self.eat_any_ts_modifier()?;
        let modifiers_span = self.input.prev_span();

        let key = self.parse_prop_name()?;

        if self.input.syntax().typescript()
            && !is_one_of!(self, '(', '[', ':', ',', '?', '=', '*', IdentName, Str, Num)
            && !(self.input.syntax().typescript() && is!(self, '<'))
            && !(is!(self, '}') && matches!(key, PropName::Ident(..)))
        {
            trace_cur!(self, parse_object_prop_error);

            self.emit_err(self.input.cur_span(), SyntaxError::TS1005);
            return Ok(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key,
                value: Invalid {
                    span: span!(self, start),
                }
                .into(),
            }))));
        }
        //
        // {[computed()]: a,}
        // { 'a': a, }
        // { 0: 1, }
        // { a: expr, }
        if eat!(self, ':') {
            let value = self.include_in_expr(true).parse_assignment_expr()?;
            return Ok(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key,
                value,
            }))));
        }

        // Handle `a(){}` (and async(){} / get(){} / set(){})
        if (self.input.syntax().typescript() && is!(self, '<')) || is!(self, '(') {
            return self
                .with_ctx(Context {
                    allow_direct_super: true,
                    in_class_field: false,
                    ..self.ctx()
                })
                .parse_fn_args_body(
                    // no decorator in an object literal
                    Vec::new(),
                    start,
                    |p| p.parse_unique_formal_params(),
                    false,
                    false,
                )
                .map(|function| Box::new(Prop::Method(MethodProp { key, function })))
                .map(PropOrSpread::Prop);
        }

        let ident = match key {
            PropName::Ident(ident) => ident,
            // TODO
            _ => unexpected!(self, "identifier"),
        };

        if eat!(self, '?') {
            self.emit_err(self.input.prev_span(), SyntaxError::TS1162);
        }

        // `ident` from parse_prop_name is parsed as 'IdentifierName'
        // It means we should check for invalid expressions like { for, }
        if is_one_of!(self, '=', ',', '}') {
            let is_reserved_word = { self.ctx().is_reserved_word(&ident.sym) };
            if is_reserved_word {
                self.emit_err(ident.span, SyntaxError::ReservedWordInObjShorthandOrPat);
            }

            if eat!(self, '=') {
                let value = self.include_in_expr(true).parse_assignment_expr()?;
                let span = span!(self, start);
                return Ok(PropOrSpread::Prop(Box::new(Prop::Assign(AssignProp {
                    span,
                    key: ident.into(),
                    value,
                }))));
            }

            return Ok(PropOrSpread::Prop(Box::new(Prop::from(ident))));
        }

        // get a(){}
        // set a(v){}
        // async a(){}

        match &*ident.sym {
            "get" | "set" | "async" => {
                trace_cur!(self, parse_object_prop__after_accessor);

                if has_modifiers {
                    self.emit_err(modifiers_span, SyntaxError::TS1042);
                }

                let is_generator = ident.sym == "async" && eat!(self, '*');
                let key = self.parse_prop_name()?;
                let key_span = key.span();
                self.with_ctx(Context {
                    allow_direct_super: true,
                    in_class_field: false,
                    ..self.ctx()
                })
                .parse_with(|parser| {
                    match &*ident.sym {
                        "get" => parser
                            .parse_fn_args_body(
                                // no decorator in an object literal
                                Vec::new(),
                                start,
                                |p| {
                                    let params = p.parse_formal_params()?;

                                    if params.iter().filter(|p| is_not_this(p)).count() != 0 {
                                        p.emit_err(key_span, SyntaxError::GetterParam);
                                    }

                                    Ok(params)
                                },
                                false,
                                false,
                            )
                            .map(|v| *v)
                            .map(
                                |Function {
                                     body, return_type, ..
                                 }| {
                                    if parser.input.syntax().typescript()
                                        && parser.input.target() == EsVersion::Es3
                                    {
                                        parser.emit_err(key_span, SyntaxError::TS1056);
                                    }

                                    PropOrSpread::Prop(Box::new(Prop::Getter(GetterProp {
                                        span: span!(parser, start),
                                        key,
                                        type_ann: return_type,
                                        body,
                                    })))
                                },
                            ),
                        "set" => {
                            parser
                                .parse_fn_args_body(
                                    // no decorator in an object literal
                                    Vec::new(),
                                    start,
                                    |p| {
                                        let params = p.parse_formal_params()?;

                                        if params.iter().filter(|p| is_not_this(p)).count() != 1 {
                                            p.emit_err(key_span, SyntaxError::SetterParam);
                                        }

                                        if !params.is_empty() {
                                            if let Pat::Rest(..) = params[0].pat {
                                                p.emit_err(
                                                    params[0].span(),
                                                    SyntaxError::RestPatInSetter,
                                                );
                                            }
                                        }

                                        if p.input.syntax().typescript()
                                            && p.input.target() == EsVersion::Es3
                                        {
                                            p.emit_err(key_span, SyntaxError::TS1056);
                                        }

                                        Ok(params)
                                    },
                                    false,
                                    false,
                                )
                                .map(|v| *v)
                                .map(
                                    |Function {
                                         mut params, body, ..
                                     }| {
                                        let mut this = None;
                                        if params.len() >= 2 {
                                            this = Some(params.remove(0).pat);
                                        }

                                        let param = Box::new(
                                            params
                                                .into_iter()
                                                .next()
                                                .map(|v| v.pat)
                                                .unwrap_or_else(|| {
                                                    parser.emit_err(
                                                        key_span,
                                                        SyntaxError::SetterParam,
                                                    );

                                                    Invalid { span: DUMMY_SP }.into()
                                                }),
                                        );

                                        // debug_assert_eq!(params.len(), 1);
                                        PropOrSpread::Prop(Box::new(Prop::Setter(SetterProp {
                                            span: span!(parser, start),
                                            key,
                                            body,
                                            param,
                                            this_param: this,
                                        })))
                                    },
                                )
                        }
                        "async" => parser
                            .parse_fn_args_body(
                                // no decorator in an object literal
                                Vec::new(),
                                start,
                                |p| p.parse_unique_formal_params(),
                                true,
                                is_generator,
                            )
                            .map(|function| {
                                PropOrSpread::Prop(Box::new(Prop::Method(MethodProp {
                                    key,
                                    function,
                                })))
                            }),
                        _ => unreachable!(),
                    }
                })
            }
            _ => {
                if self.input.syntax().typescript() {
                    unexpected!(
                        self,
                        "... , *,  (, [, :, , ?, =, an identifier, public, protected, private, \
                         readonly, <."
                    )
                } else {
                    unexpected!(self, "... , *,  (, [, :, , ?, = or an identifier")
                }
            }
        }
    }
}

impl<I: Tokens> ParseObject<Pat> for Parser<I> {
    type Prop = ObjectPatProp;

    fn make_object(
        &mut self,
        span: Span,
        props: Vec<Self::Prop>,
        trailing_comma: Option<Span>,
    ) -> PResult<Pat> {
        let len = props.len();
        for (i, p) in props.iter().enumerate() {
            if i == len - 1 {
                if let ObjectPatProp::Rest(ref rest) = p {
                    match *rest.arg {
                        Pat::Ident(..) => {
                            if let Some(trailing_comma) = trailing_comma {
                                self.emit_err(trailing_comma, SyntaxError::CommaAfterRestElement);
                            }
                        }
                        _ => syntax_error!(self, p.span(), SyntaxError::DotsWithoutIdentifier),
                    }
                }
                continue;
            }

            if let ObjectPatProp::Rest(..) = p {
                self.emit_err(p.span(), SyntaxError::NonLastRestParam)
            }
        }

        let optional = (self.input.syntax().dts() || self.ctx().in_declare) && eat!(self, '?');

        Ok(ObjectPat {
            span,
            props,
            optional,
            type_ann: None,
        }
        .into())
    }

    /// Production 'BindingProperty'
    fn parse_object_prop(&mut self) -> PResult<Self::Prop> {
        let start = cur_pos!(self);

        if eat!(self, "...") {
            // spread element
            let dot3_token = span!(self, start);

            let arg = Box::new(self.parse_binding_pat_or_ident(false)?);

            return Ok(ObjectPatProp::Rest(RestPat {
                span: span!(self, start),
                dot3_token,
                arg,
                type_ann: None,
            }));
        }

        let key = self.parse_prop_name()?;
        if eat!(self, ':') {
            let value = Box::new(self.parse_binding_element()?);

            return Ok(ObjectPatProp::KeyValue(KeyValuePatProp { key, value }));
        }
        let key = match key {
            PropName::Ident(ident) => ident,
            _ => unexpected!(self, "an identifier"),
        };

        let value = if eat!(self, '=') {
            self.include_in_expr(true)
                .parse_assignment_expr()
                .map(Some)?
        } else {
            if self.ctx().is_reserved_word(&key.sym) {
                self.emit_err(key.span, SyntaxError::ReservedWordInObjShorthandOrPat);
            }

            None
        };

        Ok(ObjectPatProp::Assign(AssignPatProp {
            span: span!(self, start),
            key: key.into(),
            value,
        }))
    }
}
