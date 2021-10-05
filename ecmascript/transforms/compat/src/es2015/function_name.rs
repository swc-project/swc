use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::PatOrExprExt;
use swc_ecma_utils::{private_ident, UsageFinder};
use swc_ecma_visit::{noop_fold_type, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitMutWith};

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
fn prepare(i: Ident) -> Ident {
    if i.is_reserved() || i.is_reserved_in_strict_mode(true) || i.is_reserved_in_strict_bind() {
        return private_ident!(i.span, format!("_{}", i.sym));
    }

    i
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

            expr.right.visit_mut_with(&mut folder);

            return expr;
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
                        ident: Some(prepare(i.clone())),
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
                    name: Some(prepare(ident.id.clone())),
                };
                decl.init.visit_mut_with(&mut folder);
            }
            _ => {}
        }

        decl
    }
}

macro_rules! impl_for {
    ($name:ident, $T:tt) => {
        fn $name(&mut self, node: &mut $T) {
            match node.ident {
                Some(..) => return,
                None => {
                    //
                    let name = match self.name.take() {
                        None => {
                            node.ident = None;
                            return;
                        }
                        Some(name) => name,
                    };
                    // If function's body references the name of variable, we just skip the
                    // function
                    if UsageFinder::find(&name, &*node) {
                        // self.name = Some(name);
                        node.ident = None;
                    } else {
                        node.ident = Some(name);
                    }
                }
            }
        }
    };
}

macro_rules! noop {
    ($name:ident, $T:tt) => {
        /// Don't recurse.
        fn $name(&mut self, _: &mut $T) {}
    };
}

impl VisitMut for Renamer {
    noop_visit_mut_type!();

    impl_for!(visit_mut_fn_expr, FnExpr);
    impl_for!(visit_mut_class_expr, ClassExpr);

    noop!(visit_mut_object_lit, ObjectLit);
    noop!(visit_mut_array_lit, ArrayLit);
    noop!(visit_mut_call_expr, CallExpr);
    noop!(visit_mut_new_expr, NewExpr);
    noop!(visit_mut_bin_expr, BinExpr);
    noop!(visit_mut_unary_expr, UnaryExpr);
}
