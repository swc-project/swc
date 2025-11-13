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
//! This implementation does, which is a divergence from Babel, but probably an
//! improvement.
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/blob/v7.26.2/packages/babel-plugin-transform-react-display-name/src/index.ts>

use std::ops::DerefMut;

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::{VisitMut, VisitMutWith};

use crate::context::{TransformCtx, TraverseCtx};

pub struct ReactDisplayName<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> ReactDisplayName<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { ctx }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ReactDisplayName<'_, '_> {
    // TODO: Implement transformation when SWC infrastructure is ready
    // This will transform React.createClass calls to add displayName
}

impl<'a> ReactDisplayName<'a, '_> {
    /// Main transformation entry point for the display name transform.
    ///
    /// This uses SWC's visitor pattern to traverse the AST and add displayName
    /// properties to React.createClass calls.
    pub fn transform_program(&mut self, program: &mut Program) {
        let mut visitor = DisplayNameVisitor {
            filename: &self.ctx.filename,
        };
        program.visit_mut_with(&mut visitor);
    }
}

struct DisplayNameVisitor<'a> {
    filename: &'a str,
}

impl VisitMut for DisplayNameVisitor<'_> {
    fn visit_mut_assign_expr(&mut self, expr: &mut AssignExpr) {
        expr.visit_mut_children_with(self);

        if expr.op != op!("=") {
            return;
        }

        // Handle `obj.prop = React.createClass({})`
        if let AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
            prop: MemberProp::Ident(prop),
            ..
        })) = &expr.left
        {
            return expr.right.visit_mut_with(&mut CreateClassFolder {
                name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                    span: prop.span,
                    raw: None,
                    value: prop.sym.clone(),
                })))),
            });
        }

        // Handle `obj["prop"] = React.createClass({})`
        if let AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
            prop: MemberProp::Computed(computed),
            ..
        })) = &expr.left
        {
            // Check if the computed property is a string literal
            if let Expr::Lit(Lit::Str(str_lit)) = &*computed.expr {
                return expr.right.visit_mut_with(&mut CreateClassFolder {
                    name: Some(Box::new(Expr::Lit(Lit::Str(str_lit.clone())))),
                });
            }
        }

        // Handle `foo = React.createClass({})`
        if let Some(ident) = expr.left.as_ident() {
            expr.right.visit_mut_with(&mut CreateClassFolder {
                name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                    span: ident.span,
                    raw: None,
                    value: ident.sym.clone(),
                })))),
            });
        }
    }

    fn visit_mut_module_decl(&mut self, decl: &mut ModuleDecl) {
        decl.visit_mut_children_with(self);

        // Handle `export default React.createClass({})`
        if let ModuleDecl::ExportDefaultExpr(e) = decl {
            e.visit_mut_with(&mut CreateClassFolder {
                name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    raw: None,
                    value: self.filename.into(),
                })))),
            });
        }
    }

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        prop.visit_mut_children_with(self);

        // Handle `{ prop: React.createClass({}) }`
        if let Prop::KeyValue(KeyValueProp { key, value }) = prop {
            let name = match key {
                PropName::Ident(ref i) => Box::new(Expr::Lit(Lit::Str(Str {
                    span: i.span,
                    raw: None,
                    value: i.sym.clone(),
                }))),
                PropName::Str(ref s) => Box::new(Expr::Lit(Lit::Str(s.clone()))),
                PropName::Num(ref n) => Box::new(Expr::Lit(Lit::Num(n.clone()))),
                PropName::BigInt(ref b) => Box::new(Expr::Lit(Lit::BigInt(b.clone()))),
                PropName::Computed(ref c) => c.expr.clone(),
            };

            value.visit_mut_with(&mut CreateClassFolder { name: Some(name) });
        }
    }

    fn visit_mut_var_declarator(&mut self, decl: &mut VarDeclarator) {
        // Handle `var foo = React.createClass({})`
        if let Pat::Ident(ref ident) = decl.name {
            decl.init.visit_mut_with(&mut CreateClassFolder {
                name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                    span: ident.span,
                    value: ident.sym.clone(),
                    raw: None,
                })))),
            });
        }
    }
}

/// Inner visitor that actually adds the displayName property to
/// React.createClass calls.
struct CreateClassFolder {
    name: Option<Box<Expr>>,
}

impl VisitMut for CreateClassFolder {
    /// Don't recurse into array literals.
    fn visit_mut_array_lit(&mut self, _: &mut ArrayLit) {}

    fn visit_mut_call_expr(&mut self, expr: &mut CallExpr) {
        expr.visit_mut_children_with(self);

        if is_create_class_call(expr) {
            let name = match self.name.take() {
                Some(name) => name,
                None => return,
            };
            add_display_name(expr, name);
        }
    }

    /// Don't recurse into object literals.
    fn visit_mut_object_lit(&mut self, _: &mut ObjectLit) {}
}

/// Check if a call expression is `React.createClass()` or `createReactClass()`.
fn is_create_class_call(call: &CallExpr) -> bool {
    let callee = match &call.callee {
        Callee::Super(_) | Callee::Import(_) => return false,
        Callee::Expr(callee) => &**callee,
    };

    match callee {
        // React.createClass()
        Expr::Member(MemberExpr { obj, prop, .. }) if prop.is_ident_with("createClass") => {
            if obj.is_ident_ref_to("React") {
                return true;
            }
        }
        // createReactClass()
        Expr::Ident(Ident { sym, .. }) if &**sym == "createReactClass" => return true,
        _ => {}
    }

    false
}

/// Add `displayName: name` property to the React.createClass object.
fn add_display_name(call: &mut CallExpr, name: Box<Expr>) {
    let props = match call.args.first_mut() {
        Some(ExprOrSpread { expr, .. }) => match expr.deref_mut() {
            Expr::Object(ObjectLit { props, .. }) => props,
            _ => return,
        },
        _ => return,
    };

    // Check if displayName already exists
    for prop in &*props {
        if is_key_display_name(prop) {
            return;
        }
    }

    // Insert displayName property at the beginning
    props.insert(
        0,
        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
            key: PropName::Ident(IdentName {
                span: DUMMY_SP,
                sym: "displayName".into(),
            }),
            value: name,
        }))),
    );
}

/// Check if a property is named "displayName".
fn is_key_display_name(prop: &PropOrSpread) -> bool {
    match *prop {
        PropOrSpread::Prop(ref prop) => match **prop {
            Prop::Shorthand(ref i) => i.sym == "displayName",
            Prop::Method(MethodProp { ref key, .. })
            | Prop::Getter(GetterProp { ref key, .. })
            | Prop::Setter(SetterProp { ref key, .. })
            | Prop::KeyValue(KeyValueProp { ref key, .. }) => match *key {
                PropName::Ident(ref i) => i.sym == "displayName",
                PropName::Str(ref s) => s.value == "displayName",
                PropName::Num(..) | PropName::BigInt(..) | PropName::Computed(..) => false,
            },
            Prop::Assign(..) => false,
        },
        PropOrSpread::Spread(..) => false,
    }
}
