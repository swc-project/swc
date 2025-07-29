use super::Pure;

bitflags::bitflags! {
#[derive(Default, Clone, Copy)]
    pub(super) struct Ctx: u8 {
        const IN_DELETE         = 1 << 0;
        /// true if we are in `arg` of `++arg` or `--arg`.
        const IS_UPDATE_ARG     = 1 << 1;
        const IS_CALLEE         = 1 << 2;
        const IN_TRY_BLOCK      = 1 << 3;
        const IS_LHS_OF_ASSIGN  = 1 << 4;
        const PRESERVE_BLOCK    = 1 << 5;
        const IS_LABEL_BODY     = 1 << 6;
        const IN_OPT_CHAIN      = 1 << 7;
    }
}

impl<'b> Pure<'b> {
    pub(super) fn do_inside_of_context<T>(
        &mut self,
        context: Ctx,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let ctx = self.ctx;
        let inserted = ctx.complement().intersection(context);
        if inserted.is_empty() {
            f(self)
        } else {
            self.ctx.insert(inserted);
            let result = f(self);
            self.ctx.remove(inserted);
            result
        }
    }

    pub(super) fn do_outside_of_context<T>(
        &mut self,
        context: Ctx,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let ctx = self.ctx;
        let removed = ctx.intersection(context);
        if !removed.is_empty() {
            self.ctx.remove(removed);
            let result = f(self);
            self.ctx.insert(removed);
            result
        } else {
            f(self)
        }
    }
}
