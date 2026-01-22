use std::collections::HashSet;

use once_cell::sync::Lazy;
use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{Atom, Wtf8Atom};
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::util::get_mut_object_define_property_name_arg;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use crate::{option::ManglePropertiesOptions, program_data::analyze, util::base54::Base54Chars};

pub static JS_ENVIRONMENT_PROPS: Lazy<FxHashSet<Atom>> = Lazy::new(|| {
    let domprops: Vec<Atom> = serde_json::from_str(include_str!("../lists/domprops.json"))
        .expect("failed to parse domprops.json for property mangler");

    let jsprops: Vec<Atom> = serde_json::from_str(include_str!("../lists/jsprops.json"))
        .expect("Failed to parse jsprops.json for property mangler");

    let mut word_set: FxHashSet<Atom> = HashSet::default();

    for name in domprops.iter().chain(jsprops.iter()) {
        word_set.insert(name.clone());
    }

    word_set
});

struct ManglePropertiesState<'a> {
    chars: Base54Chars,
    options: &'a ManglePropertiesOptions,

    names_to_mangle: FxHashSet<Wtf8Atom>,
    unmangleable: FxHashSet<Wtf8Atom>,

    // Cache of already mangled names
    cache: FxHashMap<Wtf8Atom, Atom>,

    // Numbers to pass to base54()
    n: usize,
}

impl<'a> ManglePropertiesState<'a> {
    fn add(&mut self, name: Wtf8Atom) {
        let can_mangle = self.can_mangle(&name);
        let should_mangle = self.should_mangle(&name);
        match (can_mangle, !should_mangle) {
            (true, true) => {
                self.names_to_mangle.insert(name.clone());
                self.unmangleable.insert(name);
            }
            (false, true) => {
                self.unmangleable.insert(name);
            }
            (true, false) => {
                self.names_to_mangle.insert(name);
            }
            _ => {}
        }
    }

    fn can_mangle(&self, name: &Wtf8Atom) -> bool {
        !(self.unmangleable.contains(name) || self.is_reserved(name))
    }

    fn matches_regex_option(&self, name: &Wtf8Atom) -> bool {
        if let Some(regex) = &self.options.regex {
            if let Some(utf8_str) = name.as_str() {
                regex.is_match(utf8_str)
            } else {
                false
            }
        } else {
            true
        }
    }

    fn should_mangle(&self, name: &Wtf8Atom) -> bool {
        if !self.matches_regex_option(name) || self.is_reserved(name) {
            false
        } else {
            self.cache.contains_key(name) || self.names_to_mangle.contains(name)
        }
    }

    fn is_reserved(&self, name: &Wtf8Atom) -> bool {
        if let Some(utf8_str) = name.as_str() {
            let atom = Atom::from(utf8_str);
            JS_ENVIRONMENT_PROPS.contains(&atom) || self.options.reserved.contains(&atom)
        } else {
            false
        }
    }

    fn gen_name(&mut self, name: &Wtf8Atom) -> Option<Atom> {
        if self.should_mangle(name) {
            if let Some(cached) = self.cache.get(name) {
                Some(cached.clone())
            } else {
                let mangled_name = self.chars.encode(&mut self.n, true);

                self.cache.insert(name.clone(), mangled_name.clone());
                Some(mangled_name)
            }
        } else {
            None
        }
    }
}

/// Collects properties that are potentially accessed dynamically.
///
/// A property should NOT be mangled if:
/// 1. It's on an exported variable
/// 2. It could be accessed via a dynamic key (e.g., `obj[variable]`)
/// 3. The object containing it is passed to external code that could access
///    properties dynamically
struct UnsafePropertyCollector {
    /// Properties that should NOT be mangled because they may be accessed
    /// dynamically
    unsafe_props: FxHashSet<Wtf8Atom>,

    /// Variables that are exported or otherwise exposed
    exported_vars: FxHashSet<Id>,

    /// Variables that are accessed with dynamic keys
    dynamic_access_vars: FxHashSet<Id>,
}

impl UnsafePropertyCollector {
    fn new() -> Self {
        Self {
            unsafe_props: Default::default(),
            exported_vars: Default::default(),
            dynamic_access_vars: Default::default(),
        }
    }

