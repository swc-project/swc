use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::{errors::HANDLER, util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_compat_regexp::{
    has_modifiers, isolate_lone_surrogates, transform_modifiers,
    transform_unicode_property_escapes, transform_unicode_sets,
};
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_regexp::{
    ast::{Alternative, CharacterKind, Disjunction, Dot, IgnoreGroup, IndexedReference, Term},
    decode_group_name, LiteralParser, Options as RegexpOptions,
};
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use tracing::debug;

use crate::TraverseCtx;

/// If true, the syntax will be transformed.
#[derive(Debug, Default)]
#[non_exhaustive]
pub struct RegExpOptions {
    /// [s/dotAll flag for regular expressions](https://tc39.github.io/proposal-regexp-dotall-flag/)
    pub dot_all_regex: bool,
    /// [RegExp.prototype.hasIndices](https://262.ecma-international.org/13.0/#sec-get-regexp.prototype.hasIndices)
    pub has_indices: bool,
    /// [RegExp Lookbehind Assertions](https://tc39.es/proposal-regexp-lookbehind/)
    pub lookbehind_assertion: bool,
    /// [Named capture groups in regular expressions](https://tc39.es/proposal-regexp-named-groups/)
    pub named_capturing_groups_regex: bool,
    /// [Duplicate named capturing groups](https://github.com/tc39/proposal-duplicate-named-capturing-groups)
    ///
    /// Patterns that reuse a group name in different alternatives are
    /// rewritten to indexed groups, and `_wrap_reg_exp` restores the
    /// `groups` object. A `\k<name>` reference to such a name becomes
    /// `(?:\1\2)`: only one of the groups can take part in a match, and a
    /// reference to a group that did not take part matches the empty string.
    pub duplicate_named_capturing_groups_regex: bool,
    /// [RegExp.prototype.sticky](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.sticky)
    pub sticky_regex: bool,
    /// [Unicode property escapes in regular expressions](https://tc39.es/proposal-regexp-unicode-property-escapes/)
    pub unicode_property_regex: bool,
    /// [RegExp.prototype.unicode](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.unicode)
    pub unicode_regex: bool,
    /// [RegExp.prototype.unicodeSets](https://github.com/tc39/proposal-regexp-v-flag)
    ///
    /// Regex literals with the `v` flag are rewritten to equivalent literals
    /// with the `u` flag. A pattern that uses a property of strings other than
    /// `Basic_Emoji` (for example `\p{RGI_Emoji}`) cannot be rewritten and is
    /// only converted to a `RegExp` call, with a warning.
    ///
    /// Like Babel, only regex literals are lowered. A `RegExp(...)` call is
    /// never rewritten, so that runtime feature checks such as
    /// `new RegExp("", "v")` keep working.
    pub unicode_sets_regex: bool,
    /// [RegExp modifiers](https://github.com/tc39/proposal-regexp-modifiers)
    ///
    /// `(?ims-ims:...)` groups in regex literals are rewritten without
    /// modifiers. A backreference in a case-insensitive group cannot be
    /// rewritten, so such a literal is converted to a `RegExp` call, with a
    /// warning. As for the `v` flag, `RegExp(...)` calls are not rewritten.
    ///
    /// When an `m` modifier applies only to some `^` or `$`, and for `\b` or
    /// `\B` in an `i` modifier group with the `u` flag, the rewrite uses
    /// lookbehind. Targets without lookbehind cannot parse the result.
    ///
    /// The rewritten pattern assumes the flags of the literal, and an
    /// `(?m:...)` group that contains every `^` and `$` becomes the `m`
    /// flag. A flag that a `(?-i:...)` group disables is removed from the
    /// flags, and the terms outside the group are rewritten to keep it. The
    /// same happens for `(?-m:...)` (or `(?-s:...)`) when the group has a `^`
    /// or `$` (or a `.`); otherwise the flag stays. So the `flags` property
    /// of the result can differ from the input.
    ///
    /// Like Babel, a lowered literal that is reused with other flags (for
    /// example `new RegExp(/(?i:a)/, "g")` or `.source`) can match
    /// differently. This applies to the `v` flag as well.
    pub regexp_modifiers: bool,
}

impl RegExpOptions {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.dot_all_regex
            || self.has_indices
            || self.lookbehind_assertion
            || self.named_capturing_groups_regex
            || self.duplicate_named_capturing_groups_regex
            || self.sticky_regex
            || self.unicode_property_regex
            || self.unicode_regex
            || self.unicode_sets_regex
            || self.regexp_modifiers
    }
}

