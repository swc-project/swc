use super::{ctx::Ctx, ScopeKind};
use swc_atoms::JsWord;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::Id;

pub mod normal;

pub(crate) trait Storage: Sized + Default {
    type ScopeData: ScopeDataLike;
    type VarData: VarDataLike;

    fn scope(&mut self, ctxt: SyntaxContext) -> &mut Self::ScopeData;

    fn top_scope(&mut self) -> &mut Self::ScopeData;

    fn var_or_default(&mut self, id: Id) -> &mut Self::VarData;

    fn merge(&mut self, kind: ScopeKind, child: Self);

    fn report_usage(&mut self, ctx: Ctx, i: &Ident, is_assign: bool);

    fn declare_decl(
        &mut self,
        ctx: Ctx,
        i: &Ident,
        has_init: bool,
        kind: Option<VarDeclKind>,
    ) -> &mut Self::VarData;
}

pub(crate) trait ScopeDataLike: Sized + Default {
    fn add_declared_symbol(&mut self, id: &Ident);

    fn merge(&mut self, other: Self, is_child: bool);

    fn mark_eval_called(&mut self);

    fn mark_with_stmt(&mut self);
}

pub(crate) trait VarDataLike: Sized {
    /// See `declared_as_fn_param` of [crate::analyzer::VarUsageInfo].
    fn mark_declared_as_fn_param(&mut self);

    fn mark_declared_as_fn_expr(&mut self);

    fn mark_has_property_access(&mut self);

    fn mark_has_property_mutation(&mut self);

    fn mark_used_as_callee(&mut self);

    fn add_accessed_property(&mut self, name: JsWord);

    fn mark_mutated(&mut self);
    fn mark_reassigned(&mut self);

    fn add_infects(&mut self, other: Id);
}
