use swc_atoms::js_word;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Parallel};
use swc_ecma_transforms_macros::parallel;
use swc_ecma_utils::{quote_str, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

#[tracing::instrument(level = "info", skip_all)]
pub fn typeof_symbol() -> impl VisitMut + Fold {
    as_folder(TypeOfSymbol)
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
#[parallel]
impl VisitMut for TypeOfSymbol {
    noop_visit_mut_type!();

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
            }
        }
    }

    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        if &f.ident.sym == "_typeof" {
            return;
        }

        f.visit_mut_children_with(self);
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        if let Some(body) = &f.body {
            if let Some(Stmt::Expr(first)) = body.stmts.get(0) {
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

    fn visit_mut_var_declarator(&mut self, v: &mut VarDeclarator) {
        v.visit_mut_children_with(self);

        if let Pat::Ident(i) = &v.name {
            if &i.id.sym == "_typeof" {}
        }
    }
}

#[tracing::instrument(level = "info", skip_all)]
fn is_non_symbol_literal(e: &Expr) -> bool {
    matches!(
        *e,
        Expr::Lit(Lit::Str(Str {
            value: js_word!("undefined"),
            ..
        })) | Expr::Lit(Lit::Str(Str {
            value: js_word!("object"),
            ..
        })) | Expr::Lit(Lit::Str(Str {
            value: js_word!("boolean"),
            ..
        })) | Expr::Lit(Lit::Str(Str {
            value: js_word!("number"),
            ..
        })) | Expr::Lit(Lit::Str(Str {
            value: js_word!("string"),
            ..
        })) | Expr::Lit(Lit::Str(Str {
            value: js_word!("function"),
            ..
        }))
    )
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
        !isUndef(typeof window === \"undefined\" ? \"undefined\" : _typeof(window)) &&
        'onload' in window;
        exports.isWeb = isWeb;
        var isNode =
        !isUndef(typeof process === \"undefined\" ? \"undefined\" : _typeof(process)) &&
        !!(process.versions && process.versions.node);
        exports.isNode = isNode;
        var isWeex =
        !isUndef(
            typeof WXEnvironment === \"undefined\" ? \"undefined\" : _typeof(WXEnvironment)
        ) && WXEnvironment.platform !== 'Web';
        exports.isWeex = isWeex;
        "
    );
}