pub(crate) fn hook(options: RegExpOptions) -> Option<impl VisitMutHook<TraverseCtx>> {
    if options.is_enabled() {
        Some(RegexpPass::new(options))
    } else {
        None
    }
}

pub(crate) fn pass(options: RegExpOptions) -> impl Pass {
    visit_mut_pass(RegexpPass::new(options))
}

struct RegexpPass {
    options: RegExpOptions,
}

impl RegexpPass {
    fn new(options: RegExpOptions) -> Self {
        Self { options }
    }

    /// Reports that a regular expression keeps syntax that the targets may not
    /// support.
    fn warn(&self, span: Span, feature: &str, reason: impl std::fmt::Display) {
        if !HANDLER.is_set() {
            return;
        }
        let message = format!(
            "Cannot lower {feature} in this regular expression for the configured targets: \
             {reason}. The regular expression is kept, and it can fail on those targets."
        );
        HANDLER.with(|handler| {
            handler.struct_span_warn(span, &message).emit();
        });
    }

    /// Lowers the syntax that the target cannot parse: the `v` flag and
    /// modifiers such as `(?i:...)`.
    ///
    /// Returns the new pattern and flags, or `None` if nothing is lowered. If a
    /// pattern cannot be lowered, it is kept and the other transforms still
    /// apply to it.
    ///
    /// When a pattern cannot be lowered, a warning is reported at `span`,
    /// because the target may reject the kept pattern.
    fn lower_syntax(&self, span: Span, pattern: &str, flags: &str) -> Option<(String, String)> {
        let lower_unicode_sets = self.options.unicode_sets_regex && flags.contains('v');
        let lower_modifiers = self.options.regexp_modifiers && may_have_modifiers(pattern);
        if !lower_unicode_sets && !lower_modifiers {
            return None;
        }

        let mut ast = match LiteralParser::new(pattern, Some(flags), RegexpOptions::default())
            .parse()
        {
            Ok(ast) => ast,
            Err(err) => {
                debug!(%pattern, %flags, ?err, "cannot parse a regex to lower its syntax");
                // A pattern that the parser rejects can still be valid on newer
                // engines (for example with a script name that it does not
                // know), so it is kept.
                self.warn(span, "the syntax", "the pattern cannot be parsed");
                return None;
            }
        };
        // `may_have_modifiers` can report a false positive, such as `\(?i:`.
        // Confirm it on the AST, so that a supported `v` flag is not lowered
        // for nothing.
        let lower_modifiers = lower_modifiers && has_modifiers(&ast);
        if !lower_unicode_sets && !lower_modifiers {
            return None;
        }
        let mut flags = flags.to_string();
        let mut changed = false;

        // Modifiers are lowered on a `u` pattern, so the `v` flag is lowered
        // first even if the target supports it.
        if flags.contains('v') && (lower_unicode_sets || lower_modifiers) {
            if let Err(err) = transform_unicode_sets(&mut ast, flags.contains('i')) {
                debug!(%pattern, %flags, %err, "cannot lower the `v` flag");
                if lower_unicode_sets {
                    self.warn(span, "the `v` flag", err);
                } else {
                    // The target supports the `v` flag, but the modifiers can
                    // only be lowered in a `u` pattern.
                    self.warn(
                        span,
                        "regexp modifiers",
                        format!("the `v` flag must be lowered first, but {err}"),
                    );
                }
                return None;
            }
            flags = flags.replace('v', "u");
            changed = true;
        }

        if lower_modifiers {
            match transform_modifiers(&mut ast, &flags) {
                Ok(Some(new_flags)) => {
                    flags = new_flags;
                    changed = true;
                }
                Ok(None) => {}
                Err(err) => {
                    debug!(%pattern, %flags, %err, "cannot lower regexp modifiers");
                    self.warn(span, "regexp modifiers", err);
                    return None;
                }
            }
        }

        changed.then(|| (ast.to_string(), flags))
    }

