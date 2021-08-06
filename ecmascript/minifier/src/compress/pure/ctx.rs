use super::Pure;
use std::ops::{Deref, DerefMut};

#[derive(Default, Clone, Copy)]
pub(super) struct Ctx {
    pub par_depth: u8,

    pub in_delete: bool,

    /// `true` if we are in `arg` of `++arg` or `--arg`.
    pub is_update_arg: bool,

    pub is_callee: bool,

    pub in_try_block: bool,
}

impl<'b> Pure<'b> {
    /// RAII guard to change context temporarically
    #[inline]
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
        &self.pass
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
