use std::collections::hash_map::Entry;

use indexmap::IndexSet;
use rustc_hash::{FxBuildHasher, FxHashMap};
use swc_atoms::Wtf8Atom;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::{
    alias::{Access, AccessKind},
    analyzer::{
        analyze_with_custom_storage,
        storage::{ScopeDataLike, Storage, VarDataLike},
        Ctx, ScopeKind, UsageAnalyzer,
    },
    marks::Marks,
    util::is_global_var_with_pure_property_access,
};
use swc_ecma_utils::{Merge, Type, Value};
use swc_ecma_visit::VisitWith;

pub(crate) fn analyze<N>(n: &N, marks: Option<Marks>, collect_property_atoms: bool) -> ProgramData
where
    N: VisitWith<UsageAnalyzer<ProgramData>>,
{
    let data = if collect_property_atoms {
        ProgramData {
            property_atoms: Some(Vec::with_capacity(128)),
            ..Default::default()
        }
    } else {
        ProgramData::default()
    };

    analyze_with_custom_storage(data, n, marks)
}

/// Represents the value passed to a parameter across all call sites.
#[derive(Debug, Clone)]
pub(crate) enum ParamInlineValue {
    /// The parameter receives undefined (either implicit or explicit) at all
    /// call sites.
    Undefined,
    /// The parameter receives a constant literal at all call sites.
    Lit(Box<Lit>),
    /// The parameter receives different values at different call sites.
    Mixed,
}

impl Default for ParamInlineValue {
    fn default() -> Self {
        // Parameters start as undefined (no calls yet)
        ParamInlineValue::Undefined
    }
}

impl ParamInlineValue {
    /// Merge another value into this one. If the values are the same, keep it.
    /// Otherwise, mark as Mixed.
    pub fn merge(&mut self, other: &ParamInlineValue) {
        match (&self, other) {
            (ParamInlineValue::Undefined, ParamInlineValue::Undefined) => {}
            (ParamInlineValue::Lit(a), ParamInlineValue::Lit(b)) => {
                if !lit_eq(a, b) {
                    *self = ParamInlineValue::Mixed;
                }
            }
            (ParamInlineValue::Mixed, _) => {}
            _ => {
                *self = ParamInlineValue::Mixed;
            }
        }
    }

    /// Record a value passed at a call site
    pub fn record_value(&mut self, expr: Option<&Expr>) {
        let new_value = match expr {
            None => ParamInlineValue::Undefined,
            Some(Expr::Ident(id)) if &*id.sym == "undefined" => ParamInlineValue::Undefined,
            Some(Expr::Unary(UnaryExpr {
                op: op!("void"),
                arg,
                ..
            })) if matches!(&**arg, Expr::Lit(Lit::Num(_))) => ParamInlineValue::Undefined,
            Some(Expr::Lit(lit)) => ParamInlineValue::Lit(Box::new(lit.clone())),
            _ => ParamInlineValue::Mixed,
        };

        self.merge(&new_value);
    }
}

/// Helper to compare literals for equality (for parameter value tracking)
fn lit_eq(a: &Lit, b: &Lit) -> bool {
    match (a, b) {
        (Lit::Str(a), Lit::Str(b)) => a.value == b.value,
        (Lit::Bool(a), Lit::Bool(b)) => a.value == b.value,
        (Lit::Null(_), Lit::Null(_)) => true,
        (Lit::Num(a), Lit::Num(b)) => a.value == b.value,
        (Lit::BigInt(a), Lit::BigInt(b)) => a.value == b.value,
        (Lit::Regex(a), Lit::Regex(b)) => a.exp == b.exp && a.flags == b.flags,
        _ => false,
    }
}

/// Information about a function declaration for parameter optimization.
#[derive(Debug, Clone, Default)]
pub(crate) struct FnDeclInfo {
    /// Values passed to each parameter index across all call sites.
    pub(crate) param_values: Vec<ParamInlineValue>,
}

/// Analyzed info of a whole program we are working on.
#[derive(Debug, Default)]
pub(crate) struct ProgramData {
    pub(crate) vars: FxHashMap<Id, Box<VarUsageInfo>>,

    initialized_vars: IndexSet<Id, FxBuildHasher>,

    pub(crate) top: ScopeData,

    scopes: Vec<ScopeData>,

    pub(crate) property_atoms: Option<Vec<Wtf8Atom>>,

