use ast::*;
use swc_common::{Fold, FoldWith, DUMMY_SP};

pub struct BlockScopedFns;

impl Fold<Stmt> for BlockScopedFns {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        match stmt {
            Stmt::Decl(Decl::Fn(decl)) => {
                return Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(decl.ident.clone()),
                        init: Some(box Expr::Fn(FnExpr {
                            ident: Some(decl.ident),
                            function: decl.function,
                        })),
                    }],
                }));
            }
            _ => stmt.fold_children(self),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::Es2019,
        BlockScopedFns,
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
}
