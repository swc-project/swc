use std::ops::Sub;

use super::{
    context::RawLexerContext, string, token::RawTokenKind, unicode::LF, RawLexResult, RawLexer,
    RawTokenValue,
};
use crate::lexer::LexResult;

/// TemplateHead ::
///   ` TemplateCharacters ${
///
/// TemplateMiddle ::
///   } TemplateCharacters ${
///
/// TemplateTail ::
///   } TemplateCharacters `
///
/// TemplateCharacters ::
///   TemplateCharacter TemplateCharacters
///
/// TemplateCharacter ::
///   $ [lookahead ≠ {]
///   \ TemplateEscapeSequence
///   \ NotEscapeSequence
///   LineContinuation
///   LineTerminatorSequence
///   SourceCharacter but not one of ` or \ or $ or LineTerminator

pub(super) fn handler_for_byte(lex: &mut RawLexer<'_>) -> LexResult<RawTokenKind> {
    match lex.peek_byte() {
        Some(b'`') => {
            if matches!(lex.context, RawLexerContext::JsTemplateLiteral) {
                lex.token.value = Some(RawTokenValue::String("".into()));
                lex.set_context(RawLexerContext::JsTemplateSpanLiteral);
                return Ok(RawTokenKind::TemplateLiteral);
            }

            lex.consume_byte();
            lex.set_context(RawLexerContext::JsLiteral);
            return Ok(RawTokenKind::BackQuote);
        }
        Some(b'$') if matches!(lex.peek_2_byte(), Some(b'{')) => {
            if matches!(lex.context, RawLexerContext::JsTemplateLiteral) {
                lex.token.value = Some(RawTokenValue::String("".into()));
                lex.set_context(RawLexerContext::JsTemplateSpanLiteral);
                return Ok(RawTokenKind::TemplateLiteral);
            }

            lex.consume_n_byte(2);
            lex.set_context(RawLexerContext::JsTemplateQuasiLiteral);
            return Ok(RawTokenKind::DollarLBrace);
        }
        Some(_) => {
            lex.token.value = Some(match lex.read_template_characters() {
                Ok(characters) => RawTokenValue::String(characters.into()),
                Err(e) => RawTokenValue::Err(e),
            });
            lex.set_context(RawLexerContext::JsTemplateSpanLiteral);

            return Ok(RawTokenKind::TemplateLiteral);
        }
        None => return Ok(RawTokenKind::Eof),
    }
}

impl RawLexer<'_> {
    /// ```text
    /// TemplateCharacters ::
    ///     TemplateCharacter TemplateCharacters
    ///
    /// TemplateCharacter ::
    /// $ [lookahead ≠ {]
    ///     \ TemplateEscapeSequence
    ///     \ NotEscapeSequence
    ///     LineContinuation
    ///     LineTerminatorSequence
    ///     SourceCharacter but not one of ` or \ or $ or LineTerminator
    /// ```
    fn read_template_characters(&mut self) -> RawLexResult<String> {
        let mut builder = String::new();

        loop {
            match self.peek_char() {
                Some('$') if matches!(self.peek_2_char(), Some('{')) => {
                    break;
                }
                None | Some('`') => {
                    break;
                }
                Some('\\') => {
                    // consume '\' char
                    self.consume_char();

                    match self.escape_sequence(&mut builder) {
                        Ok(r) => r,
                        Err(e) => {
                            // consume char until ` or ${
                            self.consume_until_template_end();
                            return Err(e);
                        }
                    };
                }
                Some(other) => {
                    // consume this char;
                    self.consume_char();
                    builder.push(other);
                }
            }
        }

        Ok(builder)
    }

    fn consume_until_template_end(&mut self) {
        while let Some(next) = self.peek_byte() {
            match next {
                b'`' => break,
                b'$' if self.peek_2_byte() == Some(b'{') => break,
                _ => {
                    self.consume_byte();
                }
            };
        }
    }
}
