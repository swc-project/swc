use super::*;

mod obj_and_arr;
mod ops;

impl<I: Input> Parser<I> {
    pub fn parse_expr(&mut self, include_in: bool) -> PResult<Box<Expr>> {
        let expr = self.parse_assignment_expr(include_in)?;
        let start = expr.span.start;

        if is!(self, ',') {
            let mut exprs = vec![expr];
            while eat!(self, ',') {
                exprs.push(self.parse_assignment_expr(include_in)?);
            }
            let end = exprs.last().unwrap().span.end;
            return Ok(box Expr {
                span: Span { start, end },
                node: ExprKind::Seq { exprs },
            });
        }

        Ok(expr)
    }

    /// Parse an assignment expression. This includes applications of
    /// operators like `+=`.
    ///
    fn parse_assignment_expr(&mut self, include_in: bool) -> PResult<Box<Expr>> {
        if self.ctx.in_generator.is_some() && is!(self, "yield") {
            return self.parse_yield_expr(include_in);
        }

        // self.parse_arrow_fn();
        // self.parse_async_arrow_fn();

        // Try to parse conditional expression.
        let cond = self.parse_cond_expr(include_in)?;

        match cond.node {
            // if cond is conditional expression but not left-hand-side expression,
            // just return it.
            ExprKind::Cond { .. }
            | ExprKind::Binary { .. }
            | ExprKind::Unary { .. }
            | ExprKind::Update { .. } => return Ok(cond),
            _ => {}
        }

        match cur!(self) {
            Some(&AssignOp(op)) => {
                bump!(self);
                let right = self.parse_assignment_expr(include_in)?;
                Ok(box Expr {
                    span: cond.span + right.span,
                    node: ExprKind::Assign {
                        op,
                        // TODO:
                        left: PatOrExpr::Expr(cond),
                        right,
                    },
                })
            }
            _ => Ok(cond),
        }
    }

    /// Spec: 'ConditionalExpression'
    fn parse_cond_expr(&mut self, include_in: bool) -> PResult<Box<Expr>> {
        spanned!(self, {
            let test = self.parse_bin_expr(include_in)?;

            if eat!(self, '?') {
                let cons = self.parse_assignment_expr(true)?;
                expect!(self, ':');
                let alt = self.parse_assignment_expr(include_in)?;

                Ok(ExprKind::Cond { test, cons, alt })
            } else {
                return Ok(test);
            }
        })
    }

    fn parse_primary_expr(&mut self) -> PResult<Box<Expr>> {
        let t = cur!(self)?;

        match *t {
            tok!("this") => {
                return spanned!(self, {
                    assert_and_bump!(self, "this");
                    Ok(ExprKind::This)
                });
            }

            tok!("async") => {
                // Handle async function expression
                if peeked_is!(self, "function")
                    && !self.input.has_linebreak_between_cur_and_peeked()
                {
                    return self.parse_async_fn_expr();
                }
            }

            Word(Ident(..)) => {
                // TODO: Handle [Yield, Await]
                return self.parse_ident_ref().map(From::from);
            }
            tok!("null") | tok!("true") | tok!("false") | Num(..) | Str(..) => {
                return spanned!(self, { self.parse_lit().map(ExprKind::Lit) })
            }
            tok!('[') => return self.parse_array_lit(),
            tok!('{') => return self.parse_object_lit(),

            // Handle FunctionExpression and GeneratorExpression
            tok!("function") => return self.parse_fn_expr(),
            tok!("class") => return self.parse_class_expr(),

            Regex(_, _) => {
                return spanned!(self, {
                    match bump!(self) {
                        Regex(exp, flags) => Ok(ExprKind::Lit(Lit::Regex(Regex { exp, flags }))),
                        _ => unreachable!(),
                    }
                });
            }

            tok!('`') => return self.parse_tpl_lit(),

            tok!('(') => {
                //TODO: CoverParenthesizedExpressionAndArrowParameterList
                bump!(self);
                let start = prev_span!(self);
                let expr = self.parse_expr(true)?;
                expect!(self, ')');
                return Ok(box Expr {
                    span: start + prev_span!(self),
                    node: ExprKind::Paren(expr),
                });
            }

            _ => {}
        }

        unimplemented!("Something like Err(None) to indicate no error was occured")
    }

    fn parse_member_expr(&mut self) -> PResult<Box<Expr>> {
        self.parse_member_expr_or_new_expr(false)
    }

