use crate::util::ExprFactory;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, DUMMY_SP};
use swc_ecma_ast::*;

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
#[derive(Clone, Copy)]
pub struct StickyRegex;

noop_fold_type!(StickyRegex);

impl Fold<Expr> for StickyRegex {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children_with(self);

        match e {
            Expr::Lit(Lit::Regex(Regex { exp, flags, span })) => {
                if flags.contains('y') {
                    let str_lit = |s: JsWord| {
                        box Expr::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: s,
                            has_escape: false,
                        }))
                    };

                    Expr::New(NewExpr {
                        span,
                        callee: box quote_ident!(span, "RegExp").into(),
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
