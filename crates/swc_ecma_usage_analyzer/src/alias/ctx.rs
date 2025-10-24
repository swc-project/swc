use std::ops::{Deref, DerefMut};

use bitflags::bitflags;

use super::InfectionCollector;

impl InfectionCollector {
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<'_> {
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

pub(super) struct WithCtx<'a> {
    analyzer: &'a mut InfectionCollector,
    orig_ctx: Ctx,
}

impl Deref for WithCtx<'_> {
    type Target = InfectionCollector;

    fn deref(&self) -> &Self::Target {
        self.analyzer
    }
}

impl DerefMut for WithCtx<'_> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.analyzer
    }
}

impl Drop for WithCtx<'_> {
    fn drop(&mut self) {
        self.analyzer.ctx = self.orig_ctx;
    }
}
