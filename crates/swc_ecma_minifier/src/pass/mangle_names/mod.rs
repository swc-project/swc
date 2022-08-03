use std::{cmp::Reverse, ops::AddAssign};

use arrayvec::ArrayVec;
use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::{chain, sync::Lrc, SourceMap};
use swc_ecma_ast::{Module, *};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
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

impl CharFreq {
    pub fn scan(&mut self, s: &str, delta: i32) {
        if delta == 0 {
            return;
        }

        for c in s.chars() {
            match c {
                'a'..='z' => {
                    self.0[c as usize - 'a' as usize] += delta;
                }
                'A'..='Z' => {
                    self.0[c as usize - 'A' as usize + 26] += delta;
                }
                '0'..='9' => {
                    self.0[c as usize - '0' as usize + 52] += delta;
                }
                '_' => {
                    self.0[62] += delta;
                }
                '$' => {
                    self.0[63] += delta;
                }

                _ => {}
            }
        }
    }

    pub fn compute(p: &Program) -> Self {
        let mut buf = vec![];
        let cm = Lrc::new(SourceMap::default());

        {
            let mut emitter = Emitter {
                cfg: Default::default(),
                cm: cm.clone(),
                comments: None,
                wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
            };

            emitter.emit_program(p).unwrap();
        }

        let code = String::from_utf8(buf).unwrap();

        let mut freq = Self::default();

        freq.scan(&code, 1);

        // Subtract
        p.visit_with(&mut freq);

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

impl Visit for CharFreq {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_ident(&mut self, i: &Ident) {
        self.scan(&i.sym, -1);
    }

    fn visit_str(&mut self, s: &Str) {
        self.scan(&s.value, -1);
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
    let base54 = CharFreq::compute(program).compile();

    chain!(
        self::private_name::private_name_mangler(options.keep_private_props),
        renamer(Default::default(), ManglingRenamer { options, base54 })
    )
}

struct ManglingRenamer {
    options: MangleOptions,
    base54: Base54Chars,
}

impl Renamer for ManglingRenamer {
    const PARALLEL: bool = true;
    const RESET_N: bool = false;

    fn preserved_ids_for_module(&mut self, n: &Module) -> FxHashSet<Id> {
        idents_to_preserve(self.options.clone(), n)
    }

    fn preserved_ids_for_script(&mut self, n: &Script) -> FxHashSet<Id> {
        idents_to_preserve(self.options.clone(), n)
    }

    fn new_name_for(&self, _: &Id, n: &mut usize) -> JsWord {
        self.base54.encode(n, true)
    }
}
