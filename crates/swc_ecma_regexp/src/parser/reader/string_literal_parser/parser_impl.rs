use super::{
    ast,
    characters::{
        is_line_terminator, is_non_escape_character, is_single_escape_character, CR, LF, LS, PS,
    },
    diagnostics,
    options::Options,
};
use crate::{diagnostics::Result, parser::span_factory::SpanFactory};

// Internal representation of escape sequence resolved unit in a string literal.
type OffsetsAndCp = ((u32, u32), u32);

/// Helper API for `RegExp` literal parsing.
/// This time, we don't need to handle escape sequences.
pub fn parse_regexp_literal(
    source_text: &str,
    span_offset: u32,
    combine_surrogate_pair: bool,
) -> Vec<ast::CodePoint> {
    let mut body = vec![];

    let mut offset = 0;
    for ch in source_text.chars() {
        let start = offset;
        #[expect(clippy::cast_possible_truncation)]
        let end = start + ch.len_utf8() as u32;

        let offsets_and_cp: OffsetsAndCp = ((start, end), ch as u32);
        Parser::handle_code_point(
            &mut body,
            offsets_and_cp,
            span_offset,
            combine_surrogate_pair,
        );
        offset = end;
    }

    body
}

pub struct Parser {
    // NOTE: In JavaScript, string literals are UTF-16 encoded,
    // so we need to be aware of surrogate pairs, while collecting offsets for `Span`.
    // Rather than using `encode_utf16()`, split surrogate pairs manually is easier
    // to detect the start and end of each code point.
    chars: Vec<char>,
    index: usize,
    offset: u32,
    options: Options,
}

impl Parser {
    // This is public because it is used in `parse_regexp_literal()`.
    pub fn handle_code_point(
        body: &mut Vec<ast::CodePoint>,
        (offsets, cp): OffsetsAndCp,
        span_offset: u32,
        combine_surrogate_pair: bool,
    ) {
        let span = SpanFactory::span_from_u32(span_offset + offsets.0, span_offset + offsets.1);

        if combine_surrogate_pair || (0..=0xffff).contains(&cp) {
            // If the code point is in the BMP or if forced, just push it
            body.push(ast::CodePoint { span, value: cp });
        } else {
            // Otherwise, split the code point into a surrogate pair, sharing the same span
            let (lead, trail) = (
                0xd800 + ((cp - 0x10000) >> 10),
                0xdc00 + ((cp - 0x10000) & 0x3ff),
            );
            body.push(ast::CodePoint { span, value: lead });
            body.push(ast::CodePoint { span, value: trail });
        }
    }

    // ---

    pub fn new(source_text: &str, options: Options) -> Self {
        Self {
            chars: source_text.chars().collect::<Vec<_>>(),
            index: 0,
            offset: 0,
            options,
        }
    }

    // ```
    // StringLiteral ::
    //   " DoubleStringCharacters[opt] "
    //   ' SingleStringCharacters[opt] '
    // ```
    pub fn parse(mut self) -> Result<ast::StringLiteral> {
        let (quote_char, kind) = if self.eat('"') {
            ('"', ast::StringLiteralKind::Double)
        } else if self.eat('\'') {
            ('\'', ast::StringLiteralKind::Single)
        } else {
            return Err(diagnostics::invalid_input(SpanFactory::span_from_u32(
                self.options.span_offset,
                self.options.span_offset,
            )));
        };

        let body = self.parse_string_characters(quote_char)?;

        if self.eat(quote_char) {
            if self.peek().is_some() {
                return Err(diagnostics::invalid_input(SpanFactory::span_from_u32(
                    self.options.span_offset + self.offset(),
                    self.options.span_offset + self.offset(),
                )));
            }

            let span = SpanFactory::span_from_u32(
                self.options.span_offset,
                self.options.span_offset + self.offset(),
            );
            return Ok(ast::StringLiteral { span, kind, body });
        }

        Err(diagnostics::invalid_input(SpanFactory::span_from_u32(
            self.options.span_offset + self.offset(),
            self.options.span_offset + self.offset(),
        )))
    }

    // ---

