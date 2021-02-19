use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::PatOrExprExt;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::UsageFinder;
use swc_ecma_visit::noop_fold_type;
use swc_ecma_visit::Fold;
use swc_ecma_visit::FoldWith;

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
pub fn function_name() -> impl Fold {
    FnName
}

#[derive(Clone, Copy)]
struct FnName;

struct Renamer {
    name: Option<Ident>,
}

/// This function makes a new private identifier if required.
fn prepare(i: Ident, force: bool) -> Ident {
    if i.is_reserved_for_es3() || i.sym == *"await" || i.sym == *"eval" {
        return private_ident!(i.span, format!("_{}", i.sym));
    }

    if force {
        private_ident!(i.span, i.sym)
    } else {
        i
    }
}

impl Fold for FnName {
    noop_fold_type!();

    fn fold_assign_expr(&mut self, expr: AssignExpr) -> AssignExpr {
        let mut expr = expr.fold_children_with(self);

        if expr.op != op!("=") {
            return expr;
        }

        if let Some(ident) = expr.left.as_ident_mut() {
            let mut folder = Renamer {
                name: Some(ident.clone()),
            };

            let right = expr.right.fold_with(&mut folder);

            return AssignExpr { right, ..expr };
        }

        expr
    }

    fn fold_key_value_prop(&mut self, p: KeyValueProp) -> KeyValueProp {
        let mut p = p.fold_children_with(self);

        p.value = match *p.value {
            Expr::Fn(expr @ FnExpr { ident: None, .. }) => {
                //
                if let PropName::Ident(ref i) = p.key {
                    Box::new(Expr::Fn(FnExpr {
                        ident: Some(prepare(i.clone(), false)),
                        ..expr
                    }))
                } else {
                    Box::new(Expr::Fn(expr))
                }
            }
            _ => p.value,
        };

        p
    }

    fn fold_var_declarator(&mut self, decl: VarDeclarator) -> VarDeclarator {
        let mut decl = decl.fold_children_with(self);

        match decl.name {
            Pat::Ident(ref mut ident) => {
                let mut folder = Renamer {
                    name: Some(prepare(ident.id.clone(), false)),
                };
                let init = decl.init.fold_with(&mut folder);

                VarDeclarator { init, ..decl }
            }
            _ => decl,
        }
    }
}

macro_rules! impl_for {
    ($name:ident, $T:tt) => {
        fn $name(&mut self, node: $T) -> $T {
            match node.ident {
                Some(..) => return node,
                None => {
                    //
                    let name = match self.name.take() {
                        None => {
                            return $T {
                                ident: None,
                                ..node
                            };
                        }
                        Some(name) => name,
                    };
                    // If function's body references the name of variable, we just skip the
                    // function
                    if UsageFinder::find(&name, &node) {
                        // self.name = Some(name);
                        $T {
                            ident: None,
                            ..node
                        }
                    } else {
                        $T {
                            ident: Some(name),
                            ..node
                        }
                    }
                }
            }
        }
    };
}

macro_rules! noop {
    ($name:ident, $T:tt) => {
        /// Don't recurse.
        fn $name(&mut self, node: $T) -> $T {
            node
        }
    };
}

impl Fold for Renamer {
    noop_fold_type!();

    impl_for!(fold_fn_expr, FnExpr);
    impl_for!(fold_class_expr, ClassExpr);

    noop!(fold_object_lit, ObjectLit);
    noop!(fold_array_lit, ArrayLit);
    noop!(fold_call_expr, CallExpr);
    noop!(fold_new_expr, NewExpr);
    noop!(fold_bin_expr, BinExpr);
    noop!(fold_unary_expr, UnaryExpr);
}
