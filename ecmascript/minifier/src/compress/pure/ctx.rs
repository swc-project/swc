use super::Pure;
use std::ops::{Deref, DerefMut};

#[derive(Clone, Copy, Default)]
pub(super) struct Ctx {}

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
