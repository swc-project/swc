use std::{
    cmp::Reverse,
    io::{self, Write},
    ops::AddAssign,
};

use arrayvec::ArrayVec;
use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::{
    chain, sync::Lrc, BytePos, FileLines, FileName, Loc, SourceMapper, Span, SpanLinesError,
};
use swc_ecma_ast::{Module, *};
use swc_ecma_codegen::{text_writer::WriteJs, Emitter};
use swc_ecma_transforms_base::rename::{renamer, Renamer};
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitMut, VisitWith};

use self::preserver::idents_to_preserve;
use crate::option::MangleOptions;

mod preserver;
mod private_name;

#[derive(Clone, Copy)]

pub(crate) struct CharFreq([i32; 64]);

#[derive(Clone, Copy)]
pub(crate) struct Base54Chars {
    head: [u8; 54],
    tail: [u8; 64],
}

impl Default for CharFreq {
    fn default() -> Self {
        CharFreq([0; 64])
    }
}

struct DummySourceMap;

impl SourceMapper for DummySourceMap {
    fn lookup_char_pos(&self, _: BytePos) -> Loc {
        unreachable!()
    }

    fn span_to_lines(&self, _: Span) -> Result<FileLines, SpanLinesError> {
        unreachable!()
    }

    fn span_to_string(&self, _: Span) -> String {
        String::new()
    }

    fn span_to_filename(&self, _: Span) -> FileName {
        FileName::Anon
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

    fn span_to_snippet(&self, _: Span) -> Result<String, swc_common::SpanSnippetError> {
        Ok(String::new())
    }
}

impl SourceMapperExt for DummySourceMap {
    fn get_code_map(&self) -> &dyn SourceMapper {
        self
    }
}

impl Write for CharFreq {
    fn write(&mut self, buf: &[u8]) -> io::Result<usize> {
        self.scan(buf, 1);
        Ok(buf.len())
    }

    fn flush(&mut self) -> io::Result<()> {
        Ok(())
    }
}

impl CharFreq {
    fn raw_write(&mut self, data: &str) -> io::Result<usize> {
        self.wr.write_all(data.as_bytes())?;
        Ok(())
    }

    fn write(&mut self, span: Option<Span>, data: &str) -> io::Result<()> {
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
                .insert((byte_pos, self.line_count as _, self.line_pos as _))
            {
                let loc = LineCol {
                    line: self.line_count as _,
                    col: self.line_pos as _,
                };
                srcmap.push((byte_pos, loc));
            }
        }
    }
}

impl WriteJs for CharFreq {
    fn increase_indent(&mut self) -> Result {
        Ok(())
    }

    fn decrease_indent(&mut self) -> Result {
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
        let pending = self.pending_srcmap.take();
        if !self.line_start {
            self.raw_write(self.new_line)?;
            self.line_count += 1;
            self.line_pos = 0;
            self.line_start = true;

            if let Some(pending) = pending {
                self.srcmap(pending)
            }
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
                let last_line_byte_index = line_start_of_s.last().cloned().unwrap_or(0);
                self.line_pos = s[last_line_byte_index..].chars().count();
            }

            if !span.is_dummy() {
                self.srcmap(span.hi())
            }
        }