    /// Mark all properties of a variable as unsafe (not mangleable)
    fn mark_var_props_unsafe(&mut self, id: &Id, obj: &ObjectLit) {
        if self.exported_vars.contains(id) || self.dynamic_access_vars.contains(id) {
            for prop in &obj.props {
                if let PropOrSpread::Prop(prop) = prop {
                    if let Some(name) = get_prop_name(prop) {
                        self.unsafe_props.insert(name);
                    }
                }
            }
        }
    }
}

/// Extract property name from a Prop
fn get_prop_name(prop: &Prop) -> Option<Wtf8Atom> {
    match prop {
        Prop::Shorthand(ident) => Some(ident.sym.clone().into()),
        Prop::KeyValue(kv) => get_prop_name_from_key(&kv.key),
        Prop::Assign(a) => Some(a.key.sym.clone().into()),
        Prop::Getter(g) => get_prop_name_from_key(&g.key),
        Prop::Setter(s) => get_prop_name_from_key(&s.key),
        Prop::Method(m) => get_prop_name_from_key(&m.key),
    }
}

fn get_prop_name_from_key(key: &PropName) -> Option<Wtf8Atom> {
    match key {
        PropName::Ident(ident) => Some(ident.sym.clone().into()),
        PropName::Str(s) => Some(s.value.clone()),
        PropName::Num(_) | PropName::Computed(_) | PropName::BigInt(_) => None,
    }
}

impl Visit for UnsafePropertyCollector {
    noop_visit_type!();

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        // Track exported variables
        match &n.decl {
            Decl::Var(var) => {
                for decl in &var.decls {
                    if let Pat::Ident(ident) = &decl.name {
                        self.exported_vars.insert(ident.to_id());
                    }
                }
            }
            Decl::Fn(f) => {
                self.exported_vars.insert(f.ident.to_id());
            }
            Decl::Class(c) => {
                self.exported_vars.insert(c.ident.to_id());
            }
            _ => {}
        }
        n.visit_children_with(self);
    }

    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr) {
        // For default exports, we can't easily track the variable, but we need
        // to be conservative about object literals in default exports
        if let Expr::Object(obj) = &*n.expr {
            for prop in &obj.props {
                if let PropOrSpread::Prop(prop) = prop {
                    if let Some(name) = get_prop_name(prop) {
                        self.unsafe_props.insert(name);
                    }
                }
            }
        }
        n.visit_children_with(self);
    }

    fn visit_member_expr(&mut self, n: &MemberExpr) {
        n.visit_children_with(self);

        // Check for dynamic property access: obj[variable] where variable is not
        // a constant
        if let MemberProp::Computed(computed) = &n.prop {
            match &*computed.expr {
                // Static string access like obj["prop"] is fine
                Expr::Lit(Lit::Str(_)) => {}
                // Numeric access like obj[0] is fine
                Expr::Lit(Lit::Num(_)) => {}
                // Any other computed access is potentially dynamic
                _ => {
                    // Mark the object being accessed as having dynamic access
                    if let Expr::Ident(ident) = &*n.obj {
                        self.dynamic_access_vars.insert(ident.to_id());
                    }
                }
            }
        }
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        n.visit_children_with(self);

        // Track object literal assignments to variables
        if let Pat::Ident(ident) = &n.name {
            if let Some(init) = &n.init {
                if let Expr::Object(obj) = &**init {
                    self.mark_var_props_unsafe(&ident.to_id(), obj);
                }
            }
        }
    }
}

/// Second pass: collect properties from objects that are accessed dynamically
/// at a deeper level (nested objects).
struct NestedUnsafePropertyCollector<'a> {
    unsafe_props: &'a mut FxHashSet<Wtf8Atom>,
    dynamic_access_vars: &'a FxHashSet<Id>,
}

