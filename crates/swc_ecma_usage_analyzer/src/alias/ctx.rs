use std::ops::{Deref, DerefMut};

use super::InfectionCollector;

impl<'a> InfectionCollector<'a> {
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<'_, 'a> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;

        WithCtx {
            analyzer: self,
            orig_ctx,
        }
    }
}

#[derive(Debug, Default, Clone, Copy)]
pub struct Ctx {
    pub track_expr_ident: bool,
    pub is_callee: bool,
}

pub(super) struct WithCtx<'a, 'b> {
    analyzer: &'a mut InfectionCollector<'b>,
    orig_ctx: Ctx,
}

impl<'b> Deref for WithCtx<'_, 'b> {
    type Target = InfectionCollector<'b>;

    fn deref(&self) -> &Self::Target {
        self.analyzer
    }
}

impl DerefMut for WithCtx<'_, '_> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.analyzer
    }
}

impl Drop for WithCtx<'_, '_> {
    fn drop(&mut self) {
        self.analyzer.ctx = self.orig_ctx;
    }
}
