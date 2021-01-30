use super::UsageAnalyzer;
use std::ops::Deref;
use std::ops::DerefMut;

impl UsageAnalyzer {
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
pub(super) struct Ctx {
    pub in_pat_of_var_decl: bool,
    pub in_pat_of_param: bool,
    pub in_loop: bool,
}

pub(super) struct WithCtx<'a> {
    analyzer: &'a mut UsageAnalyzer,
    orig_ctx: Ctx,
}

impl Deref for WithCtx<'_> {
    type Target = UsageAnalyzer;

    fn deref(&self) -> &Self::Target {
        &self.analyzer
    }
}

impl DerefMut for WithCtx<'_> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.analyzer
    }
}

impl Drop for WithCtx<'_> {
    fn drop(&mut self) {
        self.analyzer.ctx = self.orig_ctx;
    }
}
