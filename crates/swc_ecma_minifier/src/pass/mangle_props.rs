use std::collections::HashSet;

use once_cell::sync::Lazy;
use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{Atom, Wtf8Atom};
use swc_ecma_ast::*;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use crate::{
    option::{KeepQuotedOption, ManglePropertiesOptions},
    program_data::{analyze, ProgramData},
    usage_analyzer::{
        analyzer::storage::{Storage, VarDataLike},
        util::{get_mut_object_define_property_name_arg, get_object_define_property_name_arg},
    },
    util::{
        base54::Base54Chars, folded_static_property_name, for_each_primitive_property_name,
        for_each_short_circuit_falsy_property_name, for_each_static_property_name,
        is_non_numeric_property_name, logical_property_name_alternatives, static_property_name,
        LogicalPropertyNameAlternatives,
    },
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
    unavailable_generated_names: FxHashSet<Wtf8Atom>,

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
                let mangled_name: Atom = loop {
                    let candidate = self.chars.encode(&mut self.n, true);
                    let wtf8_candidate = Wtf8Atom::from(candidate.clone());
                    if !self.unmangleable.contains(&wtf8_candidate)
                        && !self.unavailable_generated_names.contains(&wtf8_candidate)
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
    quoted_property_names: Option<FxHashSet<Wtf8Atom>>,
    strict_quoted_property_names: Option<FxHashSet<Wtf8Atom>>,
) {
    let mut state = ManglePropertiesState {
        options,
        chars,
        names_to_mangle: Default::default(),
        unmangleable: Default::default(),
        unavailable_generated_names: Default::default(),
        cache: Default::default(),
        n: 0,
    };

    if let Some(quoted_property_names) = quoted_property_names {
        state.unmangleable.extend(quoted_property_names);
    }

    if let Some(strict_quoted_property_names) = strict_quoted_property_names {
        state
            .unavailable_generated_names
            .extend(strict_quoted_property_names);
    }

    let mut computed_property_names = ComputedPropertyNameCollector::default();
    m.visit_with(&mut computed_property_names);
    state
        .unmangleable
        .extend(computed_property_names.primitive_names);
    state
        .unmangleable
        .extend(computed_property_names.short_circuit_falsy_names);

    let mut data = analyze(&*m, None, true);

    for prop in std::mem::take(data.property_atoms.as_mut().unwrap()) {
        state.add(prop);
    }

    if options.undeclared == Some(true) {
        let mut collector = UndeclaredPropertyCollector {
            data: &data,
            names: Default::default(),
        };
        m.visit_with(&mut collector);

        for name in collector.names {
            state.add(name);
        }
    }

    m.visit_mut_with(&mut Mangler { state: &mut state });
}

/// Collects property names that must remain stable for computed keys.
///
/// Primitive keys are not rewritten by the mangler, while falsy static names
/// can change logical key branch selection if replaced with an identifier.
#[derive(Default)]
struct ComputedPropertyNameCollector {
    primitive_names: FxHashSet<Wtf8Atom>,
    short_circuit_falsy_names: FxHashSet<Wtf8Atom>,
}

impl ComputedPropertyNameCollector {
    fn collect(&mut self, expr: &Expr) {
        for_each_primitive_property_name(expr, |name| {
            self.primitive_names.insert(Wtf8Atom::from(name));
        });
        for_each_short_circuit_falsy_property_name(expr, |name| {
            self.short_circuit_falsy_names.insert(name.clone());
        });
    }
}

impl Visit for ComputedPropertyNameCollector {
    noop_visit_type!(fail);

    fn visit_bin_expr(&mut self, bin_expr: &BinExpr) {
        if bin_expr.op == BinaryOp::In {
            self.collect(&bin_expr.left);
        }
        bin_expr.visit_children_with(self);
    }

    fn visit_call_expr(&mut self, call: &CallExpr) {
        if let Some(prop_name) = get_object_define_property_name_arg(call) {
            self.collect(prop_name);
        }
        call.visit_children_with(self);
    }

    fn visit_member_expr(&mut self, member: &MemberExpr) {
        if let MemberProp::Computed(computed) = &member.prop {
            self.collect(&computed.expr);
        }
        member.visit_children_with(self);
    }

    fn visit_prop_name(&mut self, name: &PropName) {
        if let PropName::Computed(computed) = name {
            self.collect(&computed.expr);
        }
        name.visit_children_with(self);
    }

    fn visit_super_prop_expr(&mut self, super_prop: &SuperPropExpr) {
        if let SuperProp::Computed(computed) = &super_prop.prop {
            self.collect(&computed.expr);
        }
        super_prop.visit_children_with(self);
    }
}

/// Collects computed property names accessed through undeclared roots when
/// `props.undeclared` opts into mangling those external properties.
struct UndeclaredPropertyCollector<'a> {
    data: &'a ProgramData,
    names: Vec<Wtf8Atom>,
}

