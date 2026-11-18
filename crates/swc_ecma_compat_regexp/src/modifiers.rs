//! Lowering of pattern modifiers, such as `(?i:...)` and `(?-s:...)`.

use swc_common::Span;
use swc_ecma_regexp_ast::{
    Alternative, BoundaryAssertion, BoundaryAssertionKind, CharacterClass, CharacterClassContents,
    CharacterClassContentsKind, CharacterClassEscape, CharacterClassEscapeKind, Disjunction,
    IgnoreGroup, LookAroundAssertion, LookAroundAssertionKind, Modifier, Pattern, Term,
};

use crate::{
    case_fold::case_closure,
    char_set::CharSet,
    class_set::{class_escape_chars, eval_class_contents, ClassContext},
    emit::{char_class, char_class_of},
    error::LowerError,
    surrogates::isolate_lone_surrogates,
};

/// Removes the modifiers of `(?ims-ims:...)` groups and rewrites the pattern
/// so that it keeps its meaning.
///
/// A flag that a modifier enables is applied by rewriting the affected terms:
///
/// - `i`: characters, classes, `\w`, `\W`, `\b`, `\B` and property escapes
///   become explicit classes of all case variants.
/// - `m`: `^` becomes `(?<=^|[\n\r\u2028\u2029])` and `$` becomes
///   `(?=$|[\n\r\u2028\u2029])`.
/// - `s`: `.` becomes `[\s\S]`.
///
/// If the pattern has a flag that a modifier disables, the flag is removed
/// from the pattern and applied by rewriting every term outside of the
/// disabling group.
///
/// `flags` are the flags of the pattern. The pattern must not have the `v`
/// flag; lower it with [`crate::transform_unicode_sets`] first.
///
/// If every `^` and `$` is in a part where an `m` modifier applies, the `m`
/// flag is added to the pattern instead, which avoids lookbehind. This changes
/// the `flags` property of the regex. The `s` flag is never added: `.` is
/// always rewritten, so `flags` keeps the flags of the original pattern.
///
/// The rewrite of `^` for `m`, and of `\b` and `\B` for `i` with the `u` flag,
/// uses lookbehind. A target without lookbehind cannot parse the result.
///
/// Returns `Ok(None)` if the pattern has no modifiers, or the new flags. On
/// error, the pattern may be partially rewritten and must be discarded.
pub fn transform_modifiers(
    pattern: &mut Pattern,
    flags: &str,
) -> Result<Option<String>, LowerError> {
    if flags.contains('v') {
        return Err(LowerError::UnicodeSetsFlag);
    }

    let mut usage = ModifierUsage::default();
    usage.visit_disjunction(&pattern.body);
    if !usage.has_modifiers {
        return Ok(None);
    }

    let mut global = Modifier::empty();
    for (flag, modifier) in [('i', Modifier::I), ('m', Modifier::M), ('s', Modifier::S)] {
        if flags.contains(flag) {
            global |= modifier;
        }
    }

    // A flag that some group disables cannot stay on the pattern. It is
    // removed and applied by rewriting instead.
    let removed = global & usage.disabled;

    // If every `^` and `$` is in a part where `m` applies, the flag can be
    // added to the pattern instead. This avoids the lookbehind that the
    // rewrite of `^` needs. `.` is always rewritten to `[\s\S]`, which needs no
    // new syntax, so the `s` flag is never added.
    let mut scope = AnchorScope::default();
    scope.visit_disjunction(&pattern.body, global);
    let mut promoted = Modifier::empty();
    if !global.contains(Modifier::M) && scope.with_m && !scope.without_m {
        promoted |= Modifier::M;
    }

    let lowerer = Lowerer {
        unicode: flags.contains('u'),
        kept: (global - removed) | promoted,
    };
    lowerer.lower_disjunction(&mut pattern.body, global)?;
    if lowerer.unicode {
        // The rewritten pattern is printed again.
        isolate_lone_surrogates(pattern);
    }

    let mut new_flags: String = flags
        .chars()
        .filter(|&flag| {
            !((flag == 'i' && removed.contains(Modifier::I))
                || (flag == 'm' && removed.contains(Modifier::M))
                || (flag == 's' && removed.contains(Modifier::S)))
        })
        .collect();
    if promoted.contains(Modifier::M) {
        new_flags.push('m');
    }

    Ok(Some(new_flags))
}

