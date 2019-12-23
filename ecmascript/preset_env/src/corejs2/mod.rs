use self::{
    builtin::BUILTINS,
    data::{BUILTIN_TYPES, INSTANCE_PROPERTIES, STATIC_PROPERTIES},
};
use crate::Versions;
use swc_atoms::{js_word, JsWord};
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::*;

mod builtin;
mod data;

pub(super) struct UsageVisitor<'a> {
    is_any_target: bool,
    target: &'a Versions,
    pub required: Vec<JsWord>,
}

impl<'a> UsageVisitor<'a> {
    pub fn new(target: &'a Versions) -> Self {
        //        let mut v = Self { required: vec![] };
        //
        //
        //        let is_web_target = target
        //            .iter()
        //            .any(|(name, version)| name != "node" &&
        // version.is_some());
        //
        //        println!(
        //            "is_any_target={:?}\nis_web_target={:?}",
        //            is_any_target, is_web_target
        //        );
        //
        //        // Web default
        //        if is_any_target || is_web_target {
        //            v.add(&["web.timers", "web.immediate",
        // "web.dom.iterable"]);        }
        //        v

        Self {
            is_any_target: target.is_any_target(),
            target,
            required: vec![],
        }
    }

    /// Add imports
    fn add(&mut self, features: &[&str]) {
        for f in features {
            if !self.is_any_target {
                if let Some(v) = BUILTINS.get(&**f) {
                    // Skip
                    if v.iter().zip(self.target.iter()).all(|((_, fv), (_, tv))| {
                        // fv: feature's version
                        // tv: target's version

                        // We are not targeting the platform. So ignore it.
                        if tv.is_none() {
                            return true;
                        }

                        // Not supported by browser (even on latest version)
                        if fv.is_none() {
                            return false;
                        }

                        *fv <= *tv
                    }) {
                        continue;
                    }
                }
            }

            let v = format!("core-js/modules/{}", f);

            if self.required.iter().all(|import| *import != *v) {
                self.required.push(v.into())
            }
        }
    }
}

// TODO:
//     Program(path: NodePath) {
//      path.get("body").forEach(bodyPath => {
//        if (isPolyfillSource(getRequireSource(bodyPath))) {
//          console.warn(NO_DIRECT_POLYFILL_IMPORT);
//          bodyPath.remove();
//        }
//      });
//    },

/// Detects usage of types
impl Visit<Ident> for UsageVisitor<'_> {
    fn visit(&mut self, node: &Ident) {
        node.visit_children(self);

        for (name, builtin) in BUILTIN_TYPES {
            if node.sym == **name {
                self.add(builtin)
            }
        }
    }
}

