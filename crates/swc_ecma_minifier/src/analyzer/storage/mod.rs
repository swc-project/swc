use std::sync::Arc;

use swc_atoms::JsWord;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::Id;

use super::{ctx::Ctx, sequential::BaseData, ScopeKind};

pub mod normal;

pub(crate) trait Storage: Sized + Send + Sync {
    type ScopeData: ScopeDataLike;
    type VarData: VarDataLike;

    fn new(base: Arc<BaseData>) -> Self;

    fn get_base(&self) -> Arc<BaseData>;

    fn scope(&mut self, ctxt: SyntaxContext) -> &mut Self::ScopeData;

    fn top_scope(&mut self) -> &mut Self::ScopeData;

    fn var_or_default(&mut self, id: Id) -> &mut Self::VarData;

    fn merge(&mut self, kind: ScopeKind, child: Self);

    /// Merge, but for parallel execution.
    ///
    /// `used_before_decl` should be adjusted
    fn par_merge(&mut self, data: Self);

    fn report_usage(&mut self, ctx: Ctx, i: &Ident, is_assign: bool);

    fn declare_decl(
        &mut self,
        ctx: Ctx,
        i: &Ident,
        has_init: bool,
        kind: Option<VarDeclKind>,
    ) -> &mut Self::VarData;
}

pub(crate) trait ScopeDataLike: Sized + Default + Send + Sync {
    fn merge(&mut self, other: Self);

    fn mark_eval_called(&mut self);

    fn mark_with_stmt(&mut self);
}

pub(crate) trait VarDataLike: Sized + Send + Sync {
    /// See `declared_as_fn_param` of [crate::analyzer::VarUsageInfo].
    fn mark_declared_as_fn_param(&mut self);

    fn mark_declared_as_fn_expr(&mut self);

    fn mark_has_property_access(&mut self);

    fn mark_has_property_mutation(&mut self);

    fn mark_used_as_callee(&mut self);

    fn mark_used_as_arg(&mut self);

    fn add_accessed_property(&mut self, name: JsWord);

    fn mark_mutated(&mut self);
    fn mark_reassigned_with_assign(&mut self);

    fn prevent_inline(&mut self);
}