/// Returns true if `pattern` has a group with modifiers, such as `(?i:...)`.
pub fn has_modifiers(pattern: &Pattern) -> bool {
    let mut usage = ModifierUsage::default();
    usage.visit_disjunction(&pattern.body);
    usage.has_modifiers
}

/// Collects whether `^` and `$` are inside or outside of the parts where `m`
/// applies.
#[derive(Default)]
struct AnchorScope {
    with_m: bool,
    without_m: bool,
}

impl AnchorScope {
    fn visit_disjunction(&mut self, disjunction: &Disjunction, effective: Modifier) {
        for alternative in &disjunction.body {
            for term in &alternative.body {
                self.visit_term(term, effective);
            }
        }
    }

    fn visit_term(&mut self, term: &Term, effective: Modifier) {
        match term {
            Term::IgnoreGroup(group) => {
                let effective = match &group.modifiers {
                    Some(modifiers) => (effective | modifiers.enabling) - modifiers.disabling,
                    None => effective,
                };
                self.visit_disjunction(&group.body, effective);
            }
            Term::CapturingGroup(group) => self.visit_disjunction(&group.body, effective),
            Term::LookAroundAssertion(assertion) => {
                self.visit_disjunction(&assertion.body, effective)
            }
            Term::Quantifier(quantifier) => self.visit_term(&quantifier.body, effective),
            Term::BoundaryAssertion(assertion)
                if matches!(
                    assertion.kind,
                    BoundaryAssertionKind::Start | BoundaryAssertionKind::End
                ) =>
            {
                if effective.contains(Modifier::M) {
                    self.with_m = true;
                } else {
                    self.without_m = true;
                }
            }
            _ => {}
        }
    }
}

/// Collects whether a pattern has modifiers, and which flags they disable.
struct ModifierUsage {
    has_modifiers: bool,
    disabled: Modifier,
}

impl Default for ModifierUsage {
    fn default() -> Self {
        Self {
            has_modifiers: false,
            disabled: Modifier::empty(),
        }
    }
}

impl ModifierUsage {
    fn visit_disjunction(&mut self, disjunction: &Disjunction) {
        for alternative in &disjunction.body {
            for term in &alternative.body {
                self.visit_term(term);
            }
        }
    }

    fn visit_term(&mut self, term: &Term) {
        match term {
            Term::IgnoreGroup(group) => {
                if let Some(modifiers) = &group.modifiers {
                    self.has_modifiers = true;
                    self.disabled |= modifiers.disabling;
                }
                self.visit_disjunction(&group.body);
            }
            Term::CapturingGroup(group) => self.visit_disjunction(&group.body),
            Term::LookAroundAssertion(assertion) => self.visit_disjunction(&assertion.body),
            Term::Quantifier(quantifier) => self.visit_term(&quantifier.body),
            _ => {}
        }
    }
}

struct Lowerer {
    /// The pattern has the `u` flag.
    unicode: bool,
    /// The flags that stay on the pattern.
    kept: Modifier,
}

impl Lowerer {
    fn lower_disjunction(
        &self,
        disjunction: &mut Disjunction,
        effective: Modifier,
    ) -> Result<(), LowerError> {
        for alternative in &mut disjunction.body {
            for term in &mut alternative.body {
                self.lower_term(term, effective)?;
            }
        }
        Ok(())
    }

