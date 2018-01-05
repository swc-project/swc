//! Parser for object literal.

use super::*;

impl<I: Input> Parser<I> {
    pub(super) fn parse_object<T>(&mut self) -> PResult<T>
    where
        Self: ParseObject<T>,
    {
        assert_and_bump!(self, '{');

        let start = prev_span!(self);
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

        Ok(Self::make_object(start + prev_span!(self), props))
    }

    /// spec: 'PropertyName'
    fn parse_prop_name(&mut self) -> PResult<PropName> {
        let v = match *cur!(self)? {
            Str(_, _) => match bump!(self) {
                Str(s, _) => PropName::Str(s),
                _ => unreachable!(),
            },
            Num(_) => match bump!(self) {
                Num(n) => PropName::Num(n),
                _ => unreachable!(),
            },
            Word(..) => match bump!(self) {
                Word(w) => PropName::Ident(Ident {
                    sym: w.into(),
                    span: prev_span!(self),
                }),
                _ => unreachable!(),
            },
            LBracket => {
                bump!(self);
                let expr = self.include_in_expr(true)
                    .parse_assignment_expr()
                    .map(PropName::Computed)?;
                expect!(self, ']');
                expr
            }
            _ => unexpected!(self),
        };

        Ok(v)
    }

    /// `parse_args` closure should not eat '(' or ')'.
    fn parse_fn_args_body<F>(
        &mut self,
        parse_args: F,
        is_async: bool,
        is_generator: bool,
    ) -> PResult<Function>
    where
        F: FnOnce(&mut Self) -> PResult<Vec<Pat>>,
    {
        let mut p = self.with_ctx(Context {
            in_async: is_async,
            in_generator: is_generator,
            ..self.ctx
        });

        expect!(p, '(');

        let params = parse_args(&mut p)?;

        expect!(p, ')');

        let body = p.parse_fn_body(is_async, is_generator)?;

        Ok(Function {
            params,
            body,
            is_async,
            is_generator,
        })
    }
}

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
        spanned!(self, {
            // Parse as 'MethodDefinition'

            if eat!(self, '*') {
                let span = prev_span!(self);
                let name = self.parse_prop_name()?;
                return self.parse_fn_args_body(Parser::parse_unique_formal_params, false, true)
                    .map(|function| Prop {
                        span: span + prev_span!(self),
                        node: PropKind::Method {
                            key: name,
                            function,
                        },
                    });
            }

            let start = cur_span!(self);
            let key = self.parse_prop_name()?;
            //
            // {[computed()]: a,}
            // { 'a': a, }
            // { 0: 1, }
            // { a: expr, }
            if eat!(self, ':') {
                let value = self.include_in_expr(true).parse_assignment_expr()?;
                return Ok(Prop {
                    span: start + value.span,
                    node: PropKind::KeyValue { key, value },
                });
            }

            // Handle `a(){}` (and async(){} / get(){} / set(){})
            if is!(self, '(') {
                return self.parse_fn_args_body(Parser::parse_unique_formal_params, false, false)
                    .map(|function| Prop {
                        span: start + prev_span!(self),
                        node: PropKind::Method { key, function },
                    });
            }

            let mut ident = match key {
                PropName::Ident(ident) => ident,
                _ => unexpected!(self),
            };

            // TODO: Handle CoverInitializedName

            // `ident` from parse_prop_name is parsed as 'IdentifierName'
            // It means we should check for invalid expressions like { for, }
            if is_one_of!(self, '=', ',', '}') {
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
                    syntax_error!(self, SyntaxError::ReservedWordInObjShorthandOrPat)
                }

                if is!(self, '=') {
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
                                span: ident.span + prev_span!(self),
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
                                    span: ident.span + prev_span!(self),
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
                                    span: ident.span + prev_span!(self),
                                    node: PropKind::Method { key, function },
                                })
                        }
                        _ => unreachable!(),
                    };
                }
                _ => unexpected!(self),
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
