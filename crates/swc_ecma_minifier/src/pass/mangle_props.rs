use std::collections::HashSet;

use once_cell::sync::Lazy;
use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{Atom, Wtf8Atom};
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::util::get_mut_object_define_property_name_arg;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::{
    option::ManglePropertiesOptions,
    program_data::{analyze, ProgramData, VarUsageInfoFlags},
    util::base54::Base54Chars,
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
                let mangled_name = self.chars.encode(&mut self.n, true);

                self.cache.insert(name.clone(), mangled_name.clone());
                Some(mangled_name)
            }
        } else {
            None
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

/// Collect top-level property names from an object literal
fn collect_obj_lit_props(obj: &ObjectLit, props: &mut FxHashSet<Wtf8Atom>) {
    for prop in &obj.props {
        if let PropOrSpread::Prop(prop) = prop {
            if let Some(name) = get_prop_name(prop) {
                props.insert(name);
            }
        }
    }
}

/// Collect unsafe properties from statements.
/// This finds object literals assigned to variables that are accessed with
/// dynamic keys or are exported.
fn collect_unsafe_props_from_stmts(stmts: &[Stmt], data: &ProgramData) -> FxHashSet<Wtf8Atom> {
    let mut unsafe_props = FxHashSet::default();

    for stmt in stmts {
        collect_unsafe_props_from_stmt(stmt, data, &mut unsafe_props);
    }

    unsafe_props
}

fn collect_unsafe_props_from_stmt(
    stmt: &Stmt,
    data: &ProgramData,
    props: &mut FxHashSet<Wtf8Atom>,
) {
    match stmt {
        Stmt::Decl(Decl::Var(var)) => {
            for decl in &var.decls {
                collect_unsafe_props_from_var_decl(decl, data, props);
            }
        }
        Stmt::Block(block) => {
            for stmt in &block.stmts {
                collect_unsafe_props_from_stmt(stmt, data, props);
            }
        }
        Stmt::If(if_stmt) => {
            collect_unsafe_props_from_stmt(&if_stmt.cons, data, props);
            if let Some(alt) = &if_stmt.alt {
                collect_unsafe_props_from_stmt(alt, data, props);
            }
        }
        Stmt::While(while_stmt) => {
            collect_unsafe_props_from_stmt(&while_stmt.body, data, props);
        }
        Stmt::DoWhile(do_while) => {
            collect_unsafe_props_from_stmt(&do_while.body, data, props);
        }
        Stmt::For(for_stmt) => {
            if let Some(VarDeclOrExpr::VarDecl(var)) = &for_stmt.init {
                for decl in &var.decls {
                    collect_unsafe_props_from_var_decl(decl, data, props);
                }
            }
            collect_unsafe_props_from_stmt(&for_stmt.body, data, props);
        }
        Stmt::ForIn(for_in) => {
            if let ForHead::VarDecl(var) = &for_in.left {
                for decl in &var.decls {
                    collect_unsafe_props_from_var_decl(decl, data, props);
                }
            }
            collect_unsafe_props_from_stmt(&for_in.body, data, props);
        }
        Stmt::ForOf(for_of) => {
            if let ForHead::VarDecl(var) = &for_of.left {
                for decl in &var.decls {
                    collect_unsafe_props_from_var_decl(decl, data, props);
                }
            }
            collect_unsafe_props_from_stmt(&for_of.body, data, props);
        }
        Stmt::Switch(switch) => {
            for case in &switch.cases {
                for stmt in &case.cons {
                    collect_unsafe_props_from_stmt(stmt, data, props);
                }
            }
        }
        Stmt::Try(try_stmt) => {
            for stmt in &try_stmt.block.stmts {
                collect_unsafe_props_from_stmt(stmt, data, props);
            }
            if let Some(catch) = &try_stmt.handler {
                for stmt in &catch.body.stmts {
                    collect_unsafe_props_from_stmt(stmt, data, props);
                }
            }
            if let Some(finally) = &try_stmt.finalizer {
                for stmt in &finally.stmts {
                    collect_unsafe_props_from_stmt(stmt, data, props);
                }
            }
        }
        Stmt::With(with) => {
            collect_unsafe_props_from_stmt(&with.body, data, props);
        }
        Stmt::Labeled(labeled) => {
            collect_unsafe_props_from_stmt(&labeled.body, data, props);
        }
        _ => {}
    }
}

fn collect_unsafe_props_from_var_decl(
    decl: &VarDeclarator,
    data: &ProgramData,
    props: &mut FxHashSet<Wtf8Atom>,
) {
    if let Pat::Ident(ident) = &decl.name {
        let id = ident.to_id();
        // Check if this variable is accessed with dynamic keys or exported
        if let Some(var_info) = data.vars.get(&id) {
            if var_info.flags.intersects(
                VarUsageInfoFlags::INDEXED_WITH_DYNAMIC_KEY | VarUsageInfoFlags::EXPORTED,
            ) {
                // Collect top-level properties from the object literal
                if let Some(init) = &decl.init {
                    if let Expr::Object(obj) = &**init {
                        collect_obj_lit_props(obj, props);
                    }
                }
            }
        }
    }
}

fn collect_unsafe_props_from_module_items(
    items: &[ModuleItem],
    data: &ProgramData,
) -> FxHashSet<Wtf8Atom> {
    let mut unsafe_props = FxHashSet::default();

    for item in items {
        match item {
            ModuleItem::Stmt(stmt) => {
                collect_unsafe_props_from_stmt(stmt, data, &mut unsafe_props);
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export)) => {
                if let Decl::Var(var) = &export.decl {
                    for decl in &var.decls {
                        // Exported variables - collect all object literal properties
                        if let Some(init) = &decl.init {
                            if let Expr::Object(obj) = &**init {
                                collect_obj_lit_props(obj, &mut unsafe_props);
                            }
                        }
                    }
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export)) => {
                // For default exports of object literals, collect all properties
                if let Expr::Object(obj) = &*export.expr {
                    collect_obj_lit_props(obj, &mut unsafe_props);
                }
            }
            _ => {}
        }
    }

    unsafe_props
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

    // Collect properties that should NOT be mangled.
    // These are top-level properties of object literals assigned to variables
    // that are either:
    // 1. Accessed with dynamic keys (e.g., obj[variable])
    // 2. Spread into another object (which could then be accessed dynamically)
    // 3. Exported
    // Nested properties accessed with static keys remain safe to mangle.
    let unsafe_props = match m {
        Program::Module(module) => collect_unsafe_props_from_module_items(&module.body, &data),
        Program::Script(script) => collect_unsafe_props_from_stmts(&script.body, &data),
    };

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