    /// Map from function identifier to function declaration info.
    /// Used for tracking parameter values across call sites.
    pub(crate) fn_decls: FxHashMap<Id, FnDeclInfo>,
}

bitflags::bitflags! {
    #[derive(Debug, Clone, Copy)]
    pub(crate) struct VarUsageInfoFlags: u32 {
        const INLINE_PREVENTED          = 1 << 0;
        /// `false` if it's only used.
        const DECLARED                  = 1 << 1;
        /// `true` if the enclosing function defines this variable as a parameter.
        const DECLARED_AS_FN_PARAM      = 1 << 2;
        const DECLARED_AS_FN_DECL       = 1 << 3;
        const DECLARED_AS_FN_EXPR       = 1 << 4;
        const DECLARED_AS_FOR_INIT      = 1 << 5;
        /// The variable itself is assigned after reference.
        const REASSIGNED                = 1 << 6;
        const HAS_PROPERTY_ACCESS       = 1 << 7;
        const EXPORTED                  = 1 << 8;
        /// True if used **above** the declaration or in init. (Not eval order).
        const USED_ABOVE_DECL           = 1 << 9;
        /// `true` if it's declared by function parameters or variables declared in
        /// a closest function and used only within it and not used by child
        /// functions.
        const IS_FN_LOCAL               = 1 << 10;
        const USED_IN_NON_CHILD_FN      = 1 << 11;
        /// `true` if all its assign happens in the same function scope it's defined
        const ASSIGNED_FN_LOCAL         = 1 << 12;
        const EXECUTED_MULTIPLE_TIME    = 1 << 13;
        const USED_IN_COND              = 1 << 14;
        const VAR_INITIALIZED           = 1 << 15;
        const DECLARED_AS_CATCH_PARAM   = 1 << 16;
        const NO_SIDE_EFFECT_FOR_MEMBER_ACCESS = 1 << 17;
        /// `a` in `foo(a)` or `foo({ a })`.
        const USED_AS_REF               = 1 << 18;
        const USED_AS_ARG               = 1 << 19;
        const INDEXED_WITH_DYNAMIC_KEY  = 1 << 20;
        const PURE_FN                   = 1 << 21;
        /// Is the variable declared in top level?
        const IS_TOP_LEVEL              = 1 << 22;
        const USED_RECURSIVELY          = 1 << 23;

        /// `a` in `foo(<a />)`
        const USED_AS_JSX_CALLEE       = 1 << 24;

        /// The variable is declared without initializer.
        const LAZY_INIT                 = 1 << 25;
    }

    #[derive(Debug, Default, Clone, Copy)]
    pub(crate) struct ScopeData: u8 {
        const HAS_WITH_STMT  = 1 << 0;
        const HAS_EVAL_CALL  = 1 << 1;
        const USED_ARGUMENTS = 1 << 2;
    }
}

#[derive(Debug, Clone)]
pub(crate) struct VarUsageInfo {
    pub(crate) flags: VarUsageInfoFlags,
    /// The number of direct reference to this identifier.
    pub(crate) ref_count: u32,
    pub(crate) declared_count: u32,

    /// The number of assign and initialization to this identifier.
    pub(crate) assign_count: u32,

    /// The number of direct and indirect reference to this identifier.
    /// ## Things to note
    ///
    /// - Update is counted as usage, but assign is not
    pub(crate) usage_count: u32,

    pub(crate) property_mutation_count: u32,

    pub(crate) var_kind: Option<VarDeclKind>,
    pub(crate) merged_var_type: Option<Value<Type>>,

    pub(crate) callee_count: u32,

    /// `infects_to`. This should be renamed, but it will be done with another
    /// PR. (because it's hard to review)
    infects_to: Vec<Access>,
    /// Only **string** properties.
    pub(crate) accessed_props: FxHashMap<Wtf8Atom, u32>,
}

impl Default for VarUsageInfo {
    fn default() -> Self {
        const DEFAULT_FLAGS: VarUsageInfoFlags =
            VarUsageInfoFlags::ASSIGNED_FN_LOCAL.union(VarUsageInfoFlags::IS_FN_LOCAL);
        Self {
            flags: DEFAULT_FLAGS,
            ref_count: Default::default(),
            declared_count: Default::default(),
            assign_count: Default::default(),
            usage_count: Default::default(),
            property_mutation_count: Default::default(),
            var_kind: Default::default(),
            merged_var_type: Default::default(),
            callee_count: Default::default(),
            infects_to: Default::default(),
            accessed_props: Default::default(),
        }
    }
}

