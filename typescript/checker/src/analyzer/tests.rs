use super::{
    util::{PatExt, TypeRefExt},
    Analyzer, Scope,
};
use crate::tests::Tester;
use swc_common::FoldWith;
use swc_ecma_ast::*;

#[test]
fn str_lit() {
    assert_assignable("string", "'foo'");
    assert_assignable("string | number", "'foo'");
    assert_assignable("string | undefined", "'foo'");
    assert_assignable("string", "'foo'");
    assert_assignable("any", "'foo'");
    assert_assignable("any & string", "'foo'");
}

#[test]
fn num_lit() {
    assert_assignable("number", "1");
    assert_assignable("string | number", "1");
    assert_assignable("number | undefined", "1");
    assert_assignable("any", "1");
    assert_assignable("any & number", "1");
}

#[test]
fn bool_lit() {
    assert_assignable("boolean", "true");
    assert_assignable("boolean | number", "true");
    assert_assignable("boolean | undefined", "false");
    assert_assignable("boolean", "false");
    assert_assignable("any", "false");
    assert_assignable("any & boolean", "true");
}

#[test]
fn bool_lit_2() {
    assert_assignable("boolean", "!1");
    assert_assignable("boolean", "!!1");
    assert_assignable("boolean", "!''");
    assert_assignable("boolean", "!'foo'");
}

#[test]
fn assigment_1() {
    assert_valid(
        "
let a: undefined | number;
a = 2;",
    );
;}

#[test]
fn assigment_2() {
    assert_valid(
        "
        let foo = true
        let a: undefined | string;
        if (foo) {
            a = 'foo';
            let b: string = a;
        }
    ",
    );
}

fn assert_assignable(ty: &str, expr: &str) {
    let src = format!("let v: {} = {};", ty, expr);

    Tester::run(|tester| {
        let stmt = tester.parse_stmt("test.ts", &src)?;

        let item = match stmt {
            Stmt::Decl(Decl::Var(VarDecl { decls, .. })) => decls.into_iter().next().unwrap(),
            _ => unreachable!(),
        };
        let a = Analyzer::new(Scope::root());
        let rhs_ty = a.type_of(&item.init.unwrap());
        let ty = item.name.get_ty().unwrap();

        assert_eq!(rhs_ty.assign_to(&ty), None);

        Ok(())
    });
}

fn assert_valid(src: &str) {
    Tester::run(|tester| {
        let module = tester
            .parse_module("test.ts", &src)
            .expect("failed to parse src");
        let mut a = Analyzer::new(Scope::root());
        module.fold_with(&mut a);
        assert_eq!(a.info.errors, vec![]);

        Ok(())
    });
}
