use std::collections::HashSet;

use once_cell::sync::Lazy;
use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::util::get_mut_object_define_property_name_arg;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

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

    names_to_mangle: FxHashSet<Atom>,
    unmangleable: FxHashSet<Atom>,

    // Cache of already mangled names
    cache: FxHashMap<Atom, Atom>,

    // Numbers to pass to base54()
    n: usize,
}

impl<'a> ManglePropertiesState<'a> {
    fn add(&mut self, name: Atom) {
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

    fn can_mangle(&self, name: &Atom) -> bool {
        !(self.unmangleable.contains(name) || self.is_reserved(name))
    }

    fn matches_regex_option(&self, name: &Atom) -> bool {
        if let Some(regex) = &self.options.regex {
            regex.is_match(name)
        } else {
            true
        }
    }

    fn should_mangle(&self, name: &Atom) -> bool {
        if !self.matches_regex_option(name) || self.is_reserved(name) {
            false
        } else {
            self.cache.contains_key(name) || self.names_to_mangle.contains(name)
        }
    }

    fn is_reserved(&self, name: &Atom) -> bool {
        JS_ENVIRONMENT_PROPS.contains(name) || self.options.reserved.contains(name)
    }

    fn gen_name(&mut self, name: &Atom) -> Option<Atom> {
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

    let mut data = analyze(&*m, None, true);

    for prop in std::mem::take(data.property_atoms.as_mut().unwrap()) {
        state.add(prop);
    }

    m.visit_mut_with(&mut Mangler { state: &mut state });
}

struct Mangler<'a, 'b> {
    state: &'a mut ManglePropertiesState<'b>,
}

impl Mangler<'_, '_> {
    fn mangle_ident(&mut self, ident: &mut IdentName) {
        if let Some(mangled) = self.state.gen_name(&ident.sym) {
            ident.sym = mangled;
        }
    }

    fn mangle_str(&mut self, string: &mut Str) {
        if let Some(mangled) = self.state.gen_name(&string.value) {
            string.value = mangled;
            string.raw = None;
        }
    }
}

impl VisitMut for Mangler<'_, '_> {
    noop_visit_mut_type!();

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