impl VarUsageInfo {
    pub(crate) fn is_infected(&self) -> bool {
        !self.infects_to.is_empty()
    }

    /// The variable itself or a property of it is modified.
    pub(crate) fn mutated(&self) -> bool {
        self.assign_count > 1 || self.property_mutation_count > 0
    }

    pub(crate) fn can_inline_fn_once(&self) -> bool {
        (self.callee_count > 0
            || !self
                .flags
                .contains(VarUsageInfoFlags::EXECUTED_MULTIPLE_TIME)
                && (self.flags.contains(VarUsageInfoFlags::IS_FN_LOCAL)
                    || !self.flags.contains(VarUsageInfoFlags::USED_IN_NON_CHILD_FN)))
            && !self.flags.contains(VarUsageInfoFlags::USED_AS_JSX_CALLEE)
            && !(self.flags.contains(
                VarUsageInfoFlags::USED_RECURSIVELY.union(VarUsageInfoFlags::HAS_PROPERTY_ACCESS),
            ) && self.property_mutation_count != 0)
    }

    fn initialized(&self) -> bool {
        self.flags.intersects(
            VarUsageInfoFlags::VAR_INITIALIZED
                .union(VarUsageInfoFlags::DECLARED_AS_FN_PARAM)
                .union(VarUsageInfoFlags::DECLARED_AS_CATCH_PARAM),
        )
    }
}

impl Storage for ProgramData {
    type ScopeData = ScopeData;
    type VarData = VarUsageInfo;

    fn new_child(&mut self) -> Self {
        let scopes = std::mem::take(&mut self.scopes);
        let property_atoms = std::mem::take(&mut self.property_atoms);
        let fn_decls = std::mem::take(&mut self.fn_decls);
        Self {
            scopes,
            property_atoms,
            fn_decls,
            ..Default::default()
        }
    }

    fn scope(&mut self, ctxt: swc_common::SyntaxContext) -> &mut Self::ScopeData {
        let ctxt = ctxt.as_u32() as usize;
        if self.scopes.len() <= ctxt {
            self.scopes.resize(ctxt + 1, ScopeData::default());
        }
        &mut self.scopes[ctxt]
    }

    fn scopes(&self) -> &[ScopeData] {
        &self.scopes
    }

    fn top_scope(&mut self) -> &mut Self::ScopeData {
        &mut self.top
    }

    fn var_or_default(&mut self, id: Id) -> &mut Self::VarData {
        self.vars.entry(id).or_default()
    }

