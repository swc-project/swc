use super::{Result, WriteJs};
use std::io::{self, Write};
use swc_common::{sync::Lrc, BytePos, LineCol, SourceMap, Span};
use swc_ecma_ast::EsVersion;

///
/// -----
///
/// Ported from `createTextWriter` of the typescript compiler.
///
/// https://github.com/Microsoft/TypeScript/blob/45eaf42006/src/compiler/utilities.ts#L2548
pub struct JsWriter<'a, W: Write> {
    indent: usize,
    line_start: bool,
    line_count: usize,
    line_pos: usize,
    new_line: &'a str,
    srcmap: Option<&'a mut Vec<(BytePos, LineCol)>>,
    wr: W,
    target: EsVersion,
}

impl<'a, W: Write> JsWriter<'a, W> {
    pub fn new(
        cm: Lrc<SourceMap>,
        new_line: &'a str,
        wr: W,
        srcmap: Option<&'a mut Vec<(BytePos, LineCol)>>,
    ) -> Self {
        Self::with_target(cm, new_line, wr, srcmap, EsVersion::Es2020)
    }

    pub fn with_target(
        _: Lrc<SourceMap>,
        new_line: &'a str,
        wr: W,
        srcmap: Option<&'a mut Vec<(BytePos, LineCol)>>,
        target: EsVersion,
    ) -> Self {
        JsWriter {
            indent: Default::default(),
            line_start: true,
            line_count: 0,
            line_pos: Default::default(),
            new_line,
            srcmap,
            wr,
            target,
        }
    }

    fn write_indent_string(&mut self) -> io::Result<usize> {
        const INDENT: &[u8] = b"    ";

        let mut cnt = 0;
        for _ in 0..self.indent {
            cnt += self.raw_write(INDENT)?;
        }

        Ok(cnt)
    }

    fn raw_write(&mut self, data: &[u8]) -> io::Result<usize> {
        let written = self.wr.write(data)?;
        self.line_pos += written;
        Ok(written)
    }

    fn write(&mut self, span: Option<Span>, data: &str) -> io::Result<usize> {
        let mut cnt = 0;

        if !data.is_empty() {
            if self.line_start {
                cnt += self.write_indent_string()?;
                self.line_start = false;
            }

            if let Some(span) = span {
                if !span.is_dummy() {
                    self.srcmap(span.lo())
                }
            }

            cnt += self.raw_write(data.as_bytes())?;

            if let Some(span) = span {
                if !span.is_dummy() {
                    self.srcmap(span.hi())
                }
            }
        }

        Ok(cnt)
    }

    fn srcmap(&mut self, byte_pos: BytePos) {
        if let Some(ref mut srcmap) = self.srcmap {
            srcmap.push((
                byte_pos,
                LineCol {
                    line: self.line_count as _,
                    col: self.line_pos as _,
                },
            ))
        }
    }
}

impl<'a, W: Write> WriteJs for JsWriter<'a, W> {
    fn target(&self) -> EsVersion {
        self.target
    }
    fn increase_indent(&mut self) -> Result {
        self.indent += 1;
        Ok(())
    }

    fn decrease_indent(&mut self) -> Result {
        self.indent -= 1;
        Ok(())
    }
    fn write_semi(&mut self, span: Option<Span>) -> Result {
        self.write(span, ";")?;
        Ok(())
    }

    fn write_space(&mut self) -> Result {
        self.write(None, " ")?;
        Ok(())
    }

    fn write_keyword(&mut self, span: Option<Span>, s: &'static str) -> Result {
        self.write(span, s)?;
        Ok(())
    }

    fn write_operator(&mut self, span: Option<Span>, s: &str) -> Result {
        self.write(span, s)?;
        Ok(())
    }

    fn write_param(&mut self, s: &str) -> Result {
        self.write(None, s)?;
        Ok(())
    }

    fn write_property(&mut self, s: &str) -> Result {
        self.write(None, s)?;
        Ok(())
    }

    fn write_line(&mut self) -> Result {
        if !self.line_start {
            self.raw_write(self.new_line.as_bytes())?;
            self.line_count += 1;
            self.line_pos = 0;
            self.line_start = true;
        }

        Ok(())
    }

    fn write_lit(&mut self, span: Span, s: &str) -> Result {
        if !s.is_empty() {
            if !span.is_dummy() {
                self.srcmap(span.lo())
            }

            self.write(None, s)?;

            let line_start_of_s = compute_line_starts(s);
            if line_start_of_s.len() > 1 {
                self.line_count = self.line_count + line_start_of_s.len() - 1;
                self.line_pos = s.len() - line_start_of_s.last().cloned().unwrap_or(0);
            }

            if !span.is_dummy() {
                self.srcmap(span.hi())
            }
        }

        Ok(())
    }

    fn write_comment(&mut self, span: Span, s: &str) -> Result {
        self.write(Some(span), s)?;
        {
            let line_start_of_s = compute_line_starts(s);
            if line_start_of_s.len() > 1 {
                self.line_count = self.line_count + line_start_of_s.len() - 1;
                self.line_pos = s.len() - line_start_of_s.last().cloned().unwrap_or(0);
            }
        }
        Ok(())
    }

    fn write_str_lit(&mut self, span: Span, s: &str) -> Result {
        if !s.is_empty() {
            if !span.is_dummy() {
                self.srcmap(span.lo())
            }

            self.write(None, s)?;

            let line_start_of_s = compute_line_starts(s);
            if line_start_of_s.len() > 1 {
                self.line_count = self.line_count + line_start_of_s.len() - 1;
                self.line_pos = s.len() - line_start_of_s.last().cloned().unwrap_or(0);
            }

            if !span.is_dummy() {
                self.srcmap(span.hi())
            }
        }

        Ok(())
    }

    fn write_str(&mut self, s: &str) -> Result {
        self.write(None, s)?;
        Ok(())
    }

    fn write_symbol(&mut self, span: Span, s: &str) -> Result {
        self.write(Some(span), s)?;
        Ok(())
    }

    fn write_punct(&mut self, span: Option<Span>, s: &'static str) -> Result {
        self.write(span, s)?;
        Ok(())
    }

    fn care_about_srcmap(&self) -> bool {
        self.srcmap.is_some()
    }
}

fn compute_line_starts(s: &str) -> Vec<usize> {
    let mut res = vec![];

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
