//! Template literal parsing with parser-directed substitution-tail re-lexing.

use std::{iter::Peekable, str::Chars};

use swc_atoms::{
    wtf8::{CodePoint, Wtf8Buf},
    Atom, Wtf8Atom,
};
use swc_common::{BytePos, Span};
use swc_ecma_ast::{Tpl, TplElement};

use crate::{
    error::{Error, SyntaxError},
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    /// Parse an untagged or tagged template literal directly into the SWC AST.
    pub(crate) fn parse_template_literal(&mut self, tagged: bool) -> Result<Tpl, Error> {
        let start = self.token().start();
        if self.at(Kind::NoSubstitutionTemplateLiteral) {
            let token = self.token();
            let source = self.token_source(token);
            let raw = &source[1..source.len() - 1];
            let quasi = template_element(token, raw, BytePos(1), BytePos(1), true, tagged)?;
            self.advance();
            return Ok(Tpl {
                span: token.span(),
                exprs: Vec::new(),
                quasis: vec![quasi],
            });
        }

        debug_assert!(self.at(Kind::TemplateHead));
        let head = self.token();
        let head_source = self.token_source(head);
        let head_raw = &head_source[1..head_source.len() - 2];
        let mut quasis = Vec::with_capacity(2);
        quasis.push(template_element(
            head,
            head_raw,
            BytePos(1),
            BytePos(2),
            false,
            tagged,
        )?);
        self.advance();

        let mut expressions = Vec::with_capacity(2);
        loop {
            expressions.push(self.parse_expression()?);
            if !self.at(Kind::RBrace) {
                return Err(self.expected_error(Kind::RBrace));
            }
            let token = self.re_lex_template_substitution_tail();
            let tail = match token.kind() {
                Kind::TemplateMiddle => false,
                Kind::TemplateTail => true,
                Kind::Error => return Err(Error::new(token.span(), SyntaxError::UnterminatedTpl)),
                _ => return Err(self.expected_error(Kind::TemplateTail)),
            };
            let source = self.token_source(token);
            let suffix_len = if tail { 1 } else { 2 };
            let raw = &source[1..source.len() - suffix_len];
            quasis.push(template_element(
                token,
                raw,
                BytePos(1),
                BytePos(suffix_len as u32),
                tail,
                tagged,
            )?);
            let end = token.end();
            self.advance();
            if tail {
                return Ok(Tpl {
                    span: Span::new_with_checked(start, end),
                    exprs: expressions,
                    quasis,
                });
            }
        }
    }
}

pub(crate) fn template_element(
    token: crate::next::lexer::PackedToken,
    raw: &str,
    leading: BytePos,
    trailing: BytePos,
    tail: bool,
    tagged: bool,
) -> Result<TplElement, Error> {
    let span = Span::new_with_checked(token.start() + leading, token.end() - trailing);
    let cooked = match decode_template(raw) {
        Ok(value) => Some(value),
        Err(_) if tagged => None,
        Err(error) => return Err(Error::new(span, error)),
    };
    Ok(TplElement {
        span,
        tail,
        cooked,
        raw: Atom::new(raw),
    })
}

fn decode_template(raw: &str) -> Result<Wtf8Atom, SyntaxError> {
    let mut output = Wtf8Buf::with_capacity(raw.len());
    let mut chars = raw.chars().peekable();
    while let Some(character) = chars.next() {
        match character {
            '\\' => decode_escape(&mut chars, &mut output)?,
            '\r' => {
                if chars.peek() == Some(&'\n') {
                    chars.next();
                }
                output.push_char('\n');
            }
            other => output.push_char(other),
        }
    }
    Ok(Wtf8Atom::new(output))
}

