//! Case-insensitive matching rules of ECMAScript regular expressions.
//!
//! With the `i` flag, an engine matches a character `ch` against a set of
//! characters if the set contains a character `a` where
//! `Canonicalize(a) == Canonicalize(ch)`. To lower the `i` flag (for example
//! for the `(?i:...)` modifier), the set must be extended with every character
//! that has the same canonical form. This module computes that extension.

use std::{collections::HashMap, sync::OnceLock};

use icu_casemap::CaseMapper;
use icu_locale_core::LanguageIdentifier;

use crate::char_set::{CharSet, MAX_CODE_POINT, MAX_CODE_UNIT};

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

/// Returns `scf(cp)`, the simple case folding of `cp`. Two characters match
/// each other under simple case folding if and only if they have the same
/// key.
pub(crate) fn simple_case_folding_key(cp: u32) -> u32 {
    match char::from_u32(cp) {
        Some(ch) => CaseMapper::new().simple_fold(ch) as u32,
        // Lone surrogates have no case mapping.
        None => cp,
    }
}

/// The equivalence classes of simple case folding that have more than one
/// member. The data comes from ICU, the same source as the Unicode property
/// data of this crate, so both use the same Unicode version.
struct FoldClasses {
    /// Every member of a class, with the index of its class, sorted by code
    /// point.
    members: Vec<(u32, usize)>,
    /// The members of each class, sorted.
    classes: Vec<Vec<u32>>,
}

impl FoldClasses {
    /// Builds the classes once, by folding every code point.
    fn get() -> &'static Self {
        static CLASSES: OnceLock<FoldClasses> = OnceLock::new();

        CLASSES.get_or_init(|| {
            let mapper = CaseMapper::new();
            let mut by_fold: HashMap<u32, Vec<u32>> = HashMap::new();
            for cp in 0..=MAX_CODE_POINT {
                let Some(ch) = char::from_u32(cp) else {
                    continue;
                };
                let folded = mapper.simple_fold(ch) as u32;
                if folded != cp {
                    by_fold
                        .entry(folded)
                        .or_insert_with(|| vec![folded])
                        .push(cp);
                }
            }

            let mut classes: Vec<Vec<u32>> = by_fold
                .into_values()
                .map(|mut class| {
                    class.sort_unstable();
                    class
                })
                .collect();
            classes.sort_unstable();

            let mut members: Vec<(u32, usize)> = classes
                .iter()
                .enumerate()
                .flat_map(|(idx, class)| class.iter().map(move |&cp| (cp, idx)))
                .collect();
            members.sort_unstable();

            FoldClasses { members, classes }
        })
    }

    /// Returns the class of `cp`, or `None` if `cp` matches only itself.
    fn class_of(&self, cp: u32) -> Option<&[u32]> {
        let idx = self
            .members
            .binary_search_by_key(&cp, |&(member, _)| member)
            .ok()?;
        Some(&self.classes[self.members[idx].1])
    }
}

/// Extends `set` with all characters that have the same simple case folding as
/// a member of `set`.
fn simple_case_folding_closure(set: &CharSet) -> CharSet {
    let classes = FoldClasses::get();

    let mut added = Vec::new();
    let mut last_class = None;
    for &(cp, idx) in &classes.members {
        if last_class != Some(idx) && set.contains(cp) {
            added.extend(classes.classes[idx].iter().map(|&member| (member, member)));
            last_class = Some(idx);
        }
    }

    if added.is_empty() {
        return set.clone();
    }
    set.union(&CharSet::from_ranges(added))
}

/// Extends `set` with the code units that match a member of `set` in a pattern
/// without the `u` or `v` flag.
///
/// Two code units match if `toUppercase` maps them to the same single code
/// unit. Every such pair also has the same simple case folding, so the
/// candidates are taken from the simple case folding classes and filtered with
/// the exact rule.
fn legacy_closure(set: &CharSet) -> CharSet {
    let classes = FoldClasses::get();
    let candidates = simple_case_folding_closure(set)
        .intersection(&CharSet::from_ranges([(0, MAX_CODE_UNIT)]))
        .difference(set);

    let mut added = Vec::new();
    for cp in candidates.iter() {
        let key = legacy_canonicalize(cp);
        let matches_member = classes.class_of(cp).is_some_and(|class| {
            class.iter().any(|&other| {
                other != cp && set.contains(other) && legacy_canonicalize(other) == key
            })
        });
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

    let mut buf = [0u8; 4];
    let upper = CaseMapper::new()
        .uppercase_to_string(ch.encode_utf8(&mut buf), &LanguageIdentifier::UNKNOWN);
    let mut chars = upper.chars();
    let (Some(upper_ch), None) = (chars.next(), chars.next()) else {
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
    fn uses_recent_unicode_data() {
        // U+A7CE and U+A7CF were added in Unicode 17.
        assert_eq!(
            closure_of('\u{a7ce}', CaseMode::Unicode),
            vec![0xa7ce, 0xa7cf]
        );
        assert_eq!(
            closure_of('\u{16ea0}', CaseMode::Unicode),
            vec![0x16ea0, 0x16ebb]
        );
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
