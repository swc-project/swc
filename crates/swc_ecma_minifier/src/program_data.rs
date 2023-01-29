use std::{
    collections::{hash_map::Entry, HashSet},
    hash::BuildHasherDefault,
};

use indexmap::IndexSet;
use rustc_hash::{FxHashMap, FxHashSet, FxHasher};
use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::{
    alias::{Access, AccessKind},
    analyzer::{
        analyze_with_storage,
        storage::{ScopeDataLike, Storage, VarDataLike},
        Ctx, ScopeKind, UsageAnalyzer,
    },
    marks::Marks,
};
use swc_ecma_visit::VisitWith;

pub(crate) fn analyze<N>(n: &N, _module_info: &ModuleInfo, marks: Option<Marks>) -> ProgramData
where
    N: VisitWith<UsageAnalyzer<ProgramData>>,
{
    analyze_with_storage::<ProgramData, _>(n, marks)
}

/// Analyzed info of a whole program we are working on.
#[derive(Debug, Default)]
pub(crate) struct ProgramData {
    pub(crate) vars: FxHashMap<Id, VarUsageInfo>,

    pub(crate) top: ScopeData,

    pub(crate) scopes: FxHashMap<SyntaxContext, ScopeData>,

    initialized_vars: IndexSet<Id, ahash::RandomState>,
}

#[derive(Debug, Default, Clone)]
pub(crate) struct ScopeData {
    pub(crate) has_with_stmt: bool,
    pub(crate) has_eval_call: bool,
    pub(crate) used_arguments: bool,
}

#[derive(Debug, Default)]
pub(crate) struct ModuleInfo {
    /// Imported identifiers which should be treated as a black box.
    ///
    /// Imports from `@swc/helpers` are excluded as helpers are not modified by
    /// accessing/calling other modules.
    pub(crate) blackbox_imports: AHashSet<Id>,
}

#[derive(Debug, Clone)]
pub(crate) struct VarUsageInfo {
    pub(crate) inline_prevented: bool,

    /// The number of direct reference to this identifier.
    pub(crate) ref_count: u32,

    /// `false` if it's only used.
    pub(crate) declared: bool,
    pub(crate) declared_count: u32,

    /// `true` if the enclosing function defines this variable as a parameter.
    pub(crate) declared_as_fn_param: bool,

    pub(crate) declared_as_fn_decl: bool,
    pub(crate) declared_as_fn_expr: bool,

    pub(crate) assign_count: u32,
    pub(crate) mutation_by_call_count: u32,

    /// The number of direct and indirect reference to this identifier.
    /// ## Things to note
    ///
    /// - Update is counted as usage, but assign is not
    pub(crate) usage_count: u32,

    /// The variable itself is assigned after reference.
    reassigned: bool,
    /// The variable itself or a property of it is modified.
    pub(crate) mutated: bool,

    pub(crate) has_property_access: bool,
    pub(crate) has_property_mutation: bool,

    pub(crate) exported: bool,
    /// True if used **above** the declaration or in init. (Not eval order).
    pub(crate) used_above_decl: bool,
    /// `true` if it's declared by function parameters or variables declared in
    /// a closest function and used only within it and not used by child
    /// functions.
    pub(crate) is_fn_local: bool,

    pub(crate) executed_multiple_time: bool,
    pub(crate) used_in_cond: bool,

    pub(crate) var_kind: Option<VarDeclKind>,
    pub(crate) var_initialized: bool,

    pub(crate) declared_as_catch_param: bool,

    pub(crate) no_side_effect_for_member_access: bool,

    pub(crate) callee_count: u32,

    pub(crate) used_as_arg: bool,

    pub(crate) indexed_with_dynamic_key: bool,

    pub(crate) pure_fn: bool,

    /// Is the variable declared in top level?
    pub(crate) is_top_level: bool,

    /// `infects_to`. This should be renamed, but it will be done with another
    /// PR. (because it's hard to review)
    infects: Vec<Access>,

