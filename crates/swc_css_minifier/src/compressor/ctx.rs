use std::ops::{Deref, DerefMut};

use super::Compressor;

#[derive(Default, Clone, Copy)]
pub(super) struct Ctx {
    pub in_math_function: bool,

    pub in_logic_combinator_selector: bool,
}

impl Compressor {
    /// RAII guard to change context temporarically
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<'_> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            pass: self,
            orig_ctx,
        }
    }
}

pub(super) struct WithCtx<'a> {
    pass: &'a mut Compressor,
    orig_ctx: Ctx,
}

impl Deref for WithCtx<'_> {
    type Target = Compressor;

    fn deref(&self) -> &Self::Target {
        self.pass
    }
}

impl DerefMut for WithCtx<'_> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.pass
    }
}

impl Drop for WithCtx<'_> {
    fn drop(&mut self) {
        self.pass.ctx = self.orig_ctx;
    }
}