    fn parse_member_expr_or_new_expr(
        &mut self,
        allow_new_without_paren: bool,
    ) -> PResult<Box<Expr>> {
        if eat!(self, "new") {
            let span_of_new = prev_span!(self);

            if eat!(self, '.') {
                if eat!(self, "target") {
                    let span_of_target = prev_span!(self);

                    return Ok(box Expr {
                        span: span_of_new + span_of_target,
                        node: ExprKind::MetaProp {
                            meta: Ident {
                                span: span_of_new,
                                sym: js_word!("new"),
                            },
                            prop: Ident {
                                span: span_of_target,
                                sym: js_word!("target"),
                            },
                        },
                    });
                }

                unexpected!(self)
            }

            let callee = self.parse_member_expr()?;
            if allow_new_without_paren && !is!(self, '(') {
                // Parsed with production 'NewExpression'.
                let span = span_of_new + prev_span!(self);

                return Ok(box Expr {
                    span,
                    node: ExprKind::New { callee, args: None },
                });
            }

            // Parsed with MemberExpression rule.
            let args = self.parse_args().map(Some)?;

            // We should parse subscripts for MemberExpression.
            return self.parse_subscripts(
                ExprOrSuper::Expr(box Expr {
                    span: span_of_new + prev_span!(self),
                    node: ExprKind::New { callee, args },
                }),
                true,
            );
        }

        if eat!(self, "super") {
            let base = ExprOrSuper::Super(prev_span!(self));
            return self.parse_subscripts(base, true);
        }
        let obj = self.parse_primary_expr().map(ExprOrSuper::Expr)?;
        self.parse_subscripts(obj, true)
    }

    /// Parse `NewExpresion`.
    /// This includes `MemberExpression`.
    fn parse_new_expr(&mut self) -> PResult<Box<Expr>> {
        self.parse_member_expr_or_new_expr(true)
    }

    /// Parse `Arguments[Yield, Await]`
    fn parse_args(&mut self) -> PResult<Vec<ExprOrSpread>> {
        expect!(self, '(');

        // TODO
        if eat!(self, ')') {
            return Ok(vec![]);
        }

        unimplemented!("parse_args")
    }

    fn parse_async_fn_expr(&mut self) -> PResult<Box<Expr>> {
        unimplemented!("async function")
    }
    fn parse_fn_expr(&mut self) -> PResult<Box<Expr>> {
        unimplemented!("function")
    }
    fn parse_class_expr(&mut self) -> PResult<Box<Expr>> {
        unimplemented!("class expr")
    }
    fn parse_tpl_lit(&mut self) -> PResult<Box<Expr>> {
        unimplemented!("tpl lit")
    }

    fn parse_parenthesized_expr_and_arrow_params(&mut self) -> PResult<Box<Expr>> {
        assert_and_bump!(self, '(');
        unimplemented!("parse_parenthesized_expr_and_arrow_params")
    }

    fn parse_subscripts(&mut self, mut obj: ExprOrSuper, no_call: bool) -> PResult<Box<Expr>> {
        loop {
            obj = match self.parse_subscript(obj, no_call)? {
                (expr, false) => return Ok(expr),
                (expr, true) => ExprOrSuper::Expr(expr),
            }
        }
    }

    fn parse_tpl(&mut self, _is_tagged: bool) -> PResult<TplLit> {
        unimplemented!("parse_tpl")
    }

