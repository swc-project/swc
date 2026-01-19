//! Display name transform.
//!
//! Adds `displayName` property to React.createClass calls.
//!
//! ```js
//! var Foo = React.createClass({});
//! ```
//! becomes:
//! ```js
//! var Foo = React.createClass({ displayName: "Foo" });
//! ```

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

/// Creates a display name transform hook.
pub fn hook() -> impl VisitMutHook<()> {
    DisplayName
}

struct DisplayName;

impl VisitMutHook<()> for DisplayName {
    fn exit_var_declarator(&mut self, decl: &mut VarDeclarator, _ctx: &mut ()) {
        // var Foo = React.createClass({})
        let Pat::Ident(ident) = &decl.name else {
            return;
        };

        let Some(init) = &mut decl.init else {
            return;
        };

        let name = ident.id.sym.clone();
        self.add_display_name(init, &name);
    }

    fn exit_assign_expr(&mut self, assign: &mut AssignExpr, _ctx: &mut ()) {
        // Foo = React.createClass({})
        if assign.op != op!("=") {
            return;
        }

        let name = match &assign.left {
            AssignTarget::Simple(SimpleAssignTarget::Ident(ident)) => ident.id.sym.clone(),
            AssignTarget::Simple(SimpleAssignTarget::Member(member)) => {
                // Foo.Bar = React.createClass({})
                if let MemberProp::Ident(ident) = &member.prop {
                    ident.sym.clone()
                } else {
                    return;
                }
            }
            _ => return,
        };

        self.add_display_name(&mut assign.right, &name);
    }

    fn exit_prop(&mut self, prop: &mut Prop, _ctx: &mut ()) {
        // { Foo: React.createClass({}) }
        let Prop::KeyValue(kv) = prop else {
            return;
        };

        let name: swc_atoms::Atom = match &kv.key {
            PropName::Ident(ident) => ident.sym.clone(),
            PropName::Str(s) => s.value.to_atom_lossy().into_owned(),
            _ => return,
        };

        self.add_display_name(&mut kv.value, &name);
    }

    fn exit_module_decl(&mut self, decl: &mut ModuleDecl, _ctx: &mut ()) {
        // export default React.createClass({})
        let ModuleDecl::ExportDefaultExpr(export) = decl else {
            return;
        };

        self.add_display_name(&mut export.expr, "default");
    }
}

impl DisplayName {
    fn add_display_name(&self, expr: &mut Box<Expr>, name: &str) {
        let Expr::Call(call) = expr.as_mut() else {
            return;
        };

        // Check if it's React.createClass or createReactClass
        if !self.is_create_class_call(call) {
            return;
        }

        // Get the first argument (config object)
        let Some(ExprOrSpread { expr: arg, .. }) = call.args.first_mut() else {
            return;
        };

        let Expr::Object(obj) = arg.as_mut() else {
            return;
        };

        // Check if displayName already exists
        let has_display_name = obj.props.iter().any(|prop| {
            if let PropOrSpread::Prop(prop) = prop {
                if let Prop::KeyValue(kv) = prop.as_ref() {
                    if let PropName::Ident(ident) = &kv.key {
                        return &*ident.sym == "displayName";
                    }
                }
            }
            false
        });

        if has_display_name {
            return;
        }

        // Add displayName property at the beginning
        obj.props.insert(
            0,
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(IdentName::new("displayName".into(), DUMMY_SP)),
                value: Box::new(Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    value: name.into(),
                    raw: None,
                }))),
            }))),
        );
    }

    fn is_create_class_call(&self, call: &CallExpr) -> bool {
        match &call.callee {
            Callee::Expr(expr) => match expr.as_ref() {
                // createReactClass({})
                Expr::Ident(ident) => &*ident.sym == "createReactClass",
                // React.createClass({})
                Expr::Member(member) => {
                    if let MemberProp::Ident(prop) = &member.prop {
                        if &*prop.sym != "createClass" {
                            return false;
                        }
                    } else {
                        return false;
                    }

                    if let Expr::Ident(obj) = member.obj.as_ref() {
                        &*obj.sym == "React"
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