    fn merge(&mut self, kind: ScopeKind, child: Self) {
        // Take the data back
        // Corresponding to [Self::new_child]
        self.scopes = child.scopes;
        self.property_atoms = child.property_atoms;
        self.fn_decls = child.fn_decls;

        self.vars.reserve(child.vars.len());
        for (id, mut var_info) in child.vars {
            // trace!("merge({:?},{}{:?})", kind, id.0, id.1);
            let inited = self.initialized_vars.contains(&id);
            match self.vars.entry(id) {
                Entry::Occupied(mut e) => {
                    if var_info.flags.contains(VarUsageInfoFlags::INLINE_PREVENTED) {
                        e.get_mut()
                            .flags
                            .insert(VarUsageInfoFlags::INLINE_PREVENTED);
                    }
                    let var_assigned = var_info.assign_count > 0
                        || (var_info.flags.contains(VarUsageInfoFlags::VAR_INITIALIZED)
                            && !e.get().flags.contains(VarUsageInfoFlags::VAR_INITIALIZED));

                    if var_info.assign_count > 0 {
                        if e.get().initialized() {
                            e.get_mut().flags.insert(VarUsageInfoFlags::REASSIGNED);
                        }
                    }

                    if var_info.flags.contains(VarUsageInfoFlags::VAR_INITIALIZED) {
                        // If it is inited in some other child scope and also inited in current
                        // scope
                        if e.get().flags.contains(VarUsageInfoFlags::VAR_INITIALIZED)
                            || e.get().ref_count > 0
                        {
                            e.get_mut().flags.insert(VarUsageInfoFlags::REASSIGNED);
                        } else {
                            // If it is referred outside child scope, it will
                            // be marked as var_initialized false
                            e.get_mut().flags.insert(VarUsageInfoFlags::VAR_INITIALIZED);
                        }
                    } else {
                        // If it is inited in some other child scope, but referenced in
                        // current child scope
                        if !inited
                            && e.get().flags.contains(VarUsageInfoFlags::VAR_INITIALIZED)
                            && var_info.ref_count > 0
                        {
                            e.get_mut().flags.remove(VarUsageInfoFlags::VAR_INITIALIZED);
                            e.get_mut().flags.insert(VarUsageInfoFlags::REASSIGNED);
                        }
                    }

                    e.get_mut().merged_var_type.merge(var_info.merged_var_type);

                    e.get_mut().ref_count += var_info.ref_count;
                    e.get_mut().property_mutation_count |= var_info.property_mutation_count;
                    e.get_mut().declared_count += var_info.declared_count;
                    e.get_mut().assign_count += var_info.assign_count;
                    e.get_mut().usage_count += var_info.usage_count;
                    e.get_mut().infects_to.extend(var_info.infects_to);
                    e.get_mut().callee_count += var_info.callee_count;

                    for (k, v) in var_info.accessed_props {
                        *e.get_mut().accessed_props.entry(k).or_default() += v;
                    }

                    let var_info_flags = var_info.flags;
                    let e_flags = &mut e.get_mut().flags;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::REASSIGNED;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::HAS_PROPERTY_ACCESS;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::EXPORTED;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::DECLARED;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::DECLARED_AS_FN_PARAM;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::DECLARED_AS_FN_DECL;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::DECLARED_AS_FN_EXPR;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::DECLARED_AS_CATCH_PARAM;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::EXECUTED_MULTIPLE_TIME;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::USED_IN_COND;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::USED_AS_ARG;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::USED_AS_REF;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::INDEXED_WITH_DYNAMIC_KEY;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::PURE_FN;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::USED_RECURSIVELY;
                    *e_flags |= var_info_flags & VarUsageInfoFlags::USED_IN_NON_CHILD_FN;

                    // If a var is registered at a parent scope, it means that it's delcared before
                    // usages.
                    //
                    // e.get_mut().used_above_decl |= var_info.used_above_decl;

                    if !var_info_flags.contains(VarUsageInfoFlags::NO_SIDE_EFFECT_FOR_MEMBER_ACCESS)
                    {
                        e_flags.remove(VarUsageInfoFlags::NO_SIDE_EFFECT_FOR_MEMBER_ACCESS);
                    }
                    if !var_info_flags.contains(VarUsageInfoFlags::IS_FN_LOCAL) {
                        e_flags.remove(VarUsageInfoFlags::IS_FN_LOCAL);
                    }
                    if !var_info_flags.contains(VarUsageInfoFlags::ASSIGNED_FN_LOCAL) {
                        e_flags.remove(VarUsageInfoFlags::ASSIGNED_FN_LOCAL);
                    }

                    match kind {
                        ScopeKind::Fn => {
                            e_flags.remove(VarUsageInfoFlags::IS_FN_LOCAL);
                            if !var_info_flags.contains(VarUsageInfoFlags::USED_RECURSIVELY) {
                                e_flags.insert(VarUsageInfoFlags::USED_IN_NON_CHILD_FN);
                            }
                            if var_assigned {
                                e_flags.remove(VarUsageInfoFlags::ASSIGNED_FN_LOCAL);
                            }
                        }
                        ScopeKind::Block => {
                            if e_flags.contains(VarUsageInfoFlags::USED_IN_NON_CHILD_FN) {
                                e_flags.remove(VarUsageInfoFlags::IS_FN_LOCAL);
                                e_flags.insert(VarUsageInfoFlags::USED_IN_NON_CHILD_FN);
                            }
                        }
                    }
                }
                Entry::Vacant(e) => {
                    match kind {
                        ScopeKind::Fn => {
                            if !var_info.flags.contains(VarUsageInfoFlags::USED_RECURSIVELY) {
                                var_info
                                    .flags
                                    .insert(VarUsageInfoFlags::USED_IN_NON_CHILD_FN);
                            }
                        }
                        ScopeKind::Block => {}
                    }
                    e.insert(var_info);
                }
            }
        }
    }