    /// Transform the regex pattern if it contains unicode property escapes.
    /// Returns the transformed pattern string.
    fn transform_pattern(&self, pattern: &str, flags: &str) -> Option<String> {
        // Only transform if unicode_property_regex is enabled and pattern
        // contains \p{ or \P{
        if !self.options.unicode_property_regex {
            return None;
        }
        if !pattern.contains("\\p{") && !pattern.contains("\\P{") {
            return None;
        }
        // The expansion follows `u` mode rules. `v` mode has a different class
        // syntax (set operations) and complements `\P{...}` after case folding,
        // so expanding would change the meaning or produce an invalid pattern.
        // Leave `v` patterns unchanged.
        if flags.contains('v') {
            return None;
        }

        // Parse the regex pattern
        let mut ast = LiteralParser::new(pattern, Some(flags), RegexpOptions::default())
            .parse()
            .ok()?;

        // Transform unicode property escapes
        transform_unicode_property_escapes(&mut ast);
        // The expansion can put a lone lead surrogate next to a lone trail
        // surrogate, which a `u` pattern reads as one code point.
        // `v` patterns are not expanded, so there is no `\q{...}`.
        if flags.contains('u') {
            let printable = isolate_lone_surrogates(&mut ast);
            debug_assert!(printable);
        }

        // Serialize back to string
        Some(ast.to_string())
    }

    /// Expands unicode property escapes in the string pattern of a `RegExp`
    /// call. The `v` flag, modifiers and duplicate named groups are not
    /// lowered in a call, because a call can be a runtime feature check.
    fn transform_regexp_args(&self, args: &mut [ExprOrSpread]) {
        if !self.options.unicode_property_regex {
            return;
        }

        let Some((pattern_arg, rest_args)) = args.split_first_mut() else {
            return;
        };
        if pattern_arg.spread.is_some() {
            return;
        }

        let Expr::Lit(Lit::Str(pattern_lit)) = &*pattern_arg.expr else {
            return;
        };
        let Some(pattern) = pattern_lit.value.as_str() else {
            return;
        };

        let flags = match rest_args.first() {
            Some(flags_arg) => {
                if flags_arg.spread.is_some() {
                    return;
                }

                let Expr::Lit(Lit::Str(flags_lit)) = &*flags_arg.expr else {
                    return;
                };
                let Some(flags) = flags_lit.value.as_str() else {
                    return;
                };

                flags
            }
            None => "",
        };

        if !flags.contains(['u', 'v']) {
            return;
        }

        let Some(transformed_pattern) = self.transform_pattern(pattern, flags) else {
            return;
        };

        let Expr::Lit(Lit::Str(pattern_lit)) = &mut *pattern_arg.expr else {
            return;
        };
        pattern_lit.value = transformed_pattern.into();
        pattern_lit.raw = None;
    }

