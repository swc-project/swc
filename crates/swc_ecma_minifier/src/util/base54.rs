use std::{cmp::Reverse, io, ops::AddAssign};

use arrayvec::ArrayVec;
use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::{
    sync::Lrc, BytePos, FileLines, FileName, Loc, SourceMapper, Span, SpanLinesError, SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::WriteJs, Emitter};
use swc_ecma_utils::parallel::{cpu_count, Parallel, ParallelExt};
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

#[derive(Clone, Copy)]

pub(crate) struct CharFreq([i32; 64]);

#[derive(Clone, Copy)]
pub(crate) struct Base54Chars {
    chars: [u8; 64],
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
    fn write_punct(&mut self, _: Option<Span>, s: &'static str) -> io::Result<()> {
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

        // #[cfg(feature = "debug")]
        // {
        //     let considered = s
        //         .chars()
        //         .filter(|&c| Ident::is_valid_continue(c))
        //         .collect::<String>();
        //     if !considered.is_empty() {
        //         tracing::debug!("Scanning: `{}` with delta {}", considered, delta);
        //     }
        // }

        for &c in s.as_bytes() {
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
                b'$' => {
                    self.0[62] += delta;
                }
                b'_' => {
                    self.0[63] += delta;
                }

                _ => {}
            }
        }
    }

    pub fn compute(p: &Program, preserved: &FxHashSet<Id>, unresolved_ctxt: SyntaxContext) -> Self {
        let (mut a, b) = swc_parallel::join(
            || {
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
            },
            || {
                let mut visitor = CharFreqAnalyzer {
                    freq: Default::default(),
                    preserved,
                    unresolved_ctxt,
                };

                // Subtract
                p.visit_with(&mut visitor);

                visitor.freq
            },
        );

        a += b;

        a
    }

    pub fn compile(self) -> Base54Chars {
        static BASE54_DEFAULT_CHARS: &[u8; 64] =
            b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";

        let mut arr = BASE54_DEFAULT_CHARS
            .iter()
            .copied()
            .enumerate()
            .map(|(idx, c)| (self.0[idx], c))
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

struct CharFreqAnalyzer<'a> {
    freq: CharFreq,
    preserved: &'a FxHashSet<Id>,
    unresolved_ctxt: SyntaxContext,
}

impl Parallel for CharFreqAnalyzer<'_> {
    fn create(&self) -> Self {
        Self {
            freq: Default::default(),
            ..*self
        }
    }

    fn merge(&mut self, other: Self) {
        self.freq += other.freq;
    }
}

impl Visit for CharFreqAnalyzer<'_> {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_class_members(&mut self, members: &[ClassMember]) {
        self.maybe_par(cpu_count() * 8, members, |v, member| {
            member.visit_with(v);
        });
    }

    fn visit_expr_or_spreads(&mut self, n: &[ExprOrSpread]) {
        self.maybe_par(cpu_count() * 8, n, |v, n| {
            n.visit_with(v);
        });
    }

    fn visit_exprs(&mut self, exprs: &[Box<Expr>]) {
        self.maybe_par(cpu_count() * 8, exprs, |v, expr| {
            expr.visit_with(v);
        });
    }

    fn visit_ident(&mut self, i: &Ident) {
        if i.ctxt == self.unresolved_ctxt && i.sym != "arguments" {
            return;
        }

        // It's not mangled
        if self.preserved.contains(&i.to_id()) {
            return;
        }

        self.freq.scan(&i.sym, -1);
    }

    /// This is preserved anyway
    fn visit_module_export_name(&mut self, _: &ModuleExportName) {}

    fn visit_module_items(&mut self, items: &[ModuleItem]) {
        self.maybe_par(cpu_count() * 8, items, |v, item| {
            item.visit_with(v);
        });
    }

    fn visit_opt_vec_expr_or_spreads(&mut self, n: &[Option<ExprOrSpread>]) {
        self.maybe_par(cpu_count() * 8, n, |v, n| {
            n.visit_with(v);
        });
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

    fn visit_prop_or_spreads(&mut self, n: &[PropOrSpread]) {
        self.maybe_par(cpu_count() * 8, n, |v, n| {
            n.visit_with(v);
        });
    }

    fn visit_stmts(&mut self, stmts: &[Stmt]) {
        self.maybe_par(cpu_count() * 8, stmts, |v, stmt| {
            stmt.visit_with(v);
        });
    }
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
