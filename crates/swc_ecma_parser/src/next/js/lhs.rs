//! Member and call expression chains.

use swc_atoms::Atom;
use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    CallExpr, Callee, ComputedPropName, Expr, ExprOrSpread, IdentName, MemberExpr, MemberProp,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    /// Parse member, computed member, and call suffixes.
    pub(crate) fn parse_left_hand_side_expression(&mut self) -> Result<Box<Expr>, Error> {
        let mut expression = self.parse_primary_expression()?;

        loop {
            match self.kind() {
                Kind::Dot => {
                    self.advance();
                    let property_token = self.token();
                    if !property_token.kind().is_word() {
                        return Err(self.expected_error(Kind::Ident));
                    }
                    let property = IdentName {
                        span: property_token.span(),
                        sym: Atom::new(self.token_source(property_token)),
                    };
                    self.advance();
                    expression = Box::new(Expr::Member(MemberExpr {
                        span: Span::new_with_checked(expression.span().lo, property.span.hi),
                        obj: expression,
                        prop: MemberProp::Ident(property),
                    }));
                }
                Kind::LBracket => {
                    let bracket_start = self.token().start();
                    self.advance();
                    let property = self.parse_expression()?;
                    if !self.expect(Kind::RBracket) {
                        return Err(self.expected_error(Kind::RBracket));
                    }
                    let end = self.previous_end();
                    expression = Box::new(Expr::Member(MemberExpr {
                        span: Span::new_with_checked(expression.span().lo, end),
                        obj: expression,
                        prop: MemberProp::Computed(ComputedPropName {
                            span: Span::new_with_checked(bracket_start, end),
                            expr: property,
                        }),
                    }));
                }
                Kind::LParen => {
                    let start = expression.span().lo;
                    let arguments = self.parse_arguments()?;
                    expression = Box::new(Expr::Call(CallExpr {
                        span: Span::new_with_checked(start, self.previous_end()),
                        ctxt: SyntaxContext::empty(),
                        callee: Callee::Expr(expression),
                        args: arguments,
                        type_args: None,
                    }));
                }
                _ => break,
            }
        }

        Ok(expression)
    }

    fn parse_arguments(&mut self) -> Result<Vec<ExprOrSpread>, Error> {
        debug_assert!(self.at(Kind::LParen));
        self.advance();
        let mut arguments = Vec::with_capacity(2);

        while !self.at(Kind::RParen) && !self.at(Kind::Eof) {
            let spread = if self.at(Kind::DotDotDot) {
                let span = self.token().span();
                self.advance();
                Some(span)
            } else {
                None
            };
            arguments.push(ExprOrSpread {
                spread,
                expr: self.parse_expression()?,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }

        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        Ok(arguments)
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{Callee, Expr, MemberProp};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn builds_member_and_call_chain() {
        let lexer = Lexer::new("foo.bar[0](value, ...rest)", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let expression = parser.parse_expression().unwrap();

        let Expr::Call(call) = &*expression else {
            panic!("expected call")
        };
        assert_eq!(call.args.len(), 2);
        assert!(call.args[1].spread.is_some());
        let Callee::Expr(callee) = &call.callee else {
            panic!("expected expression callee")
        };
        let Expr::Member(computed) = &**callee else {
            panic!("expected computed member")
        };
        assert!(matches!(computed.prop, MemberProp::Computed(_)));
        let Expr::Member(dotted) = &*computed.obj else {
            panic!("expected dotted member")
        };
        assert!(matches!(&dotted.prop, MemberProp::Ident(name) if name.sym == "bar"));
    }
}
