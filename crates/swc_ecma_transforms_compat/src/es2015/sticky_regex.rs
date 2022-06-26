use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_transforms_macros::parallel;
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
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
#[tracing::instrument(level = "info", skip_all)]
pub fn sticky_regex() -> impl 'static + Fold + VisitMut {
    as_folder(StickyRegex)
}

struct StickyRegex;

impl Parallel for StickyRegex {
    fn merge(&mut self, _: Self) {}

    fn create(&self) -> Self {
        StickyRegex
    }
}

#[swc_trace]
#[parallel]
impl VisitMut for StickyRegex {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Lit(Lit::Regex(Regex { exp, flags, span })) = e {
            if flags.contains('y') {
                let str_lit = |s: JsWord| {
                    Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        raw: None,
                        value: s,
                    })))
                };

                *e = Expr::New(NewExpr {
                    span: *span,
                    callee: Box::new(quote_ident!(*span, "RegExp").into()),
                    args: Some(vec![
                        str_lit(exp.clone()).as_arg(),
                        str_lit(flags.clone()).as_arg(),
                    ]),
                    type_args: Default::default(),
                })
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
        "var re = /o\"'+/y;",
        "var re = new RegExp(\"o\\\"'+\", \"y\");"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| sticky_regex(),
        babel_ignore_non_sticky,
        "var re = /o+/;",
        "var re = /o+/;"
    );
}
