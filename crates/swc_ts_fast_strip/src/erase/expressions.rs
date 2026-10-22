use super::*;

impl TypeEraser<'_> {
    pub(super) fn check_exponentiation_operand(&mut self, operand: &Expr) {
        // Only erased wrappers are transparent here. Parentheses make a unary
        // expression a valid exponentiation operand and must stop the search.
        let expression = operand.unwrap_with(|expression| match expression {
            Expr::TsAs(assertion) => Some(&assertion.expr),
            Expr::TsSatisfies(assertion) => Some(&assertion.expr),
            Expr::TsConstAssertion(assertion) => Some(&assertion.expr),
            Expr::TsNonNull(assertion) => Some(&assertion.expr),
            Expr::TsInstantiation(instantiation) => Some(&instantiation.expr),
            _ => None,
        });
        if matches!(expression, Expr::Unary(_) | Expr::Await(_)) {
            self.report_unsupported(operand.span(), UnsupportedSyntax::UnaryExponentiation);
        }
    }

    pub(super) fn erase_optional_parameter(&mut self, annotation: Option<&TsTypeAnn>, span: Span) {
        // BindingIdent's span excludes a bare optional marker in SWC's AST.
        let end = annotation.map_or_else(
            || {
                self.tokens
                    .at_or_after(span.hi)
                    .filter(|t| t.token == Token::QuestionMark)
                    .map_or(span.hi, |t| t.span.hi)
            },
            |annotation| annotation.span.lo,
        );
        if let Some(marker) = self.tokens.find_backward(span.lo, end, Token::QuestionMark) {
            self.edits.blank(marker.span);
        }
    }

    pub(super) fn erase_suffix_expression(&mut self, expression: &Expr, wrapper: Span) {
        self.edits
            .blank(Span::new(expression.span_hi(), wrapper.hi));
    }

    pub(super) fn erase_postfix_type_assertion(&mut self, expression: &Expr, wrapper: Span) {
        self.erase_suffix_expression(expression, wrapper);
        let Some(next) = self.tokens.at_or_after(wrapper.hi) else {
            return;
        };
        if next.had_line_break
            && matches!(
                next.token,
                Token::LParen
                    | Token::LBracket
                    | Token::NoSubstitutionTemplateLiteral
                    | Token::TemplateHead
            )
        {
            self.substitute_character(expression.span_hi(), FixedSubstitution::Semicolon);
        }
    }

    pub(super) fn erase_prefix_assertion(&mut self, expression: &Expr, wrapper: Span) {
        self.report_unsupported(wrapper, UnsupportedSyntax::TypeAssertion);
        expression.visit_children_with(self);
    }

    pub(super) fn erase_arrow(&mut self, arrow: &ArrowExpr) {
        self.move_arrow_opening_parenthesis(arrow);
        self.move_arrow_closing_parenthesis(arrow);
        arrow.visit_children_with(self);
    }

    fn move_arrow_opening_parenthesis(&mut self, arrow: &ArrowExpr) {
        let Some(type_parameters) = &arrow.type_params else {
            return;
        };
        let span = type_parameters.span;
        let Some(first) = self.tokens.first_in_range(span.lo, span.hi) else {
            return;
        };
        let restricted_prefix = !first.had_line_break
            && self
                .tokens
                .previous_before(first.span.lo)
                .is_some_and(|t| matches!(t.token, Token::Return | Token::Throw | Token::Yield));
        if !arrow.is_async && !restricted_prefix {
            return;
        }
        let Some(opening) = self
            .tokens
            .find_forward(span.hi, arrow.span.hi, Token::LParen)
        else {
            return;
        };
        if !self.tokens.has_line_terminator(span.lo, opening.span.lo) {
            return;
        }
        self.substitute_character(span.lo, FixedSubstitution::LeftParenthesis);
        self.edits.blank(opening.span);
    }

    fn move_arrow_closing_parenthesis(&mut self, arrow: &ArrowExpr) {
        let Some(return_type) = &arrow.return_type else {
            return;
        };
        let return_span = return_type.span;
        let Some(arrow_token) =
            self.tokens
                .find_forward(return_span.hi, arrow.span.hi, Token::Arrow)
        else {
            return;
        };
        let Some(closing) = self
            .tokens
            .find_backward(arrow.span.lo, return_span.lo, Token::RParen)
        else {
            return;
        };
        if !self
            .tokens
            .has_line_terminator(closing.span.hi, arrow_token.span.lo)
        {
            return;
        }
        let Some(replacement) = self.tokens.trailing_character_span(return_span.hi) else {
            return;
        };
        self.edits.blank(Span::new(closing.span.lo, return_span.hi));
        self.edits
            .substitute(replacement, FixedSubstitution::RightParenthesis);
    }
}
