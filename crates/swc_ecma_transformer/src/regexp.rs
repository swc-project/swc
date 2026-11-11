use swc_atoms::Atom;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_compat_regexp::transform_unicode_property_escapes;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_regexp::{
    ast::{Disjunction, IndexedReference, Term},
    LiteralParser, Options as RegexpOptions,
};
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

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
    /// `groups` object. Patterns that refer to such a name with `\k<name>`
    /// are left unchanged because the reference cannot be expressed with
    /// indexed groups.
    pub duplicate_named_capturing_groups_regex: bool,
    /// [RegExp.prototype.sticky](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.sticky)
    pub sticky_regex: bool,
    /// [Unicode property escapes in regular expressions](https://tc39.es/proposal-regexp-unicode-property-escapes/)
    pub unicode_property_regex: bool,
    /// [RegExp.prototype.unicode](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.unicode)
    pub unicode_regex: bool,
    // [RegExp.prototype.unicodeSets](https://github.com/tc39/proposal-regexp-v-flag)
    pub unicode_sets_regex: bool,
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
    }
}

pub(crate) fn hook(options: RegExpOptions) -> Option<impl VisitMutHook<TraverseCtx>> {
    if options.dot_all_regex
        || options.has_indices
        || options.lookbehind_assertion
        || options.named_capturing_groups_regex
        || options.duplicate_named_capturing_groups_regex
        || options.sticky_regex
        || options.unicode_property_regex
        || options.unicode_regex
        || options.unicode_sets_regex
    {
        Some(RegexpPass { options })
    } else {
        None
    }
}

pub(crate) fn pass(options: RegExpOptions) -> impl Pass {
    visit_mut_pass(RegexpPass { options })
}

struct RegexpPass {
    options: RegExpOptions,
}

impl RegexpPass {
    /// Transform the regex pattern if it contains unicode property escapes.
    /// Returns the transformed pattern string.
    fn transform_pattern(&self, pattern: &str, flags: &str) -> Option<String> {
        // Only transform if unicode_property_regex is enabled and pattern contains
        // \p{ or \P{
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

        // Serialize back to string
        Some(ast.to_string())
    }

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
    /// Returns `None` if parsing fails, if the pattern does not contain a group
    /// that an enabled option asks to lower, or if a `\k<name>` reference
    /// points to a duplicated name.
    fn extract_and_strip_named_groups(
        &self,
        pattern: &str,
        flags: &str,
    ) -> Option<(String, Vec<(Atom, Vec<u32>)>)> {
        let mut ast = LiteralParser::new(pattern, Some(flags), RegexpOptions::default())
            .parse()
            .ok()?;

        // First pass: collect all named capturing groups and their indices
        let mut mapping = Vec::new();
        let mut counter = 0u32;
        collect_named_groups(&ast.body, &mut counter, &mut mapping);

        if mapping.is_empty() {
            return None;
        }

        let has_duplicates = mapping.iter().any(|(_, indices)| indices.len() > 1);
        if !(self.options.named_capturing_groups_regex
            || (self.options.duplicate_named_capturing_groups_regex && has_duplicates))
        {
            return None;
        }

        // Second pass: strip names from groups and convert named references
        let mut stripper = NamedGroupStripper {
            mapping: &mapping,
            unsupported: false,
        };
        stripper.strip_disjunction(&mut ast.body);
        if stripper.unsupported {
            return None;
        }

        Some((ast.to_string(), mapping))
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
    }

    /// Build an object expression for the group name-to-index mapping.
    fn build_mapping_object(&self, mapping: Vec<(Atom, Vec<u32>)>) -> Expr {
        let props = mapping
            .into_iter()
            .map(|(name, indices)| {
                let num = |idx: u32| {
                    Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: idx as f64,
                        raw: None,
                    }))
                };
                // A unique name maps to a number, a duplicated one to an array
                // of numbers. `_wrap_reg_exp` picks the participating group.
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

                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName {
                        span: DUMMY_SP,
                        sym: name,
                    }),
                    value: Box::new(value),
                })))
            })
            .collect();

        Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props,
        })
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
    fn transform_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Lit(Lit::Regex(regex)) => {
                // Try named groups transform first
                if (self.options.named_capturing_groups_regex
                    || self.options.duplicate_named_capturing_groups_regex)
                    && regex.exp.contains("(?<")
                {
                    let original_exp = regex.exp.clone();

                    if let Some((stripped_exp, group_mapping)) =
                        self.extract_and_strip_named_groups(&original_exp, &regex.flags)
                    {
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

                // Non-named-group transforms (or named group extraction failed)
                let needs_transform = self.needs_regexp_constructor(&regex.exp, &regex.flags);

                if needs_transform {
                    let Regex { exp, flags, span } = regex.take();

                    // Transform the pattern if it contains unicode property escapes
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
                match mapping.iter_mut().find(|(n, _)| n == name) {
                    Some((_, indices)) => indices.push(*counter),
                    None => mapping.push((name.clone(), vec![*counter])),
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
    /// Set when a `\k<name>` reference targets a duplicated name. Such a
    /// reference means "the group that took part in the match", which has no
    /// indexed equivalent: `\1` and `\2` both match the empty string while
    /// their group is unset. The whole transform is abandoned in that case.
    unsupported: bool,
}

impl NamedGroupStripper<'_> {
    fn strip_disjunction(&mut self, disjunction: &mut Disjunction) {
        for alt in &mut disjunction.body {
            for term in &mut alt.body {
                self.strip_term(term);
            }
        }
    }

    fn strip_term(&mut self, term: &mut Term) {
        // Check if this is a NamedReference that needs conversion
        if let Term::NamedReference(nr) = &*term {
            match self.mapping.iter().find(|(n, _)| *n == nr.name) {
                Some((_, indices)) if indices.len() == 1 => {
                    *term = Term::IndexedReference(Box::new(IndexedReference {
                        span: nr.span,
                        index: indices[0],
                    }));
                }
                Some(_) => self.unsupported = true,
                None => {}
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
