use super::*;

impl<I: Input> Parser<I> {
    pub(super) fn parse_obj_lit(&mut self) -> PResult<Box<Expr>> {
        assert_eq!(self.i.cur(), Some(&LBrace));
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

            let prop = self.parse_prop_def()?;
            props.push(prop);
        }

        unimplemented!("object lit")
    }

    /// Production 'PropertyDefinition'
    fn parse_prop_def(&mut self) -> PResult<Prop> {
        // Parse as 'MethodDefinition'

        if self.i.eat(&BinOp(Mul)) {
            let span = self.i.last_span();
            let name = self.parse_prop_name()?;
            return self.parse_fn_args_body(true, None, Some(Generator))
                .map(|function| Prop {
                    span: span + self.i.last_span(),
                    node: PropKind::Method {
                        key: name,
                        function,
                    },
                });
        }

        if self.i.is(&Word(Ident(js_word!("async")))) {
            let span_of_async = self.i.cur_span();
            let async_ident = Ident {
                span: span_of_async,
                sym: js_word!("async"),
            };

            match *self.i.peek()? {
                // { async, }
                Comma | RBrace => {
                    self.i.bump();
                    return Ok(Prop::new_shorthand(async_ident));
                }

                // { async: value, }
                Colon => {
                    self.i.bump();
                    self.i.bump();

                    let value = self.parse_assignment_expr(true)?;
                    return Ok(Prop {
                        span: span_of_async + value.span,
                        node: PropKind::KeyValue {
                            key: async_ident.into(),
                            value,
                        },
                    });
                }

                // { async(args) {}, }
                LParen => {
                    self.i.bump();

                    return self.parse_fn_args_body(true, None, None)
                        .map(|function| Prop {
                            span: span_of_async + self.i.last_span(),
                            node: PropKind::Method {
                                key: Ident {
                                    span: span_of_async,
                                    sym: js_word!("async"),
                                }.into(),
                                function,
                            },
                        });
                }

                AssignOp(Assign) => unimplemented!("'=' inside object literal"),

                // { async name(args) {}, }
                _ => {
                    self.i.bump();
                    if self.i.had_line_break_before_cur() {
                        unimplemented!(
                            "Error: linebreak between async and name in 'async name(args) {{}}'"
                        )
                    }
                    let span = self.i.last_span();
                    let name = self.parse_prop_name()?;
                    return self.parse_fn_args_body(true, Some(Async), None)
                        .map(|function| Prop {
                            span: span + self.i.last_span(),
                            node: PropKind::Method {
                                key: name,
                                function,
                            },
                        });
                }
            }
        }

        if self.i.eat(&Word(Ident(js_word!("get")))) {
            unimplemented!("getter property in object literal")
        }

        if self.i.eat(&Word(Ident(js_word!("set")))) {
            unimplemented!("getter property in object literal")
        }

        unimplemented!("other object literal rules")
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
            _ => unimplemented!("Error reporting"),
        };

        Ok(v)
    }

    fn parse_formal_params(&mut self) -> PResult<Vec<Pat>> {
        unimplemented!("parse_formal_params")
    }

    fn parse_fn_args_body(
        &mut self,
        unique_args: bool,
        is_async: Option<Async>,
        is_generator: Option<Generator>,
    ) -> PResult<Function> {
        self.with_ctx(
            Context {
                in_async: is_async,
                in_generator: is_generator,
                ..self.ctx
            },
            |p| {
                p.expect(&LParen)?;

                let params = p.parse_formal_params()?;

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
