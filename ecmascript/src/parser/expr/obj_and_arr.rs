//! Parser for object literal.

use super::*;

impl<I: Input> Parser<I> {
    pub(super) fn parse_obj_lit(&mut self) -> PResult<Box<Expr>> {
        self.parse_obj()
    }

    fn parse_obj<T>(&mut self) -> PResult<T>
    where
        T: ParseObject,
    {
        assert_eq!(self.i.cur(), Some(&LBrace));
        self.i.bump(); // '{'

        let start = self.i.last_span();
        let mut props = vec![];

        let mut first = true;
        while !self.i.eat(&RBrace) {
            // Handle comma
            if first {
                first = false;
            } else {
                self.expect(&Comma)?;
                if self.i.eat(&RBrace) {
                    break;
                }
            }

            let prop = T::parse_prop(self)?;
            props.push(prop);
        }

        Ok(T::from_props(start + self.i.last_span(), props))
    }

    fn parse_arr<T>(&mut self) -> PResult<T>
    where
        T: ParseArray,
    {
        unimplemented!("parse_arr")
    }

    /// Production 'PropertyName'
    fn parse_prop_name(&mut self) -> PResult<PropName> {
        let v = match *self.i.cur()? {
            Str(_, _) => match self.i.bump() {
                Str(s, _) => PropName::Str(s),
                _ => unreachable!(),
            },
            Num(_) => match self.i.bump() {
                Num(n) => PropName::Num(n),
                _ => unreachable!(),
            },
            Word(..) => match self.i.bump() {
                Word(w) => PropName::Ident(Ident {
                    sym: w.into(),
                    span: self.i.last_span(),
                }),
                _ => unreachable!(),
            },
            LBracket => {
                self.i.bump();
                let expr = self.parse_assignment_expr(true).map(PropName::Computed)?;
                self.expect(&RBracket)?;
                expr
            }
            ref t => unimplemented!("Unexpected token {:?}", t),
        };

        Ok(v)
    }

    fn parse_binding_pat(&mut self) -> PResult<Pat> {
        if self.i.is(&LBracket) {
            return self.parse_obj();
        }

        self.parse_arr()
    }

    fn parse_formal_param(&mut self) -> PResult<Pat> {
        let pat = match *self.i.cur()? {
            LBrace | LBracket => self.parse_binding_pat()?,
            Word(..) => self.parse_binding_ident().map(Pat::from)?,
            _ => unimplemented!("expected identifier or pattern"),
        };

        unimplemented!("parse_opt_initializer")

        // TODO: optional initializer
    }

    fn parse_formal_params(&mut self) -> PResult<Vec<Pat>> {
        // TODO
        if self.i.is(&RParen) {
            return Ok(vec![]);
        }

        unimplemented!("parse_formal_params")
    }

    fn parse_unique_formal_params(&mut self) -> PResult<Vec<Pat>> {
        // TODO
        if self.i.is(&RParen) {
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
                p.expect(&LParen)?;

                let params = parse_args(p)?;

                p.expect(&RParen)?;

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

trait ParseArray {
    /// Type of element without elision.
    type Elem;
}

trait ParseObject {
    type Prop;
    fn from_props(span: Span, props: Vec<Self::Prop>) -> Self;
    fn parse_prop<I: Input>(p: &mut Parser<I>) -> PResult<Self::Prop>;
}

impl ParseObject for Box<Expr> {
    type Prop = Prop;

    fn from_props(span: Span, props: Vec<Self::Prop>) -> Self {
        box Expr {
            span,
            node: ExprKind::Object { props },
        }
    }

    /// Production 'PropertyDefinition'
    fn parse_prop<I: Input>(p: &mut Parser<I>) -> PResult<Self::Prop> {
        // Parse as 'MethodDefinition'

        if p.i.eat(&BinOp(Mul)) {
            let span = p.i.last_span();
            let name = p.parse_prop_name()?;
            return p.parse_fn_args_body(Parser::parse_unique_formal_params, None, Some(Generator))
                .map(|function| Prop {
                    span: span + p.i.last_span(),
                    node: PropKind::Method {
                        key: name,
                        function,
                    },
                });
        }

        let start = p.i.cur_span();
        let key = p.parse_prop_name()?;
        //
        // {[computed()]: a,}
        // { 'a': a, }
        // { 0: 1, }
        // { a: expr, }
        if p.i.eat(&Colon) {
            let value = p.parse_assignment_expr(true)?;
            return Ok(Prop {
                span: start + value.span,
                node: PropKind::KeyValue { key, value },
            });
        }

        // Handle `a(){}` (and async(){} / get(){} / set(){})
        if p.i.is(&LParen) {
            return p.parse_fn_args_body(Parser::parse_unique_formal_params, None, None)
                .map(|function| Prop {
                    span: start + p.i.last_span(),
                    node: PropKind::Method { key, function },
                });
        }

        let mut ident = match key {
            PropName::Ident(ident) => ident,
            _ => unimplemented!(
                "expected ':' after string literal, numeric literal or computed property"
            ),
        };

        // TODO: Handle CoverInitializedName

        // `ident` from parse_prop_name is parsed as 'IdentifierName'
        // It means we should check for invalid expressions like { for, }
        if p.i.is(&Comma) || p.i.is(&RBrace) {
            let is_reserved_word = {
                // TODO extension trait
                let word = Word::from(ident.sym);
                let r = word.is_reserved_word(p.ctx.strict);
                ident = Ident {
                    sym: word.into(),
                    ..ident
                };
                r
            };
            if is_reserved_word {
                unimplemented!("cannot use a reserved word as a shorthand property")
            }

            return Ok(Prop::new_shorthand(ident));
        }

        // get a(){}
        // set a(v){}
        // async a(){}

        match ident.sym {
            js_word!("get") | js_word!("set") | js_word!("async") => {
                let key = p.parse_prop_name()?;

                return match ident.sym {
                    js_word!("get") => p.parse_fn_args_body(|_| Ok(vec![]), None, None).map(
                        |Function { body, .. }| Prop {
                            span: ident.span + p.i.last_span(),
                            node: PropKind::Getter { key, body },
                        },
                    ),
                    js_word!("set") => {
                        p.parse_fn_args_body(
                            |p| p.parse_formal_param().map(|pat| vec![pat]),
                            None,
                            None,
                        ).map(|Function { params, body, .. }| {
                            //TODO
                            assert_eq!(params.len(), 1);
                            Prop {
                                span: ident.span + p.i.last_span(),
                                node: PropKind::Setter {
                                    key,
                                    body,
                                    param: params.into_iter().next().unwrap(),
                                },
                            }
                        })
                    }
                    js_word!("async") => {
                        p.parse_fn_args_body(Parser::parse_unique_formal_params, Some(Async), None)
                            .map(|function| Prop {
                                span: ident.span + p.i.last_span(),
                                node: PropKind::Method { key, function },
                            })
                    }
                    _ => unreachable!(),
                };
            }
            _ => unimplemented!("SyntaxError (unexpected token)"),
        }
    }
}

/// 13.3.3 Destructuring Binding Patterns
impl ParseArray for Pat {
    type Elem = Pat;
}

impl ParseObject for Pat {
    type Prop = AssignProp;

    fn from_props(span: Span, props: Vec<Self::Prop>) -> Self {
        Pat {
            span,
            node: PatKind::Object { props },
        }
    }

    /// Production 'BindingProperty'
    fn parse_prop<I: Input>(p: &mut Parser<I>) -> PResult<Self::Prop> {
        unimplemented!()
    }
}
