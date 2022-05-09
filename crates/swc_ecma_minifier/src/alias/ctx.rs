use std::ops::{Deref, DerefMut};

use super::InfectionCollector;

#[derive(Debug)]
pub(super) struct Ctx {}

pub(super) struct WithCtx<'a, 'b> {
    analyzer: &'a mut InfectionCollector<'b>,
    orig_ctx: Ctx,
}

impl<'a, 'b> Deref for WithCtx<'a, 'b> {
    type Target = InfectionCollector<'b>;

    fn deref(&self) -> &Self::Target {
        self.analyzer
    }
}

impl<'a, 'b> DerefMut for WithCtx<'a, 'b> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.analyzer
    }
}

impl Drop for WithCtx<'_, '_> {
    fn drop(&mut self) {
        self.analyzer.ctx = self.orig_ctx;
    }
}
