use swc_common::util::take::Take;
use swc_ecma_ast::{CallExpr, Expr, Lit, Regex};
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn regexp() -> impl Fold + VisitMut {
    as_folder(RegExp {})
}

struct RegExp;

impl VisitMut for RegExp {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if let Expr::Lit(Lit::Regex(regex)) = expr {
            if regex.flags.contains('s')      // proposal-regexp-dotall-flag
                || regex.exp.contains("(?<")  // proposal-regexp-named-groups
                || regex.exp.contains("(?<=") // proposal-regexp-lookbehind
                || regex.exp.contains("(?<!")
                || regex.exp.contains("\\p{") // proposal-regexp-unicode-property-escapes
                || regex.exp.contains("\\P{")
            {
                let Regex { exp, flags, span } = regex.take();

                let exp: Expr = exp.into();
                let mut args = vec![exp.into()];

                if !flags.is_empty() {
                    let flags: Expr = flags.into();
                    args.push(flags.into());
                }

                *expr = CallExpr {
                    span,
                    callee: quote_ident!("RegExp").as_callee(),
                    args,
                    type_args: None,
                }
                .into()
            }
        }
    }
}