fn decode_escape(chars: &mut Peekable<Chars<'_>>, output: &mut Wtf8Buf) -> Result<(), SyntaxError> {
    let Some(escaped) = chars.next() else {
        return Err(SyntaxError::InvalidStrEscape);
    };
    match escaped {
        '\\' | '`' | '$' => output.push_char(escaped),
        'n' => output.push_char('\n'),
        'r' => output.push_char('\r'),
        't' => output.push_char('\t'),
        'b' => output.push_char('\u{0008}'),
        'f' => output.push_char('\u{000c}'),
        'v' => output.push_char('\u{000b}'),
        '\n' | '\u{2028}' | '\u{2029}' => {}
        '\r' => {
            if chars.peek() == Some(&'\n') {
                chars.next();
            }
        }
        '0' if !matches!(chars.peek(), Some('0'..='9')) => output.push_char('\0'),
        '0'..='9' => return Err(SyntaxError::LegacyOctal),
        'x' => push_hex_escape(chars, output, 2)?,
        'u' => push_unicode_escape(chars, output)?,
        other => output.push_char(other),
    }
    Ok(())
}

fn push_hex_escape(
    chars: &mut Peekable<Chars<'_>>,
    output: &mut Wtf8Buf,
    count: usize,
) -> Result<(), SyntaxError> {
    let mut value = 0;
    for _ in 0..count {
        let Some(digit) = chars.next().and_then(|digit| digit.to_digit(16)) else {
            return Err(SyntaxError::BadCharacterEscapeSequence {
                expected: "hexadecimal digit",
            });
        };
        value = value * 16 + digit;
    }
    push_code_point(output, value)
}

fn push_unicode_escape(
    chars: &mut Peekable<Chars<'_>>,
    output: &mut Wtf8Buf,
) -> Result<(), SyntaxError> {
    if chars.peek() != Some(&'{') {
        return push_hex_escape(chars, output, 4);
    }
    chars.next();
    let mut value = 0u32;
    let mut digits = 0;
    loop {
        let Some(character) = chars.next() else {
            return Err(SyntaxError::InvalidStrEscape);
        };
        if character == '}' {
            if digits == 0 {
                return Err(SyntaxError::InvalidStrEscape);
            }
            break;
        }
        let Some(digit) = character.to_digit(16) else {
            return Err(SyntaxError::InvalidStrEscape);
        };
        digits += 1;
        value = value
            .checked_mul(16)
            .and_then(|value| value.checked_add(digit))
            .filter(|value| *value <= 0x10ffff)
            .ok_or(SyntaxError::InvalidStrEscape)?;
    }
    push_code_point(output, value)
}

fn push_code_point(output: &mut Wtf8Buf, value: u32) -> Result<(), SyntaxError> {
    let code_point = if let Some(code_point) = CodePoint::from_u32(value) {
        code_point
    } else if (0xd800..=0xdfff).contains(&value) {
        // SAFETY: UTF-16 surrogate values are valid WTF-8 code points.
        unsafe { CodePoint::from_u32_unchecked(value) }
    } else {
        return Err(SyntaxError::InvalidStrEscape);
    };
    output.push(code_point);
    Ok(())
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::Expr;

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    fn parse(source: &str) -> Box<Expr> {
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        parser.parse_expression().unwrap()
    }

    #[test]
    fn builds_template_literal_nodes_and_relexes_each_tail() {
        let expression = parse("`head ${value} middle ${2} tail`");
        let Expr::Tpl(template) = &*expression else {
            panic!("expected template literal")
        };
        assert_eq!(template.exprs.len(), 2);
        assert_eq!(template.quasis.len(), 3);
        assert_eq!(template.quasis[0].raw, "head ");
        assert_eq!(template.quasis[1].raw, " middle ");
        assert_eq!(template.quasis[2].raw, " tail");
        assert!(template.quasis[2].tail);
    }

    #[test]
    fn decodes_escapes_only_for_cooked_template_value() {
        let expression = parse("`line\\n\\u{1f600}`");
        let Expr::Tpl(template) = &*expression else {
            panic!("expected template literal")
        };
        assert_eq!(template.quasis[0].raw, "line\\n\\u{1f600}");
        assert_eq!(
            template.quasis[0]
                .cooked
                .as_ref()
                .unwrap()
                .to_string_lossy(),
            "line\n😀"
        );
    }

    #[test]
    fn builds_tagged_template_expression() {
        let expression = parse("tag`value ${input}`");
        let Expr::TaggedTpl(tagged) = &*expression else {
            panic!("expected tagged template")
        };
        assert_eq!(tagged.tpl.exprs.len(), 1);
    }
}
