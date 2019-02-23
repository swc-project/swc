use ast::*;
use swc_common::{Fold, FoldWith, Spanned, DUMMY_SP};

#[derive(Clone, Copy)]
pub struct BlockScopedFns;

impl Fold<Vec<Stmt>> for BlockScopedFns {
    fn fold(&mut self, items: Vec<Stmt>) -> Vec<Stmt> {
        let mut stmts = Vec::with_capacity(items.len());
        let mut extra_stmts = Vec::with_capacity(items.len());

        for stmt in items {
            // This is to preserve function Class()
            if stmt.span().is_dummy() {
                extra_stmts.push(stmt)
            } else {
                match stmt {
                    Stmt::Decl(Decl::Fn(decl)) => stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Let,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(decl.ident.clone()),
                            init: Some(box Expr::Fn(FnExpr {
                                ident: Some(decl.ident),
                                function: decl.function,
                            })),
                            definite: false,
                        }],
                        declare: false,
                    }))),
                    _ => extra_stmts.push(stmt.fold_children(self)),
                }
            }
        }

        stmts.append(&mut extra_stmts);

        stmts
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| BlockScopedFns,
        hoisting,
        r#"
{
    function fn1() { fn2(); }

    fn1();

    function fn2() { }
}
"#,
        r#"
{
    let fn1 = function fn1() {
        fn2();
    };
    let fn2 = function fn2() {
    };
    fn1();
}
"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| BlockScopedFns,
        basic,
        r#"{
  function name (n) {
    return n;
  }
}

name("Steve");"#,
        r#"{
  let name = function name(n) {
    return n;
  };
}
name("Steve");
"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| BlockScopedFns,
        issue_271,
        "
function foo(scope) {
    scope.startOperation = startOperation;

    function startOperation(operation) {
        scope.agentOperation = operation;
    }
}
",
        "
function foo(scope) {
    let startOperation = function startOperation(operation) {
        scope.agentOperation = operation;
    };
    scope.startOperation = startOperation;
}
"
    );

}
