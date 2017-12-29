use super::*;

impl<I: Input> Parser<I> {
    /// PrimaryExpression[Yield, Await]
    fn parse_primary_expr(&mut self) -> PResult<ExprKind> {
        let t = match self.i.cur() {
            Some(t) => t,
            None => return Err(Error::Eof),
        };
        match *t {
            Word(Keyword(This)) => {
                self.i.bump();
                return Ok(ExprKind::This);
            }
            Word(Ident(..)) => {
                // TODO: Handle [Yield, Await]
                return self.parse_ident_ref().map(ExprKind::Ident);
            }
            Word(Null) | Word(True) | Word(False) | Num(..) | Str(..) => {
                return self.parse_lit().map(ExprKind::Lit)
            }
            LBracket => return self.parse_array_lit(),
            LBrace => return self.parse_obj_lit(),

            // Handle FunctionExpression and GeneratorExpression
            Word(Keyword(Function)) => return self.parse_fn_expr(),
            Word(Keyword(Class)) => return self.parse_class_expr(),

            Word(Keyword(Async)) => {
                // Handle async function expression
                if self.i.peek() == Some(&Word(Keyword(Function)))
                    && !self.i.has_linebreak_between_cur_and_peeked()
                {
                    return self.parse_async_fn_expr();
                }
            }

            Regex(_, _) => {
                return match self.i.bump() {
                    Regex(exp, flags) => Ok(ExprKind::Lit(Lit::Regex(Regex { exp, flags }))),
                    _ => unreachable!(),
                }
            }

            BackQuote => return self.parse_tpl_lit(),

            LParen => return self.parse_parenthesized_expr_and_arrow_params(),

            _ => {}
        }

        unimplemented!("error reporting")
    }

    fn parse_lit(&mut self) -> PResult<Lit> {
        unimplemented!()
    }
    fn parse_array_lit(&mut self) -> PResult<ExprKind> {
        unimplemented!()
    }
    fn parse_obj_lit(&mut self) -> PResult<ExprKind> {
        unimplemented!()
    }
    fn parse_async_fn_expr(&mut self) -> PResult<ExprKind> {
        unimplemented!("async function")
    }
    fn parse_fn_expr(&mut self) -> PResult<ExprKind> {
        unimplemented!("function")
    }
    fn parse_class_expr(&mut self) -> PResult<ExprKind> {
        unimplemented!()
    }
    fn parse_tpl_lit(&mut self) -> PResult<ExprKind> {
        unimplemented!()
    }

    fn parse_parenthesized_expr_and_arrow_params(&mut self) -> PResult<ExprKind> {
        unimplemented!()
    }

    fn parse_subscripts(&mut self, base: ExprOrSuper, no_call: bool) -> PResult<ExprOrSuper> {
        let mut next = (base, true);
        while let (base, true) = next {
            next = self.parse_subscript(base, no_call)?;
        }

        Ok(next.0)
    }

    fn parse_tpl(&mut self, is_tagged: bool) -> PResult<TplLit> {
        unimplemented!("parse_tpl")
    }

