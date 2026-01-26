//! babel: `transform-member-expression-literals`
//!
//! # Input
//! ```js
//! obj["foo"] = "isValid";
//!
//! obj.const = "isKeyword";
//! obj["var"] = "isKeyword";
//! ```
//!
//! # Output
//! ```js
//! obj.foo = "isValid";
//!
//! obj["const"] = "isKeyword";
//! obj["var"] = "isKeyword";
//! ```

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::is_valid_ident;
use swc_ecma_visit::{fold_pass, standard_only_fold, Fold, FoldWith};

/// Creates a member expression literals transformation hook.
pub(crate) fn hook<C>() -> impl VisitMutHook<C> {
    MemberExprLitHook
}

/// babel: `transform-member-expression-literals`
pub fn member_expression_literals() -> impl Pass {
    visit_mut_pass(VisitMutWithHook {
        hook: hook(),
        context: (),
    })
}

struct MemberExprLitHook;

impl<C> VisitMutHook<C> for MemberExprLitHook {
    fn exit_member_expr(&mut self, e: &mut MemberExpr, _ctx: &mut C) {
        if let MemberProp::Ident(i) = &e.prop {
            if i.sym.is_reserved()
                || i.sym.is_reserved_in_strict_mode(true)
                || i.sym.is_reserved_in_es3()
                // it's not bind, so you could use eval
                || !is_valid_ident(&i.sym)
            {
                e.prop = MemberProp::Computed(ComputedPropName {
                    span: i.span,
                    expr: Lit::Str(Str {
                        span: i.span,
                        raw: None,
                        value: i.sym.clone().into(),
                    })
                    .into(),
                });
            } else {
                e.prop = MemberProp::Ident(IdentName::new(i.sym.clone(), i.span));
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
