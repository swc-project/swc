use super::{
    util::{PatExt, TypeRefExt},
    Analyzer, Scope,
};
use crate::{tests::Tester, Checker};
use std::{path::PathBuf, sync::Arc};
use swc_common::VisitWith;
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
fn assignment_1() {
    assert_valid(
        "
let a: undefined | number;
a = 2;",
    );
;}

#[test]
fn assignment_2() {
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

#[test]
fn assignment_call() {
    assert_valid(
        "
        interface Foo {
            (n: number): number;
            (): string;
        }

        let a = {} as Foo;
        let b: number = a(1);
        let c: string = a();
    ",
    );
}

#[test]
fn assignment_member_call() {
    assert_valid(
        "
        interface Foo {
            call(n: number): number;
            call(): string;
        }

        let a = {} as Foo;
        let b: number = a.call(1);
        let c: string = a.call();
    ",
    );
}

#[test]
fn assignment_generalized_lit_ty() {
    assert_valid(
        "
        let a = 'foo';
        a = 'bar';
        let b: string = a;
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

        let rhs_ty = with_analyzer(|a| {
            a.type_of(&item.clone().init.unwrap())
                .expect("failed to get type of expression")
                .into_owned()
        });
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

        with_analyzer(|mut a| {
            module.visit_with(&mut a);

            assert_eq!(a.info.errors, vec![]);
        });

        Ok(())
    });
}

fn with_analyzer<F, R>(op: F) -> R
where
    F: FnOnce(Analyzer) -> R,
{
    ::testing::run_test(false, |cm, handler| {
        let checker = Checker::new(cm, handler, Default::default());

        let a = Analyzer::new(Scope::root(), Arc::new(PathBuf::from("test.js")), &checker);

        Ok(op(a))
    })
    .unwrap()
}
