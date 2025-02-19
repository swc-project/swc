use super::{context::RawLexerContext, token::RawTokenKind, ByteHandler, RawLexer};
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
    loop {
        match lex.peek_byte() {
            Some(b'`') => {
                if lex.context == RawLexerContext::JsTemplateLiteral {
                    lex.set_context(RawLexerContext::JsTemplateSpanLiteral);
                    return Ok(RawTokenKind::TemplateLiteral);
                }
                lex.consume_byte();

                lex.set_context(RawLexerContext::JsLiteral);

                return Ok(RawTokenKind::BackQuote);
            }
            Some(b'$') if matches!(lex.peek_2_byte(), Some(b'{')) => {
                if lex.context == RawLexerContext::JsTemplateLiteral {
                    lex.set_context(RawLexerContext::JsTemplateSpanLiteral);
                    return Ok(RawTokenKind::TemplateLiteral);
                }
                lex.consume_n_byte(2);

                lex.set_context(RawLexerContext::JsTemplateQuasiLiteral);

                return Ok(RawTokenKind::DollarLBrace);
            }
            _ => {
                lex.consume_byte();
            }
            None => {
                return Ok(RawTokenKind::Eof);
            }
        }
    }
}
