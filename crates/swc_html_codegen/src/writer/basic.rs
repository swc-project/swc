use std::fmt::{Result, Write};

use rustc_hash::FxHashSet;
use swc_common::{BytePos, LineCol, Span};

use super::HtmlWriter;

#[derive(Clone, Copy, PartialEq, Eq, Debug, Default)]
pub enum IndentType {
    Tab,
    #[default]
    Space,
}

#[derive(Clone, Copy, PartialEq, Eq, Debug, Default)]
pub enum LineFeed {
    #[default]
    LF,
    CRLF,
}

pub struct BasicHtmlWriterConfig {
    pub indent_type: IndentType,
    pub indent_width: i32,
    pub linefeed: LineFeed,
}

impl Default for BasicHtmlWriterConfig {
    fn default() -> Self {
        BasicHtmlWriterConfig {
            indent_type: IndentType::default(),
            indent_width: 2,
            linefeed: LineFeed::default(),
        }
    }
}

pub struct BasicHtmlWriter<'a, W>
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
    srcmap_done: FxHashSet<(BytePos, u32, u32)>,
    /// Used to avoid including whitespaces created by indention.
    pending_srcmap: Option<BytePos>,

    config: BasicHtmlWriterConfig,

    w: W,
}

impl<'a, W> BasicHtmlWriter<'a, W>
where
    W: Write,
{
    pub fn new(
        writer: W,
        srcmap: Option<&'a mut Vec<(BytePos, LineCol)>>,
        config: BasicHtmlWriterConfig,
    ) -> Self {
        let indent_type = match config.indent_type {
            IndentType::Tab => "\t",
            IndentType::Space => " ",
        };
        let linefeed = match config.linefeed {
            LineFeed::LF => "\n",
            LineFeed::CRLF => "\r\n",
        };

        BasicHtmlWriter {
            line_start: true,
            line: 0,
            col: 0,

            indent_type,
            indent_level: 0,
            linefeed,

            config,
            srcmap,

            w: writer,
            pending_srcmap: Default::default(),
            srcmap_done: Default::default(),
        }
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

    fn write(&mut self, span: Option<Span>, data: &str) -> Result {
        if !data.is_empty() {
            if self.line_start {
                self.write_indent_string()?;
                self.line_start = false;

                if let Some(pending) = self.pending_srcmap.take() {
                    self.srcmap(pending);
                }
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

    fn srcmap(&mut self, byte_pos: BytePos) {
        if byte_pos.is_dummy() {
            return;
        }

        if let Some(ref mut srcmap) = self.srcmap {
            if self
                .srcmap_done
                .insert((byte_pos, self.line as _, self.col as _))
            {
                let loc = LineCol {
                    line: self.line as _,
                    col: self.col as _,
                };

                srcmap.push((byte_pos, loc));
            }
        }
    }
}

impl<W> HtmlWriter for BasicHtmlWriter<'_, W>
where
    W: Write,
{
    fn write_space(&mut self) -> Result {
        self.write_raw(None, " ")
    }

    fn write_newline(&mut self) -> Result {
        let pending = self.pending_srcmap.take();

        if !self.line_start {
            self.raw_write(self.linefeed)?;
            self.line += 1;
            self.col = 0;
            self.line_start = true;

            if let Some(pending) = pending {
                self.srcmap(pending)
            }
        }

        Ok(())
    }

    fn write_raw(&mut self, span: Option<Span>, text: &str) -> Result {
        debug_assert!(
            !text.contains('\n'),
            "write_raw should not contains new lines, got '{}'",
            text,
        );

        self.write(span, text)?;

        Ok(())
    }

    fn write_multiline_raw(&mut self, span: Span, s: &str) -> Result {
        if !s.is_empty() {
            if !span.is_dummy() {
                self.srcmap(span.lo())
            }

            self.write(None, s)?;

            let line_start_of_s = compute_line_starts(s);

            if line_start_of_s.len() > 1 {
                self.line = self.line + line_start_of_s.len() - 1;

                let last_line_byte_index = line_start_of_s.last().cloned().unwrap_or(0);

                self.col = s[last_line_byte_index..].chars().count();
            }

            if !span.is_dummy() {
                self.srcmap(span.hi())
            }
        }

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

fn compute_line_starts(s: &str) -> Vec<usize> {
    let mut res = Vec::new();
    let mut line_start = 0;
    let mut chars = s.char_indices().peekable();

    while let Some((pos, c)) = chars.next() {
        match c {
            '\r' => {
                if let Some(&(_, '\n')) = chars.peek() {
                    let _ = chars.next();
                }
            }

            '\n' => {
                res.push(line_start);
                line_start = pos + 1;
            }

            _ => {}
        }
    }

    // Last line.
    res.push(line_start);
    res
}