    /// Rewrites `term`, where `effective` are the flags that apply to it.
    fn lower_term(&self, term: &mut Term, effective: Modifier) -> Result<(), LowerError> {
        // The flags that apply to the term but not to the pattern.
        let lower = effective - self.kept;

        match term {
            Term::IgnoreGroup(group) => {
                let effective = match group.modifiers.take() {
                    Some(modifiers) => (effective | modifiers.enabling) - modifiers.disabling,
                    None => effective,
                };
                self.lower_disjunction(&mut group.body, effective)?;
            }
            Term::CapturingGroup(group) => self.lower_disjunction(&mut group.body, effective)?,
            Term::LookAroundAssertion(assertion) => {
                self.lower_disjunction(&mut assertion.body, effective)?
            }
            Term::Quantifier(quantifier) => self.lower_term(&mut quantifier.body, effective)?,

            Term::Dot(dot) if lower.contains(Modifier::S) => {
                *term = Term::CharacterClass(Box::new(any_char_class(dot.span)));
            }
            Term::BoundaryAssertion(assertion) => {
                let span = assertion.span;
                match assertion.kind {
                    BoundaryAssertionKind::Start if lower.contains(Modifier::M) => {
                        *term = self.line_assertion(span, BoundaryAssertionKind::Start);
                    }
                    BoundaryAssertionKind::End if lower.contains(Modifier::M) => {
                        *term = self.line_assertion(span, BoundaryAssertionKind::End);
                    }
                    BoundaryAssertionKind::Boundary | BoundaryAssertionKind::NegativeBoundary
                        if lower.contains(Modifier::I) && self.unicode =>
                    {
                        let negative = assertion.kind == BoundaryAssertionKind::NegativeBoundary;
                        *term = self.word_boundary(span, negative);
                    }
                    _ => {}
                }
            }

            Term::Character(ch) if lower.contains(Modifier::I) => {
                let chars = case_closure(&CharSet::single(ch.value), self.ctx().case_mode());
                if chars.len() > 1 {
                    *term = Term::CharacterClass(Box::new(char_class(
                        ch.span,
                        &chars,
                        self.ctx().max_char(),
                        true,
                    )));
                }
            }
            Term::CharacterClass(class) if lower.contains(Modifier::I) => {
                let ctx = self.ctx();
                let set = eval_class_contents(class, ctx)?;
                // The engine applies the `^` of a case-insensitive class after
                // the case closure.
                let mut chars = case_closure(&set.chars, ctx.case_mode());
                if class.negative {
                    chars = chars.complement(ctx.max_char());
                }
                *term = Term::CharacterClass(Box::new(char_class(
                    class.span,
                    &chars,
                    ctx.max_char(),
                    true,
                )));
            }
            Term::CharacterClassEscape(escape)
                if lower.contains(Modifier::I)
                    && self.unicode
                    && matches!(
                        escape.kind,
                        CharacterClassEscapeKind::W | CharacterClassEscapeKind::NegativeW
                    ) =>
            {
                let ctx = self.ctx();
                let chars = class_escape_chars(escape.kind, ctx);
                *term = Term::CharacterClass(Box::new(char_class(
                    escape.span,
                    &chars,
                    ctx.max_char(),
                    true,
                )));
            }
            Term::UnicodePropertyEscape(prop) if lower.contains(Modifier::I) => {
                let ctx = self.ctx();
                let span = prop.span;
                let class = CharacterClass {
                    span,
                    negative: false,
                    strings: false,
                    kind: CharacterClassContentsKind::Union,
                    body: vec![CharacterClassContents::UnicodePropertyEscape(prop.clone())],
                };
                let set = eval_class_contents(&class, ctx)?;
                let chars = case_closure(&set.chars, ctx.case_mode());
                *term =
                    Term::CharacterClass(Box::new(char_class(span, &chars, ctx.max_char(), true)));
            }
            Term::IndexedReference(_) | Term::NamedReference(_) if lower.contains(Modifier::I) => {
                return Err(LowerError::CaseInsensitiveBackreference);
            }

            Term::Dot(_)
            | Term::Character(_)
            | Term::CharacterClass(_)
            | Term::CharacterClassEscape(_)
            | Term::UnicodePropertyEscape(_)
            | Term::IndexedReference(_)
            | Term::NamedReference(_) => {}
        }

        Ok(())
    }

    /// The class context of a case-insensitive part of the pattern.
    fn ctx(&self) -> ClassContext {
        ClassContext {
            unicode: self.unicode,
            unicode_sets: false,
            ignore_case: true,
        }
    }