    fn report_usage(&mut self, ctx: Ctx, i: Id) {
        let inited = self.initialized_vars.contains(&i);

        let e = self.vars.entry(i).or_insert_with(|| {
            let mut default = VarUsageInfo::default();
            default.flags.insert(VarUsageInfoFlags::USED_ABOVE_DECL);
            Box::new(default)
        });

        if ctx.is_id_ref() {
            e.flags.insert(VarUsageInfoFlags::USED_AS_REF);
        }
        e.ref_count += 1;
        e.usage_count += 1;
        // If it is inited in some child scope, but referenced in current scope
        if !inited && e.flags.contains(VarUsageInfoFlags::VAR_INITIALIZED) {
            e.flags.insert(VarUsageInfoFlags::REASSIGNED);
            e.flags.remove(VarUsageInfoFlags::VAR_INITIALIZED);
        }
        if ctx.inline_prevented() {
            e.flags.insert(VarUsageInfoFlags::INLINE_PREVENTED);
        }
        if ctx.executed_multiple_time() {
            e.flags.insert(VarUsageInfoFlags::EXECUTED_MULTIPLE_TIME);
        }
        if ctx.in_cond() {
            e.flags.insert(VarUsageInfoFlags::USED_IN_COND);
        }
    }

    fn report_assign(&mut self, ctx: Ctx, i: Id, is_op: bool, ty: Value<Type>) {
        let e = self.vars.entry(i.clone()).or_default();

        let inited = self.initialized_vars.contains(&i);

        if e.assign_count > 0 || e.initialized() {
            e.flags.insert(VarUsageInfoFlags::REASSIGNED);
        }

        e.merged_var_type.merge(Some(ty));
        e.assign_count += 1;

        if !is_op {
            self.initialized_vars.insert(i.clone());
            if e.ref_count == 1 && e.var_kind != Some(VarDeclKind::Const) && !inited {
                e.flags.insert(VarUsageInfoFlags::VAR_INITIALIZED);
            } else {
                e.flags.insert(VarUsageInfoFlags::REASSIGNED);
            }

            if e.ref_count == 1 && e.flags.contains(VarUsageInfoFlags::USED_ABOVE_DECL) {
                e.flags.remove(VarUsageInfoFlags::USED_ABOVE_DECL);
            }

            e.usage_count = e.usage_count.saturating_sub(1);
        }

        let mut to_visit: IndexSet<Id, FxBuildHasher> =
            IndexSet::from_iter(e.infects_to.iter().cloned().map(|i| i.0));

        let mut idx = 0;

        while idx < to_visit.len() {
            let curr = &to_visit[idx];

            if let Some(usage) = self.vars.get_mut(curr) {
                if ctx.inline_prevented() {
                    usage.flags.insert(VarUsageInfoFlags::INLINE_PREVENTED);
                }
                if ctx.executed_multiple_time() {
                    usage
                        .flags
                        .insert(VarUsageInfoFlags::EXECUTED_MULTIPLE_TIME);
                }
                if ctx.in_cond() {
                    usage.flags.insert(VarUsageInfoFlags::USED_IN_COND);
                }

                if is_op {
                    usage.usage_count += 1;
                }

                to_visit.extend(usage.infects_to.iter().cloned().map(|i| i.0))
            }

            idx += 1;
        }
    }

