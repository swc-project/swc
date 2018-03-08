use super::{Result, Symbol, TextWriter};
use std::io::{self, Write};

///
/// -----
///
/// Ported from `createTextWriter` of the typescript compiler.
///
/// https://github.com/Microsoft/TypeScript/blob/45eaf42006/src/compiler/utilities.ts#L2548
#[derive(Debug, Clone)]
pub struct WriterWrapper<'a, W: Write> {
    indent: usize,
    line_start: bool,
    line_count: usize,
    line_pos: usize,
    new_line: &'a str,
    wr: W,
    written_bytes: usize,
}

impl<'a, W: Write> WriterWrapper<'a, W> {
    pub fn new(new_line: &'a str, wr: W) -> Self {
        WriterWrapper {
            indent: Default::default(),
            line_start: Default::default(),
            line_count: Default::default(),
            line_pos: Default::default(),
            new_line,
            wr,
            written_bytes: 0,
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
        self.written_bytes += written;
        Ok(written)
    }
}

impl<'a, W: Write> Write for WriterWrapper<'a, W> {
    fn write(&mut self, data: &[u8]) -> io::Result<usize> {
        let mut cnt = 0;

        if data.len() > 0 {
            if self.line_start {
                cnt += self.write_indent_string()?;
                self.line_start = false;
            }
            cnt += self.raw_write(data)?;
        }

        Ok(cnt)
    }

    fn flush(&mut self) -> io::Result<()> {
        self.wr.flush()
    }
}

impl<'a, W: Write> TextWriter for WriterWrapper<'a, W> {
    fn increase_indent(&mut self) -> Result {
        self.indent += 1;
        Ok(())
    }
    fn decrease_indent(&mut self) -> Result {
        self.indent -= 1;
        Ok(())
    }

    fn write_semi(&mut self) -> Result {
        self.write(b";")?;
        Ok(())
    }

    fn write_space(&mut self) -> Result {
        self.write(b"")?;
        Ok(())
    }

    fn write_keyword(&mut self, s: &'static str) -> Result {
        self.write(s.as_bytes())?;
        Ok(())
    }

    fn write_operator(&mut self, s: &str) -> Result {
        self.write(s.as_bytes())?;
        Ok(())
    }

    fn write_param(&mut self, s: &str) -> Result {
        self.write(s.as_bytes())?;
        Ok(())
    }

    fn write_property(&mut self, s: &str) -> Result {
        self.write(s.as_bytes())?;
        Ok(())
    }

    fn write_line(&mut self) -> Result {
        if !self.line_start {
            self.raw_write(self.new_line.as_bytes())?;
            self.line_count += 1;
            self.line_pos = self.written_bytes;
            self.line_start = true;
        }

        Ok(())
    }

    fn write_lit(&mut self, s: &str) -> Result {
        if !s.is_empty() {
            self.write(s.as_bytes())?;

            let line_start_of_s = compute_line_starts(s);
            if line_start_of_s.len() > 1 {
                self.line_count = self.line_count + line_start_of_s.len() - 1;
                self.line_pos =
                    self.written_bytes - s.len() + line_start_of_s.last().cloned().unwrap_or(0);
            }
        }

        Ok(())
    }

    fn write_str_lit(&mut self, s: &str) -> Result {
        self.write(s.as_bytes())?;
        Ok(())
    }

    fn write_symbol(&mut self, s: &str, _: &Symbol) -> Result {
        self.write(s.as_bytes())?;
        Ok(())
    }

    fn write_punct(&mut self, s: &'static str) -> Result {
        self.write(s.as_bytes())?;
        Ok(())
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
                line_start = pos;
                break;
            }

            _ => {
                // if c > MAX_ASCII_CHAR && is_line_break(c) {
                //     res.push(line_start);
                //     line_start = pos;
                // }
                unimplemented!()
            }
        }
    }

    // Last line.
    res.push(line_start);
    res
}