        Ok(())
    }

    fn write_comment(&mut self, s: &str) -> Result {
        self.write(None, s)?;
        {
            let line_start_of_s = compute_line_starts(s);
            if line_start_of_s.len() > 1 {
                self.line_count = self.line_count + line_start_of_s.len() - 1;
                let last_line_byte_index = line_start_of_s.last().cloned().unwrap_or(0);
                self.line_pos = s[last_line_byte_index..].chars().count();
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
                let last_line_byte_index = line_start_of_s.last().cloned().unwrap_or(0);
                self.line_pos = s[last_line_byte_index..].chars().count();
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

    fn add_srcmap(&mut self, pos: BytePos) -> Result {
        if self.line_start {
            self.pending_srcmap = Some(pos);
        } else {
            self.srcmap(pos);
        }
        Ok(())
    }

    fn commit_pending_semi(&mut self) -> Result {
        Ok(())
    }
}

impl CharFreq {
    pub fn scan(&mut self, s: &[u8], delta: i32) {
        if delta == 0 {
            return;
        }

        for &c in s {
            match c {
                b'a'..=b'z' => {
                    self.0[c as usize - 'a' as usize] += delta;
                }
                b'A'..=b'Z' => {
                    self.0[c as usize - 'A' as usize + 26] += delta;
                }
                b'0'..=b'9' => {
                    self.0[c as usize - '0' as usize + 52] += delta;
                }
                b'_' => {
                    self.0[62] += delta;
                }
                b'$' => {
                    self.0[63] += delta;
                }

                _ => {}
            }
        }
    }

    pub fn compute(p: &Program, preserved: &FxHashSet<Id>) -> Self {
        let cm = Lrc::new(DummySourceMap);

        let mut freq = Self::default();

        {
            let mut emitter = Emitter {
                cfg: Default::default(),
                cm,
                comments: None,
                wr: SimpleJsWriter::new(Default::default(), "\n", &mut freq, None),
            };

            emitter.emit_program(p).unwrap();
        }

        // Subtract
        p.visit_with(&mut CharFreqAnalyzer {
            freq: &mut freq,
            preserved,
        });

        freq
    }

    pub fn compile(self) -> Base54Chars {
        static BASE54_DEFAULT_CHARS: &[u8; 64] =
            b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";

        let mut arr = BASE54_DEFAULT_CHARS
            .iter()
            .copied()
            .enumerate()
            .map(|(idx, c)| (self.0[idx], c))
            .collect::<Vec<_>>();

        arr.sort_by_key(|&(freq, _)| Reverse(freq));

        let mut head = vec![];
        let mut tail = vec![];

        for (_, c) in arr {
            if !(b'0'..=b'9').contains(&c) {
                head.push(c);
            }
            tail.push(c);
        }

        Base54Chars {
            head: head.try_into().unwrap(),
            tail: tail.try_into().unwrap(),
        }
    }
}

struct CharFreqAnalyzer<'a> {
    freq: &'a mut CharFreq,
    preserved: &'a FxHashSet<Id>,
}

impl Visit for CharFreqAnalyzer<'_> {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_ident(&mut self, i: &Ident) {
        // It's not mangled
        if self.preserved.contains(&i.to_id()) {
            return;
        }

        self.freq.scan(i.sym.as_bytes(), -1);
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        match n {
            PropName::Ident(_) => {}
            PropName::Str(_) => {}
            PropName::Num(_) => {}
            PropName::Computed(e) => e.visit_with(self),
            PropName::BigInt(_) => {}
        }
    }

    /// This is preserved anyway
    fn visit_module_export_name(&mut self, _: &ModuleExportName) {}
}

impl AddAssign for CharFreq {
    fn add_assign(&mut self, rhs: Self) {
        for i in 0..64 {
            self.0[i] += rhs.0[i];
        }
    }
}

impl Base54Chars {
    /// givin a number, return a base54 encoded string
    /// `usize -> [a-zA-Z$_][a-zA-Z$_0-9]*`
    pub(crate) fn encode(&self, init: &mut usize, skip_reserved: bool) -> JsWord {
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
        let mut c = self.head[n / base];
        ret.push(c);

        while base > 1 {
            n %= base;
            base >>= 6;
            c = self.tail[n / base];

            ret.push(c);
        }

        let s = unsafe {
            // Safety: We are only using ascii characters
            // Safety: The stack memory for ret is alive while creating JsWord
            JsWord::from(std::str::from_utf8_unchecked(&ret))
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

pub(crate) fn name_mangler(options: MangleOptions, program: &Program) -> impl VisitMut {
    let preserved = idents_to_preserve(options.clone(), program);

    let base54 = CharFreq::compute(program, &preserved).compile();

    chain!(
        self::private_name::private_name_mangler(options.keep_private_props),
        renamer(Default::default(), ManglingRenamer { base54, preserved })
    )
}

struct ManglingRenamer {
    base54: Base54Chars,
    preserved: FxHashSet<Id>,
}

impl Renamer for ManglingRenamer {
    const PARALLEL: bool = true;
    const RESET_N: bool = false;

    fn preserved_ids_for_module(&mut self, _: &Module) -> FxHashSet<Id> {
        self.preserved.clone()
    }

    fn preserved_ids_for_script(&mut self, _: &Script) -> FxHashSet<Id> {
        self.preserved.clone()
    }

    fn new_name_for(&self, _: &Id, n: &mut usize) -> JsWord {
        self.base54.encode(n, true)
    }
}
