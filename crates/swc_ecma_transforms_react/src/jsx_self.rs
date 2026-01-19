//! JSX `__self` attribute transform.
//!
//! Adds `__self={this}` attribute to JSX elements in development mode.
//! This helps React provide better error messages.

use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

/// Creates a JSX self transform hook.
pub fn hook(dev: bool) -> impl VisitMutHook<()> {
    JsxSelf {
        enabled: dev,
        ctx_stack: vec![],
    }
}

struct JsxSelf {
    enabled: bool,
    /// Stack of contexts. `true` means we're in a valid context for `this`.
    ctx_stack: Vec<bool>,
}

impl VisitMutHook<()> for JsxSelf {
    fn enter_function(&mut self, _f: &mut Function, _ctx: &mut ()) {
        // Regular functions have their own `this`
        self.ctx_stack.push(true);
    }

    fn exit_function(&mut self, _f: &mut Function, _ctx: &mut ()) {
        self.ctx_stack.pop();
    }

    fn enter_arrow_expr(&mut self, _arrow: &mut ArrowExpr, _ctx: &mut ()) {
        // Arrow functions inherit `this` from parent
        let parent_has_this = self.ctx_stack.last().copied().unwrap_or(false);
        self.ctx_stack.push(parent_has_this);
    }

    fn exit_arrow_expr(&mut self, _arrow: &mut ArrowExpr, _ctx: &mut ()) {
        self.ctx_stack.pop();
    }

    fn enter_class(&mut self, _class: &mut Class, _ctx: &mut ()) {
        // Class body has `this`
        self.ctx_stack.push(true);
    }

    fn exit_class(&mut self, _class: &mut Class, _ctx: &mut ()) {
        self.ctx_stack.pop();
    }

    fn enter_constructor(&mut self, _ctor: &mut Constructor, _ctx: &mut ()) {
        self.ctx_stack.push(true);
    }

    fn exit_constructor(&mut self, _ctor: &mut Constructor, _ctx: &mut ()) {
        self.ctx_stack.pop();
    }

    fn enter_jsx_opening_element(&mut self, el: &mut JSXOpeningElement, _ctx: &mut ()) {
        if !self.enabled {
            return;
        }

        // Check if we're in a valid context for `this`
        let has_this_context = self.ctx_stack.last().copied().unwrap_or(false);
        if !has_this_context {
            return;
        }

        // Check if __self already exists
        let has_self = el.attrs.iter().any(|attr| {
            if let JSXAttrOrSpread::JSXAttr(attr) = attr {
                if let JSXAttrName::Ident(ident) = &attr.name {
                    return &*ident.sym == "__self";
                }
            }
            false
        });

        if has_self {
            return;
        }

        // Add __self={this}
        el.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: JSXAttrName::Ident(IdentName::new("__self".into(), DUMMY_SP)),
            value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span: DUMMY_SP,
                expr: JSXExpr::Expr(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
            })),
        }));
    }
}
