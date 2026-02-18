use swc_atoms::Wtf8Atom;
use swc_common::util::take::Take;
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

fn is_enabled_feature(options: &RegExpOptions, regex_exp: &str, regex_flags: &str) -> bool {
    (options.dot_all_regex && regex_flags.contains('s'))
        || (options.sticky_regex && regex_flags.contains('y'))
        || (options.unicode_regex && regex_flags.contains('u'))
        || (options.unicode_sets_regex && regex_flags.contains('v'))
        || (options.has_indices && regex_flags.contains('d'))
        || (options.named_capturing_groups_regex && regex_exp.contains("(?<"))
        || (options.lookbehind_assertion
            && (regex_exp.contains("(?<=") || regex_exp.contains("(?<!")))
        || (options.unicode_property_regex
            && (regex_flags.contains('u') || regex_flags.contains('v'))
            && (regex_exp.contains("\\p{") || regex_exp.contains("\\P{")))
}

fn as_string(expr: &Expr) -> Option<Wtf8Atom> {
    match expr {
        Expr::Lit(Lit::Str(str)) => Some(str.value.clone()),
        // Preserve raw template text for invalid cooked values so feature checks
        // still work with escaped pattern/flag literals.
        Expr::Tpl(Tpl { exprs, quasis, .. }) if exprs.is_empty() && quasis.len() == 1 => quasis[0]
            .cooked
            .clone()
            .or_else(|| Some(quasis[0].raw.clone().into())),
        _ => None,
    }
}

fn is_regexp_constructor_with_feature(
    callee: &Expr,
    args: &[ExprOrSpread],
    options: &RegExpOptions,
) -> bool {
    let is_regexp_constructor = matches!(callee, Expr::Ident(Ident { sym, .. }) if sym == "RegExp");

    if !is_regexp_constructor || args.is_empty() || args.len() > 2 {
        return false;
    }

    let pattern = as_string(&args[0].expr);

    let flags = if args.len() == 2 {
        as_string(&args[1].expr).unwrap_or_default()
    } else {
        Default::default()
    };

    if let Some(pattern) = pattern.as_ref() {
        let pattern = pattern.to_string_lossy();
        let flags = flags.to_string_lossy();

        return is_enabled_feature(options, &pattern, &flags);
    }

    false
}

struct RegexpPass {
    options: RegExpOptions,
}

impl VisitMutHook<TraverseCtx> for RegexpPass {
    fn exit_expr(&mut self, expr: &mut Expr, _: &mut TraverseCtx) {
        if let Expr::Lit(Lit::Regex(regex)) = expr {
            if is_enabled_feature(&self.options, &regex.exp, &regex.flags) {
                let Regex { exp, flags, span } = regex.take();

                let exp: Expr = exp.into();
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

            return;
        }

        if let Expr::New(new_expr) = expr {
            if let Some(args) = new_expr.args.as_ref() {
                if is_regexp_constructor_with_feature(&new_expr.callee, args, &self.options) {
                    let NewExpr {
                        span,
                        ctxt,
                        callee,
                        args,
                        type_args,
                    } = new_expr.take();

                    *expr = CallExpr {
                        span,
                        ctxt,
                        callee: Callee::Expr(callee),
                        args: args.unwrap_or_default(),
                        type_args,
                    }
                    .into();
                }
            }

            return;
        }

        if let Expr::Call(call) = expr {
            if let Callee::Expr(callee) = &mut call.callee {
                if is_regexp_constructor_with_feature(callee, &call.args, &self.options) {
                    if let Expr::Ident(Ident { sym, .. }) = &mut **callee {
                        *sym = "RegExp".into();
                    }
                }
            }
        }
    }
}
