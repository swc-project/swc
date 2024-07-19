use either::Either;
use swc_common::Spanned;

use super::*;

#[cfg(test)]
mod tests;

impl<I: Tokens> Parser<I> {
    /// Parse next token as JSX identifier
    pub(super) fn parse_jsx_ident(&mut self) -> PResult<Ident> {
        debug_assert!(self.input.syntax().jsx());
        trace_cur!(self, parse_jsx_ident);

        let ctx = self.ctx();
        match *cur!(self, true) {
            Token::JSXName { .. } => match bump!(self) {
                Token::JSXName { name } => {
                    let span = self.input.prev_span();
                    Ok(Ident::new_no_ctxt(name, span))
                }
                _ => unreachable!(),
            },
            _ if ctx.in_forced_jsx_context => self.parse_ident_ref(),
            _ => unexpected!(self, "jsx identifier"),
        }
    }

    /// Parse namespaced identifier.
    pub(super) fn parse_jsx_namespaced_name(&mut self) -> PResult<JSXAttrName> {
        debug_assert!(self.input.syntax().jsx());
        trace_cur!(self, parse_jsx_namespaced_name);
        let start = cur_pos!(self);

        let ns = self.parse_jsx_ident()?.into();
        if !eat!(self, ':') {
            return Ok(JSXAttrName::Ident(ns));
        }

        let name = self.parse_jsx_ident().map(IdentName::from)?;
        Ok(JSXAttrName::JSXNamespacedName(JSXNamespacedName {
            span: Span::new(start, name.span.hi),
            ns,
            name,
        }))
    }

    /// Parses element name in any form - namespaced, member or single
    /// identifier.
    pub(super) fn parse_jsx_element_name(&mut self) -> PResult<JSXElementName> {
        debug_assert!(self.input.syntax().jsx());
        trace_cur!(self, parse_jsx_element_name);
        let start = cur_pos!(self);

        let mut node = match self.parse_jsx_namespaced_name()? {
            JSXAttrName::Ident(i) => JSXElementName::Ident(i.into()),
            JSXAttrName::JSXNamespacedName(i) => JSXElementName::JSXNamespacedName(i),
        };
        while eat!(self, '.') {
            let prop = self.parse_jsx_ident().map(IdentName::from)?;
            let new_node = JSXElementName::JSXMemberExpr(JSXMemberExpr {
                span: span!(self, start),
                obj: match node {
                    JSXElementName::Ident(i) => JSXObject::Ident(i),
                    JSXElementName::JSXMemberExpr(i) => JSXObject::JSXMemberExpr(Box::new(i)),
                    _ => unimplemented!("JSXNamespacedName -> JSXObject"),
                },
                prop,
            });
            node = new_node;
        }
        Ok(node)
    }

    /// Parses any type of JSX attribute value.
    ///
    /// TODO(kdy1): Change return type to JSXAttrValue
    pub(super) fn parse_jsx_attr_value(&mut self) -> PResult<JSXAttrValue> {
        debug_assert!(self.input.syntax().jsx());
        trace_cur!(self, parse_jsx_attr_value);

        let start = cur_pos!(self);

        match *cur!(self, true) {
            tok!('{') => {
                let node = self.parse_jsx_expr_container(start)?;

                match node.expr {
                    JSXExpr::JSXEmptyExpr(..) => {
                        syntax_error!(self, span!(self, start), SyntaxError::EmptyJSXAttr)
                    }
                    JSXExpr::Expr(..) => Ok(node.into()),
                }
            }
            Token::Str { .. } => {
                let lit = self.parse_lit()?;
                Ok(JSXAttrValue::Lit(lit))
            }
            Token::JSXTagStart => {
                let expr = self.parse_jsx_element()?;
                match expr {
                    Either::Left(n) => Ok(JSXAttrValue::JSXFragment(n)),
                    Either::Right(n) => Ok(JSXAttrValue::JSXElement(Box::new(n))),
                }
            }

            _ => {
                let span = self.input.cur_span();
                syntax_error!(self, span, SyntaxError::InvalidJSXValue)
            }
        }
    }

    /// JSXEmptyExpression is unique type since it doesn't actually parse
    /// anything, and so it should start at the end of last read token (left
    /// brace) and finish at the beginning of the next one (right brace).
    pub(super) fn parse_jsx_empty_expr(&mut self) -> PResult<JSXEmptyExpr> {
        debug_assert!(self.input.syntax().jsx());
        let start = cur_pos!(self);

        Ok(JSXEmptyExpr {
            span: Span::new(start, start),
        })
    }

    /// Parse JSX spread child
    pub(super) fn parse_jsx_spread_child(&mut self) -> PResult<JSXSpreadChild> {
        debug_assert!(self.input.syntax().jsx());
        let start = cur_pos!(self);
        expect!(self, '{');
        expect!(self, "...");
        let expr = self.parse_expr()?;
        expect!(self, '}');

        Ok(JSXSpreadChild {
            span: span!(self, start),
            expr,
        })
    }

