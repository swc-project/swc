//! Parser for object literal.

use super::*;
use crate::make_span;
use swc_atoms::js_word;
use swc_common::Spanned;

#[parser]
impl<'a, I: Tokens> Parser<'a, I> {
    /// Parse a object literal or object pattern.
    pub(super) fn parse_object<T>(&mut self) -> PResult<'a, T>
    where
        Self: ParseObject<'a, T>,
    {
        let start = cur_pos!();
        assert_and_bump!('{');

        let mut props = vec![];

        let mut first = true;
        while !eat!('}') {
            // Handle comma
            if first {
                first = false;
            } else {
                expect!(',');
                if eat!('}') {
                    break;
                }
            }

            let prop = self.parse_object_prop()?;
            props.push(prop);
        }

        self.make_object(span!(start), props)
    }

    /// spec: 'PropertyName'
    pub(super) fn parse_prop_name(&mut self) -> PResult<'a, PropName> {
        let ctx = self.ctx();
        self.with_ctx(Context {
            in_property_name: true,
            ..ctx
        })
        .parse_with(|p| {
            let start = cur_pos!();

            let v = match *cur!(true)? {
                Token::Str { .. } => match bump!() {
                    Token::Str { value, has_escape } => PropName::Str(Str {
                        span: span!(start),
                        value,
                        has_escape,
                    }),
                    _ => unreachable!(),
                },
                Token::Num(_) => match bump!() {
                    Token::Num(value) => PropName::Num(Number {
                        span: span!(start),
                        value,
                    }),
                    _ => unreachable!(),
                },
                Word(..) => match bump!() {
                    Word(w) => PropName::Ident(Ident::new(w.into(), span!(start))),
                    _ => unreachable!(),
                },
                tok!('[') => {
                    bump!();
                    let inner_start = cur_pos!();

                    let mut expr = p.include_in_expr(true).parse_assignment_expr()?;

                    if p.syntax().typescript() && is!(',') {
                        let mut exprs = vec![expr];

                        while eat!(',') {
                            exprs.push(p.include_in_expr(true).parse_assignment_expr()?);
                        }

                        p.emit_err(span!(inner_start), SyntaxError::TS1171);

                        expr = Box::new(
                            SeqExpr {
                                span: span!(inner_start),
                                exprs,
                            }
                            .into(),
                        );
                    }

                    expect!(']');

                    PropName::Computed(ComputedPropName {
                        span: span!(start),
                        expr,
                    })
                }
                _ => unexpected!(),
            };

            Ok(v)
        })
    }
}

#[parser]
impl<'a, I: Tokens> ParseObject<'a, Box<Expr>> for Parser<'a, I> {
    type Prop = PropOrSpread;

    fn make_object(&mut self, span: Span, props: Vec<Self::Prop>) -> PResult<'a, Box<Expr>> {
        Ok(Box::new(Expr::Object(ObjectLit { span, props })))
    }

    /// spec: 'PropertyDefinition'
    fn parse_object_prop(&mut self) -> PResult<'a, Self::Prop> {
        let start = cur_pos!();
        // Parse as 'MethodDefinition'

        if eat!("...") {
            // spread elemnent
            let dot3_token = span!(start);

            let expr = self.include_in_expr(true).parse_assignment_expr()?;

            return Ok(PropOrSpread::Spread(SpreadElement { dot3_token, expr }));
        }

        if eat!('*') {
            let span_of_gen = span!(start);

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
            && !is_one_of!('(', '[', ':', ',', '?', '=', '*', IdentName)
            && !(self.input.syntax().typescript() && is!('<'))
            && !(is!('}')
                && match key {
                    PropName::Ident(..) => true,
                    _ => false,
                })
        {
            self.emit_err(self.input.cur_span(), SyntaxError::TS1005);
            return Ok(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key,
                value: Box::new(Expr::Invalid(Invalid { span: span!(start) })),
            }))));
        }
        //
        // {[computed()]: a,}
        // { 'a': a, }
        // { 0: 1, }
        // { a: expr, }
        if eat!(':') {
            let value = self.include_in_expr(true).parse_assignment_expr()?;
            return Ok(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key,
                value,
            }))));
        }

        // Handle `a(){}` (and async(){} / get(){} / set(){})
        if (self.input.syntax().typescript() && is!('<')) || is!('(') {
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
            _ => unexpected!(),
        };

        if eat!('?') {
            self.emit_err(make_span(self.input.prev_span()), SyntaxError::TS1162);
        }

        // `ident` from parse_prop_name is parsed as 'IdentifierName'
        // It means we should check for invalid expressions like { for, }
        if is_one_of!('=', ',', '}') {
            let is_reserved_word = { self.ctx().is_reserved_word(&ident.sym) };
            if is_reserved_word {
                self.emit_err(ident.span, SyntaxError::ReservedWordInObjShorthandOrPat);
            }

            if eat!('=') {
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
                    self.emit_err(make_span(modifiers_span), SyntaxError::TS1042);
                }

                let is_generator = ident.sym == js_word!("async") && eat!('*');
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

                                if params.len() != 0 {
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
                                    span: span!(start),
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

                                if params.len() != 1 {
                                    p.emit_err(key_span, SyntaxError::TS1094);
                                }

                                if !params.is_empty() {
                                    if let Pat::Rest(..) = params[0] {
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
                                    span: span!(start),
                                    key,
                                    body,
                                    param: params.into_iter().next().unwrap_or_else(|| {
                                        Pat::Invalid(Invalid { span: key_span })
                                    }),
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
            _ => unexpected!(),
        }
    }
}

#[parser]
impl<'a, I: Tokens> ParseObject<'a, Pat> for Parser<'a, I> {
    type Prop = ObjectPatProp;

    fn make_object(&mut self, span: Span, props: Vec<Self::Prop>) -> PResult<'a, Pat> {
        let len = props.len();
        for (i, p) in props.iter().enumerate() {
            if i == len - 1 {
                if let ObjectPatProp::Rest(ref rest) = p {
                    match *rest.arg {
                        Pat::Ident(..) => {}
                        _ => syntax_error!(p.span(), SyntaxError::DotsWithoutIdentifier),
                    }
                }
                continue;
            }

            if let ObjectPatProp::Rest(..) = p {
                syntax_error!(p.span(), SyntaxError::NonLastRestParam)
            }
        }

        let optional = (self.input.syntax().dts() || self.ctx().in_declare) && eat!('?');

        Ok(Pat::Object(ObjectPat {
            span,
            props,
            optional,
            type_ann: None,
        }))
    }

    /// Production 'BindingProperty'
    fn parse_object_prop(&mut self) -> PResult<'a, Self::Prop> {
        let start = cur_pos!();

        if eat!("...") {
            // spread elemnent
            let dot3_token = span!(start);

            let arg = Box::new(self.parse_binding_pat_or_ident()?);

            return Ok(ObjectPatProp::Rest(RestPat {
                span: span!(start),
                dot3_token,
                arg,
                type_ann: None,
            }));
        }

        let key = self.parse_prop_name()?;
        if eat!(':') {
            let value = Box::new(self.parse_binding_element()?);

            return Ok(ObjectPatProp::KeyValue(KeyValuePatProp { key, value }));
        }
        let key = match key {
            PropName::Ident(ident) => ident,
            _ => unexpected!(),
        };

        let value = if eat!('=') {
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
            span: span!(start),
            key,
            value,
        }))
    }
}
