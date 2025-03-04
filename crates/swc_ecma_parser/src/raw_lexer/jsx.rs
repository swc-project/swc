use super::{
    identifier::is_identifier_start, primary, ByteHandler, RawLexer, RawLexerContext, RawTokenKind,
};
use crate::{lexer::LexResult, EsSyntax, Syntax, TsSyntax};

pub(super) fn handler_for_byte(lex: &mut RawLexer<'_>) -> LexResult<RawTokenKind> {
    match lex.context {
        RawLexerContext::JSXExpr => {
            let mut jsx_text_len = 0;
            while let Some(next_char) = lex.peek_char() {
                match next_char {
                    '<' => {
                        lex.set_context(RawLexerContext::JSXTag);
                        if jsx_text_len == 0 {
                            lex.consume_char();
                            return Ok(RawTokenKind::JsxTagStart);
                        }
                        break;
                    }
                    '{' => {
                        lex.set_context(RawLexerContext::JSXSpan);
                        if jsx_text_len == 0 {
                            lex.consume_char();
                            return Ok(RawTokenKind::LBrace);
                        }
                        break;
                    }
                    _ => {
                        lex.consume_char();
                    }
                }
                jsx_text_len += 1;
            }
            Ok(RawTokenKind::JsxText)
        }
        RawLexerContext::JSXTag => {
            if let Some(ch) = lex.peek_char() {
                match ch {
                    '"' => lex.read_jsx_str('"'),
                    '\'' => lex.read_jsx_str('\''),
                    '/' if lex.peek_2_char() == Some('>') => {
                        lex.set_context(RawLexerContext::JSXSelfClosingTag);

                        Ok(RawTokenKind::DivOp)
                    }
                    '>' => {
                        lex.consume_char();
                        // TODO: ClosingElement
                        if lex.context != RawLexerContext::JSXSelfClosingTag {
                            lex.set_context(Default::default());
                        } else {
                            lex.set_context(RawLexerContext::JSXExpr);
                        }
                        Ok(RawTokenKind::JsxTagEnd)
                    }
                    ch if is_identifier_start(ch) => {
                        let ident = lex.read_identifier_name()?;
                        lex.token.value = Some(super::RawTokenValue::String(ident.into()));
                        Ok(RawTokenKind::JSXName)
                    }
                    _other => {
                        // SAFETY: We know the byte exists because we're in the IDT handler which is
                        // only called when there is a byte
                        let next_byte = lex.peek_byte().unwrap();
                        let handler = primary::handler_from_byte(next_byte);

                        handler(lex)
                    }
                }
            } else {
                Ok(RawTokenKind::Eof)
            }
        }
        _ => unreachable!("Should not parse token in jsx when context is not jsx."),
    }
}

impl RawLexer<'_> {
    fn read_jsx_str(&mut self, terminal: char) -> LexResult<RawTokenKind> {
        // consume terminal
        self.consume_char();
        let start = self.offset();

        loop {
            let next_byte = self.peek_char();
            match next_byte {
                None => break,
                Some(ch) if ch == terminal => {
                    let value = self.str_from_start_to_current(start);
                    self.token.value = Some(super::RawTokenValue::String(value.into()));
                    // consume the last terminal
                    self.consume_char();
                    break;
                }
                _ => {
                    self.consume_char();
                }
            }
        }

        Ok(RawTokenKind::Str)
    }
}
