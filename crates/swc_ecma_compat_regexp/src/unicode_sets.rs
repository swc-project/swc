//! Lowering of the `v` flag (`unicodeSets`) to the `u` flag.

use swc_ecma_regexp_ast::{
    CharacterClass, CharacterClassContents, CharacterClassContentsKind, Disjunction, Modifier,
    Pattern, Term,
};

use crate::{
    char_set::MAX_CODE_POINT,
    class_set::{eval_class_contents, ClassContext},
    emit::class_set_term,
    error::LowerError,
    surrogates::isolate_lone_surrogates,
};

/// Rewrites a pattern that was parsed with the `v` flag so that it has the
/// same meaning with the `u` flag.
///
/// - Every character class is replaced with an explicit class. Set operations
///   (`&&`, `--`), nested classes, `\q{...}` and properties of strings are
///   evaluated. A class that contains strings becomes `(?:...)`.
/// - With case-insensitive matching, `\P{...}` and negated classes are computed
///   after case folding, as the `v` flag requires.
///
/// `ignore_case` is whether the pattern has the `i` flag. `(?i:...)` and
/// `(?-i:...)` modifiers are respected. On success, the caller must replace
/// the `v` flag with the `u` flag. On error, the pattern may be partially
/// rewritten and must be discarded.
pub fn transform_unicode_sets(pattern: &mut Pattern, ignore_case: bool) -> Result<(), LowerError> {
    lower_disjunction(&mut pattern.body, ignore_case)?;
    // The result is printed as a `u` pattern. It has no `\q{...}` any more, so
    // it can always be printed.
    let printable = isolate_lone_surrogates(pattern);
    debug_assert!(printable);
    Ok(())
}

fn lower_disjunction(disjunction: &mut Disjunction, ignore_case: bool) -> Result<(), LowerError> {
    for alternative in &mut disjunction.body {
        for term in &mut alternative.body {
            lower_term(term, ignore_case)?;
        }
    }
    Ok(())
}

