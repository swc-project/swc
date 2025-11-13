//! React JSX Self
//!
//! This plugin adds `__self` attribute to JSX elements.
//!
//! > This plugin is included in `preset-react`.
//!
//! ## Example
//!
//! Input:
//! ```js
//! <div>foo</div>;
//! <Bar>foo</Bar>;
//! <>foo</>;
//! ```
//!
//! Output:
//! ```js
//! <div __self={this}>foo</div>;
//! <Bar __self={this}>foo</Bar>;
//! <>foo</>;
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-react-jsx-self](https://babeljs.io/docs/babel-plugin-transform-react-jsx-self).
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/blob/v7.26.2/packages/babel-plugin-transform-react-jsx-self/src/index.ts>

use swc_common::{
    errors::{Diagnostic, Level},
    DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

const SELF: &str = "__self";

pub struct JsxSelf<'a> {
    ctx: &'a TransformCtx,
}

impl<'a> JsxSelf<'a> {
    pub fn new(ctx: &'a TransformCtx) -> Self {
        Self { ctx }
    }
}

impl<'a> VisitMutHook<TraverseCtx<'a>> for JsxSelf<'a> {
    fn enter_jsx_opening_element(
        &mut self,
        elem: &mut JSXOpeningElement,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.add_self_this_attribute(elem, ctx);
    }
}

impl<'a> JsxSelf<'a> {
    pub fn report_error(&self, span: swc_common::Span) {
        let mut diagnostic = Diagnostic::new(Level::Error, "Duplicate __self prop found.");
        diagnostic.span_label(span, "duplicate __self");
        self.ctx.error(diagnostic);
    }

    fn is_inside_constructor(_ctx: &TraverseCtx<'a>) -> bool {
        // In SWC, we need to traverse up the scope chain to check if we're in a
        // constructor. Since TraverseCtx is just TransformState, and we don't
        // have ancestor tracking, we'll implement a conservative approach for
        // now. This should be enhanced when proper scope tracking is available.
        false
    }

    fn has_no_super_class(_ctx: &TraverseCtx<'a>) -> bool {
        // In SWC, checking for super class requires ancestor information.
        // This should be enhanced when proper ancestor tracking is available.
        // For now, return true as a conservative default.
        true
    }

    pub fn get_object_property_kind_for_jsx_plugin(_ctx: &TraverseCtx<'a>) -> PropOrSpread {
        // Create property: `__self: this`
        let key = PropName::Ident(IdentName {
            span: DUMMY_SP,
            sym: SELF.into(),
        });

        let value = Box::new(Expr::This(ThisExpr { span: DUMMY_SP }));

        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp { key, value })))
    }

    pub fn can_add_self_attribute(ctx: &TraverseCtx<'a>) -> bool {
        !Self::is_inside_constructor(ctx) || Self::has_no_super_class(ctx)
    }

    /// `<div __self={this} />`
    ///       ^^^^^^^^^^^^^
    fn add_self_this_attribute(&self, elem: &mut JSXOpeningElement, _ctx: &TraverseCtx<'a>) {
        // Check if `__self` attribute already exists
        for item in &elem.attrs {
            if let JSXAttrOrSpread::JSXAttr(attribute) = item {
                if let JSXAttrName::Ident(ident) = &attribute.name {
                    if &*ident.sym == SELF {
                        self.report_error(ident.span);
                        return;
                    }
                }
            }
        }

        // Create the __self attribute with `this` as value
        let name = JSXAttrName::Ident(IdentName {
            span: DUMMY_SP,
            sym: SELF.into(),
        });

        let value = Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
            span: DUMMY_SP,
            expr: JSXExpr::Expr(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
        }));

        let attribute = JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name,
            value,
        });

        elem.attrs.push(attribute);
    }
}
