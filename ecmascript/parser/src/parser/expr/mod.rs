use super::*;
use super::pat::PatType;
use super::util::ExprExt;

mod ops;
#[cfg(test)]
mod tests;
mod verifier;

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    pub fn parse_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let expr = self.parse_assignment_expr()?;
        let start = expr.span.lo();

        if is!(',') {
            let mut exprs = vec![expr];
            while eat!(',') {
                exprs.push(self.parse_assignment_expr()?);
            }
            let end = exprs.last().unwrap().span.hi();
            return Ok(box Expr {
                span: Span::new(start, end, Default::default()),
                node: ExprKind::Seq(SeqExpr { exprs }),
            });
        }

        Ok(expr)
    }

    /// Parse an assignment expression. This includes applications of
    /// operators like `+=`.
    ///
    pub(super) fn parse_assignment_expr(&mut self) -> PResult<'a, Box<Expr>> {
        if self.ctx().in_generator && is!("yield") {
            return self.parse_yield_expr();
        }

        self.state.potential_arrow_start = match *cur!()? {
            Word(Ident(..)) | tok!('(') | tok!("yield") => Some(cur_pos!()),
            _ => None,
        };

        let start = cur_pos!();

        // Try to parse conditional expression.
        let cond = self.parse_cond_expr()?;

        return_if_arrow!(cond);

        match cond.node {
            // if cond is conditional expression but not left-hand-side expression,
            // just return it.
            ExprKind::Cond(..) | ExprKind::Bin(..) | ExprKind::Unary(..) | ExprKind::Update(..) => {
                return Ok(cond)
            }
            _ => {}
        }

        match cur!() {
            Ok(&AssignOp(op)) => {
                let left = if op == Assign {
                    self.reparse_expr_as_pat(PatType::AssignPat, cond)
                        .map(PatOrExpr::Pat)?
                } else {
                    //It is an early Reference Error if IsValidSimpleAssignmentTarget of
                    // LeftHandSideExpression is false.
                    if !cond.is_valid_simple_assignment_target(self.ctx().strict) {
                        syntax_error!(cond.span, SyntaxError::NotSimpleAssign)
                    }

                    // TODO
                    PatOrExpr::Expr(cond)
                };

                bump!();
                let right = self.parse_assignment_expr()?;
                Ok(box Expr {
                    span: span!(start),
                    node: ExprKind::Assign(AssignExpr {
                        op,
                        // TODO:
                        left,
                        right,
                    }),
                })
            }
            _ => Ok(cond),
        }
    }

    /// Spec: 'ConditionalExpression'
    fn parse_cond_expr(&mut self) -> PResult<'a, Box<Expr>> {
        spanned!({
            let test = self.parse_bin_expr()?;
            return_if_arrow!(test);

            if eat!('?') {
                let cons = self.include_in_expr(true).parse_assignment_expr()?;
                expect!(':');
                let alt = self.parse_assignment_expr()?;

                Ok(ExprKind::Cond(CondExpr { test, cons, alt }))
            } else {
                return Ok(test);
            }
        })
    }

    /// Parse a primary expression or arrow function
    fn parse_primary_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let _ = cur!();

        let can_be_arrow = self.state
            .potential_arrow_start
            .map(|s| s == cur_pos!())
            .unwrap_or(false);

        if is!("this") {
            return self.spanned(|p| {
                assert_and_bump!("this");
                Ok(ExprKind::This)
            });
        }

        // Handle async function expression
        if { is!("async") } && { peeked_is!("function") } && {
            !self.input.has_linebreak_between_cur_and_peeked()
        } {
            return self.parse_async_fn_expr();
        }

        if is!('[') {
            return self.parse_array_lit();
        }
        if is!('{') {
            return self.parse_object();
        }

        // Handle FunctionExpression and GeneratorExpression
        if is!("function") {
            return self.parse_fn_expr();
        }

        if is!("class") {
            return self.parse_class_expr();
        }

        // Literals
        if {
            match *cur!()? {
                tok!("null") | tok!("true") | tok!("false") | Num(..) | Str { .. } => true,
                _ => false,
            }
        } {
            return self.spanned(|p| p.parse_lit().map(ExprKind::Lit));
        }

        // Regexp
        if {
            match *cur!()? {
                Regex(..) => true,
                _ => false,
            }
        } {
            return self.spanned(|p| match bump!() {
                Regex(exp, flags) => Ok(ExprKind::Lit(Lit::Regex(Regex { exp, flags }))),
                _ => unreachable!(),
            });
        }

        if is!('`') {
            return self.spanned(|p| {
                // parse template literal
                Ok(ExprKind::Tpl(p.parse_tpl_lit(None)?))
            });
        }

        if is!('(') {
            return self.parse_paren_expr_or_arrow_fn(can_be_arrow);
        }

        if is!("let") || is!(IdentRef) {
            return self.spanned(|p| {
                // TODO: Handle [Yield, Await]
                let id = p.parse_ident_ref()?;

                if can_be_arrow && id.sym == js_word!("async") && is!(BindingIdent) {
                    // async a => body
                    let arg = p.parse_binding_ident().map(Pat::from)?;
                    let params = vec![arg];
                    expect!("=>");
                    let body = p.parse_fn_body(true, false)?;
                    Ok(ExprKind::Arrow(ArrowExpr {
                        body,
                        params,
                        is_async: true,
                        is_generator: false,
                    }))
                } else if can_be_arrow && !p.input.had_line_break_before_cur() && eat!("=>") {
                    let params = vec![id.into()];
                    let body = p.parse_fn_body(false, false)?;
                    Ok(ExprKind::Arrow(ArrowExpr {
                        body,
                        params,
                        is_async: false,
                        is_generator: false,
                    }))
                } else {
                    return Ok(ExprKind::Ident(id.into()));
                }
            });
        }

        unexpected!()
    }

    fn parse_array_lit(&mut self) -> PResult<'a, Box<Expr>> {
        self.spanned(|p| {
            assert_and_bump!('[');
            let mut elems = vec![];
            let mut allow_elem = true;

            while !eof!() && !is!(']') {
                if is!(',') || !allow_elem {
                    expect!(',');
                    elems.push(None);
                    allow_elem = true;
                    continue;
                }
                allow_elem = false;

                elems.push(p.include_in_expr(true).parse_expr_or_spread().map(Some)?);
            }

            expect!(']');

            Ok(ExprKind::Array(ArrayLit { elems }))
        })
    }

    fn parse_member_expr(&mut self) -> PResult<'a, Box<Expr>> {
        self.parse_member_expr_or_new_expr(false)
    }

    /// `is_new_expr`: true iff we are parsing production 'NewExpression'.
    fn parse_member_expr_or_new_expr(&mut self, is_new_expr: bool) -> PResult<'a, Box<Expr>> {
        let start = cur_pos!();
        if eat!("new") {
            let span_of_new = span!(start);
            if eat!('.') {
                let start_of_target = cur_pos!();
                if eat!("target") {
                    return Ok(box Expr {
                        span: span!(start),
                        node: ExprKind::MetaProp(MetaPropExpr {
                            meta: Ident {
                                span: span_of_new,
                                sym: js_word!("new"),
                            },
                            prop: Ident {
                                span: span!(start_of_target),
                                sym: js_word!("target"),
                            },
                        }),
                    });
                }

                unexpected!()
            }

            // 'NewExpression' allows new call without paren.
            let callee = self.parse_member_expr_or_new_expr(is_new_expr)?;
            return_if_arrow!(callee);

            if !is_new_expr || is!('(') {
                // Parsed with 'MemberExpression' production.
                let args = self.parse_args().map(Some)?;

                let new_expr = ExprOrSuper::Expr(box Expr {
                    span: span!(start),
                    node: ExprKind::New(NewExpr { callee, args }),
                });

                // We should parse subscripts for MemberExpression.
                // Because it's left recursive.
                return self.parse_subscripts(new_expr, true);
            }

            // Parsed with 'NewExpression' production.

            return Ok(box Expr {
                span: span!(start),
                node: ExprKind::New(NewExpr { callee, args: None }),
            });
        }

        if eat!("super") {
            let base = ExprOrSuper::Super(span!(start));
            return self.parse_subscripts(base, true);
        }
        let obj = self.parse_primary_expr()?;
        return_if_arrow!(obj);

        self.parse_subscripts(ExprOrSuper::Expr(obj), true)
    }

    /// Parse `NewExpresion`.
    /// This includes `MemberExpression`.
    fn parse_new_expr(&mut self) -> PResult<'a, Box<Expr>> {
        self.parse_member_expr_or_new_expr(true)
    }

    /// Parse `Arguments[Yield, Await]`
    pub(super) fn parse_args(&mut self) -> PResult<'a, Vec<ExprOrSpread>> {
        expect!('(');

        let mut first = true;
        let mut expr_or_spreads = vec![];

        while !eof!() && !is!(')') {
            if first {
                first = false;
            } else {
                expect!(',');
                // Handle trailing comma.
                if is!(')') {
                    break;
                }
            }

            expr_or_spreads.push(self.include_in_expr(true).parse_expr_or_spread()?);
        }

        expect!(')');
        Ok(expr_or_spreads)
    }

    /// AssignmentExpression[+In, ?Yield, ?Await]
    /// ...AssignmentExpression[+In, ?Yield, ?Await]
    pub(super) fn parse_expr_or_spread(&mut self) -> PResult<'a, ExprOrSpread> {
        if eat!("...") {
            self.include_in_expr(true)
                .parse_assignment_expr()
                .map(ExprOrSpread::Spread)
        } else {
            self.parse_assignment_expr().map(ExprOrSpread::Expr)
        }
    }

    /// Parse paren expression or arrow function expression.
    ///
    fn parse_paren_expr_or_arrow_fn(&mut self, can_be_arrow: bool) -> PResult<'a, Box<Expr>> {
        let start = cur_pos!();

        // At this point, we can't know if it's parenthesized
        // expression or head of arrow function.
        // But as all patterns of javascript is subset of
        // expressions, we can parse both as expression.

        let expr_or_spreads = self.include_in_expr(true).parse_args_or_pats()?;

        // we parse arrow function at here, to handle it efficiently.
        if is!("=>") {
            if self.input.had_line_break_before_cur() {
                syntax_error!(span!(start), SyntaxError::LineBreakBeforeArrow);
            }
            if !can_be_arrow {
                unexpected!();
            }
            assert_and_bump!("=>");

            let params = self.parse_exprs_as_params(expr_or_spreads)?;

            let body: BlockStmtOrExpr = self.parse_fn_body(false, false)?;
            return Ok(box Expr {
                span: span!(start),
                node: ExprKind::Arrow(ArrowExpr {
                    is_async: false,
                    is_generator: false,
                    params,
                    body,
                }),
            });
        }

        // It was not head of arrow function.

        if expr_or_spreads.len() == 0 {
            syntax_error!(
                Span::new(start, last_pos!(), Default::default()),
                SyntaxError::EmptyParenExpr
            );
        }

        // TODO: Verify that invalid expression like {a = 1} does not exists.

        // ParenthesizedExpression cannot contain spread.
        if expr_or_spreads.len() == 1 {
            let expr = match expr_or_spreads.into_iter().next().unwrap() {
                ExprOrSpread::Spread(expr) => {
                    syntax_error!(expr.span, SyntaxError::SpreadInParenExpr)
                }
                ExprOrSpread::Expr(expr) => expr,
            };
            return Ok(box Expr {
                node: ExprKind::Paren(expr),
                span: span!(start),
            });
        } else {
            assert!(expr_or_spreads.len() >= 2);

            let mut exprs = Vec::with_capacity(expr_or_spreads.len());
            for expr in expr_or_spreads {
                match expr {
                    ExprOrSpread::Spread(expr) => {
                        syntax_error!(expr.span, SyntaxError::SpreadInParenExpr)
                    }
                    ExprOrSpread::Expr(expr) => exprs.push(expr),
                }
            }
            assert!(exprs.len() >= 2);

            // span of sequence expression should not include '(', ')'
            let seq_expr = box Expr {
                span: Span::new(
                    exprs.first().unwrap().span.lo(),
                    exprs.last().unwrap().span.hi(),
                    Default::default(),
                ),
                node: ExprKind::Seq(SeqExpr { exprs }),
            };
            return Ok(box Expr {
                span: span!(start),
                node: ExprKind::Paren(seq_expr),
            });
        }
    }

    fn parse_tpl_lit(&mut self, tag: Option<Box<Expr>>) -> PResult<'a, TplLit> {
        assert_and_bump!('`');

        let is_tagged = tag.is_some();

        let mut exprs = vec![];

        let cur_elem = self.parse_tpl_element(is_tagged)?;
        let mut is_tail = cur_elem.tail;
        let mut quasis = vec![cur_elem];

        while !is_tail {
            expect!("${");
            exprs.push(self.include_in_expr(true).parse_expr()?);
            expect!('}');
            let elem = self.parse_tpl_element(is_tagged)?;
            is_tail = elem.tail;
            quasis.push(elem);
        }

        expect!('`');

        Ok(TplLit { tag, exprs, quasis })
    }

    fn parse_tpl_element(&mut self, is_tagged: bool) -> PResult<'a, TplElement> {
        let raw = match *cur!()? {
            Template(_) => match bump!() {
                Template(s) => s,
                _ => unreachable!(),
            },
            _ => unexpected!(),
        };
        let tail = is!('`');
        Ok(TplElement {
            raw,
            tail,

            // FIXME
            cooked: false,
        })
    }

    fn parse_subscripts(&mut self, mut obj: ExprOrSuper, no_call: bool) -> PResult<'a, Box<Expr>> {
        loop {
            obj = match self.parse_subscript(obj, no_call)? {
                (expr, false) => return Ok(expr),
                (expr, true) => ExprOrSuper::Expr(expr),
            }
        }
    }

    /// returned bool is true if this method should be called again.
    fn parse_subscript(
        &mut self,
        obj: ExprOrSuper,
        no_call: bool,
    ) -> PResult<'a, (Box<Expr>, bool)> {
        let _ = cur!();

        let start = cur_pos!();
        // member expression
        // $obj.name
        if eat!('.') {
            let prop: Box<Expr> = self.parse_ident_name().map(From::from)?;
            return Ok((
                box Expr {
                    span: span!(start),
                    node: ExprKind::Member(MemberExpr {
                        obj,
                        prop,
                        computed: false,
                    }),
                },
                true,
            ));
        }

        // $obj[name()]
        if eat!('[') {
            let prop = self.include_in_expr(true).parse_expr()?;
            expect!(']');
            return Ok((
                box Expr {
                    span: span!(start),
                    node: ExprKind::Member(MemberExpr {
                        obj,
                        prop,
                        computed: true,
                    }),
                },
                true,
            ));
        }

        if !no_call && is!('(') {
            let args = self.parse_args()?;
            return Ok((
                box Expr {
                    span: span!(start),
                    node: ExprKind::Call(CallExpr { callee: obj, args }),
                },
                true,
            ));
        }

        match obj {
            ExprOrSuper::Expr(expr) => {
                // MemberExpression[?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
                if is!('`') {
                    let tpl = self.parse_tpl_lit(Some(expr))?;
                    return Ok((
                        box Expr {
                            span: span!(start),
                            node: ExprKind::Tpl(tpl),
                        },
                        true,
                    ));
                }

                Ok((expr, false))
            }
            ExprOrSuper::Super(..) => {
                if no_call {
                    unexpected!()
                }
                unexpected!()
            }
        }
    }
    /// Parse call, dot, and `[]`-subscript expressions.
    ///
    ///
    pub(super) fn parse_lhs_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let start = cur_pos!();

        // `super()` can't be handled from parse_new_expr()
        if eat!("super") {
            let obj = ExprOrSuper::Super(span!(start));
            return self.parse_subscripts(obj, false);
        }

        let callee = self.parse_new_expr()?;
        return_if_arrow!(callee);

        match callee.node {
            // If this is parsed using 'NewExpression' rule, just return it.
            // Because it's not left-recursive.
            ExprKind::New(NewExpr { args: None, .. }) => {
                assert_ne!(
                    cur!().ok(),
                    Some(&LParen),
                    "parse_new_expr() should eat paren if it exists"
                );
                return Ok(callee);
            }
            _ => {}
        }
        // 'CallExpr' rule contains 'MemberExpr (...)',
        // and 'MemberExpr' rule contains 'new MemberExpr (...)'

        if is!('(') {
            // This is parsed using production MemberExpression,
            // which is left-recursive.
            let args = self.parse_args()?;
            let call_expr = box Expr {
                span: span!(start),
                node: ExprKind::Call(CallExpr {
                    callee: ExprOrSuper::Expr(callee),
                    args,
                }),
            };

            return self.parse_subscripts(ExprOrSuper::Expr(call_expr), false);
        }

        // This is parsed using production 'NewExpression', which contains
        // 'MemberExpression'
        Ok(callee)
    }

    pub(super) fn parse_expr_or_pat(&mut self) -> PResult<'a, Box<Expr>> {
        self.parse_expr()
    }
    pub(super) fn parse_args_or_pats(&mut self) -> PResult<'a, Vec<ExprOrSpread>> {
        self.parse_args()
    }
}