    /// Parses JSX expression enclosed into curly brackets.
    pub(super) fn parse_jsx_expr_container(&mut self, _: BytePos) -> PResult<JSXExprContainer> {
        debug_assert!(self.input.syntax().jsx());

        let start = cur_pos!(self);
        bump!(self);
        let expr = if is!(self, '}') {
            self.parse_jsx_empty_expr().map(JSXExpr::JSXEmptyExpr)?
        } else {
            if is!(self, "...") {
                bump!(self);
            }
            self.parse_expr().map(JSXExpr::Expr)?
        };
        expect!(self, '}');
        Ok(JSXExprContainer {
            span: span!(self, start),
            expr,
        })
    }

    /// Parses following JSX attribute name-value pair.
    pub(super) fn parse_jsx_attr(&mut self) -> PResult<JSXAttrOrSpread> {
        debug_assert!(self.input.syntax().jsx());
        let start = cur_pos!(self);

        let _tracing = debug_tracing!(self, "parse_jsx_attr");

        if eat!(self, '{') {
            let dot3_start = cur_pos!(self);
            expect!(self, "...");
            let dot3_token = span!(self, dot3_start);
            let expr = self.parse_assignment_expr()?;
            expect!(self, '}');
            return Ok(SpreadElement { dot3_token, expr }.into());
        }

        let name = self.parse_jsx_namespaced_name()?;
        let value = if eat!(self, '=') {
            let ctx = Context {
                in_cond_expr: false,
                will_expect_colon_for_cond: false,
                ..self.ctx()
            };

            self.with_ctx(ctx).parse_jsx_attr_value().map(Some)?
        } else {
            None
        };

        Ok(JSXAttr {
            span: span!(self, start),
            name,
            value,
        }
        .into())
    }

    /// Parses JSX opening tag starting after "<".
    pub(super) fn parse_jsx_opening_element_at(
        &mut self,
        start: BytePos,
    ) -> PResult<Either<JSXOpeningFragment, JSXOpeningElement>> {
        debug_assert!(self.input.syntax().jsx());

        if eat!(self, JSXTagEnd) {
            return Ok(Either::Left(JSXOpeningFragment {
                span: span!(self, start),
            }));
        }

        let ctx = Context {
            should_not_lex_lt_or_gt_as_type: false,
            ..self.ctx()
        };
        let name = self.with_ctx(ctx).parse_jsx_element_name()?;
        self.parse_jsx_opening_element_after_name(start, name)
            .map(Either::Right)
    }

    /// `jsxParseOpeningElementAfterName`
    pub(super) fn parse_jsx_opening_element_after_name(
        &mut self,
        start: BytePos,
        name: JSXElementName,
    ) -> PResult<JSXOpeningElement> {
        debug_assert!(self.input.syntax().jsx());

        let type_args = if self.input.syntax().typescript() && is!(self, '<') {
            self.try_parse_ts(|p| p.parse_ts_type_args().map(Some))
        } else {
            None
        };

        let mut attrs = Vec::new();
        while cur!(self, false).is_ok() {
            trace_cur!(self, parse_jsx_opening__attrs_loop);

            if is!(self, '/') || is!(self, JSXTagEnd) {
                break;
            }

            let attr = self.parse_jsx_attr()?;
            attrs.push(attr);
        }
        let self_closing = eat!(self, '/');
        if !eat!(self, JSXTagEnd) & !(self.ctx().in_forced_jsx_context && eat!(self, '>')) {
            unexpected!(self, "> (jsx closing tag)");
        }
        Ok(JSXOpeningElement {
            span: span!(self, start),
            name,
            attrs,
            self_closing,
            type_args,
        })
    }

    /// Parses JSX closing tag starting after "</".
    fn parse_jsx_closing_element_at(
        &mut self,
        start: BytePos,
    ) -> PResult<Either<JSXClosingFragment, JSXClosingElement>> {
        debug_assert!(self.input.syntax().jsx());

        if eat!(self, JSXTagEnd) {
            return Ok(Either::Left(JSXClosingFragment {
                span: span!(self, start),
            }));
        }

        let name = self.parse_jsx_element_name()?;
        expect!(self, JSXTagEnd);
        Ok(Either::Right(JSXClosingElement {
            span: span!(self, start),
            name,
        }))
    }

