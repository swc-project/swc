use bitflags::bitflags;

use super::InfectionCollector;

impl InfectionCollector {
    #[inline]
    pub(super) fn do_outside_of_context<T>(
        &mut self,
        context: Ctx,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let removed = self.ctx.intersection(context);
        if !removed.is_empty() {
            self.ctx.remove(removed);
            let result = f(self);
            self.ctx.insert(removed);
            result
        } else {
            f(self)
        }
    }

    #[inline]
    pub(super) fn do_inside_of_context<T>(
        &mut self,
        context: Ctx,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let inserted = self.ctx.complement().intersection(context);
        if inserted.is_empty() {
            f(self)
        } else {
            self.ctx.insert(inserted);
            let result = f(self);
            self.ctx.remove(inserted);
            result
        }
    }
}

bitflags! {
    #[derive(Debug, Default, Clone, Copy)]
    pub(super) struct Ctx: u8 {
        const TrackExprIdent = 1 << 0;
        const IsCallee = 1 << 1;
        const IsPatDecl = 1 << 2;
    }
}
