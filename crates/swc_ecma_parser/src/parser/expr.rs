use swc_ecma_lexer::common::parser::expr::parse_member_expr_or_new_expr;

use super::*;

mod ops;
#[cfg(test)]
mod tests;

use crate::parser::Parser;

impl<I: Tokens> Parser<I> {
    pub fn parse_expr(&mut self) -> PResult<Box<Expr>> {
        ParserTrait::parse_expr(self)
    }

    #[allow(dead_code)]
    fn parse_member_expr(&mut self) -> PResult<Box<Expr>> {
        parse_member_expr_or_new_expr(self, false)
        self.parse_member_expr_or_new_expr(false)
    }

    /// `is_new_expr`: true iff we are parsing production 'NewExpression'.
    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
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
                self.try_parse_ts(|p| {
                    let ctx = p.ctx() & !Context::ShouldNotLexLtOrGtAsType;

                    let args = p.with_ctx(ctx).parse_ts_type_args()?;
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
                return self.parse_subscripts(new_expr, true, false);
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
            return self.parse_subscripts(base, true, false);
        }
        if eat!(self, "import") {
            return self.parse_dynamic_import_or_import_meta(start, true);
        }
        let obj = self.parse_primary_expr()?;
        return_if_arrow!(self, obj);

        let type_args = if self.syntax().typescript() && is!(self, '<') {
            self.try_parse_ts_type_args()
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

        self.parse_subscripts(Callee::Expr(obj), true, false)
    }

    /// Parse `NewExpression`.
    /// This includes `MemberExpression`.
    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    pub(super) fn parse_new_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_new_expr);

