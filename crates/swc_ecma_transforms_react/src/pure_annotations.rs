//! Pure annotations transform.
//!
//! Adds `/*#__PURE__*/` comments to React function calls for tree-shaking.
//!
//! This helps bundlers like webpack identify side-effect free function calls
//! that can be removed during dead code elimination.

use swc_common::{
    comments::{Comment, CommentKind, Comments},
    Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

/// Creates a pure annotations transform hook.
pub fn hook<C: Comments>(comments: Option<C>) -> impl VisitMutHook<()> {
    PureAnnotations { comments }
}

struct PureAnnotations<C> {
    comments: Option<C>,
}

impl<C: Comments> VisitMutHook<()> for PureAnnotations<C> {
    fn enter_call_expr(&mut self, call: &mut CallExpr, _ctx: &mut ()) {
        let Some(comments) = &self.comments else {
            return;
        };

        if !self.is_react_call(call) {
            return;
        }

        // Check if already has PURE comment
        let span = call.span();
        if let Some(leading) = comments.get_leading(span.lo) {
            if leading
                .iter()
                .any(|c| c.text.contains("__PURE__") || c.text.contains("@__PURE__"))
            {
                return;
            }
        }

        // Add PURE comment
        comments.add_leading(
            span.lo,
            Comment {
                kind: CommentKind::Block,
                span: DUMMY_SP,
                text: "#__PURE__".into(),
            },
        );
    }
}

impl<C> PureAnnotations<C> {
    fn is_react_call(&self, call: &CallExpr) -> bool {
        match &call.callee {
            Callee::Expr(expr) => match expr.as_ref() {
                // _jsx(), _jsxs(), jsx(), jsxs()
                Expr::Ident(ident) => {
                    let name = &*ident.sym;
                    name == "_jsx"
                        || name == "_jsxs"
                        || name == "_jsxDEV"
                        || name == "jsx"
                        || name == "jsxs"
                        || name == "jsxDEV"
                        || name == "_createElement"
                        || name == "createElement"
                        || name == "createReactClass"
                }
                // React.createElement(), React.createClass()
                Expr::Member(member) => {
                    if let MemberProp::Ident(prop) = &member.prop {
                        let method = &*prop.sym;
                        if method != "createElement" && method != "createClass" {
                            return false;
                        }

                        if let Expr::Ident(obj) = member.obj.as_ref() {
                            &*obj.sym == "React"
                        } else {
                            false
                        }
                    } else {
                        false
                    }
                }
                _ => false,
            },
            _ => false,
        }
    }
}