    pub(crate) used_in_non_child_fn: bool,
    /// Only **string** properties.
    pub(crate) accessed_props: Box<AHashMap<JsWord, u32>>,

    pub(crate) used_recursively: bool,
}

impl Default for VarUsageInfo {
    fn default() -> Self {
        Self {
            inline_prevented: Default::default(),
            ref_count: Default::default(),
            declared: Default::default(),
            declared_count: Default::default(),
            declared_as_fn_param: Default::default(),
            declared_as_fn_decl: Default::default(),
            declared_as_fn_expr: Default::default(),
            assign_count: Default::default(),
            mutation_by_call_count: Default::default(),
            usage_count: Default::default(),
            reassigned: Default::default(),
            mutated: Default::default(),
            has_property_access: Default::default(),
            has_property_mutation: Default::default(),
            exported: Default::default(),
            used_above_decl: Default::default(),
            is_fn_local: true,
            executed_multiple_time: Default::default(),
            used_in_cond: Default::default(),
            var_kind: Default::default(),
            var_initialized: Default::default(),
            declared_as_catch_param: Default::default(),
            no_side_effect_for_member_access: Default::default(),
            callee_count: Default::default(),
            used_as_arg: Default::default(),
            indexed_with_dynamic_key: Default::default(),
            pure_fn: Default::default(),
            infects: Default::default(),
            used_in_non_child_fn: Default::default(),
            accessed_props: Default::default(),
            used_recursively: Default::default(),
            is_top_level: Default::default(),
        }
    }
}

impl VarUsageInfo {
    pub(crate) fn is_mutated_only_by_one_call(&self) -> bool {
        self.assign_count == 0 && self.mutation_by_call_count == 1
    }

    pub(crate) fn is_infected(&self) -> bool {
        !self.infects.is_empty()
    }

    pub(crate) fn reassigned(&self) -> bool {
        self.reassigned
            || (u32::from(self.var_initialized)
                + u32::from(self.declared_as_catch_param)
                + u32::from(self.declared_as_fn_param)
                + self.assign_count)
                > 1
    }

    pub(crate) fn can_inline_var(&self) -> bool {
        !self.mutated
            || (self.assign_count == 0 && !self.reassigned() && !self.has_property_mutation)
    }

    pub(crate) fn can_inline_fn_once(&self) -> bool {
        self.callee_count > 0
            || !self.executed_multiple_time && (self.is_fn_local || !self.used_in_non_child_fn)
    }
}

impl Storage for ProgramData {
    type ScopeData = ScopeData;
    type VarData = VarUsageInfo;

    fn scope(&mut self, ctxt: swc_common::SyntaxContext) -> &mut Self::ScopeData {
        self.scopes.entry(ctxt).or_default()
    }

    fn top_scope(&mut self) -> &mut Self::ScopeData {
        &mut self.top
    }

    fn var_or_default(&mut self, id: Id) -> &mut Self::VarData {
        self.vars.entry(id).or_default()
    }