    // ```
    // DoubleStringCharacters ::
    //   DoubleStringCharacter DoubleStringCharacters[opt]
    //
    // SingleStringCharacters ::
    //   SingleStringCharacter SingleStringCharacters[opt]
    // ```
    fn parse_string_characters(
        &mut self,
        single_or_double_quote: char,
    ) -> Result<Vec<ast::CodePoint>> {
        let mut body = vec![];
        while let Some(code_point) = self.parse_string_character(single_or_double_quote)? {
            Parser::handle_code_point(
                &mut body,
                code_point,
                self.options.span_offset,
                self.options.combine_surrogate_pair,
            );
        }
        Ok(body)
    }

    // ```
    // DoubleStringCharacter ::
    //   SourceCharacter but not one of " or \ or LineTerminator
    //   <LS>
    //   <PS>
    //   \ EscapeSequence
    //   LineContinuation
    //
    // SingleStringCharacter ::
    //   SourceCharacter but not one of ' or \ or LineTerminator
    //   <LS>
    //   <PS>
    //   \ EscapeSequence
    //   LineContinuation
    // ```
    fn parse_string_character(
        &mut self,
        single_or_double_quote: char,
    ) -> Result<Option<OffsetsAndCp>> {
        let offset_start = self.offset();
        let checkpoint = self.checkpoint();

        if let Some(ch) = self
            .peek()
            .filter(|&ch| ch != single_or_double_quote && ch != '\\' && !is_line_terminator(ch))
        {
            self.advance();
            return Ok(Some(((offset_start, self.offset()), ch as u32)));
        }
        if self.peek() == Some(LS) {
            self.advance();
            return Ok(Some(((offset_start, self.offset()), LS as u32)));
        }
        if self.peek() == Some(PS) {
            self.advance();
            return Ok(Some(((offset_start, self.offset()), PS as u32)));
        }
        if self.eat('\\') {
            if let Some(cp) = self.parse_escape_sequence(offset_start)? {
                return Ok(Some(((offset_start, self.offset()), cp)));
            }
            self.rewind(checkpoint);
        }
        if let Some(cp) = self.parse_line_terminator_sequence() {
            return Ok(Some(((offset_start, self.offset()), cp)));
        }

        Ok(None)
    }

    // ```
    // EscapeSequence ::
    //   CharacterEscapeSequence
    //   0 [lookahead ∉ DecimalDigit]
    //   LegacyOctalEscapeSequence
    //   NonOctalDecimalEscapeSequence
    //   HexEscapeSequence
    //   UnicodeEscapeSequence
    // ```
    fn parse_escape_sequence(&mut self, offset_start: u32) -> Result<Option<u32>> {
        if let Some(cp) = self.parse_character_escape_sequence() {
            return Ok(Some(cp));
        }
        if self.peek() == Some('0') && self.peek2().is_none_or(|ch| !ch.is_ascii_digit()) {
            self.advance();
            return Ok(Some(0x00));
        }
        if let Some(cp) = self.parse_legacy_octal_escape_sequence() {
            // [SS:EE] EscapeSequence :: LegacyOctalEscapeSequence
            // It is a Syntax Error if IsStrict(this production) is true.
            if self.options.strict_mode {
                return Err(diagnostics::legacy_in_strict_mode(
                    "octal escape sequence",
                    SpanFactory::span_from_u32(
                        self.options.span_offset + offset_start,
                        self.options.span_offset + self.offset(),
                    ),
                ));
            }
            return Ok(Some(cp));
        }
        if let Some(cp) = self.parse_non_octal_decimal_escape_sequence() {
            // [SS:EE] EscapeSequence :: NonOctalDecimalEscapeSequence
            // It is a Syntax Error if IsStrict(this production) is true.
            if self.options.strict_mode {
                return Err(diagnostics::legacy_in_strict_mode(
                    "non octal decimal escape sequence",
                    SpanFactory::span_from_u32(
                        self.options.span_offset + offset_start,
                        self.options.span_offset + self.offset(),
                    ),
                ));
            }
            return Ok(Some(cp));
        }
        if let Some(cp) = self.parse_hex_escape_sequence() {
            return Ok(Some(cp));
        }
        if let Some(cp) = self.parse_unicode_escape_sequence(offset_start)? {
            return Ok(Some(cp));
        }

        Ok(None)
    }

