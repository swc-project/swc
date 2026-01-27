//! Bugfix: Edge Default Param
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

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    EdgeDefaultParamPass { in_arrow: false }
}

struct EdgeDefaultParamPass {
    in_arrow: bool,
}

impl VisitMutHook<TraverseCtx> for EdgeDefaultParamPass {
    fn enter_arrow_expr(&mut self, _node: &mut ArrowExpr, _ctx: &mut TraverseCtx) {
        self.in_arrow = true;
    }

    fn exit_arrow_expr(&mut self, _node: &mut ArrowExpr, _ctx: &mut TraverseCtx) {
        self.in_arrow = false;
    }

    fn exit_object_pat(&mut self, n: &mut ObjectPat, _ctx: &mut TraverseCtx) {
        if !self.in_arrow {
            return;
        }

        for prop in n.props.iter_mut() {
            if let ObjectPatProp::Assign(AssignPatProp {
                value: Some(value),
                key,
                span,
                ..
            }) = prop
            {
                *prop = ObjectPatProp::KeyValue(KeyValuePatProp {
                    key: PropName::Ident(key.clone().into()),
                    value: AssignPat {
                        span: *span,
                        left: key.clone().into(),
                        right: value.clone(),
                    }
                    .into(),
                });
            }
        }
    }
}
