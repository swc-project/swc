use std::sync::Arc;

use indexmap::IndexSet;
use preset_env_base::version::{should_enable, Version};
use rustc_hash::FxBuildHasher;
use swc_atoms::Atom;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::{
    builtin::{self, CoreJSPolyfillDescriptor},
    data,
};
use crate::{corejs3::compat::DATA as CORE_JS_COMPAT_DATA, Versions};

pub(crate) struct UsageVisitor {
    shipped_proposals: bool,
    is_any_target: bool,
    target: Arc<Versions>,
    corejs_version: Version,
    pub required: IndexSet<&'static str, FxBuildHasher>,
}

impl UsageVisitor {
    pub fn new(target: Arc<Versions>, shipped_proposals: bool, corejs_version: Version) -> Self {
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
        let deps = desc.global();

        // TODO: Exclude based on object

        self.may_inject_global(deps)
    }

    /// Add imports
    fn may_inject_global(&mut self, features: impl ExactSizeIterator<Item = &'static str>) {
        let UsageVisitor {
            shipped_proposals,
            is_any_target,
            target,
            corejs_version,
            ..
        } = self;

        for f in features {
            if !*shipped_proposals && f.starts_with("esnext.") {
                continue;
            }

            let feature = CORE_JS_COMPAT_DATA.get(f);

            if !*is_any_target {
                if let Some(feature) = feature {
                    if !should_enable(target, feature, true) {
                        continue;
                    }
                }
            }

            if let Some(version) = data::modules_by_version(f) {
                if version > *corejs_version {
                    if *shipped_proposals {
                        if let Some(esnext_module) = data::esnext_fallback(f) {
                            if let Some(esnext_version) = data::modules_by_version(esnext_module) {
                                if esnext_version <= *corejs_version {
                                    self.required.insert(esnext_module);
                                }
                            }
                        }
                    }
                    continue;
                }
            }

            self.required.insert(f);
        }
    }

    fn add_builtin(&mut self, built_in: &str) {
        if let Some(features) = builtin::builtin_types_get(built_in) {
            self.add(&features);
        }
    }

    fn add_property_deps(&mut self, obj: &Expr, prop: &Atom) {
        let obj = match obj {
            Expr::Ident(i) => &i.sym,
            _ => {
                self.add_property_deps_inner(None, prop);
                return;
            }
        };

        self.add_property_deps_inner(Some(obj), prop)
    }

    fn add_property_deps_inner(&mut self, obj: Option<&Atom>, prop: &Atom) {
        if let Some(obj) = obj {
            if data::POSSIBLE_GLOBAL_OBJECTS.contains(&&**obj) {
                self.add_builtin(prop);
            }

            if let Some(map) = builtin::static_properties_get(obj) {
                if let Some(features) = map.get(prop) {
                    self.add(&features);
                    return;
                }
            }
        }

        if let Some(features) = builtin::instance_properties_get(prop) {
            self.add(&features);
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

        self.may_inject_global(builtin::common_iterators())
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
                let prop_atom = s.value.to_atom_lossy();
                self.add_property_deps(&e.right, prop_atom.as_ref());
            }
        }
    }

    /// import('something').then(...)
    /// RegExp(".", "us")
    fn visit_call_expr(&mut self, e: &CallExpr) {
        e.visit_children_with(self);

        if let Callee::Import(_) = &e.callee {
            self.may_inject_global(builtin::promise_dependencies())
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
            self.may_inject_global(builtin::common_iterators())
        }
    }

    /// for-of
    fn visit_for_of_stmt(&mut self, s: &ForOfStmt) {
        s.visit_children_with(self);

        self.may_inject_global(builtin::common_iterators())
    }

    fn visit_function(&mut self, f: &Function) {
        f.visit_children_with(self);

        if f.is_async {
            self.may_inject_global(builtin::promise_dependencies())
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        e.obj.visit_with(self);
        if let MemberProp::Computed(c) = &e.prop {
            if let Expr::Lit(Lit::Str(s)) = &*c.expr {
                let prop_atom = s.value.to_atom_lossy();
                self.add_property_deps(&e.obj, prop_atom.as_ref());
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
            self.may_inject_global(builtin::common_iterators())
        }
    }
}
