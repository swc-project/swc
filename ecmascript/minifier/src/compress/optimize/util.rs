use super::Ctx;
use super::Optimizer;
use std::ops::Deref;
use std::ops::DerefMut;
use swc_common::Mark;
use swc_common::Spanned;

impl Optimizer {
    #[allow(unused)]
    pub(super) fn is_done<N>(&mut self, n: &N) -> bool
    where
        N: Spanned,
    {
        let mut ctxt = n.span().ctxt;
        if ctxt == self.done_ctxt {
            return true;
        }
        loop {
            let mark = ctxt.remove_mark();
            if mark == Mark::root() {
                return false;
            }
            if mark == self.done {
                return true;
            }
        }
    }

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
    reducer: &'a mut Optimizer,
    orig_ctx: Ctx,
}

impl Deref for WithCtx<'_> {
    type Target = Optimizer;

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
