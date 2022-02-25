use std::{
    fmt::{Result, Write},
    str::from_utf8,
};

use swc_common::Span;

use super::CssWriter;

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
        let mut new_string = String::new();

        let mut dq = 0;
        let mut sq = 0;

        for c in text.chars() {
            match c {
                // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER (U+FFFD).
                '\0' => {
                    new_string.push('\u{FFFD}');
                }
                // If the character is in the range [\1-\1f] (U+0001 to U+001F) or is U+007F, the
                // character escaped as code point.
                '\x01'..='\x1F' | '\x7F' => {
                    static HEX_DIGITS: &[u8; 16] = b"0123456789abcdef";

                    let b3;
                    let b4;
                    let char_as_u8 = c as u8;

                    let bytes = if char_as_u8 > 0x0f {
                        let high = (char_as_u8 >> 4) as usize;
                        let low = (char_as_u8 & 0x0f) as usize;

                        b4 = [b'\\', HEX_DIGITS[high], HEX_DIGITS[low], b' '];

                        &b4[..]
                    } else {
                        b3 = [b'\\', HEX_DIGITS[c as usize], b' '];

                        &b3[..]
                    };

                    new_string.push_str(from_utf8(bytes).unwrap());
                }
                // If the character is '"' (U+0022) or "\" (U+005C), the escaped character.
                // We avoid escaping `"` to better string compression - we count the quantity of
                // quotes to choose the best default quotes
                '\\' => {
                    new_string.push_str("\\\\");
                }
                '"' => {
                    dq += 1;

                    new_string.push(c);
                }
                '\'' => {
                    sq += 1;

                    new_string.push(c);
                }
                // Otherwise, the character itself.
                _ => {
                    new_string.push(c);
                }
            };
        }

        if dq > sq {
            self.write_raw_char(span, '\'')?;
            self.write_raw(span, &new_string.replace('\'', "\\'"))?;
            self.write_raw_char(span, '\'')?;
        } else {
            self.write_raw_char(span, '"')?;
            self.write_raw(span, &new_string.replace('"', "\\\""))?;
            self.write_raw_char(span, '"')?;
        }

        Ok(())
    }

    fn write_raw(&mut self, span: Option<Span>, text: &str) -> Result {
        for c in text.chars() {
            self.write_raw_char(span, c)?;
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
