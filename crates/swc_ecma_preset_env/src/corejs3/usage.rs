use indexmap::IndexSet;
use preset_env_base::version::{should_enable, Version};
use swc_atoms::JsWord;
use swc_common::collections::ARandomState;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::{
    builtin::{
        BUILT_INS, COMMON_ITERATORS, INSTANCE_PROPERTIES, PROMISE_DEPENDENCIES, STATIC_PROPERTIES,
    },
    data::{MODULES_BY_VERSION, POSSIBLE_GLOBAL_OBJECTS},
};
use crate::{
    corejs3::compat::DATA as CORE_JS_COMPAT_DATA, util::CoreJSPolyfillDescriptor, Versions,
};

pub(crate) struct UsageVisitor {
    shipped_proposals: bool,
    is_any_target: bool,
    target: Versions,
    corejs_version: Version,
    pub required: IndexSet<&'static str, ARandomState>,
}

impl UsageVisitor {
    pub fn new(target: Versions, shipped_proposals: bool, corejs_version: Version) -> Self {
        //        let mut v = Self { required: Vec::new() };
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
            corejs_version,
            required: Default::default(),
        }
    }

    fn add(&mut self, desc: &CoreJSPolyfillDescriptor) {
        let deps = desc.global;

        // TODO: Exclude based on object

        self.may_inject_global(deps)
    }

    /// Add imports
    fn may_inject_global(&mut self, features: &[&'static str]) {
        let UsageVisitor {
            shipped_proposals,
            is_any_target,
            target,
            corejs_version,
            ..
        } = self;

        self.required.extend(features.iter().filter(|f| {
            if !*shipped_proposals && f.starts_with("esnext.") {
                return false;
            }

            let feature = CORE_JS_COMPAT_DATA.get(&***f);

            if !*is_any_target {
                if let Some(feature) = feature {
                    if !should_enable(*target, *feature, true) {
                        return false;
                    }
                }
            }

            if let Some(version) = MODULES_BY_VERSION.get(**f) {
                return version <= corejs_version;
            }

            true
        }));
    }

    fn add_builtin(&mut self, built_in: &str) {
        if let Some(features) = BUILT_INS.get(built_in) {
            self.add(features)
        }
    }

    fn add_property_deps(&mut self, obj: &Expr, prop: &JsWord) {
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

            if let Some(map) = STATIC_PROPERTIES.get(&**obj) {
                if let Some(features) = map.get(&**prop) {
                    self.add(features);
                    return;
                }
            }
        }

        if let Some(features) = INSTANCE_PROPERTIES.get(&**prop) {
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

impl Visit for UsageVisitor {
    noop_visit_type!(fail);

    /// `[a, b] = c`
    fn visit_array_pat(&mut self, p: &ArrayPat) {
        p.visit_children_with(self);

        self.may_inject_global(COMMON_ITERATORS)
    }

    fn visit_assign_expr(&mut self, e: &AssignExpr) {
        e.visit_children_with(self);

        if let AssignTarget::Pat(AssignTargetPat::Object(o)) = &e.left {
            self.visit_object_pat_props(&e.right, &o.props)
        }
    }

    fn visit_bin_expr(&mut self, e: &BinExpr) {
        e.visit_children_with(self);

        if e.op == op!("in") {
            // 'entries' in Object
            // 'entries' in [1, 2, 3]
            if let Expr::Lit(Lit::Str(s)) = &*e.left {
                self.add_property_deps(&e.right, &s.value);
            }
        }
    }

    /// import('something').then(...)
    /// RegExp(".", "us")
    fn visit_call_expr(&mut self, e: &CallExpr) {
        e.visit_children_with(self);

        if let Callee::Import(_) = &e.callee {
            self.may_inject_global(PROMISE_DEPENDENCIES)
        }
    }

    fn visit_expr(&mut self, e: &Expr) {
        e.visit_children_with(self);

        if let Expr::Ident(i) = e {
            self.add_builtin(&i.sym)
        }
    }

    /// `[...spread]`
    fn visit_expr_or_spread(&mut self, e: &ExprOrSpread) {
        e.visit_children_with(self);
        if e.spread.is_some() {
            self.may_inject_global(COMMON_ITERATORS)
        }
    }

    /// for-of
    fn visit_for_of_stmt(&mut self, s: &ForOfStmt) {
        s.visit_children_with(self);

        self.may_inject_global(COMMON_ITERATORS)
    }

    fn visit_function(&mut self, f: &Function) {
        f.visit_children_with(self);

        if f.is_async {
            self.may_inject_global(PROMISE_DEPENDENCIES)
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        e.obj.visit_with(self);
        if let MemberProp::Computed(c) = &e.prop {
            if let Expr::Lit(Lit::Str(s)) = &*c.expr {
                self.add_property_deps(&e.obj, &s.value);
            }
            c.visit_with(self);
        }

        // Object.entries
        // [1, 2, 3].entries
        if let MemberProp::Ident(i) = &e.prop {
            self.add_property_deps(&e.obj, &i.sym)
        }
    }

    fn visit_super_prop_expr(&mut self, e: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }
    }

    fn visit_var_declarator(&mut self, d: &VarDeclarator) {
        d.visit_children_with(self);

        if let Some(ref init) = d.init {
            if let Pat::Object(ref o) = d.name {
                self.visit_object_pat_props(init, &o.props)
            }
        } else if let Pat::Object(ref o) = d.name {
            self.visit_object_pat_props(&Ident::default().into(), &o.props)
        }
    }

    /// `yield*`
    fn visit_yield_expr(&mut self, e: &YieldExpr) {
        e.visit_children_with(self);

        if e.delegate {
            self.may_inject_global(COMMON_ITERATORS)
        }
    }
}
