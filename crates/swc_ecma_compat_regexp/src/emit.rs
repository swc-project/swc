//! Construction of pattern AST nodes from explicit sets.

use swc_common::Span;
use swc_ecma_regexp_ast::{
    Alternative, Character, CharacterClass, CharacterClassContents, CharacterClassContentsKind,
    CharacterClassRange, CharacterKind, Disjunction, IgnoreGroup, Term,
};

use crate::{char_set::CharSet, class_set::ClassSet};

/// Creates a character that prints in a form that is valid in every pattern
/// mode, both inside and outside of a character class.
///
/// ASCII letters, digits and `_` print as-is. Other characters print as
/// `\xHH` or `\uHHHH`, so that syntax characters such as `]` or `-` never need
/// an identity escape, which a `u` pattern rejects for some characters.
pub(crate) fn make_char(span: Span, cp: u32) -> Character {
    let kind = if char::from_u32(cp).is_some_and(|ch| ch.is_ascii_alphanumeric() || ch == '_') {
        CharacterKind::Symbol
    } else if cp <= 0xff {
        CharacterKind::HexadecimalEscape
    } else {
        CharacterKind::UnicodeEscape
    };

    Character {
        span,
        kind,
        value: cp,
    }
}

/// Creates a character class that matches exactly `chars` (without the `i`
/// flag), or exactly the case closure of `chars` (with the `i` flag) if
/// `chars` is not closed.
///
/// The class is written as `[...]` or as `[^...]` of the complement in
/// `0..=max_char`, whichever needs fewer ranges. The forms are equivalent
/// without the `i` flag. With the `i` flag, they are equivalent only if
/// `chars` is closed under case-insensitive matching, so callers pass
/// `allow_negation: false` for a set that may not be closed.
pub(crate) fn char_class(
    span: Span,
    chars: &CharSet,
    max_char: u32,
    allow_negation: bool,
) -> CharacterClass {
    let complement = chars.complement(max_char);
    let (negative, ranges) = if allow_negation && complement.ranges().len() < chars.ranges().len() {
        (true, complement)
    } else {
        (false, chars.clone())
    };

    char_class_of(span, negative, &ranges)
}

/// Returns true if `cp` is a surrogate code point.
fn is_surrogate(cp: u32) -> bool {
    (0xd800..=0xdfff).contains(&cp)
}

/// Returns true if `cp` is a trail surrogate code point.
fn is_trail_surrogate(cp: u32) -> bool {
    (0xdc00..=0xdfff).contains(&cp)
}

/// Creates `[...]` (or `[^...]` if `negative` is true) of `ranges`.
///
/// In a `u` pattern, `\uD83D\uDE00` is read as one code point, even across a
/// range boundary (`\uD83D-\uD83D\uDE00-\uDE00`). To keep lone surrogates
/// apart, the ranges that start with a trail surrogate are written first. After
/// that, no range starts with a trail surrogate, so no lead surrogate is ever
/// followed by a trail surrogate.
pub(crate) fn char_class_of(span: Span, negative: bool, chars: &CharSet) -> CharacterClass {
    let ranges = chars.ranges();
    let trail_first = ranges
        .iter()
        .filter(|&&(start, _)| is_trail_surrogate(start))
        .chain(
            ranges
                .iter()
                .filter(|&&(start, _)| !is_trail_surrogate(start)),
        );

    let body = trail_first
        .map(|&(start, end)| {
            // A single surrogate is written as a range. Two adjacent
            // characters that form a surrogate pair would print as one code
            // point.
            if start == end && !is_surrogate(start) {
                CharacterClassContents::Character(Box::new(make_char(span, start)))
            } else {
                CharacterClassContents::CharacterClassRange(Box::new(CharacterClassRange {
                    span,
                    min: make_char(span, start),
                    max: make_char(span, end),
                }))
            }
        })
        .collect();

    CharacterClass {
        span,
        negative,
        strings: false,
        kind: CharacterClassContentsKind::Union,
        body,
    }
}

/// Creates a term that matches exactly `cp`. A surrogate is written as a
/// class (`[\uD83D-\uD83D]`), so that it never forms a pair with the term
/// next to it.
fn string_char_term(span: Span, cp: u32) -> Term {
    if is_surrogate(cp) {
        Term::CharacterClass(Box::new(char_class_of(span, false, &CharSet::single(cp))))
    } else {
        Term::Character(Box::new(make_char(span, cp)))
    }
}

/// Creates a term that matches the strings and characters of `set` in a `u`
/// pattern.
///
/// If `set` has no strings, the result is a character class. Otherwise the
/// result is `(?:...)` with the longest strings first, then the class, then
/// the empty string. This is the order in which a `v` pattern tries them.
pub(crate) fn class_set_term(span: Span, set: ClassSet, max_char: u32) -> Term {
    if set.strings.is_empty() {
        return Term::CharacterClass(Box::new(char_class(span, &set.chars, max_char, true)));
    }

    let mut strings = set.strings;
    // Longest first. The sort is stable, so strings of equal length stay
    // sorted.
    strings.sort_by_key(|s| std::cmp::Reverse(s.len()));

    let mut has_empty = false;
    let mut alternatives = Vec::with_capacity(strings.len() + 2);
    for string in strings {
        if string.is_empty() {
            has_empty = true;
            continue;
        }

        alternatives.push(Alternative {
            span,
            body: string
                .into_iter()
                .map(|cp| string_char_term(span, cp))
                .collect(),
        });
    }

    if !set.chars.is_empty() {
        alternatives.push(Alternative {
            span,
            body: vec![Term::CharacterClass(Box::new(char_class(
                span, &set.chars, max_char, true,
            )))],
        });
    }

    if has_empty {
        alternatives.push(Alternative {
            span,
            body: Vec::new(),
        });
    }

    Term::IgnoreGroup(Box::new(IgnoreGroup {
        span,
        modifiers: None,
        body: Disjunction {
            span,
            body: alternatives,
        },
    }))
}
