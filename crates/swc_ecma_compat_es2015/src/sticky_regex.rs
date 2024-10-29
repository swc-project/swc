use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

/// Compile ES2015 sticky regex to an ES5 RegExp constructor
///
///# Example
///## In
///
/// ```js
/// /o+/y;
/// ```
///
///## Out
///
/// ```js
/// new RegExp("o+", "y")
/// ```
pub fn sticky_regex() -> impl Pass {
    visit_mut_pass(StickyRegex)
}

struct StickyRegex;

impl Parallel for StickyRegex {
    fn merge(&mut self, _: Self) {}

    fn create(&self) -> Self {
        StickyRegex
    }
}

#[swc_trace]
impl VisitMut for StickyRegex {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Lit(Lit::Regex(Regex { exp, flags, span })) = e {
            if flags.contains('y') {
                *e = NewExpr {
                    span: *span,
                    callee: Box::new(quote_ident!(Default::default(), *span, "RegExp").into()),
                    args: Some(vec![exp.clone().as_arg(), flags.clone().as_arg()]),
                    ..Default::default()
                }
                .into()
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| sticky_regex(),
        babel_basic,
        "var re = /o\"'+/y;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| sticky_regex(),
        babel_ignore_non_sticky,
        "var re = /o+/;"
    );
}