    /// Parses entire JSX element, including it"s opening tag
    /// (starting after "<"), attributes, contents and closing tag.
    ///
    /// babel: `jsxParseElementAt`
    pub(super) fn parse_jsx_element_at(
        &mut self,
        start_pos: BytePos,
    ) -> PResult<Either<JSXFragment, JSXElement>> {
        debug_assert!(self.input.syntax().jsx());

        let _ = cur!(self, true);
        let start = cur_pos!(self);
        let forced_jsx_context = match bump!(self) {
            tok!('<') => true,
            Token::JSXTagStart => false,
            _ => unreachable!(),
        };

        let ctx = Context {
            in_forced_jsx_context: forced_jsx_context,
            should_not_lex_lt_or_gt_as_type: false,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_with(|p| {
            let _tracing = debug_tracing!(p, "parse_jsx_element");

            let opening_element = p.parse_jsx_opening_element_at(start_pos)?;

            trace_cur!(p, parse_jsx_element__after_opening_element);

            let mut children = Vec::new();
            let mut closing_element = None;

            let self_closing = match opening_element {
                Either::Right(ref el) => el.self_closing,
                _ => false,
            };

            if !self_closing {
                'contents: loop {
                    match *cur!(p, true) {
                        Token::JSXTagStart => {
                            let start = cur_pos!(p);

                            if peeked_is!(p, '/') {
                                bump!(p); // JSXTagStart
                                let _ = cur!(p, true);
                                assert_and_bump!(p, '/');

                                closing_element =
                                    p.parse_jsx_closing_element_at(start).map(Some)?;
                                break 'contents;
                            }

                            children.push(p.parse_jsx_element_at(start).map(|e| match e {
                                Either::Left(e) => JSXElementChild::from(e),
                                Either::Right(e) => JSXElementChild::from(Box::new(e)),
                            })?);
                        }
                        Token::JSXText { .. } => {
                            children.push(p.parse_jsx_text().map(JSXElementChild::from)?)
                        }
                        tok!('{') => {
                            let start = cur_pos!(p);
                            if peeked_is!(p, "...") {
                                children
                                    .push(p.parse_jsx_spread_child().map(JSXElementChild::from)?);
                            } else {
                                children.push(
                                    p.parse_jsx_expr_container(start)
                                        .map(JSXElementChild::from)?,
                                );
                            }
                        }
                        _ => unexpected!(p, "< (jsx tag start), jsx text or {"),
                    }
                }
            }
            let span = span!(p, start);

            Ok(match (opening_element, closing_element) {
                (Either::Left(..), Some(Either::Right(closing))) => {
                    syntax_error!(p, closing.span(), SyntaxError::JSXExpectedClosingTagForLtGt);
                }
                (Either::Right(opening), Some(Either::Left(closing))) => {
                    syntax_error!(
                        p,
                        closing.span(),
                        SyntaxError::JSXExpectedClosingTag {
                            tag: get_qualified_jsx_name(&opening.name)
                        }
                    );
                }
                (Either::Left(opening), Some(Either::Left(closing))) => Either::Left(JSXFragment {
                    span,
                    opening,
                    children,
                    closing,
                }),
                (Either::Right(opening), None) => Either::Right(JSXElement {
                    span,
                    opening,
                    children,
                    closing: None,
                }),
                (Either::Right(opening), Some(Either::Right(closing))) => {
                    if get_qualified_jsx_name(&closing.name)
                        != get_qualified_jsx_name(&opening.name)
                    {
                        syntax_error!(
                            p,
                            closing.span(),
                            SyntaxError::JSXExpectedClosingTag {
                                tag: get_qualified_jsx_name(&opening.name)
                            }
                        );
                    }
                    Either::Right(JSXElement {
                        span,
                        opening,
                        children,
                        closing: Some(closing),
                    })
                }
                _ => unreachable!(),
            })
        })
    }

    /// Parses entire JSX element from current position.
    ///
    /// babel: `jsxParseElement`
    pub(super) fn parse_jsx_element(&mut self) -> PResult<Either<JSXFragment, JSXElement>> {
        trace_cur!(self, parse_jsx_element);

        debug_assert!(self.input.syntax().jsx());
        debug_assert!({ matches!(*cur!(self, true), Token::JSXTagStart | tok!('<')) });

        let start_pos = cur_pos!(self);

        let ctx = Context {
            in_cond_expr: false,
            will_expect_colon_for_cond: false,
            ..self.ctx()
        };

        self.with_ctx(ctx).parse_jsx_element_at(start_pos)
    }

    pub(super) fn parse_jsx_text(&mut self) -> PResult<JSXText> {
        debug_assert!(self.input.syntax().jsx());
        debug_assert!(matches!(cur!(self, false), Ok(&Token::JSXText { .. })));
        let token = bump!(self);
        let span = self.input.prev_span();
        match token {
            Token::JSXText { raw, value } => Ok(JSXText { span, value, raw }),
            _ => unreachable!(),
        }
    }
}

fn get_qualified_jsx_name(name: &JSXElementName) -> JsWord {
    fn get_qualified_obj_name(obj: &JSXObject) -> JsWord {
        match *obj {
            JSXObject::Ident(ref i) => i.sym.clone(),
            JSXObject::JSXMemberExpr(ref member) => format!(
                "{}.{}",
                get_qualified_obj_name(&member.obj),
                member.prop.sym
            )
            .into(),
        }
    }
    match *name {
        JSXElementName::Ident(ref i) => i.sym.clone(),
        JSXElementName::JSXNamespacedName(JSXNamespacedName {
            ref ns, ref name, ..
        }) => format!("{}:{}", ns.sym, name.sym).into(),
        JSXElementName::JSXMemberExpr(JSXMemberExpr {
            ref obj, ref prop, ..
        }) => format!("{}.{}", get_qualified_obj_name(obj), prop.sym).into(),
    }
}