    // ```
    // CharacterEscapeSequence ::
    //   SingleEscapeCharacter
    //   NonEscapeCharacter
    // ```
    fn parse_character_escape_sequence(&mut self) -> Option<u32> {
        if let Some(ch) = self.peek().filter(|&ch| is_single_escape_character(ch)) {
            self.advance();
            return Some(ch as u32);
        }
        if let Some(ch) = self.peek().filter(|&ch| is_non_escape_character(ch)) {
            self.advance();
            return Some(ch as u32);
        }

        None
    }

    // ```
    // LegacyOctalEscapeSequence ::
    //   0 [lookahead ∈ { 8, 9 }]
    //   NonZeroOctalDigit [lookahead ∉ OctalDigit]
    //   ZeroToThree OctalDigit [lookahead ∉ OctalDigit]
    //   FourToSeven OctalDigit
    //   ZeroToThree OctalDigit OctalDigit
    //
    // NonZeroOctalDigit ::
    //   OctalDigit but not 0
    //
    // ZeroToThree :: one of
    //   0 1 2 3
    //
    // FourToSeven :: one of
    //   4 5 6 7
    // ```
    fn parse_legacy_octal_escape_sequence(&mut self) -> Option<u32> {
        if let Some(first) = self.consume_octal_digit() {
            // 0 [lookahead ∈ { 8, 9 }]
            if first == 0 && self.peek().filter(|&ch| !matches!(ch, '8' | '9')).is_some() {
                return Some(first);
            }

            if let Some(second) = self.consume_octal_digit() {
                if let Some(third) = self.consume_octal_digit() {
                    // ZeroToThree OctalDigit OctalDigit
                    if first <= 3 {
                        return Some(first * 64 + second * 8 + third);
                    }
                }

                // ZeroToThree OctalDigit [lookahead ∉ OctalDigit]
                // FourToSeven OctalDigit
                return Some(first * 8 + second);
            }

            // NonZeroOctalDigit [lookahead ∉ OctalDigit]
            return Some(first);
        }

        None
    }

    // ```
    // NonOctalDecimalEscapeSequence :: one of
    //   8 9
    // ```
    fn parse_non_octal_decimal_escape_sequence(&mut self) -> Option<u32> {
        if self.eat('8') {
            return Some('8' as u32);
        }
        if self.eat('9') {
            return Some('9' as u32);
        }
        None
    }

    // ```
    // HexEscapeSequence ::
    //   x HexDigit HexDigit
    // ```
    fn parse_hex_escape_sequence(&mut self) -> Option<u32> {
        let checkpoint = self.checkpoint();

        if self.eat('x') {
            if let Some(first) = self.consume_hex_digit() {
                if let Some(second) = self.consume_hex_digit() {
                    return Some(first * 16 + second);
                }
            }

            self.rewind(checkpoint);
        }

        None
    }

    // ```
    // UnicodeEscapeSequence ::
    //   u Hex4Digits
    //   u{ CodePoint }
    // ```
    fn parse_unicode_escape_sequence(&mut self, offset_start: u32) -> Result<Option<u32>> {
        let chckpoint = self.checkpoint();

        if self.eat('u') {
            if let Some(cp) = self.consume_hex4_digits() {
                return Ok(Some(cp));
            }
            self.rewind(chckpoint);
        }

        if self.eat('u') {
            if self.eat('{') {
                if let Some(hex_digits) = self
                    .consume_hex_digits(offset_start)?
                    .filter(|&cp| cp <= 0x10_ffff)
                {
                    if self.eat('}') {
                        return Ok(Some(hex_digits));
                    }
                }
            }
            self.rewind(chckpoint);
        }

        Ok(None)
    }

