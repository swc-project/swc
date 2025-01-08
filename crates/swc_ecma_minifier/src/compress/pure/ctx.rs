use std::ops::{Deref, DerefMut};

use super::Pure;

#[derive(Default, Clone, Copy)]
pub(super) struct Ctx {
    pub in_delete: bool,

    /// `true` if we are in `arg` of `++arg` or `--arg`.
    pub is_update_arg: bool,

    #[allow(unused)]
    pub is_callee: bool,

    pub _in_try_block: bool,

    pub is_lhs_of_assign: bool,

    /// `true` if we are in topmost expression of a statement
    ///
    /// This is true for `expr` of [swc_ecma_ast::ExprStmt], `test` of
    /// [swc_ecma_ast::IfStmt], and more like that.
    pub in_first_expr: bool,
}

impl<'b> Pure<'b> {
    /// RAII guard to change context temporarically
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<'_, 'b> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            pass: self,
            orig_ctx,
        }
    }
}

pub(super) struct WithCtx<'a, 'b> {
    pass: &'a mut Pure<'b>,
    orig_ctx: Ctx,
}

impl<'b> Deref for WithCtx<'_, 'b> {
    type Target = Pure<'b>;

    fn deref(&self) -> &Self::Target {
        self.pass
    }
}

impl DerefMut for WithCtx<'_, '_> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.pass
    }
}

impl Drop for WithCtx<'_, '_> {
    fn drop(&mut self) {
        self.pass.ctx = self.orig_ctx;
    }
}
