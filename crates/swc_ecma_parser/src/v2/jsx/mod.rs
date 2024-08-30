//! [JSX](https://facebook.github.io/jsx)

#![allow(clippy::missing_errors_doc)]

use swc_ecma_ast::*;

use crate::v2::{diagnostics, diagnostics::Result, lexer::Kind, Context, ParserImpl};

impl<'a> ParserImpl<'a> {
    pub(crate) fn parse_jsx_expression(&mut self) -> Result<Box<Expr>> {
        if self.peek_at(Kind::RAngle) {
            self.parse_jsx_fragment(false)
                .map(|fragment| Box::new(Expr::JSXFragment(Box::new(fragment))))
        } else {
            self.parse_jsx_element(false)
                .map(|element| Box::new(Expr::JSXElement(Box::new(element))))
        }
    }

    /// `JSXFragment` :
    ///   < > `JSXChildren_opt` < / >
    fn parse_jsx_fragment(&mut self, in_jsx_child: bool) -> Result<JSXFragment<'a>> {
        let span = self.start_span();
        let opening_fragment = self.parse_jsx_opening_fragment(span)?;
        let children = self.parse_jsx_children()?;
        let closing_fragment = self.parse_jsx_closing_fragment(in_jsx_child)?;
        Ok(JSXFragment {
            span: self.end_span(span),
            opening: opening_fragment,
            closing: closing_fragment,
            children,
        })
    }

    /// <>
    fn parse_jsx_opening_fragment(&mut self, span: Span) -> Result<JSXOpeningFragment> {
        self.expect(Kind::LAngle)?;
        self.expect_jsx_child(Kind::RAngle)?;
        Ok(JSXOpeningFragment {
            span: self.end_span(span),
        })
    }

    /// </>
    fn parse_jsx_closing_fragment(&mut self, in_jsx_child: bool) -> Result<JSXClosingFragment> {
        let span = self.start_span();
        self.expect(Kind::LAngle)?;
        self.expect(Kind::Slash)?;
        if in_jsx_child {
            self.expect_jsx_child(Kind::RAngle)?;
        } else {
            self.expect(Kind::RAngle)?;
        }
        Ok(JSXClosingFragment {
            span: self.end_span(span),
        })
    }

    /// `JSXElement` :
    ///   `JSXSelfClosingElement`
    ///   `JSXOpeningElement` `JSXChildren_opt` `JSXClosingElement`
    /// `in_jsx_child`:
    ///     used for telling `JSXClosingElement` to parse the next jsx child or
    /// not     true when inside jsx element, false when at top level
    /// expression
    fn parse_jsx_element(&mut self, in_jsx_child: bool) -> Result<JSXElement<'a>> {
        let span = self.start_span();
        let opening_element = self.parse_jsx_opening_element(span, in_jsx_child)?;
        let children = if opening_element.self_closing {
            vec![]
        } else {
            self.parse_jsx_children()?
        };
        let closing_element = if opening_element.self_closing {
            None
        } else {
            let closing_element = self.parse_jsx_closing_element(in_jsx_child)?;
            if !Self::jsx_element_name_eq(&opening_element.name, &closing_element.name) {
                self.error(diagnostics::jsx_element_no_match(
                    opening_element.name.span(),
                    closing_element.name.span(),
                    opening_element.name.span().source_text(self.source_text),
                ));
            }
            Some(closing_element)
        };
        Ok(JSXElement {
            span: self.end_span(span),
            opening: opening_element,
            closing: closing_element,
            children,
        })
    }

    /// `JSXOpeningElement` :
    /// < `JSXElementName` `JSXAttributes_opt` >
    fn parse_jsx_opening_element(
        &mut self,
        span: Span,
        in_jsx_child: bool,
    ) -> Result<JSXOpeningElement<'a>> {
        self.expect(Kind::LAngle)?;
        let name = self.parse_jsx_element_name()?;
        // <Component<TsType> for tsx
        let type_args = if self.ts_enabled() {
            self.try_parse_type_arguments()?
        } else {
            None
        };
        let attrs = self.parse_jsx_attributes()?;
        let self_closing = self.eat(Kind::Slash);
        if !self_closing || in_jsx_child {
            self.expect_jsx_child(Kind::RAngle)?;
        } else {
            self.expect(Kind::RAngle)?;
        }
        Ok(JSXOpeningElement {
            span: self.end_span(span),
            name,
            attrs,
            self_closing,
            type_args,
        })
    }

    fn parse_jsx_closing_element(&mut self, in_jsx_child: bool) -> Result<JSXClosingElement<'a>> {
        let span = self.start_span();
        self.expect(Kind::LAngle)?;
        self.expect(Kind::Slash)?;
        let name = self.parse_jsx_element_name()?;
        if in_jsx_child {
            self.expect_jsx_child(Kind::RAngle)?;
        } else {
            self.expect(Kind::RAngle)?;
        }
        Ok(JSXClosingElement {
            span: self.end_span(span),
            name,
        })
    }

    /// `JSXElementName` :
    ///   `JSXIdent`
    ///   `JSXNamespacedName`
    ///   `JSXMemberExpression`
    fn parse_jsx_element_name(&mut self) -> Result<JSXElementName<'a>> {
        let span = self.start_span();
        let identifier = self.parse_jsx_identifier()?;

        // <namespace:property />
        if self.eat(Kind::Colon) {
            let property = self.parse_jsx_identifier()?;
            return Ok(JSXElementName::NamespacedName(JSXNamespacedName {
                span: self.end_span(span),
                ns: identifier,
                name: property,
            }));
        }

        // <member.foo.bar />
        if self.at(Kind::Dot) {
            return self
                .parse_jsx_member_expression(span, identifier)
                .map(JSXElementName::MemberExpr);
        }

        Ok(JSXElementName::Ident(identifier))
    }

    /// `JSXMemberExpression` :
    /// `JSXIdent` . `JSXIdent`
    /// `JSXMemberExpression` . `JSXIdent`
    fn parse_jsx_member_expression(
        &mut self,
        span: Span,
        object: JSXIdent<'a>,
    ) -> Result<JSXMemberExpr> {
        let mut span = span;
        let mut object = JSXMemberExprObject::Ident(object);
        let mut property = None;

        while self.eat(Kind::Dot) && !self.at(Kind::Eof) {
            // <foo.bar.baz>
            if let Some(prop) = property {
                object = JSXMemberExprObject::MemberExpr(Box::new(JSXMemberExpr {
                    span,
                    obj: object,
                    prop,
                }));
            }

            // <foo.bar>
            property = Some(self.parse_jsx_identifier()?);
            span = self.end_span(span);
        }

        if let Some(property) = property {
            return Ok(JSXMemberExpr {
                span: self.end_span(span),
                obj: object,
                prop: property,
            });
        }

        Err(self.unexpected())
    }

    /// `JSXChildren` :
    ///   `JSXChild` `JSXChildren_opt`
    fn parse_jsx_children(&mut self) -> Result<Vec<JSXChild<'a>>> {
        let mut children = vec![];
        while !self.at(Kind::Eof) {
            if let Some(child) = self.parse_jsx_child()? {
                children.push(child);
            } else {
                break;
            }
        }
        Ok(children)
    }

    /// `JSXChild` :
    ///   `JSXText`
    ///   `JSXElement`
    ///   `JSXFragment`
    ///   { `JSXChildExpression_opt` }
    fn parse_jsx_child(&mut self) -> Result<Option<JSXChild<'a>>> {
        match self.cur_kind() {
            // </ close fragment
            Kind::LAngle if self.peek_at(Kind::Slash) => Ok(None),
            // <> open fragment
            Kind::LAngle if self.peek_at(Kind::RAngle) => self
                .parse_jsx_fragment(true)
                .map(|fragment| Some(JSXChild::Fragment(Box::new(fragment)))),
            // <ident open element
            Kind::LAngle if self.peek_at(Kind::Ident) || self.peek_kind().is_all_keyword() => self
                .parse_jsx_element(true)
                .map(|element| Some(JSXChild::Element(Box::new(element)))),
            // {...expr}
            Kind::LCurly if self.peek_at(Kind::Dot3) => self
                .parse_jsx_spread_child()
                .map(|spread| Some(JSXChild::SpreadChild(Box::new(spread)))),
            // {expr}
            Kind::LCurly => {
                self.parse_jsx_expression_container(/* is_jsx_child */ true)
                    .map(|container| Some(JSXChild::ExprContainer(Box::new(container))))
            }
            // text
            Kind::JSXText => Ok(Some(JSXChild::Text(self.parse_jsx_text()))),
            _ => Err(self.unexpected()),
        }
    }

    ///   { `JSXChildExpression_opt` }
    fn parse_jsx_expression_container(
        &mut self,
        in_jsx_child: bool,
    ) -> Result<JSXExprContainer<'a>> {
        let span = self.start_span();
        self.bump_any(); // bump `{`

        let expr = if self.at(Kind::RCurly) {
            if in_jsx_child {
                self.expect_jsx_child(Kind::RCurly)
            } else {
                self.expect(Kind::RCurly)
            }?;
            let span = self.end_span(span);
            // Handle comment between curly braces (ex. `{/* comment */}`)
            //                                            ^^^^^^^^^^^^^ span
            let expr = JSXEmptyExpr {
                span: Span::new(span.lo + 1, span.hi - 1),
            };
            JSXExpr::JSXEmptyExpr(expr)
        } else {
            let expr = self.parse_jsx_assignment_expression().map(JSXExpr::Expr)?;
            if in_jsx_child {
                self.expect_jsx_child(Kind::RCurly)
            } else {
                self.expect(Kind::RCurly)
            }?;
            expr
        };

        Ok(JSXExprContainer {
            span: self.end_span(span),
            expr,
        })
    }

    fn parse_jsx_assignment_expression(&mut self) -> Result<Box<Expr>> {
        self.context(
            Context::default().and_await(self.ctx.has_await()),
            self.ctx,
            |p| {
                let expr = p.parse_expr();
                if let Ok(Expr::Seq(seq)) = &expr {
                    return Err(diagnostics::jsx_expressions_may_not_use_the_comma_operator(
                        seq.span,
                    ));
                }
                expr
            },
        )
    }

    /// `JSXChildExpression` :
    ///   { ... `AssignExpression` }
    fn parse_jsx_spread_child(&mut self) -> Result<JSXSpreadChild<'a>> {
        let span = self.start_span();
        self.bump_any(); // bump `{`
        self.expect(Kind::Dot3)?;
        let expr = self.parse_jsx_assignment_expression()?;
        self.expect_jsx_child(Kind::RCurly)?;
        Ok(JSXSpreadChild {
            span: self.end_span(span),
            expr,
        })
    }

    /// `JSXAttributes` :
    ///   `JSXSpreadAttribute` `JSXAttributes_opt`
    ///   `JSXAttribute` `JSXAttributes_opt`
    fn parse_jsx_attributes(&mut self) -> Result<Vec<JSXAttrOrSpread<'a>>> {
        let mut attributes = vec![];
        while !matches!(
            self.cur_kind(),
            Kind::Eof | Kind::LAngle | Kind::RAngle | Kind::Slash
        ) {
            let attribute = match self.cur_kind() {
                Kind::LCurly => self
                    .parse_jsx_spread_attribute()
                    .map(JSXAttrOrSpread::SpreadAttr),
                _ => self.parse_jsx_attribute().map(JSXAttrOrSpread::JSXAttr),
            }?;
            attributes.push(attribute);
        }
        Ok(attributes)
    }

    /// `JSXAttribute` :
    ///   `JSXAttributeName` `JSXAttributeInitializer_opt`
    fn parse_jsx_attribute(&mut self) -> Result<JSXAttr<'a>> {
        let span = self.start_span();
        let name = self.parse_jsx_attribute_name()?;
        let value = if self.at(Kind::Eq) {
            self.expect_jsx_attribute_value(Kind::Eq)?;
            Some(self.parse_jsx_attribute_value()?)
        } else {
            None
        };
        Ok(JSXAttr {
            span: self.end_span(span),
            name,
            value,
        })
    }

    /// `JSXSpreadAttribute` :
    ///   { ... `AssignExpression` }
    fn parse_jsx_spread_attribute(&mut self) -> Result<SpreadElement<'a>> {
        let span = self.start_span();
        self.bump_any(); // bump `{`
        self.expect(Kind::Dot3)?;
        let argument = self.parse_jsx_assignment_expression()?;
        self.expect(Kind::RCurly)?;
        Ok(SpreadElement {
            span: self.end_span(span),
            expr: argument,
        })
    }

    /// `JSXAttributeName` :
    ///   `JSXIdent`
    ///   `JSXNamespacedName`
    fn parse_jsx_attribute_name(&mut self) -> Result<JSXAttrName<'a>> {
        let span = self.start_span();
        let identifier = self.parse_jsx_identifier()?;

        if self.eat(Kind::Colon) {
            let property = self.parse_jsx_identifier()?;
            return Ok(JSXAttrName::JSXNamespacedName(JSXNamespacedName {
                span: self.end_span(span),
                ns: identifier,
                name: property,
            }));
        }

        Ok(JSXAttrName::Ident(identifier))
    }

    fn parse_jsx_attribute_value(&mut self) -> Result<JSXAttributeValue<'a>> {
        match self.cur_kind() {
            Kind::Str => self
                .parse_literal_string()
                .map(|str_lit| JSXAttributeValue::Str(str_lit)),
            Kind::LCurly => {
                let expr = self.parse_jsx_expression_container(/* is_jsx_child */ false)?;
                Ok(JSXAttributeValue::ExpressionContainer(expr))
            }
            Kind::LAngle => {
                if self.peek_at(Kind::RAngle) {
                    self.parse_jsx_fragment(false)
                        .map(JSXAttributeValue::Fragment)
                } else {
                    self.parse_jsx_element(false)
                        .map(JSXAttributeValue::Element)
                }
            }
            _ => Err(self.unexpected()),
        }
    }

    /// `JSXIdent` :
    ///   `IdentStart`
    ///   `JSXIdent` `IdentPart`
    ///   `JSXIdent` [no `WhiteSpace` or Comment here] -
    fn parse_jsx_identifier(&mut self) -> Result<JSXIdent<'a>> {
        let span = self.start_span();
        if !self.at(Kind::Ident) && !self.cur_kind().is_all_keyword() {
            return Err(self.unexpected());
        }
        // Currently at a valid normal Ident or Keyword, keep on lexing for `-` in
        // `<component-name />`
        self.continue_lex_jsx_identifier();
        self.bump_any();
        let span = self.end_span(span);
        let name = span.source_text(self.source_text);
        Ok(self.ast.jsx_identifier(span, name))
    }

    fn parse_jsx_text(&mut self) -> Box<JSXText<'a>> {
        let span = self.start_span();
        let value = Atom::from(self.cur_string());
        self.bump_any();
        self.ast.alloc_jsx_text(self.end_span(span), value)
    }

    fn jsx_element_name_eq(lhs: &JSXElementName<'a>, rhs: &JSXElementName<'a>) -> bool {
        match (lhs, rhs) {
            (JSXElementName::Ident(lhs), JSXElementName::Ident(rhs)) => lhs.name == rhs.name,
            (JSXElementName::NamespacedName(lhs), JSXElementName::NamespacedName(rhs)) => {
                lhs.namespace.name == rhs.namespace.name && lhs.property.name == rhs.property.name
            }
            (JSXElementName::Member(lhs), JSXElementName::Member(rhs)) => {
                Self::jsx_member_expression_eq(lhs, rhs)
            }
            _ => false,
        }
    }

    fn jsx_member_expression_eq(lhs: &JSXMemberExpr, rhs: &JSXMemberExpr) -> bool {
        if lhs.property.name != rhs.property.name {
            return false;
        }
        match (&lhs.object, &rhs.object) {
            (JSXMemberExpressionObject::Ident(lhs), JSXMemberExpressionObject::Ident(rhs)) => {
                lhs.name == rhs.name
            }
            (JSXMemberExpressionObject::Member(lhs), JSXMemberExpressionObject::Member(rhs)) => {
                Self::jsx_member_expression_eq(lhs, rhs)
            }
            _ => false,
        }
    }
}