    fn merge(&mut self, kind: ScopeKind, child: Self) {
        self.scopes.reserve(child.scopes.len());

        for (ctxt, scope) in child.scopes {
            let to = self.scopes.entry(ctxt).or_default();
            self.top.merge(scope.clone(), true);

            to.merge(scope, false);
        }

        self.vars.reserve(child.vars.len());

        for (id, mut var_info) in child.vars {
            // trace!("merge({:?},{}{:?})", kind, id.0, id.1);
            let inited = self.initialized_vars.contains(&id);
            match self.vars.entry(id.clone()) {
                Entry::Occupied(mut e) => {
                    e.get_mut().inline_prevented |= var_info.inline_prevented;

                    if var_info.var_initialized {
                        if e.get().var_initialized || e.get().ref_count > 0 {
                            e.get_mut().assign_count += 1;
                            e.get_mut().reassigned = true;
                        } else {
                            // If it is referred outside child scope, it will
                            // be marked as var_initialized false
                            e.get_mut().var_initialized = true;
                        }
                    } else {
                        // If it is inited in some other child scope, but referenced in
                        // current child scope
                        if !inited && e.get().var_initialized && var_info.ref_count > 0 {
                            e.get_mut().reassigned = true
                        }
                    }

                    e.get_mut().ref_count += var_info.ref_count;

                    e.get_mut().reassigned |= var_info.reassigned;

                    e.get_mut().mutated |= var_info.mutated;

                    e.get_mut().has_property_access |= var_info.has_property_access;
                    e.get_mut().has_property_mutation |= var_info.has_property_mutation;
                    e.get_mut().exported |= var_info.exported;

                    e.get_mut().declared |= var_info.declared;
                    e.get_mut().declared_count += var_info.declared_count;
                    e.get_mut().declared_as_fn_param |= var_info.declared_as_fn_param;
                    e.get_mut().declared_as_fn_decl |= var_info.declared_as_fn_decl;
                    e.get_mut().declared_as_fn_expr |= var_info.declared_as_fn_expr;
                    e.get_mut().declared_as_catch_param |= var_info.declared_as_catch_param;

                    // If a var is registered at a parent scope, it means that it's delcared before
                    // usages.
                    //
                    // e.get_mut().used_above_decl |= var_info.used_above_decl;
                    e.get_mut().executed_multiple_time |= var_info.executed_multiple_time;
                    e.get_mut().used_in_cond |= var_info.used_in_cond;
                    e.get_mut().assign_count += var_info.assign_count;
                    e.get_mut().mutation_by_call_count += var_info.mutation_by_call_count;
                    e.get_mut().usage_count += var_info.usage_count;

                    e.get_mut().infects.extend(var_info.infects);

                    e.get_mut().no_side_effect_for_member_access =
                        e.get_mut().no_side_effect_for_member_access
                            && var_info.no_side_effect_for_member_access;

                    e.get_mut().callee_count += var_info.callee_count;
                    e.get_mut().used_as_arg |= var_info.used_as_arg;
                    e.get_mut().indexed_with_dynamic_key |= var_info.indexed_with_dynamic_key;

                    e.get_mut().pure_fn |= var_info.pure_fn;

                    e.get_mut().used_recursively |= var_info.used_recursively;

                    e.get_mut().is_fn_local &= var_info.is_fn_local;
                    e.get_mut().used_in_non_child_fn |= var_info.used_in_non_child_fn;

                    for (k, v) in *var_info.accessed_props {
                        *e.get_mut().accessed_props.entry(k).or_default() += v;
                    }

                    match kind {
                        ScopeKind::Fn => {
                            e.get_mut().is_fn_local = false;
                            if !var_info.used_recursively {
                                e.get_mut().used_in_non_child_fn = true
                            }
                        }
                        ScopeKind::Block => {
                            if var_info.used_in_non_child_fn {
                                e.get_mut().is_fn_local = false;
                                e.get_mut().used_in_non_child_fn = true;
                            }
                        }
                    }
                }
                Entry::Vacant(e) => {
                    match kind {
                        ScopeKind::Fn => {
                            if !var_info.used_recursively {
                                var_info.used_in_non_child_fn = true
                            }
                        }
                        ScopeKind::Block => {}
                    }
                    e.insert(var_info);
                }
            }
        }
    }

    fn report_usage(&mut self, ctx: Ctx, i: &Ident, is_assign: bool) {
        self.report(i.to_id(), ctx, is_assign, &mut Default::default());
    }

