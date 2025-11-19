use swc_ecma_ast::*;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_visit::visit_mut_pass;

pub struct TraverseCtx {}

pub fn transform_pass<H: VisitMutHook<TraverseCtx>>(hook: H) -> impl Pass {
    let ctx = TraverseCtx {};

    visit_mut_pass(VisitMutWithHook { hook, context: ctx })
}