    /// Parse a regex pattern, extract named capturing groups, strip them,
    /// convert named backreferences to indexed ones, and return the stripped
    /// pattern string along with the name-to-indices mapping.
    ///
    /// A name that is used by more than one group (allowed in different
    /// alternatives) maps to several indices.
    ///
    /// Returns `None` if parsing fails or if the pattern does not contain a
    /// group that an enabled option asks to lower.
    fn extract_and_strip_named_groups(
        &self,
        span: Span,
        pattern: &str,
        flags: &str,
    ) -> NamedGroups {
        let mut ast = match LiteralParser::new(pattern, Some(flags), RegexpOptions::default())
            .parse()
        {
            Ok(ast) => ast,
            Err(_) => {
                // A pattern that the parser rejects can still be valid on newer
                // engines. Report it if it seems to reuse a group name.
                if self.options.duplicate_named_capturing_groups_regex
                    && has_repeated_group_name(pattern)
                {
                    self.warn(
                        span,
                        "possible duplicate named capturing groups",
                        "the pattern cannot be parsed: it is invalid, or it uses syntax that the \
                         parser does not know",
                    );
                    return NamedGroups::Kept;
                }
                return NamedGroups::NotLowered;
            }
        };

        // First pass: collect all named capturing groups and their indices
        let mut mapping = Vec::new();
        let mut counter = 0u32;
        collect_named_groups(&ast.body, &mut counter, &mut mapping);

        if mapping.is_empty() {
            return NamedGroups::NotLowered;
        }

        let has_duplicates = mapping.iter().any(|(_, indices)| indices.len() > 1);
        if !(self.options.named_capturing_groups_regex
            || (self.options.duplicate_named_capturing_groups_regex && has_duplicates))
        {
            return NamedGroups::NotLowered;
        }
        // The parser checks only roughly whether groups with the same name can
        // both take part in a match (it scans for `|` outside the AST). Keep
        // such a pattern: it is invalid, and the target must still reject it.
        if has_duplicates && !duplicate_groups_are_exclusive(&ast.body) {
            debug!(%pattern, "groups with the same name can both take part in a match");
            self.warn(
                span,
                "duplicate named capturing groups",
                "groups with the same name can both take part in a match, which is invalid",
            );
            return NamedGroups::Kept;
        }

        // Second pass: strip names from groups and convert named references
        NamedGroupStripper { mapping: &mapping }.strip_disjunction(&mut ast.body);
        // A `u` or `v` pattern reads two printed surrogates as one code point.
        // A `\q{...}` string with such surrogates cannot be printed, so the
        // pattern is kept as written.
        let printable = !flags.contains(['u', 'v']) || isolate_lone_surrogates(&mut ast);
        if !printable {
            debug!(%pattern, "a `\\q{{...}}` string cannot be printed with separate surrogates");
            self.warn(
                span,
                "named capturing groups",
                "a `\\q{...}` string has a lone lead surrogate followed by a lone trail \
                 surrogate, which cannot be printed again as two characters",
            );
            return NamedGroups::Kept;
        }

        NamedGroups::Lowered(ast.to_string(), mapping)
    }

    /// Check if non-named-group transforms require converting to RegExp()
    /// constructor.
    fn needs_regexp_constructor(&self, pattern: &str, flags: &str) -> bool {
        (self.options.dot_all_regex && flags.contains('s'))
            || (self.options.sticky_regex && flags.contains('y'))
            || (self.options.unicode_regex && flags.contains('u'))
            || (self.options.unicode_sets_regex && flags.contains('v'))
            || (self.options.has_indices && flags.contains('d'))
            || (self.options.lookbehind_assertion
                && (pattern.contains("(?<=") || pattern.contains("(?<!")))
            || (self.options.unicode_property_regex
                && (pattern.contains("\\p{") || pattern.contains("\\P{")))
            // Modifiers that could not be lowered. In a `RegExp` call, the
            // target rejects only this expression when it runs, instead of
            // the whole script when it is parsed.
            || (self.options.regexp_modifiers
                && may_have_modifiers(pattern)
                // A pattern that the parser rejects can still be valid on newer
                // engines (for example with a script name that the parser does
                // not know), so it is treated as one with modifiers.
                && LiteralParser::new(pattern, Some(flags), RegexpOptions::default())
                    .parse()
                    .map_or(true, |ast| has_modifiers(&ast)))
    }

