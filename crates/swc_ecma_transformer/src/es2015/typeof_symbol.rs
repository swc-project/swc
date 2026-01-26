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
    TypeofSymbolPass::default()
}

#[derive(Default)]
struct TypeofSymbolPass {
    /// When non-zero, skip transforming typeof expressions.
    /// This is incremented when entering a binary comparison with non-symbol
    /// literals, and decremented when exiting.
    skip_depth: u32,

    /// When non-zero, we're inside a helper function and should skip
    /// transformation.
    in_helper_fn: u32,
}

impl VisitMutHook<TraverseCtx> for TypeofSymbolPass {
    fn enter_bin_expr(&mut self, expr: &mut BinExpr, _ctx: &mut TraverseCtx) {
        // Skip transformation for certain comparison patterns
        match expr.op {
            op!("==") | op!("!=") | op!("===") | op!("!==") => {}
            _ => return,
        }

        // If comparing typeof with a non-symbol literal, skip transforming children
        if let Expr::Unary(UnaryExpr {
            op: op!("typeof"), ..
        }) = *expr.left
        {
            if is_non_symbol_literal(&expr.right) {
                self.skip_depth += 1;
                return;
            }
        }
        if let Expr::Unary(UnaryExpr {
            op: op!("typeof"), ..
        }) = *expr.right
        {
            if is_non_symbol_literal(&expr.left) {
                self.skip_depth += 1;
            }
        }
    }

    fn exit_bin_expr(&mut self, expr: &mut BinExpr, _ctx: &mut TraverseCtx) {
        // Decrement skip_depth when exiting a binary expression we marked
        match expr.op {
            op!("==") | op!("!=") | op!("===") | op!("!==") => {}
            _ => return,
        }

        if let Expr::Unary(UnaryExpr {
            op: op!("typeof"), ..
        }) = *expr.left
        {
            if is_non_symbol_literal(&expr.right) {
                self.skip_depth = self.skip_depth.saturating_sub(1);
                return;
            }
        }
        if let Expr::Unary(UnaryExpr {
            op: op!("typeof"), ..
        }) = *expr.right
        {
            if is_non_symbol_literal(&expr.left) {
                self.skip_depth = self.skip_depth.saturating_sub(1);
            }
        }
    }

    fn exit_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
        // Skip transformation if we're inside a binary comparison with non-symbol
        // literals or inside a helper function
        if self.skip_depth > 0 || self.in_helper_fn > 0 {
            return;
        }

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
            self.in_helper_fn += 1;
        }
    }

    fn exit_fn_decl(&mut self, f: &mut FnDecl, _ctx: &mut TraverseCtx) {
        if &f.ident.sym == "_type_of" {
            self.in_helper_fn = self.in_helper_fn.saturating_sub(1);
        }
    }

    fn enter_function(&mut self, f: &mut Function, _ctx: &mut TraverseCtx) {
        // Skip functions with the @swc/helpers - typeof directive
        if let Some(body) = &f.body {
            if let Some(Stmt::Expr(first)) = body.stmts.first() {
                if let Expr::Lit(Lit::Str(s)) = &*first.expr {
                    if let Some(text) = s.value.as_str() {
                        if matches!(text, "@swc/helpers - typeof" | "@babel/helpers - typeof") {
                            self.in_helper_fn += 1;
                        }
                    }
                }
            }
        }
    }

    fn exit_function(&mut self, f: &mut Function, _ctx: &mut TraverseCtx) {
        // Match the enter_function logic to decrement
        if let Some(body) = &f.body {
            if let Some(Stmt::Expr(first)) = body.stmts.first() {
                if let Expr::Lit(Lit::Str(s)) = &*first.expr {
                    if let Some(text) = s.value.as_str() {
                        if matches!(text, "@swc/helpers - typeof" | "@babel/helpers - typeof") {
                            self.in_helper_fn = self.in_helper_fn.saturating_sub(1);
                        }
                    }
                }
            }
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