        self.parse_member_expr_or_new_expr(true)
    }

    /// Parse `Arguments[Yield, Await]`
    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    pub(super) fn parse_args(&mut self, is_dynamic_import: bool) -> PResult<Vec<ExprOrSpread>> {
        trace_cur!(self, parse_args);

        let ctx = self.ctx() & !Context::WillExpectColonForCond;

        self.with_ctx(ctx).parse_with(|p| {
            let start = cur_pos!(p);
            expect!(p, '(');

            let mut first = true;
            let mut expr_or_spreads = Vec::with_capacity(2);

            while !eof!(p) && !is!(p, ')') {
                if first {
                    first = false;
                } else {
                    expect!(p, ',');
                    // Handle trailing comma.
                    if is!(p, ')') {
                        if is_dynamic_import && !p.input.syntax().import_attributes() {
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
            let spread_span = span!(self, start);
            let spread = Some(spread_span);
            self.include_in_expr(true)
                .parse_assignment_expr()
                .map_err(|err| {
                    Error::new(
                        err.span(),
                        SyntaxError::WithLabel {
                            inner: Box::new(err),
                            span: spread_span,
                            note: "An expression should follow '...'",
                        },
                    )
                })
                .map(|expr| ExprOrSpread { spread, expr })
        } else {
            self.parse_assignment_expr()
                .map(|expr| ExprOrSpread { spread: None, expr })
        }
    }

    /// Parse paren expression or arrow function expression.
    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
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
            if let Some(expr) = self.try_parse_ts(|p| {
                let return_type = p.parse_ts_type_or_type_predicate_ann(&tok!(':'))?;

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
            self.try_parse_ts(|p| {
                let return_type = p.parse_ts_type_or_type_predicate_ann(&tok!(':'))?;

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

    fn parse_tpl_elements(
        &mut self,
        is_tagged_tpl: bool,
    ) -> PResult<(Vec<Box<Expr>>, Vec<TplElement>)> {
        trace_cur!(self, parse_tpl_elements);

        let mut exprs = Vec::new();

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
        type_params: Option<Box<TsTypeParamInstantiation>>,
    ) -> PResult<TaggedTpl> {
        let tagged_tpl_start = tag.span_lo();
        trace_cur!(self, parse_tagged_tpl);

        let tpl = Box::new(self.parse_tpl(true)?);

        let span = span!(self, tagged_tpl_start);

        if tag.is_opt_chain() {
            self.emit_err(span, SyntaxError::TaggedTplInOptChain);
        }

        Ok(TaggedTpl {
            span,
            tag,
            type_params,
            tpl,
            ..Default::default()
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

        let (raw, cooked) = match *cur!(self, true) {
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

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
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
    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn parse_subscript(
        &mut self,
        start: BytePos,
        mut obj: Callee,
        no_call: bool,
        no_computed_member: bool,
    ) -> PResult<(Box<Expr>, bool)> {
        trace_cur!(self, parse_subscript);
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
                            SyntaxError::TsNonNullAssertionNotAllowed("super".into())
                        )
                    }
                    Callee::Import(..) => {
                        syntax_error!(
                            self,
                            self.input.cur_span(),
                            SyntaxError::TsNonNullAssertionNotAllowed("import".into())
                        )
                    }
                    Callee::Expr(expr) => expr,
                };
                return Ok((
                    TsNonNullExpr {
                        span: span!(self, start),
                        expr,
                    }
                    .into(),
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

                let ctx = self.ctx() | Context::ShouldNotLexLtOrGtAsType;
                let result = self.with_ctx(ctx).try_parse_ts(|p| {
                    if !no_call
                        && p.at_possible_async(match &mut_obj_opt {
                            Some(Callee::Expr(ref expr)) => expr,
                            _ => unreachable!(),
                        })?
                    {
                        // Almost certainly this is a generic async function `async <T>() => ...
                        // But it might be a call with a type argument `async<T>();`
                        let async_arrow_fn = p.try_parse_ts_generic_async_arrow_fn(start)?;
                        if let Some(async_arrow_fn) = async_arrow_fn {
                            return Ok(Some((async_arrow_fn.into(), true)));
                        }
                    }

                    let type_args = p.parse_ts_type_args()?;

                    if !no_call && is!(p, '(') {
                        // possibleAsync always false here, because we would have handled it
                        // above. (won't be any undefined arguments)
                        let args = p.parse_args(is_dynamic_import)?;

                        let obj = mut_obj_opt.take().unwrap();

                        if let Callee::Expr(callee) = &obj {
                            if let Expr::OptChain(..) = &**callee {
                                return Ok(Some((
                                    OptChainExpr {
                                        span: span!(p, start),
                                        base: Box::new(OptChainBase::Call(OptCall {
                                            span: span!(p, start),
                                            callee: obj.expect_expr(),
                                            type_args: Some(type_args),
                                            args,
                                            ..Default::default()
                                        })),
                                        optional: false,
                                    }
                                    .into(),
                                    true,
                                )));
                            }
                        }

                        Ok(Some((
                            CallExpr {
                                span: span!(p, start),
                                callee: obj,
                                type_args: Some(type_args),
                                args,
                                ..Default::default()
                            }
                            .into(),
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
                        .map(|expr| (expr.into(), true))
                        .map(Some)
                    } else if is_one_of!(p, '=', "as", "satisfies") {
                        Ok(Some((
                            TsInstantiation {
                                span: span!(p, start),
                                expr: match mut_obj_opt {
                                    Some(Callee::Expr(obj)) => obj.take(),
                                    _ => unreachable!(),
                                },
                                type_args,
                            }
                            .into(),
                            false,
                        )))
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

        if obj.is_import() && !is_one_of!(self, '.', '(') {
            unexpected!(self, "`.` or `(`")
        }

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
            let span = Span::new(obj.span_lo(), self.input.last_pos());
            debug_assert_eq!(obj.span_lo(), span.lo());
            let prop = ComputedPropName {
                span: Span::new(bracket_lo, self.input.last_pos()),
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
                        if !self.ctx().contains(Context::AllowDirectSuper)
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
                            SuperPropExpr {
                                span,
                                obj,
                                prop: SuperProp::Computed(prop),
                            }
                            .into()
                        }
                    }
                    Callee::Expr(obj) => {
                        let is_opt_chain = unwrap_ts_non_null(&obj).is_opt_chain();
                        let expr = MemberExpr {
                            span,
                            obj,
                            prop: MemberProp::Computed(prop),
                        };
                        let expr = if is_opt_chain || question_dot_token.is_some() {
                            OptChainExpr {
                                span,
                                optional: question_dot_token.is_some(),
                                base: Box::new(OptChainBase::Member(expr)),
                            }
                            .into()
                        } else {
                            expr.into()
                        };

                        if let Some(type_args) = type_args {
                            TsInstantiation {
                                expr: Box::new(expr),
                                type_args,
                                span: span!(self, start),
                            }
                            .into()
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
            return if question_dot_token.is_some()
                || match &obj {
                    Callee::Expr(obj) => unwrap_ts_non_null(obj).is_opt_chain(),
                    _ => false,
                } {
                match obj {
                    Callee::Super(_) | Callee::Import(_) => {
                        syntax_error!(self, self.input.cur_span(), SyntaxError::SuperCallOptional)
                    }
                    Callee::Expr(callee) => Ok((
                        OptChainExpr {
                            span,
                            optional: question_dot_token.is_some(),
                            base: Box::new(OptChainBase::Call(OptCall {
                                span: span!(self, start),
                                callee,
                                args,
                                type_args,
                                ..Default::default()
                            })),
                        }
                        .into(),
                        true,
                    )),
                }
            } else {
                Ok((
                    CallExpr {
                        span: span!(self, start),
                        callee: obj,
                        args,
                        ..Default::default()
                    }
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
            let span = span!(self, obj.span_lo());
            debug_assert_eq!(obj.span_lo(), span.lo());
            debug_assert_eq!(prop.span_hi(), span.hi());

            let type_args = if self.syntax().typescript() && is!(self, '<') {
                self.try_parse_ts_type_args()
            } else {
                None
            };

            return Ok((
                Box::new(match obj {
                    callee @ Callee::Import(_) => match prop {
                        MemberProp::Ident(IdentName { sym, .. }) => {
                            if !self.ctx().contains(Context::CanBeModule) {
                                let span = span!(self, start);
                                self.emit_err(span, SyntaxError::ImportMetaInScript);
                            }
                            match &*sym {
                                "meta" => MetaPropExpr {
                                    span,
                                    kind: MetaPropKind::ImportMeta,
                                }
                                .into(),
                                _ => {
                                    let args = self.parse_args(true)?;

                                    CallExpr {
                                        span,
                                        callee,
                                        args,
                                        type_args: None,
                                        ..Default::default()
                                    }
                                    .into()
                                }
                            }
                        }
                        _ => {
                            unexpected!(self, "meta");
                        }
                    },
                    Callee::Super(obj) => {
                        if !self.ctx().contains(Context::AllowDirectSuper)
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
                                MemberProp::Ident(ident) => SuperPropExpr {
                                    span,
                                    obj,
                                    prop: SuperProp::Ident(ident),
                                }
                                .into(),
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
                        let expr = if unwrap_ts_non_null(&expr.obj).is_opt_chain()
                            || question_dot_token.is_some()
                        {
                            OptChainExpr {
                                span: span!(self, start),
                                optional: question_dot_token.is_some(),
                                base: Box::new(OptChainBase::Member(expr)),
                            }
                            .into()
                        } else {
                            expr.into()
                        };
                        if let Some(type_args) = type_args {
                            TsInstantiation {
                                expr: Box::new(expr),
                                type_args,
                                span: span!(self, start),
                            }
                            .into()
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
                    TsInstantiation {
                        expr,
                        type_args,
                        span: span!(self, start),
                    }
                    .into()
                } else {
                    expr
                };

                // MemberExpression[?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
                if is!(self, '`') {
                    let ctx = self.ctx() & !Context::WillExpectColonForCond;

                    let tpl = self.with_ctx(ctx).parse_tagged_tpl(expr, None)?;
                    return Ok((tpl.into(), true));
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
    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
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
            return self.parse_dynamic_import_or_import_meta(start, false);
        }

        let callee = self.parse_new_expr()?;
        return_if_arrow!(self, callee);

        let type_args = if self.input.syntax().typescript() && is_one_of!(self, '<', "<<") {
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
            let args = self.parse_args(is_import)?;

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

    pub(super) fn parse_for_head_prefix(&mut self) -> PResult<Box<Expr>> {
        self.parse_expr()
    }

    // Returns (args_or_pats, trailing_comma)
    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
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
                if arg.spread.is_some() {
                    pat = RestPat {
                        span: span!(self, pat_start),
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
                        let new_type_ann = self.try_parse_ts_type_ann()?;
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
