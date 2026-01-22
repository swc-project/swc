//! ES2015: Function Name
//!
//! This plugin transforms anonymous function expressions to named function
//! expressions based on the variable/property they're assigned to.
//!
//! > This plugin is included in `preset-env`, in ES2015
//!
//! ## Example
//!
//! Input:
//! ```js
//! var number = function (x) {
//!   return x;
//! };
//! var Foo = (class {});
//! ```
//!
//! Output:
//! ```js
//! var number = function number(x) {
//!   return x;
//! }
//! var Foo = (class Foo {});
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-function-name](https://babel.dev/docs/babel-plugin-transform-function-name).

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{private_ident, IdentUsageFinder};

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    FunctionNamePass
}

struct FunctionNamePass;

/// This function makes a new private identifier if required.
fn prepare(i: Ident) -> Ident {
    if i.is_reserved() || i.is_reserved_in_strict_mode(true) || i.is_reserved_in_strict_bind() {
        return private_ident!(i.span, format!("_{}", i.sym));
    }

    private_ident!(i.span, i.sym)
}

impl VisitMutHook<TraverseCtx> for FunctionNamePass {
    fn exit_assign_expr(&mut self, expr: &mut AssignExpr, _ctx: &mut TraverseCtx) {
        if expr.op != op!("=") {
            return;
        }

        if let Some(ident) = expr.left.as_ident_mut() {
            let name = Ident::from(&*ident);
            rename_fn_or_class(&mut expr.right, Some(name));
        }
    }

    fn exit_key_value_prop(&mut self, p: &mut KeyValueProp, _ctx: &mut TraverseCtx) {
        if let Expr::Fn(expr @ FnExpr { ident: None, .. }) = &mut *p.value {
            if let PropName::Ident(ref i) = p.key {
                p.value = FnExpr {
                    ident: Some(prepare(i.clone().into())),
                    ..expr.take()
                }
                .into();
            }
        }
    }

    fn exit_var_declarator(&mut self, decl: &mut VarDeclarator, _ctx: &mut TraverseCtx) {
        if let Pat::Ident(ref ident) = decl.name {
            let name = prepare(Ident::from(ident));
            if let Some(ref mut init) = decl.init {
                rename_fn_or_class(init, Some(name));
            }
        }
    }
}

fn rename_fn_or_class(expr: &mut Expr, name: Option<Ident>) {
    match expr {
        Expr::Fn(FnExpr {
            ident: ident @ None,
            function,
            ..
        }) => {
            let name = match name {
                None => return,
                Some(name) => name,
            };
            // If function's body references the name of variable, we just skip
            if IdentUsageFinder::find(&name, function.as_ref()) {
                return;
            }
            *ident = Some(private_ident!(DUMMY_SP, name.sym));
        }
        Expr::Class(ClassExpr {
            ident: ident @ None,
            class,
            ..
        }) => {
            let name = match name {
                None => return,
                Some(name) => name,
            };
            // If class body references the name of variable, we just skip
            if IdentUsageFinder::find(&name, class.as_ref()) {
                return;
            }
            *ident = Some(private_ident!(DUMMY_SP, name.sym));
        }
        _ => {}
    }
}
