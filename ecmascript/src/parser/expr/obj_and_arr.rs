//! Parser for object literal.

use super::*;

impl<I: Input> Parser<I> {
    pub(super) fn parse_object_lit(&mut self) -> PResult<Box<Expr>> {
        self.parse_object()
    }
    pub(super) fn parse_array_lit(&mut self) -> PResult<Box<Expr>> {
        self.parse_array()
    }

    fn parse_object<T>(&mut self) -> PResult<T>
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

    fn parse_array<T>(&mut self) -> PResult<T>
    where
        Self: ParseArray<T>,
    {
        unimplemented!("parse_arr")
    }

    /// Production 'PropertyName'
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
                let expr = self.parse_assignment_expr(true).map(PropName::Computed)?;
                expect!(self, ']');
                expr
            }
            _ => unexpected!(self),
        };

        Ok(v)
    }

    pub(in parser) fn parse_binding_pat(&mut self) -> PResult<Pat> {
        if is!(self, '{') {
            return self.parse_object();
        }
        if is!(self, '[') {
            return self.parse_array();
        }

        unexpected!(self)
    }

    fn parse_formal_param(&mut self) -> PResult<Pat> {
        let pat = match *cur!(self)? {
            LBrace | LBracket => self.parse_binding_pat()?,
            Word(..) => self.parse_binding_ident().map(Pat::from)?,
            _ => unexpected!(self),
        };

        unimplemented!("parse_opt_initializer")

        // TODO: optional initializer
    }

    fn parse_formal_params(&mut self) -> PResult<Vec<Pat>> {
        // TODO
        if is!(self, ')') {
            return Ok(vec![]);
        }

        unimplemented!("parse_formal_params")
    }

    fn parse_unique_formal_params(&mut self) -> PResult<Vec<Pat>> {
        // TODO
        if is!(self, ')') {
            return Ok(vec![]);
        }
        unimplemented!("parse_unique_formal_params")
    }

    /// `parse_args` closure should not eat '(' or ')'.
    fn parse_fn_args_body<F>(
        &mut self,
        parse_args: F,
        is_async: Option<Async>,
        is_generator: Option<Generator>,
    ) -> PResult<Function>
    where
        F: FnOnce(&mut Self) -> PResult<Vec<Pat>>,
    {
        self.with_ctx(
            Context {
                in_async: is_async,
                in_generator: is_generator,
                ..self.ctx
            },
            |p| {
                expect!(p, '(');

                let params = parse_args(p)?;

                expect!(p, ')');

                let body = p.parse_block()?;

                Ok(Function {
                    params,
                    body,
                    is_async: is_async.is_some(),
                    is_generator: is_generator.is_some(),
                })
            },
        )
    }
}

trait ParseArray<Arr> {
    /// Type of element without elision.
    type Elem;
}

trait ParseObject<Obj> {
    type Prop;
    fn make_object(span: Span, props: Vec<Self::Prop>) -> Obj;
    fn parse_object_prop(&mut self) -> PResult<Self::Prop>;
}

impl<I: Input> ParseObject<Box<Expr>> for Parser<I> {
    type Prop = Prop;

    fn make_object(span: Span, props: Vec<Self::Prop>) -> Box<Expr> {
        box Expr {
            span,
            node: ExprKind::Object { props },
        }
    }

    /// Production 'PropertyDefinition'
    fn parse_object_prop(&mut self) -> PResult<Self::Prop> {
        spanned!(self, {
            // Parse as 'MethodDefinition'

            if eat!(self, '*') {
                let span = prev_span!(self);
                let name = self.parse_prop_name()?;
                return self.parse_fn_args_body(
                    Parser::parse_unique_formal_params,
                    None,
                    Some(Generator),
                ).map(|function| Prop {
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
                let value = self.parse_assignment_expr(true)?;
                return Ok(Prop {
                    span: start + value.span,
                    node: PropKind::KeyValue { key, value },
                });
            }

            // Handle `a(){}` (and async(){} / get(){} / set(){})
            if is!(self, '(') {
                return self.parse_fn_args_body(Parser::parse_unique_formal_params, None, None)
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
            if is_one_of!(self, ',', '}') {
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
                    syntax_error!(self, SyntaxError::ReservedWordInShorthand)
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
                        js_word!("get") => self.parse_fn_args_body(|_| Ok(vec![]), None, None)
                            .map(|Function { body, .. }| Prop {
                                span: ident.span + prev_span!(self),
                                node: PropKind::Getter { key, body },
                            }),
                        js_word!("set") => {
                            self.parse_fn_args_body(
                                |p| p.parse_formal_param().map(|pat| vec![pat]),
                                None,
                                None,
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
                        js_word!("async") => self.parse_fn_args_body(
                            Parser::parse_unique_formal_params,
                            Some(Async),
                            None,
                        ).map(|function| Prop {
                            span: ident.span + prev_span!(self),
                            node: PropKind::Method { key, function },
                        }),
                        _ => unreachable!(),
                    };
                }
                _ => unexpected!(self),
            }
        })
    }
}

impl<I: Input> ParseArray<Box<Expr>> for Parser<I> {
    type Elem = ExprOrSpread;
}

/// 13.3.3 Destructuring Binding Patterns
impl<I: Input> ParseArray<Pat> for Parser<I> {
    type Elem = Pat;
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
        unimplemented!()
    }
}
