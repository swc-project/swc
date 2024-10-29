use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Parallel};
use swc_ecma_utils::{quote_str, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub fn typeof_symbol() -> impl Pass {
    visit_mut_pass(TypeOfSymbol)
}

#[derive(Clone, Copy)]
struct TypeOfSymbol;

#[swc_trace]
impl Parallel for TypeOfSymbol {
    fn merge(&mut self, _: Self) {}

    fn create(&self) -> Self {
        TypeOfSymbol
    }
}

#[swc_trace]
impl VisitMut for TypeOfSymbol {
    noop_visit_mut_type!(fail);

    fn visit_mut_bin_expr(&mut self, expr: &mut BinExpr) {
        match expr.op {
            op!("==") | op!("!=") | op!("===") | op!("!==") => {}
            _ => {
                expr.visit_mut_children_with(self);
                return;
            }
        }

        if let Expr::Unary(UnaryExpr {
            op: op!("typeof"), ..
        }) = *expr.left
        {
            if is_non_symbol_literal(&expr.right) {
                return;
            }
        }
        if let Expr::Unary(UnaryExpr {
            op: op!("typeof"), ..
        }) = *expr.right
        {
            if is_non_symbol_literal(&expr.left) {
                return;
            }
        }

        expr.visit_mut_children_with(self)
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if let Expr::Unary(UnaryExpr {
            span,
            op: op!("typeof"),
            arg,
        }) = expr
        {
            match &**arg {
                Expr::Ident(..) => {
                    let undefined_str: Box<Expr> = quote_str!("undefined").into();

                    let test = BinExpr {
                        span: DUMMY_SP,
                        op: op!("==="),
                        left: Box::new(
                            UnaryExpr {
                                span: DUMMY_SP,
                                op: op!("typeof"),
                                arg: arg.clone(),
                            }
                            .into(),
                        ),
                        right: undefined_str.clone(),
                    }
                    .into();

                    let call = CallExpr {
                        span: *span,
                        callee: helper!(*span, type_of),
                        args: vec![arg.take().as_arg()],
                        ..Default::default()
                    }
                    .into();

                    *expr = CondExpr {
                        span: *span,
                        test,
                        cons: undefined_str,
                        alt: Box::new(call),
                    }
                    .into();
                }
                _ => {
                    let call = CallExpr {
                        span: *span,
                        callee: helper!(*span, type_of),
                        args: vec![arg.take().as_arg()],

                        ..Default::default()
                    }
                    .into();

                    *expr = call;
                }
            }
        }
    }

    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        if &f.ident.sym == "_type_of" {
            return;
        }

        f.visit_mut_children_with(self);
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        if let Some(body) = &f.body {
            if let Some(Stmt::Expr(first)) = body.stmts.first() {
                if let Expr::Lit(Lit::Str(s)) = &*first.expr {
                    match &*s.value {
                        "@swc/helpers - typeof" | "@babel/helpers - typeof" => return,
                        _ => {}
                    }
                }
            }
        }

        f.visit_mut_children_with(self);
    }
}

#[tracing::instrument(level = "info", skip_all)]
fn is_non_symbol_literal(e: &Expr) -> bool {
    match e {
        Expr::Lit(Lit::Str(Str { value, .. })) => matches!(
            &**value,
            "undefined" | "boolean" | "number" | "string" | "function"
        ),
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_parser::Syntax;
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        Syntax::default(),
        |_| typeof_symbol(),
        dont_touch_non_symbol_comparison,
        "typeof window !== 'undefined'"
    );

    test!(
        Syntax::default(),
        |_| typeof_symbol(),
        dont_touch_non_symbol_comparison_02,
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
        "
    );
}
