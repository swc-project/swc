//! React Display Name
//!
//! Adds `displayName` property to `React.createClass` calls.
//!
//! > This plugin is included in `preset-react`.
//!
//! ## Example
//!
//! Input:
//! ```js
//! // some_filename.jsx
//! var foo = React.createClass({}); // React <= 15
//! bar = createReactClass({}); // React 16+
//!
//! var obj = { prop: React.createClass({}) };
//! obj.prop2 = React.createClass({});
//! obj["prop 3"] = React.createClass({});
//! export default React.createClass({});
//! ```
//!
//! Output:
//! ```js
//! var foo = React.createClass({ displayName: "foo" });
//! bar = createReactClass({ displayName: "bar" });
//!
//! var obj = { prop: React.createClass({ displayName: "prop" }) };
//! obj.prop2 = React.createClass({ displayName: "prop2" });
//! obj["prop 3"] = React.createClass({ displayName: "prop 3" });
//! export default React.createClass({ displayName: "some_filename" });
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-react-display-name](https://babeljs.io/docs/babel-plugin-transform-react-display-name).
//!
//! Babel does not get the display name for this example:
//!
//! ```js
//! obj["prop 3"] = React.createClass({});
//! ```
//!
//! This implementation does, which is a divergence from Babel, but probably an improvement.
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/blob/v7.26.2/packages/babel-plugin-transform-react-display-name/src/index.ts>

use oxc_ast::ast::*;
use oxc_span::{Atom, SPAN};
use oxc_traverse::{Ancestor, Traverse};

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

pub struct ReactDisplayName<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> ReactDisplayName<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { ctx }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ReactDisplayName<'a, '_> {
    fn enter_call_expression(
        &mut self,
        call_expr: &mut CallExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Some(obj_expr) = Self::get_object_from_create_class(call_expr) else {
            return;
        };

        let mut ancestors = ctx.ancestors();
        let name = loop {
            let Some(ancestor) = ancestors.next() else {
                return;
            };

            match ancestor {
                // `foo = React.createClass({})`
                Ancestor::AssignmentExpressionRight(assign_expr) => match assign_expr.left() {
                    AssignmentTarget::AssignmentTargetIdentifier(ident) => {
                        break ident.name;
                    }
                    AssignmentTarget::StaticMemberExpression(expr) => {
                        break expr.property.name;
                    }
                    // Babel does not handle computed member expressions e.g. `foo["bar"]`,
                    // so we diverge from Babel here, but that's probably an improvement
                    AssignmentTarget::ComputedMemberExpression(expr) => {
                        if let Some(name) = expr.static_property_name() {
                            break name;
                        }
                        return;
                    }
                    _ => return,
                },
                // `let foo = React.createClass({})`
                Ancestor::VariableDeclaratorInit(declarator) => {
                    if let BindingPatternKind::BindingIdentifier(ident) = &declarator.id().kind {
                        break ident.name;
                    }
                    return;
                }
                // `{foo: React.createClass({})}`
                Ancestor::ObjectPropertyValue(prop) => {
                    // Babel only handles static identifiers e.g. `{foo: React.createClass({})}`,
                    // whereas we also handle e.g. `{"foo-bar": React.createClass({})}`,
                    // so we diverge from Babel here, but that's probably an improvement
                    if let Some(name) = prop.key().static_name() {
                        break ctx.ast.atom(&name);
                    }
                    return;
                }
                // `export default React.createClass({})`
                // Uses the current file name as the display name.
                Ancestor::ExportDefaultDeclarationDeclaration(_) => {
                    break ctx.ast.atom(&self.ctx.filename);
                }
                // Stop crawling up when hit a statement
                _ if ancestor.is_parent_of_statement() => return,
                _ => {}
            }
        };

        Self::add_display_name(obj_expr, name, ctx);
    }
}

impl<'a> ReactDisplayName<'a, '_> {
    /// Get the object from `React.createClass({})` or `createReactClass({})`
    fn get_object_from_create_class<'b>(
        call_expr: &'b mut CallExpression<'a>,
    ) -> Option<&'b mut ObjectExpression<'a>> {
        if match &call_expr.callee {
            callee @ match_member_expression!(Expression) => {
                !callee.to_member_expression().is_specific_member_access("React", "createClass")
            }
            Expression::Identifier(ident) => ident.name != "createReactClass",
            _ => true,
        } {
            return None;
        }
        // Only 1 argument being the object expression.
        if call_expr.arguments.len() != 1 {
            return None;
        }
        let arg = call_expr.arguments.get_mut(0)?;
        match arg {
            Argument::ObjectExpression(obj_expr) => Some(obj_expr),
            _ => None,
        }
    }

    /// Add key value `displayName: name` to the `React.createClass` object.
    fn add_display_name(
        obj_expr: &mut ObjectExpression<'a>,
        name: Atom<'a>,
        ctx: &TraverseCtx<'a>,
    ) {
        const DISPLAY_NAME: &str = "displayName";
        // Not safe with existing display name.
        let not_safe = obj_expr.properties.iter().any(|prop| {
            matches!(prop, ObjectPropertyKind::ObjectProperty(p) if p.key.static_name().is_some_and(|name| name == DISPLAY_NAME))
        });
        if not_safe {
            return;
        }
        obj_expr.properties.insert(
            0,
            ctx.ast.object_property_kind_object_property(
                SPAN,
                PropertyKind::Init,
                ctx.ast.property_key_static_identifier(SPAN, DISPLAY_NAME),
                ctx.ast.expression_string_literal(SPAN, name, None),
                false,
                false,
                false,
            ),
        );
    }
}
