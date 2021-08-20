use swc_common::Span;

use super::CssWriter;
use std::fmt::{Result, Write};

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
}

impl<W> CssWriter for BasicCssWriter<'_, W>
where
    W: Write,
{
    fn write_ident(&mut self, span: Option<Span>, s: &str) -> Result {
        debug_assert!(
            !s.contains('\n'),
            "An identifier should not contain newline charactters"
        );

        self.col += s.len();
        self.w.write_str(s)?;

        Ok(())
    }

    fn write_punct(&mut self, span: Option<Span>, punct: &str) -> Result {
        debug_assert!(
            !punct.contains('\n'),
            "punct should not contain newline charactters"
        );

        self.col += punct.len();
        self.w.write_str(punct)?;

        Ok(())
    }

    fn write_space(&mut self) -> Result {
        self.w.write_char(' ')
    }

    fn write_raw(&mut self, span: Option<Span>, text: &str) -> Result {
        for (idx, s) in text.split('\n').enumerate() {
            self.col += s.len();
            self.w.write_str(s)?;

            if idx != 0 {
                self.write_newline()?;
            }
        }

        Ok(())
    }

    fn increase_indent(&mut self) {
        self.indent_level += 1;
    }

    fn decrease_indent(&mut self) {
        self.indent_level -= 1;
    }

    fn write_newline(&mut self) -> Result {
        self.line += 1;
        self.col = 0;

        self.w.write_char('\n')?;

        Ok(())
    }
}
