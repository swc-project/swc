use super::CssWriter;
use std::fmt::{Result, Write};
use swc_common::Span;

pub struct BasicCssWriterConfig<'a> {
    pub indent: &'a str,
}

pub struct BasicCssWriter<'a, W>
where
    W: Write,
{
    line: usize,
    col: usize,

    indent_level: usize,

    config: BasicCssWriterConfig<'a>,
    w: W,
}

impl<'a, W> BasicCssWriter<'a, W>
where
    W: Write,
{
    pub fn new(writer: W, config: BasicCssWriterConfig<'a>) -> Self {
        BasicCssWriter {
            config,
            w: writer,
            line: 0,
            col: 0,
            indent_level: 0,
        }
    }

    /// Applies indents if we are at the start of a line.
    fn apply_indent(&mut self) -> Result {
        if self.col == 0 {
            for _ in 0..self.indent_level {
                self.col += self.config.indent.len();
                self.w.write_str(self.config.indent)?;
            }
        }

        Ok(())
    }
}

impl<W> CssWriter for BasicCssWriter<'_, W>
where
    W: Write,
{
    fn write_punct(&mut self, _span: Option<Span>, punct: &str) -> Result {
        debug_assert!(
            !punct.contains('\n'),
            "punct should not contain newline characters"
        );

        self.apply_indent()?;
        self.col += punct.len();
        self.w.write_str(punct)?;

        Ok(())
    }

    fn write_space(&mut self) -> Result {
        self.w.write_char(' ')
    }

    fn write_str(&mut self, span: Option<Span>, text: &str) -> Result {
        self.write_raw_char(None, '"')?;

        for (_, char) in text.chars().enumerate() {
            match char {
                // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER (U+FFFD).
                '\0' => {
                    self.write_raw_char(span, '\u{FFFD}')?;
                }
                // If the character is in the range [\1-\1f] (U+0001 to U+001F) or is U+007F, the
                // character escaped as code point.
                '\x01'..='\x1F' | '\x7F' => {
                    static HEX_DIGITS: &'static [u8; 16] = b"0123456789abcdef";

                    let b3;
                    let b4;

                    let char_as_u8 = char as u8;
                    let bytes = if char_as_u8 > 0x0F {
                        let high = (char_as_u8 >> 4) as usize;
                        let low = (char_as_u8 & 0x0F) as usize;

                        b4 = [b'\\', HEX_DIGITS[high], HEX_DIGITS[low], b' '];

                        &b4[..]
                    } else {
                        b3 = [b'\\', HEX_DIGITS[char as usize], b' '];

                        &b3[..]
                    };

                    self.write_raw(None, unsafe { std::str::from_utf8_unchecked(&bytes) })?;
                }
                // If the character is '"' (U+0022) or "\" (U+005C), the escaped character.
                '"' => {
                    self.write_raw(None, "\\\"")?;
                }
                '\\' => {
                    self.write_raw(None, "\\\\")?;
                }
                // Otherwise, the character itself.
                _ => {
                    self.write_raw_char(span, char)?;
                }
            };
        }

        self.write_raw_char(None, '"')?;

        Ok(())
    }

    fn write_raw(&mut self, _span: Option<Span>, text: &str) -> Result {
        for (_, s) in text.chars().enumerate() {
            self.col += 1;
            self.w.write_char(s)?;
        }

        Ok(())
    }

    fn write_raw_char(&mut self, _span: Option<Span>, c: char) -> Result {
        self.col += c.len_utf8();
        self.w.write_char(c)?;

        Ok(())
    }

    fn write_newline(&mut self) -> Result {
        self.line += 1;
        self.col = 0;

        self.w.write_char('\n')?;

        Ok(())
    }

    fn increase_indent(&mut self) {
        self.indent_level += 1;
    }

    fn decrease_indent(&mut self) {
        self.indent_level -= 1;
    }
}