impl UndeclaredPropertyCollector<'_> {
    fn is_root_undeclared(&self, expr: &Expr) -> bool {
        match expr {
            Expr::Member(member) => self.is_root_undeclared(&member.obj),
            Expr::Paren(paren) => self.is_root_undeclared(&paren.expr),
            Expr::Seq(seq) => {
                if let Some(last) = seq.exprs.last() {
                    self.is_root_undeclared(last)
                } else {
                    false
                }
            }
            Expr::Cond(cond) => {
                self.is_root_undeclared(&cond.cons) || self.is_root_undeclared(&cond.alt)
            }
            Expr::Bin(bin)
                if matches!(
                    bin.op,
                    BinaryOp::LogicalAnd | BinaryOp::LogicalOr | BinaryOp::NullishCoalescing
                ) =>
            {
                self.is_root_undeclared(&bin.left) || self.is_root_undeclared(&bin.right)
            }
            Expr::Call(call) => match &call.callee {
                Callee::Expr(callee) => self.is_root_undeclared(callee),
                Callee::Super(..) | Callee::Import(..) => false,
            },
            Expr::New(new_expr) => self.is_root_undeclared(&new_expr.callee),
            Expr::OptChain(opt_chain) => match &*opt_chain.base {
                OptChainBase::Member(member) => self.is_root_undeclared(&member.obj),
                OptChainBase::Call(call) => self.is_root_undeclared(&call.callee),
            },
            Expr::Ident(ident) => self
                .data
                .get_var_data(ident.to_id())
                .map_or(true, |var| !var.is_declared()),
            _ => false,
        }
    }
}

impl Visit for UndeclaredPropertyCollector<'_> {
    noop_visit_type!(fail);

    fn visit_bin_expr(&mut self, bin_expr: &BinExpr) {
        if bin_expr.op == BinaryOp::In && self.is_root_undeclared(&bin_expr.right) {
            for_each_static_property_name(&bin_expr.left, |name| {
                self.names.push(name.clone());
            });
        }

        bin_expr.visit_children_with(self);
    }

    fn visit_member_expr(&mut self, member: &MemberExpr) {
        if self.is_root_undeclared(&member.obj) {
            if let MemberProp::Computed(computed) = &member.prop {
                for_each_static_property_name(&computed.expr, |name| {
                    self.names.push(name.clone());
                });
            }
        }

        member.visit_children_with(self);
    }
}

/// Collects statically known property names used in quoted property positions.
///
/// This must run before compression, which may convert quoted keys and computed
/// member accesses into identifier property names.
pub(crate) fn collect_quoted_property_names(m: &Program) -> FxHashSet<Wtf8Atom> {
    let mut quoted = QuotedPropertyCollector::default();
    m.visit_with(&mut quoted);
    quoted.names
}

#[derive(Default)]
struct QuotedPropertyCollector {
    names: FxHashSet<Wtf8Atom>,
}

impl QuotedPropertyCollector {
    fn collect(&mut self, expr: &Expr) {
        for_each_static_property_name(expr, |name| {
            self.names.insert(name.clone());
        });
        if let Some(name) = folded_static_property_name(expr) {
            self.names.insert(name);
        }
    }
}

impl Visit for QuotedPropertyCollector {
    noop_visit_type!(fail);

