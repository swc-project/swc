use ast::*;
use swc_common::{Fold, FoldWith};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-function-name`
///
/// # Example
/// ## In
/// ```js
/// var number = function (x) {
///   return x;
/// };
/// ```
/// ## Out
/// ```js
/// var number = function number(x) {
///   return x;
/// }
/// ```
pub fn function_name() -> FnName {
    FnName
}

pub struct FnName;

struct Renamer {
    name: Option<Ident>,
}

impl Fold<VarDeclarator> for FnName {
    fn fold(&mut self, decl: VarDeclarator) -> VarDeclarator {
        match decl.name {
            Pat::Ident(ref ident) => {
                let init = decl.init.fold_with(&mut Renamer {
                    name: Some(ident.clone()),
                });

                return VarDeclarator { init, ..decl };
            }
            _ => decl,
        }
    }
}

impl Fold<AssignExpr> for FnName {
    fn fold(&mut self, expr: AssignExpr) -> AssignExpr {
        let expr = expr.fold_children(self);

        if expr.op != op!("=") {
            return expr;
        }

        match expr.left {
            PatOrExpr::Pat(box Pat::Ident(ref ident))
            | PatOrExpr::Expr(box Expr::Ident(ref ident)) => {
                let right = expr.right.fold_with(&mut Renamer {
                    name: Some(ident.clone()),
                });

                return AssignExpr { right, ..expr };
            }
            _ => expr,
        }
    }
}

impl Fold<FnExpr> for Renamer {
    fn fold(&mut self, expr: FnExpr) -> FnExpr {
        match expr.ident {
            Some(..) => return expr,
            None => FnExpr {
                ident: self.name.take(),
                ..expr
            },
        }
    }
}

impl Fold<ObjectLit> for Renamer {
    /// Don't recurse.
    fn fold(&mut self, node: ObjectLit) -> ObjectLit {
        node
    }
}
impl Fold<ArrayLit> for Renamer {
    /// Don't recurse.
    fn fold(&mut self, node: ArrayLit) -> ArrayLit {
        node
    }
}
