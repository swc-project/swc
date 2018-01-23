use swc_common::{FoldWith, Folder};
use swc_common::DUMMY_SP;
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
///
#[derive(Debug, Clone, Copy)]
pub struct StickyRegex;

impl Folder<ExprKind> for StickyRegex {
    fn fold(&mut self, e: ExprKind) -> ExprKind {
        let e = e.fold_children(self);

        match e {
            ExprKind::Lit(Lit::Regex(Regex { exp, flags })) => {
                if flags.contains("y") {
                    let str_lit = |s| box Expr {
                        span: DUMMY_SP,
                        node: ExprKind::Lit(Lit::Str(s)),
                    };

                    return ExprKind::New(NewExpr {
                        callee: Ident {
                            span: DUMMY_SP,
                            sym: js_word!("RegExp"),
                        }.into(),
                        args: Some(vec![
                            ExprOrSpread::Expr(str_lit(exp)),
                            ExprOrSpread::Expr(str_lit(flags.to_string())),
                        ]),
                    });
                } else {
                    return ExprKind::Lit(Lit::Regex(Regex { exp, flags }));
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
