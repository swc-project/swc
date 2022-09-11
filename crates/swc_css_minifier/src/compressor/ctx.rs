use std::ops::{Deref, DerefMut};

use super::Compressor;

#[derive(Clone, Copy)]
pub(super) struct Ctx {
    pub in_math_function: bool,

    pub in_logic_combinator_selector: bool,

    pub in_transform_function: bool,

    pub in_keyframe_block: bool,

    pub preserve_alpha_value: bool,
}
impl Default for Ctx {
    fn default() -> Self {
        Self {
            preserve_alpha_value: true,
            in_math_function: false,
            in_logic_combinator_selector: false,
            in_transform_function: false,
            in_keyframe_block: false,
        }
    }
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
