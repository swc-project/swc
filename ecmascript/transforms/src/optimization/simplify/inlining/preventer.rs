use crate::util::{id, Id};
use fxhash::FxHashSet;
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::*;

pub(super) fn prevent<T: for<'a> VisitWith<Preventer<'a>>>(node: &T) -> FxHashSet<Id> {
    let mut dynamic = Default::default();
    let mut var_ids = Default::default();
    let mut v = Preventer {
        dynamic: &mut dynamic,
        var_ids: &mut var_ids,
    };

    node.visit_with(&mut v);

    dynamic
}

/// Finds all idents of variable
pub(super) struct Preventer<'a> {
    /// Ids where the value is not known.
    dynamic: &'a mut FxHashSet<Id>,
    var_ids: &'a mut FxHashSet<Id>,
}

impl<'a> Visit<Expr> for Preventer<'a> {
    fn visit(&mut self, e: &Expr) {
        match e {
            Expr::Invalid(_) | Expr::Lit(_) | Expr::This(_) | Expr::Ident(_) => return,
            Expr::Member(_) => {}

            _ => e.visit_children(self),
        }
    }
}

impl Visit<Vec<Stmt>> for Preventer<'_> {
    fn visit(&mut self, stmts: &Vec<Stmt>) {
        let mut var_ids = Default::default();

        for stmt in stmts {
            match stmt {
                Stmt::Decl(Decl::Var(var)) => {
                    let mut v = Preventer {
                        dynamic: self.var_ids,
                        var_ids: &mut var_ids,
                    };
                    var.visit_with(&mut v);
                }

                _ => stmt.visit_with(self),
            }
        }
    }
}

impl<'a> Visit<Ident> for Preventer<'a> {
    fn visit(&mut self, i: &Ident) {
        self.dynamic.insert(id(i));
    }
}

#[cfg(test)]
mod tests {
    use super::prevent;

    fn test(s: &str, prevented: &[&str]) {}
}
