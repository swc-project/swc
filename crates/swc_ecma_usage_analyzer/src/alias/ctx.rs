use std::ops::{Deref, DerefMut};

use bitflags::bitflags;

use super::InfectionCollector;

impl<'a, 'r> InfectionCollector<'r> {
    pub(super) fn with_ctx(&'a mut self, ctx: Ctx) -> WithCtx<'a, 'r> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;

        WithCtx {
            analyzer: self,
            orig_ctx,
        }
    }
}

bitflags! {
    #[derive(Debug, Default, Clone, Copy)]
    pub struct Ctx: u8 {
        const TrackExprIdent = 1 << 0;
        const IsCallee = 1 << 1;
        const IsPatDecl = 1 << 2;
    }
}

pub(super) struct WithCtx<'a, 'r> {
    analyzer: &'a mut InfectionCollector<'r>,
    orig_ctx: Ctx,
}

impl<'a, 'r> Deref for WithCtx<'a, 'r> {
    type Target = InfectionCollector<'r>;

    fn deref(&self) -> &Self::Target {
        self.analyzer
    }
}

impl<'a, 'r> DerefMut for WithCtx<'a, 'r> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.analyzer
    }
}

impl<'a, 'r> Drop for WithCtx<'a, 'r> {
    fn drop(&mut self) {
        self.analyzer.ctx = self.orig_ctx;
    }
}