    fn declare_decl(
        &mut self,
        ctx: Ctx,
        i: &Ident,
        init_type: Option<Value<Type>>,
        kind: Option<VarDeclKind>,
    ) -> &mut VarUsageInfo {
        // if cfg!(feature = "debug") {
        //     debug!(has_init = has_init, "declare_decl(`{}`)", i);
        // }

        let v = self.vars.entry(i.to_id()).or_default();
        if ctx.is_top_level() {
            v.flags |= VarUsageInfoFlags::IS_TOP_LEVEL;
        }

        // assigned or declared before this declaration
        if init_type.is_some() {
            if v.flags
                .intersects(VarUsageInfoFlags::DECLARED.union(VarUsageInfoFlags::VAR_INITIALIZED))
                || v.assign_count > 0
            {
                #[cfg(feature = "debug")]
                {
                    tracing::trace!("declare_decl(`{}`): Already declared", i);
                }

                v.flags |= VarUsageInfoFlags::REASSIGNED;
            }

            v.assign_count += 1;
        }

        // This is not delcared yet, so this is the first declaration.
        if !v.flags.contains(VarUsageInfoFlags::DECLARED) {
            v.var_kind = kind;
            if ctx.in_decl_with_no_side_effect_for_member_access() {
                v.flags
                    .insert(VarUsageInfoFlags::NO_SIDE_EFFECT_FOR_MEMBER_ACCESS);
            } else {
                v.flags
                    .remove(VarUsageInfoFlags::NO_SIDE_EFFECT_FOR_MEMBER_ACCESS);
            }
        }

        if v.flags.contains(VarUsageInfoFlags::USED_IN_NON_CHILD_FN) {
            v.flags.remove(VarUsageInfoFlags::IS_FN_LOCAL);
        }

        if init_type.is_some() {
            v.flags.insert(VarUsageInfoFlags::VAR_INITIALIZED);
        }

        if ctx.in_pat_of_param() {
            v.merged_var_type = Some(Value::Unknown);
        } else {
            v.merged_var_type.merge(init_type);
        }

        v.declared_count += 1;
        v.flags |= VarUsageInfoFlags::DECLARED;
        // not a VarDecl, thus always inited
        if init_type.is_some() || kind.is_none() {
            self.initialized_vars.insert(i.to_id());
        }
        if ctx.in_catch_param() {
            v.flags |= VarUsageInfoFlags::DECLARED_AS_CATCH_PARAM;
        }

        v
    }

    fn get_initialized_cnt(&self) -> usize {
        self.initialized_vars.len()
    }

    fn truncate_initialized_cnt(&mut self, len: usize) {
        self.initialized_vars.truncate(len)
    }

    fn mark_property_mutation(&mut self, id: Id) {
        let e = self.vars.entry(id).or_default();
        e.property_mutation_count += 1;

        let to_mark_mutate = e
            .infects_to
            .iter()
            .filter(|(_, kind)| *kind == AccessKind::Reference)
            .map(|(id, _)| id.clone())
            .collect::<Vec<_>>();

        for other in to_mark_mutate {
            let other = self.vars.entry(other).or_default();

            other.property_mutation_count += 1;
        }
    }

    fn add_property_atom(&mut self, atom: Wtf8Atom) {
        if let Some(atoms) = self.property_atoms.as_mut() {
            atoms.push(atom);
        }
    }

    fn get_var_data(&self, id: Id) -> Option<&Self::VarData> {
        self.vars.get(&id).map(|v| v.as_ref())
    }

    fn register_fn_decl(&mut self, fn_id: Id, num_params: usize) {
        ProgramData::register_fn_decl(self, fn_id, num_params);
    }

    fn record_call_site(&mut self, fn_id: &Id, args: &[ExprOrSpread]) {
        ProgramData::record_call_site(self, fn_id, args);
    }
}

impl ScopeDataLike for ScopeData {
    fn add_declared_symbol(&mut self, _: &Ident) {}

    fn merge(&mut self, other: Self, _: bool) {
        *self |= other & Self::HAS_WITH_STMT;
        *self |= other & Self::HAS_EVAL_CALL;
        *self |= other & Self::USED_ARGUMENTS;
    }

    fn mark_used_arguments(&mut self) {
        *self |= Self::USED_ARGUMENTS;
    }

    fn mark_eval_called(&mut self) {
        *self |= Self::HAS_EVAL_CALL;
    }

    fn mark_with_stmt(&mut self) {
        *self |= Self::HAS_WITH_STMT;
    }
}

impl VarDataLike for VarUsageInfo {
    fn mark_declared_as_fn_param(&mut self) {
        self.flags.insert(VarUsageInfoFlags::DECLARED_AS_FN_PARAM);
    }

    fn mark_as_lazy_init(&mut self) {
        self.flags.insert(VarUsageInfoFlags::LAZY_INIT);
    }

    fn mark_declared_as_fn_decl(&mut self) {
        self.flags.insert(VarUsageInfoFlags::DECLARED_AS_FN_DECL);
    }

    fn mark_declared_as_fn_expr(&mut self) {
        self.flags.insert(VarUsageInfoFlags::DECLARED_AS_FN_EXPR);
    }

    fn mark_declared_as_for_init(&mut self) {
        self.flags.insert(VarUsageInfoFlags::DECLARED_AS_FOR_INIT);
    }

    fn mark_has_property_access(&mut self) {
        self.flags.insert(VarUsageInfoFlags::HAS_PROPERTY_ACCESS);
    }

