use either::Either;
use swc_atoms::js_word;
use swc_common::{ast_node, util::take::Take, Spanned};

use super::{pat::PatType, util::ExprExt, *};
use crate::{
    lexer::TokenContext, parser::class_and_fn::IsSimpleParameterList, token::AssignOpToken,
};

mod ops;
#[cfg(test)]
mod tests;
mod verifier;

impl<'a, I: Tokens> Parser<I> {
    pub fn parse_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_expr);

        let _tracing = debug_tracing!(self, "parse_expr");

        let expr = self.parse_assignment_expr()?;
        let start = expr.span().lo();

        if is!(self, ',') {
            let mut exprs = vec![expr];
            while eat!(self, ',') {
                exprs.push(self.parse_assignment_expr()?);
            }

            return Ok(Box::new(Expr::Seq(SeqExpr {
                span: span!(self, start),
                exprs,
            })));
        }

        Ok(expr)
    }

    ///`parseMaybeAssign` (overridden)
    pub(super) fn parse_assignment_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_assignment_expr);

        if self.input.syntax().typescript() && self.input.syntax().jsx() {
            // Note: When the JSX plugin is on, type assertions (`<T> x`) aren't valid
            // syntax.

            if is!(self, JSXTagStart) {
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

        self.parse_assignment_expr_base()
    }

    /// Parse an assignment expression. This includes applications of
    /// operators like `+=`.
    ///
    /// `parseMaybeAssign`
    fn parse_assignment_expr_base(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_assignment_expr_base);

        if self.input.syntax().typescript()
            && (is_one_of!(self, '<', JSXTagStart))
            && (peeked_is!(self, IdentName) || peeked_is!(self, JSXName))
        {
            let ctx = Context {
                is_direct_child_of_cond: false,
                ..self.ctx()
            };
            let res = self.with_ctx(ctx).try_parse_ts(|p| {
                if is!(p, JSXTagStart) {
                    if let Some(TokenContext::JSXOpeningTag) = p.input.token_context().current() {
                        p.input.token_context_mut().pop();

                        debug_assert_eq!(
                            p.input.token_context().current(),
                            Some(TokenContext::JSXExpr)
                        );
                        p.input.token_context_mut().pop();
                    }
                }

                let type_parameters = p.parse_ts_type_params(false)?;
                let mut arrow = p.parse_assignment_expr_base()?;
                match *arrow {
                    Expr::Arrow(ArrowExpr {
                        ref mut span,
                        ref mut type_params,
                        ..
                    }) => {
                        *span = Span::new(type_parameters.span.lo, span.hi, Default::default());
                        *type_params = Some(type_parameters);
                    }
                    _ => unexpected!(p, "("),
                }
                Ok(Some(arrow))
            });
            if let Some(res) = res {
                return Ok(res);
            }
        }

        if self.ctx().in_generator && is!(self, "yield") {
            return self.parse_yield_expr();
        }

        self.state.potential_arrow_start = match *cur!(self, true)? {
            Word(Word::Ident(..)) | tok!('(') | tok!("yield") => Some(cur_pos!(self)),
            _ => None,
        };

        let start = cur_pos!(self);

        // Try to parse conditional expression.
        let cond = self.parse_cond_expr()?;

        return_if_arrow!(self, cond);

        match *cond {
            // if cond is conditional expression but not left-hand-side expression,
            // just return it.
            Expr::Cond(..) | Expr::Bin(..) | Expr::Unary(..) | Expr::Update(..) => return Ok(cond),
            _ => {}
        }

        self.finish_assignment_expr(start, cond)
    }

    fn finish_assignment_expr(&mut self, start: BytePos, cond: Box<Expr>) -> PResult<Box<Expr>> {
        trace_cur!(self, finish_assignment_expr);

        match cur!(self, false) {
            Ok(&Token::AssignOp(op)) => {
                let left = if op == AssignOpToken::Assign {
                    self.reparse_expr_as_pat(PatType::AssignPat, cond)
                        .map(Box::new)
                        .map(PatOrExpr::Pat)?
                } else {
                    //It is an early Reference Error if IsValidSimpleAssignmentTarget of
                    // LeftHandSideExpression is false.
                    if !self.input.syntax().typescript()
                        && !cond.is_valid_simple_assignment_target(self.ctx().strict)
                    {
                        self.emit_err(cond.span(), SyntaxError::NotSimpleAssign)
                    }
                    let is_eval_or_arguments = match *cond {
                        Expr::Ident(ref i) => {
                            i.sym == js_word!("eval") || i.sym == js_word!("arguments")
                        }
                        _ => false,
                    };
                    if self.input.syntax().typescript() && is_eval_or_arguments {
                        self.emit_strict_mode_err(cond.span(), SyntaxError::TS1100);
                    }

                    // TODO
                    PatOrExpr::Expr(cond)
                };

                bump!(self);
                let right = self.parse_assignment_expr()?;
                Ok(Box::new(Expr::Assign(AssignExpr {
                    span: span!(self, start),
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
    fn parse_cond_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_cond_expr);

        let start = cur_pos!(self);

        let test = self.parse_bin_expr()?;
        return_if_arrow!(self, test);

        if eat!(self, '?') {
            let ctx = Context {
                in_cond_expr: true,
                is_direct_child_of_cond: true,
                include_in_expr: true,
                ..self.ctx()
            };
            let cons = self.with_ctx(ctx).parse_assignment_expr()?;
            expect!(self, ':');
            let ctx = Context {
                in_cond_expr: true,
                is_direct_child_of_cond: true,
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
    pub(super) fn parse_primary_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_primary_expr);

        let _ = self.input.cur();
        let start = cur_pos!(self);

        let can_be_arrow = self
            .state
            .potential_arrow_start
            .map(|s| s == start)
            .unwrap_or(false);

        if let Some(tok) = self.input.cur() {
            match tok {
                tok!("this") => {
                    self.input.bump();
                    return Ok(Box::new(Expr::This(ThisExpr {
                        span: span!(self, start),
                    })));
                }

                tok!("import") => {
                    let import = self.parse_ident_name()?;
                    if is!(self, '.') {
                        self.state.found_module_item = true;
                        if !self.ctx().can_be_module {
                            let span = span!(self, start);
                            self.emit_err(span, SyntaxError::ImportMetaInScript);
                        }
                        return self
                            .parse_import_meta_prop(Import { span: import.span })
                            .map(Expr::MetaProp)
                            .map(Box::new);
                    }

                    return self.parse_dynamic_import(start, import.span);
                }

                tok!("async") => {
                    if peeked_is!(self, "function")
                        && !self.input.has_linebreak_between_cur_and_peeked()
                    {
                        // handle `async function` expression
                        return self.parse_async_fn_expr();
                    }

                    if can_be_arrow && self.input.syntax().typescript() && peeked_is!(self, '<') {
                        // try parsing `async<T>() => {}`
                        if let Some(res) = self.try_parse_ts(|p| {
                            let start = cur_pos!(p);
                            assert_and_bump!(p, "async");
                            p.try_parse_ts_generic_async_arrow_fn(start)
                        }) {
                            return Ok(Box::new(Expr::Arrow(res)));
                        }
                    }

                    if can_be_arrow && peeked_is!(self, '(') {
                        expect!(self, "async");
                        let async_span = self.input.prev_span();
                        return self.parse_paren_expr_or_arrow_fn(can_be_arrow, Some(async_span));
                    }
                }

                tok!('[') => {
                    let ctx = Context {
                        is_direct_child_of_cond: false,
                        dont_parse_colon_as_type_ann: false,
                        ..self.ctx()
                    };
                    return self.with_ctx(ctx).parse_array_lit();
                }

                tok!('{') => {
                    return self.parse_object();
                }

                // Handle FunctionExpression and GeneratorExpression
                tok!("function") => {
                    return self.parse_fn_expr();
                }

                // Literals
                tok!("null")
                | tok!("true")
                | tok!("false")
                | Token::Num { .. }
                | Token::BigInt { .. }
                | Token::Str { .. } => {
                    return Ok(Box::new(Expr::Lit(self.parse_lit()?)));
                }

                // Regexp
                Token::Regex(..) => match bump!(self) {
                    Token::Regex(exp, flags) => {
                        return Ok(Box::new(Expr::Lit(Lit::Regex(Regex {
                            span: span!(self, start),
                            exp,
                            flags,
                        }))));
                    }
                    _ => unreachable!(),
                },

                tok!('`') => {
                    // parse template literal
                    return Ok(Box::new(Expr::Tpl(self.parse_tpl(false)?)));
                }

                tok!('(') => {
                    return self.parse_paren_expr_or_arrow_fn(can_be_arrow, None);
                }

                _ => {}
            }
        }

        let decorators = self.parse_decorators(false)?;

        if is!(self, "class") {
            return self.parse_class_expr(start, decorators);
        }

        if is!(self, "let")
            || (self.input.syntax().typescript() && is_one_of!(self, IdentRef, "await"))
            || is!(self, IdentRef)
        {
            let id = self.parse_ident_name()?;
            if id.is_reserved_in_strict_mode(self.ctx().module && !self.ctx().in_declare) {
                self.emit_strict_mode_err(
                    self.input.prev_span(),
                    SyntaxError::InvalidIdentInStrict,
                );
            }

            if can_be_arrow && id.sym == js_word!("async") && is!(self, BindingIdent) {
                let ident = self.parse_binding_ident()?;
                if self.input.syntax().typescript()
                    && ident.id.sym == js_word!("as")
                    && !is!(self, "=>")
                {
                    // async as type
                    let type_ann = self.in_type().parse_with(|p| p.parse_ts_type())?;
                    return Ok(Box::new(Expr::TsAs(TsAsExpr {
                        span: span!(self, start),
                        expr: Box::new(Expr::Ident(id)),
                        type_ann,
                    })));
                }
                // async a => body
                let arg = Pat::from(ident);
                let params = vec![arg];
                expect!(self, "=>");
                let body =
                    self.parse_fn_body(true, false, true, params.is_simple_parameter_list())?;

                return Ok(Box::new(Expr::Arrow(ArrowExpr {
                    span: span!(self, start),
                    body,
                    params,
                    is_async: true,
                    is_generator: false,
                    return_type: None,
                    type_params: None,
                })));
            } else if can_be_arrow && !self.input.had_line_break_before_cur() && eat!(self, "=>") {
                let params = vec![id.into()];
                let body =
                    self.parse_fn_body(false, false, true, params.is_simple_parameter_list())?;

                return Ok(Box::new(Expr::Arrow(ArrowExpr {
                    span: span!(self, start),
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

        if self.input.syntax().private_in_object() && eat!(self, '#') {
            let id = self.parse_ident_name()?;
            return Ok(Box::new(Expr::PrivateName(PrivateName {
                span: span!(self, start),
                id,
            })));
        }

        unexpected!(
            self,
            "this, import, async, function, [ for array literal, { for object literal, @ for \
             decorator, function, class, null, true, false, number, bigint, string, regexp, ` for \
             template literal, (, or an identifier"
        )
    }

    fn parse_array_lit(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_array_lit);

        let start = cur_pos!(self);

        assert_and_bump!(self, '[');
        let mut elems = vec![];

        while !eof!(self) && !is!(self, ']') {
            if is!(self, ',') {
                expect!(self, ',');
                elems.push(None);
                continue;
            }
            elems.push(
                self.include_in_expr(true)
                    .parse_expr_or_spread()
                    .map(Some)?,
            );
            if !is!(self, ']') {
                expect!(self, ',');
                if is!(self, ']') {
                    self.state
                        .trailing_commas
                        .insert(start, self.input.prev_span());
                }
            }
        }

        expect!(self, ']');

        let span = span!(self, start);
        Ok(Box::new(Expr::Array(ArrayLit { span, elems })))
    }

    #[allow(dead_code)]
    fn parse_member_expr(&mut self) -> PResult<Box<Expr>> {
        self.parse_member_expr_or_new_expr(false)
    }

    /// `parseImportMetaProperty`
    pub(super) fn parse_import_meta_prop(&mut self, import: Import) -> PResult<MetaPropExpr> {
        expect!(self, '.');

        let _ = if is!(self, "meta") {
            self.parse_ident_name()?
        } else {
            unexpected!(self, "meta");
        };

        Ok(MetaPropExpr {
            span: span!(self, import.span.lo()),
            kind: MetaPropKind::ImportMeta,
        })
    }

    /// `is_new_expr`: true iff we are parsing production 'NewExpression'.
    fn parse_member_expr_or_new_expr(&mut self, is_new_expr: bool) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_member_expr_or_new_expr);

        let start = cur_pos!(self);
        if eat!(self, "new") {
            if eat!(self, '.') {
                if eat!(self, "target") {
                    let expr = Box::new(Expr::MetaProp(MetaPropExpr {
                        span: span!(self, start),
                        kind: MetaPropKind::NewTarget,
                    }));

                    return self.parse_subscripts(Callee::Expr(expr), true, false);
                }

                unexpected!(self, "target")
            }

            // 'NewExpression' allows new call without paren.
            let callee = self.parse_member_expr_or_new_expr(is_new_expr)?;
            return_if_arrow!(self, callee);

            if is_new_expr {
                match *callee {
                    Expr::OptChain(OptChainExpr {
                        question_dot_token, ..
                    }) => {
                        syntax_error!(
                            self,
                            question_dot_token,
                            SyntaxError::OptChainCannotFollowConstructorCall
                        )
                    }
                    Expr::Member(MemberExpr { ref obj, .. }) => {
                        if let Expr::OptChain(OptChainExpr {
                            question_dot_token, ..
                        }) = **obj
                        {
                            syntax_error!(
                                self,
                                question_dot_token,
                                SyntaxError::OptChainCannotFollowConstructorCall
                            )
                        }
                    }
                    _ => {}
                }
            }

            let type_args = if self.input.syntax().typescript() && is!(self, '<') {
                self.try_parse_ts(|p| {
                    let args = p.parse_ts_type_args()?;
                    if !is!(p, '(') {
                        // This will fail
                        expect!(p, '(');
                    }
                    Ok(Some(args))
                })
            } else {
                None
            };

            if !is_new_expr || is!(self, '(') {
                // Parsed with 'MemberExpression' production.
                let args = self.parse_args(false).map(Some)?;

                let new_expr = Callee::Expr(Box::new(Expr::New(NewExpr {
                    span: span!(self, start),
                    callee,
                    args,
                    type_args,
                })));

                // We should parse subscripts for MemberExpression.
                // Because it's left recursive.
                return self.parse_subscripts(new_expr, true, false);
            }

            // Parsed with 'NewExpression' production.

            return Ok(Box::new(Expr::New(NewExpr {
                span: span!(self, start),
                callee,
                args: None,
                type_args,
            })));
        }

        if eat!(self, "super") {
            let base = Callee::Super(Super {
                span: span!(self, start),
            });
            return self.parse_subscripts(base, true, false);
        }
        if eat!(self, "import") {
            let base = Callee::Import(Import {
                span: span!(self, start),
            });
            return self.parse_subscripts(base, true, false);
        }
        let obj = self.parse_primary_expr()?;
        return_if_arrow!(self, obj);

        let type_args = if self.syntax().typescript() && is!(self, '<') {
            self.try_parse_ts_type_args()
        } else {
            None
        };
        let obj = if let Some(type_args) = type_args {
            Box::new(Expr::TsInstantiation(TsInstantiation {
                expr: obj,
                type_args,
                span: span!(self, start),
            }))
        } else {
            obj
        };

        self.parse_subscripts(Callee::Expr(obj), true, false)
    }

    /// Parse `NewExpression`.
    /// This includes `MemberExpression`.
    pub(super) fn parse_new_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_new_expr);

        self.parse_member_expr_or_new_expr(true)
    }

    /// Parse `Arguments[Yield, Await]`
    pub(super) fn parse_args(&mut self, is_dynamic_import: bool) -> PResult<Vec<ExprOrSpread>> {
        trace_cur!(self, parse_args);

        let ctx = Context {
            is_direct_child_of_cond: false,
            ..self.ctx()
        };

        self.with_ctx(ctx).parse_with(|p| {
            let start = cur_pos!(p);
            expect!(p, '(');

            let mut first = true;
            let mut expr_or_spreads = Vec::with_capacity(8);

            while !eof!(p) && !is!(p, ')') {
                if first {
                    first = false;
                } else {
                    expect!(p, ',');
                    // Handle trailing comma.
                    if is!(p, ')') {
                        if is_dynamic_import && !p.input.syntax().import_assertions() {
                            syntax_error!(
                                p,
                                span!(p, start),
                                SyntaxError::TrailingCommaInsideImport
                            )
                        }

                        break;
                    }
                }

                expr_or_spreads.push(p.include_in_expr(true).parse_expr_or_spread()?);
            }

            expect!(p, ')');
            Ok(expr_or_spreads)
        })
    }

    /// AssignmentExpression[+In, ?Yield, ?Await]
    /// ...AssignmentExpression[+In, ?Yield, ?Await]
    pub(super) fn parse_expr_or_spread(&mut self) -> PResult<ExprOrSpread> {
        trace_cur!(self, parse_expr_or_spread);

        let start = cur_pos!(self);

        if eat!(self, "...") {
            let spread = Some(span!(self, start));
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
    ) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_paren_expr_or_arrow_fn);

        let expr_start = async_span.map(|x| x.lo()).unwrap_or_else(|| cur_pos!(self));

        // At this point, we can't know if it's parenthesized
        // expression or head of arrow function.
        // But as all patterns of javascript is subset of
        // expressions, we can parse both as expression.

        let ctx = Context {
            is_direct_child_of_cond: false,
            ..self.ctx()
        };

        let (paren_items, trailing_comma) = self
            .with_ctx(ctx)
            .include_in_expr(true)
            .parse_args_or_pats()?;

        let has_pattern = paren_items
            .iter()
            .any(|item| matches!(item, PatOrExprOrSpread::Pat(..)));

        let is_direct_child_of_cond = self.ctx().is_direct_child_of_cond;
        // This is slow path. We handle arrow in conditional expression.
        if self.syntax().typescript()
            && self.ctx().in_cond_expr
            && !self.ctx().is_direct_child_of_braceless_arrow_function
            && is!(self, ':')
        {
            // TODO: Remove clone
            let items_ref = &paren_items;
            if let Some(expr) = self.try_parse_ts(|p| {
                let return_type = p.parse_ts_type_or_type_predicate_ann(&tok!(':'))?;

                expect!(p, "=>");

                let params: Vec<Pat> = p
                    .parse_paren_items_as_params(items_ref.clone(), trailing_comma)?
                    .into_iter()
                    .collect();

                let body: BlockStmtOrExpr = p.parse_fn_body(
                    async_span.is_some(),
                    false,
                    true,
                    params.is_simple_parameter_list(),
                )?;

                if is_direct_child_of_cond && !is_one_of!(p, ':', ';', ',', ')') {
                    trace_cur!(p, parse_arrow_in_cond__fail);
                    unexpected!(p, "fail")
                }

                Ok(Some(Box::new(Expr::Arrow(ArrowExpr {
                    span: span!(p, expr_start),
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

        let return_type = if !(self.ctx().in_cond_expr && self.ctx().is_direct_child_of_cond)
            && self.input.syntax().typescript()
            && is!(self, ':')
            && !self.ctx().dont_parse_colon_as_type_ann
        {
            Some(self.parse_ts_type_or_type_predicate_ann(&tok!(':'))?)
        } else {
            None
        };

        // we parse arrow function at here, to handle it efficiently.
        if has_pattern || return_type.is_some() || is!(self, "=>") {
            if self.input.had_line_break_before_cur() {
                syntax_error!(
                    self,
                    span!(self, expr_start),
                    SyntaxError::LineBreakBeforeArrow
                );
            }
            if !can_be_arrow {
                syntax_error!(self, span!(self, expr_start), SyntaxError::ArrowNotAllowed);
            }
            expect!(self, "=>");

            let params: Vec<Pat> = self
                .parse_paren_items_as_params(paren_items, trailing_comma)?
                .into_iter()
                .collect();

            let body: BlockStmtOrExpr = self.parse_fn_body(
                async_span.is_some(),
                false,
                true,
                params.is_simple_parameter_list(),
            )?;
            let arrow_expr = ArrowExpr {
                span: span!(self, expr_start),
                is_async: async_span.is_some(),
                is_generator: false,
                params,
                body,
                return_type,
                type_params: None,
            };
            if let BlockStmtOrExpr::BlockStmt(..) = arrow_expr.body {
                if let Ok(&Token::BinOp(..)) = cur!(self, false) {
                    // ) is required
                    self.emit_err(self.input.cur_span(), SyntaxError::TS1005);
                    let errorred_expr =
                        self.parse_bin_op_recursively(Box::new(arrow_expr.into()), 0)?;

                    if !is!(self, ';') {
                        // ; is required
                        self.emit_err(self.input.cur_span(), SyntaxError::TS1005);
                    }

                    return Ok(errorred_expr);
                }
            }
            return Ok(Box::new(Expr::Arrow(arrow_expr)));
        } else {
            // If there's no arrow function, we have to check there's no
            // AssignProp in lhs to check against assignment in object literals
            // like (a, {b = 1});
            for expr_or_spread in paren_items.iter() {
                if let PatOrExprOrSpread::ExprOrSpread(e) = expr_or_spread {
                    if let Expr::Object(o) = &*e.expr {
                        for p in o.props.iter() {
                            if let PropOrSpread::Prop(prop) = p {
                                if let Prop::Assign(..) = **prop {
                                    self.emit_err(prop.span(), SyntaxError::AssignProperty);
                                }
                            }
                        }
                    }
                }
            }
        }

        let expr_or_spreads = paren_items
            .into_iter()
            .map(|item| -> PResult<_> {
                match item {
                    PatOrExprOrSpread::ExprOrSpread(e) => Ok(e),
                    _ => syntax_error!(self, item.span(), SyntaxError::InvalidExpr),
                }
            })
            .collect::<Result<Vec<_>, _>>()?;
        if let Some(async_span) = async_span {
            // It's a call expression
            return Ok(Box::new(Expr::Call(CallExpr {
                span: span!(self, async_span.lo()),
                callee: Callee::Expr(Box::new(Expr::Ident(Ident::new(
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
                self,
                Span::new(expr_start, last_pos!(self), Default::default()),
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
                } => syntax_error!(self, expr.span(), SyntaxError::SpreadInParenExpr),
                ExprOrSpread { expr, .. } => expr,
            };
            Ok(Box::new(Expr::Paren(ParenExpr {
                span: span!(self, expr_start),
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
                    } => syntax_error!(self, expr.span(), SyntaxError::SpreadInParenExpr),
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
                span: span!(self, expr_start),
                expr: seq_expr,
            })))
        }
    }

    fn parse_tpl_elements(
        &mut self,
        is_tagged_tpl: bool,
    ) -> PResult<(Vec<Box<Expr>>, Vec<TplElement>)> {
        trace_cur!(self, parse_tpl_elements);

        let mut exprs = vec![];

        let cur_elem = self.parse_tpl_element(is_tagged_tpl)?;
        let mut is_tail = cur_elem.tail;
        let mut quasis = vec![cur_elem];

        while !is_tail {
            expect!(self, "${");
            exprs.push(self.include_in_expr(true).parse_expr()?);
            expect!(self, '}');
            let elem = self.parse_tpl_element(is_tagged_tpl)?;
            is_tail = elem.tail;
            quasis.push(elem);
        }

        Ok((exprs, quasis))
    }

    fn parse_tagged_tpl(
        &mut self,
        tag: Box<Expr>,
        type_params: Option<TsTypeParamInstantiation>,
    ) -> PResult<TaggedTpl> {
        let tagged_tpl_start = tag.span().lo();
        trace_cur!(self, parse_tagged_tpl);

        let tpl = self.parse_tpl(true)?;

        let span = span!(self, tagged_tpl_start);
        Ok(TaggedTpl {
            span,
            tag,
            type_params,
            tpl,
        })
    }

    pub(super) fn parse_tpl(&mut self, is_tagged_tpl: bool) -> PResult<Tpl> {
        trace_cur!(self, parse_tpl);
        let start = cur_pos!(self);

        assert_and_bump!(self, '`');

        let (exprs, quasis) = self.parse_tpl_elements(is_tagged_tpl)?;

        expect!(self, '`');

        let span = span!(self, start);
        Ok(Tpl {
            span,
            exprs,
            quasis,
        })
    }

    pub(super) fn parse_tpl_element(&mut self, is_tagged_tpl: bool) -> PResult<TplElement> {
        let start = cur_pos!(self);

        let (raw, cooked) = match *cur!(self, true)? {
            Token::Template { .. } => match bump!(self) {
                Token::Template { raw, cooked, .. } => match cooked {
                    Ok(cooked) => (raw, Some(cooked)),
                    Err(err) => {
                        if is_tagged_tpl {
                            (raw, None)
                        } else {
                            return Err(err);
                        }
                    }
                },
                _ => unreachable!(),
            },
            _ => unexpected!(self, "template token"),
        };

        let tail = is!(self, '`');

        Ok(TplElement {
            span: span!(self, start),
            raw,
            tail,

            cooked,
        })
    }

    pub(super) fn parse_subscripts(
        &mut self,
        mut obj: Callee,
        no_call: bool,
        no_computed_member: bool,
    ) -> PResult<Box<Expr>> {
        let start = obj.span().lo;
        loop {
            obj = match self.parse_subscript(start, obj, no_call, no_computed_member)? {
                (expr, false) => return Ok(expr),
                (expr, true) => Callee::Expr(expr),
            }
        }
    }

    /// returned bool is true if this method should be called again.
    fn parse_subscript(
        &mut self,
        start: BytePos,
        mut obj: Callee,
        no_call: bool,
        no_computed_member: bool,
    ) -> PResult<(Box<Expr>, bool)> {
        let _ = cur!(self, false);

        if self.input.syntax().typescript() {
            if !self.input.had_line_break_before_cur() && is!(self, '!') {
                self.input.set_expr_allowed(false);
                assert_and_bump!(self, '!');

                let expr = match obj {
                    Callee::Super(..) => {
                        syntax_error!(
                            self,
                            self.input.cur_span(),
                            SyntaxError::TsNonNullAssertionNotAllowed(js_word!("super"))
                        )
                    }
                    Callee::Import(..) => {
                        syntax_error!(
                            self,
                            self.input.cur_span(),
                            SyntaxError::TsNonNullAssertionNotAllowed(js_word!("import"))
                        )
                    }
                    Callee::Expr(expr) => expr,
                };
                return Ok((
                    Box::new(Expr::TsNonNull(TsNonNullExpr {
                        span: span!(self, start),
                        expr,
                    })),
                    true,
                ));
            }

            if matches!(obj, Callee::Expr(..)) && is!(self, '<') {
                let is_dynamic_import = obj.is_import();

                let mut obj_opt = Some(obj);
                // tsTryParseAndCatch is expensive, so avoid if not necessary.
                // There are number of things we are going to "maybe" parse, like type arguments
                // on tagged template expressions. If any of them fail, walk it back and
                // continue.

                let mut_obj_opt = &mut obj_opt;

                let result = self.try_parse_ts(|p| {
                    if !no_call
                        && p.at_possible_async(match &mut_obj_opt {
                            Some(Callee::Expr(ref expr)) => &**expr,
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

                    if !no_call && is!(p, '(') {
                        // possibleAsync always false here, because we would have handled it
                        // above. (won't be any undefined arguments)
                        let args = p.parse_args(is_dynamic_import)?;

                        Ok(Some((
                            Box::new(Expr::Call(CallExpr {
                                span: span!(p, start),
                                callee: mut_obj_opt.take().unwrap(),
                                type_args: Some(type_args),
                                args,
                            })),
                            true,
                        )))
                    } else if is!(p, '`') {
                        p.parse_tagged_tpl(
                            match mut_obj_opt {
                                Some(Callee::Expr(obj)) => obj.take(),
                                _ => unreachable!(),
                            },
                            Some(type_args),
                        )
                        .map(|expr| (Box::new(Expr::TaggedTpl(expr)), true))
                        .map(Some)
                    } else if no_call {
                        unexpected!(p, "`")
                    } else {
                        unexpected!(p, "( or `")
                    }
                });
                if let Some(result) = result {
                    return Ok(result);
                }

                obj = obj_opt.unwrap();
            }
        }

        let type_args = if self.syntax().typescript() && is!(self, '<') {
            self.try_parse_ts_type_args()
        } else {
            None
        };

        let question_dot_token = if is!(self, '?') && peeked_is!(self, '.') {
            let start = cur_pos!(self);
            eat!(self, '?');
            Some(span!(self, start))
        } else {
            None
        };

        // $obj[name()]
        if !no_computed_member
            && ((question_dot_token.is_some()
                && is!(self, '.')
                && peeked_is!(self, '[')
                && eat!(self, '.')
                && eat!(self, '['))
                || eat!(self, '['))
        {
            let bracket_lo = self.input.prev_span().lo;
            let prop = self.include_in_expr(true).parse_expr()?;
            expect!(self, ']');
            let span = Span::new(obj.span().lo(), self.input.last_pos(), Default::default());
            debug_assert_eq!(obj.span().lo(), span.lo());
            let prop = ComputedPropName {
                span: Span::new(bracket_lo, self.input.last_pos(), Default::default()),
                expr: prop,
            };

            let type_args = if self.syntax().typescript() && is!(self, '<') {
                self.try_parse_ts_type_args()
            } else {
                None
            };

            return Ok((
                Box::new(match obj {
                    Callee::Import(..) => unreachable!(),
                    Callee::Super(obj) => {
                        if !self.ctx().allow_direct_super
                            && !self.input.syntax().allow_super_outside_method()
                        {
                            syntax_error!(self, self.input.cur_span(), SyntaxError::InvalidSuper);
                        } else if question_dot_token.is_some() {
                            if no_call {
                                syntax_error!(
                                    self,
                                    self.input.cur_span(),
                                    SyntaxError::InvalidSuperCall
                                );
                            }
                            syntax_error!(self, self.input.cur_span(), SyntaxError::InvalidSuper);
                        } else {
                            Expr::SuperProp(SuperPropExpr {
                                span,
                                obj,
                                prop: SuperProp::Computed(prop),
                            })
                        }
                    }
                    Callee::Expr(obj) => {
                        let expr = MemberExpr {
                            span,
                            obj,
                            prop: MemberProp::Computed(prop),
                        };
                        let expr = if let Some(question_dot_token) = question_dot_token {
                            Expr::OptChain(OptChainExpr {
                                span,
                                question_dot_token,
                                base: OptChainBase::Member(expr),
                            })
                        } else {
                            Expr::Member(expr)
                        };

                        if let Some(type_args) = type_args {
                            Expr::TsInstantiation(TsInstantiation {
                                expr: Box::new(expr),
                                type_args,
                                span: span!(self, start),
                            })
                        } else {
                            expr
                        }
                    }
                }),
                true,
            ));
        }

        if (question_dot_token.is_some()
            && is!(self, '.')
            && (peeked_is!(self, '(') || (self.syntax().typescript() && peeked_is!(self, '<')))
            && eat!(self, '.'))
            || (!no_call && (is!(self, '(')))
        {
            let type_args = if self.syntax().typescript() && is!(self, '<') {
                self.parse_ts_type_args().map(Some)?
            } else {
                None
            };
            let args = self.parse_args(obj.is_import())?;
            let span = span!(self, start);
            return if let Some(question_dot_token) = question_dot_token {
                match obj {
                    Callee::Super(_) | Callee::Import(_) => {
                        syntax_error!(self, self.input.cur_span(), SyntaxError::SuperCallOptional)
                    }
                    Callee::Expr(callee) => Ok((
                        Box::new(Expr::OptChain(OptChainExpr {
                            span,
                            question_dot_token,
                            base: OptChainBase::Call(OptCall {
                                span: span!(self, start),
                                callee,
                                args,
                                type_args,
                            }),
                        })),
                        true,
                    )),
                }
            } else {
                Ok((
                    Expr::Call(CallExpr {
                        span: span!(self, start),
                        callee: obj,
                        args,
                        type_args: None,
                    })
                    .into(),
                    true,
                ))
            };
        }

        // member expression
        // $obj.name
        if eat!(self, '.') {
            let prop = self.parse_maybe_private_name().map(|e| match e {
                Either::Left(p) => MemberProp::PrivateName(p),
                Either::Right(i) => MemberProp::Ident(i),
            })?;
            let span = span!(self, obj.span().lo());
            debug_assert_eq!(obj.span().lo(), span.lo());
            debug_assert_eq!(prop.span().hi(), span.hi());

            let type_args = if self.syntax().typescript() && is!(self, '<') {
                self.try_parse_ts_type_args()
            } else {
                None
            };

            return Ok((
                Box::new(match obj {
                    Callee::Import(_) => {
                        if let MemberProp::Ident(Ident {
                            sym: js_word!("meta"),
                            ..
                        }) = prop
                        {
                            if !self.ctx().can_be_module {
                                let span = span!(self, start);
                                self.emit_err(span, SyntaxError::ImportMetaInScript);
                            }
                            Expr::MetaProp(MetaPropExpr {
                                span,
                                kind: MetaPropKind::ImportMeta,
                            })
                        } else {
                            unexpected!(self, "meta");
                        }
                    }
                    Callee::Super(obj) => {
                        if !self.ctx().allow_direct_super
                            && !self.input.syntax().allow_super_outside_method()
                        {
                            syntax_error!(self, self.input.cur_span(), SyntaxError::InvalidSuper);
                        } else if question_dot_token.is_some() {
                            if no_call {
                                syntax_error!(
                                    self,
                                    self.input.cur_span(),
                                    SyntaxError::InvalidSuperCall
                                );
                            }
                            syntax_error!(self, self.input.cur_span(), SyntaxError::InvalidSuper);
                        } else {
                            match prop {
                                MemberProp::Ident(ident) => Expr::SuperProp(SuperPropExpr {
                                    span,
                                    obj,
                                    prop: SuperProp::Ident(ident),
                                }),
                                MemberProp::PrivateName(..) => syntax_error!(
                                    self,
                                    self.input.cur_span(),
                                    SyntaxError::InvalidSuperCall
                                ),
                                MemberProp::Computed(..) => unreachable!(),
                            }
                        }
                    }
                    Callee::Expr(obj) => {
                        let expr = MemberExpr { span, obj, prop };
                        let expr = if let Some(question_dot_token) = question_dot_token {
                            Expr::OptChain(OptChainExpr {
                                span: span!(self, start),
                                question_dot_token,
                                base: OptChainBase::Member(expr),
                            })
                        } else {
                            Expr::Member(expr)
                        };
                        if let Some(type_args) = type_args {
                            Expr::TsInstantiation(TsInstantiation {
                                expr: Box::new(expr),
                                type_args,
                                span: span!(self, start),
                            })
                        } else {
                            expr
                        }
                    }
                }),
                true,
            ));
        }

        match obj {
            Callee::Expr(expr) => {
                let expr = if let Some(type_args) = type_args {
                    Box::new(Expr::TsInstantiation(TsInstantiation {
                        expr,
                        type_args,
                        span: span!(self, start),
                    }))
                } else {
                    expr
                };

                // MemberExpression[?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
                if is!(self, '`') {
                    let tpl = self.parse_tagged_tpl(expr, None)?;
                    return Ok((Box::new(Expr::TaggedTpl(tpl)), true));
                }

                Ok((expr, false))
            }
            Callee::Super(..) => {
                if no_call {
                    syntax_error!(self, self.input.cur_span(), SyntaxError::InvalidSuperCall);
                }
                syntax_error!(self, self.input.cur_span(), SyntaxError::InvalidSuper);
            }
            Callee::Import(..) => {
                syntax_error!(self, self.input.cur_span(), SyntaxError::InvalidImport);
            }
        }
    }

    /// Parse call, dot, and `[]`-subscript expressions.
    pub(super) fn parse_lhs_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_lhs_expr);

        let start = cur_pos!(self);

        // parse jsx
        if self.input.syntax().jsx() {
            fn into_expr(e: Either<JSXFragment, JSXElement>) -> Box<Expr> {
                match e {
                    Either::Left(l) => Box::new(l.into()),
                    Either::Right(r) => Box::new(Box::new(r).into()),
                }
            }
            match *cur!(self, true)? {
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

            if is!(self, '<') && !peeked_is!(self, '!') {
                // In case we encounter an lt token here it will always be the start of
                // jsx as the lt sign is not allowed in places that expect an expression

                // FIXME:
                // self.finishToken(tt.jsxTagStart);

                return self.parse_jsx_element().map(into_expr);
            }
        }

        // `super()` can't be handled from parse_new_expr()
        if eat!(self, "super") {
            let obj = Callee::Super(Super {
                span: span!(self, start),
            });
            return self.parse_subscripts(obj, false, false);
        }
        if eat!(self, "import") {
            let obj = Callee::Import(Import {
                span: span!(self, start),
            });
            return self.parse_subscripts(obj, false, false);
        }

        let callee = self.parse_new_expr()?;
        return_if_arrow!(self, callee);

        let type_args = if self.input.syntax().typescript() && is!(self, '<') {
            self.try_parse_ts(|p| {
                let type_args = p.parse_ts_type_args()?;
                if is!(p, '(') {
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
                expect!(self, '(');
            }
            debug_assert_ne!(
                cur!(self, false).ok(),
                Some(&tok!('(')),
                "parse_new_expr() should eat paren if it exists"
            );
            return Ok(Box::new(Expr::New(NewExpr { type_args, ..ne })));
        }
        // 'CallExpr' rule contains 'MemberExpr (...)',
        // and 'MemberExpr' rule contains 'new MemberExpr (...)'

        if is!(self, '(') {
            // This is parsed using production MemberExpression,
            // which is left-recursive.
            let (callee, is_import) = match &*callee {
                Expr::Ident(Ident {
                    sym: js_word!("import"),
                    span,
                    ..
                }) => (Callee::Import(Import { span: *span }), true),
                _ => (Callee::Expr(callee), false),
            };
            let args = self.parse_args(is_import)?;

            let call_expr = Box::new(Expr::Call(CallExpr {
                span: span!(self, start),

                callee,
                args,
                type_args,
            }));

            return self.parse_subscripts(Callee::Expr(call_expr), false, false);
        }
        if type_args.is_some() {
            // This fails
            expect!(self, '(');
        }

        // This is parsed using production 'NewExpression', which contains
        // 'MemberExpression'
        Ok(callee)
    }

    pub(super) fn parse_expr_or_pat(&mut self) -> PResult<Box<Expr>> {
        self.parse_expr()
    }

    // Returns (args_or_pats, trailing_comma)
    pub(super) fn parse_args_or_pats(&mut self) -> PResult<(Vec<PatOrExprOrSpread>, Option<Span>)> {
        trace_cur!(self, parse_args_or_pats);

        expect!(self, '(');

        let mut items = vec![];
        let mut trailing_comma = None;

        // TODO(kdy1): optimize (once we parsed a pattern, we can parse everything else
        // as a pattern instead of reparsing)
        while !eof!(self) && !is!(self, ')') {
            // https://github.com/swc-project/swc/issues/410
            let is_async = is!(self, "async")
                && matches!(
                    peek!(self),
                    Ok(tok!('(') | tok!("function") | Token::Word(..))
                );

            let start = cur_pos!(self);
            self.state.potential_arrow_start = Some(start);
            let modifier_start = start;

            let has_modifier = self.eat_any_ts_modifier()?;
            let pat_start = cur_pos!(self);

            let mut arg = {
                if self.input.syntax().typescript()
                    && (is!(self, IdentRef) || (is!(self, "...") && peeked_is!(self, IdentRef)))
                {
                    let spread = if eat!(self, "...") {
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

                        if let Ok(&Token::AssignOp(..)) = cur!(self, false) {
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
                if is!(self, '?') {
                    if peeked_is!(self, ',')
                        || peeked_is!(self, ':')
                        || peeked_is!(self, ')')
                        || peeked_is!(self, '=')
                    {
                        assert_and_bump!(self, '?');
                        let _ = cur!(self, false);
                        if arg.spread.is_some() {
                            self.emit_err(self.input.prev_span(), SyntaxError::TS1047);
                        }
                        match *arg.expr {
                            Expr::Ident(..) => {}
                            _ => {
                                syntax_error!(
                                    self,
                                    arg.span(),
                                    SyntaxError::TsBindingPatCannotBeOptional
                                )
                            }
                        }
                        true
                    } else if matches!(arg, ExprOrSpread { spread: None, .. }) {
                        expect!(self, '?');
                        let test = arg.expr;
                        let ctx = Context {
                            in_cond_expr: true,
                            is_direct_child_of_cond: true,
                            include_in_expr: true,
                            ..self.ctx()
                        };
                        let cons = self.with_ctx(ctx).parse_assignment_expr()?;
                        expect!(self, ':');
                        let ctx = Context {
                            in_cond_expr: true,
                            is_direct_child_of_cond: true,
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

            if optional || (self.input.syntax().typescript() && is!(self, ':')) {
                // TODO: `async(...args?: any[]) : any => {}`
                //
                // if self.input.syntax().typescript() && optional && arg.spread.is_some() {
                //     self.emit_err(self.input.prev_span(), SyntaxError::TS1047)
                // }

                let mut pat = self.reparse_expr_as_pat(PatType::BindingPat, arg.expr)?;
                if optional {
                    match pat {
                        Pat::Ident(ref mut i) => i.id.optional = true,
                        _ => unreachable!(),
                    }
                }
                if let Some(span) = arg.spread {
                    pat = Pat::Rest(RestPat {
                        span: span!(self, pat_start),
                        dot3_token: span,
                        arg: Box::new(pat),
                        type_ann: None,
                    });
                }
                match pat {
                    Pat::Ident(BindingIdent {
                        id: Ident { ref mut span, .. },
                        ref mut type_ann,
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
                            *span =
                                Span::new(pat_start, self.input.prev_span().hi, Default::default());
                        }
                        *type_ann = new_type_ann;
                    }
                    Pat::Expr(ref expr) => unreachable!("invalid pattern: Expr({:?})", expr),
                    Pat::Invalid(..) => {
                        // We don't have to panic here.
                        // See: https://github.com/swc-project/swc/issues/1170
                        //
                        // Also, as an exact error is added to the errors while
                        // creating `Invalid`, we don't have to emit a new
                        // error.
                    }
                }

                if eat!(self, '=') {
                    let right = self.parse_assignment_expr()?;
                    pat = Pat::Assign(AssignPat {
                        span: span!(self, pat_start),
                        left: Box::new(pat),
                        right,
                        type_ann: None,
                    });
                }

                if has_modifier {
                    self.emit_err(span!(self, modifier_start), SyntaxError::TS2369);
                }

                items.push(PatOrExprOrSpread::Pat(pat))
            } else {
                if has_modifier {
                    self.emit_err(span!(self, modifier_start), SyntaxError::TS2369);
                }

                items.push(PatOrExprOrSpread::ExprOrSpread(arg));
            }

            // https://github.com/swc-project/swc/issues/433
            if eat!(self, "=>") && {
                debug_assert_eq!(items.len(), 1);
                match items[0] {
                    PatOrExprOrSpread::ExprOrSpread(ExprOrSpread { ref expr, .. })
                    | PatOrExprOrSpread::Pat(Pat::Expr(ref expr)) => {
                        matches!(**expr, Expr::Ident(..))
                    }
                    PatOrExprOrSpread::Pat(Pat::Ident(..)) => true,
                    _ => false,
                }
            } {
                let params: Vec<Pat> = self
                    .parse_paren_items_as_params(items.clone(), None)?
                    .into_iter()
                    .collect();

                let body: BlockStmtOrExpr =
                    self.parse_fn_body(false, false, true, params.is_simple_parameter_list())?;
                let span = span!(self, start);

                items.push(PatOrExprOrSpread::ExprOrSpread(ExprOrSpread {
                    expr: Box::new(
                        ArrowExpr {
                            span,
                            body,
                            is_async,
                            is_generator: false,
                            params,
                            type_params: None,
                            return_type: None,
                        }
                        .into(),
                    ),
                    spread: None,
                }));
            }

            if !is!(self, ')') {
                expect!(self, ',');
                if is!(self, ')') {
                    trailing_comma = Some(self.input.prev_span());
                }
            }
        }

        expect!(self, ')');
        Ok((items, trailing_comma))
    }
}

#[ast_node]
pub(in crate::parser) enum PatOrExprOrSpread {
    #[tag("ExprOrSpread")]
    ExprOrSpread(ExprOrSpread),
    #[tag("*")]
    Pat(Pat),
}

/// simple leaf methods.

impl<'a, I: Tokens> Parser<I> {
    fn parse_yield_expr(&mut self) -> PResult<Box<Expr>> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "yield");
        debug_assert!(self.ctx().in_generator);

        // Spec says
        // YieldExpression cannot be used within the FormalParameters of a generator
        // function because any expressions that are part of FormalParameters are
        // evaluated before the resulting generator object is in a resumable state.
        if self.ctx().in_parameters {
            syntax_error!(self, self.input.prev_span(), SyntaxError::YieldParamInGen)
        }

        if is!(self, ';')
            || (!is!(self, '*') && !cur!(self, false).map(Token::starts_expr).unwrap_or(true))
        {
            Ok(Box::new(Expr::Yield(YieldExpr {
                span: span!(self, start),
                arg: None,
                delegate: false,
            })))
        } else {
            let has_star = eat!(self, '*');
            let arg = self.parse_assignment_expr()?;

            Ok(Box::new(Expr::Yield(YieldExpr {
                span: span!(self, start),
                arg: Some(arg),
                delegate: has_star,
            })))
        }
    }

    fn at_possible_async(&mut self, expr: &Expr) -> PResult<bool> {
        // TODO(kdy1): !this.state.containsEsc &&

        Ok(self.state.potential_arrow_start == Some(expr.span().lo())
            && matches!(
                *expr,
                Expr::Ident(Ident {
                    sym: js_word!("async"),
                    ..
                })
            ))
    }

    /// 12.2.5 Array Initializer
    pub(super) fn parse_lit(&mut self) -> PResult<Lit> {
        let start = cur_pos!(self);

        let v = match cur!(self, true)? {
            Word(Word::Null) => {
                bump!(self);
                let span = span!(self, start);
                Lit::Null(Null { span })
            }
            Word(Word::True) | Word(Word::False) => {
                let value = is!(self, "true");
                bump!(self);
                let span = span!(self, start);

                Lit::Bool(Bool { span, value })
            }
            Token::Str { .. } => match bump!(self) {
                Token::Str { value, raw } => Lit::Str(Str {
                    span: span!(self, start),
                    value,
                    raw: Some(raw),
                }),
                _ => unreachable!(),
            },
            Token::Num { .. } => match bump!(self) {
                Token::Num { value, raw } => Lit::Num(Number {
                    span: span!(self, start),
                    value,
                    raw: Some(raw),
                }),
                _ => unreachable!(),
            },
            Token::BigInt { .. } => match bump!(self) {
                Token::BigInt { value, raw } => Lit::BigInt(BigInt {
                    span: span!(self, start),
                    value,
                    raw: Some(raw),
                }),
                _ => unreachable!(),
            },
            token => unreachable!("parse_lit should not be called for {:?}", token),
        };
        Ok(v)
    }

    pub(super) fn parse_dynamic_import(
        &mut self,
        start: BytePos,
        import_span: Span,
    ) -> PResult<Box<Expr>> {
        let args = self.parse_args(true)?;
        let import = Box::new(Expr::Call(CallExpr {
            span: span!(self, start),
            callee: Callee::Import(Import { span: import_span }),
            args,
            type_args: Default::default(),
        }));

        self.parse_subscripts(Callee::Expr(import), true, false)
    }

    pub(super) fn check_assign_target(&mut self, expr: &Expr, deny_call: bool) {
        if !expr.is_valid_simple_assignment_target(self.ctx().strict) {
            self.emit_err(expr.span(), SyntaxError::TS2406);
        }

        // We follow behavior of tsc
        if self.input.syntax().typescript() && self.syntax().early_errors() {
            let is_eval_or_arguments = match *expr {
                Expr::Ident(ref i) => i.sym == js_word!("eval") || i.sym == js_word!("arguments"),
                _ => false,
            };

            if is_eval_or_arguments {
                self.emit_strict_mode_err(expr.span(), SyntaxError::TS1100);
            }

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
                && should_deny(expr, deny_call)
            {
                self.emit_err(expr.span(), SyntaxError::TS2406);
            }
        }
    }

    fn is_start_of_left_hand_side_expr(&mut self) -> PResult<bool> {
        Ok(is_one_of!(
            self, "this", "super", "null", "true", "false", Num, BigInt, Str, '`', '(', '[', '{',
            "function", "class", "new", Regex, IdentRef
        ) || (is!(self, "import")
            && (peeked_is!(self, '(') || peeked_is!(self, '<') || peeked_is!(self, '.'))))
    }

    pub(super) fn is_start_of_expr(&mut self) -> PResult<bool> {
        Ok(self.is_start_of_left_hand_side_expr()?
            || is_one_of!(
                self, '+', '-', '~', '!', "delete", "typeof", "void", "++", "--", '<', "await",
                "yield"
            )
            || (is!(self, '#') && peeked_is!(self, IdentName)))
    }
}
