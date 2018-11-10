use swc_common::{Fold, FoldWith};
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
#[derive(Debug, Clone, Copy)]
pub struct StickyRegex;

impl Fold<Expr> for StickyRegex {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Lit(Lit::Regex(Regex { exp, flags, span })) => {
                if flags
                    .as_ref()
                    .map(|s| s.value.contains("y"))
                    .unwrap_or(false)
                {
                    let str_lit = |s: Str| box Expr::Lit(Lit::Str(s));
                    let span = mark!(span);

                    return Expr::New(NewExpr {
                        callee: box Ident {
                            span,
                            sym: js_word!("RegExp"),
                        }
                        .into(),
                        args: Some(
                            vec![ExprOrSpread {
                                expr: str_lit(exp),
                                spread: None,
                            }]
                            .into_iter()
                            .chain(flags.map(|flags| ExprOrSpread {
                                expr: str_lit(flags),
                                spread: None,
                            }))
                            .collect(),
                        ),
                        span,
                    });
                } else {
                    return Expr::Lit(Lit::Regex(Regex { exp, flags, span }));
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
        StickyRegex,
        babel_basic,
        "var re = /o+/y;",
        "var re = new RegExp('o+', 'y');"
    );

    test!(
        StickyRegex,
        babel_ignore_non_sticky,
        "var re = /o+/;",
        "var re = /o+/;"
    );
}
