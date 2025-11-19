use swc_ecma_hooks::VisitMutHook;

pub struct TraverseCtx {}

pub struct Transformer {}

struct TransformerImpl<H: VisitMutHook<TraverseCtx>> {
    hook: H,
}
