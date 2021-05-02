use crate::analyzer::analyze;
use crate::analyzer::ProgramData;
use crate::option::ManglePropertiesOptions;
use crate::util::base54::base54;
use once_cell::sync::Lazy;
use std::collections::{HashMap, HashSet};
use swc_atoms::JsWord;
use swc_ecma_ast::{
    CallExpr, Expr, ExprOrSuper, Ident, KeyValueProp, Lit, MemberExpr, Module, PrivateName, Prop,
    PropName, Str, StrKind,
};
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{VisitMut, VisitMutWith};

pub static JS_ENVIRONMENT_PROPS: Lazy<HashSet<JsWord>> = Lazy::new(|| {
    let domprops: Vec<JsWord> = serde_json::from_str(include_str!("../lists/domprops.json"))
        .expect("failed to parse domprops.json for property mangler");

    let jsprops: Vec<JsWord> = serde_json::from_str(include_str!("../lists/jsprops.json"))
        .expect("Failed to parse jsprops.json for property mangler");

    let mut word_set: HashSet<JsWord> = HashSet::new();

    for name in domprops.iter().chain(jsprops.iter()) {
        word_set.insert(name.clone());
    }

    word_set
});

#[derive(Debug, Default)]
struct ManglePropertiesState {
    options: ManglePropertiesOptions,

    names_to_mangle: HashSet<JsWord>,
    unmangleable: HashSet<JsWord>,

    // Cache of already mangled names
    cache: HashMap<JsWord, JsWord>,
    private_cache: HashMap<JsWord, JsWord>,

    // Numbers to pass to base54()
    n: usize,
    private_n: usize,
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

    fn should_mangle(&self, name: &JsWord) -> bool {
        // TODO check regex option,
        if self.is_reserved(name) {
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
                let n = self.n;
                self.n += 1;
                let mangled_name: JsWord = base54(n).into();
                self.cache.insert(name.clone(), mangled_name.clone());
                Some(mangled_name)
            }
        } else {
            None
        }
    }

    fn gen_private_name(&mut self, name: &JsWord) -> JsWord {
        // Always mangleable
        if let Some(cached) = self.private_cache.get(&name) {
            cached.clone()
        } else {
            let private_n = self.private_n;
            self.private_n += 1;

            let mangled_name: JsWord = base54(private_n).into();

            self.private_cache
                .insert(name.clone(), mangled_name.clone());

            mangled_name
        }
    }
}

pub fn mangle_properties<'a>(m: &mut Module, options: ManglePropertiesOptions) {
    let mut state = ManglePropertiesState {
        options,
        ..Default::default()
    };

    let data = analyze(&*m);
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

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        prop.visit_mut_children_with(self);

        if let Prop::Shorthand(ident) = prop {
            self.state.add(&ident.sym);
        }
    }

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

    fn visit_mut_private_name(&mut self, private_name: &mut PrivateName) {
        private_name.id.sym = self.state.gen_private_name(&private_name.id.sym);
    }
}
