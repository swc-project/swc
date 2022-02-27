use swc_ecma_quote::quote_expr;

#[test]
fn quote_expr_call_1() {
    let expr = quote_expr!("call(arg1, typeof arg2, arg3)");
}
