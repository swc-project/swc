use swc_common::util::take::Take;
use swc_ecma_ast::{CallExpr, Expr, Lit, Pass, Regex};
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

pub fn regexp(config: Config) -> impl Pass {
    visit_mut_pass(RegExp { config })
}

#[derive(Default, Clone, Copy)]
pub struct Config {
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

struct RegExp {
    config: Config,
}

impl VisitMut for RegExp {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if let Expr::Lit(Lit::Regex(regex)) = expr {
            if (self.config.dot_all_regex && regex.flags.contains('s'))
                || (self.config.sticky_regex && regex.flags.contains('y'))
                || (self.config.unicode_regex && regex.flags.contains('u'))
                || (self.config.unicode_sets_regex && regex.flags.contains('v'))
                || (self.config.has_indices && regex.flags.contains('d'))
                || (self.config.named_capturing_groups_regex && regex.exp.contains("(?<"))
                || (self.config.lookbehind_assertion && regex.exp.contains("(?<=")
                    || regex.exp.contains("(?<!"))
                || (self.config.unicode_property_regex
                    && (regex.exp.contains("\\p{") || regex.exp.contains("\\P{")))
            {
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
        }
    }
}
