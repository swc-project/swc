use super::{pat::PatType, util::ExprExt, *};
use crate::{lexer::TokenContext, token::AssignOpToken};
use either::Either;
use swc_atoms::js_word;
use swc_common::{ast_node, Spanned};

mod ops;
#[cfg(test)]
mod tests;
mod verifier;

#[parser]
impl<'a, I: Tokens> Parser<'a, I> {
    pub fn parse_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let expr = self.parse_assignment_expr()?;
        let start = expr.span().lo();

        if is!(',') {
            let mut exprs = vec![expr];
            while eat!(',') {
                exprs.push(self.parse_assignment_expr()?);
            }
            let end = exprs.last().unwrap().span().hi();
            return Ok(Box::new(Expr::Seq(SeqExpr {
                span: span!(start),
                exprs,
            })));
        }

        Ok(expr)
    }

    ///`parseMaybeAssign` (overrided)
    pub(super) fn parse_assignment_expr(&mut self) -> PResult<'a, Box<Expr>> {
        if self.input.syntax().typescript() {
            // Note: When the JSX plugin is on, type assertions (`<T> x`) aren't valid
            // syntax.

            if is!(JSXTagStart) {
                let cur_context = self.input.token_context().current();
                debug_assert_eq!(cur_context, Some(TokenContext::JSXOpeningTag));
                // Only time j_oTag is pushed is right after j_expr.
                debug_assert_eq!(
                    self.input.token_context().0[self.input.token_context().len() - 2],
                    TokenContext::JSXExpr
                );

                let res = self.try_parse_ts(|p| p.parse_assignment_expr_base().map(Some));
                if let Some(res) = res {
                    return Ok(res);
                } else {
                    debug_assert_eq!(
                        self.input.token_context().current(),
                        Some(TokenContext::JSXOpeningTag)
                    );
                    self.input.token_context_mut().pop();
                    debug_assert_eq!(
                        self.input.token_context().current(),
                        Some(TokenContext::JSXExpr)
                    );
                    self.input.token_context_mut().pop();
                }
            }
        }

        if self.input.syntax().typescript()
            && (is_one_of!('<', JSXTagStart))
            && peeked_is!(IdentName)
        {
            let res = self.try_parse_ts(|p| {
                let type_parameters = p.parse_ts_type_params()?;
                let mut arrow = p.parse_assignment_expr_base()?;
                match *arrow {
                    Expr::Arrow(ArrowExpr {
                        ref mut type_params,
                        ..
                    }) => {
                        *type_params = Some(type_parameters);
                    }
                    _ => unexpected!(),
                }
                Ok(Some(arrow))
            });
            if let Some(res) = res {
                return Ok(res);
            }
        }

        self.parse_assignment_expr_base()
    }

    /// Parse an assignment expression. This includes applications of
    /// operators like `+=`.
    ///
    /// `parseMaybeAssign`
    fn parse_assignment_expr_base(&mut self) -> PResult<'a, Box<Expr>> {
        if self.ctx().in_generator && is!("yield") {
            return self.parse_yield_expr();
        }

        self.state.potential_arrow_start = match *cur!(true)? {
            Word(Word::Ident(..)) | tok!('(') | tok!("yield") => Some(cur_pos!()),
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

        self.finish_assignment_expr(start, cond)
    }

    fn finish_assignment_expr(
        &mut self,
        start: BytePos,
        cond: Box<Expr>,
    ) -> PResult<'a, Box<Expr>> {
        match cur!(false) {
            Ok(&Token::AssignOp(op)) => {
                let left = if op == AssignOpToken::Assign {
                    self.reparse_expr_as_pat(PatType::AssignPat, cond)
                        .map(Box::new)
                        .map(PatOrExpr::Pat)?
                } else {
                    //It is an early Reference Error if IsValidSimpleAssignmentTarget of
                    // LeftHandSideExpression is false.
                    if !cond.is_valid_simple_assignment_target(self.ctx().strict) {
                        self.emit_err(cond.span(), SyntaxError::NotSimpleAssign)
                    }

                    // TODO
                    PatOrExpr::Expr(cond)
                };

                bump!();
                let right = self.parse_assignment_expr()?;
                Ok(Box::new(Expr::Assign(AssignExpr {
                    span: span!(start),
                    op,
                    // TODO:
                    left,
                    right,
                })))
            }
            _ => Ok(cond),
        }
    }

    /// Spec: 'ConditionalExpression'
    fn parse_cond_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let start = cur_pos!();

        let test = self.parse_bin_expr()?;
        return_if_arrow!(test);

        if eat!('?') {
            let ctx = Context {
                in_cond_expr: true,
                include_in_expr: true,
                ..self.ctx()
            };
            let cons = self.with_ctx(ctx).parse_assignment_expr()?;
            expect!(':');
            let ctx = Context {
                in_cond_expr: true,
                ..self.ctx()
            };
            let alt = self.with_ctx(ctx).parse_assignment_expr()?;
            let span = Span::new(start, alt.span().hi(), Default::default());
            Ok(Box::new(Expr::Cond(CondExpr {
                span,
                test,
                cons,
                alt,
            })))
        } else {
            Ok(test)
        }
    }

    /// Parse a primary expression or arrow function
    #[allow(clippy::cognitive_complexity)]
    pub(super) fn parse_primary_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let _ = cur!(false);
        let start = cur_pos!();

        let can_be_arrow = self
            .state
            .potential_arrow_start
            .map(|s| s == start)
            .unwrap_or(false);

        if eat!("this") {
            return Ok(Box::new(Expr::This(ThisExpr { span: span!(start) })));
        }

        if is!("import") {
            let import = self.parse_ident_name()?;
            if self.input.syntax().import_meta() && is!('.') {
                return self
                    .parse_import_meta_prop(import)
                    .map(Expr::MetaProp)
                    .map(Box::new);
            }

            return self.parse_dynamic_import(start, import);
        }

        if is!("async") {
            if peeked_is!("function") && !self.input.has_linebreak_between_cur_and_peeked() {
                // handle `async function` expression
                return self.parse_async_fn_expr();
            }

            if can_be_arrow && self.input.syntax().typescript() && peeked_is!('<') {
                // try parsing `async<T>() => {}`
                if let Some(res) = self.try_parse_ts(|p| {
                    let start = cur_pos!();
                    assert_and_bump!("async");
                    p.try_parse_ts_generic_async_arrow_fn(start)
                }) {
                    return Ok(Box::new(Expr::Arrow(res)));
                }
            }

            if can_be_arrow && peeked_is!('(') {
                expect!("async");
                let async_span = self.input.prev_span();
                return self.parse_paren_expr_or_arrow_fn(can_be_arrow, Some(async_span));
            }
        }

        if is!('[') {
            return self.parse_array_lit();
        }
        if is!('{') {
            return self.parse_object();
        }

        let decorators = self.parse_decorators(false)?;

        // Handle FunctionExpression and GeneratorExpression
        if is!("function") {
            return self.parse_fn_expr();
        } else if is!("class") {
            return self.parse_class_expr(start, decorators);
        }

        // Literals
        if match cur!(false) {
            Ok(&tok!("null"))
            | Ok(&tok!("true"))
            | Ok(&tok!("false"))
            | Ok(&Token::Num(..))
            | Ok(&Token::BigInt(..))
            | Ok(Token::Str { .. }) => true,
            _ => false,
        } {
            return Ok(Box::new(Expr::Lit(self.parse_lit()?)));
        }

        // Regexp
        if match cur!(false) {
            Ok(&Token::Regex(..)) => true,
            _ => false,
        } {
            match bump!() {
                Token::Regex(exp, flags) => {
                    return Ok(Box::new(Expr::Lit(Lit::Regex(Regex {
                        span: span!(start),
                        exp,
                        flags,
                    }))));
                }
                _ => unreachable!(),
            }
        }

        if is!('`') {
            // parse template literal
            return Ok(Box::new(Expr::Tpl(self.parse_tpl()?)));
        }

        if is!('(') {
            return self.parse_paren_expr_or_arrow_fn(can_be_arrow, None);
        }

        if is!("let") || (self.input.syntax().typescript() && is!(IdentName)) || is!(IdentRef) {
            // TODO: Handle [Yield, Await]
            let id = self.parse_ident_name()?;
            if self.ctx().strict {
                match id.sym {
                    //                    js_word!("eval") | js_word!("arguments") => {
                    //                        self.emit_err(id.span,
                    // SyntaxError::EvalAndArgumentsInStrict)
                    // }
                    js_word!("yield")
                    | js_word!("static")
                    | js_word!("implements")
                    | js_word!("let")
                    | js_word!("package")
                    | js_word!("private")
                    | js_word!("protected")
                    | js_word!("public") => {
                        self.emit_err(self.input.prev_span(), SyntaxError::InvalidIdentInStrict);
                    }
                    _ => {}
                }
            }

            if can_be_arrow && id.sym == js_word!("async") && is!(BindingIdent) {
                // async a => body
                let arg = self.parse_binding_ident().map(Pat::from)?;
                let params = vec![arg];
                expect!("=>");
                let body = self.parse_fn_body(true, false)?;
                return Ok(Box::new(Expr::Arrow(ArrowExpr {
                    span: span!(start),
                    body,
                    params,
                    is_async: true,
                    is_generator: false,
                    return_type: None,
                    type_params: None,
                })));
            } else if can_be_arrow && !self.input.had_line_break_before_cur() && eat!("=>") {
                let params = vec![id.into()];
                let body = self.parse_fn_body(false, false)?;

                return Ok(Box::new(Expr::Arrow(ArrowExpr {
                    span: span!(start),
                    body,
                    params,
                    is_async: false,
                    is_generator: false,
                    // TODO
                    return_type: None,
                    // TODO
                    type_params: None,
                })));
            } else {
                return Ok(Box::new(Expr::Ident(id)));
            }
        }

        unexpected!()
    }

    fn parse_array_lit(&mut self) -> PResult<'a, Box<Expr>> {
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
        Ok(Box::new(Expr::Array(ArrayLit { span, elems })))
    }

    fn parse_member_expr(&mut self) -> PResult<'a, Box<Expr>> {
        self.parse_member_expr_or_new_expr(false)
    }

    /// `parseImportMetaProperty`
    pub(super) fn parse_import_meta_prop(&mut self, import: Ident) -> PResult<'a, MetaPropExpr> {
        let start = cur_pos!();

        let meta = import;

        expect!('.');

        let prop = if is!("meta") {
            self.parse_ident_name()?
        } else {
            unexpected!();
        };

        Ok(MetaPropExpr { meta, prop })
    }

    /// `is_new_expr`: true iff we are parsing production 'NewExpression'.
    fn parse_member_expr_or_new_expr(&mut self, is_new_expr: bool) -> PResult<'a, Box<Expr>> {
        let start = cur_pos!();
        if eat!("new") {
            let span_of_new = span!(start);
            if eat!('.') {
                let start_of_target = cur_pos!();
                if eat!("target") {
                    return Ok(Box::new(Expr::MetaProp(MetaPropExpr {
                        meta: Ident::new(js_word!("new"), span_of_new),
                        prop: Ident::new(js_word!("target"), span!(start_of_target)),
                    })));
                }

                unexpected!()
            }

            // 'NewExpression' allows new call without paren.
            let callee = self.parse_member_expr_or_new_expr(is_new_expr)?;
            return_if_arrow!(callee);

            let type_args = if self.input.syntax().typescript() && is!('<') {
                self.try_parse_ts(|p| {
                    let args = p.parse_ts_type_args()?;
                    if !is!('(') {
                        unexpected!()
                    }
                    Ok(Some(args))
                })
            } else {
                None
            };

            if !is_new_expr || is!('(') {
                // Parsed with 'MemberExpression' production.
                let args = self.parse_args(false).map(Some)?;

                let new_expr = ExprOrSuper::Expr(Box::new(Expr::New(NewExpr {
                    span: span!(start),
                    callee,
                    args,
                    type_args,
                })));

                // We should parse subscripts for MemberExpression.
                // Because it's left recursive.
                return self.parse_subscripts(new_expr, true);
            }

            // Parsed with 'NewExpression' production.

            return Ok(Box::new(Expr::New(NewExpr {
                span: span!(start),
                callee,
                args: None,
                type_args,
            })));
        }

        if eat!("super") {
            let base = ExprOrSuper::Super(Super { span: span!(start) });
            return self.parse_subscripts(base, true);
        }
        let obj = self.parse_primary_expr()?;
        return_if_arrow!(obj);

        self.parse_subscripts(ExprOrSuper::Expr(obj), true)
    }

    /// Parse `NewExpresion`.
    /// This includes `MemberExpression`.
    pub(super) fn parse_new_expr(&mut self) -> PResult<'a, Box<Expr>> {
        self.parse_member_expr_or_new_expr(true)
    }

    /// Parse `Arguments[Yield, Await]`
    pub(super) fn parse_args(&mut self, is_dynamic_import: bool) -> PResult<'a, Vec<ExprOrSpread>> {
        let start = cur_pos!();
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
                    if is_dynamic_import {
                        syntax_error!(span!(start), SyntaxError::TrailingCommaInsideImport)
                    }

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
    fn parse_paren_expr_or_arrow_fn(
        &mut self,
        can_be_arrow: bool,
        async_span: Option<Span>,
    ) -> PResult<'a, Box<Expr>> {
        let start = cur_pos!();

        // At this point, we can't know if it's parenthesized
        // expression or head of arrow function.
        // But as all patterns of javascript is subset of
        // expressions, we can parse both as expression.

        let paren_items = self.include_in_expr(true).parse_args_or_pats()?;
        let has_pattern = paren_items.iter().any(|item| match item {
            PatOrExprOrSpread::Pat(..) => true,
            _ => false,
        });

        // This is slow path. We handle arrow in conditional expression.
        if self.syntax().typescript() && self.ctx().in_cond_expr && is!(':') {
            // TODO: Remove clone
            let items_ref = &paren_items;
            if let Some(expr) = self.try_parse_ts(|p| {
                let start = cur_pos!();
                let return_type = p.parse_ts_type_or_type_predicate_ann(&tok!(':'))?;

                expect!("=>");

                let params = p
                    .parse_paren_items_as_params(items_ref.clone())?
                    .into_iter()
                    .collect();

                let body: BlockStmtOrExpr = p.parse_fn_body(async_span.is_some(), false)?;

                Ok(Some(Box::new(Expr::Arrow(ArrowExpr {
                    span: span!(start),
                    is_async: async_span.is_some(),
                    is_generator: false,
                    params,
                    body,
                    return_type: Some(return_type),
                    type_params: None,
                }))))
            }) {
                return Ok(expr);
            }
        }

        let return_type =
            if !self.ctx().in_cond_expr && self.input.syntax().typescript() && is!(':') {
                let start = cur_pos!();
                Some(self.parse_ts_type_or_type_predicate_ann(&tok!(':'))?)
            } else {
                None
            };

        // we parse arrow function at here, to handle it efficiently.
        if has_pattern || return_type.is_some() || is!("=>") {
            if self.input.had_line_break_before_cur() {
                syntax_error!(span!(start), SyntaxError::LineBreakBeforeArrow);
            }
            if !can_be_arrow {
                unexpected!()
            }
            expect!("=>");

            let params = self
                .parse_paren_items_as_params(paren_items)?
                .into_iter()
                .collect();

            let body: BlockStmtOrExpr = self.parse_fn_body(async_span.is_some(), false)?;
            return Ok(Box::new(Expr::Arrow(ArrowExpr {
                span: span!(start),
                is_async: async_span.is_some(),
                is_generator: false,
                params,
                body,
                return_type,
                type_params: None,
            })));
        }

        let expr_or_spreads = paren_items
            .into_iter()
            .map(|item| -> PResult<'a, _> {
                match item {
                    PatOrExprOrSpread::ExprOrSpread(e) => Ok(e),
                    _ => syntax_error!(item.span(), SyntaxError::InvalidExpr),
                }
            })
            .collect::<Result<Vec<_>, _>>()?;
        if let Some(async_span) = async_span {
            // It's a call expression
            return Ok(Box::new(Expr::Call(CallExpr {
                span: span!(async_span.lo()),
                callee: ExprOrSuper::Expr(Box::new(Expr::Ident(Ident::new(
                    "async".into(),
                    async_span,
                )))),
                args: expr_or_spreads,
                type_args: None,
            })));
        }

        // It was not head of arrow function.

        if expr_or_spreads.is_empty() {
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
            Ok(Box::new(Expr::Paren(ParenExpr {
                span: span!(start),
                expr,
            })))
        } else {
            debug_assert!(expr_or_spreads.len() >= 2);

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
            debug_assert!(exprs.len() >= 2);

            // span of sequence expression should not include '(', ')'
            let seq_expr = Box::new(Expr::Seq(SeqExpr {
                span: Span::new(
                    exprs.first().unwrap().span().lo(),
                    exprs.last().unwrap().span().hi(),
                    Default::default(),
                ),
                exprs,
            }));
            Ok(Box::new(Expr::Paren(ParenExpr {
                span: span!(start),
                expr: seq_expr,
            })))
        }
    }

    #[allow(clippy::vec_box)]
    fn parse_tpl_elements(
        &mut self,
        is_tagged: bool,
    ) -> PResult<'a, (Vec<Box<Expr>>, Vec<TplElement>)> {
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

        Ok((exprs, quasis))
    }

    fn parse_tagged_tpl(
        &mut self,
        tag: Box<Expr>,
        type_params: Option<TsTypeParamInstantiation>,
    ) -> PResult<'a, TaggedTpl> {
        let start = cur_pos!();

        assert_and_bump!('`');

        let (exprs, quasis) = self.parse_tpl_elements(false)?;

        expect!('`');

        let span = span!(start);
        Ok(TaggedTpl {
            span,
            tag,
            exprs,
            type_params,
            quasis,
        })
    }

    fn parse_tpl(&mut self) -> PResult<'a, Tpl> {
        let start = cur_pos!();

        assert_and_bump!('`');

        let (exprs, quasis) = self.parse_tpl_elements(false)?;

        expect!('`');

        let span = span!(start);
        Ok(Tpl {
            span,
            exprs,
            quasis,
        })
    }

    fn parse_tpl_element(&mut self, is_tagged: bool) -> PResult<'a, TplElement> {
        let start = cur_pos!();

        let (raw, cooked) = match *cur!(true)? {
            Token::Template { .. } => match bump!() {
                Token::Template {
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

    fn parse_subscripts(&mut self, mut obj: ExprOrSuper, no_call: bool) -> PResult<'a, Box<Expr>> {
        loop {
            obj = match self.parse_subscript(obj, no_call)? {
                (expr, false) => return Ok(expr),
                (expr, true) => ExprOrSuper::Expr(expr),
            }
        }
    }

    /// returned bool is true if this method should be called again.
    #[allow(clippy::cognitive_complexity)]
    fn parse_subscript(
        &mut self,
        obj: ExprOrSuper,
        no_call: bool,
    ) -> PResult<'a, (Box<Expr>, bool)> {
        let _ = cur!(false);
        let start = obj.span().lo();

        if self.input.syntax().typescript() {
            if !self.input.had_line_break_before_cur() && is!('!') {
                self.input.set_expr_allowed(false);
                assert_and_bump!('!');

                let expr = match obj {
                    ExprOrSuper::Super(..) => unimplemented!("super!"),
                    ExprOrSuper::Expr(expr) => expr,
                };
                return Ok((
                    Box::new(Expr::TsNonNull(TsNonNullExpr {
                        span: span!(start),
                        expr,
                    })),
                    true,
                ));
            }

            if {
                match obj {
                    ExprOrSuper::Expr(..) => true,
                    // super() cannot be generic
                    _ => false,
                }
            } && is!('<')
            {
                let obj_ref = &obj;
                // tsTryParseAndCatch is expensive, so avoid if not necessary.
                // There are number of things we are going to "maybe" parse, like type arguments
                // on tagged template expressions. If any of them fail, walk it back and
                // continue.
                let result = self.try_parse_ts(|p| {
                    if !no_call
                        && p.at_possible_async(match obj_ref {
                            ExprOrSuper::Expr(ref expr) => &*expr,
                            _ => unreachable!(),
                        })?
                    {
                        // Almost certainly this is a generic async function `async <T>() => ...
                        // But it might be a call with a type argument `async<T>();`
                        let async_arrow_fn = p.try_parse_ts_generic_async_arrow_fn(start)?;
                        if let Some(async_arrow_fn) = async_arrow_fn {
                            return Ok(Some((Box::new(Expr::Arrow(async_arrow_fn)), true)));
                        }
                    }

                    let type_args = p.parse_ts_type_args()?;

                    if !no_call && is!('(') {
                        // possibleAsync always false here, because we would have handled it
                        // above. (won't be any undefined arguments)
                        let args = p.parse_args(is_import(&obj))?;

                        Ok(Some((
                            Box::new(Expr::Call(CallExpr {
                                span: span!(start),
                                callee: obj_ref.clone(),
                                type_args: Some(type_args),
                                args,
                            })),
                            true,
                        )))
                    } else if is!('`') {
                        p.parse_tagged_tpl(
                            match *obj_ref {
                                ExprOrSuper::Expr(ref obj) => obj.clone(),
                                _ => unreachable!(),
                            },
                            Some(type_args),
                        )
                        .map(|expr| (Box::new(Expr::TaggedTpl(expr)), true))
                        .map(Some)
                    } else {
                        unexpected!()
                    }
                });
                if let Some(result) = result {
                    return Ok(result);
                }
            }
        }

        let is_optional_chaining =
            self.input.syntax().typescript() && is!('?') && peeked_is!('.') && eat!('?');

        /// Wrap with optional chaining
        macro_rules! wrap {
            ($e:expr) => {{
                if is_optional_chaining {
                    Expr::OptChain(OptChainExpr {
                        span: span!(self, start),
                        expr: Box::new($e),
                    })
                } else {
                    $e
                }
            }};
        }

        // $obj[name()]
        if (is_optional_chaining && is!('.') && peeked_is!('[') && eat!('.') && eat!('['))
            || eat!('[')
        {
            let prop = self.include_in_expr(true).parse_expr()?;
            expect!(']');
            let span = Span::new(obj.span().lo(), self.input.last_pos(), Default::default());
            debug_assert_eq!(obj.span().lo(), span.lo());

            return Ok((
                Box::new(wrap!(Expr::Member(MemberExpr {
                    span,
                    obj,
                    prop,
                    computed: true,
                }))),
                true,
            ));
        }

        if (is_optional_chaining && is!('.') && peeked_is!('(') && eat!('.'))
            || (!no_call && (is!('(')))
        {
            let args = self.parse_args(is_import(&obj))?;
            return Ok((
                Box::new(wrap!(Expr::Call(CallExpr {
                    span: span!(self, start),
                    callee: obj,
                    args,
                    type_args: None,
                }))),
                true,
            ));
        }

        // member expression
        // $obj.name
        if eat!('.') {
            let prop: Box<Expr> = Box::new(self.parse_maybe_private_name().map(|e| match e {
                Either::Left(p) => Expr::PrivateName(p),
                Either::Right(i) => Expr::Ident(i),
            })?);
            let span = span!(obj.span().lo());
            debug_assert_eq!(obj.span().lo(), span.lo());
            debug_assert_eq!(prop.span().hi(), span.hi());

            return Ok((
                Box::new(wrap!(Expr::Member(MemberExpr {
                    span,
                    obj,

                    prop,
                    computed: false,
                }))),
                true,
            ));
        }

        match obj {
            ExprOrSuper::Expr(expr) => {
                // MemberExpression[?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
                if is!('`') {
                    let tpl = self.parse_tagged_tpl(expr, None)?;
                    return Ok((Box::new(Expr::TaggedTpl(tpl)), true));
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
    pub(super) fn parse_lhs_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let start = cur_pos!();

        // parse jsx
        if self.input.syntax().jsx() {
            fn into_expr(e: Either<JSXFragment, JSXElement>) -> Box<Expr> {
                match e {
                    Either::Left(l) => Box::new(l.into()),
                    Either::Right(r) => Box::new(Box::new(r).into()),
                }
            }
            match *cur!(true)? {
                Token::JSXText { .. } => {
                    return self
                        .parse_jsx_text()
                        .map(Lit::JSXText)
                        .map(Expr::Lit)
                        .map(Box::new);
                }
                Token::JSXTagStart => {
                    return self.parse_jsx_element().map(into_expr);
                }
                _ => {}
            }

            if is!('<') && !peeked_is!('!') {
                // In case we encounter an lt token here it will always be the start of
                // jsx as the lt sign is not allowed in places that expect an expression

                // FIXME:
                // self.finishToken(tt.jsxTagStart);

                return self.parse_jsx_element().map(into_expr);
            }
        }

        // `super()` can't be handled from parse_new_expr()
        if eat!("super") {
            let obj = ExprOrSuper::Super(Super { span: span!(start) });
            return self.parse_subscripts(obj, false);
        }

        let callee = self.parse_new_expr()?;
        return_if_arrow!(callee);

        let type_args = if self.input.syntax().typescript() && is!('<') {
            self.try_parse_ts(|p| {
                let type_args = p.parse_ts_type_args()?;
                if is!('(') {
                    Ok(Some(type_args))
                } else {
                    Ok(None)
                }
            })
        } else {
            None
        };

        if let Expr::New(ne @ NewExpr { args: None, .. }) = *callee {
            // If this is parsed using 'NewExpression' rule, just return it.
            // Because it's not left-recursive.
            if type_args.is_some() {
                // This fails with `expected (`
                expect!('(');
            }
            debug_assert_ne!(
                cur!(false).ok(),
                Some(&tok!('(')),
                "parse_new_expr() should eat paren if it exists"
            );
            return Ok(Box::new(Expr::New(NewExpr { type_args, ..ne })));
        }
        // 'CallExpr' rule contains 'MemberExpr (...)',
        // and 'MemberExpr' rule contains 'new MemberExpr (...)'

        if is!('(') {
            // This is parsed using production MemberExpression,
            // which is left-recursive.
            let callee = ExprOrSuper::Expr(callee);
            let args = self.parse_args(is_import(&callee))?;

            let call_expr = Box::new(Expr::Call(CallExpr {
                span: span!(start),

                callee,
                args,
                type_args,
            }));

            return self.parse_subscripts(ExprOrSuper::Expr(call_expr), false);
        }
        if type_args.is_some() {
            // This fails
            expect!('(');
        }

        // This is parsed using production 'NewExpression', which contains
        // 'MemberExpression'
        Ok(callee)
    }

    pub(super) fn parse_expr_or_pat(&mut self) -> PResult<'a, Box<Expr>> {
        self.parse_expr()
    }

    #[allow(clippy::cognitive_complexity)]
    pub(super) fn parse_args_or_pats(&mut self) -> PResult<'a, Vec<PatOrExprOrSpread>> {
        expect!('(');

        let mut first = true;
        let mut items = vec![];
        let mut rest_span = None;

        // TODO(kdy1): optimize (once we parsed a pattern, we can parse everything else
        // as a pattern instead of reparsing)
        while !eof!() && !is!(')') {
            if first {
                if is!("async") {
                    // https://github.com/swc-project/swc/issues/410
                    self.state.potential_arrow_start = Some(cur_pos!());
                    let expr = self.parse_primary_expr()?;
                    expect!(')');
                    return Ok(vec![PatOrExprOrSpread::ExprOrSpread(ExprOrSpread {
                        expr,
                        spread: None,
                    })]);
                }
            } else {
                expect!(',');
                // Handle trailing comma.
                if is!(')') {
                    break;
                }
            }

            let start = cur_pos!();
            let modifier_start = start;

            let has_modifier = self.eat_any_ts_modifier()?;
            let pat_start = cur_pos!();

            let mut arg = {
                if self.input.syntax().typescript()
                    && (is!(IdentRef) || (is!("...") && peeked_is!(IdentRef)))
                {
                    let spread = if eat!("...") {
                        Some(self.input.prev_span())
                    } else {
                        None
                    };

                    // At here, we use parse_bin_expr() instead of parse_assignment_expr()
                    // because `x?: number` should not be parsed as a conditional expression
                    let expr = if spread.is_some() {
                        self.include_in_expr(true).parse_bin_expr()?
                    } else {
                        let mut expr = self.parse_bin_expr()?;

                        if let Ok(&Token::AssignOp(..)) = cur!(false) {
                            expr = self.finish_assignment_expr(start, expr)?
                        }

                        expr
                    };

                    ExprOrSpread { spread, expr }
                } else {
                    self.include_in_expr(true).parse_expr_or_spread()?
                }
            };

            let optional = if self.input.syntax().typescript() {
                if is!('?') {
                    if peeked_is!(',') || peeked_is!(':') || peeked_is!(')') || peeked_is!('=') {
                        assert_and_bump!('?');
                        let _ = cur!(false);
                        match *arg.expr {
                            Expr::Ident(..) => {}
                            _ => {
                                syntax_error!(arg.span(), SyntaxError::TsBindingPatCannotBeOptional)
                            }
                        }
                        true
                    } else if match arg {
                        ExprOrSpread { spread: None, .. } => true,
                        _ => false,
                    } {
                        expect!('?');
                        let test = arg.expr;
                        let ctx = Context {
                            in_cond_expr: true,
                            include_in_expr: true,
                            ..self.ctx()
                        };
                        let cons = self.with_ctx(ctx).parse_assignment_expr()?;
                        expect!(':');
                        let ctx = Context {
                            in_cond_expr: true,
                            ..self.ctx()
                        };
                        let alt = self.with_ctx(ctx).parse_assignment_expr()?;

                        arg = ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Cond(CondExpr {
                                span: Span::new(start, alt.span().hi(), Default::default()),

                                test,
                                cons,
                                alt,
                            })),
                        };

                        false
                    } else {
                        false
                    }
                } else {
                    false
                }
            } else {
                false
            };

            if optional || (self.input.syntax().typescript() && is!(':')) {
                let start = cur_pos!();

                // TODO: `async(...args?: any[]) : any => {}`
                //
                // if self.input.syntax().typescript() && optional && arg.spread.is_some() {
                //     self.emit_err(self.input.prev_span(), SyntaxError::TS1047)
                // }

                let mut pat = self.reparse_expr_as_pat(PatType::BindingPat, arg.expr)?;
                if optional {
                    match pat {
                        Pat::Ident(ref mut i) => i.optional = true,
                        _ => unreachable!(),
                    }
                }
                if let Some(span) = arg.spread {
                    if let Some(rest_span) = rest_span {
                        // Rest pattern must be last one.
                        syntax_error!(rest_span, SyntaxError::NonLastRestParam);
                    }
                    rest_span = Some(span);
                    pat = Pat::Rest(RestPat {
                        span: span!(pat_start),
                        dot3_token: span,
                        arg: Box::new(pat),
                        type_ann: None,
                    });
                }
                match pat {
                    Pat::Ident(Ident {
                        ref mut type_ann,
                        ref mut span,
                        ..
                    })
                    | Pat::Array(ArrayPat {
                        ref mut type_ann,
                        ref mut span,
                        ..
                    })
                    | Pat::Assign(AssignPat {
                        ref mut type_ann,
                        ref mut span,
                        ..
                    })
                    | Pat::Object(ObjectPat {
                        ref mut type_ann,
                        ref mut span,
                        ..
                    })
                    | Pat::Rest(RestPat {
                        ref mut type_ann,
                        ref mut span,
                        ..
                    }) => {
                        let new_type_ann = self.try_parse_ts_type_ann()?;
                        if new_type_ann.is_some() {
                            *span = Span::new(
                                pat_start,
                                self.input.prev_span().hi(),
                                Default::default(),
                            );
                        }
                        *type_ann = new_type_ann;
                    }
                    Pat::Expr(ref expr) => unreachable!("invalid pattern: Expr({:?})", expr),
                    Pat::Invalid(ref i) => unreachable!("invalid pattern: {:?}", i.span),
                }

                if eat!('=') {
                    let right = self.parse_assignment_expr()?;
                    pat = Pat::Assign(AssignPat {
                        span: span!(start),
                        left: Box::new(pat),
                        right,
                        type_ann: None,
                    });
                }

                if has_modifier {
                    self.emit_err(span!(modifier_start), SyntaxError::TS2369);
                }

                items.push(PatOrExprOrSpread::Pat(pat))
            } else {
                if has_modifier {
                    self.emit_err(span!(modifier_start), SyntaxError::TS2369);
                }

                items.push(PatOrExprOrSpread::ExprOrSpread(arg));
            }

            // https://github.com/swc-project/swc/issues/433
            if first && eat!("=>") && {
                debug_assert_eq!(items.len(), 1);
                match items[0] {
                    PatOrExprOrSpread::ExprOrSpread(ExprOrSpread { ref expr, .. })
                    | PatOrExprOrSpread::Pat(Pat::Expr(ref expr)) => match **expr {
                        Expr::Ident(..) => true,
                        _ => false,
                    },
                    PatOrExprOrSpread::Pat(Pat::Ident(..)) => true,
                    _ => false,
                }
            } {
                let params = self
                    .parse_paren_items_as_params(items)?
                    .into_iter()
                    .collect();

                let body: BlockStmtOrExpr = self.parse_fn_body(false, false)?;
                expect!(')');
                let span = span!(start);
                return Ok(vec![PatOrExprOrSpread::ExprOrSpread(ExprOrSpread {
                    expr: Box::new(
                        ArrowExpr {
                            span,
                            body,
                            is_async: false,
                            is_generator: false,
                            params,
                            type_params: None,
                            return_type: None,
                        }
                        .into(),
                    ),
                    spread: None,
                })]);
            }

            first = false;
        }

        expect!(')');
        Ok(items)
    }
}

