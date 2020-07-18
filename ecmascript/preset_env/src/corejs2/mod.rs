pub(crate) use self::entry::Entry;
use self::{
    builtin::BUILTINS,
    data::{BUILTIN_TYPES, INSTANCE_PROPERTIES, STATIC_PROPERTIES},
};
use crate::{util::DataMapExt, version::should_enable, Versions};
use fxhash::FxHashSet;
use swc_atoms::{js_word, JsWord};
use swc_common::{Visit, VisitWith, DUMMY_SP};
use swc_ecma_ast::*;

mod builtin;
mod data;
mod entry;

pub(crate) struct UsageVisitor {
    is_any_target: bool,
    target: Versions,
    pub required: FxHashSet<&'static str>,
}

impl UsageVisitor {
    pub fn new(target: Versions) -> Self {
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

        let v = Self {
            is_any_target: target.is_any_target(),
            target,
            required: Default::default(),
        };
        //if target.is_any_target() || target.node.is_none() {
        //    v.add(&["web.timers", "web.immediate", "web.dom.iterable"]);
        //}

        v
    }

    /// Add imports
    fn add(&mut self, features: &'static [&'static str]) {
        let UsageVisitor {
            is_any_target,
            target,
            ..
        } = self;

        self.required.extend(features.iter().filter_map(|f| {
            if !*is_any_target {
                if let Some(v) = BUILTINS.get(&**f) {
                    // Skip
                    if !should_enable(*target, *v, true) {
                        return None;
                    }
                }
            }

            Some(f)
        }));
    }

    fn add_property_deps_inner(&mut self, obj: Option<&JsWord>, prop: &JsWord) {
        if let Some(obj) = obj {
            if let Some(map) = STATIC_PROPERTIES.get_data(&obj) {
                if let Some(features) = map.get_data(&prop) {
                    self.add(features);
                }
            }
        }

        if let Some(features) = INSTANCE_PROPERTIES.get_data(&prop) {
            self.add(features);
        }
    }

    fn visit_object_pat_props(&mut self, obj: &Expr, props: &[ObjectPatProp]) {
        let obj = match obj {
            Expr::Ident(i) => Some(&i.sym),
            _ => None,
        };

        for p in props {
            match p {
                ObjectPatProp::KeyValue(KeyValuePatProp {
                    key: PropName::Ident(i),
                    ..
                }) => self.add_property_deps_inner(obj, &i.sym),
                ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                    self.add_property_deps_inner(obj, &key.sym)
                }

                _ => {}
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
impl Visit<Ident> for UsageVisitor {
    fn visit(&mut self, node: &Ident) {
        node.visit_children_with(self);

        for (name, builtin) in BUILTIN_TYPES {
            if node.sym == **name {
                self.add(builtin)
            }
        }
    }
}

impl Visit<VarDeclarator> for UsageVisitor {
    fn visit(&mut self, d: &VarDeclarator) {
        d.visit_children_with(self);

        if let Some(ref init) = d.init {
            match d.name {
                // const { keys, values } = Object
                Pat::Object(ref o) => self.visit_object_pat_props(&init, &o.props),
                _ => {}
            }
        } else {
            match d.name {
                // const { keys, values } = Object
                Pat::Object(ref o) => self.visit_object_pat_props(
                    &Expr::Ident(Ident::new(js_word!(""), DUMMY_SP)),
                    &o.props,
                ),
                _ => {}
            }
        }
    }
}

impl Visit<AssignExpr> for UsageVisitor {
    fn visit(&mut self, e: &AssignExpr) {
        e.visit_children_with(self);

        match e.left {
            // ({ keys, values } = Object)
            PatOrExpr::Pat(box Pat::Object(ref o)) => {
                self.visit_object_pat_props(&e.right, &o.props)
            }
            _ => {}
        }
    }
}

/// Detects usage of instance properties and static properties.
///
///  - `Array.from`
impl Visit<MemberExpr> for UsageVisitor {
    fn visit(&mut self, node: &MemberExpr) {
        node.obj.visit_with(self);
        if node.computed {
            node.prop.visit_with(self);
        }
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
        //    if (has(STATIC_PROPERTIES, evaluatedPropType)) {
        //        const BuiltInProperties = STATIC_PROPERTIES[evaluatedPropType];
        //        if (has(BuiltInProperties, propertyName)) {
        //            const StaticPropertyDependencies =
        // BuiltInProperties[propertyName];
        // this.addUnsupported(StaticPropertyDependencies);        }
        //    }
        //
        //    if (has(INSTANCE_PROPERTIES, propertyName)) {
        //        let InstancePropertyDependencies = INSTANCE_PROPERTIES[propertyName];
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
        //    if (!has(BUILT_INS, name)) return;
        //    if (path.scope.getBindingIdentifier(name)) return;
        //
        //    const BuiltInDependencies = BUILT_INS[name];
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
impl Visit<CallExpr> for UsageVisitor {
    fn visit(&mut self, e: &CallExpr) {
        e.visit_children_with(self);

        if match e.callee {
            ExprOrSuper::Expr(box Expr::Member(MemberExpr {
                computed: true,
                ref prop,
                ..
            })) if is_symbol_iterator(&prop) => true,
            _ => false,
        } {
            self.add(&["web.dom.iterable"])
        }
    }
}

///
/// - `Symbol.iterator in arr`
impl Visit<BinExpr> for UsageVisitor {
    fn visit(&mut self, e: &BinExpr) {
        e.visit_children_with(self);

        match e.op {
            op!("in") if is_symbol_iterator(&e.left) => self.add(&["web.dom.iterable"]),
            _ => {}
        }
    }
}

///
/// - `yield*`
impl Visit<YieldExpr> for UsageVisitor {
    fn visit(&mut self, e: &YieldExpr) {
        e.visit_children_with(self);
        println!("Yield");

        if e.delegate {
            self.add(&["web.dom.iterable"])
        }
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
