use super::Ctx;
use super::Optimizer;
use std::ops::Deref;
use std::ops::DerefMut;
use swc_common::Mark;
use swc_common::Span;

impl<'b> Optimizer<'b> {
    #[allow(unused)]
    pub(super) fn is_done(&mut self, span: Span) -> bool {
        let mut ctxt = span.ctxt;
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
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<'_, 'b> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            reducer: self,
            orig_ctx,
        }
    }
}

pub(super) struct WithCtx<'a, 'b> {
    reducer: &'a mut Optimizer<'b>,
    orig_ctx: Ctx,
}

impl<'b> Deref for WithCtx<'_, 'b> {
    type Target = Optimizer<'b>;

    fn deref(&self) -> &Self::Target {
        &self.reducer
    }
}

impl DerefMut for WithCtx<'_, '_> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.reducer
    }
}

impl Drop for WithCtx<'_, '_> {
    fn drop(&mut self) {
        self.reducer.ctx = self.orig_ctx;
    }
}