    /// Build an object expression for the group name-to-index mapping.
    fn build_mapping_object(&self, mapping: Vec<(Atom, Vec<u32>)>) -> Expr {
        let num = |idx: u32| {
            Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: idx as f64,
                raw: None,
            }))
        };

        // `__proto__: value` sets the prototype of the object, but the helper
        // reads the own properties. A computed key creates an own property,
        // but loose mode lowers it to an assignment, which sets the prototype
        // again. So `__proto__` and every later name are defined with
        // `_define_property`, which keeps the order of the names in every
        // mode.
        let mut object = Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props: Vec::with_capacity(mapping.len()),
        });
        let mut defining = false;
        for (name, indices) in mapping {
            // A unique name maps to a number, a duplicated one to an array of
            // numbers. `_wrap_reg_exp` picks the participating group.
            let value = match indices.as_slice() {
                [idx] => num(*idx),
                _ => Expr::Array(ArrayLit {
                    span: DUMMY_SP,
                    elems: indices
                        .into_iter()
                        .map(|idx| Some(num(idx).as_arg()))
                        .collect(),
                }),
            };

            defining |= name == "__proto__";
            match &mut object {
                Expr::Object(ObjectLit { props, .. }) if !defining => {
                    props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(IdentName {
                            span: DUMMY_SP,
                            sym: name,
                        }),
                        value: Box::new(value),
                    }))));
                }
                _ => {
                    object = CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(define_property),
                        args: vec![object.as_arg(), Expr::from(name).as_arg(), value.as_arg()],
                        ..Default::default()
                    }
                    .into();
                }
            }
        }
        object
    }
}

impl VisitMutHook<TraverseCtx> for RegexpPass {
    fn exit_expr(&mut self, expr: &mut Expr, _: &mut TraverseCtx) {
        self.transform_expr(expr);
    }
}

impl VisitMut for RegexpPass {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);
        self.transform_expr(expr);
    }
}

impl RegexpPass {
    fn transform_expr(&self, expr: &mut Expr) {
        match expr {
            Expr::Lit(Lit::Regex(regex)) => {
                if let Some((exp, flags)) = self.lower_syntax(regex.span, &regex.exp, &regex.flags)
                {
                    regex.exp = exp.into();
                    regex.flags = flags.into();
                }

                // Try named groups transform first.
                let mut named_groups_kept = false;
                if (self.options.named_capturing_groups_regex
                    || self.options.duplicate_named_capturing_groups_regex)
                    && may_have_named_groups(&regex.exp)
                {
                    let original_exp = regex.exp.clone();

                    let named_groups = self.extract_and_strip_named_groups(
                        regex.span,
                        &original_exp,
                        &regex.flags,
                    );
                    named_groups_kept = matches!(named_groups, NamedGroups::Kept);
                    if let NamedGroups::Lowered(stripped_exp, group_mapping) = named_groups {
                        let Regex { flags, span, .. } = regex.take();

                        // Check if other transforms also need the regex to be a
                        // RegExp() constructor call
                        let needs_constructor =
                            self.needs_regexp_constructor(&stripped_exp, &flags);

                        let regex_arg: Expr = if needs_constructor {
                            // Apply unicode property transform if needed
                            let pattern = self
                                .transform_pattern(&stripped_exp, &flags)
                                .unwrap_or(stripped_exp);

                            let exp: Expr = Atom::from(pattern).into();
                            let mut args = vec![exp.into()];
                            if !flags.is_empty() {
                                let f: Expr = flags.into();
                                args.push(f.into());
                            }

                            CallExpr {
                                span,
                                callee: quote_ident!("RegExp").as_callee(),
                                args,
                                ..Default::default()
                            }
                            .into()
                        } else {
                            // Keep as regex literal with stripped named groups
                            Lit::Regex(Regex {
                                span,
                                exp: stripped_exp.into(),
                                flags,
                            })
                            .into()
                        };

                        let mapping_expr = self.build_mapping_object(group_mapping);
                        let source_expr: Expr = original_exp.into();

                        *expr = CallExpr {
                            span,
                            callee: helper!(span, wrap_reg_exp),
                            args: vec![
                                regex_arg.as_arg(),
                                mapping_expr.as_arg(),
                                source_expr.as_arg(),
                            ],
                            ..Default::default()
                        }
                        .into();

                        return;
                    }
                }

                // Non-named-group transforms (or named group extraction
                // failed).
                if named_groups_kept || self.needs_regexp_constructor(&regex.exp, &regex.flags) {
                    let Regex { exp, flags, span } = regex.take();

                    // Transform the pattern if it contains unicode property
                    // escapes
                    let transformed_pattern = self
                        .transform_pattern(&exp, &flags)
                        .unwrap_or_else(|| exp.to_string());

                    let exp: Expr = Atom::from(transformed_pattern).into();
                    let mut args = vec![exp.into()];

                    if !flags.is_empty() {
                        let flags: Expr = flags.into();
                        args.push(flags.into());
                    }

                    *expr = CallExpr {
                        span,
                        callee: quote_ident!("RegExp").as_callee(),
                        args,
                        ..Default::default()
                    }
                    .into()
                }
            }
            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                args,
                ..
            }) if callee.is_ident_ref_to("RegExp") => {
                self.transform_regexp_args(args);
            }
            Expr::New(NewExpr {
                callee,
                args: Some(args),
                ..
            }) if callee.is_ident_ref_to("RegExp") => {
                self.transform_regexp_args(args);
            }
            _ => {}
        }
    }
}