    /// `^` or `$` with the `m` flag: `(?<=^|[\n\r\u2028\u2029])` or
    /// `(?=$|[\n\r\u2028\u2029])`.
    fn line_assertion(&self, span: Span, kind: BoundaryAssertionKind) -> Term {
        let line_terminators = CharSet::from_ranges([(0x0a, 0x0a), (0x0d, 0x0d), (0x2028, 0x2029)]);
        let lookaround = if kind == BoundaryAssertionKind::Start {
            LookAroundAssertionKind::Lookbehind
        } else {
            LookAroundAssertionKind::Lookahead
        };

        Term::LookAroundAssertion(Box::new(LookAroundAssertion {
            span,
            kind: lookaround,
            body: Disjunction {
                span,
                body: vec![
                    Alternative {
                        span,
                        body: vec![Term::BoundaryAssertion(Box::new(BoundaryAssertion {
                            span,
                            kind,
                        }))],
                    },
                    Alternative {
                        span,
                        body: vec![Term::CharacterClass(Box::new(char_class_of(
                            span,
                            false,
                            &line_terminators,
                        )))],
                    },
                ],
            },
        }))
    }

    /// `\b` or `\B` with the `u` and `i` flags.
    ///
    /// With both flags, the word characters include `U+017F` and `U+212A`, so
    /// `\b` is rewritten with lookarounds of the explicit word class:
    /// `(?:(?<=\w)(?!\w)|(?<!\w)(?=\w))` for `\b`, and
    /// `(?:(?<=\w)(?=\w)|(?<!\w)(?!\w))` for `\B`.
    fn word_boundary(&self, span: Span, negative: bool) -> Term {
        let ctx = self.ctx();
        let word = class_escape_chars(CharacterClassEscapeKind::W, ctx);
        let lookaround = |kind| {
            Term::LookAroundAssertion(Box::new(LookAroundAssertion {
                span,
                kind,
                body: Disjunction {
                    span,
                    body: vec![Alternative {
                        span,
                        body: vec![Term::CharacterClass(Box::new(char_class_of(
                            span, false, &word,
                        )))],
                    }],
                },
            }))
        };

        let (first_ahead, second_ahead) = if negative {
            (
                LookAroundAssertionKind::Lookahead,
                LookAroundAssertionKind::NegativeLookahead,
            )
        } else {
            (
                LookAroundAssertionKind::NegativeLookahead,
                LookAroundAssertionKind::Lookahead,
            )
        };

        Term::IgnoreGroup(Box::new(IgnoreGroup {
            span,
            modifiers: None,
            body: Disjunction {
                span,
                body: vec![
                    Alternative {
                        span,
                        body: vec![
                            lookaround(LookAroundAssertionKind::Lookbehind),
                            lookaround(first_ahead),
                        ],
                    },
                    Alternative {
                        span,
                        body: vec![
                            lookaround(LookAroundAssertionKind::NegativeLookbehind),
                            lookaround(second_ahead),
                        ],
                    },
                ],
            },
        }))
    }
}

