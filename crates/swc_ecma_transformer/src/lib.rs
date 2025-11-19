use swc_ecma_ast::*;
use swc_ecma_hooks::{CompositeHook, VisitMutHook, VisitMutWithHook};
use swc_ecma_visit::visit_mut_pass;

pub struct TraverseCtx {}

pub struct Options {}

pub fn transform_hook(options: Options) -> impl VisitMutHook<TraverseCtx> {
    let builder = HookBuilder::new(NoopHook);

    builder.build()
}

struct NoopHook;

impl VisitMutHook<TraverseCtx> for NoopHook {}

pub struct HookBuilder<H>
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

    pub fn chain<B>(self, hook: B) -> HookBuilder<CompositeHook<H, B>>
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

    pub fn build(self) -> impl VisitMutHook<TraverseCtx> {
        self.hook
    }
}

pub fn hook_pass<H: VisitMutHook<TraverseCtx>>(hook: H) -> impl Pass {
    let ctx = TraverseCtx {};

    visit_mut_pass(VisitMutWithHook { hook, context: ctx })
}
