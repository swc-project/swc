use crate::analyzer::analyze;
use crate::analyzer::ProgramData;
use crate::option::ManglePropertiesOptions;
use crate::util::base54::base54;
use std::collections::{HashMap, HashSet};
use swc_atoms::JsWord;
use swc_ecma_ast::{
    CallExpr, Expr, ExprOrSuper, Ident, KeyValueProp, Lit, MemberExpr, Module, Prop, PropName, Str,
};
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{VisitMut, VisitMutWith};

#[derive(Debug, Default)]
struct ManglePropertiesState {
    options: ManglePropertiesOptions,

    names_to_mangle: HashSet<JsWord>,
    unmangleable: HashSet<JsWord>,

    // Cache of already mangled names
    cache: HashMap<JsWord, JsWord>,
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
        } else if self.options.reserved.contains(&name.to_string()) {
            false
        } else {
            // TODO only_cache, check if it's a name that doesn't need quotes
            true
        }
    }

    fn should_mangle(&self, name: &JsWord) -> bool {
        if self.options.reserved.contains(&name.to_string()) {
            false
        } else {
            self.cache.contains_key(name) || self.names_to_mangle.contains(name)
        }
        // TODO check regex option,
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

    m.visit_mut_with(&mut Mangler {
        state: &mut state,
        n: 0,
    });
}

// Step 1 -- collect candidates to mangle
#[derive(Debug)]
pub struct PropertyCollector<'a> {
    data: ProgramData,
    state: &'a mut ManglePropertiesState,
}

impl VisitMut for PropertyCollector<'_> {
    fn visit_mut_prop_name(&mut self, name: &mut PropName) {
        match name {
            PropName::Ident(ident) => {
                self.state.add(&ident.sym);
            }
            PropName::Str(s) => {
                self.state.add(&s.value);
            }
            _ => {
                name.visit_mut_children_with(self);
            }
        };
    }

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        if let Prop::Shorthand(ident) = prop {
            self.state.add(&ident.sym);
        }

        prop.visit_mut_children_with(self);
    }

    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        if let Some(prop_name) = get_object_define_property_name_arg(call) {
            self.state.add(&prop_name.value);
        }

        call.visit_mut_children_with(self);
    }

    fn visit_mut_member_expr(&mut self, member_expr: &mut MemberExpr) {
        let is_root_declared = if !self.state.options.undeclared {
            is_root_of_member_expr_declared(member_expr, &self.data)
        } else {
            true
        };

        if is_root_declared && !member_expr.computed {
            if let Expr::Ident(ident) = &mut *member_expr.prop {
                self.state.add(&ident.sym);
            }
        }

        member_expr.visit_mut_children_with(self);
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
    n: usize,
}

impl Mangler<'_> {
    fn mangle(&mut self, name: &JsWord) -> Option<JsWord> {
        if self.state.should_mangle(name) {
            if let Some(cached) = self.state.cache.get(name) {
                Some(cached.clone())
            } else {
                let n = self.n;
                self.n += 1;
                let mangled_name: JsWord = base54(n).into();
                self.state.cache.insert(name.clone(), mangled_name.clone());
                Some(mangled_name)
            }
        } else {
            None
        }
    }

    fn mangle_ident(&mut self, ident: &mut Ident) {
        if let Some(mangled) = self.mangle(&ident.sym) {
            ident.sym = mangled.into();
        }
    }

    fn mangle_str(&mut self, string: &mut Str) {
        if let Some(mangled) = self.mangle(&string.value) {
            string.value = mangled.into();
        }
    }

    // TODO mangle_private
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
        if member_expr.computed {
            // TODO reserve strings
            return;
        }
        if let Expr::Ident(ident) = &mut *member_expr.prop {
            self.mangle_ident(ident);
        }
    }
}
