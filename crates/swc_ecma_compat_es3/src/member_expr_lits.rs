use swc_ecma_ast::*;
use swc_ecma_utils::is_valid_ident;
use swc_ecma_visit::{fold_pass, standard_only_fold, Fold, FoldWith};
use swc_trace_macro::swc_trace;

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
pub fn member_expression_literals() -> impl Pass {
    fold_pass(MemberExprLit)
}
#[derive(Default, Clone, Copy)]
struct MemberExprLit;

#[swc_trace]
impl Fold for MemberExprLit {
    standard_only_fold!();

    fn fold_member_expr(&mut self, e: MemberExpr) -> MemberExpr {
        let e: MemberExpr = e.fold_children_with(self);

        if let MemberProp::Ident(i) = e.prop {
            if i.sym.is_reserved() || i.sym.is_reserved_in_strict_mode(true)
                        || i.sym.is_reserved_in_es3()
                        // it's not bind, so you could use eval
                        || !is_valid_ident(&i.sym)
            {
                return MemberExpr {
                    prop: MemberProp::Computed(ComputedPropName {
                        span: i.span,
                        expr: Lit::Str(Str {
                            span: i.span,
                            raw: None,
                            value: i.sym,
                        })
                        .into(),
                    }),
                    ..e
                };
            } else {
                return MemberExpr {
                    prop: MemberProp::Ident(IdentName::new(i.sym, i.span)),
                    ..e
                };
            }
        };

        e
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| fold_pass(MemberExprLit),
        basic,
        r#"obj["foo"] = "isValid";

obj.const = "isKeyword";
obj["var"] = "isKeyword";"#,
        ok_if_code_eq
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| fold_pass(MemberExprLit),
        issue_206,
        "const number = foo[bar1][baz1]"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| fold_pass(MemberExprLit),
        issue_211,
        "_query[idx]=$this.attr('data-ref');"
    );
}
