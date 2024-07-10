use std::collections::HashSet;

use once_cell::sync::Lazy;
use swc_atoms::JsWord;
use swc_common::collections::{AHashMap, AHashSet};
use swc_ecma_ast::{
    CallExpr, Callee, Expr, IdentName, KeyValueProp, Lit, MemberExpr, MemberProp, Program, Prop,
    PropName, Str, SuperProp, SuperPropExpr,
};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::{
    option::ManglePropertiesOptions,
    program_data::{analyze, ProgramData},
    util::base54::Base54Chars,
};

pub static JS_ENVIRONMENT_PROPS: Lazy<AHashSet<JsWord>> = Lazy::new(|| {
    let domprops: Vec<JsWord> = serde_json::from_str(include_str!("../lists/domprops.json"))
        .expect("failed to parse domprops.json for property mangler");

    let jsprops: Vec<JsWord> = serde_json::from_str(include_str!("../lists/jsprops.json"))
        .expect("Failed to parse jsprops.json for property mangler");

    let mut word_set: AHashSet<JsWord> = HashSet::default();

    for name in domprops.iter().chain(jsprops.iter()) {
        word_set.insert(name.clone());
    }

    word_set
});

struct ManglePropertiesState {
    chars: Base54Chars,
    options: ManglePropertiesOptions,

    names_to_mangle: AHashSet<JsWord>,
    unmangleable: AHashSet<JsWord>,

    // Cache of already mangled names
    cache: AHashMap<JsWord, JsWord>,

    // Numbers to pass to base54()
    n: usize,
}

impl ManglePropertiesState {
    fn add(&mut self, name: &JsWord) {
        if self.can_mangle(name) {
            self.names_to_mangle.insert(name.clone());
        }

        if !self.should_mangle(name) {
            self.unmangleable.insert(name.clone());
        }
    }

    fn can_mangle(&self, name: &JsWord) -> bool {
        !(self.unmangleable.contains(name) || self.is_reserved(name))
    }

    fn matches_regex_option(&self, name: &JsWord) -> bool {
        if let Some(regex) = &self.options.regex {
            regex.is_match(name)
        } else {
            true
        }
    }

    fn should_mangle(&self, name: &JsWord) -> bool {
        if !self.matches_regex_option(name) || self.is_reserved(name) {
            false
        } else {
            self.cache.contains_key(name) || self.names_to_mangle.contains(name)
        }
    }

    fn is_reserved(&self, name: &JsWord) -> bool {
        JS_ENVIRONMENT_PROPS.contains(name) || self.options.reserved.contains(name)
    }

    fn gen_name(&mut self, name: &JsWord) -> Option<JsWord> {
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
    options: ManglePropertiesOptions,
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

    let data = analyze(&*m, None);
    m.visit_mut_with(&mut PropertyCollector {
        state: &mut state,
        data,
    });

    m.visit_mut_with(&mut Mangler { state: &mut state });
}

// Step 1 -- collect candidates to mangle
pub struct PropertyCollector<'a> {
    data: ProgramData,
    state: &'a mut ManglePropertiesState,
}

impl VisitMut for PropertyCollector<'_> {
    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        call.visit_mut_children_with(self);

        if let Some(prop_name) = get_object_define_property_name_arg(call) {
            self.state.add(&prop_name.value);
        }
    }

    fn visit_mut_member_expr(&mut self, member_expr: &mut MemberExpr) {
        member_expr.visit_mut_children_with(self);

        let is_root_declared = is_root_of_member_expr_declared(member_expr, &self.data);

        if is_root_declared {
            if let MemberProp::Ident(ident) = &mut member_expr.prop {
                self.state.add(&ident.sym);
            }
        }
    }

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        prop.visit_mut_children_with(self);

        if let Prop::Shorthand(ident) = prop {
            self.state.add(&ident.sym);
        }
    }

    fn visit_mut_prop_name(&mut self, name: &mut PropName) {
        name.visit_mut_children_with(self);

        match name {
            PropName::Ident(ident) => {
                self.state.add(&ident.sym);
            }
            PropName::Str(s) => {
                self.state.add(&s.value);
            }
            _ => {}
        };
    }
}

fn is_root_of_member_expr_declared(member_expr: &MemberExpr, data: &ProgramData) -> bool {
    match &*member_expr.obj {
        Expr::Member(member_expr) => is_root_of_member_expr_declared(member_expr, data),
        Expr::Ident(expr) => data
            .vars
            .get(&expr.to_id())
            .map(|var| var.declared)
            .unwrap_or(false),

        _ => false,
    }
}

fn is_object_property_call(call: &CallExpr) -> bool {
    // Find Object.defineProperty
    if let Callee::Expr(callee) = &call.callee {
        match &**callee {
            Expr::Member(MemberExpr {
                obj,
                prop: MemberProp::Ident(IdentName { sym, .. }),
                ..
            }) if *sym == *"defineProperty" => {
                if obj.is_ident_ref_to("Object") {
                    return true;
                }
            }

            _ => {}
        }
    };

    false
}

fn get_object_define_property_name_arg(call: &mut CallExpr) -> Option<&mut Str> {
    if is_object_property_call(call) {
        let second_arg: &mut Expr = call.args.get_mut(1).map(|arg| &mut arg.expr)?;

        if let Expr::Lit(Lit::Str(s)) = second_arg {
            Some(s)
        } else {
            None
        }
    } else {
        None
    }
}

// Step 2 -- mangle those properties
struct Mangler<'a> {
    state: &'a mut ManglePropertiesState,
}

impl Mangler<'_> {
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

impl VisitMut for Mangler<'_> {
    noop_visit_mut_type!();

    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        call.visit_mut_children_with(self);

        if let Some(prop_name_str) = get_object_define_property_name_arg(call) {
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
