use crate::common::context::Context;

pub struct WithCtx;

impl WithCtx {
    pub(super) fn parse_with<'a, 'w, Parser: super::Parser<'a>, T>(
        inner: &'w mut Parser,
        ctx: Context,
        f: impl FnOnce(&mut Parser) -> T,
    ) -> T {
        let orig_ctx = inner.ctx();
        inner.set_ctx(ctx);
        let result = f(inner);
        inner.set_ctx(orig_ctx);
        result
    }
}
