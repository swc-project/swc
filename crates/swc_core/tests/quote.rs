use swc_core::{ast::Ident, common::DUMMY_SP, quote, quote_expr, utils::private_ident};

#[test]
fn quote_expr_call_1() {
    let _expr = quote_expr!("call(arg1, typeof arg2, arg3)");
}

#[test]
fn quote_expr_var_cloned() {
    testing::run_test2(false, |_cm, _handler| {
        let id = private_ident!("_ref");

        let _expr = quote_expr!("call($my_id, typeof arg2, $my_id)", my_id = id);

        Ok(())
    })
    .unwrap();
}

#[test]
fn quote_example() {
    let _stmt = quote!(
        "const $name = 4;" as Stmt,
        name = Ident::new("ref".into(), DUMMY_SP)
    );
}

#[test]
fn quote_var_type_expr() {
    let _stmt = quote!(
        "const $name = $val;" as Stmt,
        name = Ident::new("ref".into(), DUMMY_SP),
        val: Expr = 4.into(),
    );
}

#[test]
fn quote_var_type_pat() {
    let _stmt = quote!(
        "const $name = $val;" as Stmt,
        name: Pat = Ident::new("ref".into(), DUMMY_SP).into(),
        val: Ident = Ident::new("val".into(), DUMMY_SP),
    );
}