/// The result of [`RegexpPass::extract_and_strip_named_groups`].
enum NamedGroups {
    /// No group needs lowering, or the pattern cannot be parsed and does not
    /// seem to need it.
    NotLowered,
    /// The pattern without group names, and the name-to-indices mapping.
    Lowered(String, Vec<(Atom, Vec<u32>)>),
    /// Groups need lowering, but the pattern cannot be lowered. A warning was
    /// reported. The literal must become a `RegExp` call, so that the target
    /// rejects only this expression when it runs, not the whole script.
    Kept,
}

/// Returns true if `pattern` may contain a named group such as `(?<name>`. A
/// lookbehind (`(?<=`, `(?<!`) is not a named group.
fn may_have_named_groups(pattern: &str) -> bool {
    pattern
        .match_indices("(?<")
        .any(|(idx, _)| !matches!(pattern.as_bytes().get(idx + 3), Some(b'=' | b'!')))
}

/// Returns true if the text of `pattern` has two `(?<name>` with the same
/// name. It is a check for a pattern that cannot be parsed, so escapes and
/// classes are not considered; a false positive only adds a warning.
fn has_repeated_group_name(pattern: &str) -> bool {
    let mut names = FxHashSet::default();
    pattern.match_indices("(?<").any(|(idx, _)| {
        let rest = &pattern[idx + 3..];
        if rest.starts_with(['=', '!']) {
            return false;
        }
        rest.find('>')
            .is_some_and(|end| !names.insert(decode_group_name(&rest[..end])))
    })
}

/// Returns true if `pattern` may contain a modifier group such as `(?i:` or
/// `(?-s:`. A false positive (for example an escaped `\(?i:`) only costs a
/// parse.
fn may_have_modifiers(pattern: &str) -> bool {
    pattern.match_indices("(?").any(|(idx, _)| {
        matches!(
            pattern.as_bytes().get(idx + 2),
            Some(b'i' | b'm' | b's' | b'-')
        )
    })
}

/// First pass: collect all named capturing groups and their 1-based indices.
/// Groups are counted in left-to-right order by the position of their opening
/// parenthesis. Groups that share a name are merged into one entry.
fn collect_named_groups(
    disjunction: &Disjunction,
    counter: &mut u32,
    mapping: &mut Vec<(Atom, Vec<u32>)>,
) {
    for alt in &disjunction.body {
        for term in &alt.body {
            collect_named_groups_term(term, counter, mapping);
        }
    }
}

