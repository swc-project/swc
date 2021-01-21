use super::Ctx;
use super::Reducer;
use std::ops::Deref;
use std::ops::DerefMut;

impl Reducer {
    #[inline]
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            reducer: self,
            orig_ctx,
        }
    }
}

pub(super) struct WithCtx<'a> {
    reducer: &'a mut Reducer,
    orig_ctx: Ctx,
}

impl Deref for WithCtx<'_> {
    type Target = Reducer;

    fn deref(&self) -> &Self::Target {
        &self.reducer
    }
}

impl DerefMut for WithCtx<'_> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.reducer
    }
}

impl Drop for WithCtx<'_> {
    fn drop(&mut self) {
        self.reducer.ctx = self.orig_ctx;
    }
}