#[ast_node]
pub(in crate::parser) enum PatOrExprOrSpread {
    #[tag("*")]
    Pat(Pat),
    #[tag("*")]
    ExprOrSpread(ExprOrSpread),
}

/// simple leaf methods.
#[parser]
impl<'a, I: Tokens> Parser<'a, I> {
    fn parse_yield_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let start = cur_pos!();

        assert_and_bump!("yield");
        debug_assert!(self.ctx().in_generator);

        // Spec says
        // YieldExpression cannot be used within the FormalParameters of a generator
        // function because any expressions that are part of FormalParameters are
        // evaluated before the resulting generator object is in a resumable state.
        if self.ctx().in_parameters {
            syntax_error!(self.input.prev_span(), SyntaxError::YieldParamInGen)
        }

        if is!(';') || (!is!('*') && !cur!(false).map(Token::starts_expr).unwrap_or(true)) {
            Ok(Box::new(Expr::Yield(YieldExpr {
                span: span!(start),
                arg: None,
                delegate: false,
            })))
        } else {
            let has_star = eat!('*');
            let arg = self.parse_assignment_expr()?;

            Ok(Box::new(Expr::Yield(YieldExpr {
                span: span!(start),
                arg: Some(arg),
                delegate: has_star,
            })))
        }
    }

    fn at_possible_async(&mut self, expr: &Expr) -> PResult<'a, bool> {
        // TODO(kdy1): !this.state.containsEsc &&

        Ok(self.state.potential_arrow_start == Some(expr.span().lo())
            && match *expr {
                Expr::Ident(Ident {
                    sym: js_word!("async"),
                    ..
                }) => true,
                _ => false,
            })
    }

    /// 12.2.5 Array Initializer
    pub(super) fn parse_lit(&mut self) -> PResult<'a, Lit> {
        let start = cur_pos!();

        let v = match *cur!(true)? {
            Word(Word::Null) => {
                bump!();
                let span = span!(start);
                Lit::Null(Null { span })
            }
            Word(Word::True) | Word(Word::False) => {
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
            Token::Num(..) => match bump!() {
                Token::Num(value) => Lit::Num(Number {
                    span: span!(start),
                    value,
                }),
                _ => unreachable!(),
            },
            Token::BigInt(..) => match bump!() {
                Token::BigInt(value) => Lit::BigInt(BigInt {
                    span: span!(start),
                    value,
                }),
                _ => unreachable!(),
            },
            _ => unreachable!("parse_lit should not be called"),
        };
        Ok(v)
    }

    pub(super) fn parse_dynamic_import(
        &mut self,
        start: BytePos,
        import_ident: Ident,
    ) -> PResult<'a, Box<Expr>> {
        if !self.input.syntax().dynamic_import() {
            syntax_error!(span!(start), SyntaxError::DynamicImport);
        }

        let args = self.parse_args(true)?;
        let import = Box::new(Expr::Call(CallExpr {
            span: span!(start),
            callee: ExprOrSuper::Expr(Box::new(Expr::Ident(import_ident))),
            args,
            type_args: Default::default(),
        }));

        self.parse_subscripts(ExprOrSuper::Expr(import), true)
    }

    pub(super) fn check_assign_target(&mut self, expr: &Expr, deny_call: bool) {
        // We follow behavior of tsc
        if self.input.syntax().typescript() {
            let is_eval_or_arguments = match *expr {
                Expr::Ident(ref i) => i.sym == js_word!("eval") || i.sym == js_word!("arguments"),
                _ => false,
            };

            fn should_deny(e: &Expr, deny_call: bool) -> bool {
                match e {
                    Expr::Lit(..) => false,
                    Expr::Call(..) => deny_call,
                    Expr::Bin(..) => false,
                    Expr::Paren(ref p) => should_deny(&p.expr, deny_call),

                    _ => true,
                }
            }

            // It is an early Reference Error if LeftHandSideExpression is neither
            // an ObjectLiteral nor an ArrayLiteral and
            // IsValidSimpleAssignmentTarget of LeftHandSideExpression is false.
            if !is_eval_or_arguments
                && !expr.is_valid_simple_assignment_target(self.ctx().strict)
                && should_deny(&expr, deny_call)
            {
                self.emit_err(expr.span(), SyntaxError::TS2406);
            }
        } else {
            if !expr.is_valid_simple_assignment_target(self.ctx().strict) {
                self.emit_err(expr.span(), SyntaxError::TS2406);
            }
        }
    }
}

fn is_import(obj: &ExprOrSuper) -> bool {
    match *obj {
        ExprOrSuper::Expr(ref expr) => match **expr {
            Expr::Ident(Ident {
                sym: js_word!("import"),
                ..
            }) => true,
            _ => false,
        },
        _ => false,
    }
}
