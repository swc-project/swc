use std::cmp::Ordering;

use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

/// TODO: Use [u8; 64] instead
type CharFreq = AHashMap<u8, f32>;

#[derive(Debug)]
pub(crate) struct CharFreqInfo {
    frequency: CharFreq,

    chars: [u8; 64],
}

static CHARS: &[u8; 64] = b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";

pub(crate) fn compute_char_freq(m: &Module) -> CharFreqInfo {
    let mut base54 = CharFreqInfo {
        frequency: AHashMap::with_capacity_and_hasher(64, Default::default()),
        chars: *CHARS,
    };

    m.visit_with(&mut base54);
    base54.sort();

    base54
}

impl CharFreqInfo {
    fn consider(&mut self, s: &str, delta: f32) {
        for c in s.chars().rev().filter_map(|c| {
            if c.len_utf8() == 1 {
                let b = c as u8;
                if CHARS.contains(&b) {
                    return Some(b);
                }

                None
            } else {
                None
            }
        }) {
            let freq = self.frequency.entry(c).or_insert(0.0);
            *freq += delta;
        }
    }

    fn sort(&mut self) {
        fn cmp(f: &CharFreq, a: u8, b: u8) -> Ordering {
            let af = f.get(&a).copied().unwrap_or(0.0);
            let bf = f.get(&b).copied().unwrap_or(0.0);

            af.partial_cmp(&bf).unwrap_or_else(|| a.cmp(&b))
        }

        self.chars[..53].sort_by(|&a, &b| cmp(&self.frequency, a, b));
        self.chars[53..].sort_by(|&a, &b| cmp(&self.frequency, a, b));
    }

    /// returns `(used_value, identifier_symbol)`
    pub fn incr_base54(&self, init: &mut usize) -> (usize, String) {
        let mut n = *init;

        *init += 1;

        let mut ret = String::new();
        let mut base = 54;

        n += 1;

        while n > 0 {
            n -= 1;

            let c = self.chars[n % base] as char;

            if ret.is_empty() && c.is_digit(10) {
                return self.incr_base54(init);
            }

            ret.push(c);

            n /= base;
            base = 64;
        }

        if ret.is_reserved()
            || ret.is_reserved_in_strict_bind()
            || ret.is_reserved_in_strict_mode(true)
        {
            return self.incr_base54(init);
        }

        (*init - 1, ret)
    }
}

impl Visit for CharFreqInfo {
    noop_visit_type!();

    fn visit_ident(&mut self, i: &Ident) {
        self.consider(&i.sym, 1.0);
    }
}
