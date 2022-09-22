use std::{cmp::Reverse, io, ops::AddAssign};

use arrayvec::ArrayVec;
use rustc_hash::FxHashSet;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    sync::Lrc, BytePos, FileLines, FileName, Loc, SourceMapper, Span, SpanLinesError, SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::WriteJs, Emitter};
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

static BASE54_DEFAULT_CHARS: &[u8; 64] =
    b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";

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
}

impl CharFreq {
    pub fn scan(&mut self, s: &str, delta: i32) {
        if delta == 0 {
            return;
        }

        #[cfg(feature = "debug")]
        {
            let considered = s
                .chars()
                .filter(|&c| Ident::is_valid_continue(c))
                .collect::<String>();
            if !considered.is_empty() {
                tracing::debug!("Scanning: `{}` with delta {}", considered, delta);
            }
        }

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
        let cm = Lrc::new(DummySourceMap);

        let mut freq = Self::default();

        {
            let mut emitter = Emitter {
                cfg: swc_ecma_codegen::Config {
                    target: EsVersion::latest(),
                    ascii_only: false,
                    minify: true,
                    ..Default::default()
                },
                cm,
                comments: None,
                wr: &mut freq,
            };

            emitter.emit_program(p).unwrap();
        }

        // Subtract
        p.visit_with(&mut CharFreqAnalyzer {
            freq: &mut freq,
            preserved,
            unresolved_ctxt,
        });

        freq
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
            if (b'0'..=b'9').contains(&c) {
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
    freq: &'a mut CharFreq,
    preserved: &'a FxHashSet<Id>,
    unresolved_ctxt: SyntaxContext,
}

impl Visit for CharFreqAnalyzer<'_> {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_ident(&mut self, i: &Ident) {
        if i.sym != js_word!("arguments") && i.span.ctxt == self.unresolved_ctxt {
            return;
        }

        // It's not mangled
        if self.preserved.contains(&i.to_id()) {
            return;
        }

        self.freq.scan(&i.sym, -1);
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

/// givin a number, return a base54 encoded string
/// `usize -> [a-zA-Z$_][a-zA-Z$_0-9]*`
pub(crate) fn encode(init: &mut usize, skip_reserved: bool) -> JsWord {
    if skip_reserved {
        while init.is_reserved()
            || init.is_reserved_in_strict_bind()
            || init.is_reserved_in_strict_mode(true)
        {
            *init += 1;
        }
    }

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
    let mut c = BASE54_DEFAULT_CHARS[n / base];
    ret.push(c);

    while base > 1 {
        n %= base;
        base >>= 6;
        c = BASE54_DEFAULT_CHARS[n / base];

        ret.push(c);
    }

    let s = unsafe {
        // Safety: We are only using ascii characters
        // Safety: The stack memory for ret is alive while creating JsWord
        JsWord::from(std::str::from_utf8_unchecked(&ret))
    };

    s
}

#[allow(unused)]
pub(crate) fn decode(s: &str) -> usize {
    let mut ret = 0;

    let mut base = 54;

    for _ in 0..(s.len() - 1) {
        ret += base;
        base <<= 6;
    }

    let mut x = 0;

    for c in s.as_bytes().iter() {
        x <<= 6;
        x += reverse_base54(*c);
    }

    ret += x;

    ret
}

fn reverse_base54(c: u8) -> usize {
    match &c {
        b'a'..=b'z' => (c - b'a').into(),
        b'A'..=b'Z' => (c - b'A' + 26).into(),
        b'$' => 52,
        b'_' => 53,
        b'0'..=b'9' => (c - b'0' + 54).into(),
        _ => panic!("invalid base54 char: {}", c as char),
    }
}

trait Reserved {
    fn is_reserved(&self) -> bool;

    fn is_reserved_in_strict_mode(&self, is_module: bool) -> bool;

    fn is_reserved_in_strict_bind(&self) -> bool;

    fn is_reserved_in_es3(&self) -> bool;
}

const RESERVED: [usize; 24] = [
    260,        // do
    571,        // if
    579,        // in
    24903,      // for
    57036,      // new
    82446,      // try
    89543,      // var
    750138,     // case
    1319482,    // else
    1327810,    // enum
    3715201,    // null
    5234632,    // this
    5276346,    // true
    5787577,    // void
    6025853,    // with
    35630528,   // break
    48012861,   // catch
    50819656,   // class
    51659337,   // const
    98312762,   // false
    321674951,  // super
    335053132,  // throw
    385347706,  // while
    4211585658, // delete
];

const AWAIT: usize = 20148169;

const RESERVED_IN_STRICT_MODE: [usize; 2] = [
    48841,     // let
    419147897, // yield
];

const EVAL: usize = 1359297;

const RESERVED_IN_ES3: [usize; 8] = [
    37129,     // int
    586362,    // byte
    777671,    // char
    1856132,   // goto
    3166460,   // long
    100416961, // final
    101207497, // float
    318263817, // short
];

impl Reserved for usize {
    fn is_reserved(&self) -> bool {
        RESERVED.contains(self)
    }

    fn is_reserved_in_strict_mode(&self, is_module: bool) -> bool {
        if is_module && *self == AWAIT {
            return true;
        }

        RESERVED_IN_STRICT_MODE.contains(self)
    }

    fn is_reserved_in_strict_bind(&self) -> bool {
        *self == EVAL
    }

    fn is_reserved_in_es3(&self) -> bool {
        RESERVED_IN_ES3.contains(self)
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_ast::IdentExt;
    use tracing::debug;

    use super::*;

    struct Tester {
        n: usize,
    }

    impl Tester {
        fn incr(&mut self, n: usize) {
            self.n += n;
        }

        fn gen(&mut self, expected: &str) {
            let generated = encode(&mut self.n, true);
            assert_eq!(&*generated, expected);
        }
    }

    #[test]
    fn simple() {
        let mut t = Tester { n: 0 };

        t.gen("a");
        t.gen("b");
        t.incr(54 - 2);
        t.gen("aa");
    }

    #[cfg(not(target_arch = "wasm32"))]
    #[test]
    fn generate_reserved() {
        [
            "break",
            "case",
            "catch",
            "class",
            "const",
            "continue",
            "debugger",
            "default",
            "delete",
            "do",
            "else",
            "enum",
            "export",
            "extends",
            "false",
            "finally",
            "for",
            "function",
            "if",
            "import",
            "in",
            "instanceof",
            "new",
            "null",
            "package",
            "return",
            "super",
            "switch",
            "this",
            "throw",
            "true",
            "try",
            "typeof",
            "var",
            "void",
            "while",
            "with",
        ]
        .iter()
        .for_each(|s| {
            debug!("{}, // {}", decode(s), s);
        })
    }

    #[cfg(not(target_arch = "wasm32"))]
    #[test]
    fn generate_reserved_in_strict_mode() {
        let s = "await";
        debug!("{}, // {}", decode(s), s);

        [
            "implements",
            "interface",
            "let",
            "package",
            "private",
            "protected",
            "public",
            "static",
            "yield",
        ]
        .iter()
        .for_each(|s| {
            debug!("{}, // {}", decode(s), s);
        })
    }

    #[cfg(not(target_arch = "wasm32"))]
    #[test]
    fn generate_reserved_in_strict_bind() {
        ["eval", "arguments"].iter().for_each(|s| {
            debug!("{}, // {}", decode(s), s);
        })
    }

    #[cfg(not(target_arch = "wasm32"))]
    #[test]
    fn generate_reserved_in_es3() {
        [
            "abstract",
            "boolean",
            "byte",
            "char",
            "double",
            "final",
            "float",
            "goto",
            "int",
            "long",
            "native",
            "short",
            "synchronized",
            "throws",
            "transient",
            "volatile",
        ]
        .iter()
        .for_each(|s| {
            debug!("{}, // {}", decode(s), s);
        })
    }

    #[test]
    fn is_reserved() {
        RESERVED.iter().for_each(|n| {
            let mut init = *n;
            let gen = encode(&mut init, false);
            assert!(gen.is_reserved());
        })
    }

    #[test]
    fn is_reserved_in_strict_mode() {
        let mut init = AWAIT;

        let gen = encode(&mut init, false);
        assert!(gen.is_reserved_in_strict_mode(true));

        RESERVED_IN_STRICT_MODE.iter().for_each(|n| {
            let mut init = *n;

            let gen = encode(&mut init, false);
            assert!(gen.is_reserved_in_strict_mode(false));
        })
    }

    #[test]
    fn is_reserved_in_strict_bind() {
        let mut init = EVAL;

        let gen = encode(&mut init, false);
        assert!(gen.is_reserved_in_strict_bind());
    }

    #[test]
    fn is_reserved_in_es3() {
        RESERVED_IN_ES3.iter().for_each(|n| {
            let mut init = *n;

            let gen = encode(&mut init, false);
            assert!(gen.is_reserved_in_es3());
        })
    }

    #[test]
    fn skip_reserved() {
        let mut init = RESERVED[0];
        let target = init + 2;
        let gen = encode(&mut init, true);
        assert_eq!(&*gen, "dp");
        assert_eq!(init, target);
    }

    #[test]
    fn perf_1() {
        let mut t = Tester { n: 0 };

        t.incr(54);
        t.gen("aa");
    }

    #[test]
    fn perf_2() {
        let mut t = Tester { n: 0 };

        t.incr(54 * 64 * 64 * 64 * 64 * 64 * 64 * 64);
        t.gen("_jjjjjjk")
    }
}
