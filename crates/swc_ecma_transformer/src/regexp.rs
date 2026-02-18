use swc_common::{util::take::Take, Span};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
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
    #[inline]
    fn is_regexp_constructor(callee: &Expr) -> bool {
        matches!(callee, Expr::Ident(Ident { sym, .. }) if sym == "RegExp")
    }

    #[inline]
    fn arg_string(arg: &ExprOrSpread) -> Option<&str> {
        if arg.spread.is_some() {
            return None;
        }

        match arg.expr.as_ref() {
            Expr::Lit(Lit::Str(Str { value, .. })) => value.as_str(),
            _ => None,
        }
    }

    fn pattern_and_flags<'a>(args: &'a [ExprOrSpread]) -> Option<(&'a str, &'a str)> {
        let pattern = Self::arg_string(args.first()?)?;
        let flags = args.get(1).and_then(Self::arg_string).unwrap_or("");

        Some((pattern, flags))
    }

    #[inline]
    fn should_transform_pattern(&self, exp: &str, flags: &str) -> bool {
        (self.options.dot_all_regex && flags.contains('s'))
            || (self.options.sticky_regex && flags.contains('y'))
            || (self.options.unicode_regex && flags.contains('u'))
            || (self.options.unicode_sets_regex && flags.contains('v'))
            || (self.options.has_indices && flags.contains('d'))
            || (self.options.named_capturing_groups_regex && exp.contains("(?<"))
            || (self.options.lookbehind_assertion && exp.contains("(?<=") || exp.contains("(?<!"))
            || (self.options.unicode_property_regex
                && (exp.contains("\\p{") || exp.contains("\\P{")))
    }

    #[inline]
    fn should_transform_constructor_args(&self, args: &[ExprOrSpread]) -> bool {
        let Some((exp, flags)) = Self::pattern_and_flags(args) else {
            return false;
        };

        self.should_transform_pattern(exp, flags)
    }

    #[inline]
    fn to_regexp_call(span: Span, args: Vec<ExprOrSpread>) -> Expr {
        CallExpr {
            span,
            callee: quote_ident!("RegExp").as_callee(),
            args,
            ..Default::default()
        }
        .into()
    }
}

impl VisitMutHook<TraverseCtx> for RegexpPass {
    fn exit_expr(&mut self, expr: &mut Expr, _: &mut TraverseCtx) {
        match expr {
            Expr::Lit(Lit::Regex(regex)) => {
                if !self.should_transform_pattern(regex.exp.as_ref(), regex.flags.as_ref()) {
                    return;
                }

                let Regex { exp, flags, span } = regex.take();

                let exp: Expr = exp.into();
                let mut args = vec![exp.into()];

                if !flags.is_empty() {
                    let flags: Expr = flags.into();
                    args.push(flags.into());
                }

                *expr = Self::to_regexp_call(span, args);
            }
            Expr::New(new_expr) if Self::is_regexp_constructor(&new_expr.callee) => {
                let Some(args) = new_expr.args.as_deref() else {
                    return;
                };

                if !self.should_transform_constructor_args(args) {
                    return;
                }

                let span = new_expr.span;
                let args = new_expr.args.take().unwrap_or_default();

                *expr = Self::to_regexp_call(span, args);
            }
            _ => {}
        }
    }
}
