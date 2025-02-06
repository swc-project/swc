use swc_atoms::JsWord;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::{Type, Value};

use super::{ctx::Ctx, ScopeKind};
use crate::alias::Access;

pub trait Storage: Sized + Default {
    type ScopeData: ScopeDataLike;
    type VarData: VarDataLike;

    fn scope(&mut self, ctxt: SyntaxContext) -> &mut Self::ScopeData;

    fn top_scope(&mut self) -> &mut Self::ScopeData;

    fn var_or_default(&mut self, id: Id) -> &mut Self::VarData;

    fn merge(&mut self, kind: ScopeKind, child: Self);

    fn report_usage(&mut self, ctx: Ctx, i: Id);

    fn report_assign(&mut self, ctx: Ctx, i: Id, is_op: bool, ty: Value<Type>);

    fn declare_decl(
        &mut self,
        ctx: Ctx,
        i: &Ident,
        init_type: Option<Value<Type>>,
        kind: Option<VarDeclKind>,
    ) -> &mut Self::VarData;

    fn get_initialized_cnt(&self) -> usize;
    fn truncate_initialized_cnt(&mut self, len: usize);

    fn mark_property_mutation(&mut self, id: Id);
}

pub trait ScopeDataLike: Sized + Default + Clone {
    fn add_declared_symbol(&mut self, id: &Ident);

    fn merge(&mut self, other: Self, is_child: bool);

    fn mark_used_arguments(&mut self);

    fn mark_eval_called(&mut self);

    fn mark_with_stmt(&mut self);
}

pub trait VarDataLike: Sized {
    /// See `declared_as_fn_param` of [crate::analyzer::VarUsageInfo].
    fn mark_declared_as_fn_param(&mut self);

    fn mark_declared_as_fn_decl(&mut self);

    fn mark_declared_as_fn_expr(&mut self);

    fn mark_declared_as_for_init(&mut self);

    fn mark_has_property_access(&mut self);

    fn mark_used_as_callee(&mut self);

    fn mark_used_as_arg(&mut self);

    fn mark_indexed_with_dynamic_key(&mut self);

    fn add_accessed_property(&mut self, name: JsWord);

    fn mark_used_as_ref(&mut self);

    fn add_infects_to(&mut self, other: Access);

    fn prevent_inline(&mut self);

    fn mark_as_exported(&mut self);

    fn mark_initialized_with_safe_value(&mut self);

    fn mark_as_pure_fn(&mut self);

    fn mark_used_above_decl(&mut self);

    fn mark_used_recursively(&mut self);
}
