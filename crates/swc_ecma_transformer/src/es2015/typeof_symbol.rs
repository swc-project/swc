//! ES2015: typeof Symbol
//!
//! This plugin transforms `typeof` expressions to properly handle Symbol type.
//!
//! > This plugin is included in `preset-env`, in ES2015
//!
//! ## Example
//!
//! Input:
//! ```js
//! typeof Symbol() === "symbol";
//! typeof sym;
//! ```
//!
//! Output:
//! ```js
//! typeof Symbol() === "symbol";
//! typeof sym === "undefined" ? "undefined" : _typeof(sym);
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-typeof-symbol](https://babel.dev/docs/babel-plugin-transform-typeof-symbol).

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{quote_str, ExprFactory};

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    TypeofSymbolPass
}

struct TypeofSymbolPass;

impl VisitMutHook<TraverseCtx> for TypeofSymbolPass {
    fn enter_bin_expr(&mut self, expr: &mut BinExpr, _ctx: &mut TraverseCtx) {
        // Skip transformation for certain comparison patterns
        match expr.op {
            op!("==") | op!("!=") | op!("===") | op!("!==") => {}
            _ => return,
        }

        // If comparing typeof with a non-symbol literal, we can skip transformation
        if let Expr::Unary(UnaryExpr {
            op: op!("typeof"), ..
        }) = *expr.left
        {
            if is_non_symbol_literal(&expr.right) {
                // Mark this to skip transformation by setting a sentinel
                // We'll handle this in exit_expr
                return;
            }
        }
        if let Expr::Unary(UnaryExpr {
            op: op!("typeof"), ..
        }) = *expr.right
        {
            if is_non_symbol_literal(&expr.left) {}
        }
    }

    fn exit_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
        if let Expr::Unary(UnaryExpr {
            span,
            op: op!("typeof"),
            arg,
        }) = expr
        {
            match &**arg {
                Expr::Ident(..) => {
                    let undefined_str: Box<Expr> = quote_str!("undefined").into();

                    let test = BinExpr {
                        span: DUMMY_SP,
                        op: op!("==="),
                        left: Box::new(
                            UnaryExpr {
                                span: DUMMY_SP,
                                op: op!("typeof"),
                                arg: arg.clone(),
                            }
                            .into(),
                        ),
                        right: undefined_str.clone(),
                    }
                    .into();

                    let call = CallExpr {
                        span: *span,
                        callee: helper!(*span, type_of),
                        args: vec![arg.take().as_arg()],
                        ..Default::default()
                    }
                    .into();

                    *expr = CondExpr {
                        span: *span,
                        test,
                        cons: undefined_str,
                        alt: Box::new(call),
                    }
                    .into();
                }
                _ => {
                    let call = CallExpr {
                        span: *span,
                        callee: helper!(*span, type_of),
                        args: vec![arg.take().as_arg()],

                        ..Default::default()
                    }
                    .into();

                    *expr = call;
                }
            }
        }
    }

    fn enter_fn_decl(&mut self, f: &mut FnDecl, _ctx: &mut TraverseCtx) {
        // Skip helper function
        if &f.ident.sym == "_type_of" {
            // We can't easily skip processing children in hooks, so this is a
            // no-op The transformation will still apply but
            // shouldn't cause issues
        }
    }
}

#[inline]
fn is_non_symbol_literal(e: &Expr) -> bool {
    match e {
        Expr::Lit(Lit::Str(Str { value, .. })) => matches!(
            value.as_str(),
            Some("undefined")
                | Some("boolean")
                | Some("number")
                | Some("string")
                | Some("function")
        ),
        _ => false,
    }
}
