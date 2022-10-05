use std::collections::hash_map::Entry;

use swc_common::collections::AHashSet;
use swc_ecma_ast::*;

use super::{ScopeDataLike, Storage, VarDataLike};
use crate::analyzer::{ctx::Ctx, ProgramData, ScopeData, ScopeKind, VarUsageInfo};

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

                    e.get_mut().ref_count += var_info.ref_count;
                    e.get_mut().cond_init |= if !inited && e.get().var_initialized {
                        true
                    } else {
                        var_info.cond_init
                    };

                    e.get_mut().reassigned_with_assignment |= var_info.reassigned_with_assignment;
                    e.get_mut().reassigned_with_var_decl |= var_info.reassigned_with_var_decl;
                    e.get_mut().mutated |= var_info.mutated;

                    e.get_mut().has_property_access |= var_info.has_property_access;
                    e.get_mut().has_property_mutation |= var_info.has_property_mutation;
                    e.get_mut().exported |= var_info.exported;

                    e.get_mut().declared |= var_info.declared;
                    e.get_mut().declared_count += var_info.declared_count;
                    e.get_mut().declared_as_fn_param |= var_info.declared_as_fn_param;
                    e.get_mut().declared_as_fn_expr |= var_info.declared_as_fn_expr;

                    // If a var is registered at a parent scope, it means that it's delcared before
                    // usages.
                    //
                    // e.get_mut().used_above_decl |= var_info.used_above_decl;
                    e.get_mut().executed_multiple_time |= var_info.executed_multiple_time;
                    e.get_mut().used_in_cond |= var_info.used_in_cond;
                    e.get_mut().assign_count += var_info.assign_count;
                    e.get_mut().mutation_by_call_count += var_info.mutation_by_call_count;
                    e.get_mut().usage_count += var_info.usage_count;

                    e.get_mut().declared_as_catch_param |= var_info.declared_as_catch_param;

                    e.get_mut().infects.extend(var_info.infects);

                    e.get_mut().no_side_effect_for_member_access =
                        e.get_mut().no_side_effect_for_member_access
                            && var_info.no_side_effect_for_member_access;

                    e.get_mut().used_as_callee |= var_info.used_as_callee;
                    e.get_mut().used_as_arg |= var_info.used_as_arg;
                    e.get_mut().indexed_with_dynamic_key |= var_info.indexed_with_dynamic_key;

                    e.get_mut().pure_fn |= var_info.pure_fn;

                    e.get_mut().used_recursively |= var_info.used_recursively;

                    e.get_mut().is_fn_local &= var_info.is_fn_local;
                    e.get_mut().used_in_non_child_fn |= var_info.used_in_non_child_fn;

                    if var_info.var_initialized {
                        if e.get().var_initialized || e.get().ref_count > 0 {
                            e.get_mut().assign_count += 1;
                            e.get_mut().reassigned_with_assignment = true;
                        }
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

        let v = self
            .vars
            .entry(i.to_id())
            .and_modify(|v| {
                if has_init && (v.declared || v.var_initialized) {
                    trace_op!("declare_decl(`{}`): Already declared", i);

                    v.mutated = true;
                    v.reassigned_with_var_decl = true;
                    v.assign_count += 1;
                }

                if v.used_in_non_child_fn {
                    v.is_fn_local = false;
                }
            })
            .or_insert_with(|| VarUsageInfo {
                is_fn_local: true,
                var_kind: kind,
                var_initialized: has_init,
                no_side_effect_for_member_access: ctx.in_decl_with_no_side_effect_for_member_access,

                ..Default::default()
            });

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
            if !inited && e.var_initialized {
                e.cond_init = true;
                if !is_modify {
                    e.var_initialized = false;
                    e.assign_count += 1;
                    e.reassigned_with_assignment = true
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
                    e.reassigned_with_assignment = true
                }
            }

            for other in e.infects.clone() {
                self.report(other, ctx, true, dejavu)
            }
        } else {
            if ctx.in_call_arg && ctx.is_exact_arg {
                e.mutation_by_call_count += 1;
            }

            e.usage_count += 1;
        }
    }
}

impl VarDataLike for VarUsageInfo {
    fn mark_declared_as_fn_param(&mut self) {
        self.declared_as_fn_param = true;
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
        self.used_as_callee = true;
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

    fn mark_reassigned_with_assign(&mut self) {
        self.reassigned_with_assignment = true;
    }

    fn add_infects_to(&mut self, other: Id) {
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
