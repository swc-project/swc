use std::ops::DerefMut;

use either::Either;
use rustc_hash::FxHashMap;
use swc_common::Spanned;

use super::*;
use crate::{
    common::parser::{
        assign_target_or_spread::AssignTargetOrSpread,
        class_and_fn::parse_decorators,
        expr::{
            finish_assignment_expr, parse_args, parse_array_lit, parse_lit, parse_subscripts,
            parse_tpl, parse_yield_expr,
        },
        ident::parse_ident_name,
        is_simple_param_list::IsSimpleParameterList,
        jsx::{parse_jsx_element, parse_jsx_text},
        pat_type::PatType,
        typescript::{
            eat_any_ts_modifier, parse_ts_type_args, parse_ts_type_or_type_predicate_ann,
            parse_ts_type_params, try_parse_ts, try_parse_ts_type_ann, try_parse_ts_type_args,
        },
        unwrap_ts_non_null,
    },
    lexer::TokenContext,
    tok,
};

mod ops;

impl<I: Tokens<TokenAndSpan>> Parser<I> {
    pub fn parse_expr(&mut self) -> PResult<Box<Expr>> {
        ParserTrait::parse_expr(self)
    }

    ///`parseMaybeAssign` (overridden)
    #[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
    pub(super) fn parse_assignment_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_assignment_expr);

        if self.input.syntax().typescript() && is!(self, JSXTagStart) {
            // Note: When the JSX plugin is on, type assertions (`<T> x`) aren't valid
            // syntax.

            let cur_context = self.input.token_context().current();
            debug_assert_eq!(cur_context, Some(TokenContext::JSXOpeningTag));
            // Only time j_oTag is pushed is right after j_expr.
            debug_assert_eq!(
                self.input.token_context().0[self.input.token_context().len() - 2],
                TokenContext::JSXExpr
            );

            let res = try_parse_ts(self, |p| p.parse_assignment_expr_base().map(Some));
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

        self.parse_assignment_expr_base()
    }

    /// Parse an assignment expression. This includes applications of
    /// operators like `+=`.
    ///
    /// `parseMaybeAssign`
    #[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
    fn parse_assignment_expr_base(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_assignment_expr_base);
        let start = self.input.cur_span();

        if self.input.syntax().typescript()
            && (is_one_of!(self, '<', JSXTagStart))
            && (peeked_is!(self, IdentName) || peeked_is!(self, JSXName))
        {
            let ctx = self.ctx() & !Context::WillExpectColonForCond;
            let res = try_parse_ts(self.with_ctx(ctx).deref_mut(), |p| {
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

                let type_parameters = parse_ts_type_params(p, false, true)?;
                let mut arrow = p.parse_assignment_expr_base()?;
                match *arrow {
                    Expr::Arrow(ArrowExpr {
                        ref mut span,
                        ref mut type_params,
                        ..
                    }) => {
                        *span = Span::new(type_parameters.span.lo, span.hi);
                        *type_params = Some(type_parameters);
                    }
                    _ => unexpected!(p, "("),
                }
                Ok(Some(arrow))
            });
            if let Some(res) = res {
                if self.input.syntax().disallow_ambiguous_jsx_like() {
                    self.emit_err(start, SyntaxError::ReservedArrowTypeParam);
                }
                return Ok(res);
            }
        }

        if self.ctx().contains(Context::InGenerator) && is!(self, "yield") {
            return parse_yield_expr(self);
        }

        self.state.potential_arrow_start = match *cur!(self, true) {
            Token::Word(Word::Ident(..)) | tok!('(') | tok!("yield") => Some(cur_pos!(self)),
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

        finish_assignment_expr(self, start, cond)
    }

    /// Spec: 'ConditionalExpression'
    #[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
    fn parse_cond_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_cond_expr);

        let start = cur_pos!(self);

        let test = self.parse_bin_expr()?;
        return_if_arrow!(self, test);

        if eat!(self, '?') {
            let ctx = self.ctx()
                | Context::InCondExpr
                | Context::WillExpectColonForCond
                | Context::IncludeInExpr;
            let cons = self.with_ctx(ctx).parse_assignment_expr()?;
            expect!(self, ':');
            let ctx = (self.ctx() | Context::InCondExpr) & !Context::WillExpectColonForCond;
            let alt = self.with_ctx(ctx).parse_assignment_expr()?;
            let span = Span::new(start, alt.span_hi());
            Ok(CondExpr {
                span,
                test,
                cons,
                alt,
            }
            .into())
        } else {
            Ok(test)
        }
    }

    /// Parse a primary expression or arrow function
    #[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
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
                    return Ok(ThisExpr {
                        span: span!(self, start),
                    }
                    .into());
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
                        if let Some(res) = try_parse_ts(self, |p| {
                            let start = cur_pos!(p);
                            assert_and_bump!(p, "async");
                            p.try_parse_ts_generic_async_arrow_fn(start)
                        }) {
                            return Ok(res.into());
                        }
                    }

                    if can_be_arrow
                        && peeked_is!(self, '(')
                        && !self.input.has_linebreak_between_cur_and_peeked()
                    {
                        expect!(self, "async");
                        let async_span = self.input.prev_span();
                        return self.parse_paren_expr_or_arrow_fn(can_be_arrow, Some(async_span));
                    }
                }

                tok!('[') => {
                    let ctx = self.ctx() & !Context::WillExpectColonForCond;
                    return self.with_ctx(ctx).parse_with(parse_array_lit);
                }

                tok!('{') => {
                    return self.parse_object::<Expr>().map(Box::new);
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
                    return Ok(parse_lit(self)?.into());
                }

                // Regexp
                tok!('/') | tok!("/=") => {
                    bump!(self);

                    self.input.set_next_regexp(Some(start));

                    if let Some(Token::Regex(..)) = self.input.cur() {
                        self.input.set_next_regexp(None);

                        match bump!(self) {
                            Token::Regex(exp, flags) => {
                                let span = span!(self, start);

                                let mut flags_count = flags.chars().fold(
                                    FxHashMap::<char, usize>::default(),
                                    |mut map, flag| {
                                        let key = match flag {
                                            // https://tc39.es/ecma262/#sec-isvalidregularexpressionliteral
                                            'd' | 'g' | 'i' | 'm' | 's' | 'u' | 'v' | 'y' => flag,
                                            _ => '\u{0000}', // special marker for unknown flags
                                        };
                                        map.entry(key).and_modify(|count| *count += 1).or_insert(1);
                                        map
                                    },
                                );

                                if flags_count.remove(&'\u{0000}').is_some() {
                                    self.emit_err(span, SyntaxError::UnknownRegExpFlags);
                                }

                                if let Some((flag, _)) =
                                    flags_count.iter().find(|(_, count)| **count > 1)
                                {
                                    self.emit_err(span, SyntaxError::DuplicatedRegExpFlags(*flag));
                                }

                                return Ok(Lit::Regex(Regex { span, exp, flags }).into());
                            }
                            _ => unreachable!(),
                        }
                    }
                }

                tok!('`') => {
                    let ctx = self.ctx() & !Context::WillExpectColonForCond;

                    // parse template literal
                    return Ok(parse_tpl(self.with_ctx(ctx).deref_mut(), false)?.into());
                }

                tok!('(') => {
                    return self.parse_paren_expr_or_arrow_fn(can_be_arrow, None);
                }

                _ => {}
            }
        }

        let decorators = parse_decorators(self, false)?;

        if is!(self, "class") {
            return self.parse_class_expr(start, decorators);
        }

        if is!(self, "let")
            || (self.input.syntax().typescript() && is_one_of!(self, IdentRef, "await"))
            || is!(self, IdentRef)
        {
            let ctx = self.ctx();
            let id = self.parse_ident(
                !ctx.contains(Context::InGenerator),
                !ctx.contains(Context::InAsync),
            )?;
            if id.is_reserved_in_strict_mode(
                self.ctx().contains(Context::Module) && !self.ctx().contains(Context::InDeclare),
            ) {
                self.emit_strict_mode_err(
                    self.input.prev_span(),
                    SyntaxError::InvalidIdentInStrict(id.sym.clone()),
                );
            }

            if can_be_arrow
                && id.sym == "async"
                && !self.input.had_line_break_before_cur()
                && is!(self, BindingIdent)
            {
                // see https://github.com/tc39/ecma262/issues/2034
                // ```js
                // for(async of
                // for(async of x);
                // for(async of =>{};;);
                // ```
                if ctx.contains(Context::ForLoopInit) && is!(self, "of") && !peeked_is!(self, "=>")
                {
                    // ```spec https://tc39.es/ecma262/#prod-ForInOfStatement
                    // for ( [lookahead ∉ { let, async of }] LeftHandSideExpression[?Yield, ?Await] of AssignmentExpression[+In, ?Yield, ?Await] ) Statement[?Yield, ?Await, ?Return]
                    // [+Await] for await ( [lookahead ≠ let] LeftHandSideExpression[?Yield, ?Await] of AssignmentExpression[+In, ?Yield, ?Await] ) Statement[?Yield, ?Await, ?Return]
                    // ```

                    if !ctx.contains(Context::ForAwaitLoopInit) {
                        self.emit_err(self.input.prev_span(), SyntaxError::TS1106);
                    }

                    return Ok(id.into());
                }

                let ident = self.parse_binding_ident(false)?;
                if self.input.syntax().typescript() && ident.sym == "as" && !is!(self, "=>") {
                    // async as type
                    let type_ann = self.in_type().parse_with(|p| p.parse_ts_type())?;
                    return Ok(TsAsExpr {
                        span: span!(self, start),
                        expr: Box::new(id.into()),
                        type_ann,
                    }
                    .into());
                }

                // async a => body
                let arg = ident.into();
                let params = vec![arg];
                expect!(self, "=>");
                let body =
                    self.parse_fn_body(true, false, true, params.is_simple_parameter_list())?;

                return Ok(ArrowExpr {
                    span: span!(self, start),
                    body,
                    params,
                    is_async: true,
                    is_generator: false,
                    ..Default::default()
                }
                .into());
            } else if can_be_arrow && !self.input.had_line_break_before_cur() && eat!(self, "=>") {
                if self.ctx().contains(Context::Strict) && id.is_reserved_in_strict_bind() {
                    self.emit_strict_mode_err(id.span, SyntaxError::EvalAndArgumentsInStrict)
                }
                let params = vec![id.into()];
                let body =
                    self.parse_fn_body(false, false, true, params.is_simple_parameter_list())?;

                return Ok(ArrowExpr {
                    span: span!(self, start),
                    body,
                    params,
                    is_async: false,
                    is_generator: false,
                    ..Default::default()
                }
                .into());
            } else {
                return Ok(id.into());
            }
        }

        if eat!(self, '#') {
            let id = parse_ident_name(self)?;
            return Ok(PrivateName {
                span: span!(self, start),
                name: id.sym,
            }
            .into());
        }

        syntax_error!(self, self.input.cur_span(), SyntaxError::TS1109)
    }

    #[allow(dead_code)]
    fn parse_member_expr(&mut self) -> PResult<Box<Expr>> {
        self.parse_member_expr_or_new_expr(false)
    }

    /// `is_new_expr`: true iff we are parsing production 'NewExpression'.
    #[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
    fn parse_member_expr_or_new_expr(&mut self, is_new_expr: bool) -> PResult<Box<Expr>> {
        let ctx = self.ctx() | Context::ShouldNotLexLtOrGtAsType;
        self.with_ctx(ctx)
            .parse_member_expr_or_new_expr_inner(is_new_expr)
    }

    fn parse_member_expr_or_new_expr_inner(&mut self, is_new_expr: bool) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_member_expr_or_new_expr);

        let start = cur_pos!(self);
        if eat!(self, "new") {
            if eat!(self, '.') {
                if eat!(self, "target") {
                    let span = span!(self, start);
                    let expr = MetaPropExpr {
                        span,
                        kind: MetaPropKind::NewTarget,
                    }
                    .into();

                    let ctx = self.ctx();
                    if !ctx.contains(Context::InsideNonArrowFunctionScope)
                        && !ctx.contains(Context::InParameters)
                        && !ctx.contains(Context::InClass)
                    {
                        self.emit_err(span, SyntaxError::InvalidNewTarget);
                    }

                    return parse_subscripts(self, Callee::Expr(expr), true, false);
                }

                unexpected!(self, "target")
            }

            // 'NewExpression' allows new call without paren.
            let callee = self.parse_member_expr_or_new_expr(is_new_expr)?;
            return_if_arrow!(self, callee);

            if is_new_expr {
                match *callee {
                    Expr::OptChain(OptChainExpr {
                        span,
                        optional: true,
                        ..
                    }) => {
                        syntax_error!(self, span, SyntaxError::OptChainCannotFollowConstructorCall)
                    }
                    Expr::Member(MemberExpr { ref obj, .. }) => {
                        if let Expr::OptChain(OptChainExpr {
                            span,
                            optional: true,
                            ..
                        }) = **obj
                        {
                            syntax_error!(
                                self,
                                span,
                                SyntaxError::OptChainCannotFollowConstructorCall
                            )
                        }
                    }
                    _ => {}
                }
            }

            let type_args = if self.input.syntax().typescript() && is_one_of!(self, '<', "<<") {
                try_parse_ts(self, |p| {
                    let ctx = p.ctx() & !Context::ShouldNotLexLtOrGtAsType;

                    let args = parse_ts_type_args(p.with_ctx(ctx).deref_mut())?;
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
                let args = parse_args(self, false).map(Some)?;

                let new_expr = Callee::Expr(
                    NewExpr {
                        span: span!(self, start),
                        callee,
                        args,
                        type_args,
                        ..Default::default()
                    }
                    .into(),
                );

                // We should parse subscripts for MemberExpression.
                // Because it's left recursive.
                return parse_subscripts(self, new_expr, true, false);
            }

            // Parsed with 'NewExpression' production.

            return Ok(NewExpr {
                span: span!(self, start),
                callee,
                args: None,
                type_args,
                ..Default::default()
            }
            .into());
        }

        if eat!(self, "super") {
            let base = Callee::Super(Super {
                span: span!(self, start),
            });
            return parse_subscripts(self, base, true, false);
        }
        if eat!(self, "import") {
            return self.parse_dynamic_import_or_import_meta(start, true);
        }
        let obj = self.parse_primary_expr()?;
        return_if_arrow!(self, obj);

        let type_args = if self.syntax().typescript() && is!(self, '<') {
            try_parse_ts_type_args(self)
        } else {
            None
        };
        let obj = if let Some(type_args) = type_args {
            trace_cur!(self, parse_member_expr_or_new_expr__with_type_args);
            TsInstantiation {
                expr: obj,
                type_args,
                span: span!(self, start),
            }
            .into()
        } else {
            obj
        };

        parse_subscripts(self, Callee::Expr(obj), true, false)
    }

    /// Parse `NewExpression`.
    /// This includes `MemberExpression`.
    #[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
    pub(super) fn parse_new_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_new_expr);

        self.parse_member_expr_or_new_expr(true)
    }

    /// Parse paren expression or arrow function expression.
    #[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
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

        let ctx = self.ctx() & !Context::WillExpectColonForCond;

        let (paren_items, trailing_comma) = self
            .with_ctx(ctx)
            .include_in_expr(true)
            .parse_args_or_pats()?;

        let has_pattern = paren_items
            .iter()
            .any(|item| matches!(item, AssignTargetOrSpread::Pat(..)));

        let will_expect_colon_for_cond = self.ctx().contains(Context::WillExpectColonForCond);
        // This is slow path. We handle arrow in conditional expression.
        if self.syntax().typescript() && self.ctx().contains(Context::InCondExpr) && is!(self, ':')
        {
            // TODO: Remove clone
            let items_ref = &paren_items;
            if let Some(expr) = try_parse_ts(self, |p| {
                let return_type = parse_ts_type_or_type_predicate_ann(p, &tok!(':'))?;

                expect!(p, "=>");

                let params: Vec<Pat> = p
                    .parse_paren_items_as_params(items_ref.clone(), trailing_comma)?
                    .into_iter()
                    .collect();

                let body: Box<BlockStmtOrExpr> = p.parse_fn_body(
                    async_span.is_some(),
                    false,
                    true,
                    params.is_simple_parameter_list(),
                )?;

                if will_expect_colon_for_cond && !is!(p, ':') {
                    trace_cur!(p, parse_arrow_in_cond__fail);
                    unexpected!(p, "fail")
                }

                Ok(Some(
                    ArrowExpr {
                        span: span!(p, expr_start),
                        is_async: async_span.is_some(),
                        is_generator: false,
                        params,
                        body,
                        return_type: Some(return_type),
                        ..Default::default()
                    }
                    .into(),
                ))
            }) {
                return Ok(expr);
            }
        }

        let return_type = if !self.ctx().contains(Context::WillExpectColonForCond)
            && self.input.syntax().typescript()
            && is!(self, ':')
        {
            try_parse_ts(self, |p| {
                let return_type = parse_ts_type_or_type_predicate_ann(p, &tok!(':'))?;

                if !is!(p, "=>") {
                    unexpected!(p, "fail")
                }

                Ok(Some(return_type))
            })
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

            let body: Box<BlockStmtOrExpr> = self.parse_fn_body(
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
                ..Default::default()
            };
            if let BlockStmtOrExpr::BlockStmt(..) = &*arrow_expr.body {
                if let Some(&Token::BinOp(..)) = self.input.cur() {
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
            return Ok(arrow_expr.into());
        } else {
            // If there's no arrow function, we have to check there's no
            // AssignProp in lhs to check against assignment in object literals
            // like (a, {b = 1});
            for expr_or_spread in paren_items.iter() {
                if let AssignTargetOrSpread::ExprOrSpread(e) = expr_or_spread {
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
                    AssignTargetOrSpread::ExprOrSpread(e) => Ok(e),
                    _ => syntax_error!(self, item.span(), SyntaxError::InvalidExpr),
                }
            })
            .collect::<Result<Vec<_>, _>>()?;
        if let Some(async_span) = async_span {
            // It's a call expression
            return Ok(CallExpr {
                span: span!(self, async_span.lo()),
                callee: Callee::Expr(Box::new(
                    Ident::new_no_ctxt("async".into(), async_span).into(),
                )),
                args: expr_or_spreads,
                ..Default::default()
            }
            .into());
        }

        // It was not head of arrow function.

        if expr_or_spreads.is_empty() {
            syntax_error!(
                self,
                Span::new(expr_start, last_pos!(self),),
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
            Ok(ParenExpr {
                span: span!(self, expr_start),
                expr,
            }
            .into())
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
            let seq_expr = SeqExpr {
                span: Span::new(
                    exprs.first().unwrap().span_lo(),
                    exprs.last().unwrap().span_hi(),
                ),
                exprs,
            }
            .into();
            Ok(ParenExpr {
                span: span!(self, expr_start),
                expr: seq_expr,
            }
            .into())
        }
    }

    /// Parse call, dot, and `[]`-subscript expressions.
    #[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
    pub(super) fn parse_lhs_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_lhs_expr);

        let start = cur_pos!(self);

        // parse jsx
        if self.input.syntax().jsx() {
            fn into_expr(e: Either<JSXFragment, JSXElement>) -> Box<Expr> {
                match e {
                    Either::Left(l) => l.into(),
                    Either::Right(r) => r.into(),
                }
            }
            match *cur!(self, true) {
                Token::JSXText { .. } => {
                    return parse_jsx_text(self)
                        .map(Lit::JSXText)
                        .map(Expr::Lit)
                        .map(Box::new);
                }
                Token::JSXTagStart => {
                    return parse_jsx_element(self).map(into_expr);
                }
                _ => {}
            }

            if is!(self, '<') && !peeked_is!(self, '!') {
                // In case we encounter an lt token here it will always be the start of
                // jsx as the lt sign is not allowed in places that expect an expression

                // FIXME:
                // self.finishToken(tt.jsxTagStart);

                return parse_jsx_element(self).map(into_expr);
            }
        }

        // `super()` can't be handled from parse_new_expr()
        if eat!(self, "super") {
            let obj = Callee::Super(Super {
                span: span!(self, start),
            });
            return parse_subscripts(self, obj, false, false);
        }
        if eat!(self, "import") {
            return self.parse_dynamic_import_or_import_meta(start, false);
        }

        let callee = self.parse_new_expr()?;
        return_if_arrow!(self, callee);

        let type_args = if self.input.syntax().typescript() && is_one_of!(self, '<', "<<") {
            try_parse_ts(self, |p| {
                let type_args = parse_ts_type_args(p)?;
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
            return Ok(NewExpr { type_args, ..ne }.into());
        }
        // 'CallExpr' rule contains 'MemberExpr (...)',
        // and 'MemberExpr' rule contains 'new MemberExpr (...)'

        if is!(self, '(') {
            // This is parsed using production MemberExpression,
            // which is left-recursive.
            let (callee, is_import) = match callee {
                _ if callee.is_ident_ref_to("import") => (
                    Callee::Import(Import {
                        span: callee.span(),
                        phase: Default::default(),
                    }),
                    true,
                ),
                _ => (Callee::Expr(callee), false),
            };
            let args = parse_args(self, is_import)?;

            let call_expr = match callee {
                Callee::Expr(e) if unwrap_ts_non_null(&e).is_opt_chain() => OptChainExpr {
                    span: span!(self, start),
                    base: Box::new(OptChainBase::Call(OptCall {
                        span: span!(self, start),
                        callee: e,
                        args,
                        type_args,
                        ..Default::default()
                    })),
                    optional: false,
                }
                .into(),
                _ => CallExpr {
                    span: span!(self, start),

                    callee,
                    args,
                    type_args,
                    ..Default::default()
                }
                .into(),
            };

            return parse_subscripts(self, Callee::Expr(call_expr), false, false);
        }
        if type_args.is_some() {
            // This fails
            expect!(self, '(');
        }

        // This is parsed using production 'NewExpression', which contains
        // 'MemberExpression'
        Ok(callee)
    }

    pub(super) fn parse_for_head_prefix(&mut self) -> PResult<Box<Expr>> {
        self.parse_expr()
    }

    // Returns (args_or_pats, trailing_comma)
    #[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
    pub(super) fn parse_args_or_pats(
        &mut self,
    ) -> PResult<(Vec<AssignTargetOrSpread>, Option<Span>)> {
        self.with_ctx(self.ctx() & !Context::WillExpectColonForCond)
            .parse_args_or_pats_inner()
    }

    fn parse_args_or_pats_inner(&mut self) -> PResult<(Vec<AssignTargetOrSpread>, Option<Span>)> {
        trace_cur!(self, parse_args_or_pats);

        expect!(self, '(');

        let mut items = Vec::new();
        let mut trailing_comma = None;

        // TODO(kdy1): optimize (once we parsed a pattern, we can parse everything else
        // as a pattern instead of reparsing)
        while !eof!(self) && !is!(self, ')') {
            // https://github.com/swc-project/swc/issues/410
            let is_async = is!(self, "async")
                && matches!(
                    peek!(self),
                    Some(tok!('(') | tok!("function") | Token::Word(..))
                );

            let start = cur_pos!(self);
            self.state.potential_arrow_start = Some(start);
            let modifier_start = start;

            let has_modifier = eat_any_ts_modifier(self)?;
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
                            expr = finish_assignment_expr(self, start, expr)?
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
                        let ctx = self.ctx()
                            | Context::InCondExpr
                            | Context::WillExpectColonForCond
                            | Context::IncludeInExpr;
                        let cons = self.with_ctx(ctx).parse_assignment_expr()?;
                        expect!(self, ':');
                        let ctx =
                            (self.ctx() | Context::InCondExpr) & !Context::WillExpectColonForCond;
                        let alt = self.with_ctx(ctx).parse_assignment_expr()?;

                        arg = ExprOrSpread {
                            spread: None,
                            expr: CondExpr {
                                span: Span::new(start, alt.span_hi()),

                                test,
                                cons,
                                alt,
                            }
                            .into(),
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
                        Pat::Ident(ref mut i) => i.optional = true,
                        _ => unreachable!(),
                    }
                }
                if let Some(span) = arg.spread {
                    pat = RestPat {
                        span: span!(self, pat_start),
                        dot3_token: span,
                        arg: Box::new(pat),
                        type_ann: None,
                    }
                    .into();
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
                        let new_type_ann = try_parse_ts_type_ann(self)?;
                        if new_type_ann.is_some() {
                            *span = Span::new(pat_start, self.input.prev_span().hi);
                        }
                        *type_ann = new_type_ann;
                    }
                    Pat::Expr(ref expr) => unreachable!("invalid pattern: Expr({:?})", expr),
                    Pat::Assign(..) | Pat::Invalid(..) => {
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
                    pat = AssignPat {
                        span: span!(self, pat_start),
                        left: Box::new(pat),
                        right,
                    }
                    .into();
                }

                if has_modifier {
                    self.emit_err(span!(self, modifier_start), SyntaxError::TS2369);
                }

                items.push(AssignTargetOrSpread::Pat(pat))
            } else {
                if has_modifier {
                    self.emit_err(span!(self, modifier_start), SyntaxError::TS2369);
                }

                items.push(AssignTargetOrSpread::ExprOrSpread(arg));
            }

            // https://github.com/swc-project/swc/issues/433
            if eat!(self, "=>") && {
                debug_assert_eq!(items.len(), 1);
                match items[0] {
                    AssignTargetOrSpread::ExprOrSpread(ExprOrSpread { ref expr, .. })
                    | AssignTargetOrSpread::Pat(Pat::Expr(ref expr)) => {
                        matches!(**expr, Expr::Ident(..))
                    }
                    AssignTargetOrSpread::Pat(Pat::Ident(..)) => true,
                    _ => false,
                }
            } {
                let params: Vec<Pat> = self
                    .parse_paren_items_as_params(items.clone(), None)?
                    .into_iter()
                    .collect();

                let body: Box<BlockStmtOrExpr> =
                    self.parse_fn_body(false, false, true, params.is_simple_parameter_list())?;
                let span = span!(self, start);

                items.push(AssignTargetOrSpread::ExprOrSpread(ExprOrSpread {
                    expr: Box::new(
                        ArrowExpr {
                            span,
                            body,
                            is_async,
                            is_generator: false,
                            params,
                            ..Default::default()
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

/// simple leaf methods.
impl<I: Tokens<TokenAndSpan>> Parser<I> {
    pub(super) fn parse_dynamic_import_or_import_meta(
        &mut self,
        start: BytePos,
        no_call: bool,
    ) -> PResult<Box<Expr>> {
        if eat!(self, '.') {
            self.found_module_item = true;

            let ident = parse_ident_name(self)?;

            match &*ident.sym {
                "meta" => {
                    let span = span!(self, start);
                    if !self.ctx().contains(Context::CanBeModule) {
                        self.emit_err(span, SyntaxError::ImportMetaInScript);
                    }
                    let expr = MetaPropExpr {
                        span,
                        kind: MetaPropKind::ImportMeta,
                    };
                    parse_subscripts(self, Callee::Expr(expr.into()), no_call, false)
                }
                "source" => self.parse_dynamic_import_call(start, no_call, ImportPhase::Source),
                // TODO: The proposal doesn't mention import.defer yet because it was
                // pending on a decision for import.source. Wait to enable it until it's
                // included in the proposal.
                _ => unexpected!(self, "meta"),
            }
        } else {
            self.parse_dynamic_import_call(start, no_call, ImportPhase::Evaluation)
        }
    }

    fn parse_dynamic_import_call(
        &mut self,
        start: BytePos,
        no_call: bool,
        phase: ImportPhase,
    ) -> PResult<Box<Expr>> {
        let import = Callee::Import(Import {
            span: span!(self, start),
            phase,
        });

        parse_subscripts(self, import, no_call, false)
    }
}
