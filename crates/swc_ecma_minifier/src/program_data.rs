use std::collections::hash_map::Entry;

use indexmap::IndexSet;
use rustc_hash::FxHashMap;
use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, ARandomState},
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
    util::is_global_var_with_pure_property_access,
};
use swc_ecma_utils::{Merge, Type, Value};
use swc_ecma_visit::VisitWith;

pub(crate) fn analyze<N>(n: &N, marks: Option<Marks>) -> ProgramData
where
    N: VisitWith<UsageAnalyzer<ProgramData>>,
{
    analyze_with_storage::<ProgramData, _>(n, marks)
}

/// Analyzed info of a whole program we are working on.
#[derive(Debug, Default)]
pub(crate) struct ProgramData {
    pub(crate) vars: FxHashMap<Id, Box<VarUsageInfo>>,

    pub(crate) top: ScopeData,

    pub(crate) scopes: FxHashMap<SyntaxContext, ScopeData>,

    initialized_vars: IndexSet<Id, ARandomState>,
}

#[derive(Debug, Default, Clone)]
pub(crate) struct ScopeData {
    pub(crate) has_with_stmt: bool,
    pub(crate) has_eval_call: bool,
    pub(crate) used_arguments: bool,
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

    pub(crate) declared_as_for_init: bool,

    /// The number of assign and initialization to this identifier.
    pub(crate) assign_count: u32,

    /// The number of direct and indirect reference to this identifier.
    /// ## Things to note
    ///
    /// - Update is counted as usage, but assign is not
    pub(crate) usage_count: u32,

    /// The variable itself is assigned after reference.
    pub(crate) reassigned: bool,

    pub(crate) has_property_access: bool,
    pub(crate) property_mutation_count: u32,

    pub(crate) exported: bool,
    /// True if used **above** the declaration or in init. (Not eval order).
    pub(crate) used_above_decl: bool,
    /// `true` if it's declared by function parameters or variables declared in
    /// a closest function and used only within it and not used by child
    /// functions.
    pub(crate) is_fn_local: bool,

    used_in_non_child_fn: bool,

    /// `true` if all its assign happens in the same function scope it's defined
    pub(crate) assigned_fn_local: bool,

    pub(crate) executed_multiple_time: bool,
    pub(crate) used_in_cond: bool,

    pub(crate) var_kind: Option<VarDeclKind>,
    pub(crate) var_initialized: bool,
    pub(crate) merged_var_type: Option<Value<Type>>,

    pub(crate) declared_as_catch_param: bool,

    pub(crate) no_side_effect_for_member_access: bool,

    pub(crate) callee_count: u32,

    /// `a` in `foo(a)` or `foo({ a })`.
    pub(crate) used_as_ref: bool,

    pub(crate) used_as_arg: bool,

    pub(crate) indexed_with_dynamic_key: bool,

    pub(crate) pure_fn: bool,

    /// Is the variable declared in top level?
    pub(crate) is_top_level: bool,

