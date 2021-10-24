use crate::{
    analyzer::{analyze, ProgramData},
    option::ManglePropertiesOptions,
    util::base54::incr_base54,
};
use once_cell::sync::Lazy;
use std::collections::HashSet;
use swc_atoms::JsWord;
use swc_common::collections::{AHashMap, AHashSet};
use swc_ecma_ast::{
    CallExpr, Expr, ExprOrSuper, Ident, KeyValueProp, Lit, MemberExpr, Module, Prop, PropName, Str,
    StrKind,
};
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

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

#[derive(Debug, Default)]
struct ManglePropertiesState {
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
        if self.can_mangle(&name) {
            self.names_to_mangle.insert(name.clone());
        }

        if !self.should_mangle(&name) {
            self.unmangleable.insert(name.clone());
        }
    }

    fn can_mangle(&self, name: &JsWord) -> bool {
        if self.unmangleable.contains(name) {
            false
        } else if self.is_reserved(name) {
            false
        } else {
            // TODO only_cache, check if it's a name that doesn't need quotes
            true
        }
    }

    fn matches_regex_option(&self, name: &JsWord) -> bool {
        if let Some(regex) = &self.options.regex {
            regex.is_match(name)
        } else {
            true
        }
    }

    fn should_mangle(&self, name: &JsWord) -> bool {
        if !self.matches_regex_option(name) {
            false
        } else if self.is_reserved(name) {
            false
        } else {
            self.cache.contains_key(name) || self.names_to_mangle.contains(name)
        }
    }

    fn is_reserved(&self, name: &JsWord) -> bool {
        JS_ENVIRONMENT_PROPS.contains(name) || self.options.reserved.contains(&name.to_string())
    }

    fn gen_name(&mut self, name: &JsWord) -> Option<JsWord> {
        if self.should_mangle(name) {
            if let Some(cached) = self.cache.get(name) {
                Some(cached.clone())
            } else {
                loop {
                    let sym = incr_base54(&mut self.n).1;

                    let mangled_name: JsWord = sym.into();
                    self.cache.insert(name.clone(), mangled_name.clone());
                    return Some(mangled_name);
                }
            }
        } else {
            None
        }
    }
}

pub(crate) fn mangle_properties<'a>(m: &mut Module, options: ManglePropertiesOptions) {
    let mut state = ManglePropertiesState {
        options,
        ..Default::default()
    };

    let data = analyze(&*m, None);
    m.visit_mut_with(&mut PropertyCollector {
        state: &mut state,
        data,
    });

    m.visit_mut_with(&mut Mangler { state: &mut state });
}

// Step 1 -- collect candidates to mangle
#[derive(Debug)]
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

        if is_root_declared && !member_expr.computed {
            if let Expr::Ident(ident) = &mut *member_expr.prop {
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
    match &member_expr.obj {
        ExprOrSuper::Expr(boxed_exp) => match &**boxed_exp {
            Expr::Member(member_expr) => is_root_of_member_expr_declared(member_expr, data),
            Expr::Ident(expr) => data
                .vars
                .get(&expr.to_id())
                .and_then(|var| Some(var.declared))
                .unwrap_or(false),

            _ => false,
        },
        ExprOrSuper::Super(_) => true,
    }
}

fn is_object_property_call(call: &CallExpr) -> bool {
    // Find Object.defineProperty
    if let ExprOrSuper::Expr(callee) = &call.callee {
        if let Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(obj),
            prop,
            ..
        }) = &**callee
        {
            match (&**obj, &**prop) {
                (Expr::Ident(Ident { sym: ident, .. }), Expr::Ident(Ident { sym: prop, .. })) => {
                    if ident.as_ref() == "Object" && prop.as_ref() == "defineProperty" {
                        return true;
                    }
                }
                _ => {}
            }
        }
    }

    return false;
}

fn get_object_define_property_name_arg<'a>(call: &'a mut CallExpr) -> Option<&'a mut Str> {
    if is_object_property_call(&call) {
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
#[derive(Debug)]
struct Mangler<'a> {
    state: &'a mut ManglePropertiesState,
}

impl Mangler<'_> {
    fn mangle_ident(&mut self, ident: &mut Ident) {
        if let Some(mangled) = self.state.gen_name(&ident.sym) {
            ident.sym = mangled.into();
        }
    }

    fn mangle_str(&mut self, string: &mut Str) {
        if let Some(mangled) = self.state.gen_name(&string.value) {
            string.value = mangled.into();
            string.kind = StrKind::Synthesized;
        }
    }
}

impl VisitMut for Mangler<'_> {
    noop_visit_mut_type!();

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

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        prop.visit_mut_children_with(self);

        if let Prop::Shorthand(ident) = prop {
            let mut new_ident = ident.clone();

            self.mangle_ident(&mut new_ident);

            *prop = Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(new_ident),
                value: Box::new(Expr::Ident(ident.clone())),
            });
        }
    }

    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        call.visit_mut_children_with(self);

        if let Some(mut prop_name_str) = get_object_define_property_name_arg(call) {
            self.mangle_str(&mut prop_name_str);
        }
    }

    fn visit_mut_member_expr(&mut self, member_expr: &mut MemberExpr) {
        member_expr.visit_mut_children_with(self);

        if !member_expr.computed {
            if let Expr::Ident(ident) = &mut *member_expr.prop {
                self.mangle_ident(ident);
            }
        }
    }
}
