use swc_ecma_ast::*;
use swc_ecma_hooks::{CompositeHook, VisitMutHook, VisitMutWithHook};
use swc_ecma_visit::visit_mut_pass;

pub struct TraverseCtx {}

pub struct Options {
    pub typescript: TypescriptOptions,
    pub decorator: DecoratorOptions,
    pub jsx: JsxOptions,

    pub es2026: Es2026Options,
    pub es2022: Es2022Options,
    pub es2021: ES2021Options,
    pub es2020: ES2020Options,
    pub es2019: ES2019Options,
    pub es2018: ES2018Options,
    pub es2017: ES2017Options,
    pub es2016: ES2016Options,
    pub es2015: ES2015Options,
    pub regexp: RegExpOptions,
    pub common: CommonOptions,
}

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
