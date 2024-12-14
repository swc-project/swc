//! Parser for object literal.

use swc_allocator::arena::Vec;
use swc_common::{Spanned, DUMMY_SP};

use super::{class_and_fn::is_not_this, *};

impl<'a, I: Tokens> Parser<'a, I> {
    /// spec: 'PropertyName'
    pub(crate) fn parse_prop_name(&mut self) -> PResult<PropName<'a>> {
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
                    Token::Str { value, raw } => PropName::Str(p.ast(Str {
                        span: span!(p, start),
                        value,
                        raw: Some(raw),
                    })),
                    _ => unreachable!(),
                },
                Token::Num { .. } => match bump!(p) {
                    Token::Num { value, raw } => PropName::Num(p.ast(Number {
                        span: span!(p, start),
                        value,
                        raw: Some(raw),
                    })),
                    _ => unreachable!(),
                },
                Token::BigInt { .. } => match bump!(p) {
                    Token::BigInt { value, raw } => PropName::BigInt(p.ast(BigInt {
                        span: span!(p, start),
                        value: p.ast(*value),
                        raw: Some(raw),
                    })),
                    _ => unreachable!(),
                },
                Word(..) => match bump!(p) {
                    Word(w) => PropName::Ident(p.ast(IdentName::new(w.into(), span!(p, start)))),
                    _ => unreachable!(),
                },
                tok!('[') => {
                    bump!(p);
                    let inner_start = cur_pos!(p);

                    let mut expr = p.include_in_expr(true).parse_assignment_expr()?;

                    if p.syntax().typescript() && is!(p, ',') {
                        let mut exprs = Vec::new_in(p.alloc);
                        exprs.push(expr);

                        while eat!(p, ',') {
                            exprs.push(p.include_in_expr(true).parse_assignment_expr()?);
                        }

                        p.emit_err(span!(p, inner_start), SyntaxError::TS1171);

                        expr = Expr::Seq(p.ast(SeqExpr {
                            span: span!(p, inner_start),
                            exprs,
                        }));
                    }

                    expect!(p, ']');

                    PropName::Computed(p.ast(ComputedPropName {
                        span: span!(p, start),
                        expr,
                    }))
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

impl<'a, I: Tokens> Parser<'a, I> {
    /// Parse a object literal or object pattern.
    pub(crate) fn parse_object_expr(&mut self) -> PResult<Expr<'a>> {
        let ctx = Context {
            will_expect_colon_for_cond: false,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_with(|p| {
            trace_cur!(p, parse_object);

            let start = cur_pos!(p);
            let mut trailing_comma = None;
            assert_and_bump!(p, '{');

            let mut props = Vec::new_in(p.alloc);

            while !eat!(p, '}') {
                props.push(p.parse_object_prop_expr()?);

                if !is!(p, '}') {
                    expect!(p, ',');
                    if is!(p, '}') {
                        trailing_comma = Some(p.input.prev_span());
                    }
                }
            }

            p.make_object_expr(span!(p, start), props, trailing_comma)
        })
    }

    pub(crate) fn make_object_expr(
        &mut self,
        span: Span,
        props: Vec<'a, PropOrSpread<'a>>,
        trailing_comma: Option<Span>,
    ) -> PResult<Expr<'a>> {
        if let Some(trailing_comma) = trailing_comma {
            self.state.trailing_commas.insert(span.lo, trailing_comma);
        }
        Ok(Expr::Object(self.ast(ObjectLit { span, props })))
    }

    /// spec: 'PropertyDefinition'
    fn parse_object_prop_expr(&mut self) -> PResult<PropOrSpread<'a>> {
        trace_cur!(self, parse_object_prop);

        let start = cur_pos!(self);
        // Parse as 'MethodDefinition'

        if eat!(self, "...") {
            // spread element
            let dot3_token = span!(self, start);

            let expr = self.include_in_expr(true).parse_assignment_expr()?;

            return Ok(PropOrSpread::Spread(
                self.ast(SpreadElement { dot3_token, expr }),
            ));
        }

        if eat!(self, '*') {
            let name = self.parse_prop_name()?;
            let decorators = Vec::new_in(self.alloc);
            return self
                .with_ctx(Context {
                    allow_direct_super: true,
                    in_class_field: false,
                    ..self.ctx()
                })
                .parse_with(|parser| {
                    parser
                        .parse_fn_args_body(
                            // no decorator in an object literal
                            decorators,
                            start,
                            |p| p.parse_unique_formal_params(),
                            false,
                            true,
                        )
                        .map(|function| {
                            PropOrSpread::Prop(parser.ast(Prop::Method(parser.ast(MethodProp {
                                key: name,
                                function,
                            }))))
                        })
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
            return Ok(PropOrSpread::Prop(self.ast(Prop::KeyValue(self.ast(
                KeyValueProp {
                    key,
                    value: Expr::Invalid(self.ast(Invalid {
                        span: span!(self, start),
                    })),
                },
            )))));
        }
        //
        // {[computed()]: a,}
        // { 'a': a, }
        // { 0: 1, }
        // { a: expr, }
        if eat!(self, ':') {
            let value = self.include_in_expr(true).parse_assignment_expr()?;
            return Ok(PropOrSpread::Prop(
                self.ast(Prop::KeyValue(self.ast(KeyValueProp { key, value }))),
            ));
        }

        // Handle `a(){}` (and async(){} / get(){} / set(){})
        if (self.input.syntax().typescript() && is!(self, '<')) || is!(self, '(') {
            return self
                .with_ctx(Context {
                    allow_direct_super: true,
                    in_class_field: false,
                    ..self.ctx()
                })
                .parse_with(|parser| {
                    parser
                        .parse_fn_args_body(
                            // no decorator in an object literal
                            Vec::new_in(parser.alloc),
                            start,
                            |p| p.parse_unique_formal_params(),
                            false,
                            false,
                        )
                        .map(|function| {
                            parser.ast(Prop::Method(parser.ast(MethodProp { key, function })))
                        })
                        .map(PropOrSpread::Prop)
                });
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
                return Ok(PropOrSpread::Prop(self.ast(Prop::Assign(self.ast(
                    AssignProp {
                        span,
                        key: ident.into_inner().into(),
                        value,
                    },
                )))));
            }

            return Ok(PropOrSpread::Prop(
                self.ast(Prop::Shorthand(self.ast(ident.into_inner().into()))),
            ));
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
                                Vec::new_in(parser.alloc),
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
                            .map(|function| function.into_inner())
                            .map(
                                |Function {
                                     body, return_type, ..
                                 }| {
                                    if parser.input.syntax().typescript()
                                        && parser.input.target() == EsVersion::Es3
                                    {
                                        parser.emit_err(key_span, SyntaxError::TS1056);
                                    }

                                    PropOrSpread::Prop(parser.ast(Prop::Getter(parser.ast(
                                        GetterProp {
                                            span: span!(parser, start),
                                            key,
                                            type_ann: return_type,
                                            body,
                                        },
                                    ))))
                                },
                            ),
                        "set" => {
                            parser
                                .parse_fn_args_body(
                                    // no decorator in an object literal
                                    Vec::new_in(parser.alloc),
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
                                .map(|v| v.into_inner())
                                .map(
                                    |Function {
                                         mut params, body, ..
                                     }| {
                                        let mut this = None;
                                        if params.len() >= 2 {
                                            this = Some(params.remove(0).pat);
                                        }

                                        let param = params
                                            .into_iter()
                                            .next()
                                            .map(|v| v.pat)
                                            .unwrap_or_else(|| {
                                                parser.emit_err(key_span, SyntaxError::SetterParam);

                                                Pat::Invalid(parser.ast(Invalid { span: DUMMY_SP }))
                                            });

                                        // debug_assert_eq!(params.len(), 1);
                                        PropOrSpread::Prop(parser.ast(Prop::Setter(parser.ast(
                                            SetterProp {
                                                span: span!(parser, start),
                                                key,
                                                body,
                                                param,
                                                this_param: this,
                                            },
                                        ))))
                                    },
                                )
                        }
                        "async" => {
                            parser
                                .parse_fn_args_body(
                                    // no decorator in an object literal
                                    Vec::new_in(parser.alloc),
                                    start,
                                    |p| p.parse_unique_formal_params(),
                                    true,
                                    is_generator,
                                )
                                .map(|function| {
                                    PropOrSpread::Prop(parser.ast(Prop::Method(
                                        parser.ast(MethodProp { key, function }),
                                    )))
                                })
                        }
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

impl<'a, I: Tokens> Parser<'a, I> {
    /// Parse a object literal or object pattern.
    pub(crate) fn parse_object_pat(&mut self) -> PResult<Pat<'a>> {
        let ctx = Context {
            will_expect_colon_for_cond: false,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_with(|p| {
            trace_cur!(p, parse_object);

            let start = cur_pos!(p);
            let mut trailing_comma = None;
            assert_and_bump!(p, '{');

            let mut props = Vec::new_in(p.alloc);

            while !eat!(p, '}') {
                props.push(p.parse_object_prop_pat()?);

                if !is!(p, '}') {
                    expect!(p, ',');
                    if is!(p, '}') {
                        trailing_comma = Some(p.input.prev_span());
                    }
                }
            }

            p.make_object_pat(span!(p, start), props, trailing_comma)
        })
    }

    fn make_object_pat(
        &mut self,
        span: Span,
        props: Vec<'a, ObjectPatProp<'a>>,
        trailing_comma: Option<Span>,
    ) -> PResult<Pat<'a>> {
        let len = props.len();
        for (i, p) in props.iter().enumerate() {
            if i == len - 1 {
                if let ObjectPatProp::Rest(ref rest) = p {
                    match rest.arg {
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

        Ok(Pat::Object(self.ast(ObjectPat {
            span,
            props,
            optional,
            type_ann: None,
        })))
    }

    /// Production 'BindingProperty'
    fn parse_object_prop_pat(&mut self) -> PResult<ObjectPatProp<'a>> {
        let start = cur_pos!(self);

        if eat!(self, "...") {
            // spread element
            let dot3_token = span!(self, start);

            let arg = self.parse_binding_pat_or_ident(false)?;

            return Ok(ObjectPatProp::Rest(self.ast(RestPat {
                span: span!(self, start),
                dot3_token,
                arg,
                type_ann: None,
            })));
        }

        let key = self.parse_prop_name()?;
        if eat!(self, ':') {
            let value = self.parse_binding_element()?;

            return Ok(ObjectPatProp::KeyValue(
                self.ast(KeyValuePatProp { key, value }),
            ));
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

        Ok(ObjectPatProp::Assign(self.ast(AssignPatProp {
            span: span!(self, start),
            key: key.into_inner().into(),
            value,
        })))
    }
}
