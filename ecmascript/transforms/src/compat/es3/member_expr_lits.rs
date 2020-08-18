use crate::util::is_valid_ident;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

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
pub fn member_expression_literals() -> impl Fold {
    MemberExprLit
}
#[derive(Default, Clone, Copy)]
struct MemberExprLit;

impl Fold for MemberExprLit {
    noop_fold_type!();

    fn fold_member_expr(&mut self, e: MemberExpr) -> MemberExpr {
        let mut e = validate!(e.fold_children_with(self));

        macro_rules! handle {
            ($sym:expr, $span:expr) => {
                if $sym.is_reserved_for_es3() || !is_valid_ident(&$sym) {
                    return MemberExpr {
                        computed: true,
                        prop: Box::new(Expr::Lit(Lit::Str(Str {
                            span: $span,
                            value: $sym,
                            has_escape: false,
                        }))),
                        ..e
                    };
                } else {
                    return MemberExpr {
                        computed: false,
                        prop: Box::new(Expr::Ident(quote_ident!($span, $sym))),
                        ..e
                    };
                }
            };
        }

        e.prop = match *e.prop {
            Expr::Ident(i) => {
                if e.computed {
                    Box::new(Expr::Ident(i))
                } else {
                    handle!(i.sym, i.span)
                }
            }
            _ => e.prop,
        };

        e
    }

    fn fold_module(&mut self, node: Module) -> Module {
        validate!(node.fold_children_with(self))
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
        r#"obj["foo"] = "isValid";

obj["const"] = "isKeyword";
obj["var"] = "isKeyword";"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| MemberExprLit,
        issue_206,
        "const number = foo[bar1][baz1]",
        "const number = foo[bar1][baz1]"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| MemberExprLit,
        issue_211,
        "_query[idx]=$this.attr('data-ref');",
        "_query[idx]=$this.attr('data-ref');"
    );
}
