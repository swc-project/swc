use super::data::BUILTINS;
use crate::{
    corejs::CORE_JS_COMPAT_DATA,
    corejs3::data::{COMMON_ITERATORS, PROMISE_DEPENDENCIES},
    util::DataMapExt,
    version::should_enable,
    Versions,
};
use swc_atoms::{js_word, JsWord};
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::*;

pub(crate) struct UsageVisitor {
    is_any_target: bool,
    target: Versions,
    pub required: Vec<JsWord>,
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

        Self {
            is_any_target: target.is_any_target(),
            target,
            required: vec![],
        }
    }

    /// Add imports
    fn add(&mut self, features: &[&str]) {
        for f in features {
            let feature = CORE_JS_COMPAT_DATA.get(&**f);

            if let Some(feature) = feature {
                if !should_enable(self.target, *feature, true) {
                    continue;
                }
            }

            if !self.is_any_target {}

            let v = format!("core-js/modules/{}", f);

            if self.required.iter().all(|import| *import != *v) {
                self.required.push(v.into())
            }
        }
    }

    fn add_builtin(&mut self, built_in: &str) {
        if let Some(features) = BUILTINS.get_data(built_in) {
            self.add(features)
        }
    }

    fn add_property_deps(&mut self, obj: &Expr, prop: &Expr) {
        //        const { builtIn, instanceType, isNamespaced } = source;
        //        if (isNamespaced) return;
        //        if (PossibleGlobalObjects.has(builtIn)) {
        //            this.addBuiltInDependencies(key);
        //        } else if (has(StaticProperties, builtIn)) {
        //            const BuiltInProperties = StaticProperties[builtIn];
        //            if (has(BuiltInProperties, key)) {
        //                const StaticPropertyDependencies =
        // BuiltInProperties[key];                return
        // this.addUnsupported(StaticPropertyDependencies);            }
        //        }
        //        if (!has(InstanceProperties, key)) return;
        //        let InstancePropertyDependencies = InstanceProperties[key];
        //        if (instanceType) {
        //            InstancePropertyDependencies =
        // InstancePropertyDependencies.filter(                m =>
        // m.includes(instanceType) || CommonInstanceDependencies.has(m),
        //            );
        //        }
        //        this.addUnsupported(InstancePropertyDependencies);
    }
}

/// import('something').then(...)
impl Visit<CallExpr> for UsageVisitor {
    fn visit(&mut self, e: &CallExpr) {
        e.visit_children(self);

        match e.callee {
            ExprOrSuper::Expr(box Expr::Ident(Ident {
                sym: js_word!("import"),
                ..
            })) => self.add(PROMISE_DEPENDENCIES),

            _ => {}
        }
    }
}

impl Visit<Function> for UsageVisitor {
    fn visit(&mut self, f: &Function) {
        f.visit_children(self);

        if f.is_async {
            self.add(PROMISE_DEPENDENCIES)
        }
    }
}

/// for-of
impl Visit<ForOfStmt> for UsageVisitor {
    fn visit(&mut self, s: &ForOfStmt) {
        s.visit_children(self);

        self.add(COMMON_ITERATORS)
    }
}

/// `[a, b] = c`
impl Visit<ArrayPat> for UsageVisitor {
    fn visit(&mut self, p: &ArrayPat) {
        p.visit_children(self);

        self.add(COMMON_ITERATORS)
    }
}

/// `[...spread]`
impl Visit<ExprOrSpread> for UsageVisitor {
    fn visit(&mut self, e: &ExprOrSpread) {
        e.visit_children(self);
        if e.spread.is_some() {
            self.add(COMMON_ITERATORS)
        }
    }
}

/// `yield*`
impl Visit<YieldExpr> for UsageVisitor {
    fn visit(&mut self, e: &YieldExpr) {
        e.visit_children(self);

        if e.delegate {
            self.add(COMMON_ITERATORS)
        }
    }
}

impl Visit<Expr> for UsageVisitor {
    fn visit(&mut self, e: &Expr) {
        e.visit_children(self);

        match e {
            Expr::Ident(i) => self.add_builtin(&i.sym),
            _ => {}
        }
    }
}

impl Visit<MemberExpr> for UsageVisitor {
    fn visit(&mut self, e: &MemberExpr) {
        e.visit_children(self);

        //const source = resolveSource(path.get("object"));
        //const key = resolveKey(path.get("property"));

        // Object.entries
        // [1, 2, 3].entries

        match e.obj {
            ExprOrSuper::Expr(ref obj) => self.add_property_deps(&obj, &e.prop),
            _ => {}
        }
    }
}

impl Visit<ObjectPat> for UsageVisitor {
    fn visit(&mut self, p: &ObjectPat) {
        p.visit_children(self);
    }
}

//ObjectPattern(path: NodePath) {
//const { parentPath, parent, key } = path;
//let source;
//
//// const { keys, values } = Object
//if (parentPath.isVariableDeclarator()) {
//source = resolveSource(parentPath.get("init"));
//// ({ keys, values } = Object)
//} else if (parentPath.isAssignmentExpression()) {
//source = resolveSource(parentPath.get("right"));
//// !function ({ keys, values }) {...} (Object)
//// resolution does not work after properties transform :-(
//} else if (parentPath.isFunctionExpression()) {
//const grand = parentPath.parentPath;
//if (grand.isCallExpression() || grand.isNewExpression()) {
//if (grand.node.callee === parent) {
//source = resolveSource(grand.get("arguments")[key]);
//}
//
//for (const property of path.get("properties")) {
//if (property.isObjectProperty()) {
//const key = resolveKey(property.get("key"));
//// const { keys, values } = Object
//// const { keys, values } = [1, 2, 3]
//this.addPropertyDependencies(source, key);
//},
//

impl Visit<BinExpr> for UsageVisitor {
    fn visit(&mut self, e: &BinExpr) {
        e.visit_children(self);

        match e.op {
            op!("in") => {

                //const source = resolveSource(path.get("right"));
                //const key = resolveKey(path.get("left"), true);
                //
                //// 'entries' in Object
                //// 'entries' in [1, 2, 3]
                //this.addPropertyDependencies(source, key);
                //},
                //};
            }
            _ => {}
        }
    }
}
