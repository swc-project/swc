use std::{cmp::Reverse, io, ops::AddAssign};

use arrayvec::ArrayVec;
use swc_atoms::Atom;
use swc_common::{
    sync::Lrc, BytePos, FileLines, FileName, Loc, SourceMapper, Span, SpanLinesError,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::WriteJs, Emitter};

#[derive(Clone, Copy)]

pub(crate) struct CharFreq([i32; 256]);

#[derive(Clone, Copy)]
pub(crate) struct Base54Chars {
    chars: [u8; 64],
}

impl Default for CharFreq {
    fn default() -> Self {
        CharFreq([0; 256])
    }
}

struct DummySourceMap;

impl SourceMapper for DummySourceMap {
    fn lookup_char_pos(&self, _: BytePos) -> Loc {
        unreachable!()
    }

    fn span_to_lines(&self, _: Span) -> Result<FileLines, Box<SpanLinesError>> {
        unreachable!()
    }

    fn span_to_string(&self, _: Span) -> String {
        String::new()
    }

    fn span_to_filename(&self, _: Span) -> Lrc<FileName> {
        FileName::Anon.into()
    }

    fn merge_spans(&self, _: Span, _: Span) -> Option<Span> {
        None
    }

    fn call_span_if_macro(&self, sp: Span) -> Span {
        sp
    }

    fn doctest_offset_line(&self, line: usize) -> usize {
        line
    }

    fn span_to_snippet(&self, _: Span) -> Result<String, Box<swc_common::SpanSnippetError>> {
        Ok(String::new())
    }
}

impl SourceMapperExt for DummySourceMap {
    fn get_code_map(&self) -> &dyn SourceMapper {
        self
    }
}

impl CharFreq {
    #[inline(always)]
    fn write(&mut self, data: &str) -> io::Result<()> {
        self.scan(data, 1);
        Ok(())
    }
}

impl WriteJs for CharFreq {
    #[inline(always)]
    fn increase_indent(&mut self) -> io::Result<()> {
        Ok(())
    }

    #[inline(always)]
    fn decrease_indent(&mut self) -> io::Result<()> {
        Ok(())
    }

    #[inline(always)]
    fn write_semi(&mut self, _: Option<Span>) -> io::Result<()> {
        Ok(())
    }

    #[inline(always)]
    fn write_space(&mut self) -> io::Result<()> {
        Ok(())
    }

    #[inline(always)]
    fn write_keyword(&mut self, _: Option<Span>, s: &'static str) -> io::Result<()> {
        self.write(s)?;
        Ok(())
    }

    #[inline(always)]
    fn write_operator(&mut self, _: Option<Span>, s: &str) -> io::Result<()> {
        self.write(s)?;
        Ok(())
    }

    #[inline(always)]
    fn write_param(&mut self, s: &str) -> io::Result<()> {
        self.write(s)?;
        Ok(())
    }

    #[inline(always)]
    fn write_property(&mut self, s: &str) -> io::Result<()> {
        self.write(s)?;
        Ok(())
    }

    #[inline(always)]
    fn write_line(&mut self) -> io::Result<()> {
        Ok(())
    }

    #[inline(always)]
    fn write_lit(&mut self, _: Span, s: &str) -> io::Result<()> {
        self.write(s)?;

        Ok(())
    }

    #[inline(always)]
    fn write_comment(&mut self, s: &str) -> io::Result<()> {
        self.write(s)?;

        Ok(())
    }

    #[inline(always)]
    fn write_str_lit(&mut self, _: Span, s: &str) -> io::Result<()> {
        self.write(s)?;

        Ok(())
    }

    #[inline(always)]
    fn write_str(&mut self, s: &str) -> io::Result<()> {
        self.write(s)?;
        Ok(())
    }

    #[inline(always)]
    fn write_symbol(&mut self, _: Span, s: &str) -> io::Result<()> {
        self.write(s)?;
        Ok(())
    }

