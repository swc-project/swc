use crate::util::is_valid_ident;
use ast::*;
use swc_common::{Fold, FoldWith};

/// babel: `transform-member-expression-literals`
///
/// # Input
/// ```js
/// obj["foo"] = "isValid";
///
/// obj.const = "isKeyword";
/// obj["var"] = "isKeyword";
/// ```
///
/// # Output
/// ```js
/// obj.foo = "isValid";
///
/// obj["const"] = "isKeyword";
/// obj["var"] = "isKeyword";
/// ```
#[derive(Default, Clone, Copy)]
pub struct MemberExprLit;

impl Fold<MemberExpr> for MemberExprLit {
    fn fold(&mut self, e: MemberExpr) -> MemberExpr {
        let mut e = e.fold_children(self);

        if e.computed {
            return e;
        }

        e.prop = match *e.prop {
            Expr::Lit(Lit::Str(Str {
                value: sym, span, ..
            }))
            | Expr::Ident(Ident { sym, span, .. }) => {
                if sym.is_reserved_for_es3() || !is_valid_ident(&sym) {
                    return MemberExpr {
                        computed: true,
                        prop: box Expr::Lit(Lit::Str(Str {
                            span,
                            value: sym,
                            has_escape: false,
                        })),
                        ..e
                    };
                } else {
                    return MemberExpr {
                        computed: false,
                        prop: box Expr::Ident(quote_ident!(span, sym)),
                        ..e
                    };
                }
            }
            _ => e.prop,
        };

        e
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| MemberExprLit,
        basic,
        r#"obj["foo"] = "isValid";

obj.const = "isKeyword";
obj["var"] = "isKeyword";"#,
        r#"obj.foo = "isValid";

obj["const"] = "isKeyword";
obj["var"] = "isKeyword";"#
    );

}