    fn visit_member_expr(&mut self, member: &MemberExpr) {
        if let MemberProp::Computed(computed) = &member.prop {
            self.collect(&computed.expr);
        }
        member.visit_children_with(self);
    }

    fn visit_super_prop_expr(&mut self, super_prop: &SuperPropExpr) {
        if let SuperProp::Computed(computed) = &super_prop.prop {
            self.collect(&computed.expr);
        }
        super_prop.visit_children_with(self);
    }

    fn visit_prop_name(&mut self, name: &PropName) {
        match name {
            PropName::Str(string) => {
                self.names.insert(string.value.clone());
            }
            PropName::Computed(computed) => {
                self.collect(&computed.expr);
            }
            _ => {}
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
        if !is_non_numeric_property_name(&string.value) {
            return;
        }

        if let Some(mangled) = self.state.gen_name(&string.value) {
            string.value = mangled.into();
            string.raw = None;
        }
    }

    /// Mangle static property-name alternatives while preserving ordinary
    /// string and template expression values.
    fn mangle_property_name_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Paren(paren) => {
                self.mangle_property_name_expr(&mut paren.expr);
                return;
            }
            Expr::Cond(cond) => {
                self.mangle_property_name_expr(&mut cond.cons);
                self.mangle_property_name_expr(&mut cond.alt);
                return;
            }
            Expr::Seq(seq) => {
                if let Some(last) = seq.exprs.last_mut() {
                    self.mangle_property_name_expr(last);
                }
                return;
            }
            Expr::Bin(bin)
                if matches!(
                    bin.op,
                    BinaryOp::LogicalAnd | BinaryOp::LogicalOr | BinaryOp::NullishCoalescing
                ) =>
            {
                match logical_property_name_alternatives(bin) {
                    LogicalPropertyNameAlternatives::Left => {
                        self.mangle_property_name_expr(&mut bin.left);
                    }
                    LogicalPropertyNameAlternatives::Right => {
                        self.mangle_property_name_expr(&mut bin.right);
                    }
                    LogicalPropertyNameAlternatives::Both => {
                        self.mangle_property_name_expr(&mut bin.left);
                        self.mangle_property_name_expr(&mut bin.right);
                    }
                }
                return;
            }
            _ => {}
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

    /// Mangle a quoted property-name expression unless strict quoted-name
    /// preservation is enabled.
    fn mangle_quoted_property_name_expr(&mut self, expr: &mut Expr) {
        if self
            .state
            .options
            .keep_quoted
            .as_ref()
            .is_some_and(KeepQuotedOption::is_strict)
        {
            return;
        }

        self.mangle_property_name_expr(expr);
    }
}

impl VisitMut for Mangler<'_, '_> {
    noop_visit_mut_type!(fail);

    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        call.visit_mut_children_with(self);

        if let Some(prop_name) = get_mut_object_define_property_name_arg(call) {
            self.mangle_property_name_expr(prop_name);
        }
    }

    fn visit_mut_member_expr(&mut self, member_expr: &mut MemberExpr) {
        member_expr.visit_mut_children_with(self);

        match &mut member_expr.prop {
            MemberProp::Ident(ident) => self.mangle_ident(ident),
            MemberProp::Computed(computed) => {
                self.mangle_quoted_property_name_expr(&mut computed.expr)
            }
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
            PropName::Str(string)
                if !self
                    .state
                    .options
                    .keep_quoted
                    .as_ref()
                    .is_some_and(KeepQuotedOption::is_strict) =>
            {
                self.mangle_str(string);
            }
            PropName::Computed(computed) => {
                self.mangle_quoted_property_name_expr(&mut computed.expr)
            }
            _ => {}
        }
    }

    fn visit_mut_super_prop_expr(&mut self, super_expr: &mut SuperPropExpr) {
        super_expr.visit_mut_children_with(self);

        match &mut super_expr.prop {
            SuperProp::Ident(ident) => self.mangle_ident(ident),
            SuperProp::Computed(computed) => {
                self.mangle_quoted_property_name_expr(&mut computed.expr)
            }
        }
    }
}
