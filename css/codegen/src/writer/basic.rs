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

    fn write_escaped(&mut self, s: &str, escape_first_dash: bool) -> Result {
        for (idx, c) in s.chars().enumerate() {
            match c {
                ' ' | ',' | ':' | '~' | '+' | '.' | '#' | '\x00'..='\x1f' => {
                    self.col += 1;
                    self.w.write_char('\\')?;
                }

                '-' if escape_first_dash && idx == 0 => {
                    self.col += 1;
                    self.w.write_char('\\')?;
                }

                '0'..='9' if idx == 0 => {
                    self.col += 3;
                    self.w.write_char('\\')?;
                    write!(self.w, "{:x}", c as u32)?;
                    continue;
                }

                _ => {}
            }

            self.col += 1;
            self.w.write_char(c)?;
        }

        Ok(())
    }
}

impl<W> CssWriter for BasicCssWriter<'_, W>
where
    W: Write,
{
    fn write_ident(&mut self, _span: Option<Span>, s: &str, escape_first_dash: bool) -> Result {
        self.apply_indent()?;
        self.write_escaped(s, escape_first_dash)?;

        Ok(())
    }

    fn write_punct(&mut self, _span: Option<Span>, punct: &str) -> Result {
        debug_assert!(
            !punct.contains('\n'),
            "punct should not contain newline charactters"
        );

        self.apply_indent()?;
        self.col += punct.len();
        self.w.write_str(punct)?;

        Ok(())
    }

    fn write_space(&mut self) -> Result {
        self.w.write_char(' ')
    }

    fn write_hash_value(&mut self, _span: Option<Span>, text: &str) -> Result {
        for c in text.chars() {
            match c {
                ',' => {
                    self.col += 1;
                    self.w.write_char('\\')?;
                }

                _ => {}
            }

            self.col += 1;
            self.w.write_char(c)?;
        }

        Ok(())
    }

    fn write_raw(&mut self, _span: Option<Span>, text: &str) -> Result {
        for (idx, s) in text.split('\n').enumerate() {
            self.col += s.len();
            self.w.write_str(s)?;

            if idx != 0 {
                self.write_newline()?;
            }
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