    fn declare_decl(
        &mut self,
        ctx: Ctx,
        i: &Ident,
        has_init: bool,
        kind: Option<VarDeclKind>,
    ) -> &mut VarUsageInfo {
        // if cfg!(feature = "debug") {
        //     debug!(has_init = has_init, "declare_decl(`{}`)", i);
        // }

        let v = self.vars.entry(i.to_id()).or_default();
        v.is_top_level |= ctx.is_top_level;

        if has_init && (v.declared || v.var_initialized) {
            #[cfg(feature = "debug")]
            {
                tracing::trace!("declare_decl(`{}`): Already declared", i);
            }

            v.mutated = true;
            v.reassigned = true;
            v.assign_count += 1;
        }

        // This is not delcared yet, so this is the first declaration.
        if !v.declared {
            v.var_kind = kind;
            v.no_side_effect_for_member_access = ctx.in_decl_with_no_side_effect_for_member_access;
        }

        if v.used_in_non_child_fn {
            v.is_fn_local = false;
        }

        v.var_initialized |= has_init;

        v.declared_count += 1;
        v.declared = true;
        // not a VarDecl, thus always inited
        if has_init || kind.is_none() {
            self.initialized_vars.insert(i.to_id());
        }
        v.declared_as_catch_param |= ctx.in_catch_param;

        v
    }

    fn get_initialized_cnt(&self) -> usize {
        self.initialized_vars.len()
    }

    fn truncate_initialized_cnt(&mut self, len: usize) {
        self.initialized_vars.truncate(len)
    }
}

impl ScopeDataLike for ScopeData {
    fn add_declared_symbol(&mut self, _: &Ident) {}

    fn merge(&mut self, other: Self, _: bool) {
        self.has_with_stmt |= other.has_with_stmt;
        self.has_eval_call |= other.has_eval_call;
        self.used_arguments |= other.used_arguments;
    }

    fn mark_used_arguments(&mut self) {
        self.used_arguments = true;
    }

    fn mark_eval_called(&mut self) {
        self.has_eval_call = true;
    }

    fn mark_with_stmt(&mut self) {
        self.has_with_stmt = true;
    }
}

impl VarDataLike for VarUsageInfo {
    fn mark_declared_as_fn_param(&mut self) {
        self.declared_as_fn_param = true;
    }

    fn mark_declared_as_fn_decl(&mut self) {
        self.declared_as_fn_decl = true;
    }

    fn mark_declared_as_fn_expr(&mut self) {
        self.declared_as_fn_expr = true;
    }

    fn mark_has_property_access(&mut self) {
        self.has_property_access = true;
    }

    fn mark_has_property_mutation(&mut self) {
        self.has_property_mutation = true;
    }

    fn mark_used_as_callee(&mut self) {
        self.callee_count += 1;
    }

    fn mark_used_as_arg(&mut self) {
        self.used_as_arg = true
    }

    fn mark_indexed_with_dynamic_key(&mut self) {
        self.indexed_with_dynamic_key = true;
    }

    fn add_accessed_property(&mut self, name: swc_atoms::JsWord) {
        *self.accessed_props.entry(name).or_default() += 1;
    }

    fn mark_mutated(&mut self) {
        self.mutated = true;
    }

    fn mark_reassigned(&mut self) {
        self.reassigned = true;
    }

    fn add_infects_to(&mut self, other: Access) {
        self.infects.push(other);
    }

    fn prevent_inline(&mut self) {
        self.inline_prevented = true;
    }

    fn mark_initialized_with_safe_value(&mut self) {
        self.no_side_effect_for_member_access = true;
    }

    fn mark_as_pure_fn(&mut self) {
        self.pure_fn = true;
    }

    fn mark_used_above_decl(&mut self) {
        self.used_above_decl = true;
    }

    fn mark_used_recursively(&mut self) {
        self.used_recursively = true;
    }
}

