use super::{
    util::{PatExt, TypeExt},
    Analyzer, Scope,
};
use crate::{errors::Error, tests::Tester};
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

fn assign(ty: &str, expr: &str) -> Option<Error> {
    let src = format!("let v: {} = {};", ty, expr);

    Tester::run(|tester| {
        let stmt = tester.parse_stmt("test.ts", &src)?;

        let item = match stmt {
            Stmt::Decl(Decl::Var(VarDecl { decls, .. })) => decls.into_iter().next().unwrap(),
            _ => unreachable!(),
        };
        let arena = toolshed::Arena::new();
        let scope = arena.alloc(Scope::root(&arena));
        let checker = Analyzer {
            errors: Default::default(),
            info: Default::default(),
            scope,
        };
        let rhs_ty = checker.type_of(&item.init.unwrap());
        let ty = item.name.get_ty().unwrap();

        Ok(rhs_ty.assign_to(&ty))
    })
}

fn assert_assignable(ty: &str, expr: &str) {
    assert_eq!(assign(ty, expr), None);
}
