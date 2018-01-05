use super::*;

mod ops;

impl<I: Input> Parser<I> {
    pub fn parse_expr(&mut self) -> PResult<Box<Expr>> {
        let expr = self.parse_assignment_expr()?;
        let start = expr.span.start;

        if is!(self, ',') {
            let mut exprs = vec![expr];
            while eat!(self, ',') {
                exprs.push(self.parse_assignment_expr()?);
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
    pub(super) fn parse_assignment_expr(&mut self) -> PResult<Box<Expr>> {
        if self.ctx.in_generator && is!(self, "yield") {
            return self.parse_yield_expr();
        }

        self.state.potential_arrow_start = match *cur!(self)? {
            Word(Ident(..)) | tok!('(') | tok!("yield") => Some(cur_span!(self).start),
            _ => None,
        };

        // self.parse_arrow_fn();
        // self.parse_async_arrow_fn();

        // Try to parse conditional expression.
        let cond = self.parse_cond_expr()?;

        return_if_arrow!(self, cond);

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
                let right = self.parse_assignment_expr()?;
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
    fn parse_cond_expr(&mut self) -> PResult<Box<Expr>> {
        spanned!(self, {
            let test = self.parse_bin_expr()?;
            return_if_arrow!(self, test);

            if eat!(self, '?') {
                let cons = self.include_in_expr(true).parse_assignment_expr()?;
                expect!(self, ':');
                let alt = self.parse_assignment_expr()?;

                Ok(ExprKind::Cond { test, cons, alt })
            } else {
                return Ok(test);
            }
        })
    }

    /// Parse a primary expression or arrow function
    fn parse_primary_expr(&mut self) -> PResult<Box<Expr>> {
        let can_be_arrow = self.state
            .potential_arrow_start
            .map(|s| s == cur_span!(self).start)
            .unwrap_or(false);

        // debug!(
        //     self.logger,
        //     "Parsing a primary expression. cur={:?} can_be_arrow={}",
        //     cur!(self),
        //     can_be_arrow
        // );

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

            tok!("let") | Word(Ident(..)) => {
                return spanned!(self, {
                    // TODO: Handle [Yield, Await]
                    let id = self.parse_ident_ref()?;

                    if can_be_arrow && id.sym == js_word!("async") && is!(self, ident) {
                        // async a => body
                        let arg = self.parse_binding_ident().map(Pat::from)?;
                        let params = vec![arg];
                        expect!(self, "=>");
                        let body = self.parse_fn_body(true, false)?;
                        Ok(ExprKind::Arrow {
                            body,
                            params,
                            is_async: true,
                            is_generator: false,
                        })
                    } else if can_be_arrow && !eat!(self, ';') && eat!(self, "=>") {
                        // async is parameter

                        let params = vec![id.into()];
                        let body = self.parse_fn_body(false, false)?;
                        Ok(ExprKind::Arrow {
                            body,
                            params,
                            is_async: false,
                            is_generator: false,
                        })
                    } else {
                        return Ok(id.into());
                    }
                });
            }
            tok!("null") | tok!("true") | tok!("false") | Num(..) | Str(..) => {
                return spanned!(self, { self.parse_lit().map(ExprKind::Lit) })
            }
            tok!('[') => return self.parse_array_lit(),
            tok!('{') => return self.parse_object(),

            // Handle FunctionExpression and GeneratorExpression
            tok!("function") => return self.parse_fn_expr(false),
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
                return self.parse_paren_expr_or_arrow_fn(can_be_arrow);
            }

            _ => {}
        }

        unexpected!(self)
    }

    fn parse_array_lit(&mut self) -> PResult<Box<Expr>> {
        spanned!(self, {
            assert_and_bump!(self, '[');
            let mut first = true;
            let mut elems = vec![];

            while !is!(self, ']') {
                if first {
                    first = false;
                } else {
                    if eat!(self, ',') {
                        elems.push(None);
                    } else {
                        elems.push(self.parse_expr_or_spread().map(Some)?);
                    }
                }
            }

            expect!(self, ']');

            Ok(ExprKind::Array { elems })
        })
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
                // Parsed with 'NewExpression' production.
                let span = span_of_new + prev_span!(self);

                return Ok(box Expr {
                    span,
                    node: ExprKind::New { callee, args: None },
                });
            }

            // Parsed with 'MemberExpression' production.
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
    pub(super) fn parse_args(&mut self) -> PResult<Vec<ExprOrSpread>> {
        expect!(self, '(');

        let mut first = true;
        let mut expr_or_spreads = vec![];

        while !is!(self, ')') {
            if first {
                first = false;
            } else {
                expect!(self, ',');
                // Handle trailing comma.
                if is!(self, ')') {
                    break;
                }
            }

            expr_or_spreads.push(self.include_in_expr(true).parse_expr_or_spread()?);
        }

        expect!(self, ')');
        Ok(expr_or_spreads)
    }

    /// AssignmentExpression[+In, ?Yield, ?Await]
    /// ...AssignmentExpression[+In, ?Yield, ?Await]
    fn parse_expr_or_spread(&mut self) -> PResult<ExprOrSpread> {
        if eat!(self, "...") {
            self.parse_assignment_expr().map(ExprOrSpread::Spread)
        } else {
            self.parse_assignment_expr().map(ExprOrSpread::Expr)
        }
    }

    /// Parse paren expression or arrow function expression.
    ///
    fn parse_paren_expr_or_arrow_fn(&mut self, can_be_arrow: bool) -> PResult<Box<Expr>> {
        let start = prev_span!(self);

        // At this point, we can't know if it's parenthesized
        // expression or head of arrow function.
        // But as all patterns of javascript is subset of
        // expressions, we can parse both as expression.

        let expr_or_spreads = self.parse_args()?;
        let span_of_rparen = prev_span!(self);

        // we parse arrow function at here, to handle it efficiently.
        if is!(self, "=>") {
            if !can_be_arrow {
                unexpected!(self);
            }
            assert_and_bump!(self, "=>");

            let params = self.parse_exprs_as_params(expr_or_spreads)?;

            let body: BlockStmtOrExpr = self.parse_fn_body(false, false)?;
            return Ok(box Expr {
                span: start + body.span(),
                node: ExprKind::Arrow {
                    is_async: false,
                    is_generator: false,
                    params,
                    body,
                },
            });
        }

        // It was not head of arrow function.

        // ParenthesizedExpression cannot contain spread.
        if expr_or_spreads.len() == 0 {
            syntax_error!(self, SyntaxError::EmptyParenExpr)
        } else if expr_or_spreads.len() == 1 {
            let expr = match expr_or_spreads.into_iter().next().unwrap() {
                ExprOrSpread::Spread(_) => syntax_error!(self, SyntaxError::SpreadInParenExpr),
                ExprOrSpread::Expr(expr) => expr,
            };
            return Ok(box Expr {
                node: ExprKind::Paren(expr),
                span: start + span_of_rparen,
            });
        } else {
            assert!(expr_or_spreads.len() >= 2);

            let mut exprs = Vec::with_capacity(expr_or_spreads.len());
            for expr in expr_or_spreads {
                match expr {
                    ExprOrSpread::Spread(_) => syntax_error!(self, SyntaxError::SpreadInParenExpr),
                    ExprOrSpread::Expr(expr) => exprs.push(expr),
                }
            }
            assert!(exprs.len() >= 2);

            // span of sequence expression should not include '(' and ')'
            let seq_expr = box Expr {
                span: exprs.first().unwrap().span + exprs.last().unwrap().span,
                node: ExprKind::Seq { exprs },
            };
            return Ok(box Expr {
                span: start + span_of_rparen,
                node: ExprKind::Paren(seq_expr),
            });
        }
    }

    fn parse_async_fn_expr(&mut self) -> PResult<Box<Expr>> {
        //TODO:Span
        expect!(self, "async");
        self.parse_fn_expr(true)
    }

    fn parse_class_expr(&mut self) -> PResult<Box<Expr>> {
        unimplemented!("class expr")
    }
    fn parse_tpl_lit(&mut self) -> PResult<Box<Expr>> {
        unimplemented!("tpl lit")
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
            let prop = self.include_in_expr(false).parse_expr()?;
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
        return_if_arrow!(self, callee);

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

        // This is parsed using production 'NewExpression', which contains
        // 'MemberExpression'
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

    /// Parse function expression
    fn parse_fn_expr(&mut self, is_async: bool) -> PResult<Box<Expr>> {
        spanned!(self, {
            assert_and_bump!(self, "function");

            if is_async && is!(self, '*') {
                syntax_error!(self, SyntaxError::AsyncGenerator);
            }

            //TODO: Proper handling

            let is_generator = eat!(self, '*');

            let ident = self.parse_opt_binding_ident()?;

            let params = self.parse_formal_params()?;
            let body = self.parse_fn_body(is_async, is_generator)?;

            Ok(ExprKind::Function(FnExpr {
                ident,
                function: Function {
                    is_async,
                    is_generator,
                    body,
                    params,
                },
            }))
        })
    }

    pub(super) fn parse_fn_body<T>(&mut self, is_async: bool, is_generator: bool) -> PResult<T>
    where
        Self: FnBodyParser<T>,
    {
        self.with_ctx(Context {
            in_async: is_async,
            in_generator: is_generator,
            ..self.ctx
        }).parse_fn_body_inner()
    }
}

pub(super) trait FnBodyParser<Body> {
    fn parse_fn_body_inner(&mut self) -> PResult<Body>;
}

impl<I: Input> FnBodyParser<BlockStmtOrExpr> for Parser<I> {
    fn parse_fn_body_inner(&mut self) -> PResult<BlockStmtOrExpr> {
        if is!(self, '{') {
            self.parse_block().map(BlockStmtOrExpr::BlockStmt)
        } else {
            self.parse_assignment_expr().map(BlockStmtOrExpr::Expr)
        }
    }
}

impl<I: Input> FnBodyParser<BlockStmt> for Parser<I> {
    fn parse_fn_body_inner(&mut self) -> PResult<BlockStmt> {
        self.parse_block()
    }
}

/// simple leaf methods.
impl<I: Input> Parser<I> {
    fn parse_yield_expr(&mut self) -> PResult<Box<Expr>> {
        spanned!(self, {
            assert_and_bump!(self, "yield");
            assert!(self.ctx.in_generator);

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

    fn expr(s: &'static str) -> Box<Expr> {
        mk(s).parse_expr().expect("failed to parse an expression")
    }

    #[allow(non_upper_case_globals)]
    const span: Span = Span::DUMMY;

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

    #[test]
    fn arrow_fn_no_args() {
        assert_eq_ignore_span!(
            expr("() => 1"),
            box Expr {
                span,
                node: ExprKind::Arrow {
                    is_async: false,
                    is_generator: false,
                    params: vec![],
                    body: BlockStmtOrExpr::Expr(expr("1")),
                },
            }
        );
    }
    #[test]
    fn arrow_fn() {
        assert_eq_ignore_span!(
            expr("(a) => 1"),
            box Expr {
                span,
                node: ExprKind::Arrow {
                    is_async: false,
                    is_generator: false,
                    params: vec![
                        Pat {
                            span,
                            node: PatKind::Ident(Ident {
                                span,
                                sym: "a".into(),
                            }),
                        },
                    ],
                    body: BlockStmtOrExpr::Expr(expr("1")),
                },
            }
        );
    }
    #[test]
    fn arrow_fn_rest() {
        assert_eq_ignore_span!(
            expr("(...a) => 1"),
            box Expr {
                span,
                node: ExprKind::Arrow {
                    is_async: false,
                    is_generator: false,
                    params: vec![
                        Pat {
                            span,
                            node: PatKind::Rest(box Pat {
                                span,
                                node: PatKind::Ident(Ident {
                                    span,
                                    sym: "a".into(),
                                }),
                            }),
                        },
                    ],
                    body: BlockStmtOrExpr::Expr(expr("1")),
                },
            }
        );
    }
    #[test]
    fn arrow_fn_no_paren() {
        assert_eq_ignore_span!(
            expr("a => 1"),
            box Expr {
                span,
                node: ExprKind::Arrow {
                    is_async: false,
                    is_generator: false,
                    params: vec![
                        Pat {
                            span,
                            node: PatKind::Ident(Ident {
                                span,
                                sym: "a".into(),
                            }),
                        },
                    ],
                    body: BlockStmtOrExpr::Expr(expr("1")),
                },
            }
        );
    }
}
