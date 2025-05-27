use swc_atoms::Atom;

use crate::{
    diagnostics::Result,
    parser::reader::string_literal_parser::{
        ast as StringLiteralAst, parse_regexp_literal, Options as StringLiteralParserOptions,
        Parser as StringLiteralParser,
    },
};

pub struct Reader<'a> {
    source_text: &'a str,
    units: Vec<StringLiteralAst::CodePoint>,
    index: usize,
    offset: u32,
}

impl<'a> Reader<'a> {
    pub fn initialize(
        source_text: &'a str,
        unicode_mode: bool,
        parse_string_literal: bool,
    ) -> Result<Self> {
        // NOTE: This must be `0`.
        // Since `source_text` here may be a slice of the original source text,
        // using `Span` for `span.source_text(source_text)` will be out of range in some
        // cases.
        let span_offset = 0;

        let units = if parse_string_literal {
            let StringLiteralAst::StringLiteral { body, .. } = StringLiteralParser::new(
                source_text,
                StringLiteralParserOptions {
                    strict_mode: false,
                    span_offset,
                    combine_surrogate_pair: unicode_mode,
                },
            )
            .parse()?;
            body
        } else {
            parse_regexp_literal(source_text, span_offset, unicode_mode)
        };

        Ok(Self {
            source_text,
            units,
            index: 0,
            // If `parse_string_literal` is `true`, the first character is the opening quote.
            // We need to +1 to skip it.
            offset: u32::from(parse_string_literal),
        })
    }

    pub fn offset(&self) -> u32 {
        self.offset
    }

    pub fn checkpoint(&self) -> (usize, u32) {
        (self.index, self.offset)
    }

    pub fn rewind(&mut self, checkpoint: (usize, u32)) {
        self.index = checkpoint.0;
        self.offset = checkpoint.1;
    }

    pub fn advance(&mut self) {
        if let Some(unit) = self.units.get(self.index) {
            self.offset = unit.span.hi.0;
            self.index += 1;
        }
    }

    fn peek_nth(&self, n: usize) -> Option<u32> {
        let nth = self.index + n;
        self.units.get(nth).map(|cp| cp.value)
    }

    pub fn peek(&self) -> Option<u32> {
        self.peek_nth(0)
    }

    pub fn peek2(&self) -> Option<u32> {
        self.peek_nth(1)
    }

    pub fn eat(&mut self, ch: char) -> bool {
        if self.peek_nth(0) == Some(ch as u32) {
            self.advance();
            return true;
        }
        false
    }

    pub fn eat2(&mut self, ch: char, ch2: char) -> bool {
        if self.peek_nth(0) == Some(ch as u32) && self.peek_nth(1) == Some(ch2 as u32) {
            self.advance();
            self.advance();
            return true;
        }
        false
    }

    pub fn eat3(&mut self, ch: char, ch2: char, ch3: char) -> bool {
        if self.peek_nth(0) == Some(ch as u32)
            && self.peek_nth(1) == Some(ch2 as u32)
            && self.peek_nth(2) == Some(ch3 as u32)
        {
            self.advance();
            self.advance();
            self.advance();
            return true;
        }
        false
    }

    pub fn eat4(&mut self, ch: char, ch2: char, ch3: char, ch4: char) -> bool {
        if self.peek_nth(0) == Some(ch as u32)
            && self.peek_nth(1) == Some(ch2 as u32)
            && self.peek_nth(2) == Some(ch3 as u32)
            && self.peek_nth(3) == Some(ch4 as u32)
        {
            self.advance();
            self.advance();
            self.advance();
            self.advance();
            return true;
        }
        false
    }

    pub fn atom(&self, start: u32, end: u32) -> Atom {
        Atom::from(&self.source_text[start as usize..end as usize])
    }
}