fn collect_named_groups_term(term: &Term, counter: &mut u32, mapping: &mut Vec<(Atom, Vec<u32>)>) {
    match term {
        Term::CapturingGroup(g) => {
            *counter += 1;
            if let Some(name) = &g.name {
                let name = decode_group_name(name);
                match mapping.iter_mut().find(|(n, _)| *n == name) {
                    Some((_, indices)) => indices.push(*counter),
                    None => mapping.push((name, vec![*counter])),
                }
            }
            collect_named_groups(&g.body, counter, mapping);
        }
        Term::Quantifier(q) => {
            collect_named_groups_term(&q.body, counter, mapping);
        }
        Term::LookAroundAssertion(la) => {
            collect_named_groups(&la.body, counter, mapping);
        }
        Term::IgnoreGroup(ig) => {
            collect_named_groups(&ig.body, counter, mapping);
        }
        _ => {}
    }
}

/// Second pass: strips names from named groups and converts named references
/// to indexed references.
struct NamedGroupStripper<'a> {
    mapping: &'a [(Atom, Vec<u32>)],
}

impl NamedGroupStripper<'_> {
    fn strip_disjunction(&self, disjunction: &mut Disjunction) {
        for alt in &mut disjunction.body {
            for term in &mut alt.body {
                self.strip_term(term);
            }

            // `\k<z>0` would become `\30`, which is another reference (or an
            // octal escape). Delimit a reference that a digit follows.
            for i in 1..alt.body.len() {
                if matches!(alt.body[i - 1], Term::IndexedReference(_))
                    && starts_with_digit(&alt.body[i])
                {
                    let reference =
                        std::mem::replace(&mut alt.body[i - 1], Term::Dot(Dot { span: DUMMY_SP }));
                    let span = reference.span();
                    alt.body[i - 1] = Term::IgnoreGroup(Box::new(IgnoreGroup {
                        span,
                        modifiers: None,
                        body: Disjunction {
                            span,
                            body: vec![Alternative {
                                span,
                                body: vec![reference],
                            }],
                        },
                    }));
                }
            }
        }
    }

    fn strip_term(&self, term: &mut Term) {
        // Check if this is a NamedReference that needs conversion
        if let Term::NamedReference(nr) = &*term {
            let name = decode_group_name(&nr.name);
            if let Some((_, indices)) = self.mapping.iter().find(|(n, _)| *n == name) {
                let span = nr.span;
                let reference =
                    |index: u32| Term::IndexedReference(Box::new(IndexedReference { span, index }));
                *term = match indices.as_slice() {
                    [index] => reference(*index),
                    // Groups that share a name are in different alternatives,
                    // so at most one of them takes part in a match. A
                    // reference to a group that did not take part matches the
                    // empty string, so `(?:\1\2)` matches the text of the
                    // group that took part, like `\k<name>`.
                    _ => Term::IgnoreGroup(Box::new(IgnoreGroup {
                        span,
                        modifiers: None,
                        body: Disjunction {
                            span,
                            body: vec![Alternative {
                                span,
                                body: indices.iter().map(|&index| reference(index)).collect(),
                            }],
                        },
                    })),
                };
            }
            return;
        }

        // Recurse into children
        match term {
            Term::CapturingGroup(g) => {
                g.name = None;
                self.strip_disjunction(&mut g.body);
            }
            Term::Quantifier(q) => self.strip_term(&mut q.body),
            Term::LookAroundAssertion(la) => self.strip_disjunction(&mut la.body),
            Term::IgnoreGroup(ig) => self.strip_disjunction(&mut ig.body),
            _ => {}
        }
    }
}

