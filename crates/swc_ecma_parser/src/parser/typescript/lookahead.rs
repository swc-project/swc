//! Recognize parameter starts without parsing disposable initializers.

use swc_ecma_ast::PropName;

use crate::{input::Tokens, lexer::Token, parser::TypeContext, PResult, Parser};

#[derive(Clone, Copy, PartialEq, Eq)]
pub(in crate::parser) enum ParameterStart {
    None,
    Pattern,
    Initializer,
}

impl<I: Tokens> Parser<I> {
    pub(in crate::parser) fn probe_parameter_start(&mut self) -> PResult<ParameterStart> {
        let _ = self.eat_any_ts_modifier()?;
        if self.input().is(Token::Void) {
            return Ok(ParameterStart::None);
        }
        self.probe_binding_pattern()
    }

    fn probe_binding_pattern(&mut self) -> PResult<ParameterStart> {
        let close = match self.input().cur() {
            Token::LBrace => Token::RBrace,
            Token::LBracket => Token::RBracket,
            token if token.is_word() => {
                // A type literal such as `{ a: true }` is not a binding pattern.
                // Reject invalid bindings before choosing the signature grammar.
                self.parse_binding_ident(false)?;
                return Ok(ParameterStart::Pattern);
            }
            _ => return Ok(ParameterStart::None),
        };
        self.bump();
        self.do_outside_of_type_context(TypeContext::WillExpectColonForCond, |p| {
            while !p.input().is(close) {
                if close == Token::RBracket && p.input_mut().eat(Token::Comma) {
                    continue;
                }
                let rest = p.input_mut().eat(Token::DotDotDot);
                let item = if close == Token::RBrace && !rest {
                    let key = p.parse_prop_name()?;
                    if p.input_mut().eat(Token::Colon) {
                        p.probe_binding_pattern()?
                    } else if matches!(key, PropName::Ident(..)) {
                        ParameterStart::Pattern
                    } else {
                        return Ok(ParameterStart::None);
                    }
                } else {
                    p.probe_binding_pattern()?
                };
                if item != ParameterStart::Pattern {
                    return Ok(item);
                }
                // The default proves a parameter interpretation. Its expression
                // belongs to committed signature parsing, not this probe.
                if !rest && p.input().is(Token::Eq) {
                    return Ok(ParameterStart::Initializer);
                }
                if rest && !p.input().is(close) {
                    return Ok(ParameterStart::None);
                }
                if !p.input().is(close) && !p.input_mut().eat(Token::Comma) {
                    return Ok(ParameterStart::None);
                }
            }
            p.bump();
            Ok(ParameterStart::Pattern)
        })
    }
}
