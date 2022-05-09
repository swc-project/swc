use std::collections::hash_map::Entry;

use swc_common::collections::AHashSet;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};

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
        for (ctxt, scope) in child.scopes {
            let to = self.scopes.entry(ctxt).or_default();
            self.top.merge(scope.clone(), true);

            to.merge(scope, false);
        }

        for (id, mut var_info) in child.vars {
            // trace!("merge({:?},{}{:?})", kind, id.0, id.1);
            match self.vars.entry(id) {
                Entry::Occupied(mut e) => {
                    e.get_mut().inline_prevented |= var_info.inline_prevented;

                    e.get_mut().ref_count += var_info.ref_count;
                    e.get_mut().cond_init |= var_info.cond_init;

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

                    e.get_mut().pure_fn |= var_info.pure_fn;

                    if !var_info.is_fn_local {
                        e.get_mut().is_fn_local = false;
                    }

                    match kind {
                        ScopeKind::Fn => {
                            e.get_mut().is_fn_local = false;
                            e.get_mut().used_by_nested_fn = true;
                        }
                        ScopeKind::Block => {
                            if var_info.used_by_nested_fn {
                                e.get_mut().is_fn_local = false;
                                e.get_mut().used_by_nested_fn = true;
                            }
                        }
                    }
                }
                Entry::Vacant(e) => {
                    match kind {
                        ScopeKind::Fn => {
                            var_info.used_by_nested_fn = true;
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
                if has_init && v.declared {
                    trace_op!("declare_decl(`{}`): Already declared", i);

                    v.mutated = true;
                    v.reassigned_with_var_decl = true;
                    v.assign_count += 1;
                }

                if v.used_by_nested_fn {
                    v.is_fn_local = false;
                }
            })
            .or_insert_with(|| VarUsageInfo {
                is_fn_local: true,
                var_kind: kind,
                var_initialized: has_init,
                no_side_effect_for_member_access: ctx
                    .in_var_decl_with_no_side_effect_for_member_access,

                ..Default::default()
            });

        v.declared_count += 1;
        v.declared = true;
        if ctx.in_cond && has_init {
            v.cond_init = true;
        }
        v.declared_as_catch_param |= ctx.in_catch_param;

        v
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

        let e = self.vars.entry(i).or_insert_with(|| {
            // trace!("insert({}{:?})", i.0, i.1);

            VarUsageInfo {
                is_fn_local: true,
                used_above_decl: true,
                ..Default::default()
            }
        });

        e.inline_prevented |= ctx.inline_prevented;

        if is_first {
            e.ref_count += 1;
        }
        e.reassigned_with_assignment |= is_first && is_modify && ctx.is_exact_reassignment;
        // Passing object as a argument is possibly modification.
        e.mutated |= is_modify || (ctx.in_call_arg && ctx.is_exact_arg);
        e.executed_multiple_time |= ctx.executed_multiple_time;
        e.used_in_cond |= ctx.in_cond;

        if is_modify && ctx.is_exact_reassignment {
            e.assign_count += 1;

            if ctx.is_op_assign {
                e.usage_count += 1;
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

    fn add_accessed_property(&mut self, name: swc_atoms::JsWord) {
        self.accessed_props.insert(name);
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
}
