use swc_atoms::Atom;
use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_compat_regexp::{transform_named_capture_groups, transform_unicode_property_escapes};
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_regexp::{LiteralParser, Options as RegexpOptions};
use swc_ecma_utils::{quote_ident, ExprFactory};

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

struct RegexpPass {
    options: RegExpOptions,
}

impl RegexpPass {
    fn contains_named_capture_group(pattern: &str) -> bool {
        let bytes = pattern.as_bytes();
        let mut i = 0;

        while i + 2 < bytes.len() {
            if bytes[i] == b'(' && bytes[i + 1] == b'?' && bytes[i + 2] == b'<' {
                let lookbehind_marker = bytes.get(i + 3).copied();
                if !matches!(lookbehind_marker, Some(b'=') | Some(b'!')) {
                    return true;
                }
            }

            i += 1;
        }

        false
    }

    fn should_transform_named_capture(&self, pattern: &str) -> bool {
        self.options.named_capturing_groups_regex
            && (Self::contains_named_capture_group(pattern) || pattern.contains("\\k<"))
    }

    fn should_transform_unicode_property(&self, pattern: &str, flags: &str) -> bool {
        self.options.unicode_property_regex
            && flags.contains(['u', 'v'])
            && (pattern.contains("\\p{") || pattern.contains("\\P{"))
    }

    /// Transform the regex pattern if it contains supported syntax.
    /// Returns the transformed pattern string.
    fn transform_pattern(&self, pattern: &str, flags: &str) -> Option<String> {
        let should_transform_unicode_property =
            self.should_transform_unicode_property(pattern, flags);
        let should_transform_named_capture = self.should_transform_named_capture(pattern);

        if !should_transform_unicode_property && !should_transform_named_capture {
            return None;
        }

        // Parse the regex pattern
        let mut ast = LiteralParser::new(pattern, Some(flags), RegexpOptions::default())
            .parse()
            .ok()?;

        if should_transform_unicode_property {
            transform_unicode_property_escapes(&mut ast);
        }

        if should_transform_named_capture {
            transform_named_capture_groups(&mut ast);
        }

        // Serialize back to string
        Some(ast.to_string())
    }

    fn transform_regexp_args(&self, args: &mut [ExprOrSpread]) {
        if !self.options.unicode_property_regex && !self.options.named_capturing_groups_regex {
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

        let Some(transformed_pattern) = self.transform_pattern(pattern, flags) else {
            return;
        };

        let Expr::Lit(Lit::Str(pattern_lit)) = &mut *pattern_arg.expr else {
            return;
        };
        pattern_lit.value = transformed_pattern.into();
        pattern_lit.raw = None;
    }
}

impl VisitMutHook<TraverseCtx> for RegexpPass {
    fn exit_expr(&mut self, expr: &mut Expr, _: &mut TraverseCtx) {
        match expr {
            Expr::Lit(Lit::Regex(regex)) => {
                let needs_transform = (self.options.dot_all_regex && regex.flags.contains('s'))
                    || (self.options.sticky_regex && regex.flags.contains('y'))
                    || (self.options.unicode_regex && regex.flags.contains('u'))
                    || (self.options.unicode_sets_regex && regex.flags.contains('v'))
                    || (self.options.has_indices && regex.flags.contains('d'))
                    || self.should_transform_named_capture(&regex.exp)
                    || (self.options.lookbehind_assertion
                        && (regex.exp.contains("(?<=") || regex.exp.contains("(?<!")))
                    || self.should_transform_unicode_property(&regex.exp, &regex.flags);

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
