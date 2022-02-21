use std::cmp::Ordering;

use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit};

use crate::util::base54::{incr_base54, BASE54_DEFAULT_CHARS};

/// TODO: Use [u8; 64] instead
type CharFreq = AHashMap<u8, f32>;

#[derive(Debug)]
pub(crate) struct CharFreqInfo {
    frequency: CharFreq,

    chars: [u8; 64],
}

pub(crate) fn compute_char_freq(_m: &Module) -> CharFreqInfo {
    let mut base54 = CharFreqInfo {
        frequency: AHashMap::with_capacity_and_hasher(64, Default::default()),
        chars: *BASE54_DEFAULT_CHARS,
    };

    // TODO: Implement more visitor methods (or use codegen) and enable this
    // m.visit_with(&mut base54);
    base54.sort();

    base54
}

impl CharFreqInfo {
    fn consider(&mut self, s: &str, delta: f32) {
        for c in s.chars().rev().filter_map(|c| {
            if c.len_utf8() == 1 {
                let b = c as u8;
                if BASE54_DEFAULT_CHARS.contains(&b) {
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
        incr_base54(init, &self.chars)
    }
}

impl Visit for CharFreqInfo {
    noop_visit_type!();

    fn visit_ident(&mut self, i: &Ident) {
        self.consider(&i.sym, 1.0);
    }
}
