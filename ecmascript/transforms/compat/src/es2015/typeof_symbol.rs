use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

pub fn typeof_symbol() -> impl Fold {
    TypeOfSymbol
}

#[derive(Clone)]
struct TypeOfSymbol;

impl Fold for TypeOfSymbol {
    noop_fold_type!();

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        // fast path
        if !should_work(&expr) {
            return expr;
        }

        let expr = expr.fold_children_with(self);

        match expr {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
            }) => Expr::Call(CallExpr {
                span,
                callee: helper!(span, type_of, "typeof"),
                args: vec![arg.as_arg()],

                type_args: Default::default(),
            }),
            _ => expr,
        }
    }

    fn fold_bin_expr(&mut self, expr: BinExpr) -> BinExpr {
        match expr.op {
            op!("==") | op!("!=") | op!("===") | op!("!==") => {}
            _ => return expr.fold_children_with(self),
        }

        match *expr.left {
            Expr::Unary(UnaryExpr {
                op: op!("typeof"), ..
            }) => {
                if is_non_symbol_literal(&expr.right) {
                    return expr;
                }
            }
            _ => {}
        }
        match *expr.right {
            Expr::Unary(UnaryExpr {
                op: op!("typeof"), ..
            }) => {
                if is_non_symbol_literal(&expr.left) {
                    return expr;
                }
            }
            _ => {}
        }

        expr.fold_children_with(self)
    }
}

fn should_work(node: &Expr) -> bool {
    struct Visitor {
        found: bool,
    }
    impl Visit for Visitor {
        noop_visit_type!();

        fn visit_unary_expr(&mut self, e: &UnaryExpr, _: &dyn Node) {
            if e.op == op!("typeof") {
                self.found = true
            }
        }
    }
    let mut v = Visitor { found: false };
    node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
    v.found
}

fn is_non_symbol_literal(e: &Expr) -> bool {
    match *e {
        Expr::Lit(Lit::Str(Str {
            value: js_word!("undefined"),
            ..
        }))
        | Expr::Lit(Lit::Str(Str {
            value: js_word!("object"),
            ..
        }))
        | Expr::Lit(Lit::Str(Str {
            value: js_word!("boolean"),
            ..
        }))
        | Expr::Lit(Lit::Str(Str {
            value: js_word!("number"),
            ..
        }))
        | Expr::Lit(Lit::Str(Str {
            value: js_word!("string"),
            ..
        }))
        | Expr::Lit(Lit::Str(Str {
            value: js_word!("function"),
            ..
        })) => true,
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| TypeOfSymbol,
        dont_touch_non_symbol_comparison,
        "typeof window !== 'undefined'",
        "typeof window !== 'undefined'"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| TypeOfSymbol,
        dont_touch_non_symbol_comparison_02,
        "'undefined' !== typeof window",
        "'undefined' !== typeof window"
    );
}
