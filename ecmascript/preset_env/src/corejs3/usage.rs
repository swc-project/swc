use super::data::BUILTINS;
use crate::{
    corejs3::{
        compat::DATA as CORE_JS_COMPAT_DATA,
        data::{
            COMMON_ITERATORS, INSTANCE_PROPERTIES, POSSIBLE_GLOBAL_OBJECTS, PROMISE_DEPENDENCIES,
            STATIC_PROPERTIES,
        },
    },
    util::DataMapExt,
    version::should_enable,
    Versions,
};
use fxhash::FxHashSet;
use swc_atoms::{js_word, JsWord};
use swc_common::{Visit, VisitWith, DUMMY_SP};
use swc_ecma_ast::*;

pub(crate) struct UsageVisitor {
    shipped_proposals: bool,
    is_any_target: bool,
    target: Versions,
    pub required: FxHashSet<&'static str>,
}

impl UsageVisitor {
    pub fn new(target: Versions, shipped_proposals: bool) -> Self {
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
            shipped_proposals,
            is_any_target: target.is_any_target(),
            target,
            required: Default::default(),
        }
    }

    /// Add imports
    fn add(&mut self, features: &[&'static str]) {
        let UsageVisitor {
            shipped_proposals,
            is_any_target,
            target,
            ..
        } = self;

        self.required.extend(features.iter().filter_map(|f| {
            if !*shipped_proposals && f.starts_with("esnext.") {
                return None;
            }

            let feature = CORE_JS_COMPAT_DATA.get(&**f);

            if !*is_any_target {
                if let Some(feature) = feature {
                    if !should_enable(*target, *feature, true) {
                        return None;
                    }
                }
            }

            Some(f)
        }));
    }

    fn add_builtin(&mut self, built_in: &str) {
        if let Some(features) = BUILTINS.get_data(built_in) {
            self.add(features)
        }
    }
    fn add_property_deps(&mut self, obj: &Expr, prop: &Expr) {
        let prop = match prop {
            Expr::Ident(i) => &i.sym,
            Expr::Lit(Lit::Str(s)) => &s.value,
            _ => return,
        };

        let obj = match obj {
            Expr::Ident(i) => &i.sym,
            _ => {
                self.add_property_deps_inner(None, prop);
                return;
            }
        };

        self.add_property_deps_inner(Some(obj), prop)
    }

    fn add_property_deps_inner(&mut self, obj: Option<&JsWord>, prop: &JsWord) {
        if let Some(obj) = obj {
            if POSSIBLE_GLOBAL_OBJECTS.contains(&&**obj) {
                self.add_builtin(prop);
            }

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

/// import('something').then(...)
impl Visit<CallExpr> for UsageVisitor {
    fn visit(&mut self, e: &CallExpr) {
        e.visit_children_with(self);

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
        f.visit_children_with(self);

        if f.is_async {
            self.add(PROMISE_DEPENDENCIES)
        }
    }
}

/// for-of
impl Visit<ForOfStmt> for UsageVisitor {
    fn visit(&mut self, s: &ForOfStmt) {
        s.visit_children_with(self);

        self.add(COMMON_ITERATORS)
    }
}

/// `[a, b] = c`
impl Visit<ArrayPat> for UsageVisitor {
    fn visit(&mut self, p: &ArrayPat) {
        p.visit_children_with(self);

        self.add(COMMON_ITERATORS)
    }
}

/// `[...spread]`
impl Visit<ExprOrSpread> for UsageVisitor {
    fn visit(&mut self, e: &ExprOrSpread) {
        e.visit_children_with(self);
        if e.spread.is_some() {
            self.add(COMMON_ITERATORS)
        }
    }
}

/// `yield*`
impl Visit<YieldExpr> for UsageVisitor {
    fn visit(&mut self, e: &YieldExpr) {
        e.visit_children_with(self);

        if e.delegate {
            self.add(COMMON_ITERATORS)
        }
    }
}

impl Visit<Expr> for UsageVisitor {
    fn visit(&mut self, e: &Expr) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => self.add_builtin(&i.sym),
            _ => {}
        }
    }
}

impl Visit<MemberExpr> for UsageVisitor {
    fn visit(&mut self, e: &MemberExpr) {
        e.obj.visit_with(self);
        if e.computed {
            e.prop.visit_with(self);
        }

        // Object.entries
        // [1, 2, 3].entries

        match e.obj {
            ExprOrSuper::Expr(ref obj) => self.add_property_deps(&obj, &e.prop),
            _ => {}
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

// TODO: https://github.com/babel/babel/blob/00758308/packages/babel-preset-env/src/polyfills/corejs3/usage-plugin.js#L198-L206

impl Visit<BinExpr> for UsageVisitor {
    fn visit(&mut self, e: &BinExpr) {
        e.visit_children_with(self);

        match e.op {
            op!("in") => {
                // 'entries' in Object
                // 'entries' in [1, 2, 3]
                self.add_property_deps(&e.right, &e.left);
            }
            _ => {}
        }
    }
}
