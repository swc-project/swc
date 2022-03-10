use std::fmt::{Result, Write};

use swc_common::{BytePos, LineCol, Span};

use super::CssWriter;

pub enum IndentType {
    Tab,
    Space,
}

impl Default for IndentType {
    fn default() -> Self {
        IndentType::Space
    }
}

pub enum LineFeed {
    LF,
    CRLF,
}

impl Default for LineFeed {
    fn default() -> Self {
        LineFeed::LF
    }
}

pub struct BasicCssWriterConfig {
    pub indent_type: IndentType,
    pub indent_width: i32,
    pub linefeed: LineFeed,
}

impl Default for BasicCssWriterConfig {
    fn default() -> Self {
        BasicCssWriterConfig {
            indent_type: IndentType::default(),
            indent_width: 2,
            linefeed: LineFeed::default(),
        }
    }
}

pub struct BasicCssWriter<'a, W>
where
    W: Write,
{
    line_start: bool,
    line: usize,
    col: usize,

    indent_type: &'a str,
    indent_level: usize,
    linefeed: &'a str,

    srcmap: Option<&'a mut Vec<(BytePos, LineCol)>>,

    config: BasicCssWriterConfig,

    w: W,
}

impl<'a, W> BasicCssWriter<'a, W>
where
    W: Write,
{
    pub fn new(
        writer: W,
        srcmap: Option<&'a mut Vec<(BytePos, LineCol)>>,
        config: BasicCssWriterConfig,
    ) -> Self {
        let indent_type = match config.indent_type {
            IndentType::Tab => "\t",
            IndentType::Space => " ",
        };
        let linefeed = match config.linefeed {
            LineFeed::LF => "\n",
            LineFeed::CRLF => "\r\n",
        };

        BasicCssWriter {
            line_start: true,
            line: 0,
            col: 0,

            indent_type,
            indent_level: 0,
            linefeed,

            config,
            srcmap,

            w: writer,
        }
    }

    fn write(&mut self, span: Option<Span>, data: &str) -> Result {
        if !data.is_empty() {
            if self.line_start {
                self.write_indent_string()?;
                self.line_start = false;
            }

            if let Some(span) = span {
                if !span.is_dummy() {
                    self.srcmap(span.lo())
                }
            }

            self.raw_write(data)?;

            if let Some(span) = span {
                if !span.is_dummy() {
                    self.srcmap(span.hi())
                }
            }
        }

        Ok(())
    }

    fn write_indent_string(&mut self) -> Result {
        for _ in 0..(self.config.indent_width * self.indent_level as i32) {
            self.raw_write(self.indent_type)?;
        }

        Ok(())
    }

    fn raw_write(&mut self, data: &str) -> Result {
        self.w.write_str(data)?;

        self.col += data.chars().count();

        Ok(())
    }

    fn srcmap(&mut self, byte_pos: BytePos) {
        if let Some(ref mut srcmap) = self.srcmap {
            srcmap.push((
                byte_pos,
                LineCol {
                    line: self.line as _,
                    col: self.col as _,
                },
            ))
        }
    }
}

impl<W> CssWriter for BasicCssWriter<'_, W>
where
    W: Write,
{
    fn write_space(&mut self) -> Result {
        self.w.write_char(' ')
    }

    fn write_newline(&mut self) -> Result {
        if !self.line_start {
            self.raw_write(self.linefeed)?;
            self.line += 1;
            self.col = 0;
            self.line_start = true;
        }

        Ok(())
    }

    fn write_raw_char(&mut self, span: Option<Span>, c: char) -> Result {
        self.write(span, &c.to_string())?;

        Ok(())
    }

    fn write_raw(&mut self, span: Option<Span>, text: &str) -> Result {
        self.write(span, text)?;

        Ok(())
    }

    fn increase_indent(&mut self) {
        self.indent_level += 1;
    }

    fn decrease_indent(&mut self) {
        debug_assert!(
            (self.indent_level as i32) >= 0,
            "indent should zero or greater than zero",
        );

        self.indent_level -= 1;
    }
}
