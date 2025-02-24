use std::ops::{Deref, DerefMut};

use super::InfectionCollector;

impl InfectionCollector {
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx {
        let orig_ctx = self.ctx;
        self.ctx = ctx;

        WithCtx {
            analyzer: self,
            orig_ctx,
        }
    }
}

#[derive(Debug, Default, Clone, Copy)]
pub(crate) struct Ctx {
    pub track_expr_ident: bool,
    pub is_callee: bool,
    pub is_pat_decl: bool,
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