/// Returns true if `term` is printed with a leading decimal digit.
fn starts_with_digit(term: &Term) -> bool {
    match term {
        Term::Character(ch) => {
            ch.kind == CharacterKind::Symbol
                && char::from_u32(ch.value).is_some_and(|c| c.is_ascii_digit())
        }
        Term::Quantifier(q) => starts_with_digit(&q.body),
        _ => false,
    }
}

/// Returns true if no two capturing groups with the same name can both take
/// part in a match (`MightBothParticipate` of ECMA-262 is false for each
/// pair): for each pair, the innermost disjunction that contains both has
/// them in different alternatives.
fn duplicate_groups_are_exclusive(disjunction: &Disjunction) -> bool {
    /// The disjunctions from the root to a group, as (disjunction id,
    /// alternative index) pairs.
    type Path = Vec<(u32, usize)>;

    fn visit_disjunction(
        disjunction: &Disjunction,
        path: &mut Path,
        next_id: &mut u32,
        groups: &mut Vec<(Atom, Path)>,
    ) {
        let id = *next_id;
        *next_id += 1;
        for (index, alt) in disjunction.body.iter().enumerate() {
            path.push((id, index));
            for term in &alt.body {
                visit_term(term, path, next_id, groups);
            }
            path.pop();
        }
    }

    fn visit_term(term: &Term, path: &mut Path, next_id: &mut u32, groups: &mut Vec<(Atom, Path)>) {
        match term {
            Term::CapturingGroup(g) => {
                if let Some(name) = &g.name {
                    groups.push((decode_group_name(name), path.clone()));
                }
                visit_disjunction(&g.body, path, next_id, groups);
            }
            Term::Quantifier(q) => visit_term(&q.body, path, next_id, groups),
            Term::LookAroundAssertion(la) => visit_disjunction(&la.body, path, next_id, groups),
            Term::IgnoreGroup(ig) => visit_disjunction(&ig.body, path, next_id, groups),
            _ => {}
        }
    }

    let mut groups = Vec::new();
    visit_disjunction(disjunction, &mut Vec::new(), &mut 0, &mut groups);

    // Insert the path of each group into a trie for its name. Two groups are
    // exclusive if their paths part at a disjunction, in different
    // alternatives. They can both take part if their paths part at two
    // different disjunctions in one alternative, or if one group is inside
    // the other. Each insertion takes time linear in the path length.
    #[derive(Default)]
    struct Node {
        /// The disjunction that every child edge goes through.
        child_disjunction: Option<u32>,
        has_children: bool,
        /// A group ends at this node.
        terminal: bool,
    }

    let mut nodes: Vec<Node> = Vec::new();
    let mut roots: FxHashMap<Atom, usize> = FxHashMap::default();
    let mut edges: FxHashMap<(usize, u32, usize), usize> = FxHashMap::default();

    for (name, path) in groups {
        let mut node = *roots.entry(name).or_insert_with(|| {
            nodes.push(Node::default());
            nodes.len() - 1
        });
        for (disjunction, alternative) in path {
            let current = &mut nodes[node];
            if current.terminal {
                // An earlier group contains this one.
                return false;
            }
            match current.child_disjunction {
                Some(existing) if existing != disjunction => return false,
                _ => current.child_disjunction = Some(disjunction),
            }
            current.has_children = true;
            node = *edges
                .entry((node, disjunction, alternative))
                .or_insert_with(|| {
                    nodes.push(Node::default());
                    nodes.len() - 1
                });
        }
        let end = &mut nodes[node];
        if end.terminal || end.has_children {
            // The groups are in one alternative, or this group contains an
            // earlier one.
            return false;
        }
        end.terminal = true;
    }
    true
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The pass is part of public pass types, which callers can require to be
    /// `Send` and `Sync`.
    #[test]
    fn pass_is_send_and_sync() {
        fn assert_send_sync<T: Send + Sync>(_: &T) {}
        assert_send_sync(&pass(Default::default()));
    }
}
