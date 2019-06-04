use super::{
    util::{PatExt, TypeExt},
    Analyzer,
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

fn assign(ty: &str, expr: &str) -> Option<Error> {
    let src = format!("let v: {} = {};", ty, expr);

    Tester::run(|tester| {
        let stmt = tester.parse_stmt("test.ts", &src)?;

        let item = match stmt {
            Stmt::Decl(Decl::Var(VarDecl { decls, .. })) => decls.into_iter().next().unwrap(),
            _ => unreachable!(),
        };

        let checker = Analyzer::default();
        let rhs_ty = checker.type_of(&item.init.unwrap());
        let ty = item.name.get_ty().unwrap();

        Ok(rhs_ty.assign_to(&ty))
    })
}

fn assert_assignable(ty: &str, expr: &str) {
    assert_eq!(assign(ty, expr), None);
}