/// simple leaf methods.
#[parser]
impl<'a, I: Input> Parser<'a, I> {
    fn parse_yield_expr(&mut self) -> PResult<'a, Box<Expr>> {
        self.spanned(|p| {
            assert_and_bump!("yield");
            assert!(p.ctx().in_generator);

            // Spec says
            // YieldExpression cannot be used within the FormalParameters of a generator
            // function because any expressions that are part of FormalParameters are
            // evaluated before the resulting generator object is in a resumable state.
            if p.ctx().in_parameters {
                syntax_error!(p.input.prev_span(), SyntaxError::YieldParamInGen)
            }

            if is!(';') || (!is!('*') && !cur!().map(Token::starts_expr).unwrap_or(true)) {
                Ok(ExprKind::Yield(YieldExpr {
                    arg: None,
                    delegate: false,
                }))
            } else {
                let has_star = eat!('*');
                let arg = p.parse_assignment_expr()?;

                Ok(ExprKind::Yield(YieldExpr {
                    arg: Some(arg),
                    delegate: has_star,
                }))
            }
        })
    }

    /// 12.2.5 Array Initializer
    fn parse_lit(&mut self) -> PResult<'a, Lit> {
        let v = match *cur!()? {
            Word(Null) => {
                bump!();
                Lit::Null
            }
            Word(True) | Word(False) => {
                let v = is!("true");
                bump!();
                Lit::Bool(v)
            }
            Str { .. } => match bump!() {
                Str { value, has_escape } => Lit::Str { value, has_escape },
                _ => unreachable!(),
            },
            Num(..) => match bump!() {
                Num(num) => Lit::Num(num),
                _ => unreachable!(),
            },
            _ => unreachable!("parse_lit should not be called"),
        };
        Ok(v)
    }
}