    /// returned bool is true if it should be called again.
    fn parse_subscript(
        &mut self,
        base: ExprOrSuper,
        no_call: bool,
    ) -> PResult<(ExprOrSuper, bool)> {
        // member expression
        // $base.name
        if self.i.eat(&Dot) {
            self.parse_ident_name()?;

            unimplemented!()
        }

        // $base[name()]
        if self.i.eat(&LBracket) {
            let expr = self.parse_expr(false)?;
            assert!(self.i.eat(&RBracket)); //TODO
            return Ok((
                ExprOrSuper::Expr(box Expr {
                    span: base.span() + self.i.last_span(),
                    node: ExprKind::Member {
                        obj: base,
                        computed: true,
                        prop: box expr,
                    },
                }),
                true,
            ));
        }

        if !no_call && self.i.eat(&LParen) {
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

        match base {
            ExprOrSuper::Expr(_) => {
                // MemberExpression[?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
                if self.i.is(&BackQuote) {
                    let tpl_lit = self.parse_tpl(true);
                    unimplemented!("TaggedTemplateExpression")
                }
            }
            _ => {}
        }

        Ok((base, false))
    }

    fn parse_expr(&mut self, no_in: bool) -> PResult<Expr> {
        let expr = self.parse_maybe_assignment_expr(no_in)?;
        let start = expr.span.start;

        if self.i.is(&Comma) {
            let mut exprs = vec![expr];
            while self.i.eat(&Comma) {
                exprs.push(self.parse_maybe_assignment_expr(no_in)?);
            }
            let end = exprs.last().unwrap().span.end;
            return Ok(Expr {
                span: Span { start, end },
                node: ExprKind::Seq { exprs },
            });
        }

        Ok(expr)
    }

    // Parse an assignment expression. This includes applications of
    // operators like `+=`.
    fn parse_maybe_assignment_expr(&mut self, no_in: bool) -> PResult<Expr> {
        if self.ctx.is_in_generator && self.i.is(&Word(Keyword(Yield))) {
            return self.parse_yield_expr();
        }

        unimplemented!("parse_maybe_assignment_expr")
    }

    fn parse_yield_expr(&mut self) -> PResult<Expr> {
        debug_assert!(self.i.is(&Word(Keyword(Yield))));
        debug_assert!(self.ctx.is_in_generator);

        unimplemented!()
    }

    // Parse a ternary conditional (`?:`) operator.
    fn parse_maybe_cond_expr(&mut self, no_in: bool) -> PResult<ExprKind> {
        // const startPos = this.state.start;
        // const startLoc = this.state.startLoc;
        // const potentialArrowAt = this.state.potentialArrowAt;
        // const expr = this.parseExprOps(noIn, refShorthandDefaultPos);

        // if (
        //   expr.type === "ArrowFunctionExpression" &&
        //   expr.start === potentialArrowAt
        // ) {
        //   return expr;
        // }
        // if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;

        // return this.parseConditional(
        //   expr,
        //   noIn,
        //   startPos,
        //   startLoc,
        //   refNeedsArrowPos,
        // );
        unimplemented!()
    }

    fn parse_expr_ops(&mut self, no_in: bool) -> PResult<ExprKind> {
        // const startPos = this.state.start;
        // const startLoc = this.state.startLoc;
        // const potentialArrowAt = this.state.potentialArrowAt;
        // const expr = this.parseMaybeUnary(refShorthandDefaultPos);

        // if (
        //   expr.type === "ArrowFunctionExpression" &&
        //   expr.start === potentialArrowAt
        // ) {
        //   return expr;
        // }
        // if (refShorthandDefaultPos && refShorthandDefaultPos.start) {
        //   return expr;
        // }

        // return this.parseExprOp(expr, startPos, startLoc, -1, noIn);
        unimplemented!()
    }

    // Parse unary operators, both prefix and postfix.
    fn parse_maybe_unary(&mut self) -> PResult<ExprKind> {
        // parse update expression
        if self.i.is(&PlusPlus) || self.i.is(&MinusMinus) {
            let op = if self.i.bump() == PlusPlus {
                UpdateOp::PlusPlus
            } else {
                UpdateOp::MinusMinus
            };

            let arg = box self.spanned(Self::parse_maybe_unary)?;

            return Ok(ExprKind::Update {
                prefix: true,
                op,
                arg,
            });
        }

        if self.i.is(&Word(Keyword(Delete))) || self.i.is(&Word(Keyword(Void)))
            || self.i.is(&Word(Keyword(TypeOf))) || self.i.is(&BinOp(Add))
            || self.i.is(&BinOp(Sub)) || self.i.is(&Tilde) || self.i.is(&Bang)
        {
            unimplemented!("parse unary op")
        }

        if self.ctx.is_in_async_fn && self.i.is(&Word(Keyword(Await))) {
            return self.parse_await_expr();
        }

        // UpdateExpression
        let expr = self.spanned(Self::parse_lhs_expr)?;

        //TODO: Handle ASI
        if self.i.is(&PlusPlus) || self.i.is(&MinusMinus) {
            let op = if self.i.bump() == PlusPlus {
                UpdateOp::PlusPlus
            } else {
                UpdateOp::MinusMinus
            };

            return Ok(ExprKind::Update {
                prefix: false,
                op,
                arg: box expr,
            });
        }
        Ok(expr.node)
    }

    fn parse_await_expr(&mut self) -> PResult<ExprKind> {
        unimplemented!()
    }

    fn parse_lhs_expr(&mut self) -> PResult<ExprKind> {
        unimplemented!()
    }

    fn parse_call_expr_args(
        &mut self,
        close_delim: &'static Token,
        is_async_arrow_possible: bool,
    ) -> PResult<ExprOrSpread> {
        unimplemented!()
    }
}
