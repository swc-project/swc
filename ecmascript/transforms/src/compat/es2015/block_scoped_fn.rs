use ast::*;
use swc_common::{Fold, FoldWith, DUMMY_SP};

pub fn block_scoped_functions() -> impl Fold<Module> {
    BlockScopedFns
}

struct BlockScopedFns;

impl Fold<Stmt> for BlockScopedFns {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children(self);

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
                }))
            }
            _ => stmt,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    test!(
        block_scoped_functions(),
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
