//! Parser for object literal.

use super::*;

#[parser]
impl<I: Input> Parser<I> {
    /// Parse a object literal or object pattern.
    pub(super) fn parse_object<T>(&mut self) -> PResult<T>
    where
        Self: ParseObject<T>,
    {
        assert_and_bump!('{');

        let start = prev_span!();
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

        Ok(Self::make_object(start + prev_span!(), props))
    }

    /// spec: 'PropertyName'
    pub(super) fn parse_prop_name(&mut self) -> PResult<PropName> {
        let v = match *cur!()? {
            Str(_, _) => match bump!() {
                Str(s, _) => PropName::Str(s),
                _ => unreachable!(),
            },
            Num(_) => match bump!() {
                Num(n) => PropName::Num(n),
                _ => unreachable!(),
            },
            Word(..) => match bump!() {
                Word(w) => PropName::Ident(Ident {
                    sym: w.into(),
                    span: prev_span!(),
                }),
                _ => unreachable!(),
            },
            LBracket => {
                bump!();
                let expr = self.include_in_expr(true)
                    .parse_assignment_expr()
                    .map(PropName::Computed)?;
                expect!(']');
                expr
            }
            _ => unexpected!(),
        };

        Ok(v)
    }
}

#[parser]
impl<I: Input> ParseObject<Box<Expr>> for Parser<I> {
    type Prop = Prop;

    fn make_object(span: Span, props: Vec<Self::Prop>) -> Box<Expr> {
        box Expr {
            span,
            node: ExprKind::Object { props },
        }
    }

    /// spec: 'PropertyDefinition'
    fn parse_object_prop(&mut self) -> PResult<Self::Prop> {
        spanned!({
            // Parse as 'MethodDefinition'

            if eat!('*') {
                let span = prev_span!();
                let name = self.parse_prop_name()?;
                return self.parse_fn_args_body(Parser::parse_unique_formal_params, false, true)
                    .map(|function| Prop {
                        span: span + prev_span!(),
                        node: PropKind::Method {
                            key: name,
                            function,
                        },
                    });
            }

            let start = cur_span!();
            let key = self.parse_prop_name()?;
            //
            // {[computed()]: a,}
            // { 'a': a, }
            // { 0: 1, }
            // { a: expr, }
            if eat!(':') {
                let value = self.include_in_expr(true).parse_assignment_expr()?;
                return Ok(Prop {
                    span: start + value.span,
                    node: PropKind::KeyValue { key, value },
                });
            }

            // Handle `a(){}` (and async(){} / get(){} / set(){})
            if is!('(') {
                return self.parse_fn_args_body(Parser::parse_unique_formal_params, false, false)
                    .map(|function| Prop {
                        span: start + prev_span!(),
                        node: PropKind::Method { key, function },
                    });
            }

            let mut ident = match key {
                PropName::Ident(ident) => ident,
                _ => unexpected!(),
            };

            // TODO: Handle CoverInitializedName

            // `ident` from parse_prop_name is parsed as 'IdentifierName'
            // It means we should check for invalid expressions like { for, }
            if is_one_of!('=', ',', '}') {
                let is_reserved_word = {
                    // TODO extension trait
                    let word = Word::from(ident.sym);
                    let r = word.is_reserved_word(self.ctx.strict);
                    ident = Ident {
                        sym: word.into(),
                        ..ident
                    };
                    r
                };
                if is_reserved_word {
                    syntax_error!(SyntaxError::ReservedWordInObjShorthandOrPat)
                }

                if is!('=') {
                    unimplemented!("parse_initialized_name in object literal")
                }

                return Ok(Prop::new_shorthand(ident));
            }

            // get a(){}
            // set a(v){}
            // async a(){}

            match ident.sym {
                js_word!("get") | js_word!("set") | js_word!("async") => {
                    let key = self.parse_prop_name()?;

                    return match ident.sym {
                        js_word!("get") => self.parse_fn_args_body(|_| Ok(vec![]), false, false)
                            .map(|Function { body, .. }| Prop {
                                span: ident.span + prev_span!(),
                                node: PropKind::Getter { key, body },
                            }),
                        js_word!("set") => {
                            self.parse_fn_args_body(
                                |p| p.parse_formal_param().map(|pat| vec![pat]),
                                false,
                                false,
                            ).map(|Function { params, body, .. }| {
                                //TODO
                                assert_eq!(params.len(), 1);
                                Prop {
                                    span: ident.span + prev_span!(),
                                    node: PropKind::Setter {
                                        key,
                                        body,
                                        param: params.into_iter().next().unwrap(),
                                    },
                                }
                            })
                        }
                        js_word!("async") => {
                            self.parse_fn_args_body(Parser::parse_unique_formal_params, true, false)
                                .map(|function| Prop {
                                    span: ident.span + prev_span!(),
                                    node: PropKind::Method { key, function },
                                })
                        }
                        _ => unreachable!(),
                    };
                }
                _ => unexpected!(),
            }
        })
    }
}

impl<I: Input> ParseObject<Pat> for Parser<I> {
    type Prop = AssignProp;

    fn make_object(span: Span, props: Vec<Self::Prop>) -> Pat {
        Pat {
            span,
            node: PatKind::Object { props },
        }
    }

    /// Production 'BindingProperty'
    fn parse_object_prop(&mut self) -> PResult<Self::Prop> {
        let key = self.parse_prop_name()?;

        unimplemented!()
    }
}