/// `[\s\S]`, which matches every character.
fn any_char_class(span: Span) -> CharacterClass {
    CharacterClass {
        span,
        negative: false,
        strings: false,
        kind: CharacterClassContentsKind::Union,
        body: vec![
            CharacterClassContents::CharacterClassEscape(Box::new(CharacterClassEscape {
                span,
                kind: CharacterClassEscapeKind::S,
            })),
            CharacterClassContents::CharacterClassEscape(Box::new(CharacterClassEscape {
                span,
                kind: CharacterClassEscapeKind::NegativeS,
            })),
        ],
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_regexp::{LiteralParser, Options};

    use super::*;

    fn lower(pattern: &str, flags: &str) -> Result<Option<(String, String)>, LowerError> {
        let mut ast = LiteralParser::new(pattern, Some(flags), Options::default())
            .parse()
            .unwrap();
        let Some(new_flags) = transform_modifiers(&mut ast, flags)? else {
            return Ok(None);
        };
        let lowered = ast.to_string();

        LiteralParser::new(&lowered, Some(&new_flags), Options::default())
            .parse()
            .unwrap_or_else(|err| panic!("invalid pattern `{lowered}`: {err:?}"));
        Ok(Some((lowered, new_flags)))
    }

    fn lowered(pattern: &str, flags: &str) -> (String, String) {
        lower(pattern, flags).unwrap().unwrap()
    }

    #[test]
    fn no_modifiers() {
        assert_eq!(lower("(?:a)b", "i"), Ok(None));
    }

    #[test]
    fn enable_ignore_case() {
        assert_eq!(lowered("(?i:a)b", ""), ("(?:[Aa])b".into(), "".into()));
        assert_eq!(
            lowered("(?i:[a-c1])", ""),
            ("(?:[1A-Ca-c])".into(), "".into())
        );
        assert_eq!(lowered("(?i:[^a])", ""), ("(?:[^Aa])".into(), "".into()));
    }

    #[test]
    fn unicode_ignore_case_includes_kelvin() {
        assert_eq!(
            lowered("(?i:k)", "u"),
            (r"(?:[Kk\u212A])".into(), "u".into())
        );
        assert_eq!(lowered("(?i:k)", ""), ("(?:[Kk])".into(), "".into()));
    }

    #[test]
    fn disable_ignore_case_removes_flag() {
        assert_eq!(lowered("a(?-i:b)", "gi"), ("[Aa](?:b)".into(), "g".into()));
    }

    #[test]
    fn dot_all_and_multiline() {
        assert_eq!(lowered("(?s:.).", ""), (r"(?:[\s\S]).".into(), "".into()));
        assert_eq!(
            lowered("(?m:^a$)$", ""),
            (
                r"(?:(?<=^|[\x0A\x0D\u2028-\u2029])a(?=$|[\x0A\x0D\u2028-\u2029]))$".into(),
                "".into()
            )
        );
        assert_eq!(lowered("(?-s:.).", "s"), (r"(?:.)[\s\S]".into(), "".into()));
    }

    #[test]
    fn promote_multiline_only() {
        // Every `^` and `$` is in the group, so `m` is added to the pattern
        // instead of rewriting the anchors.
        assert_eq!(lowered("(?m:^a$)b", "g"), ("(?:^a$)b".into(), "gm".into()));
        // `.` is always rewritten, so the flags of the pattern stay the same.
        assert_eq!(lowered("(?s:a.)b", ""), (r"(?:a[\s\S])b".into(), "".into()));
        // A `.` outside of the group needs the rewrite.
        assert_eq!(lowered("(?s:.).", ""), (r"(?:[\s\S]).".into(), "".into()));
    }

    #[test]
    fn unicode_word_boundary() {
        let (pattern, _) = lowered(r"(?i:\b)", "u");
        assert!(pattern.contains("(?<="), "{pattern}");
        assert_eq!(lowered(r"(?i:\b)", ""), (r"(?:\b)".into(), "".into()));
    }

    #[test]
    fn control_escapes_are_kept() {
        assert_eq!(
            lowered(r"\cA(?i:b)", "u"),
            (r"\cA(?:[Bb])".into(), "u".into())
        );
        assert_eq!(
            lowered(r"(?i:[\cA])", ""),
            (r"(?:[\x01])".into(), "".into())
        );
        // Annex B: `\c1` outside of a class is a literal `\`, `c` and `1`.
        assert_eq!(lowered(r"(?i:\c1)", ""), (r"(?:\\[Cc]1)".into(), "".into()));
    }

    #[test]
    fn backreference_is_unsupported() {
        assert_eq!(
            lower(r"(a)(?i:\1)", ""),
            Err(LowerError::CaseInsensitiveBackreference)
        );
    }

    #[test]
    fn requires_lowered_unicode_sets() {
        let mut ast = LiteralParser::new("(?i:a)", Some("v"), Options::default())
            .parse()
            .unwrap();
        assert_eq!(
            transform_modifiers(&mut ast, "v"),
            Err(LowerError::UnicodeSetsFlag)
        );
    }
}