    fn mark_used_as_callee(&mut self) {
        self.callee_count += 1;
    }

    fn mark_used_as_arg(&mut self) {
        self.flags.insert(VarUsageInfoFlags::USED_AS_REF);
        self.flags.insert(VarUsageInfoFlags::USED_AS_ARG);
    }

    fn mark_indexed_with_dynamic_key(&mut self) {
        self.flags
            .insert(VarUsageInfoFlags::INDEXED_WITH_DYNAMIC_KEY);
    }

    fn add_accessed_property(&mut self, name: swc_atoms::Wtf8Atom) {
        *self.accessed_props.entry(name).or_default() += 1;
    }

    fn mark_used_as_ref(&mut self) {
        self.flags.insert(VarUsageInfoFlags::USED_AS_REF);
    }

    fn add_infects_to(&mut self, other: Access) {
        self.infects_to.push(other);
    }

    fn prevent_inline(&mut self) {
        self.flags.insert(VarUsageInfoFlags::INLINE_PREVENTED);
    }

    fn mark_as_exported(&mut self) {
        self.flags.insert(VarUsageInfoFlags::EXPORTED);
    }

    fn mark_initialized_with_safe_value(&mut self) {
        self.flags
            .insert(VarUsageInfoFlags::NO_SIDE_EFFECT_FOR_MEMBER_ACCESS);
    }

    fn mark_as_pure_fn(&mut self) {
        self.flags.insert(VarUsageInfoFlags::PURE_FN);
    }

    fn mark_used_above_decl(&mut self) {
        self.flags.insert(VarUsageInfoFlags::USED_ABOVE_DECL);
    }

    fn mark_used_recursively(&mut self) {
        self.flags.insert(VarUsageInfoFlags::USED_RECURSIVELY);
    }

    fn is_declared(&self) -> bool {
        self.flags.contains(VarUsageInfoFlags::DECLARED)
    }

    fn mark_used_as_jsx_callee(&mut self) {
        self.flags.insert(VarUsageInfoFlags::USED_AS_JSX_CALLEE);
    }
}

impl ProgramData {
    pub(crate) fn get_scope(&self, ctxt: SyntaxContext) -> Option<&ScopeData> {
        let ctxt = ctxt.as_u32() as usize;
        self.scopes.get(ctxt)
    }

    /// Register a function declaration with its parameter identifiers.
    pub(crate) fn register_fn_decl(&mut self, fn_id: Id, num_params: usize) {
        self.fn_decls.insert(
            fn_id,
            FnDeclInfo {
                param_values: vec![ParamInlineValue::default(); num_params],
            },
        );
    }

    /// Record call site arguments for a function.
    pub(crate) fn record_call_site(&mut self, fn_id: &Id, args: &[ExprOrSpread]) {
        if let Some(fn_info) = self.fn_decls.get_mut(fn_id) {
            // Record value for each parameter
            for (idx, param_value) in fn_info.param_values.iter_mut().enumerate() {
                let arg_expr = args.get(idx).map(|a| {
                    // If there's a spread, we can't determine the value
                    if a.spread.is_some() {
                        None
                    } else {
                        Some(&*a.expr)
                    }
                });

                match arg_expr {
                    Some(Some(expr)) => param_value.record_value(Some(expr)),
                    Some(None) => {
                        // Spread argument - mark as mixed
                        *param_value = ParamInlineValue::Mixed;
                    }
                    None => {
                        // Argument not provided - record undefined
                        param_value.record_value(None);
                    }
                }
            }
        }
    }

    /// Get function declaration info
    pub(crate) fn get_fn_decl(&self, fn_id: &Id) -> Option<&FnDeclInfo> {
        self.fn_decls.get(fn_id)
    }

