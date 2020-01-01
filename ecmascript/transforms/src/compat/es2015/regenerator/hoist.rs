use crate::util::{find_ids, Id};
use ast::*;
use smallvec::SmallVec;
use swc_common::{Fold, FoldWith, DUMMY_SP};

pub(super) fn hoist<T>(node: T) -> T
where
    T: FoldWith<Hoister>,
{
    let mut v = Hoister {
        vars: Default::default(),
    };
    node.fold_with(&mut v)
}

#[derive(Debug)]
pub(super) struct Hoister {
    vars: SmallVec<[Id; 32]>,
}

impl Hoister {
    fn var_decl_to_expr(&mut self, var: VarDecl) -> Expr {
        println!("var_decl_to_expr");

        let ids = find_ids(&var);
        self.vars.extend(ids);

        let mut exprs = vec![];

        for decl in var.decls {
            if let Some(init) = decl.init {
                exprs.push(
                    box AssignExpr {
                        span: decl.span,
                        left: PatOrExpr::Pat(box decl.name),
                        op: op!("="),
                        right: init,
                    }
                    .into(),
                );
            }
        }

        Expr::Seq(SeqExpr {
            span: DUMMY_SP,
            exprs,
        })
    }
}

impl Fold<VarDeclOrExpr> for Hoister {
    fn fold(&mut self, var: VarDeclOrExpr) -> VarDeclOrExpr {
        println!("Fold<VarDeclOrExpr>");

        let var = var.fold_children(self);

        match var {
            VarDeclOrExpr::VarDecl(var) => VarDeclOrExpr::Expr(box self.var_decl_to_expr(var)),
            _ => var,
        }
    }
}

impl Fold<Stmt> for Hoister {
    fn fold(&mut self, s: Stmt) -> Stmt {
        println!("Fold<Stmt>");
        let s: Stmt = s.fold_children(self);

        match s {
            Stmt::Decl(Decl::Var(var)) => {
                let span = var.span;
                let expr = box self.var_decl_to_expr(var);

                return Stmt::Expr(ExprStmt { span, expr });
            }

            _ => {}
        }

        s
    }
}

impl Fold<VarDecl> for Hoister {
    fn fold(&mut self, node: VarDecl) -> VarDecl {
        unreachable!("VarDecl should be removed by other methods")
    }
}

impl Fold<ModuleDecl> for Hoister {
    fn fold(&mut self, decl: ModuleDecl) -> ModuleDecl {
        let decl: ModuleDecl = decl.fold_children(self);

        match decl {
            ModuleDecl::ExportDecl(ExportDecl {
                span,
                decl: Decl::Var(var),
            }) => {
                return ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    span,
                    expr: box self.var_decl_to_expr(var),
                })
            }

            _ => {}
        }

        decl
    }
}

#[cfg(test)]
mod tests {
    use super::hoist;
    use crate::pass::Pass;
    use ast::*;
    use swc_common::Fold;
    use swc_ecma_parser::Syntax;

    fn syntax() -> Syntax {
        Default::default()
    }

    fn tr() -> impl Pass {
        struct P;
        impl Fold<Module> for P {
            fn fold(&mut self, node: Module) -> Module {
                hoist(node)
            }
        }

        P
    }

    test!(
        syntax(),
        |_| tr(),
        simple,
        "\
function wtf(){
  function foo(){
  }
  
  let bar;
  const baz = 2;
  {
      let bar = 1;
      use(bar)
  }
  
  if (foo) {
     let bar = 2;
  }
  
  for(let a in b) {
  }
  
  for(let [a, b] in b) {
  }
  
}",
        ""
    );
}
