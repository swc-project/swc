use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_transforms_base::helper;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{quote_str, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, noop_visit_type, VisitMut, VisitMutWith};
use swc_ecma_visit::{Fold, Node, Visit, VisitWith};

pub fn typeof_symbol() -> impl VisitMut + Fold {
    as_folder(TypeOfSymbol)
}

#[derive(Clone)]
struct TypeOfSymbol;

#[fast_path(TypeOfFinder)]
impl VisitMut for TypeOfSymbol {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        match expr {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
            }) => match &**arg {
                Expr::Ident(..) => {
                    let undefined_str = quote_str!("undefined");
                    let undefined_str = Box::new(Expr::Lit(Lit::Str(undefined_str)));

                    let test = Box::new(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        op: op!("==="),
                        left: Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("typeof"),
                            arg: arg.clone(),
                        })),
                        right: undefined_str.clone(),
                    }));

                    let call = Expr::Call(CallExpr {
                        span: *span,
                        callee: helper!(*span, type_of, "typeof"),
                        args: vec![arg.take().as_arg()],

                        type_args: Default::default(),
                    });

                    *expr = Expr::Cond(CondExpr {
                        span: *span,
                        test,
                        cons: undefined_str,
                        alt: Box::new(call),
                    });
                }
                _ => {
                    let call = Expr::Call(CallExpr {
                        span: *span,
                        callee: helper!(*span, type_of, "typeof"),
                        args: vec![arg.take().as_arg()],

                        type_args: Default::default(),
                    });

                    *expr = call;
                }
            },
            _ => {}
        }
    }

    fn visit_mut_bin_expr(&mut self, expr: &mut BinExpr) {
        match expr.op {
            op!("==") | op!("!=") | op!("===") | op!("!==") => {}
            _ => {
                expr.visit_mut_children_with(self);
                return;
            }
        }

        match *expr.left {
            Expr::Unary(UnaryExpr {
                op: op!("typeof"), ..
            }) => {
                if is_non_symbol_literal(&expr.right) {
                    return;
                }
            }
            _ => {}
        }
        match *expr.right {
            Expr::Unary(UnaryExpr {
                op: op!("typeof"), ..
            }) => {
                if is_non_symbol_literal(&expr.left) {
                    return;
                }
            }
            _ => {}
        }

        expr.visit_mut_children_with(self)
    }
}

#[derive(Default)]
struct TypeOfFinder {
    found: bool,
}

impl Visit for TypeOfFinder {
    noop_visit_type!();

    fn visit_unary_expr(&mut self, e: &UnaryExpr, _: &dyn Node) {
        e.visit_children_with(self);

        if e.op == op!("typeof") {
            self.found = true
        }
    }
}

impl Check for TypeOfFinder {
    fn should_handle(&self) -> bool {
        self.found
    }
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
    use swc_ecma_parser::Syntax;
    use swc_ecma_transforms_testing::test;

    test!(
        Syntax::default(),
        |_| typeof_symbol(),
        dont_touch_non_symbol_comparison,
        "typeof window !== 'undefined'",
        "typeof window !== 'undefined'"
    );

    test!(
        Syntax::default(),
        |_| typeof_symbol(),
        dont_touch_non_symbol_comparison_02,
        "'undefined' !== typeof window",
        "'undefined' !== typeof window"
    );

    test!(
        Syntax::default(),
        |_| typeof_symbol(),
        issue_1843_1,
        "
        function isUndef(type) {
            return type === 'undefined';
        }
        
        var isWeb = !isUndef(typeof window) && 'onload' in window;
        exports.isWeb = isWeb;
        var isNode = !isUndef(typeof process) && !!(process.versions && process.versions.node);
        exports.isNode = isNode;
        var isWeex = !isUndef(typeof WXEnvironment) && WXEnvironment.platform !== 'Web';
        exports.isWeex = isWeex;
        ",
        "
        function isUndef(type) {
        return type === 'undefined';
        }
        
        var isWeb =
        !isUndef(typeof window === 'undefined' ? 'undefined' : _typeof(window)) &&
        'onload' in window;
        exports.isWeb = isWeb;
        var isNode =
        !isUndef(typeof process === 'undefined' ? 'undefined' : _typeof(process)) &&
        !!(process.versions && process.versions.node);
        exports.isNode = isNode;
        var isWeex =
        !isUndef(
            typeof WXEnvironment === 'undefined' ? 'undefined' : _typeof(WXEnvironment)
        ) && WXEnvironment.platform !== 'Web';
        exports.isWeex = isWeex;
        "
    );
}
