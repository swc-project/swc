use swc_ecma_hooks::{CompositeHook, VisitMutHook};

use crate::TraverseCtx;

pub(crate) struct OptionalHook<H>(pub Option<H>)
where
    H: VisitMutHook<TraverseCtx>;

impl<H> VisitMutHook<TraverseCtx> for OptionalHook<H>
where
    H: VisitMutHook<TraverseCtx>,
{
    // TODO: Implement lots of hooks, or move it to `swc_ecma_hooks`
}

pub(crate) struct NoopHook;

impl VisitMutHook<TraverseCtx> for NoopHook {}

pub(crate) struct HookBuilder<H>
where
    H: VisitMutHook<TraverseCtx>,
{
    hook: H,
}

impl<H> HookBuilder<H>
where
    H: VisitMutHook<TraverseCtx>,
{
    pub fn new(hook: H) -> Self {
        Self { hook }
    }

    pub fn chain<B>(self, hook: B) -> HookBuilder<impl VisitMutHook<TraverseCtx>>
    where
        B: VisitMutHook<TraverseCtx>,
    {
        HookBuilder {
            hook: CompositeHook {
                first: self.hook,
                second: hook,
            },
        }
    }

    pub fn chain_optional<B>(self, hook: Option<B>) -> HookBuilder<impl VisitMutHook<TraverseCtx>>
    where
        B: VisitMutHook<TraverseCtx>,
    {
        self.chain(OptionalHook(hook))
    }

    pub fn build(self) -> impl VisitMutHook<TraverseCtx> {
        self.hook
    }
}