fn lower_term(term: &mut Term, ignore_case: bool) -> Result<(), LowerError> {
    let ctx = ClassContext {
        unicode: true,
        unicode_sets: true,
        ignore_case,
    };

    match term {
        Term::CharacterClass(class) => {
            let mut set = eval_class_contents(class, ctx)?;
            if class.negative {
                // A negated class cannot contain strings (early error).
                set.chars = set.chars.complement(MAX_CODE_POINT);
            }
            *term = class_set_term(class.span, set, MAX_CODE_POINT);
        }
        Term::UnicodePropertyEscape(prop) => {
            // A property of strings has no `u` equivalent. With case-insensitive
            // matching, `\P{...}` complements the folded property in a `v`
            // pattern, but the plain property in a `u` pattern. Other property
            // escapes have the same meaning in both modes.
            if prop.strings || (prop.negative && ignore_case) {
                let span = prop.span;
                let class = CharacterClass {
                    span,
                    negative: false,
                    strings: prop.strings,
                    kind: CharacterClassContentsKind::Union,
                    body: vec![CharacterClassContents::UnicodePropertyEscape(prop.clone())],
                };
                let set = eval_class_contents(&class, ctx)?;
                *term = class_set_term(span, set, MAX_CODE_POINT);
            }
        }
        Term::Quantifier(quantifier) => lower_term(&mut quantifier.body, ignore_case)?,
        Term::CapturingGroup(group) => lower_disjunction(&mut group.body, ignore_case)?,
        Term::LookAroundAssertion(assertion) => {
            lower_disjunction(&mut assertion.body, ignore_case)?
        }
        Term::IgnoreGroup(group) => {
            let ignore_case = match &group.modifiers {
                Some(modifiers) if modifiers.enabling.contains(Modifier::I) => true,
                Some(modifiers) if modifiers.disabling.contains(Modifier::I) => false,
                _ => ignore_case,
            };
            lower_disjunction(&mut group.body, ignore_case)?
        }
        Term::BoundaryAssertion(_)
        | Term::Character(_)
        | Term::Dot(_)
        | Term::CharacterClassEscape(_)
        | Term::IndexedReference(_)
        | Term::NamedReference(_) => {}
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use swc_ecma_regexp::{LiteralParser, Options};

    use super::*;

    fn lower(pattern: &str, flags: &str) -> Result<String, LowerError> {
        let mut ast = LiteralParser::new(pattern, Some(flags), Options::default())
            .parse()
            .unwrap();
        transform_unicode_sets(&mut ast, flags.contains('i'))?;
        let lowered = ast.to_string();

        // The result must be a valid `u` pattern.
        let u_flags = flags.replace('v', "u");
        LiteralParser::new(&lowered, Some(&u_flags), Options::default())
            .parse()
            .unwrap_or_else(|err| panic!("invalid `u` pattern `{lowered}`: {err:?}"));
        Ok(lowered)
    }

    #[test]
    fn subtraction_and_intersection() {
        assert_eq!(lower("[[a-z]--[aeiou]]", "v").unwrap(), "[b-df-hj-np-tv-z]");
        assert_eq!(lower("[[a-z]&&[c-f]]", "v").unwrap(), "[c-f]");
        assert_eq!(lower(r"[\d--[5]]+", "v").unwrap(), "[0-46-9]+");
    }

    #[test]
    fn negated_class() {
        assert_eq!(lower("[^[a-z]--b]", "v").unwrap(), "[^ac-z]");
    }

    #[test]
    fn strings() {
        assert_eq!(lower(r"[\q{abc|d|}x]", "v").unwrap(), "(?:abc|[dx]|)");
        assert_eq!(lower(r"[\q{ab|cd}--\q{cd}]", "v").unwrap(), "(?:ab)");
    }

    #[test]
    fn syntax_characters_are_escaped() {
        assert_eq!(lower(r"[\&\-\]\(]", "v").unwrap(), r"[\x26\x28\x2D\x5D]");
    }

    #[test]
    fn ignore_case_complement_after_folding() {
        // In a `v` pattern, `[^a]` with the `i` flag rejects `A`. The lowered
        // class must not match `A` or `a` with the `i` flag.
        let lowered = lower("[^a]", "vi").unwrap();
        assert_eq!(lowered, r"[^Aa]");
        // `\P{Lu}` rejects lowercase letters that have an uppercase form.
        let lowered = lower(r"\P{Lu}", "vi").unwrap();
        assert!(lowered.starts_with("[^") || lowered.starts_with('['));
        assert!(!lowered.contains("\\P"));
    }

    #[test]
    fn modifiers_change_ignore_case() {
        assert_eq!(lower("(?i:[^a])[^b]", "v").unwrap(), r"(?i:[^Aa])[^b]");
        assert_eq!(lower("(?-i:[^a])[^b]", "vi").unwrap(), r"(?-i:[^a])[^Bb]");
    }

    #[test]
    fn lone_surrogates_do_not_pair() {
        assert_eq!(
            lower(r"[\uD83D\u{DE00}]", "v").unwrap(),
            r"[\uDE00-\uDE00\uD83D-\uD83D]"
        );
        assert_eq!(
            lower(r"[[\0-\uFFFF]--[\uDC00-\uDC7F]]", "v").unwrap(),
            r"[\uDC80-\uFFFF\x00-\uDBFF]"
        );
        assert_eq!(
            lower(r"[\q{\u{D83D}\u{DE00}}]", "v").unwrap(),
            r"(?:[\uD83D-\uD83D][\uDE00-\uDE00])"
        );
    }

    #[test]
    fn separate_surrogate_atoms_stay_separate() {
        assert_eq!(
            lower(r"\u{D800}\u{DC00}", "v").unwrap(),
            r"[\uD800-\uD800][\uDC00-\uDC00]"
        );
    }

    #[test]
    fn plain_property_is_kept() {
        assert_eq!(lower(r"\p{L}\P{Lu}", "v").unwrap(), r"\p{L}\P{Lu}");
    }

    #[test]
    fn unsupported_property_of_strings() {
        assert_eq!(
            lower(r"[\p{RGI_Emoji}]", "v"),
            Err(LowerError::UnsupportedProperty)
        );
    }

    #[test]
    fn basic_emoji() {
        let lowered = lower(r"\p{Basic_Emoji}", "v").unwrap();
        assert!(lowered.starts_with("(?:"));
    }
}