impl ProgramData {
    pub(crate) fn expand_infected(
        &self,
        module_info: &ModuleInfo,
        ids: FxHashSet<Access>,
        max_num: usize,
    ) -> Option<FxHashSet<Access>> {
        let init =
            HashSet::with_capacity_and_hasher(max_num, BuildHasherDefault::<FxHasher>::default());
        ids.into_iter()
            .try_fold(init, |mut res, id| {
                let mut ids = Vec::with_capacity(max_num);
                ids.push(id);
                let mut ranges = vec![0..1usize];
                loop {
                    let range = ranges.remove(0);
                    for index in range {
                        let iid = ids.get(index).unwrap();

                        // Abort on imported variables, because we can't analyze them
                        if module_info.blackbox_imports.contains(&iid.0) {
                            return Err(());
                        }
                        if !res.insert(iid.clone()) {
                            continue;
                        }
                        if res.len() >= max_num {
                            return Err(());
                        }
                        if let Some(info) = self.vars.get(&iid.0) {
                            let infects = &info.infects;
                            if !infects.is_empty() {
                                let old_len = ids.len();

                                // This is not a call, so effects from call can be skipped
                                let can_skip_non_call = matches!(iid.1, AccessKind::Reference)
                                    || (info.declared_count == 1
                                        && info.declared_as_fn_decl
                                        && !info.reassigned());

                                if can_skip_non_call {
                                    ids.extend(
                                        infects
                                            .iter()
                                            .filter(|(_, kind)| *kind != AccessKind::Call)
                                            .cloned(),
                                    );
                                } else {
                                    ids.extend_from_slice(infects.as_slice());
                                }
                                let new_len = ids.len();
                                ranges.push(old_len..new_len);
                            }
                        }
                    }
                    if ranges.is_empty() {
                        break;
                    }
                }
                Ok(res)
            })
            .ok()
    }

    pub(crate) fn contains_unresolved(&self, e: &Expr) -> bool {
        match e {
            Expr::Ident(i) => {
                if let Some(v) = self.vars.get(&i.to_id()) {
                    return !v.declared;
                }

                true
            }

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

            _ => false,
        }
    }
}

impl ProgramData {
    fn report(&mut self, i: Id, ctx: Ctx, is_modify: bool, dejavu: &mut AHashSet<Id>) {
        // trace!("report({}{:?})", i.0, i.1);

        let is_first = dejavu.is_empty();

        if !dejavu.insert(i.clone()) {
            return;
        }

        let inited = self.initialized_vars.contains(&i);

        let e = self.vars.entry(i.clone()).or_insert_with(|| {
            // trace!("insert({}{:?})", i.0, i.1);

            let simple_assign = ctx.is_exact_reassignment && !ctx.is_op_assign;

            VarUsageInfo {
                is_fn_local: true,
                used_above_decl: !simple_assign,
                ..Default::default()
            }
        });

        e.inline_prevented |= ctx.inline_prevented;

        if is_first {
            e.ref_count += 1;
            // If it is inited in some child scope, but referenced in current scope
            if !inited && e.var_initialized {
                e.reassigned = true;
                if !is_modify {
                    e.var_initialized = false;
                    e.assign_count += 1;
                }
            }
        }

        // Passing object as a argument is possibly modification.
        e.mutated |= is_modify || (ctx.in_call_arg && ctx.is_exact_arg);
        e.executed_multiple_time |= ctx.executed_multiple_time;
        e.used_in_cond |= ctx.in_cond;

        if is_modify && ctx.is_exact_reassignment {
            if is_first {
                e.assign_count += 1;
            }

            if ctx.is_op_assign {
                e.usage_count += 1;
            } else if is_first {
                if e.ref_count == 1
                    && ctx.in_assign_lhs
                    && e.var_kind != Some(VarDeclKind::Const)
                    && !inited
                {
                    self.initialized_vars.insert(i);
                    e.assign_count -= 1;
                    e.var_initialized = true;
                } else {
                    e.reassigned = true
                }
            }

            for other in e.infects.clone() {
                self.report(other.0, ctx, true, dejavu)
            }
        } else {
            if ctx.in_call_arg && ctx.is_exact_arg {
                e.mutation_by_call_count += 1;
            }

            e.usage_count += 1;
        }
    }
}
