use swc_atoms::Atom;
use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_compat_regexp::transform_unicode_property_escapes;
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

        // Parse the regex pattern
        let mut ast = LiteralParser::new(pattern, Some(flags), RegexpOptions::default())
            .parse()
            .ok()?;

        // Transform unicode property escapes
        transform_unicode_property_escapes(&mut ast);

        // Serialize back to string
        Some(ast.to_string())
    }
}

impl VisitMutHook<TraverseCtx> for RegexpPass {
    fn exit_expr(&mut self, expr: &mut Expr, _: &mut TraverseCtx) {
        if let Expr::Lit(Lit::Regex(regex)) = expr {
            let needs_transform = (self.options.dot_all_regex && regex.flags.contains('s'))
                || (self.options.sticky_regex && regex.flags.contains('y'))
                || (self.options.unicode_regex && regex.flags.contains('u'))
                || (self.options.unicode_sets_regex && regex.flags.contains('v'))
                || (self.options.has_indices && regex.flags.contains('d'))
                || (self.options.named_capturing_groups_regex && regex.exp.contains("(?<"))
                || (self.options.lookbehind_assertion
                    && (regex.exp.contains("(?<=") || regex.exp.contains("(?<!")))
                || (self.options.unicode_property_regex
                    && (regex.exp.contains("\\p{") || regex.exp.contains("\\P{")));

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
    }
}
