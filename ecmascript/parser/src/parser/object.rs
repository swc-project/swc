//! Parser for object literal.

use super::*;
use crate::parser::class_and_fn::is_not_this;
use swc_atoms::js_word;
use swc_common::Spanned;

impl<'a, I: Tokens> Parser<I> {
    /// Parse a object literal or object pattern.
    pub(super) fn parse_object<T>(&mut self) -> PResult<T>
    where
        Self: ParseObject<T>,
    {
        let start = cur_pos!(self);
        assert_and_bump!(self, '{');

        let mut props = vec![];

        let mut first = true;
        while !eat!(self, '}') {
            // Handle comma
            if first {
                first = false;
            } else {
                expect!(self, ',');
                if eat!(self, '}') {
                    break;
                }
            }

            let prop = self.parse_object_prop()?;
            props.push(prop);
        }

        self.make_object(span!(self, start), props)
    }

    /// spec: 'PropertyName'
    pub(super) fn parse_prop_name(&mut self) -> PResult<PropName> {
        let ctx = self.ctx();
        self.with_ctx(Context {
            in_property_name: true,
            ..ctx
        })
        .parse_with(|p| {
            let start = cur_pos!(p);

            let v = match *cur!(p, true)? {
                Token::Str { .. } => match bump!(p) {
                    Token::Str { value, has_escape } => PropName::Str(Str {
                        span: span!(p, start),
                        value,
                        has_escape,
                        kind: StrKind::Normal {
                            contains_quote: true,
                        },
                    }),
                    _ => unreachable!(),
                },
                Token::Num(_) => match bump!(p) {
                    Token::Num(value) => PropName::Num(Number {
                        span: span!(p, start),
                        value,
                    }),
                    _ => unreachable!(),
                },
                Token::BigInt(_) => match bump!(p) {
                    Token::BigInt(value) => PropName::BigInt(BigInt {
                        span: span!(p, start),
                        value,
                    }),
                    _ => unreachable!(),
                },
                Word(..) => match bump!(p) {
                    Word(w) => PropName::Ident(Ident::new(w.into(), span!(p, start))),
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

    fn make_object(&mut self, span: Span, props: Vec<Self::Prop>) -> PResult<Box<Expr>> {
        Ok(Box::new(Expr::Object(ObjectLit { span, props })))
    }

    /// spec: 'PropertyDefinition'
    fn parse_object_prop(&mut self) -> PResult<Self::Prop> {
        let start = cur_pos!(self);
        // Parse as 'MethodDefinition'

        if eat!(self, "...") {
            // spread element
            let dot3_token = span!(self, start);

            let expr = self.include_in_expr(true).parse_assignment_expr()?;

            return Ok(PropOrSpread::Spread(SpreadElement { dot3_token, expr }));
        }

        if eat!(self, '*') {
            let span_of_gen = span!(self, start);

            let name = self.parse_prop_name()?;
            return self
                .parse_fn_args_body(
                    // no decorator in an object literal
                    vec![],
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
            && !is_one_of!(self, '(', '[', ':', ',', '?', '=', '*', IdentName)
            && !(self.input.syntax().typescript() && is!(self, '<'))
            && !(is!(self, '}')
                && match key {
                    PropName::Ident(..) => true,
                    _ => false,
                })
        {
            self.emit_err(self.input.cur_span(), SyntaxError::TS1005);
            return Ok(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key,
                value: Box::new(Expr::Invalid(Invalid {
                    span: span!(self, start),
                })),
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
                .parse_fn_args_body(
                    // no decorator in an object literal
                    vec![],
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
                return Ok(PropOrSpread::Prop(Box::new(Prop::Assign(AssignProp {
                    key: ident,
                    value,
                }))));
            }

            return Ok(PropOrSpread::Prop(Box::new(Prop::from(ident))));
        }

        // get a(){}
        // set a(v){}
        // async a(){}

        match ident.sym {
            js_word!("get") | js_word!("set") | js_word!("async") => {
                if has_modifiers {
                    self.emit_err(modifiers_span, SyntaxError::TS1042);
                }

                let is_generator = ident.sym == js_word!("async") && eat!(self, '*');
                let key = self.parse_prop_name()?;
                let key_span = key.span();

                match ident.sym {
                    js_word!("get") => self
                        .parse_fn_args_body(
                            // no decorator in an object literal
                            vec![],
                            start,
                            |p| {
                                let params = p.parse_formal_params()?;

                                if params.iter().filter(|p| is_not_this(p)).count() != 0 {
                                    p.emit_err(key_span, SyntaxError::TS1094);
                                }

                                Ok(params)
                            },
                            false,
                            false,
                        )
                        .map(
                            |Function {
                                 body,
                                 type_params,
                                 return_type,
                                 ..
                             }| {
                                if type_params.is_some() {
                                    self.emit_err(type_params.unwrap().span(), SyntaxError::TS1094);
                                }

                                if self.input.syntax().typescript()
                                    && self.input.target() == JscTarget::Es3
                                {
                                    self.emit_err(key_span, SyntaxError::TS1056);
                                }

                                PropOrSpread::Prop(Box::new(Prop::Getter(GetterProp {
                                    span: span!(self, start),
                                    key,
                                    type_ann: return_type,
                                    body,
                                })))
                            },
                        ),
                    js_word!("set") => self
                        .parse_fn_args_body(
                            // no decorator in an object literal
                            vec![],
                            start,
                            |p| {
                                let params = p.parse_formal_params()?;

                                if params.iter().filter(|p| is_not_this(p)).count() != 1 {
                                    p.emit_err(key_span, SyntaxError::TS1094);
                                }

                                if !params.is_empty() {
                                    if let Pat::Rest(..) = params[0].pat {
                                        p.emit_err(params[0].span(), SyntaxError::RestPatInSetter);
                                    }
                                }

                                if p.input.syntax().typescript()
                                    && p.input.target() == JscTarget::Es3
                                {
                                    p.emit_err(key_span, SyntaxError::TS1056);
                                }

                                Ok(params)
                            },
                            false,
                            false,
                        )
                        .map(
                            |Function {
                                 params,
                                 body,
                                 type_params,
                                 ..
                             }| {
                                if type_params.is_some() {
                                    self.emit_err(type_params.unwrap().span(), SyntaxError::TS1094);
                                }

                                // debug_assert_eq!(params.len(), 1);
                                PropOrSpread::Prop(Box::new(Prop::Setter(SetterProp {
                                    span: span!(self, start),
                                    key,
                                    body,
                                    param: params.into_iter().map(|p| p.pat).next().unwrap_or_else(
                                        || Pat::Invalid(Invalid { span: key_span }),
                                    ),
                                })))
                            },
                        ),
                    js_word!("async") => self
                        .parse_fn_args_body(
                            // no decorator in an object literal
                            vec![],
                            start,
                            |p| p.parse_unique_formal_params(),
                            true,
                            is_generator,
                        )
                        .map(|function| {
                            PropOrSpread::Prop(Box::new(Prop::Method(MethodProp { key, function })))
                        }),
                    _ => unreachable!(),
                }
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

    fn make_object(&mut self, span: Span, props: Vec<Self::Prop>) -> PResult<Pat> {
        let len = props.len();
        for (i, p) in props.iter().enumerate() {
            if i == len - 1 {
                if let ObjectPatProp::Rest(ref rest) = p {
                    match *rest.arg {
                        Pat::Ident(..) => {}
                        _ => syntax_error!(self, p.span(), SyntaxError::DotsWithoutIdentifier),
                    }
                }
                continue;
            }

            if let ObjectPatProp::Rest(..) = p {
                if self.syntax().early_errors() {
                    syntax_error!(self, p.span(), SyntaxError::NonLastRestParam)
                }
            }
        }

        let optional = (self.input.syntax().dts() || self.ctx().in_declare) && eat!(self, '?');

        Ok(Pat::Object(ObjectPat {
            span,
            props,
            optional,
            type_ann: None,
        }))
    }

    /// Production 'BindingProperty'
    fn parse_object_prop(&mut self) -> PResult<Self::Prop> {
        let start = cur_pos!(self);

        if eat!(self, "...") {
            // spread element
            let dot3_token = span!(self, start);

            let arg = Box::new(self.parse_binding_pat_or_ident()?);

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
            key,
            value,
        }))
    }
}