    // ```
    // LineContinuation ::
    //   \ LineTerminatorSequence
    //
    // LineTerminatorSequence ::
    //   <LF>
    //   <CR> [lookahead ≠ <LF>]
    //   <LS>
    //   <PS>
    //   <CR> <LF>
    // ```
    fn parse_line_terminator_sequence(&mut self) -> Option<u32> {
        let checkpoint = self.checkpoint();

        if self.eat('\\') {
            if self.peek() == Some(LF) {
                self.advance();
                return Some(LF as u32);
            }
            if self.peek() == Some(CR) && self.peek2() != Some(LF) {
                self.advance();
                return Some(CR as u32);
            }
            if self.peek() == Some(LS) {
                self.advance();
                return Some(LS as u32);
            }
            if self.peek() == Some(PS) {
                self.advance();
                return Some(PS as u32);
            }
            // NOTE: CR+LF can not represent as a single code point.
            // I don't know the best way to handle this.
            // To distinguish this from CR and LF, structural change is needed...
            if self.peek() == Some(CR) && self.peek2() == Some(LF) {
                self.advance();
                self.advance();
                return Some(LF as u32);
            }
        }

        self.rewind(checkpoint);
        None
    }

    // ---

    fn consume_hex_digit(&mut self) -> Option<u32> {
        if let Some(ch) = self.peek().filter(char::is_ascii_hexdigit) {
            self.advance();
            return ch.to_digit(16);
        }

        None
    }

    fn consume_octal_digit(&mut self) -> Option<u32> {
        if let Some(ch) = self
            .peek()
            .filter(char::is_ascii_digit)
            .filter(|&ch| ch < '8')
        {
            self.advance();
            // `- '0' as u32`: convert code point to digit
            return Some(ch as u32 - '0' as u32);
        }

        None
    }

    // ```
    // Hex4Digits ::
    //   HexDigit HexDigit HexDigit HexDigit
    // ```
    fn consume_hex4_digits(&mut self) -> Option<u32> {
        let checkpoint = self.checkpoint();

        let mut value = 0;
        for _ in 0..4 {
            let Some(hex) = self
                .peek()
                .filter(char::is_ascii_hexdigit)
                .and_then(|ch| ch.to_digit(16))
            else {
                self.rewind(checkpoint);
                return None;
            };

            value = (16 * value) + hex;
            self.advance();
        }

        Some(value)
    }

    fn consume_hex_digits(&mut self, offset_start: u32) -> Result<Option<u32>> {
        let checkpoint = self.checkpoint();

        let mut value: u32 = 0;
        while let Some(hex) = self
            .peek()
            .filter(char::is_ascii_hexdigit)
            .and_then(|ch| ch.to_digit(16))
        {
            // To prevent panic on overflow cases like `\u{FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF}`
            if let Some(v) = value.checked_mul(16).and_then(|v| v.checked_add(hex)) {
                value = v;
                self.advance();
            } else {
                return Err(diagnostics::too_large_unicode_escape_sequence(
                    SpanFactory::span_from_u32(
                        self.options.span_offset + offset_start,
                        self.options.span_offset + self.offset(),
                    ),
                ));
            }
        }

        if self.checkpoint() != checkpoint {
            return Ok(Some(value));
        }

        Ok(None)
    }

    // ---

    fn checkpoint(&self) -> (usize, u32) {
        (self.index, self.offset)
    }

    fn rewind(&mut self, checkpoint: (usize, u32)) {
        self.index = checkpoint.0;
        self.offset = checkpoint.1;
    }

    fn advance(&mut self) {
        if let Some(ch) = self.chars.get(self.index) {
            #[expect(clippy::cast_possible_truncation)]
            let len = ch.len_utf8() as u32;
            self.offset += len;
            self.index += 1;
        }
    }

    fn eat(&mut self, ch: char) -> bool {
        if self.peek() == Some(ch) {
            self.advance();
            return true;
        }
        false
    }

    fn offset(&self) -> u32 {
        self.offset
    }

    fn peek_nth(&self, n: usize) -> Option<char> {
        let nth = self.index + n;
        self.chars.get(nth).copied()
    }

    fn peek(&self) -> Option<char> {
        self.peek_nth(0)
    }

    fn peek2(&self) -> Option<char> {
        self.peek_nth(1)
    }
}