    /// `infects_to`. This should be renamed, but it will be done with another
    /// PR. (because it's hard to review)
    infects_to: Vec<Access>,
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
            declared_as_for_init: Default::default(),
            assign_count: Default::default(),
            usage_count: Default::default(),
            reassigned: Default::default(),
            has_property_access: Default::default(),
            property_mutation_count: Default::default(),
            exported: Default::default(),
            used_above_decl: Default::default(),
            is_fn_local: true,
            executed_multiple_time: Default::default(),
            used_in_cond: Default::default(),
            var_kind: Default::default(),
            var_initialized: Default::default(),
            merged_var_type: Default::default(),
            declared_as_catch_param: Default::default(),
            no_side_effect_for_member_access: Default::default(),
            callee_count: Default::default(),
            used_as_arg: Default::default(),
            indexed_with_dynamic_key: Default::default(),
            pure_fn: Default::default(),
            infects_to: Default::default(),
            used_in_non_child_fn: Default::default(),
            accessed_props: Default::default(),
            used_recursively: Default::default(),
            is_top_level: Default::default(),
            assigned_fn_local: true,
            used_as_ref: false,
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
        self.callee_count > 0
            || !self.executed_multiple_time && (self.is_fn_local || !self.used_in_non_child_fn)
    }

    fn initialized(&self) -> bool {
        self.var_initialized || self.declared_as_fn_param || self.declared_as_catch_param
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
                    let var_assigned = var_info.assign_count > 0
                        || (var_info.var_initialized && !e.get().var_initialized);

                    if var_info.assign_count > 0 {
                        if e.get().initialized() {
                            e.get_mut().reassigned = true
                        }
                    }

                    if var_info.var_initialized {
                        // If it is inited in some other child scope and also inited in current
                        // scope
                        if e.get().var_initialized || e.get().ref_count > 0 {
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
                            e.get_mut().var_initialized = false;
                            e.get_mut().reassigned = true
                        }
                    }

                    e.get_mut().merged_var_type.merge(var_info.merged_var_type);

                    e.get_mut().ref_count += var_info.ref_count;

                    e.get_mut().reassigned |= var_info.reassigned;

                    e.get_mut().has_property_access |= var_info.has_property_access;
                    e.get_mut().property_mutation_count |= var_info.property_mutation_count;
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
                    e.get_mut().usage_count += var_info.usage_count;

                    e.get_mut().infects_to.extend(var_info.infects_to);

                    e.get_mut().no_side_effect_for_member_access =
                        e.get_mut().no_side_effect_for_member_access
                            && var_info.no_side_effect_for_member_access;

                    e.get_mut().callee_count += var_info.callee_count;
                    e.get_mut().used_as_arg |= var_info.used_as_arg;
                    e.get_mut().used_as_ref |= var_info.used_as_ref;
                    e.get_mut().indexed_with_dynamic_key |= var_info.indexed_with_dynamic_key;

                    e.get_mut().pure_fn |= var_info.pure_fn;

                    e.get_mut().used_recursively |= var_info.used_recursively;

                    e.get_mut().is_fn_local &= var_info.is_fn_local;
                    e.get_mut().used_in_non_child_fn |= var_info.used_in_non_child_fn;

                    e.get_mut().assigned_fn_local &= var_info.assigned_fn_local;

                    for (k, v) in *var_info.accessed_props {
                        *e.get_mut().accessed_props.entry(k).or_default() += v;
                    }

                    match kind {
                        ScopeKind::Fn => {
                            e.get_mut().is_fn_local = false;
                            if !var_info.used_recursively {
                                e.get_mut().used_in_non_child_fn = true
                            }

                            if var_assigned {
                                e.get_mut().assigned_fn_local = false
                            }
                        }
                        ScopeKind::Block => {
                            if e.get().used_in_non_child_fn {
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

    fn report_usage(&mut self, ctx: Ctx, i: Id) {
        let inited = self.initialized_vars.contains(&i);

        let e = self.vars.entry(i.clone()).or_insert_with(|| {
            Box::new(VarUsageInfo {
                used_above_decl: true,
                ..Default::default()
            })
        });

        e.used_as_ref |= ctx.is_id_ref;
        e.ref_count += 1;
        e.usage_count += 1;
        // If it is inited in some child scope, but referenced in current scope
        if !inited && e.var_initialized {
            e.reassigned = true;
            e.var_initialized = false;
        }

        e.inline_prevented |= ctx.inline_prevented;
        e.executed_multiple_time |= ctx.executed_multiple_time;
        e.used_in_cond |= ctx.in_cond;
    }

    fn report_assign(&mut self, ctx: Ctx, i: Id, is_op: bool, ty: Value<Type>) {
        let e = self.vars.entry(i.clone()).or_default();

        let inited = self.initialized_vars.contains(&i);

        if e.assign_count > 0 || e.initialized() {
            e.reassigned = true
        }

        e.merged_var_type.merge(Some(ty));
        e.assign_count += 1;

        if !is_op {
            self.initialized_vars.insert(i.clone());
            if e.ref_count == 1 && e.var_kind != Some(VarDeclKind::Const) && !inited {
                e.var_initialized = true;
            } else {
                e.reassigned = true;
            }

            if e.ref_count == 1 && e.used_above_decl {
                e.used_above_decl = false;
            }

            e.usage_count = e.usage_count.saturating_sub(1);
        }

        let mut to_visit: IndexSet<Id, ARandomState> =
            IndexSet::from_iter(e.infects_to.clone().into_iter().map(|i| i.0));

        let mut idx = 0;

        while idx < to_visit.len() {
            let curr = &to_visit[idx];

            if let Some(usage) = self.vars.get_mut(curr) {
                usage.inline_prevented |= ctx.inline_prevented;
                usage.executed_multiple_time |= ctx.executed_multiple_time;
                usage.used_in_cond |= ctx.in_cond;

                if is_op {
                    usage.usage_count += 1;
                }

                to_visit.extend(usage.infects_to.clone().into_iter().map(|i| i.0))
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
        v.is_top_level |= ctx.is_top_level;

        // assigned or declared before this declaration
        if init_type.is_some() {
            if v.declared || v.var_initialized || v.assign_count > 0 {
                #[cfg(feature = "debug")]
                {
                    tracing::trace!("declare_decl(`{}`): Already declared", i);
                }

                v.reassigned = true;
            }

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

        v.var_initialized |= init_type.is_some();
        v.merged_var_type.merge(init_type);

        v.declared_count += 1;
        v.declared = true;
        // not a VarDecl, thus always inited
        if init_type.is_some() || kind.is_none() {
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

    fn mark_property_mutation(&mut self, id: Id) {
        let e = self.vars.entry(id).or_default();
        e.property_mutation_count += 1;

        let mut to_mark_mutate = Vec::new();
        for (other, kind) in &e.infects_to {
            if *kind == AccessKind::Reference {
                to_mark_mutate.push(other.clone())
            }
        }

        for other in to_mark_mutate {
            let other = self.vars.entry(other).or_default();

            other.property_mutation_count += 1;
        }
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

    fn mark_declared_as_for_init(&mut self) {
        self.declared_as_for_init = true;
    }

    fn mark_has_property_access(&mut self) {
        self.has_property_access = true;
    }

    fn mark_used_as_callee(&mut self) {
        self.callee_count += 1;
    }

    fn mark_used_as_arg(&mut self) {
        self.used_as_ref = true;
        self.used_as_arg = true
    }

    fn mark_indexed_with_dynamic_key(&mut self) {
        self.indexed_with_dynamic_key = true;
    }

    fn add_accessed_property(&mut self, name: swc_atoms::JsWord) {
        *self.accessed_props.entry(name).or_default() += 1;
    }

    fn mark_used_as_ref(&mut self) {
        self.used_as_ref = true;
    }

    fn add_infects_to(&mut self, other: Access) {
        self.infects_to.push(other);
    }

    fn prevent_inline(&mut self) {
        self.inline_prevented = true;
    }

    fn mark_as_exported(&mut self) {
        self.exported = true;
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
    /// This should be used only for conditionals pass.
    pub(crate) fn contains_unresolved(&self, e: &Expr) -> bool {
        match e {
            Expr::Ident(i) => {
                // We treat `window` and `global` as resolved
                if is_global_var_with_pure_property_access(&i.sym)
                    || matches!(&*i.sym, "arguments" | "window" | "global")
                {
                    return false;
                }

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
            SimpleAssignTarget::Ident(i) => {
                if is_global_var_with_pure_property_access(&i.sym) {
                    return false;
                }

                if let Some(v) = self.vars.get(&i.to_id()) {
                    return !v.declared;
                }

                true
            }
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
        }
    }
}