    /// This should be used only for conditionals pass.
    pub(crate) fn contains_unresolved(&self, e: &Expr) -> bool {
        match e {
            Expr::Ident(i) => self.ident_is_unresolved(i),

            Expr::Member(MemberExpr { obj, prop, .. }) => {
                if self.contains_unresolved(obj) {
                    return true;
                }

                if let MemberProp::Computed(prop) = prop {
                    if self.contains_unresolved(&prop.expr) {
                        return true;
                    }
                }

                false
            }
            Expr::Bin(BinExpr { left, right, .. }) => {
                self.contains_unresolved(left) || self.contains_unresolved(right)
            }
            Expr::Unary(UnaryExpr { arg, .. }) => self.contains_unresolved(arg),
            Expr::Update(UpdateExpr { arg, .. }) => self.contains_unresolved(arg),
            Expr::Seq(SeqExpr { exprs, .. }) => exprs.iter().any(|e| self.contains_unresolved(e)),
            Expr::Assign(AssignExpr { left, right, .. }) => {
                // TODO
                (match left {
                    AssignTarget::Simple(left) => {
                        self.simple_assign_target_contains_unresolved(left)
                    }
                    AssignTarget::Pat(_) => false,
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                }) || self.contains_unresolved(right)
            }
            Expr::Cond(CondExpr {
                test, cons, alt, ..
            }) => {
                self.contains_unresolved(test)
                    || self.contains_unresolved(cons)
                    || self.contains_unresolved(alt)
            }
            Expr::New(NewExpr { args, .. }) => args.iter().flatten().any(|arg| match arg.spread {
                Some(..) => self.contains_unresolved(&arg.expr),
                None => false,
            }),
            Expr::Yield(YieldExpr { arg, .. }) => {
                matches!(arg, Some(arg) if self.contains_unresolved(arg))
            }
            Expr::Tpl(Tpl { exprs, .. }) => exprs.iter().any(|e| self.contains_unresolved(e)),
            Expr::Paren(ParenExpr { expr, .. }) => self.contains_unresolved(expr),
            Expr::Await(AwaitExpr { arg, .. }) => self.contains_unresolved(arg),
            Expr::Array(ArrayLit { elems, .. }) => elems.iter().any(|elem| match elem {
                Some(elem) => self.contains_unresolved(&elem.expr),
                None => false,
            }),

            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                args,
                ..
            }) => {
                if self.contains_unresolved(callee) {
                    return true;
                }

                if args.iter().any(|arg| self.contains_unresolved(&arg.expr)) {
                    return true;
                }

                false
            }

            Expr::OptChain(o) => self.opt_chain_expr_contains_unresolved(o),

            _ => false,
        }
    }

    pub(crate) fn ident_is_unresolved(&self, i: &Ident) -> bool {
        // We treat `window` and `global` as resolved
        if is_global_var_with_pure_property_access(&i.sym)
            || matches!(&*i.sym, "arguments" | "window" | "global")
        {
            return false;
        }

        if let Some(v) = self.vars.get(&i.to_id()) {
            return !v.flags.contains(VarUsageInfoFlags::DECLARED);
        }

        true
    }

    fn opt_chain_expr_contains_unresolved(&self, o: &OptChainExpr) -> bool {
        match &*o.base {
            OptChainBase::Member(me) => self.member_expr_contains_unresolved(me),
            OptChainBase::Call(OptCall { callee, args, .. }) => {
                if self.contains_unresolved(callee) {
                    return true;
                }

                if args.iter().any(|arg| self.contains_unresolved(&arg.expr)) {
                    return true;
                }

                false
            }
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    fn member_expr_contains_unresolved(&self, n: &MemberExpr) -> bool {
        if self.contains_unresolved(&n.obj) {
            return true;
        }

        if let MemberProp::Computed(prop) = &n.prop {
            if self.contains_unresolved(&prop.expr) {
                return true;
            }
        }

        false
    }

    fn simple_assign_target_contains_unresolved(&self, n: &SimpleAssignTarget) -> bool {
        match n {
            SimpleAssignTarget::Ident(i) => self.ident_is_unresolved(&i.id),
            SimpleAssignTarget::Member(me) => self.member_expr_contains_unresolved(me),
            SimpleAssignTarget::SuperProp(n) => {
                if let SuperProp::Computed(prop) = &n.prop {
                    if self.contains_unresolved(&prop.expr) {
                        return true;
                    }
                }

                false
            }
            SimpleAssignTarget::Paren(n) => self.contains_unresolved(&n.expr),
            SimpleAssignTarget::OptChain(n) => self.opt_chain_expr_contains_unresolved(n),
            SimpleAssignTarget::TsAs(..)
            | SimpleAssignTarget::TsSatisfies(..)
            | SimpleAssignTarget::TsNonNull(..)
            | SimpleAssignTarget::TsTypeAssertion(..)
            | SimpleAssignTarget::TsInstantiation(..) => false,
            SimpleAssignTarget::Invalid(..) => true,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}
