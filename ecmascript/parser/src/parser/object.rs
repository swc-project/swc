//! Parser for object literal.

use super::*;
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
                    let expr = p
                        .include_in_expr(true)
                        .parse_assignment_expr()
                        .map(PropName::Computed)?;
                    expect!(']');
                    expr
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
                    Parser::parse_unique_formal_params,
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

        let key = self.parse_prop_name()?;
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
                    Parser::parse_unique_formal_params,
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

        // `ident` from parse_prop_name is parsed as 'IdentifierName'
        // It means we should check for invalid expressions like { for, }
        if is_one_of!('=', ',', '}') {
            let is_reserved_word = { self.ctx().is_reserved_word(&ident.sym) };
            if is_reserved_word {
                syntax_error!(ident.span, SyntaxError::ReservedWordInObjShorthandOrPat);
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
                let key = self.parse_prop_name()?;

                match ident.sym {
                    js_word!("get") => self
                        .parse_fn_args_body(
                            // no decorator in an object literal
                            vec![],
                            start,
                            |_| Ok(vec![]),
                            false,
                            false,
                        )
                        .map(|Function { body, .. }| {
                            PropOrSpread::Prop(Box::new(Prop::Getter(GetterProp {
                                span: span!(start),
                                key,
                                body,
                            })))
                        }),
                    js_word!("set") => self
                        .parse_fn_args_body(
                            // no decorator in an object literal
                            vec![],
                            start,
                            |p| p.parse_formal_param().map(|pat| vec![pat]),
                            false,
                            false,
                        )
                        .map(|Function { params, body, .. }| {
                            debug_assert_eq!(params.len(), 1);
                            PropOrSpread::Prop(Box::new(Prop::Setter(SetterProp {
                                span: span!(start),
                                key,
                                body,
                                param: params.into_iter().next().unwrap(),
                            })))
                        }),
                    js_word!("async") => self
                        .parse_fn_args_body(
                            // no decorator in an object literal
                            vec![],
                            start,
                            Parser::parse_unique_formal_params,
                            true,
                            false,
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
                match p {
                    ObjectPatProp::Rest(ref rest) => match *rest.arg {
                        Pat::Ident(..) => {}
                        _ => syntax_error!(p.span(), SyntaxError::DotsWithoutIdentifier),
                    },
                    _ => {}
                }
                continue;
            }

            match p {
                ObjectPatProp::Rest(..) => syntax_error!(p.span(), SyntaxError::NonLastRestParam),
                _ => {}
            }
        }

        Ok(Pat::Object(ObjectPat {
            span,
            props,
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
                syntax_error!(key.span, SyntaxError::ReservedWordInObjShorthandOrPat);
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
