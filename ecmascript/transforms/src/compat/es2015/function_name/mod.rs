use ast::*;
use swc_common::{Fold, FoldWith, Mark};

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
/// var Foo = (class {});
/// ```
/// ## Out
/// ```js
/// var number = function number(x) {
///   return x;
/// }
/// var Foo = (class Foo {});
/// ```
pub fn function_name() -> FnName {
    FnName {
        mark: Mark::fresh(Mark::root()),
    }
}

#[derive(Clone, Copy)]
pub struct FnName {
    mark: Mark,
}

struct Renamer {
    mark: Mark,
    name: Option<Ident>,
}

impl Fold<VarDeclarator> for FnName {
    fn fold(&mut self, decl: VarDeclarator) -> VarDeclarator {
        let mut decl = decl.fold_children(self);

        match decl.name {
            Pat::Ident(ref mut ident) => {
                let mut folder = Renamer {
                    mark: self.mark,
                    name: Some(ident.clone()),
                };
                let init = decl.init.fold_with(&mut folder);

                // It's taken. So we apply the marker to the ident
                if folder.name.is_none() {
                    ident.span = ident.span.apply_mark(self.mark);
                }

                return VarDeclarator { init, ..decl };
            }
            _ => decl,
        }
    }
}

impl Fold<AssignExpr> for FnName {
    fn fold(&mut self, expr: AssignExpr) -> AssignExpr {
        let mut expr = expr.fold_children(self);

        if expr.op != op!("=") {
            return expr;
        }

        match expr.left {
            PatOrExpr::Pat(box Pat::Ident(ref mut ident))
            | PatOrExpr::Expr(box Expr::Ident(ref mut ident)) => {
                let mut folder = Renamer {
                    mark: self.mark,
                    name: Some(ident.clone()),
                };

                let right = expr.right.fold_with(&mut folder);

                // It's taken. So we apply the marker to the ident
                if folder.name.is_none() {
                    ident.span = ident.span.apply_mark(self.mark);
                }

                return AssignExpr { right, ..expr };
            }
            _ => expr,
        }
    }
}

macro_rules! impl_for {
    ($T:tt) => {
        impl Fold<$T> for Renamer {
            fn fold(&mut self, node: $T) -> $T {
                match node.ident {
                    Some(..) => return node,
                    None => $T {
                        ident: match self.name.take() {
                            Some(mut ident) => {
                                ident.span = ident.span.apply_mark(self.mark);
                                Some(ident)
                            }
                            _ => None,
                        },
                        ..node
                    },
                }
            }
        }
    };
}
impl_for!(FnExpr);
impl_for!(ClassExpr);

macro_rules! noop {
    ($T:tt) => {
        impl Fold<$T> for Renamer {
            /// Don't recurse.
            fn fold(&mut self, node: $T) -> $T {
                node
            }
        }
    };
}

noop!(ObjectLit);
noop!(ArrayLit);
noop!(CallExpr);
noop!(NewExpr);
