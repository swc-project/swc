use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

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
pub fn sticky_regex() -> impl 'static + Fold {
    StickyRegex
}

#[derive(Clone, Copy)]
struct StickyRegex;

impl Fold for StickyRegex {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e = e.fold_children_with(self);

        match e {
            Expr::Lit(Lit::Regex(Regex { exp, flags, span })) => {
                if flags.contains('y') {
                    let str_lit = |s: JsWord| {
                        Box::new(Expr::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: s,
                            has_escape: false,
                            kind: StrKind::Normal {
                                contains_quote: false,
                            },
                        })))
                    };

                    Expr::New(NewExpr {
                        span,
                        callee: Box::new(quote_ident!(span, "RegExp").into()),
                        args: Some(vec![str_lit(exp).as_arg(), str_lit(flags).as_arg()]),
                        type_args: Default::default(),
                    })
                } else {
                    Expr::Lit(Lit::Regex(Regex { exp, flags, span }))
                }
            }
            _ => e,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| StickyRegex,
        babel_basic,
        "var re = /o+/y;",
        "var re = new RegExp('o+', 'y');"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| StickyRegex,
        babel_ignore_non_sticky,
        "var re = /o+/;",
        "var re = /o+/;"
    );
}
