//! Printing of lone surrogates in `u` patterns.

use swc_ecma_regexp_ast::{
    CharacterClass, CharacterClassContents, CharacterClassContentsKind, CharacterKind, Disjunction,
    Pattern, Term,
};

use crate::{char_set::CharSet, emit::char_class_of};

/// Keeps lone surrogates apart when a `u` pattern is printed.
///
/// In a `u` pattern, `𐀀` is read as one code point, but the pattern
/// AST can hold two separate surrogate atoms (from `\u{D800}\u{DC00}`). The
/// printer writes both as `\uXXXX`, so the printed pattern would match a
/// different string. This function rewrites each lone surrogate atom to a
/// class of one range (`[\uD800-\uD800]`), and moves the class items that
/// start with a trail surrogate to the front of a union class, so that no
/// printed lead surrogate is followed by a trail surrogate.
///
/// Call it only for a pattern with the `u` or the `v` flag. In other patterns,
/// surrogates are separate code units in every case. In a `v` pattern, the
/// operands of `&&` and `--` are kept as they are, because the operators keep
/// them apart and their order matters; only nested classes in them are
/// rewritten.
///
/// Returns false if a string of `\q{...}` has a lone lead surrogate followed by
/// a lone trail surrogate. Such a string cannot be printed as two characters
/// (a class is not allowed in it), so the caller must not print the pattern.
pub fn isolate_lone_surrogates(pattern: &mut Pattern) -> bool {
    let mut printable = true;
    isolate_disjunction(&mut pattern.body, &mut printable);
    printable
}

fn is_lead(cp: u32) -> bool {
    (0xd800..=0xdbff).contains(&cp)
}

fn is_trail(cp: u32) -> bool {
    (0xdc00..=0xdfff).contains(&cp)
}

fn is_surrogate(cp: u32) -> bool {
    (0xd800..=0xdfff).contains(&cp)
}

fn isolate_disjunction(disjunction: &mut Disjunction, printable: &mut bool) {
    for alternative in &mut disjunction.body {
        for term in &mut alternative.body {
            isolate_term(term, printable);
        }
    }
}

fn isolate_term(term: &mut Term, printable: &mut bool) {
    match term {
        Term::Character(ch) if is_surrogate(ch.value) => {
            *term = Term::CharacterClass(Box::new(char_class_of(
                ch.span,
                false,
                &CharSet::single(ch.value),
            )));
        }
        Term::CharacterClass(class) => isolate_class(class, printable),
        Term::Quantifier(quantifier) => isolate_term(&mut quantifier.body, printable),
        Term::CapturingGroup(group) => isolate_disjunction(&mut group.body, printable),
        Term::IgnoreGroup(group) => isolate_disjunction(&mut group.body, printable),
        Term::LookAroundAssertion(assertion) => isolate_disjunction(&mut assertion.body, printable),
        _ => {}
    }
}

/// Reorders a union class so that items that start with a trail surrogate come
/// first. A union class matches the same characters in any order.
fn isolate_class(class: &mut CharacterClass, printable: &mut bool) {
    for contents in &mut class.body {
        match contents {
            CharacterClassContents::NestedCharacterClass(nested) => {
                isolate_class(nested, printable)
            }
            CharacterClassContents::ClassStringDisjunction(disjunction)
                if disjunction.body.iter().any(|string| {
                    string
                        .body
                        .windows(2)
                        .any(|pair| is_lead(pair[0].value) && is_trail(pair[1].value))
                }) =>
            {
                *printable = false;
            }
            _ => {}
        }
    }
    if class.kind != CharacterClassContentsKind::Union {
        return;
    }

    fn starts_with_trail(contents: &CharacterClassContents) -> bool {
        let first = match contents {
            CharacterClassContents::Character(ch) => ch.value,
            CharacterClassContents::CharacterClassRange(range) => range.min.value,
            _ => return false,
        };
        (0xdc00..=0xdfff).contains(&first)
    }

    if class.body.iter().any(starts_with_trail) {
        // Moving items can put a literal `-` between two characters, where it
        // would be read as a range, or put two equal punctuators together,
        // which a `v` class rejects (`!!`). Write every literal ASCII
        // punctuator as `\xHH` first.
        for contents in &mut class.body {
            if let CharacterClassContents::Character(ch) = contents {
                if ch.kind == CharacterKind::Symbol
                    && char::from_u32(ch.value).is_some_and(|c| c.is_ascii_punctuation())
                {
                    ch.kind = CharacterKind::HexadecimalEscape;
                }
            }
        }
        // `sort_by_key` is stable, so the other items keep their order.
        class
            .body
            .sort_by_key(|contents| !starts_with_trail(contents));
    }

    // A lone surrogate character next to a range end could still pair, so
    // write it as a range of one character.
    for contents in &mut class.body {
        if let CharacterClassContents::Character(ch) = contents {
            if is_surrogate(ch.value) {
                let class = char_class_of(ch.span, false, &CharSet::single(ch.value));
                if let Some(range) = class.body.into_iter().next() {
                    *contents = range;
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_regexp::{LiteralParser, Options};

    use super::*;

    fn isolate(pattern: &str) -> String {
        let mut ast = LiteralParser::new(pattern, Some("u"), Options::default())
            .parse()
            .unwrap();
        assert!(isolate_lone_surrogates(&mut ast));
        ast.to_string()
    }

    #[test]
    fn separate_atoms_stay_separate() {
        assert_eq!(
            isolate(r"\u{D800}\u{DC00}+"),
            r"[\uD800-\uD800][\uDC00-\uDC00]+"
        );
        // A real surrogate pair is one code point and is kept.
        assert_eq!(isolate(r"𐀀"), r"𐀀");
        // A literal `-` stays literal after the items are moved.
        assert_eq!(isolate(r"[a\u{DC00}-\u{DC01}-z]"), r"[\uDC00-\uDC01a\x2Dz]");
        assert_eq!(
            isolate(r"[\u{D800}\u{DC00}a]"),
            r"[\uDC00-\uDC00\uD800-\uD800a]"
        );
    }

    fn isolate_v(pattern: &str) -> String {
        let mut ast = LiteralParser::new(pattern, Some("v"), Options::default())
            .parse()
            .unwrap();
        assert!(isolate_lone_surrogates(&mut ast));
        let printed = ast.to_string();
        LiteralParser::new(&printed, Some("v"), Options::default())
            .parse()
            .unwrap_or_else(|err| panic!("invalid `v` pattern `{printed}`: {err:?}"));
        printed
    }

    #[test]
    fn set_operations_keep_their_operands() {
        assert_eq!(isolate_v(r"[a--\u{DC00}]"), r"[a--\uDC00]");
        assert_eq!(
            isolate_v(r"[\u{D800}&&[\u{D800}\u{DC00}]]"),
            r"[\uD800&&[\uDC00-\uDC00\uD800-\uD800]]"
        );
        assert_eq!(
            isolate_v(r"[[\u{D800}\u{DC00}]x]"),
            r"[[\uDC00-\uDC00\uD800-\uD800]x]"
        );
    }
}
