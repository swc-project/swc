//! babel: `transform-member-expression-literals`
//!
//! # Input
//! ```js
//! obj["foo"] = "isValid";
//!
//! obj.const = "isKeyword";
//! obj["var"] = "isKeyword";
//! ```
//!
//! # Output
//! ```js
//! obj.foo = "isValid";
//!
//! obj["const"] = "isKeyword";
//! obj["var"] = "isKeyword";
//! ```

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::is_valid_ident;

use crate::TraverseCtx;

/// Creates a member expression literals transformation hook.
pub(crate) fn hook() -> impl VisitMutHook<TraverseCtx> {
    MemberExprLitHook
}

struct MemberExprLitHook;

impl VisitMutHook<TraverseCtx> for MemberExprLitHook {
    fn exit_member_expr(&mut self, e: &mut MemberExpr, _ctx: &mut TraverseCtx) {
        if let MemberProp::Ident(i) = &e.prop {
            if i.sym.is_reserved()
                || i.sym.is_reserved_in_strict_mode(true)
                || i.sym.is_reserved_in_es3()
                // it's not bind, so you could use eval
                || !is_valid_ident(&i.sym)
            {
                e.prop = MemberProp::Computed(ComputedPropName {
                    span: i.span,
                    expr: Lit::Str(Str {
                        span: i.span,
                        raw: None,
                        value: i.sym.clone().into(),
                    })
                    .into(),
                });
            } else {
                e.prop = MemberProp::Ident(IdentName::new(i.sym.clone(), i.span));
            }
        }
    }
}
