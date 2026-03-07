use std::fmt::Write;

use crate::{writer::WriteJs, Result};

/// Basic in-memory JS writer with indentation support.
pub struct BasicJsWriter<W>
where
    W: Write,
{
    out: W,
    indent_level: usize,
    indent_str: &'static str,
    linefeed: &'static str,
    line_start: bool,
}

impl<W> BasicJsWriter<W>
where
    W: Write,
{
    /// Creates a writer using two-space indentation and LF line feeds.
    #[inline]
    pub fn new(out: W) -> Self {
        Self {
            out,
            indent_level: 0,
            indent_str: "  ",
            linefeed: "\n",
            line_start: true,
        }
    }

    #[inline]
    fn write_indent(&mut self) -> Result {
        if self.line_start {
            for _ in 0..self.indent_level {
                self.out.write_str(self.indent_str)?;
            }
            self.line_start = false;
        }

        Ok(())
    }
}

impl<W> WriteJs for BasicJsWriter<W>
where
    W: Write,
{
    #[inline]
    fn write_raw(&mut self, text: &str) -> Result {
        if text.is_empty() {
            return Ok(());
        }

        self.write_indent()?;
        self.out.write_str(text)?;

        Ok(())
    }

    #[inline]
    fn write_newline(&mut self) -> Result {
        self.out.write_str(self.linefeed)?;
        self.line_start = true;
        Ok(())
    }

    #[inline]
    fn increase_indent(&mut self) {
        self.indent_level += 1;
    }

    #[inline]
    fn decrease_indent(&mut self) {
        self.indent_level = self.indent_level.saturating_sub(1);
    }
}
