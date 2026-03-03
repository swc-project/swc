//! ES2015: instanceof
//!
//! This plugin transforms the `instanceof` operator to use a helper function
//! that properly handles Symbol.hasInstance.
//!
//! > This plugin is included in `preset-env`, in ES2015
//!
//! ## Example
//!
//! Input:
//! ```js
//! foo instanceof Bar;
//! ```
//!
//! Output:
//! ```js
//! function _instanceof(left, right) {
//!   if (right != null && typeof Symbol !== "undefined" &&
//!       right[Symbol.hasInstance]) {
//!     return !!right[Symbol.hasInstance](left);
//!   } else {
//!     return left instanceof right;
//!   }
//! }
//!
//! _instanceof(foo, Bar);
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-instanceof](https://babel.dev/docs/babel-plugin-transform-instanceof).

use swc_common::{util::take::Take, Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::ExprFactory;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    InstanceOfPass::default()
}

#[derive(Default)]
struct InstanceOfPass {
    /// When non-zero, we're inside a helper function and should skip
    /// transformation.
    in_helper_fn: u32,
}

impl VisitMutHook<TraverseCtx> for InstanceOfPass {
    fn exit_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
        if self.in_helper_fn > 0 {
            return;
        }

        if let Expr::Bin(BinExpr {
            span,
            left,
            op: op!("instanceof"),
            right,
        }) = expr
        {
            let instanceof_span = Span {
                lo: left.span_hi(),
                hi: right.span_lo(),
            };

            *expr = CallExpr {
                span: *span,
                callee: helper!(instanceof_span, instanceof),
                args: vec![left.take().as_arg(), right.take().as_arg()],
                ..Default::default()
            }
            .into();
        }
    }

    fn enter_fn_decl(&mut self, f: &mut FnDecl, _ctx: &mut TraverseCtx) {
        if &f.ident.sym == "_instanceof" {
            self.in_helper_fn += 1;
        }
    }

    fn exit_fn_decl(&mut self, f: &mut FnDecl, _ctx: &mut TraverseCtx) {
        if &f.ident.sym == "_instanceof" {
            self.in_helper_fn = self.in_helper_fn.saturating_sub(1);
        }
    }

    fn enter_function(&mut self, f: &mut Function, _ctx: &mut TraverseCtx) {
        if let Some(body) = &f.body {
            if let Some(Stmt::Expr(first)) = body.stmts.first() {
                if let Expr::Lit(Lit::Str(s)) = &*first.expr {
                    if let Some(text) = s.value.as_str() {
                        if matches!(
                            text,
                            "@swc/helpers - instanceof" | "@babel/helpers - instanceof"
                        ) {
                            self.in_helper_fn += 1;
                        }
                    }
                }
            }
        }
    }

    fn exit_function(&mut self, f: &mut Function, _ctx: &mut TraverseCtx) {
        if let Some(body) = &f.body {
            if let Some(Stmt::Expr(first)) = body.stmts.first() {
                if let Expr::Lit(Lit::Str(s)) = &*first.expr {
                    if let Some(text) = s.value.as_str() {
                        if matches!(
                            text,
                            "@swc/helpers - instanceof" | "@babel/helpers - instanceof"
                        ) {
                            self.in_helper_fn = self.in_helper_fn.saturating_sub(1);
                        }
                    }
                }
            }
        }
    }
}
