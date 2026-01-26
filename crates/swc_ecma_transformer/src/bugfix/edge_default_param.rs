//! Bugfix: Edge Default Param
//!
//! A bugfix pass for Edge.
//!
//! Converts destructured parameters with default values to non-shorthand
//! syntax. This fixes the only arguments-related bug in ES Modules-supporting
//! browsers (Edge 16 & 17). Use this plugin instead of
//! @babel/plugin-transform-parameters when targeting ES Modules.
//!
//! ## Example
//!
//! Input:
//! ```js
//! const f = ({ a = 1 }) => a;
//! ```
//!
//! Output:
//! ```js
//! const f = ({ a: a = 1 }) => a;
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-bugfix-edge-default-param](https://babel.dev/docs/babel-plugin-bugfix-edge-default-param).

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    EdgeDefaultParamPass {
        arrow_param_depth: 0,
    }
}

struct EdgeDefaultParamPass {
    /// Depth counter for arrow params.
    /// > 0 when inside arrow params, 0 when not.
    /// We increment when entering an ArrowExpr (before visiting params)
    /// and decrement when entering BlockStmtOrExpr (the body).
    arrow_param_depth: u32,
}

impl VisitMutHook<TraverseCtx> for EdgeDefaultParamPass {
    fn enter_arrow_expr(&mut self, _node: &mut ArrowExpr, _ctx: &mut TraverseCtx) {
        // Entering arrow expression, we're now in params context
        self.arrow_param_depth += 1;
    }

    fn enter_block_stmt_or_expr(&mut self, _node: &mut BlockStmtOrExpr, _ctx: &mut TraverseCtx) {
        // Entering arrow body, we're no longer in params context
        if self.arrow_param_depth > 0 {
            self.arrow_param_depth -= 1;
        }
    }

    fn exit_object_pat(&mut self, n: &mut ObjectPat, _ctx: &mut TraverseCtx) {
        // Only transform when inside arrow params (not in body)
        if self.arrow_param_depth == 0 {
            return;
        }

        for idx in 0..n.props.len() {
            let prop = &(n.props[idx]);

            if let ObjectPatProp::Assign(AssignPatProp {
                value: Some(value),
                key,
                span,
                ..
            }) = prop
            {
                let prop = ObjectPatProp::KeyValue(KeyValuePatProp {
                    key: PropName::Ident(key.clone().into()),
                    value: AssignPat {
                        span: *span,
                        left: key.clone().into(),
                        right: value.clone(),
                    }
                    .into(),
                });

                n.props[idx] = prop;
            }
        }
    }
}
