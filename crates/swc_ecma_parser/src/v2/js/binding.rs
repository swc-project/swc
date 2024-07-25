use swc_common::Span;
use swc_ecma_ast::*;

use crate::v2::{diagnostics, diagnostics::Result, lexer::Kind, Context, ParserImpl};

impl<'a> ParserImpl<'a> {
    /// `BindingElement`
    ///     `SingleNameBinding`
    ///     `BindingPattern`[?Yield, ?Await] `Initializer`[+In, ?Yield,
    /// ?Await]opt
    pub(super) fn parse_binding_pattern_with_initializer(&mut self) -> Result<BindingPattern<'a>> {
        let span = self.start_span();
        let pattern = self.parse_binding_pattern(true)?;
        self.context(Context::In, Context::empty(), |p| {
            p.parse_initializer(span, pattern)
        })
    }

    pub(super) fn parse_binding_pattern(
        &mut self,
        allow_question: bool,
    ) -> Result<BindingPattern<'a>> {
        let mut kind = self.parse_binding_pattern_kind()?;
        let optional = if allow_question && self.ts_enabled() {
            self.eat(Kind::Question)
        } else {
            false
        };
        let type_annotation = self.parse_ts_type_annotation()?;
        if let Some(type_annotation) = &type_annotation {
            Self::extend_binding_pattern_span_end(type_annotation.span, &mut kind);
        }
        Ok(self.ast.binding_pattern(kind, type_annotation, optional))
    }

    pub(crate) fn parse_binding_pattern_kind(&mut self) -> Result<BindingPatternKind<'a>> {
        match self.cur_kind() {
            Kind::LCurly => self.parse_object_binding_pattern(),
            Kind::LBrack => self.parse_array_binding_pattern(),
            _ => self.parse_binding_pattern_identifier(),
        }
    }

    fn parse_binding_pattern_identifier(&mut self) -> Result<BindingPatternKind<'a>> {
        let ident = self.parse_binding_identifier()?;
        Ok(self.ast.binding_pattern_kind_from_binding_identifier(ident))
    }

    /// Section 14.3.3 Object Binding Pattern
    fn parse_object_binding_pattern(&mut self) -> Result<BindingPatternKind<'a>> {
        let span = self.start_span();
        self.expect(Kind::LCurly)?;
        let (list, rest) = self.parse_delimited_list_with_rest(
            Kind::RCurly,
            Self::parse_binding_property,
            Self::parse_rest_binding,
        )?;
        if let Some(rest) = &rest {
            if !matches!(&rest.argument.kind, BindingPatternKind::BindingIdent(_)) {
                return Err(diagnostics::invalid_binding_rest_element(
                    rest.argument.span(),
                ));
            }
        }
        self.expect(Kind::RCurly)?;
        Ok(self.ast.binding_pattern_kind_object_pattern(
            self.end_span(span),
            list,
            rest.map(|r| self.ast.alloc(r)),
        ))
    }

    /// Section 14.3.3 Array Binding Pattern
    fn parse_array_binding_pattern(&mut self) -> Result<BindingPatternKind<'a>> {
        let span = self.start_span();
        self.expect(Kind::LBrack)?;
        let (list, rest) = self.parse_delimited_list_with_rest(
            Kind::RBrack,
            Self::parse_array_binding_element,
            Self::parse_rest_binding,
        )?;
        self.expect(Kind::RBrack)?;
        Ok(self.ast.binding_pattern_kind_array_pattern(
            self.end_span(span),
            list,
            rest.map(|r| self.ast.alloc(r)),
        ))
    }

    fn parse_array_binding_element(&mut self) -> Result<Option<BindingPattern<'a>>> {
        if self.at(Kind::Comma) {
            Ok(None)
        } else {
            self.parse_binding_pattern_with_initializer().map(Some)
        }
    }

    fn parse_rest_binding(&mut self) -> Result<RestPat> {
        // self.eat_decorators()?;
        let elem = self.parse_rest_element()?;
        if self.at(Kind::Comma) {
            if matches!(self.peek_kind(), Kind::RCurly | Kind::RBrack) {
                let span = self.cur_token().span();
                self.bump_any();
                self.error(diagnostics::binding_rest_element_trailing_comma(span));
            }
            if !self.ctx.has_ambient() {
                self.error(diagnostics::binding_rest_element_last(elem.span));
            }
        }
        Ok(elem)
    }

    /// Section 14.3.3 Binding Rest Property
    pub(super) fn parse_rest_element(&mut self) -> Result<RestPat> {
        let span = self.start_span();
        self.bump_any(); // advance `...`
        let init_span = self.start_span();

        let kind = self.parse_binding_pattern_kind()?;
        // Rest element does not allow `?`, checked in checker/typescript.rs
        if self.at(Kind::Question) && self.ts_enabled() {
            let span = self.cur_token().span();
            self.bump_any();
            self.error(diagnostics::a_rest_parameter_cannot_be_optional(span));
        }
        // The span is not extended to its type_annotation
        let type_annotation = self.parse_ts_type_annotation()?;
        let pattern = self.ast.binding_pattern(kind, type_annotation, false);
        // Rest element does not allow `= initializer`
        let argument = self.context(Context::In, Context::empty(), |p| {
            p.parse_initializer(init_span, pattern)
        })?;
        let span = self.end_span(span);

        Ok(RestPat {
            span,
            arg: argument,
        })
    }

    /// `BindingProperty`[Yield, Await] :
    ///     `SingleNameBinding`[?Yield, ?Await]
    ///     `PropertyName`[?Yield, ?Await] : `BindingElement`[?Yield, ?Await]
    pub(super) fn parse_binding_property(&mut self) -> Result<ObjectPatProp> {
        let span = self.start_span();

        let mut shorthand = false;
        let is_binding_identifier = self.cur_kind().is_binding_identifier();
        let (key, computed) = self.parse_property_name()?;

        let value = if is_binding_identifier && !self.at(Kind::Colon) {
            // let { a = b } = c
            // let { a } = b
            //       ^ BindingIdent
            if let PropertyKey::StaticIdent(ident) = &key {
                shorthand = true;
                let identifier = self
                    .ast
                    .binding_pattern_kind_binding_identifier(ident.span, &ident.name);
                let left = self
                    .ast
                    .binding_pattern(identifier, Option::<TsTypeAnn>::None, false);
                self.context(Context::In, Context::empty(), |p| {
                    p.parse_initializer(span, left)
                })?
            } else {
                return Err(self.unexpected());
            }
        } else {
            // let { a: b } = c
            //       ^ IdentReference
            self.expect(Kind::Colon)?;
            self.parse_binding_pattern_with_initializer()?
        };

        Ok(self
            .ast
            .binding_property(self.end_span(span), key, value, shorthand, computed))
    }

    /// Initializer[In, Yield, Await] :
    ///   = `AssignExpression`[?In, ?Yield, ?Await]
    fn parse_initializer(
        &mut self,
        span: Span,
        left: BindingPattern<'a>,
    ) -> Result<BindingPattern<'a>> {
        if self.eat(Kind::Eq) {
            let expr = self.parse_assignment_expression_or_higher()?;
            Ok(self.ast.binding_pattern(
                self.ast
                    .binding_pattern_kind_assignment_pattern(self.end_span(span), left, expr),
                Option::<TsTypeAnn>::None,
                false,
            ))
        } else {
            Ok(left)
        }
    }

    pub(super) fn extend_binding_pattern_span_end(span: Span, kind: &mut BindingPatternKind<'a>) {
        let pat_span = match kind {
            BindingPatternKind::BindingIdent(pat) => &mut pat.span,
            BindingPatternKind::ObjectPattern(pat) => &mut pat.span,
            BindingPatternKind::ArrayPattern(pat) => &mut pat.span,
            BindingPatternKind::AssignPattern(pat) => &mut pat.span,
        };
        pat_span.hi = span.hi;
    }
}
