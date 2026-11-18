//! Case-insensitive matching rules of ECMAScript regular expressions.
//!
//! With the `i` flag, an engine matches a character `ch` against a set of
//! characters if the set contains a character `a` where
//! `Canonicalize(a) == Canonicalize(ch)`. To lower the `i` flag (for example
//! for the `(?i:...)` modifier), the set must be extended with every character
//! that has the same canonical form. This module computes that extension.

use regex_syntax::hir::{ClassUnicode, ClassUnicodeRange};

use crate::char_set::{CharSet, MAX_CODE_UNIT};

/// The `Canonicalize` rule that the engine uses.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum CaseMode {
    /// The `u` or `v` flag is set. Characters are canonicalized with simple
    /// case folding (`scf`).
    Unicode,
    /// No `u` or `v` flag. Code units are canonicalized with `toUppercase`,
    /// and a non-ASCII character never becomes an ASCII character.
    Legacy,
}

/// Returns `set` extended with every character that matches a member of `set`
/// case-insensitively.
pub(crate) fn case_closure(set: &CharSet, mode: CaseMode) -> CharSet {
    match mode {
        CaseMode::Unicode => simple_case_folding_closure(set),
        CaseMode::Legacy => legacy_closure(set),
    }
}

/// Returns a key that is equal for two characters if and only if they match
/// each other under simple case folding.
pub(crate) fn simple_case_folding_key(cp: u32) -> u32 {
    simple_case_folding_closure(&CharSet::single(cp)).ranges()[0].0
}

/// Extends `set` with all characters that have the same simple case folding as
/// a member of `set`.
///
/// `regex_syntax` stores the equivalence classes of simple case folding
/// (`CaseFolding.txt`, status C and S). Surrogates are not `char`s and have no
/// case mapping, so they are kept as-is.
fn simple_case_folding_closure(set: &CharSet) -> CharSet {
    let mut class = ClassUnicode::new(set.ranges().iter().filter_map(|&(start, end)| {
        // `char::from_u32` rejects surrogates, so clamp each range to the
        // scalar values around the surrogate block.
        let start = if (0xd800..=0xdfff).contains(&start) {
            0xe000
        } else {
            start
        };
        let end = if (0xd800..=0xdfff).contains(&end) {
            0xd7ff
        } else {
            end
        };
        if start > end {
            return None;
        }
        Some(ClassUnicodeRange::new(
            char::from_u32(start)?,
            char::from_u32(end)?,
        ))
    }));
    class.case_fold_simple();

    let folded = CharSet::from_ranges(
        class
            .iter()
            .map(|range| (range.start() as u32, range.end() as u32)),
    );
    set.union(&folded)
}

/// Extends `set` with the code units that match a member of `set` in a pattern
/// without the `u` or `v` flag.
///
/// Two code units match if `toUppercase` maps them to the same single code
/// unit. Every such pair also has the same simple case folding, so the
/// candidates are taken from [`simple_case_folding_closure`] and filtered with
/// the exact rule.
fn legacy_closure(set: &CharSet) -> CharSet {
    let candidates = simple_case_folding_closure(set)
        .intersection(&CharSet::from_ranges([(0, MAX_CODE_UNIT)]))
        .difference(set);

    let mut added = Vec::new();
    for cp in candidates.iter() {
        let key = legacy_canonicalize(cp);
        let matches_member = simple_case_folding_closure(&CharSet::single(cp))
            .iter()
            .any(|other| other != cp && set.contains(other) && legacy_canonicalize(other) == key);
        if matches_member {
            added.push((cp, cp));
        }
    }

    set.union(&CharSet::from_ranges(added))
}

/// `Canonicalize(rer, ch)` of ECMA-262 for a pattern without the `u` or `v`
/// flag and with the `i` flag.
fn legacy_canonicalize(cp: u32) -> u32 {
    let Some(ch) = char::from_u32(cp) else {
        // Lone surrogates have no case mapping.
        return cp;
    };

    let mut upper = ch.to_uppercase();
    let (Some(upper_ch), None) = (upper.next(), upper.next()) else {
        // The result is not a single code point.
        return cp;
    };

    let upper_cp = upper_ch as u32;
    // The result must be a single code unit, and a non-ASCII character must
    // not map to an ASCII character.
    if upper_cp > MAX_CODE_UNIT || (cp >= 128 && upper_cp < 128) {
        return cp;
    }

    upper_cp
}

#[cfg(test)]
mod tests {
    use super::*;

    fn closure_of(cp: char, mode: CaseMode) -> Vec<u32> {
        case_closure(&CharSet::single(cp as u32), mode)
            .iter()
            .collect()
    }

    #[test]
    fn unicode_mode_includes_kelvin_and_long_s() {
        assert_eq!(
            closure_of('k', CaseMode::Unicode),
            vec!['K' as u32, 'k' as u32, 0x212a]
        );
        assert_eq!(
            closure_of('s', CaseMode::Unicode),
            vec!['S' as u32, 's' as u32, 0x17f]
        );
    }

    #[test]
    fn legacy_mode_excludes_non_ascii_to_ascii() {
        assert_eq!(
            closure_of('k', CaseMode::Legacy),
            vec!['K' as u32, 'k' as u32]
        );
        assert_eq!(
            closure_of('s', CaseMode::Legacy),
            vec!['S' as u32, 's' as u32]
        );
        // σ, ς and Σ all uppercase to Σ.
        assert_eq!(closure_of('σ', CaseMode::Legacy), vec![0x3a3, 0x3c2, 0x3c3]);
    }

    #[test]
    fn surrogates_are_kept() {
        let set = CharSet::from_ranges([(0xd800, 0xdfff)]);
        assert_eq!(case_closure(&set, CaseMode::Unicode), set);
        assert_eq!(case_closure(&set, CaseMode::Legacy), set);
    }

    #[test]
    fn simple_case_folding_key_is_shared() {
        assert_eq!(
            simple_case_folding_key('K' as u32),
            simple_case_folding_key(0x212a)
        );
        assert_ne!(
            simple_case_folding_key('a' as u32),
            simple_case_folding_key('b' as u32)
        );
    }
}
