//! ES2015: Sticky Regex
//!
//! This plugin transforms sticky regex literals to RegExp constructor calls.
//!
//! > This plugin is included in `preset-env`, in ES2015
//!
//! ## Example
//!
//! Input:
//! ```js
//! /o+/y;
//! ```
//!
//! Output:
//! ```js
//! new RegExp("o+", "y")
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-sticky-regex](https://babel.dev/docs/babel-plugin-transform-sticky-regex).

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{quote_ident, ExprFactory};

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    StickyRegexPass
}

struct StickyRegexPass;

impl VisitMutHook<TraverseCtx> for StickyRegexPass {
    fn exit_expr(&mut self, e: &mut Expr, _ctx: &mut TraverseCtx) {
        if let Expr::Lit(Lit::Regex(Regex { exp, flags, span })) = e {
            if flags.contains('y') {
                *e = NewExpr {
                    span: *span,
                    callee: Box::new(quote_ident!(Default::default(), *span, "RegExp").into()),
                    args: Some(vec![exp.clone().as_arg(), flags.clone().as_arg()]),
                    ..Default::default()
                }
                .into()
            }
        }
    }
}
