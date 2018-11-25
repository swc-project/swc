use super::{pat::PatType, util::ExprExt, *};
use swc_common::Spanned;

mod ops;
#[cfg(test)]
mod tests;
mod verifier;

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    pub fn parse_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        let expr = self.parse_assignment_expr()?;
        let start = expr.span().lo();

        if is!(',') {
            let mut exprs = vec![expr];
            while eat!(',') {
                exprs.push(self.parse_assignment_expr()?);
            }
            let end = exprs.last().unwrap().span().hi();
            return Ok(box Expr::Seq(SeqExpr {
                span: span!(start),
                exprs,
            }));
        }

        Ok(expr)
    }

    /// Parse an assignment expression. This includes applications of
    /// operators like `+=`.
    pub(super) fn parse_assignment_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        if self.ctx().in_generator && is!("yield") {
            return self.parse_yield_expr();
        }

        // TODO: Check if cur!(true) correct.
        self.state.potential_arrow_start = match *cur!(true)? {
            Word(Ident(..)) | tok!('(') | tok!("yield") => Some(cur_pos!()),
            _ => None,
        };

        let start = cur_pos!();

        // Try to parse conditional expression.
        let cond = self.parse_cond_expr()?;

        return_if_arrow!(cond);

        match *cond {
            // if cond is conditional expression but not left-hand-side expression,
            // just return it.
            Expr::Cond(..) | Expr::Bin(..) | Expr::Unary(..) | Expr::Update(..) => return Ok(cond),
            _ => {}
        }

        match cur!(false) {
            Ok(&AssignOp(op)) => {
                let left = if op == Assign {
                    self.reparse_expr_as_pat(PatType::AssignPat, cond)
                        .map(Box::new)
                        .map(PatOrExpr::Pat)?
                } else {
                    //It is an early Reference Error if IsValidSimpleAssignmentTarget of
                    // LeftHandSideExpression is false.
                    if !cond.is_valid_simple_assignment_target(self.ctx().strict) {
                        syntax_error!(cond.span(), SyntaxError::NotSimpleAssign)
                    }

                    // TODO
                    PatOrExpr::Expr(cond)
                };

                bump!();
                let right = self.parse_assignment_expr()?;
                Ok(box Expr::Assign(AssignExpr {
                    span: span!(start),
                    op,
                    // TODO:
                    left,
                    right,
                }))
            }
            _ => Ok(cond),
        }
    }

    /// Spec: 'ConditionalExpression'
    fn parse_cond_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        let start = cur_pos!();

        let test = self.parse_bin_expr()?;
        return_if_arrow!(test);

        if eat!('?') {
            let cons = self.include_in_expr(true).parse_assignment_expr()?;
            expect!(':');
            let alt = self.parse_assignment_expr()?;

            Ok(box Expr::Cond(CondExpr {
                test,
                cons,
                alt,
                span: span!(start),
            }))
        } else {
            return Ok(test);
        }
    }

    /// Parse a primary expression or arrow function
    fn parse_primary_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        let _ = cur!(false);
        let start = cur_pos!();

        let can_be_arrow = self
            .state
            .potential_arrow_start
            .map(|s| s == cur_pos!())
            .unwrap_or(false);

        if eat!("this") {
            return Ok(box Expr::This(ThisExpr { span: span!(start) }));
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
            match *cur!(false)? {
                tok!("null") | tok!("true") | tok!("false") | Num(..) | Token::Str { .. } => true,
                _ => false,
            }
        } {
            return Ok(box Expr::Lit(self.parse_lit()?));
        }

        // Regexp
        if {
            match *cur!(false)? {
                Regex(..) => true,
                _ => false,
            }
        } {
            match bump!() {
                Regex(exp, flags) => {
                    return Ok(box Expr::Lit(Lit::Regex(Regex {
                        span: span!(start),
                        exp,
                        flags,
                    })))
                }
                _ => unreachable!(),
            }
        }

        if is!('`') {
            // parse template literal
            return Ok(box Expr::Tpl(self.parse_tpl_lit(None)?));
        }

        if is!('(') {
            return self.parse_paren_expr_or_arrow_fn(can_be_arrow);
        }

        if is!("let") || is!(IdentRef) {
            // TODO: Handle [Yield, Await]
            let id = self.parse_ident_ref()?;

            if can_be_arrow && id.sym == js_word!("async") && is!(BindingIdent) {
                // async a => body
                let arg = self.parse_binding_ident().map(Pat::from)?;
                let params = vec![arg];
                expect!("=>");
                let body = self.parse_fn_body(true, false)?;
                return Ok(box Expr::Arrow(ArrowExpr {
                    span: span!(start),
                    body,
                    params,
                    async_token: Some(id.span),
                    generator_token: None,
                }));
            } else if can_be_arrow && !self.input.had_line_break_before_cur() && eat!("=>") {
                let params = vec![id.into()];
                let body = self.parse_fn_body(false, false)?;

                return Ok(box Expr::Arrow(ArrowExpr {
                    span: span!(start),
                    body,
                    params,
                    async_token: None,
                    generator_token: None,
                }));
            } else {
                return Ok(box Expr::Ident(id));
            }
        }

        unexpected!()
    }

    fn parse_array_lit(&mut self) -> PResult<'a, (Box<Expr>)> {
        let start = cur_pos!();

        assert_and_bump!('[');
        let mut elems = vec![];

        while !eof!() && !is!(']') {
            if is!(',') {
                expect!(',');
                elems.push(None);
                continue;
            }
            elems.push(
                self.include_in_expr(true)
                    .parse_expr_or_spread()
                    .map(Some)?,
            );
            if is!(',') {
                expect!(',');
            }
        }

        expect!(']');

        let span = span!(start);
        Ok(box Expr::Array(ArrayLit { span, elems }))
    }

    fn parse_member_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        self.parse_member_expr_or_new_expr(false)
    }

    /// `is_new_expr`: true iff we are parsing production 'NewExpression'.
    fn parse_member_expr_or_new_expr(&mut self, is_new_expr: bool) -> PResult<'a, (Box<Expr>)> {
        let start = cur_pos!();
        if eat!("new") {
            let span_of_new = span!(start);
            if eat!('.') {
                let start_of_target = cur_pos!();
                if eat!("target") {
                    return Ok(box Expr::MetaProp(MetaPropExpr {
                        meta: Ident {
                            span: span_of_new,
                            sym: js_word!("new"),
                        },
                        prop: Ident {
                            span: span!(start_of_target),
                            sym: js_word!("target"),
                        },
                    }));
                }

                unexpected!()
            }

            // 'NewExpression' allows new call without paren.
            let callee = self.parse_member_expr_or_new_expr(is_new_expr)?;
            return_if_arrow!(callee);

            if !is_new_expr || is!('(') {
                // Parsed with 'MemberExpression' production.
                let args = self.parse_args().map(Some)?;

                let new_expr = ExprOrSuper::Expr(box Expr::New(NewExpr {
                    span: span!(start),
                    callee,
                    args,
                }));

                // We should parse subscripts for MemberExpression.
                // Because it's left recursive.
                return self.parse_subscripts(new_expr, true);
            }

            // Parsed with 'NewExpression' production.

            return Ok(box Expr::New(NewExpr {
                span: span!(start),
                callee,
                args: None,
            }));
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
    fn parse_new_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        self.parse_member_expr_or_new_expr(true)
    }

    /// Parse `Arguments[Yield, Await]`
    pub(super) fn parse_args(&mut self) -> PResult<'a, (Vec<ExprOrSpread>)> {
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
        let start = cur_pos!();

        if eat!("...") {
            let spread = Some(span!(start));
            self.include_in_expr(true)
                .parse_assignment_expr()
                .map(|expr| ExprOrSpread { spread, expr })
        } else {
            self.parse_assignment_expr()
                .map(|expr| ExprOrSpread { spread: None, expr })
        }
    }

    /// Parse paren expression or arrow function expression.
    fn parse_paren_expr_or_arrow_fn(&mut self, can_be_arrow: bool) -> PResult<'a, (Box<Expr>)> {
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
            return Ok(box Expr::Arrow(ArrowExpr {
                span: span!(start),
                async_token: None,
                generator_token: None,
                params,
                body,
            }));
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
                ExprOrSpread {
                    spread: Some(..),
                    ref expr,
                } => syntax_error!(expr.span(), SyntaxError::SpreadInParenExpr),
                ExprOrSpread { expr, .. } => expr,
            };
            return Ok(box Expr::Paren(ParenExpr {
                span: span!(start),
                expr,
            }));
        } else {
            assert!(expr_or_spreads.len() >= 2);

            let mut exprs = Vec::with_capacity(expr_or_spreads.len());
            for expr in expr_or_spreads {
                match expr {
                    ExprOrSpread {
                        spread: Some(..),
                        ref expr,
                    } => syntax_error!(expr.span(), SyntaxError::SpreadInParenExpr),
                    ExprOrSpread { expr, .. } => exprs.push(expr),
                }
            }
            assert!(exprs.len() >= 2);

            // span of sequence expression should not include '(', ')'
            let seq_expr = box Expr::Seq(SeqExpr {
                span: Span::new(
                    exprs.first().unwrap().span().lo(),
                    exprs.last().unwrap().span().hi(),
                    Default::default(),
                ),
                exprs,
            });
            return Ok(box Expr::Paren(ParenExpr {
                span: span!(start),
                expr: seq_expr,
            }));
        }
    }

    fn parse_tpl_lit(&mut self, tag: Option<(Box<Expr>)>) -> PResult<'a, TplLit> {
        let start = cur_pos!();

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

        let span = span!(start);
        Ok(TplLit {
            span,
            tag,
            exprs,
            quasis,
        })
    }

    fn parse_tpl_element(&mut self, is_tagged: bool) -> PResult<'a, TplElement> {
        let start = cur_pos!();

        let (raw, cooked) = match *cur!(true)? {
            Template { .. } => match bump!() {
                Template {
                    raw,
                    cooked,
                    has_escape,
                } => (
                    Str {
                        span: span!(start),
                        value: raw,
                        has_escape,
                    },
                    Some(Str {
                        span: span!(start),
                        value: cooked,
                        has_escape,
                    }),
                ),
                _ => unreachable!(),
            },
            _ => unexpected!(),
        };
        let tail = is!('`');
        Ok(TplElement {
            span: span!(start),
            raw,
            tail,

            cooked,
        })
    }

    fn parse_subscripts(
        &mut self,
        mut obj: ExprOrSuper,
        no_call: bool,
    ) -> PResult<'a, (Box<Expr>)> {
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
        let _ = cur!(false);

        let start = cur_pos!();
        // member expression
        // $obj.name
        if eat!('.') {
            let prop: Box<Expr> = box self.parse_ident_name().map(Expr::from)?;
            return Ok((
                box Expr::Member(MemberExpr {
                    span: span!(start),
                    obj,

                    prop,
                    computed: false,
                }),
                true,
            ));
        }

        // $obj[name()]
        if eat!('[') {
            let prop = self.include_in_expr(true).parse_expr()?;
            expect!(']');
            return Ok((
                box Expr::Member(MemberExpr {
                    span: span!(start),
                    obj,
                    prop,
                    computed: true,
                }),
                true,
            ));
        }

        if !no_call && is!('(') {
            let args = self.parse_args()?;
            return Ok((
                box Expr::Call(CallExpr {
                    span: span!(start),
                    callee: obj,
                    args,
                }),
                true,
            ));
        }

        match obj {
            ExprOrSuper::Expr(expr) => {
                // MemberExpression[?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
                if is!('`') {
                    let tpl = self.parse_tpl_lit(Some(expr))?;
                    return Ok((box Expr::Tpl(tpl), true));
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
    pub(super) fn parse_lhs_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        let start = cur_pos!();

        // `super()` can't be handled from parse_new_expr()
        if eat!("super") {
            let obj = ExprOrSuper::Super(span!(start));
            return self.parse_subscripts(obj, false);
        }

        let callee = self.parse_new_expr()?;
        return_if_arrow!(callee);

        match *callee {
            // If this is parsed using 'NewExpression' rule, just return it.
            // Because it's not left-recursive.
            Expr::New(NewExpr { args: None, .. }) => {
                assert_ne!(
                    cur!(false).ok(),
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
            let call_expr = box Expr::Call(CallExpr {
                span: span!(start),

                callee: ExprOrSuper::Expr(callee),
                args,
            });

            return self.parse_subscripts(ExprOrSuper::Expr(call_expr), false);
        }

        // This is parsed using production 'NewExpression', which contains
        // 'MemberExpression'
        Ok(callee)
    }

    pub(super) fn parse_expr_or_pat(&mut self) -> PResult<'a, (Box<Expr>)> {
        self.parse_expr()
    }
    pub(super) fn parse_args_or_pats(&mut self) -> PResult<'a, (Vec<ExprOrSpread>)> {
        self.parse_args()
    }
}

/// simple leaf methods.
#[parser]
impl<'a, I: Input> Parser<'a, I> {
    fn parse_yield_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        let start = cur_pos!();

        assert_and_bump!("yield");
        assert!(self.ctx().in_generator);

        // Spec says
        // YieldExpression cannot be used within the FormalParameters of a generator
        // function because any expressions that are part of FormalParameters are
        // evaluated before the resulting generator object is in a resumable state.
        if self.ctx().in_parameters {
            syntax_error!(self.input.prev_span(), SyntaxError::YieldParamInGen)
        }

        if is!(';') || (!is!('*') && !cur!(false).map(Token::starts_expr).unwrap_or(true)) {
            Ok(box Expr::Yield(YieldExpr {
                span: span!(start),
                arg: None,
                delegate: false,
            }))
        } else {
            let has_star = eat!('*');
            let arg = self.parse_assignment_expr()?;

            Ok(box Expr::Yield(YieldExpr {
                span: span!(start),
                arg: Some(arg),
                delegate: has_star,
            }))
        }
    }

    /// 12.2.5 Array Initializer
    fn parse_lit(&mut self) -> PResult<'a, Lit> {
        let start = cur_pos!();

        let v = match *cur!(true)? {
            Word(Null) => {
                bump!();
                let span = span!(start);
                Lit::Null(Null { span })
            }
            Word(True) | Word(False) => {
                let value = is!("true");
                bump!();
                let span = span!(start);

                Lit::Bool(Bool { span, value })
            }
            Token::Str { .. } => match bump!() {
                Token::Str { value, has_escape } => Lit::Str(Str {
                    span: span!(start),
                    value,
                    has_escape,
                }),
                _ => unreachable!(),
            },
            Num(..) => match bump!() {
                Num(value) => Lit::Num(Number {
                    span: span!(start),
                    value,
                }),
                _ => unreachable!(),
            },
            _ => unreachable!("parse_lit should not be called"),
        };
        Ok(v)
    }
}