    /// returned bool is true if this method should be called again.
    fn parse_subscript(&mut self, obj: ExprOrSuper, no_call: bool) -> PResult<(Box<Expr>, bool)> {
        // member expression
        // $obj.name
        if eat!(self, '.') {
            let prop: Box<Expr> = self.parse_ident_name().map(From::from)?;
            return Ok((
                box Expr {
                    span: obj.span() + prop.span,
                    node: ExprKind::Member {
                        obj,
                        prop,
                        computed: false,
                    },
                },
                true,
            ));
        }

        // $obj[name()]
        if eat!(self, '[') {
            let prop = self.parse_expr(false)?;
            expect!(self, ']'); //TODO
            return Ok((
                box Expr {
                    span: obj.span() + prev_span!(self),
                    node: ExprKind::Member {
                        obj,
                        prop,
                        computed: true,
                    },
                },
                true,
            ));
        }

        if !no_call && eat!(self, '(') {
            // const possibleAsync = this.atPossibleAsync(base);

            // node.callee = base;
            // node.arguments = this.parseCallExpressionArguments(
            //   tt.parenR,
            //   possibleAsync,
            // );
            // node.optional = true;

            // return this.finishNode(node, "CallExpression");
            unimplemented!("CallExpr")
        }

        match obj {
            ExprOrSuper::Expr(expr) => {
                // MemberExpression[?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
                if is!(self, '`') {
                    let _tpl_lit = self.parse_tpl(true);
                    unimplemented!("TaggedTemplateExpression")
                }

                Ok((expr, false))
            }
            ExprOrSuper::Super(..) => {
                if no_call {
                    unexpected!(self)
                }
                unexpected!(self)
            }
        }
    }
    /// Parse call, dot, and `[]`-subscript expressions.
    ///
    ///
    fn parse_lhs_expr(&mut self) -> PResult<Box<Expr>> {
        // `super()` can't be handled from parse_new_expr()
        if eat!(self, "super") {
            let obj = ExprOrSuper::Super(prev_span!(self));
            return self.parse_subscripts(obj, false);
        }

        let callee = self.parse_new_expr()?;
        match callee.node {
            // If this is parsed using 'NewExpression' rule, just return it.
            ExprKind::New { args: None, .. } => {
                assert_ne!(
                    cur!(self),
                    Some(&LParen),
                    "parse_new_expr() should eat paren if it exists"
                );
                return Ok(callee);
            }
            _ => {}
        }
        // 'CallExpr' rule contains 'MemberExpr (...)',
        // and 'MemberExpr' rule contains 'new MemberExpr (...)'

        // This is parsed using 'NewExpr' rule, which contains 'MemberExpr'
        if !is!(self, '(') {
            return Ok(callee);
        }

        let args = self.parse_args()?;
        let call_expr = box Expr {
            span: callee.span + prev_span!(self),
            node: ExprKind::Call {
                callee: ExprOrSuper::Expr(callee),
                args,
            },
        };

        self.parse_subscripts(ExprOrSuper::Expr(call_expr), false)
    }

    fn parse_call_expr_args(
        &mut self,
        close_delim: &'static Token,
        is_async_arrow_possible: bool,
    ) -> PResult<ExprOrSpread> {
        unimplemented!("parse_call_expr_args")
    }
}

/// simple leaf methods.
impl<I: Input> Parser<I> {
    fn parse_yield_expr(&mut self, include_in: bool) -> PResult<Box<Expr>> {
        spanned!(self, {
            assert_and_bump!(self, "yield");
            assert!(self.ctx.in_generator.is_some());

            unimplemented!("parse_yield_expr")
        })
    }

    /// 12.2.5 Array Initializer
    fn parse_lit(&mut self) -> PResult<Lit> {
        let v = match cur!(self)? {
            &Word(Null) => {
                bump!(self);
                Lit::Null
            }
            &Word(ref w @ True) | &Word(ref w @ False) => {
                bump!(self);
                Lit::Bool(*w == True)
            }
            &Str(..) => match bump!(self) {
                //FIXME
                Str(s, _) => Lit::Str(s),
                _ => unreachable!(),
            },
            &Num(..) => match bump!(self) {
                Num(num) => Lit::Num(num),
                _ => unreachable!(),
            },
            _ => unreachable!("parse_lit should not be called"),
        };
        Ok(v)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use lexer::Lexer;

    fn mk<'a>(s: &'static str) -> Parser<impl 'a + Input> {
        let logger = ::testing::logger().new(o!("src" => s));
        Parser::new_for_module(logger.clone(), Lexer::new_from_str(logger, s))
    }

    fn lhs(s: &'static str) -> Box<Expr> {
        mk(s)
            .parse_lhs_expr()
            .expect("failed to parse lhs expression")
    }

    #[test]
    fn new_expr_should_not_eat_too_much() {
        assert_eq_ignore_span!(
            mk("new Date().toString()").parse_new_expr().unwrap(),
            box Expr {
                span: Default::default(),
                node: ExprKind::Member {
                    obj: mk("new Date()")
                        .parse_member_expr()
                        .map(ExprOrSuper::Expr)
                        .unwrap(),
                    prop: Ident {
                        sym: "toString".into(),
                        span: Default::default(),
                    }.into(),
                    computed: false,
                },
            }
        );
    }
    #[test]
    fn lhs_expr_as_new_expr_prod() {
        assert_eq_ignore_span!(
            lhs("new Date.toString()"),
            &box Expr {
                span: Default::default(),
                node: ExprKind::New {
                    callee: lhs("Date.toString"),
                    args: Some(vec![]),
                },
            }
        );
    }

    #[test]
    fn lhs_expr_as_call() {
        assert_eq_ignore_span!(
            lhs("new Date.toString()()"),
            box Expr {
                span: Default::default(),
                node: ExprKind::Call {
                    callee: ExprOrSuper::Expr(lhs("new Date.toString()")),
                    args: vec![],
                },
            }
        )
    }

}
