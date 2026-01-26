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
    InstanceOfPass
}

struct InstanceOfPass;

impl VisitMutHook<TraverseCtx> for InstanceOfPass {
    fn exit_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
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
}
