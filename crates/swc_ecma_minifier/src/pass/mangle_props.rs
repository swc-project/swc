use std::collections::HashSet;

use once_cell::sync::Lazy;
use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{Atom, Wtf8Atom};
use swc_ecma_ast::*;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use crate::{
    option::ManglePropertiesOptions,
    program_data::analyze,
    usage_analyzer::util::get_mut_object_define_property_name_arg,
    util::{base54::Base54Chars, static_property_name},
};

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
                // Skip candidates that collide with property names already
                // present in the program. Without this, the encoder may emit
                // a name like "e" while the program already defines a property
                // "e" on some object/class, producing observable shadowing
                // (see #11027).
                let mangled_name = loop {
                    let candidate = self.chars.encode(&mut self.n, true);
                    if !self
                        .unmangleable
                        .contains(&Wtf8Atom::from(candidate.clone()))
                    {
                        break candidate;
                    }
                };

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

    if options.keep_quoted.is_enabled() {
        let mut quoted = QuotedPropertyCollector::default();
        m.visit_with(&mut quoted);
        state.unmangleable.extend(quoted.names);
    }

    let mut data = analyze(&*m, None, true);

    for prop in std::mem::take(data.property_atoms.as_mut().unwrap()) {
        state.add(prop);
    }

    m.visit_mut_with(&mut Mangler { state: &mut state });
}

#[derive(Default)]
struct QuotedPropertyCollector {
    names: FxHashSet<Wtf8Atom>,
}

impl Visit for QuotedPropertyCollector {
    noop_visit_type!(fail);

    fn visit_member_expr(&mut self, member: &MemberExpr) {
        if let MemberProp::Computed(computed) = &member.prop {
            if let Some(name) = static_property_name(&computed.expr) {
                self.names.insert(name.clone());
            }
        }
        member.visit_children_with(self);
    }

    fn visit_prop_name(&mut self, name: &PropName) {
        if let PropName::Str(string) = name {
            self.names.insert(string.value.clone());
        }
        name.visit_children_with(self);
    }
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

    /// Mangle a static property-name expression while preserving ordinary
    /// string and template expression values.
    fn mangle_property_name_expr(&mut self, expr: &mut Expr) {
        if let Expr::Paren(paren) = expr {
            self.mangle_property_name_expr(&mut paren.expr);
            return;
        }

        let Some(name) = static_property_name(expr) else {
            return;
        };
        let Some(mangled) = self.state.gen_name(name) else {
            return;
        };

        match expr {
            Expr::Lit(Lit::Str(string)) => {
                string.value = mangled.into();
                string.raw = None;
            }
            Expr::Tpl(template) => {
                *expr = Expr::Lit(Lit::Str(Str {
                    span: template.span,
                    value: mangled.into(),
                    raw: None,
                }));
            }
            _ => unreachable!("static property names have literal or template expressions"),
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

        match &mut member_expr.prop {
            MemberProp::Ident(ident) => self.mangle_ident(ident),
            MemberProp::Computed(computed) => self.mangle_property_name_expr(&mut computed.expr),
            _ => {}
        }
    }

    fn visit_mut_bin_expr(&mut self, bin_expr: &mut BinExpr) {
        bin_expr.visit_mut_children_with(self);

        if bin_expr.op == BinaryOp::In {
            self.mangle_property_name_expr(&mut bin_expr.left);
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
            PropName::Computed(computed) => self.mangle_property_name_expr(&mut computed.expr),
            _ => {}
        }
    }

    fn visit_mut_super_prop_expr(&mut self, super_expr: &mut SuperPropExpr) {
        super_expr.visit_mut_children_with(self);

        match &mut super_expr.prop {
            SuperProp::Ident(ident) => self.mangle_ident(ident),
            SuperProp::Computed(computed) => self.mangle_property_name_expr(&mut computed.expr),
        }
    }
}
