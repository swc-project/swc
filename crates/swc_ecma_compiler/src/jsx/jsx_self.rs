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

use oxc_ast::ast::*;
use oxc_diagnostics::OxcDiagnostic;
use oxc_span::{SPAN, Span};
use oxc_traverse::{Ancestor, Traverse};

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

const SELF: &str = "__self";

pub struct JsxSelf<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> JsxSelf<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { ctx }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for JsxSelf<'a, '_> {
    fn enter_jsx_opening_element(
        &mut self,
        elem: &mut JSXOpeningElement<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.add_self_this_attribute(elem, ctx);
    }
}

impl<'a> JsxSelf<'a, '_> {
    pub fn report_error(&self, span: Span) {
        let error = OxcDiagnostic::warn("Duplicate __self prop found.").with_label(span);
        self.ctx.error(error);
    }

    fn is_inside_constructor(ctx: &TraverseCtx<'a>) -> bool {
        for scope_id in ctx.ancestor_scopes() {
            let flags = ctx.scoping().scope_flags(scope_id);
            if flags.is_block() || flags.is_arrow() {
                continue;
            }
            return flags.is_constructor();
        }
        unreachable!(); // Always hit `Program` and exit before loop ends
    }

    fn has_no_super_class(ctx: &TraverseCtx<'a>) -> bool {
        for ancestor in ctx.ancestors() {
            if let Ancestor::ClassBody(class) = ancestor {
                return class.super_class().is_none();
            }
        }
        true
    }

    pub fn get_object_property_kind_for_jsx_plugin(
        ctx: &TraverseCtx<'a>,
    ) -> ObjectPropertyKind<'a> {
        let kind = PropertyKind::Init;
        let key = ctx.ast.property_key_static_identifier(SPAN, SELF);
        let value = ctx.ast.expression_this(SPAN);
        ctx.ast.object_property_kind_object_property(SPAN, kind, key, value, false, false, false)
    }

    pub fn can_add_self_attribute(ctx: &TraverseCtx<'a>) -> bool {
        !Self::is_inside_constructor(ctx) || Self::has_no_super_class(ctx)
    }

    /// `<div __self={this} />`
    ///       ^^^^^^^^^^^^^
    fn add_self_this_attribute(&self, elem: &mut JSXOpeningElement<'a>, ctx: &TraverseCtx<'a>) {
        // Check if `__self` attribute already exists
        for item in &elem.attributes {
            if let JSXAttributeItem::Attribute(attribute) = item
                && let JSXAttributeName::Identifier(ident) = &attribute.name
                && ident.name == SELF
            {
                self.report_error(ident.span);
                return;
            }
        }

        let name = ctx.ast.jsx_attribute_name_identifier(SPAN, SELF);
        let value = {
            let jsx_expr = JSXExpression::from(ctx.ast.expression_this(SPAN));
            ctx.ast.jsx_attribute_value_expression_container(SPAN, jsx_expr)
        };
        let attribute = ctx.ast.jsx_attribute_item_attribute(SPAN, name, Some(value));
        elem.attributes.push(attribute);
    }
}