impl Visit for NestedUnsafePropertyCollector<'_> {
    noop_visit_type!();

    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        n.visit_children_with(self);

        // If a variable is accessed dynamically, mark all top-level properties
        // of its object literal value as unsafe
        if let Pat::Ident(ident) = &n.name {
            if self.dynamic_access_vars.contains(&ident.to_id()) {
                if let Some(init) = &n.init {
                    if let Expr::Object(obj) = &**init {
                        for prop in &obj.props {
                            if let PropOrSpread::Prop(prop) = prop {
                                if let Some(name) = get_prop_name(prop) {
                                    self.unsafe_props.insert(name);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

/// Collect properties that should not be mangled due to potential dynamic
/// access.
fn collect_unsafe_properties(m: &Program) -> FxHashSet<Wtf8Atom> {
    let mut collector = UnsafePropertyCollector::new();
    m.visit_with(&mut collector);

    // Second pass to collect nested unsafe properties
    let mut nested_collector = NestedUnsafePropertyCollector {
        unsafe_props: &mut collector.unsafe_props,
        dynamic_access_vars: &collector.dynamic_access_vars,
    };
    m.visit_with(&mut nested_collector);

    collector.unsafe_props
}

pub(crate) fn mangle_properties(
    m: &mut Program,
    options: &ManglePropertiesOptions,
    chars: Base54Chars,
) {
    let mut state = ManglePropertiesState {
        options,
        chars,
        names_to_mangle: Default::default(),
        unmangleable: Default::default(),
        cache: Default::default(),
        n: 0,
    };

    // Collect properties that should NOT be mangled due to dynamic access
    // This analyzes the AST to find:
    // 1. Properties of exported objects
    // 2. Top-level properties of objects accessed with dynamic keys (e.g.,
    //    obj[var])
    // Nested properties accessed with static keys (e.g., obj[var].width) remain
    // safe
    let unsafe_props = collect_unsafe_properties(m);

    let mut data = analyze(&*m, None, true);

    for prop in std::mem::take(data.property_atoms.as_mut().unwrap()) {
        // Skip properties that could be accessed dynamically
        if unsafe_props.contains(&prop) {
            state.unmangleable.insert(prop);
            continue;
        }
        state.add(prop);
    }

    m.visit_mut_with(&mut Mangler { state: &mut state });
}

struct Mangler<'a, 'b> {
    state: &'a mut ManglePropertiesState<'b>,
}

impl Mangler<'_, '_> {
    fn mangle_ident(&mut self, ident: &mut IdentName) {
        let wtf8_name = Wtf8Atom::from(ident.sym.clone());
        if let Some(mangled) = self.state.gen_name(&wtf8_name) {
            ident.sym = mangled;
        }
    }

    fn mangle_str(&mut self, string: &mut Str) {
        if let Some(mangled) = self.state.gen_name(&string.value) {
            string.value = mangled.into();
            string.raw = None;
        }
    }
}

impl VisitMut for Mangler<'_, '_> {
    noop_visit_mut_type!(fail);

    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        call.visit_mut_children_with(self);

        if let Some(prop_name_str) = get_mut_object_define_property_name_arg(call) {
            self.mangle_str(prop_name_str);
        }
    }

    fn visit_mut_member_expr(&mut self, member_expr: &mut MemberExpr) {
        member_expr.visit_mut_children_with(self);

        if let MemberProp::Ident(ident) = &mut member_expr.prop {
            self.mangle_ident(ident);
        }
    }

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        prop.visit_mut_children_with(self);

        if let Prop::Shorthand(ident) = prop {
            let mut new_ident = IdentName::from(ident.clone());

            self.mangle_ident(&mut new_ident);

            *prop = Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(new_ident),
                value: ident.clone().into(),
            });
        }
    }

    fn visit_mut_prop_name(&mut self, name: &mut PropName) {
        name.visit_mut_children_with(self);

        match name {
            PropName::Ident(ident) => {
                self.mangle_ident(ident);
            }
            PropName::Str(string) => {
                self.mangle_str(string);
            }
            _ => {}
        }
    }

    fn visit_mut_super_prop_expr(&mut self, super_expr: &mut SuperPropExpr) {
        super_expr.visit_mut_children_with(self);

        if let SuperProp::Ident(ident) = &mut super_expr.prop {
            self.mangle_ident(ident);
        }
    }
}
