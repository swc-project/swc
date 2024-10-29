use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_utils::{private_ident, IdentUsageFinder};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

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
pub fn function_name() -> impl Pass {
    visit_mut_pass(FnName)
}

#[derive(Clone, Copy)]
struct FnName;

impl Parallel for FnName {
    fn create(&self) -> Self {
        *self
    }

    fn merge(&mut self, _: Self) {}
}

struct Rename {
    name: Option<Ident>,
}

/// This function makes a new private identifier if required.
fn prepare(i: Ident) -> Ident {
    if i.is_reserved() || i.is_reserved_in_strict_mode(true) || i.is_reserved_in_strict_bind() {
        return private_ident!(i.span, format!("_{}", i.sym));
    }

    private_ident!(i.span, i.sym)
}

#[swc_trace]
impl VisitMut for FnName {
    noop_visit_mut_type!(fail);

    fn visit_mut_assign_expr(&mut self, expr: &mut AssignExpr) {
        expr.visit_mut_children_with(self);

        if expr.op != op!("=") {
            return;
        }

        if let Some(ident) = expr.left.as_ident_mut() {
            let mut folder = Rename {
                name: Some(Ident::from(&*ident)),
            };

            expr.right.visit_mut_with(&mut folder);
        }
    }

    fn visit_mut_key_value_prop(&mut self, p: &mut KeyValueProp) {
        p.visit_mut_children_with(self);

        if let Expr::Fn(expr @ FnExpr { ident: None, .. }) = &mut *p.value {
            //
            p.value = if let PropName::Ident(ref i) = p.key {
                FnExpr {
                    ident: Some(prepare(i.clone().into())),
                    ..expr.take()
                }
                .into()
            } else {
                expr.take().into()
            };
        };
    }

    fn visit_mut_var_declarator(&mut self, decl: &mut VarDeclarator) {
        decl.visit_mut_children_with(self);

        if let Pat::Ident(ref mut ident) = decl.name {
            let mut folder = Rename {
                name: Some(prepare(Ident::from(&*ident))),
            };
            decl.init.visit_mut_with(&mut folder);
        }
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
                    if IdentUsageFinder::find(&name.to_id(), &*node) {
                        // self.name = Some(name);
                        node.ident = None;
                    } else {
                        node.ident = Some(private_ident!(DUMMY_SP, name.sym));
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

impl VisitMut for Rename {
    noop_visit_mut_type!(fail);

    impl_for!(visit_mut_fn_expr, FnExpr);

    impl_for!(visit_mut_class_expr, ClassExpr);

    noop!(visit_mut_object_lit, ObjectLit);

    noop!(visit_mut_array_lit, ArrayLit);

    noop!(visit_mut_call_expr, CallExpr);

    noop!(visit_mut_new_expr, NewExpr);

    noop!(visit_mut_bin_expr, BinExpr);

    noop!(visit_mut_unary_expr, UnaryExpr);
}