    #[inline(always)]
    fn write_punct(
        &mut self,
        _: Option<Span>,
        s: &'static str,
        _commit_pending_semi: bool,
    ) -> io::Result<()> {
        self.write(s)?;
        Ok(())
    }

    #[inline(always)]
    fn care_about_srcmap(&self) -> bool {
        false
    }

    #[inline(always)]
    fn add_srcmap(&mut self, _: BytePos) -> io::Result<()> {
        Ok(())
    }

    #[inline(always)]
    fn commit_pending_semi(&mut self) -> io::Result<()> {
        Ok(())
    }

    #[inline(always)]
    fn can_ignore_invalid_unicodes(&mut self) -> bool {
        true
    }
}

impl CharFreq {
    pub fn scan(&mut self, s: &str, delta: i32) {
        if delta == 0 {
            return;
        }

        for &c in s.as_bytes() {
            self.0[c as usize] += delta;
        }
    }

    pub fn compute(p: &Program, idents: &Vec<Atom>) -> Self {
        let mut a = {
            let cm = Lrc::new(DummySourceMap);
            let mut freq = Self::default();

            {
                let mut emitter = Emitter {
                    cfg: swc_ecma_codegen::Config::default()
                        .with_target(EsVersion::latest())
                        .with_minify(true),
                    cm,
                    comments: None,
                    wr: &mut freq,
                };

                emitter.emit_program(p).unwrap();
            }

            freq
        };

        let mut analyzer = CharFreqAnalyzer {
            freq: Default::default(),
        };

        for ident in idents {
            analyzer.freq.scan(ident, -1);
        }

        a += analyzer.freq;

        a
    }

    pub fn compile(self) -> Base54Chars {
        static BASE54_DEFAULT_CHARS: &[u8; 64] =
            b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";

        let mut arr = BASE54_DEFAULT_CHARS
            .iter()
            .copied()
            .map(|c| (self.0[c as usize], c))
            .collect::<Vec<_>>();

        arr.sort_by_key(|&(freq, _)| Reverse(freq));

        let mut digits = Vec::with_capacity(10);
        let mut alpha = Vec::with_capacity(54);
        let mut all = Vec::with_capacity(64);

        for (_, c) in arr {
            if c.is_ascii_digit() {
                digits.push(c);
            } else {
                alpha.push(c);
            }
        }
        all.extend_from_slice(&alpha);
        all.extend_from_slice(&digits);

        #[cfg(feature = "debug")]
        tracing::info!("Chars: {}", String::from_utf8_lossy(&all));

        Base54Chars {
            chars: all.try_into().unwrap(),
        }
    }
}

struct CharFreqAnalyzer {
    freq: CharFreq,
}

impl AddAssign for CharFreq {
    fn add_assign(&mut self, rhs: Self) {
        for i in 0..256 {
            self.0[i] += rhs.0[i];
        }
    }
}

impl Base54Chars {
    /// givin a number, return a base54 encoded string
    /// `usize -> [a-zA-Z$_][a-zA-Z$_0-9]*`
    pub(crate) fn encode(&self, init: &mut usize, skip_reserved: bool) -> Atom {
        let mut n = *init;

        *init += 1;

        let mut base = 54;

        while n >= base {
            n -= base;
            base <<= 6;
        }

        // Not sure if this is ideal, but it's safe
        let mut ret: ArrayVec<_, 14> = ArrayVec::new();

        base /= 54;
        let mut c = self.chars[n / base];
        ret.push(c);

        while base > 1 {
            n %= base;
            base >>= 6;
            c = self.chars[n / base];

            ret.push(c);
        }

        let s = unsafe {
            // Safety: We are only using ascii characters
            // Safety: The stack memory for ret is alive while creating Atom
            Atom::from(std::str::from_utf8_unchecked(&ret))
        };

        if skip_reserved
            && (s.is_reserved()
                || s.is_reserved_in_strict_bind()
                || s.is_reserved_in_strict_mode(true))
        {
            return self.encode(init, skip_reserved);
        }

        s
    }
}