/// Detects usage of instance properties and static properties.
///
///  - `Array.from`
impl Visit<MemberExpr> for UsageVisitor<'_> {
    fn visit(&mut self, node: &MemberExpr) {
        node.visit_children(self);
        //enter(path: NodePath) {
        //    const { node } = path;
        //    const { object, property } = node;
        //
        //    // ignore namespace
        //    if (isNamespaced(path.get("object"))) return;
        //
        //    let evaluatedPropType = object.name;
        //    let propertyName = "";
        //    let instanceType = "";
        //
        //    if (node.computed) {
        //        if (t.isStringLiteral(property)) {
        //            propertyName = property.value;
        //        } else {
        //            const result = path.get("property").evaluate();
        //            if (result.confident && result.value) {
        //                propertyName = result.value;
        //            }
        //        }
        //    } else {
        //        propertyName = property.name;
        //    }
        //
        //    if (path.scope.getBindingIdentifier(object.name)) {
        //        const result = path.get("object").evaluate();
        //        if (result.value) {
        //            instanceType = getType(result.value);
        //        } else if (result.deopt && result.deopt.isIdentifier()) {
        //            evaluatedPropType = result.deopt.node.name;
        //        }
        //    }
        //
        //    if (has(StaticProperties, evaluatedPropType)) {
        //        const BuiltInProperties = StaticProperties[evaluatedPropType];
        //        if (has(BuiltInProperties, propertyName)) {
        //            const StaticPropertyDependencies =
        // BuiltInProperties[propertyName];
        // this.addUnsupported(StaticPropertyDependencies);        }
        //    }
        //
        //    if (has(InstanceProperties, propertyName)) {
        //        let InstancePropertyDependencies = InstanceProperties[propertyName];
        //        if (instanceType) {
        //            InstancePropertyDependencies =
        // InstancePropertyDependencies.filter(                module =>
        // module.includes(instanceType),            );
        //        }
        //        this.addUnsupported(InstancePropertyDependencies);
        //    }
        //},
        //
        //// Symbol.match
        //exit(path: NodePath) {
        //    const { name } = path.node.object;
        //
        //    if (!has(BuiltIns, name)) return;
        //    if (path.scope.getBindingIdentifier(name)) return;
        //
        //    const BuiltInDependencies = BuiltIns[name];
        //    this.addUnsupported(BuiltInDependencies);
        //},

        match *node.prop {
            Expr::Ident(ref i) if !node.computed => {
                //
                for (name, imports) in INSTANCE_PROPERTIES {
                    if i.sym == **name {
                        self.add(imports)
                    }
                }
            }
            Expr::Lit(Lit::Str(Str { ref value, .. })) if node.computed => {
                for (name, imports) in INSTANCE_PROPERTIES {
                    if *value == **name {
                        self.add(imports);
                    }
                }
            }
            _ => {}
        }

        match node.obj {
            ExprOrSuper::Expr(box Expr::Ident(ref obj)) => {
                for (ty, props) in STATIC_PROPERTIES {
                    if obj.sym == **ty {
                        match *node.prop {
                            Expr::Lit(Lit::Str(Str { ref value, .. })) if node.computed => {
                                for (name, imports) in INSTANCE_PROPERTIES {
                                    if *value == **name {
                                        self.add(imports);
                                    }
                                }
                            }

                            Expr::Ident(ref p) if !node.computed => {
                                for (prop, imports) in *props {
                                    if p.sym == **prop {
                                        self.add(imports);
                                    }
                                }
                            }

                            _ => {}
                        }
                    }
                }
            }
            _ => {}
        }
    }
}

///
/// - `arr[Symbol.iterator]()`
impl Visit<CallExpr> for UsageVisitor<'_> {
    fn visit(&mut self, e: &CallExpr) {
        e.visit_children(self);

        if !e.args.is_empty()
            && match e.callee {
                ExprOrSuper::Expr(box Expr::Member(MemberExpr {
                    computed: true,
                    ref prop,
                    ..
                })) if is_symbol_iterator(&prop) => true,
                _ => false,
            }
        {
            self.add(&["web.dom.iterable"])
        }
    }
}

///
/// - `Symbol.iterator in arr`
impl Visit<BinExpr> for UsageVisitor<'_> {
    fn visit(&mut self, e: &BinExpr) {
        e.visit_children(self);

        match e.op {
            op!("in") if is_symbol_iterator(&e.left) => self.add(&["web.dom.iterable"]),
            _ => {}
        }
    }
}

///
/// - `yield*`
impl Visit<YieldExpr> for UsageVisitor<'_> {
    fn visit(&mut self, e: &YieldExpr) {
        e.visit_children(self);
        println!("Yield");

        if e.delegate {
            self.add(&["web.dom.iterable"])
        }
    }
}

/// var { repeat, startsWith } = String
impl Visit<VarDeclarator> for UsageVisitor<'_> {
    fn visit(&mut self, v: &VarDeclarator) {
        v.visit_children(self);

        //const { node } = path;
        //const { id, init } = node;
        //
        //if (!t.isObjectPattern(id)) return;
        //
        //// doesn't reference the global
        //if (init && path.scope.getBindingIdentifier(init.name)) return;
        //
        //for (const { key } of id.properties) {
        //    if (
        //        !node.computed &&
        //            t.isIdentifier(key) &&
        //            has(InstanceProperties, key.name)
        //    ) {
        //        const InstancePropertyDependencies =
        // InstanceProperties[key.name];        this.
        // addUnsupported(InstancePropertyDependencies);    }
        //}
    }
}

fn is_symbol_iterator(e: &Expr) -> bool {
    match *e {
        Expr::Member(MemberExpr {
            obj:
                ExprOrSuper::Expr(box Expr::Ident(Ident {
                    sym: js_word!("Symbol"),
                    ..
                })),
            prop:
                box Expr::Ident(Ident {
                    sym: js_word!("iterator"),
                    ..
                }),
            computed: false,
            ..
        }) => true,
        _ => false,
    }
}
